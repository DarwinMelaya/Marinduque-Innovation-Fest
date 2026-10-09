import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, ClipboardList } from 'lucide-react';
import AdminPageHeading from '@/components/layout/AdminPageHeading';
import { home, visits } from '@/routes/booth';

const BoothHome = () => {
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

                <Link
                    href={visits()}
                    prefetch
                    className="group flex items-center gap-4 rounded-3xl border border-white/10 bg-neutral-950 p-5 transition-colors hover:border-[#F15E00]/60 sm:max-w-md"
                >
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#F15E00]/15 text-[#F15E00]">
                        <ClipboardList className="size-6" />
                    </span>
                    <span className="flex-1">
                        <span className="block font-bold">Visits</span>
                        <span className="block text-sm text-white/60">
                            See who visited your booth.
                        </span>
                    </span>
                    <ArrowRight className="size-5 text-white/50 transition-transform group-hover:translate-x-1 group-hover:text-white" />
                </Link>
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
