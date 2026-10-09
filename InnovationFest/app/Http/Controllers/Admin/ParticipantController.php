<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Participant;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ParticipantController extends Controller
{
    /**
     * List registered participants with search and municipality filters.
     */
    public function index(Request $request): Response
    {
        $municipalities = array_keys(config('marinduque.barangays'));

        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'municipality' => ['nullable', Rule::in($municipalities)],
        ]);

        $participants = Participant::query()
            ->when($filters['search'] ?? null, function (Builder $query, string $search) {
                $query->where(function (Builder $query) use ($search) {
                    $query->where('fest_id', 'like', "%{$search}%")
                        ->orWhere('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($filters['municipality'] ?? null, fn (Builder $query, string $municipality) => $query->where('municipality', $municipality))
            ->latest()
            ->latest('id')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Participant $participant) => [
                'id' => $participant->id,
                'festId' => $participant->fest_id,
                'name' => $participant->fullName(),
                'age' => $participant->age,
                'sex' => $participant->sex,
                'municipality' => $participant->municipality,
                'barangay' => $participant->barangay,
                'affiliation' => $participant->school ?? $participant->agency ?? $participant->organization,
                'educationLevel' => $participant->education_level,
                'contactNumber' => $participant->contact_number,
                'email' => $participant->email,
                'sectors' => array_keys(array_filter([
                    'PWD' => $participant->is_pwd,
                    'IP' => $participant->is_indigenous,
                    'Senior' => $participant->is_senior_citizen,
                    '4Ps' => $participant->is_4ps_member,
                ])),
                'registeredAt' => $participant->created_at?->toIso8601String(),
            ]);

        return Inertia::render('admin/RegisteredParticipants', [
            'participants' => $participants,
            'filters' => [
                'search' => $filters['search'] ?? '',
                'municipality' => $filters['municipality'] ?? '',
            ],
            'municipalities' => $municipalities,
        ]);
    }
}
