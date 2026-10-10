<?php

use App\Models\BonusCode;
use App\Models\BonusCodeBatch;
use App\Models\BoothVisit;
use App\Models\Participant;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('admins can generate a batch of unique bonus codes', function () {
    $this->actingAs(User::factory()->admin()->create())
        ->post(route('admin.qr-codes.store'), [
            'label' => 'Quiz Bee',
            'points' => 50,
            'quantity' => 25,
        ])
        ->assertRedirect(route('admin.qr-codes.index'));

    $batch = BonusCodeBatch::sole();
    expect($batch->label)->toBe('Quiz Bee')
        ->and($batch->points)->toBe(50)
        ->and($batch->codes()->count())->toBe(25)
        ->and($batch->codes()->distinct()->count('code'))->toBe(25)
        ->and($batch->codes()->first()->code)->toStartWith(BonusCode::PREFIX);
});

test('generating codes is validated', function (array $input, string $error) {
    $this->actingAs(User::factory()->admin()->create())
        ->post(route('admin.qr-codes.store'), [
            'label' => 'Quiz Bee',
            'points' => 10,
            'quantity' => 10,
            ...$input,
        ])
        ->assertSessionHasErrors($error);
})->with([
    'no label' => [['label' => ''], 'label'],
    'zero points' => [['points' => 0], 'points'],
    'too many points' => [['points' => User::MAX_SCAN_POINTS + 1], 'points'],
    'zero codes' => [['quantity' => 0], 'quantity'],
    'too many codes' => [['quantity' => BonusCodeBatch::MAX_QUANTITY + 1], 'quantity'],
]);

test('admins see how many codes of each batch were scanned', function () {
    $batch = BonusCodeBatch::factory()->create(['points' => 30]);
    BonusCode::factory()->for($batch, 'batch')->count(3)->create();
    BonusCode::factory()->for($batch, 'batch')->redeemedBy(Participant::factory()->create())->create();

    $this->actingAs(User::factory()->admin()->create())
        ->get(route('admin.qr-codes.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/GenerateQrCode')
            ->where('stats', ['codes' => 4, 'redeemed' => 1, 'points' => 30])
            ->where('batches.0.codes', 4)
            ->where('batches.0.redeemed', 1)
        );
});

test('the print page lists only codes that were not scanned yet', function () {
    $batch = BonusCodeBatch::factory()->create();
    $unscanned = BonusCode::factory()->for($batch, 'batch')->create();
    BonusCode::factory()->for($batch, 'batch')->redeemedBy(Participant::factory()->create())->create();

    $this->actingAs(User::factory()->admin()->create())
        ->get(route('admin.qr-codes.print', $batch))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/PrintQrCodes')
            ->has('codes', 1)
            ->where('codes.0.code', $unscanned->code)
            ->where('codes.0.qr', fn (string $qr) => str_starts_with($qr, 'data:image/svg+xml;base64,'))
        );
});

test('admins can delete a batch with its codes', function () {
    $batch = BonusCodeBatch::factory()->create();
    BonusCode::factory()->for($batch, 'batch')->count(2)->create();

    $this->actingAs(User::factory()->admin()->create())
        ->delete(route('admin.qr-codes.destroy', $batch))
        ->assertRedirect(route('admin.qr-codes.index'));

    expect(BonusCodeBatch::count())->toBe(0)
        ->and(BonusCode::count())->toBe(0);
});

test('non admins can not manage bonus codes', function () {
    $batch = BonusCodeBatch::factory()->create();
    $this->actingAs(User::factory()->staff()->create());

    $this->get(route('admin.qr-codes.index'))->assertForbidden();
    $this->get(route('admin.qr-codes.print', $batch))->assertForbidden();
    $this->post(route('admin.qr-codes.store'), ['label' => 'X', 'points' => 10, 'quantity' => 1])->assertForbidden();
    $this->delete(route('admin.qr-codes.destroy', $batch))->assertForbidden();

    expect(BonusCodeBatch::count())->toBe(1);
});

test('a participant earns the bonus points by scanning a code', function () {
    $participant = Participant::factory()->create();
    $code = BonusCode::factory()
        ->for(BonusCodeBatch::factory()->state(['label' => 'Quiz Bee', 'points' => 40]), 'batch')
        ->create();

    $this->actingAs($participant, 'participant')
        ->post(route('visitor.bonus.store'), ['code' => strtolower($code->code)])
        ->assertRedirect(route('visitor.home'));

    $code->refresh();
    expect($code->participant_id)->toBe($participant->id)
        ->and($code->redeemed_at)->not->toBeNull();

    $this->get(route('visitor.home'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('stats.points', 40)
            ->has('bonuses', 1)
            ->where('bonuses.0.label', 'Quiz Bee')
            ->where('bonuses.0.points', 40)
        );
});

test('a bonus code can only be scanned once', function () {
    $code = BonusCode::factory()->create();
    $first = Participant::factory()->create();
    $second = Participant::factory()->create();

    $this->actingAs($first, 'participant')
        ->post(route('visitor.bonus.store'), ['code' => $code->code])
        ->assertSessionHasNoErrors();

    $this->actingAs($first, 'participant')
        ->post(route('visitor.bonus.store'), ['code' => $code->code])
        ->assertSessionHasErrors(['code' => 'You already scanned this QR code.']);

    $this->actingAs($second, 'participant')
        ->post(route('visitor.bonus.store'), ['code' => $code->code])
        ->assertSessionHasErrors(['code' => 'This QR code was already scanned by someone else.']);

    expect($code->fresh()->participant_id)->toBe($first->id);
});

test('unknown codes are rejected', function () {
    $this->actingAs(Participant::factory()->create(), 'participant')
        ->post(route('visitor.bonus.store'), ['code' => 'MIF2026-00001'])
        ->assertSessionHasErrors(['code' => 'This is not a bonus QR code.']);
});

test('guests can not scan bonus codes', function () {
    $code = BonusCode::factory()->create();

    $this->post(route('visitor.bonus.store'), ['code' => $code->code])
        ->assertRedirect();

    expect($code->fresh()->redeemed_at)->toBeNull();
});

test('bonus points count toward the leaderboard', function () {
    $booth = User::factory()->staff()->create();
    $visitor = Participant::factory()->create();
    BoothVisit::factory()->for($booth, 'booth')->for($visitor)->create(['points' => 10]);

    $bonusOnly = Participant::factory()->create();
    BonusCode::factory()
        ->for(BonusCodeBatch::factory()->state(['points' => 25]), 'batch')
        ->redeemedBy($bonusOnly)
        ->create();
    BonusCode::factory()
        ->for(BonusCodeBatch::factory()->state(['points' => 5]), 'batch')
        ->redeemedBy($visitor)
        ->create();

    $leaders = Participant::query()->rankedByPoints()->get();

    expect($leaders->pluck('id')->all())->toBe([$bonusOnly->id, $visitor->id])
        ->and((int) $leaders[0]->points)->toBe(25)
        ->and((int) $leaders[1]->points)->toBe(15)
        ->and((int) $leaders[1]->visits)->toBe(1);
});
