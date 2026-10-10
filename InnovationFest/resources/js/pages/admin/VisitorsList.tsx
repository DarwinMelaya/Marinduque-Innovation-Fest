import { Head, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Crown, Medal, Search } from 'lucide-react';
import { useRef, useState } from 'react';
import PageLink from '@/components/admin/PageLink';
import AdminPageHeading from '@/components/layout/AdminPageHeading';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { index as visitorsIndex } from '@/routes/admin/visitors';

type Leader = {
    id: number;
    festId: string | null;
    name: string;
    municipality: string;
    points: number;
    visits: number;
};

type Visit = {
    id: number;
    festId: string | null;
    name: string;
    municipality: string;
    boothName: string;
    points: number;
    visitedAt: string | null;
};

type Filters = {
    search: string;
    booth: string;
};

type Props = {
    stats: {
        visits: number;
        visitors: number;
        points: number;
    };
    leaderboard: Leader[];
    visits: {
        data: Visit[];
        last_page: number;
        from: number | null;
        to: number | null;
        total: number;
        prev_page_url: string | null;
        next_page_url: string | null;
    };
    booths: { id: number; name: string }[];
    filters: Filters;
};

const ALL_BOOTHS = 'all';

const visitedAtFormat = new Intl.DateTimeFormat('en-PH', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Manila',
});

const FIELD_CLASS =
    'h-11 rounded-full border-white/15 bg-neutral-950 text-white focus-visible:border-[#F7B600] focus-visible:ring-[#F7B600]/30 dark:bg-neutral-950 dark:hover:bg-neutral-900';

const CARD_CLASS = 'rounded-3xl border border-white/10 bg-neutral-950';

const LABEL_CLASS =
    'text-xs font-semibold tracking-[0.2em] text-white/50 uppercase';

/** Gold, silver and bronze for the top three. */
const PODIUM = [
    {
        ring: 'border-[#F7B600]/50 bg-[#F7B600]/10',
        badge: 'bg-[#F7B600] text-black',
        text: 'text-[#F7B600]',
    },
    {
        ring: 'border-white/25 bg-white/[0.06]',
        badge: 'bg-neutral-300 text-black',
        text: 'text-neutral-200',
    },
    {
        ring: 'border-[#CD7F32]/45 bg-[#CD7F32]/10',
        badge: 'bg-[#CD7F32] text-black',
        text: 'text-[#E9A46A]',
    },
];

const formatNumber = (value: number) => value.toLocaleString('en-PH');

function formatVisitedAt(value: string | null) {
    return value ? visitedAtFormat.format(new Date(value)) : null;
}

