import { Head, usePage } from "@inertiajs/react";
import AttendanceScanner from "@/components/attendance/AttendanceScanner";
import AdminPageHeading from "@/components/layout/AdminPageHeading";
import { checkIn, home } from "@/routes/attendance";

type Props = {
    stats: {
        presentToday: number;
    };
};

export default function AttendanceHome({ stats }: Props) {
    const { user } = usePage().props.auth;

    return (
        <>
            <Head title="Attendance" />

            <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
                <AdminPageHeading
                    eyebrow="Attendance"
                    title={user.booth_name ?? "Check-in"}
                    description={`Welcome, ${user.name}. Scan each participant once per day.`}
                />

                <div className="grid gap-6 lg:grid-cols-[minmax(0,28rem)_1fr] lg:items-start">
                    <div className="rounded-3xl border border-white/10 bg-neutral-950 p-5">
                        <AttendanceScanner action={checkIn.url()} />
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-neutral-950 p-5 sm:max-w-xs">
                        <p className="text-xs font-semibold tracking-[0.2em] text-white/50 uppercase">
                            Present today
                        </p>
                        <p className="mt-2 text-4xl font-black text-[#F7B600]">
                            {stats.presentToday}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

AttendanceHome.layout = {
    breadcrumbs: [
        {
            title: "Attendance",
            href: home(),
        },
    ],
};
