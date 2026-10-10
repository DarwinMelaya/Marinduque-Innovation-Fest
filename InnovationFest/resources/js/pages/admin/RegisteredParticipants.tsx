import { Head, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
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
import { index as participantsIndex } from '@/routes/admin/participants';

type Participant = {
    id: number;
    festId: string | null;
    name: string;
    age: number;
    sex: string;
    municipality: string;
    barangay: string;
    affiliation: string | null;
    educationLevel: string | null;
    contactNumber: string;
    email: string;
    sectors: string[];
    daysAttended: number;
    presentToday: boolean;
    registeredAt: string | null;
};

type Filters = {
    search: string;
    municipality: string;
};

type Props = {
    participants: {
        data: Participant[];
        current_page: number;
        last_page: number;
        from: number | null;
        to: number | null;
        total: number;
        prev_page_url: string | null;
        next_page_url: string | null;
    };
    filters: Filters;
    municipalities: string[];
};

const ALL_MUNICIPALITIES = 'all';

const dateFormat = new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium' });

const FIELD_CLASS =
    'h-11 rounded-full border-white/15 bg-neutral-950 text-white focus-visible:border-[#F7B600] focus-visible:ring-[#F7B600]/30 dark:bg-neutral-950 dark:hover:bg-neutral-900';

export default function RegisteredParticipants({
    participants,
    filters,
    municipalities,
}: Props) {
    const [search, setSearch] = useState(filters.search);
    const searchTimeout = useRef<number | undefined>(undefined);

    const applyFilters = (next: Filters) => {
        router.get(
            participantsIndex.url(),
            {
                search: next.search || undefined,
                municipality: next.municipality || undefined,
            },
            { preserveState: true, preserveScroll: true, replace: true },
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

    const handleMunicipalityChange = (value: string) => {
        applyFilters({
            search,
            municipality: value === ALL_MUNICIPALITIES ? '' : value,
        });
    };

    const isFiltered = filters.search !== '' || filters.municipality !== '';
    const emptyMessage = isFiltered
        ? 'No participants match your filters.'
        : 'No participants have registered yet.';

    return (
        <>
            <Head title="Registered Participants" />

            <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:gap-8 lg:p-8">
                <AdminPageHeading
                    eyebrow="Participants"
                    title="Registered participants"
                    description={
                        <>
                            <span className="font-bold text-white tabular-nums">
                                {participants.total.toLocaleString('en-PH')}
                            </span>{' '}
                            {isFiltered ? 'matching' : 'total'}{' '}
                            {participants.total === 1
                                ? 'participant'
                                : 'participants'}
                        </>
                    }
                />

                <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1 sm:max-w-sm">
                        <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-white/50" />
                        <Input
                            type="search"
                            value={search}
                            onChange={(event) =>
                                handleSearchChange(event.target.value)
                            }
                            placeholder="Search name, email, or Fest ID"
                            aria-label="Search participants"
                            className={`pl-10 ${FIELD_CLASS}`}
                        />
                    </div>
                    <Select
                        value={filters.municipality || ALL_MUNICIPALITIES}
                        onValueChange={handleMunicipalityChange}
                    >
                        <SelectTrigger
                            className={`w-full px-4 data-[size=default]:h-11 sm:w-56 ${FIELD_CLASS}`}
                            aria-label="Filter by municipality"
                        >
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-white/10 bg-neutral-950 text-white">
                            <SelectItem value={ALL_MUNICIPALITIES}>
                                All municipalities
                            </SelectItem>
                            {municipalities.map((municipality) => (
                                <SelectItem
                                    key={municipality}
                                    value={municipality}
                                >
                                    {municipality}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {participants.data.length === 0 ? (
                    <p className="rounded-3xl border border-white/10 bg-neutral-950 px-6 py-16 text-center text-white/50">
                        {emptyMessage}
                    </p>
                ) : (
                    <>
                        <ul className="flex flex-col gap-3 md:hidden">
                            {participants.data.map((participant) => (
                                <li key={participant.id}>
                                    <ParticipantCard participant={participant} />
                                </li>
                            ))}
                        </ul>

                        <div className="hidden overflow-x-auto rounded-3xl border border-white/10 bg-neutral-950 md:block">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-white/10 text-xs tracking-[0.2em] text-white/50 uppercase">
                                    <tr>
                                        <th className="px-5 py-4 font-semibold">
                                            Fest ID
                                        </th>
                                        <th className="px-5 py-4 font-semibold">
                                            Participant
                                        </th>
                                        <th className="px-5 py-4 font-semibold">
                                            Address
                                        </th>
                                        <th className="px-5 py-4 font-semibold">
                                            School / Agency
                                        </th>
                                        <th className="px-5 py-4 font-semibold">
                                            Contact
                                        </th>
                                        <th className="px-5 py-4 font-semibold">
                                            Attendance
                                        </th>
                                        <th className="px-5 py-4 font-semibold">
                                            Registered
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {participants.data.map((participant) => (
                                        <tr
                                            key={participant.id}
                                            className="align-top transition-colors hover:bg-white/5"
                                        >
                                            <td className="px-5 py-4 font-mono text-xs whitespace-nowrap text-[#F7B600]">
                                                {participant.festId}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="font-semibold">
                                                    {participant.name}
                                                </div>
                                                <div className="text-white/60">
                                                    {participant.sex},{' '}
                                                    {participant.age}
                                                </div>
                                                <SectorTags
                                                    sectors={participant.sectors}
                                                />
                                            </td>
                                            <td className="px-5 py-4">
                                                <div>{participant.barangay}</div>
                                                <div className="text-white/60">
                                                    {participant.municipality}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div>
                                                    {participant.affiliation ??
                                                        '—'}
                                                </div>
                                                {participant.educationLevel && (
                                                    <div className="text-white/60">
                                                        {
                                                            participant.educationLevel
                                                        }
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="whitespace-nowrap">
                                                    {participant.contactNumber}
                                                </div>
                                                <div className="break-all text-white/60">
                                                    {participant.email}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 whitespace-nowrap">
                                                <AttendanceBadge
                                                    participant={participant}
                                                />
                                            </td>
                                            <td className="px-5 py-4 whitespace-nowrap text-white/60">
                                                {formatDate(
                                                    participant.registeredAt,
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {participants.last_page > 1 && (
                    <div className="flex flex-col items-center justify-between gap-4 text-sm sm:flex-row">
                        <p className="text-white/60">
                            Showing {participants.from}–{participants.to} of{' '}
                            {participants.total.toLocaleString('en-PH')}
                        </p>
                        <div className="flex gap-2">
                            <PageLink
                                href={participants.prev_page_url}
                                label="Previous"
                            >
                                <ChevronLeft className="size-4" />
                                Previous
                            </PageLink>
                            <PageLink
                                href={participants.next_page_url}
                                label="Next"
                            >
                                Next
                                <ChevronRight className="size-4" />
                            </PageLink>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

function formatDate(value: string | null) {
    return value ? dateFormat.format(new Date(value)) : null;
}

function AttendanceBadge({ participant }: { participant: Participant }) {
    return (
        <div className="flex flex-col gap-1">
            <span
                className={`w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    participant.presentToday
                        ? 'bg-[#229D1C]/20 text-[#6FD66A]'
                        : 'bg-white/10 text-white/50'
                }`}
            >
                {participant.presentToday ? 'Present today' : 'Not yet today'}
            </span>
            <span className="text-xs text-white/50">
                {participant.daysAttended}{' '}
                {participant.daysAttended === 1 ? 'day' : 'days'} attended
            </span>
        </div>
    );
}

function SectorTags({ sectors }: { sectors: string[] }) {
    if (sectors.length === 0) {
        return null;
    }

    return (
        <div className="mt-2 flex flex-wrap gap-1.5">
            {sectors.map((sector) => (
                <span
                    key={sector}
                    className="rounded-full border border-[#F7B600]/30 bg-[#F7B600]/10 px-2.5 py-0.5 text-xs font-semibold text-[#F7B600]"
                >
                    {sector}
                </span>
            ))}
        </div>
    );
}

function ParticipantCard({ participant }: { participant: Participant }) {
    const details = [
        {
            label: 'Address',
            value: `${participant.barangay}, ${participant.municipality}`,
        },
        {
            label: 'School / Agency',
            value: [participant.affiliation ?? '—', participant.educationLevel]
                .filter(Boolean)
                .join(' · '),
        },
        { label: 'Contact', value: participant.contactNumber },
        { label: 'Email', value: participant.email },
    ];

    return (
        <article className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-neutral-950 p-5">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <h2 className="font-bold">{participant.name}</h2>
                    <p className="text-sm text-white/60">
                        {participant.sex}, {participant.age}
                    </p>
                </div>
                {participant.festId && (
                    <span className="shrink-0 rounded-md bg-white/10 px-2 py-1 font-mono text-xs font-bold text-[#F7B600]">
                        {participant.festId}
                    </span>
                )}
            </div>

            <SectorTags sectors={participant.sectors} />
            <AttendanceBadge participant={participant} />

            <dl className="grid gap-3 border-t border-white/10 pt-4 text-sm">
                {details.map(({ label, value }) => (
                    <div key={label} className="grid gap-0.5">
                        <dt className="text-xs font-semibold tracking-[0.2em] text-white/50 uppercase">
                            {label}
                        </dt>
                        <dd className="break-words">{value}</dd>
                    </div>
                ))}
            </dl>

            {participant.registeredAt && (
                <p className="text-xs text-white/50">
                    Registered {formatDate(participant.registeredAt)}
                </p>
            )}
        </article>
    );
}

RegisteredParticipants.layout = {
    breadcrumbs: [
        {
            title: 'Registered Participants',
            href: participantsIndex(),
        },
    ],
};
