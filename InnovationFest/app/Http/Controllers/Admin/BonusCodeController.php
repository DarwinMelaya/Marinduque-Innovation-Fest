<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BonusCodeBatch;
use App\Models\User;
use App\Support\FestQrCode;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class BonusCodeController extends Controller
{
    /**
     * List the bonus QR code batches and how many of each have been scanned.
     */
    public function index(): Response
    {
        $batches = BonusCodeBatch::query()
            ->withCount([
                'codes',
                'codes as redeemed_count' => fn (Builder $query) => $query->whereNotNull('redeemed_at'),
            ])
            ->latest()
            ->latest('id')
            ->get();

        return Inertia::render('admin/GenerateQrCode', [
            'stats' => [
                'codes' => (int) $batches->sum('codes_count'),
                'redeemed' => (int) $batches->sum('redeemed_count'),
                'points' => (int) $batches->sum(fn (BonusCodeBatch $batch) => $batch->points * $batch->redeemed_count),
            ],
            'batches' => $batches->map(fn (BonusCodeBatch $batch) => [
                'id' => $batch->id,
                'label' => $batch->label,
                'points' => $batch->points,
                'codes' => $batch->codes_count,
                'redeemed' => $batch->redeemed_count,
                'createdAt' => $batch->created_at?->toIso8601String(),
            ]),
            'maxQuantity' => BonusCodeBatch::MAX_QUANTITY,
            'maxPoints' => User::MAX_SCAN_POINTS,
        ]);
    }

    /**
     * Generate a batch of single-use bonus QR codes.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'label' => ['required', 'string', 'max:100'],
            'points' => ['required', 'integer', 'min:1', 'max:'.User::MAX_SCAN_POINTS],
            'quantity' => ['required', 'integer', 'min:1', 'max:'.BonusCodeBatch::MAX_QUANTITY],
        ]);

        DB::transaction(function () use ($validated) {
            BonusCodeBatch::create($validated)->generateCodes($validated['quantity']);
        });

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "Generated {$validated['quantity']} QR codes worth {$validated['points']} points each.",
        ]);

        return to_route('admin.qr-codes.index');
    }

    /**
     * Show the batch's unscanned codes laid out on A4 pages for printing.
     */
    public function print(BonusCodeBatch $batch): Response
    {
        $codes = $batch->codes()
            ->whereNull('redeemed_at')
            ->orderBy('id')
            ->pluck('code');

        return Inertia::render('admin/PrintQrCodes', [
            'batch' => [
                'id' => $batch->id,
                'label' => $batch->label,
                'points' => $batch->points,
            ],
            'codes' => $codes->map(fn (string $code) => [
                'code' => $code,
                'qr' => 'data:image/svg+xml;base64,'.base64_encode(FestQrCode::svg($code)),
            ]),
            'logoRatio' => $codes->isEmpty() ? 0 : FestQrCode::logoRatio($codes->first()),
        ]);
    }

    /**
     * Delete a batch and its codes. Participants lose the points from codes they already scanned.
     */
    public function destroy(BonusCodeBatch $batch): RedirectResponse
    {
        $batch->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "Deleted \"{$batch->label}\" QR codes.",
        ]);

        return to_route('admin.qr-codes.index');
    }
}