export default function VisitorsList({
    stats,
    leaderboard,
    visits,
    booths,
    filters,
}: Props) {
    const [search, setSearch] = useState(filters.search);
    const searchTimeout = useRef<number | undefined>(undefined);

    const applyFilters = (next: Filters) => {
        router.get(
            visitorsIndex.url(),
            {
                search: next.search || undefined,
                booth: next.booth || undefined,
            },
            {
                only: ['visits', 'filters'],
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
        window.clearTimeout(searchTimeout.current);
        searchTimeout.current = window.setTimeout(
            () => applyFilters({ ...filters, search: value }),
            300,
        );
    };

    const isFiltered = filters.search !== '' || filters.booth !== '';

    return (
        <>
            <Head title="Visitors & Points" />

            <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:gap-8 lg:p-8">
                <AdminPageHeading
                    eyebrow="Visitors"
                    title="Visitors & points"
                    description="Every booth visit and the participants with the most points."
                />

                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: 'Booth visits', value: stats.visits },
                        { label: 'Visitors', value: stats.visitors },
                        {
                            label: 'Points given',
                            value: stats.points,
                            accent: true,
                        },
                    ].map(({ label, value, accent }) => (
                        <div key={label} className={`${CARD_CLASS} p-4 sm:p-5`}>
                            <p className={`${LABEL_CLASS} text-[10px] sm:text-xs`}>
                                {label}
                            </p>
                            <p
                                className={`mt-2 text-2xl font-black sm:text-4xl ${accent ? 'text-[#F7B600]' : ''}`}
                            >
                                {formatNumber(value)}
                            </p>
                        </div>
                    ))}
                </div>

                <Leaderboard leaders={leaderboard} />

                <section
                    aria-labelledby="visit-log-title"
                    className="flex flex-col gap-4"
                >
                    <div className="flex flex-col gap-1">
                        <h2
                            id="visit-log-title"
                            className="text-lg font-bold"
                        >
                            Booth visits
                        </h2>
                        <p className="text-sm text-white/60">
                            <span className="font-bold text-white">
                                {formatNumber(visits.total)}
                            </span>{' '}
                            {isFiltered ? 'matching' : 'total'}{' '}
                            {visits.total === 1 ? 'visit' : 'visits'}
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="relative flex-1 sm:max-w-sm">
                            <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-white/50" />
                            <Input
                                type="search"
                                value={search}
                                onChange={(event) =>
                                    handleSearchChange(event.target.value)
                                }
                                placeholder="Search name or Fest ID"
                                aria-label="Search visitors"
                                className={`pl-10 ${FIELD_CLASS}`}
                            />
                        </div>
                        <Select
                            value={filters.booth || ALL_BOOTHS}
                            onValueChange={(value) =>
                                applyFilters({
                                    search,
                                    booth: value === ALL_BOOTHS ? '' : value,
                                })
                            }
                        >
                            <SelectTrigger
                                className={`w-full px-4 data-[size=default]:h-11 sm:w-60 ${FIELD_CLASS}`}
                                aria-label="Filter by booth"
                            >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="border-white/10 bg-neutral-950 text-white">
                                <SelectItem value={ALL_BOOTHS}>
                                    All booths
                                </SelectItem>
                                {booths.map((booth) => (
                                    <SelectItem
                                        key={booth.id}
                                        value={String(booth.id)}
                                    >
                                        {booth.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {visits.data.length === 0 ? (
                        <p
                            className={`${CARD_CLASS} px-6 py-16 text-center text-white/50`}
                        >
                            {isFiltered
                                ? 'No visits match your filters.'
                                : 'No booth visits yet.'}
                        </p>
                    ) : (
                        <>
                            <ul className="flex flex-col gap-3 md:hidden">
                                {visits.data.map((visit) => (
                                    <li
                                        key={visit.id}
                                        className={`${CARD_CLASS} flex items-start justify-between gap-3 p-5`}
                                    >
                                        <div className="min-w-0">
                                            <p className="font-bold">
                                                {visit.name}
                                            </p>
                                            <p className="text-sm text-white/60">
                                                {visit.festId} ·{' '}
                                                {visit.municipality}
                                            </p>
                                            <p className="mt-2 text-sm">
                                                {visit.boothName}
                                            </p>
                                            <p className="text-xs text-white/50">
                                                {formatVisitedAt(
                                                    visit.visitedAt,
                                                )}
                                            </p>
                                        </div>
                                        <PointsBadge points={visit.points} />
                                    </li>
                                ))}
                            </ul>

                            <div
                                className={`${CARD_CLASS} hidden overflow-x-auto md:block`}
                            >
                                <table className="w-full text-left text-sm">
                                    <thead className="border-b border-white/10 text-xs tracking-[0.2em] text-white/50 uppercase">
                                        <tr>
                                            <th className="px-5 py-4 font-semibold">
                                                Fest ID
                                            </th>
                                            <th className="px-5 py-4 font-semibold">
                                                Visitor
                                            </th>
                                            <th className="px-5 py-4 font-semibold">
                                                Booth
                                            </th>
                                            <th className="px-5 py-4 font-semibold">
                                                Points
                                            </th>
                                            <th className="px-5 py-4 font-semibold">
                                                Visited
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/10">
                                        {visits.data.map((visit) => (
                                            <tr
                                                key={visit.id}
                                                className="transition-colors hover:bg-white/5"
                                            >
                                                <td className="px-5 py-4 font-mono text-xs whitespace-nowrap text-[#F7B600]">
                                                    {visit.festId}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="font-semibold">
                                                        {visit.name}
                                                    </div>
                                                    <div className="text-white/60">
                                                        {visit.municipality}
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4">
                                                    {visit.boothName}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <PointsBadge
                                                        points={visit.points}
                                                    />
                                                </td>
                                                <td className="px-5 py-4 whitespace-nowrap text-white/60">
                                                    {formatVisitedAt(
                                                        visit.visitedAt,
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {visits.last_page > 1 && (
                        <div className="flex flex-col items-center justify-between gap-4 text-sm sm:flex-row">
                            <p className="text-white/60">
                                Showing {visits.from}–{visits.to} of{' '}
                                {formatNumber(visits.total)}
                            </p>
                            <div className="flex gap-2">
                                <PageLink
                                    href={visits.prev_page_url}
                                    label="Previous"
                                >
                                    <ChevronLeft className="size-4" />
                                    Previous
                                </PageLink>
                                <PageLink
                                    href={visits.next_page_url}
                                    label="Next"
                                >
                                    Next
                                    <ChevronRight className="size-4" />
                                </PageLink>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}

function PointsBadge({ points }: { points: number }) {
    return (
        <span className="inline-flex shrink-0 rounded-full bg-[#F7B600]/15 px-3 py-1 text-sm font-bold whitespace-nowrap text-[#F7B600]">
            +{points}
        </span>
    );
}

function Leaderboard({ leaders }: { leaders: Leader[] }) {
    const podium = leaders.slice(0, 3);
    const rest = leaders.slice(3);

    return (
        <section
            aria-labelledby="leaderboard-title"
            className={`${CARD_CLASS} flex flex-col gap-5 p-5 sm:p-6`}
        >
            <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-[#F7B600]/15 text-[#F7B600]">
                    <Crown className="size-5" />
                </span>
                <div>
                    <h2 id="leaderboard-title" className="text-lg font-bold">
                        Top participants
                    </h2>
                    <p className="text-sm text-white/60">
                        Ranked by total points earned.
                    </p>
                </div>
            </div>

            {leaders.length === 0 ? (
                <p className="py-10 text-center text-sm text-white/50">
                    No one has earned points yet.
                </p>
            ) : (
                <>
                    <ol className="grid gap-3 md:grid-cols-3">
                        {podium.map((leader, index) => (
                            <li
                                key={leader.id}
                                className={`flex items-center gap-4 rounded-2xl border p-4 ${PODIUM[index].ring}`}
                            >
                                <span
                                    className={`flex size-11 shrink-0 items-center justify-center rounded-full text-lg font-black ${PODIUM[index].badge}`}
                                    aria-label={`Rank ${index + 1}`}
                                >
                                    {index === 0 ? (
                                        <Crown className="size-5" />
                                    ) : (
                                        <Medal className="size-5" />
                                    )}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-bold">
                                        {leader.name}
                                    </p>
                                    <p className="truncate text-xs text-white/60">
                                        {leader.festId} · {leader.visits}{' '}
                                        {leader.visits === 1
                                            ? 'visit'
                                            : 'visits'}
                                    </p>
                                </div>
                                <p
                                    className={`shrink-0 text-right text-2xl font-black ${PODIUM[index].text}`}
                                >
                                    {formatNumber(leader.points)}
                                    <span className="block text-[10px] font-semibold tracking-[0.2em] text-white/50 uppercase">
                                        pts
                                    </span>
                                </p>
                            </li>
                        ))}
                    </ol>

                    {rest.length > 0 && (
                        <ol start={4} className="divide-y divide-white/10">
                            {rest.map((leader, index) => (
                                <li
                                    key={leader.id}
                                    className="flex items-center gap-4 py-3"
                                >
                                    <span className="w-6 shrink-0 text-center font-bold text-white/50">
                                        {index + 4}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-semibold">
                                            {leader.name}
                                        </p>
                                        <p className="truncate text-xs text-white/50">
                                            {leader.festId} ·{' '}
                                            {leader.municipality}
                                        </p>
                                    </div>
                                    <span className="shrink-0 font-bold text-[#F7B600]">
                                        {formatNumber(leader.points)} pts
                                    </span>
                                </li>
                            ))}
                        </ol>
                    )}
                </>
            )}
        </section>
    );
}

VisitorsList.layout = {
    breadcrumbs: [
        {
            title: 'Visitors & Points',
            href: visitorsIndex(),
        },
    ],
};
