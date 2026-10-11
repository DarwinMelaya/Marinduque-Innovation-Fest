import { Form, Head } from "@inertiajs/react";
import { Star } from "lucide-react";
import InputError from "@/components/input-error";
import AdminPageHeading from "@/components/layout/AdminPageHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { index as evaluationsIndex, update } from "@/routes/admin/evaluations";
import { update as updateForum } from "@/routes/admin/evaluations/forums";

type Question = {
    key: string;
    label: string;
    type: "choice" | "rating";
};

type Evaluation = {
    id: number;
    festId: string | null;
    name: string;
    average: number;
    answers: Record<string, string | number>;
    points: number;
    submittedAt: string | null;
};

type ForumEvaluation = {
    id: number;
    forum: string;
    festId: string | null;
    name: string;
    average: number;
    answers: Record<string, string | number>;
    points: number;
    submittedAt: string | null;
};

type Props = {
    forumPoints: number;
    forumQuestions: Question[];
    forumStats: { forum: string; total: number; average: number }[];
    forumEvaluations: ForumEvaluation[];
    points: number;
    maxPoints: number;
    questions: Question[];
    stats: { total: number; average: number };
    evaluations: Evaluation[];
};

const dateTimeFormat = new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
});

function Stars({ rating }: { rating: number }) {
    return (
        <span
            className="inline-flex gap-0.5"
            role="img"
            aria-label={`${rating} out of 5`}
        >
            {[1, 2, 3, 4, 5].map((value) => (
                <Star
                    key={value}
                    className={`size-4 ${value <= rating ? "fill-[#F7B600] text-[#F7B600]" : "text-white/20"}`}
                />
            ))}
        </span>
    );
}

