import { Head } from "@inertiajs/react";
import AdminPageHeading from "@/components/layout/AdminPageHeading";
import { index as evaluationsIndex } from "@/routes/admin/evaluations";

export default function Evaluations() {
    return (
        <>
            <Head title="Evaluations" />

            <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
                <AdminPageHeading
                    eyebrow="Feedback"
                    title="Evaluations"
                    description="Participant evaluations of the festival"
                />

                <p className="rounded-3xl border border-white/10 bg-neutral-950 px-6 py-16 text-center text-white/50">
                    No evaluations yet.
                </p>
            </div>
        </>
    );
}

Evaluations.layout = {
    breadcrumbs: [
        {
            title: "Evaluations",
            href: evaluationsIndex(),
        },
    ],
};
