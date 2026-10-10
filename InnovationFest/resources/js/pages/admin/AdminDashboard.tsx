import { Head, Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import {
    CHART_COLORS,
    DonutChart,
    HorizontalBarChart,
    StackedBarChart,
    TrendChart,
} from '@/components/admin/DashboardCharts';
import type { Datum } from '@/components/admin/DashboardCharts';
import AdminPageHeading from '@/components/layout/AdminPageHeading';
import { dashboard } from '@/routes/admin';
import { index as participantsIndex } from '@/routes/admin/participants';
import { index as visitorsIndex } from '@/routes/admin/visitors';

type Props = {
    stats: {
        total: number;
        today: number;
        lastSevenDays: number;
        students: number;
        averageAge: number;
        pwd: number;
        indigenous: number;
        seniorCitizens: number;
        fourPs: number;
    };
    sexes: Datum[];
    participantTypes: Datum[];
    ageGroups: (Datum & { male: number; female: number })[];
    dailyRegistrations: { date: string; total: number }[];
    municipalities: (Datum & {
        highSchool: number;
        college: number;
        others: number;
    })[];
    topBarangays: Datum[];
    topSchools: Datum[];
    topCourses: Datum[];
    topAgencies: Datum[];
    topEarners: Datum[];
    recentParticipants: {
        id: number;
        festId: string | null;
        name: string;
        municipality: string;
        registeredAt: string | null;
    }[];
};

const SEX_COLORS: Record<string, string> = {
    Male: CHART_COLORS.blue,
    Female: CHART_COLORS.orange,
};

const PARTICIPANT_TYPE_COLORS = [
    CHART_COLORS.yellow,
    CHART_COLORS.green,
    CHART_COLORS.blue,
];

const VIEW_ALL_CLASS =
    'inline-flex min-h-10 items-center gap-2 rounded-full border border-white/25 px-5 text-xs font-bold tracking-wide uppercase hover:border-white hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-[#F7B600] focus-visible:outline-none';

const numberFormat = new Intl.NumberFormat('en-PH');

const dateTimeFormat = new Intl.DateTimeFormat('en-PH', {
    dateStyle: 'medium',
    timeStyle: 'short',
});

const shortDateFormat = new Intl.DateTimeFormat('en-PH', {
    month: 'short',
    day: 'numeric',
});

function StatCard({
    label,
    value,
    className = 'border border-white/10 bg-neutral-950',
}: {
    label: string;
    value: string;
    className?: string;
}) {
    return (
        <div className={`flex flex-col gap-1 rounded-3xl p-6 ${className}`}>
            <p className="text-3xl font-black tracking-tight tabular-nums sm:text-4xl">
                {value}
            </p>
            <p className="text-xs font-semibold tracking-[0.2em] text-white/60 uppercase">
                {label}
            </p>
        </div>
    );
}

function Panel({
    title,
    action,
    className = '',
    children,
}: {
    title: string;
    action?: ReactNode;
    className?: string;
    children: ReactNode;
}) {
    return (
        <section
            className={`flex min-w-0 flex-col gap-6 rounded-3xl border border-white/10 bg-neutral-950 p-6 ${className}`}
        >
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-base font-black tracking-tight uppercase">
                    {title}
                </h2>
                {action}
            </div>
            {children}
        </section>
    );
}

export default function AdminDashboard({
    stats,
    sexes,
    participantTypes,
    ageGroups,
    dailyRegistrations,
    municipalities,
    topBarangays,
    topSchools,
    topCourses,
    topAgencies,
    topEarners,
    recentParticipants,
}: Props) {
    const sectors: Datum[] = [
        { name: 'PWD', total: stats.pwd },
        { name: 'Indigenous peoples', total: stats.indigenous },
        { name: 'Senior citizens', total: stats.seniorCitizens },
        { name: '4Ps members', total: stats.fourPs },
    ];

    let cumulative =
        stats.total -
        dailyRegistrations.reduce((sum, day) => sum + day.total, 0);
    const trend = dailyRegistrations.map((day) => {
        cumulative += day.total;

        return {
            label: shortDateFormat.format(new Date(`${day.date}T00:00:00`)),
            total: day.total,
            cumulative,
        };
    });

    return (
        <>
            <Head title="Admin Dashboard" />

            <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
                <AdminPageHeading eyebrow="Admin" title="Dashboard" />

                <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
                    <StatCard
                        label="Total registered"
                        value={numberFormat.format(stats.total)}
                        className="col-span-2 bg-[#0078D9] lg:col-span-1"
                    />
                    <StatCard
                        label="Today"
                        value={numberFormat.format(stats.today)}
                    />
                    <StatCard
                        label="Last 7 days"
                        value={numberFormat.format(stats.lastSevenDays)}
                    />
                    <StatCard
                        label="Students"
                        value={numberFormat.format(stats.students)}
                    />
                    <StatCard
                        label="Average age"
                        value={stats.total > 0 ? String(stats.averageAge) : '—'}
                    />
                </div>

                <Panel title="Registrations, last 14 days">
                    <TrendChart data={trend} />
                </Panel>

                <Panel
                    title="Top points earners"
                    action={
                        <Link
                            href={visitorsIndex()}
                            className={VIEW_ALL_CLASS}
                        >
                            Leaderboard
                            <ArrowRight className="size-4" />
                        </Link>
                    }
                >
                    <HorizontalBarChart
                        data={topEarners}
                        color={CHART_COLORS.yellow}
                        valueName="Points"
                        emptyText="No one has earned points yet."
                    />
                </Panel>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <Panel title="Sex">
                        <DonutChart
                            data={sexes.map((sex) => ({
                                ...sex,
                                color: SEX_COLORS[sex.name] ?? CHART_COLORS.yellow,
                            }))}
                        />
                    </Panel>
                    <Panel title="Participant type">
                        <DonutChart
                            data={participantTypes.map((type, index) => ({
                                ...type,
                                color: PARTICIPANT_TYPE_COLORS[index],
                            }))}
                        />
                    </Panel>
                    <Panel title="Sectors" className="md:col-span-2 xl:col-span-1">
                        <HorizontalBarChart
                            data={sectors}
                            color={CHART_COLORS.red}
                        />
                    </Panel>
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                    <Panel title="Age group by sex">
                        <StackedBarChart
                            data={ageGroups}
                            series={[
                                {
                                    key: 'male',
                                    name: 'Male',
                                    color: SEX_COLORS.Male,
                                },
                                {
                                    key: 'female',
                                    name: 'Female',
                                    color: SEX_COLORS.Female,
                                },
                            ]}
                        />
                    </Panel>
                    <Panel title="Municipality by participant type">
                        <StackedBarChart
                            data={municipalities}
                            horizontal
                            series={[
                                {
                                    key: 'highSchool',
                                    name: 'High School',
                                    color: PARTICIPANT_TYPE_COLORS[0],
                                },
                                {
                                    key: 'college',
                                    name: 'College',
                                    color: PARTICIPANT_TYPE_COLORS[1],
                                },
                                {
                                    key: 'others',
                                    name: 'Professionals & others',
                                    color: PARTICIPANT_TYPE_COLORS[2],
                                },
                            ]}
                        />
                    </Panel>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Panel title="Top barangays">
                        <HorizontalBarChart
                            data={topBarangays}
                            color={CHART_COLORS.yellow}
                        />
                    </Panel>
                    <Panel title="Top schools">
                        <HorizontalBarChart
                            data={topSchools}
                            color={CHART_COLORS.yellow}
                            emptyText="No students yet."
                        />
                    </Panel>
                    <Panel title="Top courses">
                        <HorizontalBarChart
                            data={topCourses}
                            color={CHART_COLORS.green}
                            emptyText="No college students yet."
                        />
                    </Panel>
                    <Panel title="Top agencies & organizations">
                        <HorizontalBarChart
                            data={topAgencies}
                            color={CHART_COLORS.orange}
                            emptyText="No professionals yet."
                        />
                    </Panel>
                </div>

                <Panel
                    title="Recent registrations"
                    action={
                        <Link
                            href={participantsIndex()}
                            className={VIEW_ALL_CLASS}
                        >
                            View all
                            <ArrowRight className="size-4" />
                        </Link>
                    }
                >
                    {recentParticipants.length === 0 ? (
                        <p className="text-sm text-white/50">
                            No participants have registered yet.
                        </p>
                    ) : (
                        <ul className="flex flex-col divide-y divide-white/10">
                            {recentParticipants.map((participant) => (
                                <li
                                    key={participant.id}
                                    className="flex flex-col gap-1 py-4 text-sm first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                                >
                                    <div className="flex min-w-0 flex-col gap-0.5">
                                        <span className="truncate font-semibold">
                                            {participant.name}
                                        </span>
                                        <span className="truncate text-white/60">
                                            {participant.festId} ·{' '}
                                            {participant.municipality}
                                        </span>
                                    </div>
                                    {participant.registeredAt && (
                                        <span className="shrink-0 text-white/50">
                                            {dateTimeFormat.format(
                                                new Date(
                                                    participant.registeredAt,
                                                ),
                                            )}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </Panel>
            </div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
