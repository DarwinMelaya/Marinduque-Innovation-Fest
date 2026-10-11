import { Head, Link, router } from "@inertiajs/react";
import { ArrowLeft, ArrowRight, Check, PartyPopper } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { emojiData } from "liveemoji/dist/emojiData";
import { Spinner } from "@/components/ui/spinner";
import { home } from "@/routes/visitor";

type Question = {
    key: string;
    label: string;
    type: "choice" | "rating" | "text";
    section?: string;
    options?: string[];
};

type Props = {
    title: string;
    submitUrl: string;
    points: number;
    questions: Question[];
    submitted: { points: number } | null;
};

const FOCUS_RING =
    "focus-visible:ring-2 focus-visible:ring-[#F7B600] focus-visible:outline-none";

const RATINGS = [
    { value: "1", icon: "LoudlyCryingFace", label: "Very unsatisfied" },
    { value: "2", icon: "SlightlyFrowningFace", label: "Unsatisfied" },
    { value: "3", icon: "NeutralFace", label: "Okay" },
    { value: "4", icon: "SlightlySmilingFace", label: "Satisfied" },
    { value: "5", icon: "StarStruck", label: "Very satisfied" },
] as const;

/** Short pause so the user sees their pick before the next question slides in. */
const ADVANCE_MS = 280;

function Thanks({ points }: { points: number }) {
    return (
        <section className="flex flex-col items-center gap-4 rounded-3xl border border-[#229D1C]/40 bg-[#229D1C]/10 p-8 text-center duration-500 animate-in fade-in zoom-in-95">
            <PartyPopper className="size-14 text-[#F7B600] motion-safe:animate-bounce" />
            <h1 className="text-3xl font-black tracking-tight">Thank you!</h1>
            <p className="text-white/75">
                We appreciate your feedback. It helps us make the next
                Marinduque Innovation Fest even better.
            </p>
            <p className="rounded-full bg-[#F7B600]/15 px-5 py-2 text-lg font-bold text-[#F7B600]">
                +{points} points earned
            </p>
            <Link
                href={home()}
                className={`mt-2 inline-flex h-12 items-center justify-center rounded-lg bg-linear-to-r from-[#F15E00] to-[#FF8A3D] px-8 font-semibold text-white hover:brightness-110 ${FOCUS_RING}`}
            >
                Back to my account
            </Link>
        </section>
    );
}

