import { Form, Head } from "@inertiajs/react";
import { Star } from "lucide-react";
import { useState } from "react";
import {
    CHART_COLORS,
    ColumnChart,
    DonutChart,
} from "@/components/admin/DashboardCharts";
import type { Datum } from "@/components/admin/DashboardCharts";
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
    type: "choice" | "rating" | "text";
    section?: string;
};

type QuestionAnalytics = Question & {
    total: number;
    average?: number | null;
    counts?: Datum[];
    responses?: string[];
};

type Evaluation = {
    id: number;
    forum: string | null;
    festId: string | null;
    name: string;
    average: number;
    answers: Record<string, string | number>;
    points: number;
    submittedAt: string | null;
};

type Group = {
    points: number;
    questions: Question[];
    analytics: QuestionAnalytics[];
    evaluations: Evaluation[];
};

type Props = {
    maxPoints: number;
    overall: Group & {
        stats: {
            total: number;
            average: number;
            firstTime: number;
            highlyRecommended: number;
        };
    };
    activity: Group & {
        stats: {
            total: number;
            average: number;
            forums: number;
            comments: number;
        };
        forums: { forum: string; total: number; average: number }[];
    };
};

type Tab = "overall" | "activity";

const PALETTE = [
    CHART_COLORS.blue,
    CHART_COLORS.orange,
    CHART_COLORS.green,
    CHART_COLORS.red,
    CHART_COLORS.yellow,
];

const RATING_COLORS = [
    CHART_COLORS.red,
    CHART_COLORS.orange,
    CHART_COLORS.yellow,
    CHART_COLORS.blue,
    CHART_COLORS.green,
];

const CARD = "rounded-3xl border border-white/10 bg-neutral-950";

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

function KpiCard({ label, value }: { label: string; value: string | number }) {
    return (
        <div className={`${CARD} flex flex-col gap-1 p-5`}>
            <p className="text-3xl font-black tabular-nums">{value}</p>
            <p className="text-sm text-white/60">{label}</p>
        </div>
    );
}

function PointsForm({
    form,
    id,
    label,
    points,
    maxPoints,
}: {
    form: ReturnType<typeof update.form>;
    id: string;
    label: string;
    points: number;
    maxPoints: number;
}) {
    return (
        <Form
            {...form}
            disableWhileProcessing
            className={`${CARD} flex flex-col gap-3 p-5 sm:flex-row sm:items-end`}
        >
            {({ processing, errors }) => (
                <>
                    <div className="flex flex-1 flex-col gap-2">
                        <Label htmlFor={id}>{label}</Label>
                        <Input
                            id={id}
                            name="points"
                            type="number"
                            required
                            min={0}
                            max={maxPoints}
                            defaultValue={points}
                            className="h-11 rounded-lg border-white/15 bg-white/5 text-white focus-visible:border-[#F7B600] focus-visible:ring-[#F7B600]/30"
                        />
                        <InputError message={errors.points} />
                    </div>
                    <Button
                        type="submit"
                        disabled={processing}
                        className="h-11 rounded-full bg-[#F15E00] px-6 font-bold text-white hover:bg-[#FA0A00]"
                    >
                        {processing && <Spinner />}
                        Save points
                    </Button>
                </>
            )}
        </Form>
    );
}

