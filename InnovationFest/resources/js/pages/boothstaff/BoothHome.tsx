import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import ScanVisitor from '@/components/booth/ScanVisitor';
import AdminPageHeading from '@/components/layout/AdminPageHeading';
import { home } from '@/routes/booth';
import { index as visitsIndex } from '@/routes/booth/visits';
import type { BoothVisit } from '@/types';

type Props = {
    stats: {
        today: number;
        total: number;
    };
    recentVisits: BoothVisit[];
};

const timeFormat = new Intl.DateTimeFormat('en-PH', {
    timeStyle: 'short',
    timeZone: 'Asia/Manila',
});

const BoothHome = ({ stats, recentVisits }: Props) => {
    const { user } = usePage().props.auth;

    return (
        <>
            <Head title="Booth" />

            <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
                <AdminPageHeading
                    eyebrow="Booth"
                    title={user.booth_name ?? 'My booth'}
                    description={`Welcome, ${user.name}.`}
                />

                <ScanVisitor />

                <div className="grid grid-cols-2 gap-3 sm:max-w-md">
                    <div className="rounded-3xl border border-white/10 bg-neutral-950 p-5">
                        <p className="text-xs font-semibold tracking-[0.2em] text-white/50 uppercase">
                            Today
                        </p>
                        <p className="mt-2 text-4xl font-black text-[#F7B600]">
                            {stats.today}
                        </p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-neutral-950 p-5">
                        <p className="text-xs font-semibold tracking-[0.2em] text-white/50 uppercase">
                            All days
                        </p>
                        <p className="mt-2 text-4xl font-black">
                            {stats.total}
                        </p>
                    </div>
                </div>

                <section className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-neutral-950 p-5">
                    <div className="flex items-center justify-between gap-4">
                        <h2 className="font-bold">Latest visitors today</h2>
                        <Link
                            href={visitsIndex()}
                            prefetch
                            className="flex items-center gap-1 text-sm text-white/60 hover:text-white"
                        >
                            See all
                            <ArrowRight className="size-4" />
                        </Link>
                    </div>

                    {recentVisits.length === 0 ? (
                        <p className="py-6 text-center text-sm text-white/50">
                            No visitors yet today.
                        </p>
                    ) : (
                        <ul className="divide-y divide-white/10">
                            {recentVisits.map((visit) => (
                                <li
                                    key={visit.id}
                                    className="flex items-center justify-between gap-4 py-3"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate font-semibold">
                                            {visit.name}
                                        </p>
                                        <p className="text-sm text-white/50">
                                            {visit.festId}
                                        </p>
                                    </div>
                                    <span className="shrink-0 text-sm text-white/60">
                                        {visit.visitedAt &&
                                            timeFormat.format(
                                                new Date(visit.visitedAt),
                                            )}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </>
    );
};

BoothHome.layout = {
    breadcrumbs: [
        {
            title: 'Home',
            href: home(),
        },
    ],
};

export default BoothHome;