function Survey({
    title,
    submitUrl,
    points,
    questions,
}: Omit<Props, "submitted">) {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const advanceTimer = useRef<number | undefined>(undefined);

    useEffect(() => () => window.clearTimeout(advanceTimer.current), []);

    const question = questions[step];
    const isLast = step === questions.length - 1;
    const answer = answers[question.key];
    const optional = question.type === "text";
    const canContinue = optional || Boolean(answer);
    const progress =
        ((step + (answer || optional ? 1 : 0)) / questions.length) * 100;

    const choose = (value: string) => {
        setError(null);
        setAnswers((current) => ({ ...current, [question.key]: value }));

        window.clearTimeout(advanceTimer.current);

        if (!isLast) {
            advanceTimer.current = window.setTimeout(
                () => setStep((current) => current + 1),
                ADVANCE_MS,
            );
        }
    };

    const goTo = (next: number) => {
        window.clearTimeout(advanceTimer.current);
        setStep(next);
    };

    const submit = () => {
        router.post(
            submitUrl,
            Object.fromEntries(
                Object.entries(answers).filter(([, value]) => value !== ""),
            ),
            {
                preserveScroll: true,
                onStart: () => setProcessing(true),
                onFinish: () => setProcessing(false),
                onError: (errors) => {
                    const firstBad = questions.findIndex(
                        (item) => errors[item.key],
                    );

                    if (firstBad >= 0) {
                        setStep(firstBad);
                    }

                    setError(
                        Object.values(errors)[0] ??
                            "Something went wrong. Please try again.",
                    );
                },
            },
        );
    };

    const options =
        question.type === "rating"
            ? RATINGS
            : (question.options ?? []).map((option) => ({
                  value: option,
                  label: option,
              }));

    return (
        <>
            <div className="flex flex-col gap-1">
                <p className="text-xs font-semibold tracking-[0.2em] text-[#F7B600] uppercase">
                    Feedback · earn +{points} pts
                </p>
                <h1 className="text-3xl font-semibold tracking-tight">
                    {title}
                </h1>
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm text-white/60">
                    <span>
                        Question{" "}
                        <span className="font-bold text-white">{step + 1}</span>{" "}
                        of {questions.length}
                    </span>
                    <span className="tabular-nums">
                        {Math.round(progress)}%
                    </span>
                </div>
                <div
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(progress)}
                    className="h-2 overflow-hidden rounded-full bg-white/10"
                >
                    <div
                        className="h-full rounded-full bg-linear-to-r from-[#F15E00] to-[#F7B600] transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <section
                key={question.key}
                aria-labelledby="question-title"
                className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 duration-300 animate-in fade-in slide-in-from-right-6 sm:p-8"
            >
                <div className="flex flex-col gap-2">
                    {question.section && (
                        <p className="text-xs font-semibold tracking-[0.2em] text-[#5CB3FF] uppercase">
                            {question.section}
                        </p>
                    )}
                    <h2
                        id="question-title"
                        className="text-xl leading-snug font-bold sm:text-2xl"
                    >
                        {question.label}
                    </h2>
                    {question.type === "rating" && (
                        <p className="text-sm text-white/50">
                            Rate 1 lowest - 5 highest
                        </p>
                    )}
                </div>

                {question.type === "text" ? (
                    <textarea
                        aria-labelledby="question-title"
                        rows={6}
                        maxLength={2000}
                        value={answer ?? ""}
                        onChange={(event) =>
                            setAnswers((current) => ({
                                ...current,
                                [question.key]: event.target.value,
                            }))
                        }
                        placeholder="Type your answer here (optional)"
                        className={`w-full resize-none rounded-2xl border border-white/15 bg-white/5 p-4 text-white placeholder:text-white/40 ${FOCUS_RING}`}
                    />
                ) : question.type === "rating" ? (
                    <div
                        role="radiogroup"
                        aria-labelledby="question-title"
                        className="grid grid-cols-5 gap-2"
                    >
                        {RATINGS.map((rating) => {
                            const selected = answer === rating.value;

                            return (
                                <button
                                    key={rating.value}
                                    type="button"
                                    role="radio"
                                    aria-checked={selected}
                                    aria-label={`${rating.value} - ${rating.label}`}
                                    onClick={() => choose(rating.value)}
                                    className={`group flex flex-col items-center gap-1 rounded-2xl border px-1 py-3 transition duration-200 hover:-translate-y-0.5 hover:bg-white/10 motion-reduce:transition-none ${FOCUS_RING} ${
                                        selected
                                            ? "scale-105 border-[#F7B600] bg-[#F7B600]/15"
                                            : "border-white/15 bg-white/5"
                                    }`}
                                >
                                    <span
                                        aria-hidden
                                        style={{
                                            animationDelay: selected
                                                ? undefined
                                                : `${Number(rating.value) * -0.45}s`,
                                        }}
                                        className={`inline-block text-3xl sm:text-4xl motion-reduce:animate-none ${
                                            selected
                                                ? "animate-pop"
                                                : "animate-float group-hover:animate-wiggle"
                                        }`}
                                    >
                                        <img
                                            src={emojiData[rating.icon]}
                                            alt=""
                                            className="inline-block size-11"
                                        />
                                    </span>
                                    <span
                                        className={`text-lg font-black ${selected ? "text-[#F7B600]" : "text-white/70"}`}
                                    >
                                        {rating.value}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <div
                        role="radiogroup"
                        aria-labelledby="question-title"
                        className="flex flex-col gap-2.5"
                    >
                        {options.map((option) => {
                            const selected = answer === option.value;

                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    role="radio"
                                    aria-checked={selected}
                                    onClick={() => choose(option.value)}
                                    className={`flex min-h-14 items-center justify-between gap-3 rounded-2xl border px-5 text-left font-semibold transition duration-200 hover:bg-white/10 motion-reduce:transition-none ${FOCUS_RING} ${
                                        selected
                                            ? "border-[#F7B600] bg-[#F7B600]/15 text-[#F7B600]"
                                            : "border-white/15 bg-white/5"
                                    }`}
                                >
                                    {option.label}
                                    <span
                                        aria-hidden
                                        className={`flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
                                            selected
                                                ? "border-[#F7B600] bg-[#F7B600] text-black"
                                                : "border-white/25"
                                        }`}
                                    >
                                        {selected && (
                                            <Check className="size-4" />
                                        )}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}

                {error && (
                    <p
                        role="alert"
                        className="rounded-xl border border-[#FA0A00]/40 bg-[#FA0A00]/10 px-4 py-3 text-sm"
                    >
                        {error}
                    </p>
                )}

                <div className="flex items-center justify-between gap-3 pt-2">
                    <button
                        type="button"
                        onClick={() => goTo(step - 1)}
                        disabled={step === 0 || processing}
                        className={`inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-white/70 hover:bg-white/10 hover:text-white disabled:invisible ${FOCUS_RING}`}
                    >
                        <ArrowLeft className="size-4" />
                        Back
                    </button>

                    {isLast ? (
                        <button
                            type="button"
                            onClick={submit}
                            disabled={!canContinue || processing}
                            className={`inline-flex h-12 items-center gap-2 rounded-full bg-linear-to-r from-[#F15E00] to-[#FF8A3D] px-7 font-semibold text-white shadow-lg shadow-[#F15E00]/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 ${FOCUS_RING}`}
                        >
                            {processing && <Spinner />}
                            Submit evaluation
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => goTo(step + 1)}
                            disabled={!canContinue}
                            className={`inline-flex h-11 items-center gap-2 rounded-full border border-white/20 px-5 text-sm font-semibold hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40 ${FOCUS_RING}`}
                        >
                            Next
                            <ArrowRight className="size-4" />
                        </button>
                    )}
                </div>
            </section>
        </>
    );
}

const EvaluationFlow = ({
    title,
    submitUrl,
    points,
    questions,
    submitted,
}: Props) => (
    <>
        <Head title={title} />

        <div className="dark relative min-h-svh overflow-hidden bg-[#0B0A0A] px-4 pt-5 pb-12 text-white sm:px-6 sm:pt-8">
            <div
                aria-hidden
                className="pointer-events-none absolute -right-40 bottom-0 size-[30rem] rounded-full bg-[#F15E00]/10 blur-[100px]"
            />

            <div className="relative mx-auto flex w-full max-w-xl flex-col gap-6">
                {!submitted && (
                    <Link
                        href={home()}
                        className={`inline-flex w-fit items-center gap-2 rounded-md text-sm font-semibold text-white/70 hover:text-white ${FOCUS_RING}`}
                    >
                        <ArrowLeft className="size-4" />
                        Back to my account
                    </Link>
                )}

                {submitted ? (
                    <Thanks points={submitted.points} />
                ) : (
                    <Survey
                        title={title}
                        submitUrl={submitUrl}
                        points={points}
                        questions={questions}
                    />
                )}
            </div>
        </div>
    </>
);

export default EvaluationFlow;
