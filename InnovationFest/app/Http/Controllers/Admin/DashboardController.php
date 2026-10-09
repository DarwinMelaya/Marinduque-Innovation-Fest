<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Participant;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Age brackets as [label, minimum age, maximum age].
     *
     * @var list<array{string, int, int}>
     */
    private const AGE_GROUPS = [
        ['17 & below', 0, 17],
        ['18-24', 18, 24],
        ['25-34', 25, 34],
        ['35-44', 35, 44],
        ['45-59', 45, 59],
        ['60 & above', 60, 255],
    ];

    private const TREND_DAYS = 14;

    /**
     * Show the admin dashboard with registration statistics.
     */
    public function __invoke(): Response
    {
        $total = Participant::count();

        $educationCounts = Participant::query()
            ->selectRaw('education_level, count(*) as total')
            ->whereNotNull('education_level')
            ->groupBy('education_level')
            ->pluck('total', 'education_level');

        $highSchool = (int) ($educationCounts['High School'] ?? 0);
        $college = (int) ($educationCounts['College'] ?? 0);

        $municipalityRows = Participant::query()
            ->selectRaw('municipality, education_level, count(*) as total')
            ->groupBy('municipality', 'education_level')
            ->toBase()
            ->get();

        $sexCounts = Participant::query()
            ->selectRaw('sex, count(*) as total')
            ->groupBy('sex')
            ->pluck('total', 'sex');

        return Inertia::render('admin/AdminDashboard', [
            'stats' => [
                'total' => $total,
                'today' => Participant::whereDate('created_at', today())->count(),
                'lastSevenDays' => Participant::where('created_at', '>=', today()->subDays(6))->count(),
                'students' => $highSchool + $college,
                'averageAge' => round((float) Participant::avg('age'), 1),
                'pwd' => Participant::where('is_pwd', true)->count(),
                'indigenous' => Participant::where('is_indigenous', true)->count(),
                'seniorCitizens' => Participant::where('is_senior_citizen', true)->count(),
                'fourPs' => Participant::where('is_4ps_member', true)->count(),
            ],
            'sexes' => collect(Participant::SEXES)
                ->map(fn (string $sex) => [
                    'name' => $sex,
                    'total' => (int) ($sexCounts[$sex] ?? 0),
                ]),
            'participantTypes' => [
                ['name' => 'High School', 'total' => $highSchool],
                ['name' => 'College', 'total' => $college],
                ['name' => 'Professionals & others', 'total' => $total - $highSchool - $college],
            ],
            'ageGroups' => $this->ageGroups(),
            'dailyRegistrations' => $this->dailyRegistrations(),
            'municipalities' => collect(array_keys(config('marinduque.barangays')))
                ->map(function (string $municipality) use ($municipalityRows) {
                    $rows = $municipalityRows->where('municipality', $municipality);
                    $highSchool = (int) $rows->where('education_level', 'High School')->sum('total');
                    $college = (int) $rows->where('education_level', 'College')->sum('total');
                    $total = (int) $rows->sum('total');

                    return [
                        'name' => $municipality,
                        'total' => $total,
                        'highSchool' => $highSchool,
                        'college' => $college,
                        'others' => $total - $highSchool - $college,
                    ];
                })
                ->values(),
            'topBarangays' => Participant::query()
                ->selectRaw('barangay, municipality, count(*) as total')
                ->groupBy('barangay', 'municipality')
                ->orderByDesc('total')
                ->orderBy('barangay')
                ->limit(5)
                ->toBase()
                ->get()
                ->map(fn (object $row) => [
                    'name' => "{$row->barangay}, {$row->municipality}",
                    'total' => (int) $row->total,
                ]),
            'topSchools' => $this->topValues('school'),
            'topCourses' => $this->topValues('course'),
            'topAgencies' => $this->topValues('coalesce(agency, organization)'),
            'recentParticipants' => Participant::query()
                ->latest()
                ->latest('id')
                ->limit(5)
                ->get()
                ->map(fn (Participant $participant) => [
                    'id' => $participant->id,
                    'festId' => $participant->fest_id,
                    'name' => $participant->fullName(),
                    'municipality' => $participant->municipality,
                    'registeredAt' => $participant->created_at?->toIso8601String(),
                ]),
        ]);
    }

    /**
     * @return list<array{name: string, total: int, male: int, female: int}>
     */
    private function ageGroups(): array
    {
        $ageRows = Participant::query()
            ->selectRaw('age, sex, count(*) as total')
            ->groupBy('age', 'sex')
            ->toBase()
            ->get();

        return array_map(function (array $group) use ($ageRows) {
            $rows = $ageRows->filter(fn (object $row) => $row->age >= $group[1] && $row->age <= $group[2]);

            return [
                'name' => $group[0],
                'total' => (int) $rows->sum('total'),
                'male' => (int) $rows->where('sex', 'Male')->sum('total'),
                'female' => (int) $rows->where('sex', 'Female')->sum('total'),
            ];
        }, self::AGE_GROUPS);
    }

    /**
     * Registrations per day for the trend chart, including days with none.
     *
     * @return list<array{date: string, total: int}>
     */
    private function dailyRegistrations(): array
    {
        $start = today()->subDays(self::TREND_DAYS - 1);

        $counts = Participant::query()
            ->selectRaw('date(created_at) as day, count(*) as total')
            ->where('created_at', '>=', $start)
            ->groupBy('day')
            ->pluck('total', 'day');

        return array_map(function (int $offset) use ($start, $counts) {
            $date = $start->copy()->addDays($offset)->toDateString();

            return ['date' => $date, 'total' => (int) ($counts[$date] ?? 0)];
        }, range(0, self::TREND_DAYS - 1));
    }

    /**
     * Most common non-empty values of a column or SQL expression.
     *
     * @return Collection<int, array{name: string, total: int}>
     */
    private function topValues(string $expression, int $limit = 5): Collection
    {
        return Participant::query()
            ->selectRaw("{$expression} as name, count(*) as total")
            ->whereRaw("nullif(trim({$expression}), '') is not null")
            ->groupByRaw($expression)
            ->orderByDesc('total')
            ->orderBy('name')
            ->limit($limit)
            ->toBase()
            ->get()
            ->map(fn (object $row) => [
                'name' => (string) $row->name,
                'total' => (int) $row->total,
            ]);
    }
}