function OptionBars({ counts, total }: { counts: Datum[]; total: number }) {
    return (
        <ul className="flex flex-col gap-3">
            {counts.map((item, index) => {
                const percent =
                    total > 0 ? Math.round((item.total / total) * 100) : 0;

                return (
                    <li key={item.name} className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between gap-3 text-sm">
                            <span className="flex min-w-0 items-center gap-2">
                                <span
                                    aria-hidden
                                    className="size-2.5 shrink-0 rounded-full"
                                    style={{
                                        backgroundColor:
                                            PALETTE[index % PALETTE.length],
                                    }}
                                />
                                <span className="truncate text-white/80">
                                    {item.name}
                                </span>
                            </span>
                            <span className="shrink-0 text-xs text-white/60 tabular-nums">
                                <span className="font-bold text-white">
                                    {item.total}
                                </span>{" "}
                                ({percent}%)
                            </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white/10">
                            <div
                                className="h-full rounded-full"
                                style={{
                                    width: `${percent}%`,
                                    backgroundColor:
                                        PALETTE[index % PALETTE.length],
                                }}
                            />
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}

function QuestionCard({ question }: { question: QuestionAnalytics }) {
    const isText = question.type === "text";

    return (
        <article
            className={`${CARD} flex flex-col gap-4 p-5 ${isText ? "sm:col-span-2 xl:col-span-3" : ""}`}
        >
            <header className="flex flex-col gap-1">
                <h3 className="text-sm leading-snug font-bold">
                    {question.label}
                </h3>
                <p className="text-xs text-white/50">
                    {question.total} {isText ? "replies" : "total"}
                    {question.type === "rating" &&
                        question.total > 0 &&
                        ` · avg ${question.average} / 5`}
                </p>
            </header>

            {question.total === 0 ? (
                <p className="py-6 text-sm text-white/50">No answers yet.</p>
            ) : isText ? (
                <ul className="flex max-h-80 flex-col gap-2 overflow-y-auto pr-1">
                    {question.responses?.map((response, index) => (
                        <li
                            key={index}
                            className="rounded-2xl bg-white/5 px-4 py-3 text-sm whitespace-pre-line text-white/80"
                        >
                            {response}
                        </li>
                    ))}
                </ul>
            ) : question.type === "rating" ? (
                <ColumnChart
                    data={question.counts ?? []}
                    colors={RATING_COLORS}
                />
            ) : (question.counts?.length ?? 0) <= 3 ? (
                <DonutChart
                    data={(question.counts ?? []).map((item, index) => ({
                        ...item,
                        color: PALETTE[index % PALETTE.length],
                    }))}
                />
            ) : (
                <OptionBars
                    counts={question.counts ?? []}
                    total={question.total}
                />
            )}
        </article>
    );
}

function Analytics({ analytics }: { analytics: QuestionAnalytics[] }) {
    const sections = analytics.reduce<
        { title: string | null; questions: QuestionAnalytics[] }[]
    >((groups, question) => {
        const title = question.section ?? null;
        const last = groups.at(-1);

        if (last && last.title === title) {
            last.questions.push(question);
        } else {
            groups.push({ title, questions: [question] });
        }

        return groups;
    }, []);

    return (
        <section className="flex flex-col gap-4">
            <h2 className="text-lg font-black tracking-tight">Analytics</h2>

            {sections.map((section, index) => (
                <div key={index} className="flex flex-col gap-3">
                    {section.title && (
                        <h3 className="text-sm font-bold text-white/70">
                            {section.title}
                        </h3>
                    )}
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {section.questions.map((question) => (
                            <QuestionCard
                                key={question.key}
                                question={question}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </section>
    );
}

function Responses({
    questions,
    evaluations,
}: Pick<Group, "questions" | "evaluations">) {
    return (
        <section className="flex flex-col gap-4">
            <h2 className="text-lg font-black tracking-tight">Responses</h2>

            {evaluations.length === 0 ? (
                <p className={`${CARD} px-6 py-16 text-center text-white/50`}>
                    No evaluations yet.
                </p>
            ) : (
                <ul
                    className={`${CARD} flex flex-col divide-y divide-white/10`}
                >
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
                                    {evaluation.forum && (
                                        <p className="text-sm text-[#5CB3FF]">
                                            {evaluation.forum}
                                        </p>
                                    )}
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
                                            <dd className="font-semibold whitespace-pre-line">
                                                {evaluation.answers[
                                                    question.key
                                                ] ?? "—"}
                                                {question.type === "rating" &&
                                                    " / 5"}
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
        </section>
    );
}

export default function Evaluations({ maxPoints, overall, activity }: Props) {
    const [tab, setTab] = useState<Tab>("overall");

    return (
        <>
            <Head title="Evaluations" />

            <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
                <AdminPageHeading
                    eyebrow="Feedback"
                    title="Evaluations"
                    description="Overall festival feedback and per-forum activity evaluations"
                />

                <div
                    role="tablist"
                    aria-label="Evaluation type"
                    className={`${CARD} grid grid-cols-2 gap-1 p-1.5`}
                >
                    {(
                        [
                            ["overall", "Overall", overall.stats.total],
                            ["activity", "Activity", activity.stats.total],
                        ] as const
                    ).map(([value, label, count]) => (
                        <button
                            key={value}
                            type="button"
                            role="tab"
                            aria-selected={tab === value}
                            onClick={() => setTab(value)}
                            className={`h-11 rounded-2xl text-sm font-bold transition-colors focus-visible:ring-2 focus-visible:ring-[#F7B600] focus-visible:outline-none ${
                                tab === value
                                    ? "bg-[#F15E00] text-white"
                                    : "text-white/60 hover:bg-white/5 hover:text-white"
                            }`}
                        >
                            {label}
                            <span className="ml-2 text-xs font-semibold opacity-70 tabular-nums">
                                {count}
                            </span>
                        </button>
                    ))}
                </div>

                {tab === "overall" ? (
                    <div role="tabpanel" className="flex flex-col gap-6">
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            <KpiCard
                                label="Total responses"
                                value={overall.stats.total}
                            />
                            <KpiCard
                                label="Overall satisfaction"
                                value={
                                    overall.stats.total > 0
                                        ? `${overall.stats.average}/5`
                                        : "—"
                                }
                            />
                            <KpiCard
                                label="First-time visitors"
                                value={overall.stats.firstTime}
                            />
                            <KpiCard
                                label="Highly recommended"
                                value={overall.stats.highlyRecommended}
                            />
                        </div>

                        <PointsForm
                            form={update.form()}
                            id="points"
                            label="Points per completed overall evaluation"
                            points={overall.points}
                            maxPoints={maxPoints}
                        />

                        <Analytics analytics={overall.analytics} />
                        <Responses
                            questions={overall.questions}
                            evaluations={overall.evaluations}
                        />
                    </div>
                ) : (
                    <div role="tabpanel" className="flex flex-col gap-6">
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            <KpiCard
                                label="Total responses"
                                value={activity.stats.total}
                            />
                            <KpiCard
                                label="Overall satisfaction"
                                value={
                                    activity.stats.total > 0
                                        ? `${activity.stats.average}/5`
                                        : "—"
                                }
                            />
                            <KpiCard
                                label="Forums evaluated"
                                value={activity.stats.forums}
                            />
                            <KpiCard
                                label="Written comments"
                                value={activity.stats.comments}
                            />
                        </div>

                        <PointsForm
                            form={updateForum.form()}
                            id="forum-points"
                            label="Points per forum evaluation"
                            points={activity.points}
                            maxPoints={maxPoints}
                        />

                        {activity.forums.length > 0 && (
                            <section className="flex flex-col gap-3">
                                <h2 className="text-lg font-black tracking-tight">
                                    By forum
                                </h2>
                                <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                    {activity.forums.map((forum) => (
                                        <li
                                            key={forum.forum}
                                            className={`${CARD} flex items-center justify-between gap-3 px-5 py-4`}
                                        >
                                            <span className="truncate font-semibold">
                                                {forum.forum}
                                            </span>
                                            <span className="shrink-0 text-sm text-white/60 tabular-nums">
                                                {forum.total} · {forum.average}{" "}
                                                / 5
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        <Analytics analytics={activity.analytics} />
                        <Responses
                            questions={activity.questions}
                            evaluations={activity.evaluations}
                        />
                    </div>
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
