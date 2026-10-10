import { Head } from '@inertiajs/react';
import AdminPageHeading from '@/components/layout/AdminPageHeading';
import AddStaff from '@/components/modals/admin/AddStaff';
import DeleteStaff from '@/components/modals/admin/DeleteStaff';
import EditStaff from '@/components/modals/admin/EditStaff';
import { index as staffIndex } from '@/routes/admin/staff';

type Staff = {
    id: number;
    boothName: string;
    name: string;
    password: string;
    scanPoints: number;
    visits: number;
    createdAt: string | null;
};

type Props = {
    staff: Staff[];
};

const dateFormat = new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium' });

export default function RegisteredStaff({ staff }: Props) {
    return (
        <>
            <Head title="Registered Staff" />

            <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <AdminPageHeading
                        eyebrow="Staff"
                        title="Registered staff"
                        description={`${staff.length} ${staff.length === 1 ? 'booth' : 'booths'} · Staff log in with their booth name and password`}
                    />
                    <AddStaff />
                </div>

                {staff.length === 0 ? (
                    <p className="rounded-3xl border border-white/10 bg-neutral-950 px-6 py-16 text-center text-white/50">
                        No staff yet. Add the person manning each booth.
                    </p>
                ) : (
                    <>
                        <ul className="flex flex-col gap-3 md:hidden">
                            {staff.map((member) => (
                                <li
                                    key={member.id}
                                    className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-neutral-950 p-5"
                                >
                                    <div>
                                        <p className="font-bold">
                                            {member.boothName}
                                        </p>
                                        <p className="text-sm text-white/70">
                                            {member.name}
                                        </p>
                                    </div>
                                    <p className="text-sm">
                                        <span className="text-white/50">
                                            Password:{' '}
                                        </span>
                                        <span className="font-mono text-[#F7B600]">
                                            {member.password}
                                        </span>
                                    </p>
                                    <p className="text-sm">
                                        <span className="text-white/50">
                                            Points per scan:{' '}
                                        </span>
                                        <span className="font-bold">
                                            {member.scanPoints}
                                        </span>
                                    </p>
                                    <div className="flex justify-end gap-1 border-t border-white/10 pt-3">
                                        <EditStaff staff={member} />
                                        <DeleteStaff staff={member} />
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="hidden overflow-x-auto rounded-3xl border border-white/10 bg-neutral-950 md:block">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-white/10 text-xs tracking-[0.2em] text-white/50 uppercase">
                                    <tr>
                                        <th className="px-5 py-4 font-semibold">
                                            Booth
                                        </th>
                                        <th className="px-5 py-4 font-semibold">
                                            Staff name
                                        </th>
                                        <th className="px-5 py-4 font-semibold">
                                            Password
                                        </th>
                                        <th className="px-5 py-4 font-semibold">
                                            Points per scan
                                        </th>
                                        <th className="px-5 py-4 font-semibold">
                                            Added
                                        </th>
                                        <th className="px-5 py-4 text-right font-semibold">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {staff.map((member) => (
                                        <tr
                                            key={member.id}
                                            className="hover:bg-white/5"
                                        >
                                            <td className="px-5 py-4 font-semibold">
                                                {member.boothName}
                                            </td>
                                            <td className="px-5 py-4">
                                                {member.name}
                                            </td>
                                            <td className="px-5 py-4 font-mono text-[#F7B600]">
                                                {member.password}
                                            </td>
                                            <td className="px-5 py-4 font-bold tabular-nums">
                                                {member.scanPoints}
                                            </td>
                                            <td className="px-5 py-4 whitespace-nowrap text-white/60">
                                                {member.createdAt &&
                                                    dateFormat.format(
                                                        new Date(
                                                            member.createdAt,
                                                        ),
                                                    )}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex justify-end gap-1">
                                                    <EditStaff staff={member} />
                                                    <DeleteStaff
                                                        staff={member}
                                                    />
                                                </div>
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
}

RegisteredStaff.layout = {
    breadcrumbs: [
        {
            title: 'Registered Staff',
            href: staffIndex(),
        },
    ],
};
