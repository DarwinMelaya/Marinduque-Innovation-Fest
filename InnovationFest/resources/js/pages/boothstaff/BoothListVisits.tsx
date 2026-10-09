import { Head } from '@inertiajs/react';
import AdminPageHeading from '@/components/layout/AdminPageHeading';
import { visits } from '@/routes/booth';

const BoothListVisits = () => {
    return (
        <>
            <Head title="Visits" />

            <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
                <AdminPageHeading
                    eyebrow="Booth"
                    title="Visits"
                    description="Participants who visited your booth."
                />

                <p className="rounded-3xl border border-white/10 bg-neutral-950 px-6 py-16 text-center text-white/50">
                    No visits recorded yet.
                </p>
            </div>
        </>
    );
};

BoothListVisits.layout = {
    breadcrumbs: [
        {
            title: 'Visits',
            href: visits(),
        },
    ],
};

export default BoothListVisits;