export default function Evaluations({
    forumPoints,
    forumQuestions,
    forumStats,
    forumEvaluations,
    points,
    maxPoints,
    questions,
    stats,
    evaluations,
}: Props) {
    return (
        <>
            <Head title="Evaluations" />

            <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
                <AdminPageHeading
                    eyebrow="Feedback"
                    title="Evaluations"
                    description="Participants earn points once for completing the overall evaluation"
                />

                <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr]">
                    <section className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-neutral-950 p-6">
                        <h2 className="text-base font-black tracking-tight uppercase">
                            Points reward
                        </h2>
                        <Form
                            {...update.form()}
                            disableWhileProcessing
                            className="flex flex-col gap-3"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <Label htmlFor="points">
                                        Points per completed evaluation
                                    </Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="points"
                                            name="points"
                                            type="number"
                                            required
                                            min={0}
                                            max={maxPoints}
                                            defaultValue={points}
                                            className="h-11 rounded-lg border-white/15 bg-white/5 text-white focus-visible:border-[#F7B600] focus-visible:ring-[#F7B600]/30"
                                        />
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="h-11 rounded-full bg-[#F15E00] px-6 font-bold text-white hover:bg-[#FA0A00]"
                                        >
                                            {processing && <Spinner />}
                                            Save
                                        </Button>
                                    </div>
                                    <InputError message={errors.points} />
                                    <p className="text-xs text-white/50">
                                        Evaluations already submitted keep the
                                        points they earned.
                                    </p>
                                </>
                            )}
                        </Form>
                    </section>

                    <div className="flex flex-col gap-1 rounded-3xl border border-white/10 bg-neutral-950 p-6">
                        <p className="text-4xl font-black tabular-nums">
                            {stats.total}
                        </p>
                        <p className="text-xs font-semibold tracking-[0.2em] text-white/60 uppercase">
                            Submitted
                        </p>
                    </div>
                    <div className="flex flex-col gap-1 rounded-3xl border border-white/10 bg-neutral-950 p-6">
                        <p className="text-4xl font-black tabular-nums">
                            {stats.total > 0 ? stats.average : "—"}
                        </p>
                        <p className="text-xs font-semibold tracking-[0.2em] text-white/60 uppercase">
                            Average rating
                        </p>
                    </div>
                </div>

                <section className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-neutral-950 p-6">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-base font-black tracking-tight uppercase">
                            Forum evaluations
                        </h2>
                        <p className="text-sm text-white/50">
                            Participants scanned by forum staff can evaluate
                            that forum once and earn points.
                        </p>
                    </div>
                    <Form
                        {...updateForum.form()}
                        disableWhileProcessing
                        className="flex max-w-md flex-col gap-3"
                    >
                        {({ processing, errors }) => (
                            <>
                                <Label htmlFor="forum-points">
                                    Points per forum evaluation
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="forum-points"
                                        name="points"
                                        type="number"
                                        required
                                        min={0}
                                        max={maxPoints}
                                        defaultValue={forumPoints}
                                        className="h-11 rounded-lg border-white/15 bg-white/5 text-white focus-visible:border-[#F7B600] focus-visible:ring-[#F7B600]/30"
                                    />
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="h-11 rounded-full bg-[#F15E00] px-6 font-bold text-white hover:bg-[#FA0A00]"
                                    >
                                        {processing && <Spinner />}
                                        Save
                                    </Button>
                                </div>
                                <InputError message={errors.points} />
                            </>
                        )}
                    </Form>

                    {forumStats.length > 0 && (
                        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                            {forumStats.map((stat) => (
                                <li
                                    key={stat.forum}
                                    className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                                >
                                    <span className="truncate font-semibold">
                                        {stat.forum}
                                    </span>
                                    <span className="shrink-0 text-sm text-white/60 tabular-nums">
                                        {stat.total} · {stat.average} / 5
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}

                    {forumEvaluations.length === 0 ? (
                        <p className="py-8 text-center text-white/50">
                            No forum evaluations yet.
                        </p>
                    ) : (
                        <ul className="flex flex-col divide-y divide-white/10">
                            {forumEvaluations.map((evaluation) => (
                                <li
                                    key={evaluation.id}
                                    className="flex flex-col gap-1 py-4"
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <div>
                                            <span className="font-semibold">
                                                {evaluation.name}
                                            </span>{" "}
                                            <span className="font-mono text-xs text-[#F7B600]">
                                                {evaluation.festId}
                                            </span>
                                        </div>
                                        <Stars
                                            rating={Math.round(
                                                evaluation.average,
                                            )}
                                        />
                                    </div>
                                    <p className="text-sm text-[#5CB3FF]">
                                        {evaluation.forum}
                                    </p>
                                    <dl className="grid gap-2 text-sm sm:grid-cols-2">
                                        {forumQuestions.map((question) => (
                                            <div key={question.key}>
                                                <dt className="text-xs text-white/50">
                                                    {question.label}
                                                </dt>
                                                <dd className="font-semibold">
                                                    {evaluation.answers[
                                                        question.key
                                                    ] ?? "—"}
                                                    {question.type ===
                                                        "rating" && " / 5"}
                                                </dd>
                                            </div>
                                        ))}
                                    </dl>
                                    <p className="text-xs text-white/50">
                                        +{evaluation.points} pts
                                        {evaluation.submittedAt &&
                                            ` · ${dateTimeFormat.format(new Date(evaluation.submittedAt))}`}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                {evaluations.length === 0 ? (
                    <p className="rounded-3xl border border-white/10 bg-neutral-950 px-6 py-16 text-center text-white/50">
                        No evaluations yet.
                    </p>
                ) : (
                    <ul className="flex flex-col divide-y divide-white/10 rounded-3xl border border-white/10 bg-neutral-950">
                        {evaluations.map((evaluation) => (
                            <li
                                key={evaluation.id}
                                className="flex flex-col gap-2 p-5"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div>
                                        <span className="font-semibold">
                                            {evaluation.name}
                                        </span>{" "}
                                        <span className="font-mono text-xs text-[#F7B600]">
                                            {evaluation.festId}
                                        </span>
                                    </div>
                                    <Stars
                                        rating={Math.round(evaluation.average)}
                                    />
                                </div>
                                <details className="group text-sm">
                                    <summary className="w-fit cursor-pointer list-none font-semibold text-[#F7B600] [&::-webkit-details-marker]:hidden">
                                        Average {evaluation.average} / 5 ·
                                        <span className="group-open:hidden">
                                            {" "}
                                            View answers
                                        </span>
                                        <span className="hidden group-open:inline">
                                            {" "}
                                            Hide answers
                                        </span>
                                    </summary>
                                    <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                                        {questions.map((question) => (
                                            <div key={question.key}>
                                                <dt className="text-xs text-white/50">
                                                    {question.label}
                                                </dt>
                                                <dd className="font-semibold">
                                                    {evaluation.answers[
                                                        question.key
                                                    ] ?? "—"}
                                                    {question.type ===
                                                        "rating" && " / 5"}
                                                </dd>
                                            </div>
                                        ))}
                                    </dl>
                                </details>
                                <p className="text-xs text-white/50">
                                    +{evaluation.points} pts
                                    {evaluation.submittedAt &&
                                        ` · ${dateTimeFormat.format(new Date(evaluation.submittedAt))}`}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
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
