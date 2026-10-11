import { Head, Link } from "@inertiajs/react";
import {
    ArrowLeft,
    CalendarDays,
    ExternalLink,
    Mail,
    Medal,
    Phone,
    Plus,
    Trophy,
} from "lucide-react";
import type { ReactNode } from "react";
import Reveal from "@/components/public/Reveal";
import logoIcon from "../../../pictures/Marinduque Innovation Fest 206 logo.png";

export type EventPageData = {
    /** Browser tab title and big heading. */
    title: string;
    tagline: string;
    theme?: string;
    /** Activity summary paragraphs. */
    summary: string[];
    /** Key facts shown as cards (when, where, who...). */
    facts: { label: string; value: string }[];
    /** Registration / submission buttons. */
    links?: { label: string; href: string }[];
    timeline?: { date: string; activity: string }[];
    /** Weighted judging tables. */
    criteria?: {
        title: string;
        rows: { criterion: string; weight: string }[];
    }[];
    prizes?: { award: string; prize: string }[];
    prizeNote?: string;
    /** Q&A blocks; each answer is a paragraph or a bullet list. */
    faqs: { question: string; answer: string[] | { bullets: string[] } }[];
    showContact?: boolean;
};

const BRAND_GRADIENT = "bg-[linear-gradient(to_right,#030209,#3230C1)]";

const CARD =
    "rounded-3xl border border-white/10 bg-neutral-950 transition duration-300 hover:-translate-y-1 hover:border-[#F7B600]/40 hover:shadow-[0_12px_40px_-12px_rgba(247,182,0,0.25)] motion-reduce:transition-none motion-reduce:hover:translate-y-0";

const PLACE_COLORS = ["text-[#F7B600]", "text-[#C9D1D9]", "text-[#F15E00]"];

function Section({
    eyebrow,
    title,
    children,
}: {
    eyebrow: string;
    title: string;
    children: ReactNode;
}) {
    return (
        <section className="flex flex-col gap-8">
            <Reveal className="flex flex-col gap-3">
                <p className="text-sm font-semibold tracking-[0.2em] text-[#F7B600] uppercase">
                    {eyebrow}
                </p>
                <h2 className="text-2xl font-black tracking-tight text-balance uppercase sm:text-4xl">
                    {title}
                </h2>
                <div
                    aria-hidden
                    className={`h-1 w-16 rounded-full ${BRAND_GRADIENT}`}
                />
            </Reveal>
            {children}
        </section>
    );
}

