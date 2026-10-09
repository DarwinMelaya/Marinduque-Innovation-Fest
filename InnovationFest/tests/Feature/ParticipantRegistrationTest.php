<?php

use App\Mail\ParticipantRegistered;
use App\Models\Participant;
use Illuminate\Support\Facades\Mail;
use Inertia\Testing\AssertableInertia as Assert;

function participantData(array $overrides = []): array
{
    return [
        'first_name' => 'Juan',
        'last_name' => 'Dela Cruz',
        'age' => 21,
        'sex' => 'Male',
        'is_pwd' => '1',
        'is_4ps_member' => '1',
        'municipality' => 'Boac',
        'barangay' => 'Malusak (Pob.)',
        'education_level' => 'College',
        'school' => 'Marinduque State University',
        'course' => 'BS Information Technology',
        'agency' => null,
        'organization' => 'Marinduque State University',
        'contact_number' => '09171234567',
        'email' => 'juan@example.com',
        ...$overrides,
    ];
}

test('registration screen can be rendered', function () {
    $this->get(route('participants.register'))->assertOk();
});

test('participants can register', function () {
    $response = $this->post(route('participants.register.store'), participantData());

    $response->assertRedirect(route('participants.register', absolute: false));

    $participant = Participant::sole();
    $response->assertSessionHas('registered_participant_id', $participant->id);
    expect($participant->first_name)->toBe('Juan')
        ->and($participant->age)->toBe(21)
        ->and($participant->is_pwd)->toBeTrue()
        ->and($participant->is_4ps_member)->toBeTrue()
        ->and($participant->is_indigenous)->toBeFalse()
        ->and($participant->is_senior_citizen)->toBeFalse();
});

test('registered participants get a fest ID, QR code and confirmation email', function () {
    Mail::fake();

    $this->followingRedirects()
        ->post(route('participants.register.store'), participantData())
        ->assertInertia(fn (Assert $page) => $page
            ->component('auth/ParticipantsRegistration')
            ->where('registration.festId', 'MIF2026-'.str_pad((string) Participant::sole()->id, 5, '0', STR_PAD_LEFT))
            ->where('registration.email', 'juan@example.com')
            ->where('registration.qrCode', fn (string $qr) => str_starts_with($qr, 'data:image/png;base64,'))
            ->where('registration.qrTicket', fn (string $ticket) => str_starts_with($ticket, 'data:image/png;base64,'))
            ->where('registration.emailSent', true)
        );

    $participant = Participant::sole();
    expect($participant->fest_id)->toMatch('/^MIF2026-\d{5}$/');

    Mail::assertSent(ParticipantRegistered::class, fn (ParticipantRegistered $mail) => $mail->hasTo('juan@example.com')
        && $mail->participant->is($participant));
});

test('the confirmation email shows the fest ID and attaches the QR code', function () {
    $participant = Participant::factory()->create();

    $mail = new ParticipantRegistered($participant);

    $mail->assertSeeInHtml($participant->fest_id);
    $mail->assertHasAttachedData($participant->qrTicketPng(), "{$participant->fest_id}.png", ['mime' => 'image/png']);
});

test('a mail failure does not lose the registration', function () {
    Mail::shouldReceive('to')->andThrow(new RuntimeException('SMTP down'));

    $this->followingRedirects()
        ->post(route('participants.register.store'), participantData())
        ->assertInertia(fn (Assert $page) => $page
            ->where('registration.festId', Participant::sole()->fest_id)
            ->where('registration.emailSent', false)
        );
});

test('the confirmation email can be resent from the console', function () {
    Mail::fake();
    $participant = Participant::factory()->create();

    $this->artisan('participants:send-qr', ['fest_id' => $participant->fest_id])
        ->assertSuccessful();

    Mail::assertSent(ParticipantRegistered::class, fn (ParticipantRegistered $mail) => $mail->hasTo($participant->email));
});

test('required fields and formats are validated', function () {
    $this->post(route('participants.register.store'), participantData([
        'first_name' => '',
        'sex' => 'Other',
        'contact_number' => '12345',
        'email' => 'not-an-email',
    ]))->assertSessionHasErrors(['first_name', 'sex', 'contact_number', 'email']);

    expect(Participant::count())->toBe(0);
});

test('the barangay must belong to the chosen municipality', function () {
    $this->post(route('participants.register.store'), participantData([
        'municipality' => 'Gasan',
        'barangay' => 'Malusak (Pob.)',
    ]))->assertSessionHasErrors('barangay');

    expect(Participant::count())->toBe(0);
});

test('college students must give a course', function () {
    $this->post(route('participants.register.store'), participantData(['course' => '']))
        ->assertSessionHasErrors('course');
});

test('high school students need a school but no course', function () {
    $this->post(route('participants.register.store'), participantData([
        'education_level' => 'High School',
        'school' => 'Marinduque National High School',
        'course' => 'Should be ignored',
    ]))->assertSessionHasNoErrors();

    $participant = Participant::sole();
    expect($participant->school)->toBe('Marinduque National High School')
        ->and($participant->course)->toBeNull();
});

test('non students need neither school nor course', function () {
    $this->post(route('participants.register.store'), participantData([
        'education_level' => '',
        'school' => '',
        'course' => '',
        'agency' => 'LGU Boac',
    ]))->assertSessionHasNoErrors();

    $participant = Participant::sole();
    expect($participant->education_level)->toBeNull()
        ->and($participant->school)->toBeNull()
        ->and($participant->course)->toBeNull()
        ->and($participant->agency)->toBe('LGU Boac')
        ->and($participant->organization)->toBe('Marinduque State University');
});

test('students have no affiliation saved', function () {
    $this->post(route('participants.register.store'), participantData([
        'agency' => 'LGU Boac',
    ]))->assertSessionHasNoErrors();

    $participant = Participant::sole();
    expect($participant->agency)->toBeNull()
        ->and($participant->organization)->toBeNull();
});

test('an email can only register once', function () {
    Participant::factory()->create(['email' => 'juan@example.com']);

    $this->post(route('participants.register.store'), participantData())
        ->assertSessionHasErrors('email');
});
