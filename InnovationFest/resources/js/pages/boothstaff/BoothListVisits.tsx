import { Head } from '@inertiajs/react';
import AdminPageHeading from '@/components/layout/AdminPageHeading';
import { index as visitsIndex } from '@/routes/booth/visits';
import type { BoothVisit } from '@/types';

type Props = {
    visits: BoothVisit[];
};

const dateTimeFormat = new Intl.DateTimeFormat('en-PH', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Manila',
});

function formatVisitedAt(visitedAt: string | null) {
    return visitedAt ? dateTimeFormat.format(new Date(visitedAt)) : '';
}

const BoothListVisits = ({ visits }: Props) => {
    return (
        <>
            <Head title="Visits" />

            <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
                <AdminPageHeading
                    eyebrow="Booth"
                    title="Visits"
                    description={`${visits.length} ${visits.length === 1 ? 'visit' : 'visits'} recorded`}
                />

                {visits.length === 0 ? (
                    <p className="rounded-3xl border border-white/10 bg-neutral-950 px-6 py-16 text-center text-white/50">
                        No visits recorded yet.
                    </p>
                ) : (
                    <>
                        <ul className="flex flex-col gap-3 md:hidden">
                            {visits.map((visit) => (
                                <li
                                    key={visit.id}
                                    className="flex flex-col gap-1 rounded-3xl border border-white/10 bg-neutral-950 p-5"
                                >
                                    <p className="font-bold">{visit.name}</p>
                                    <p className="text-sm text-white/60">
                                        {visit.festId} · {visit.municipality}
                                    </p>
                                    <p className="text-sm text-white/50">
                                        {formatVisitedAt(visit.visitedAt)}
                                    </p>
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
                                            Name
                                        </th>
                                        <th className="px-5 py-4 font-semibold">
                                            Municipality
                                        </th>
                                        <th className="px-5 py-4 font-semibold">
                                            Visited
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {visits.map((visit) => (
                                        <tr
                                            key={visit.id}
                                            className="hover:bg-white/5"
                                        >
                                            <td className="px-5 py-4 font-mono text-[#F7B600]">
                                                {visit.festId}
                                            </td>
                                            <td className="px-5 py-4 font-semibold">
                                                {visit.name}
                                            </td>
                                            <td className="px-5 py-4">
                                                {visit.municipality}
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
            </div>
        </>
    );
};

BoothListVisits.layout = {
    breadcrumbs: [
        {
            title: 'Visits',
            href: visitsIndex(),
        },
    ],
};

export default BoothListVisits;