export default function EventPage({ event }: { event: EventPageData }) {
    return (
        <>
            <Head title={event.title} />

            <div className="min-h-screen bg-black text-white antialiased">
                <header className="sticky top-0 z-40 border-b border-white/10 bg-black/90 backdrop-blur">
                    <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
                        <Link
                            href="/"
                            className="flex items-center gap-3 rounded-md focus-visible:ring-2 focus-visible:ring-[#F7B600] focus-visible:outline-none"
                        >
                            <img
                                src={logoIcon}
                                alt=""
                                className="h-10 w-auto"
                            />
                            <span className="text-sm leading-tight font-extrabold tracking-wide uppercase">
                                Marinduque
                                <br />
                                <span className="text-white/60">
                                    Innovation Fest
                                </span>
                            </span>
                        </Link>
                        <Link
                            href="/register"
                            className="rounded-full bg-[#F15E00] px-5 py-2.5 text-sm font-bold tracking-wide uppercase transition hover:scale-105 hover:bg-[#FA0A00] focus-visible:ring-2 focus-visible:ring-[#F7B600] focus-visible:outline-none motion-reduce:transition-none"
                        >
                            Register
                        </Link>
                    </div>
                    <div
                        aria-hidden
                        className={`h-0.5 w-full ${BRAND_GRADIENT}`}
                    />
                </header>

                <main className="flex flex-col gap-24 pb-24">
                    <div className="relative overflow-hidden bg-[linear-gradient(135deg,#030209,#1b1a7a_60%,#3230C1)] py-20 sm:py-28">
                        <img
                            src={logoIcon}
                            alt=""
                            aria-hidden
                            className="pointer-events-none absolute -right-16 -bottom-20 w-96 rotate-[21deg] opacity-10 motion-safe:animate-pulse"
                        />
                        <div
                            aria-hidden
                            className="pointer-events-none absolute -top-24 left-1/3 size-72 rounded-full bg-[#F15E00]/20 blur-3xl"
                        />
                        <div className="relative mx-auto flex max-w-5xl flex-col gap-6 px-6 duration-700 animate-in fade-in slide-in-from-bottom-6">
                            <Link
                                href="/#events"
                                className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-white/70 hover:text-white"
                            >
                                <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                                All major events
                            </Link>
                            <h1 className="text-4xl font-black tracking-tight text-balance uppercase sm:text-6xl lg:text-7xl">
                                {event.title}
                            </h1>
                            <p className="max-w-2xl text-lg text-white/80">
                                {event.tagline}
                            </p>
                            {event.theme && (
                                <p className="w-fit rounded-full border border-[#F7B600]/40 bg-[#F7B600]/10 px-5 py-2 text-base font-bold text-[#F7B600] italic sm:text-lg">
                                    “{event.theme}”
                                </p>
                            )}
                            {event.links && (
                                <div className="flex flex-wrap gap-3 pt-2">
                                    {event.links.map((link, index) => (
                                        <a
                                            key={link.href}
                                            href={link.href}
                                            target="_blank"
                                            rel="noreferrer"
                                            className={`group inline-flex min-h-12 items-center gap-2 rounded-full px-7 text-sm font-bold tracking-wide uppercase transition hover:scale-105 focus-visible:ring-2 focus-visible:ring-[#F7B600] focus-visible:outline-none motion-reduce:transition-none ${
                                                index === 0
                                                    ? "bg-[#F15E00] hover:bg-[#FA0A00]"
                                                    : "border border-white/30 hover:border-white hover:bg-white/10"
                                            }`}
                                        >
                                            {link.label}
                                            <ExternalLink className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mx-auto flex w-full max-w-5xl flex-col gap-24 px-6">
                        <Section eyebrow="Overview" title="Activity summary">
                            <Reveal className="flex flex-col gap-4 text-lg leading-relaxed text-white/75">
                                {event.summary.map((paragraph) => (
                                    <p key={paragraph}>{paragraph}</p>
                                ))}
                            </Reveal>
                            <dl className="grid gap-4 sm:grid-cols-2">
                                {event.facts.map((fact, index) => (
                                    <Reveal key={fact.label} delay={index * 80}>
                                        <div className={`h-full p-6 ${CARD}`}>
                                            <dt className="text-xs font-semibold tracking-[0.2em] text-[#F7B600] uppercase">
                                                {fact.label}
                                            </dt>
                                            <dd className="mt-2 text-lg font-semibold">
                                                {fact.value}
                                            </dd>
                                        </div>
                                    </Reveal>
                                ))}
                            </dl>
                        </Section>

                        {event.timeline && (
                            <Section eyebrow="Timeline" title="Event schedules">
                                <div className="relative flex flex-col gap-4 border-l-2 border-white/10 pl-8">
                                    {event.timeline.map((row, index) => (
                                        <Reveal
                                            key={row.date + row.activity}
                                            delay={index * 70}
                                            direction="left"
                                        >
                                            <div
                                                className={`relative p-5 ${CARD}`}
                                            >
                                                <span
                                                    aria-hidden
                                                    className="absolute top-7 -left-[2.65rem] flex size-4 items-center justify-center rounded-full bg-[#F7B600] ring-4 ring-black"
                                                />
                                                <p className="flex items-center gap-2 font-black text-[#F7B600]">
                                                    <CalendarDays className="size-4" />
                                                    {row.date}
                                                </p>
                                                <p className="mt-1 text-white/80">
                                                    {row.activity}
                                                </p>
                                            </div>
                                        </Reveal>
                                    ))}
                                </div>
                            </Section>
                        )}

                        {event.criteria && (
                            <Section eyebrow="Scoring" title="Judging criteria">
                                <div className="grid gap-4 md:grid-cols-2">
                                    {event.criteria.map((table, index) => (
                                        <Reveal
                                            key={table.title}
                                            delay={index * 100}
                                        >
                                            <div
                                                className={`h-full p-6 ${CARD}`}
                                            >
                                                <h3 className="mb-4 font-black tracking-wide uppercase">
                                                    {table.title}
                                                </h3>
                                                <ul className="flex flex-col gap-4">
                                                    {table.rows.map((row) => (
                                                        <li key={row.criterion}>
                                                            <div className="flex justify-between gap-4 text-sm">
                                                                <span className="text-white/80">
                                                                    {
                                                                        row.criterion
                                                                    }
                                                                </span>
                                                                <span className="font-bold text-[#F7B600] tabular-nums">
                                                                    {row.weight}
                                                                </span>
                                                            </div>
                                                            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                                                                <div
                                                                    className={`h-full rounded-full bg-[linear-gradient(to_right,#F15E00,#F7B600)]`}
                                                                    style={{
                                                                        width: row.weight,
                                                                    }}
                                                                />
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </Reveal>
                                    ))}
                                </div>
                            </Section>
                        )}

                        {event.prizes && (
                            <Section
                                eyebrow="Rewards"
                                title="Prizes and recognition"
                            >
                                <div className="grid gap-4 sm:grid-cols-3">
                                    {event.prizes.map((prize, index) => (
                                        <Reveal
                                            key={prize.award}
                                            delay={index * 100}
                                        >
                                            <div
                                                className={`flex h-full flex-col items-center p-8 text-center ${CARD}`}
                                            >
                                                {index === 0 ? (
                                                    <Trophy
                                                        className={`size-10 ${PLACE_COLORS[0]}`}
                                                    />
                                                ) : (
                                                    <Medal
                                                        className={`size-10 ${PLACE_COLORS[index] ?? PLACE_COLORS[2]}`}
                                                    />
                                                )}
                                                <p className="mt-4 text-4xl font-black text-[#F7B600]">
                                                    {prize.prize}
                                                </p>
                                                <p className="mt-1 text-sm font-semibold tracking-wide text-white/70 uppercase">
                                                    {prize.award}
                                                </p>
                                            </div>
                                        </Reveal>
                                    ))}
                                </div>
                                {event.prizeNote && (
                                    <Reveal className="text-white/70">
                                        {event.prizeNote}
                                    </Reveal>
                                )}
                            </Section>
                        )}

                        <Section eyebrow="FAQs" title="Learn more">
                            <div className="flex flex-col gap-3">
                                {event.faqs.map((faq, index) => (
                                    <Reveal
                                        key={faq.question}
                                        delay={index * 50}
                                    >
                                        <details className="group rounded-2xl border border-white/10 bg-neutral-950 px-6 transition-colors open:border-[#F7B600]/40 hover:border-white/25">
                                            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-bold marker:hidden focus-visible:outline-none [&::-webkit-details-marker]:hidden">
                                                {faq.question}
                                                <Plus className="size-5 shrink-0 text-[#F7B600] transition-transform duration-300 group-open:rotate-45" />
                                            </summary>
                                            <div className="flex flex-col gap-2 pb-5 text-sm leading-relaxed text-white/75 duration-300 animate-in fade-in slide-in-from-top-2">
                                                {Array.isArray(faq.answer) ? (
                                                    faq.answer.map((line) => (
                                                        <p key={line}>{line}</p>
                                                    ))
                                                ) : (
                                                    <ul className="list-disc space-y-1.5 pl-5 marker:text-[#F7B600]">
                                                        {faq.answer.bullets.map(
                                                            (line) => (
                                                                <li key={line}>
                                                                    {line}
                                                                </li>
                                                            ),
                                                        )}
                                                    </ul>
                                                )}
                                            </div>
                                        </details>
                                    </Reveal>
                                ))}
                            </div>
                        </Section>

                        {event.showContact !== false && (
                            <Section
                                eyebrow="Get in touch"
                                title="Contact information"
                            >
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Reveal>
                                        <div
                                            className={`h-full p-6 text-sm ${CARD}`}
                                        >
                                            <p className="font-black uppercase">
                                                DOST Marinduque
                                            </p>
                                            <p className="mt-3 flex items-center gap-2 text-white/80">
                                                <Mail className="size-4 shrink-0 text-[#F7B600]" />
                                                pstc.marinduque@mimaropa.dost.gov.ph
                                            </p>
                                            <p className="mt-2 flex items-center gap-2 text-white/80">
                                                <Phone className="size-4 shrink-0 text-[#F7B600]" />
                                                (042) 332-0302 · 0967 084 7266
                                            </p>
                                        </div>
                                    </Reveal>
                                    <Reveal delay={100}>
                                        <div
                                            className={`h-full p-6 text-sm ${CARD}`}
                                        >
                                            <p className="font-black uppercase">
                                                Marinduque iHUB
                                            </p>
                                            <p className="mt-3 flex items-center gap-2 text-white/80">
                                                <Mail className="size-4 shrink-0 text-[#F7B600]" />
                                                marinduqueihub@gmail.com
                                            </p>
                                            <p className="mt-2 text-white/80">
                                                Event Coordinator: Santy Anthony
                                                J. Jalla · 0954 386 9865
                                            </p>
                                        </div>
                                    </Reveal>
                                </div>
                            </Section>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}
