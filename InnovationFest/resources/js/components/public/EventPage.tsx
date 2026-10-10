import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, ExternalLink, Mail, Phone } from "lucide-react";
import type { ReactNode } from "react";
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

function Section({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section className="flex flex-col gap-6">
            <h2 className="text-2xl font-black tracking-tight uppercase sm:text-3xl">
                {title}
            </h2>
            {children}
        </section>
    );
}

export default function EventPage({ event }: { event: EventPageData }) {
    return (
        <>
            <Head title={event.title} />

            <div className="min-h-screen bg-black text-white">
                <header className="sticky top-0 z-40 border-b border-white/10 bg-black">
                    <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
                        <Link
                            href="/"
                            className="flex items-center gap-3 rounded-md focus-visible:ring-2 focus-visible:ring-[#F7B600] focus-visible:outline-none"
                        >
                            <img src={logoIcon} alt="" className="h-10 w-auto" />
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
                            className="rounded-full bg-[#F15E00] px-5 py-2.5 text-sm font-bold tracking-wide uppercase hover:bg-[#FA0A00] focus-visible:ring-2 focus-visible:ring-[#F7B600] focus-visible:outline-none"
                        >
                            Register
                        </Link>
                    </div>
                    <div aria-hidden className={`h-0.5 w-full ${BRAND_GRADIENT}`} />
                </header>

                <main className="flex flex-col gap-16 pb-20">
                    <div className={`${BRAND_GRADIENT} py-16 sm:py-24`}>
                        <div className="mx-auto flex max-w-5xl flex-col gap-5 px-6">
                            <Link
                                href="/#events"
                                className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-white/70 hover:text-white"
                            >
                                <ArrowLeft className="size-4" />
                                All major events
                            </Link>
                            <h1 className="text-4xl font-black tracking-tight text-balance uppercase sm:text-6xl">
                                {event.title}
                            </h1>
                            <p className="max-w-2xl text-lg text-white/80">
                                {event.tagline}
                            </p>
                            {event.theme && (
                                <p className="text-xl font-bold text-[#F7B600] italic">
                                    “{event.theme}”
                                </p>
                            )}
                            {event.links && (
                                <div className="flex flex-wrap gap-3 pt-2">
                                    {event.links.map((link) => (
                                        <a
                                            key={link.href}
                                            href={link.href}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 rounded-full bg-[#F15E00] px-6 py-3 text-sm font-bold tracking-wide uppercase hover:bg-[#FA0A00]"
                                        >
                                            {link.label}
                                            <ExternalLink className="size-4" />
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mx-auto flex w-full max-w-5xl flex-col gap-16 px-6">
                        <Section title="Activity summary">
                            <div className="flex flex-col gap-4 text-white/80">
                                {event.summary.map((paragraph) => (
                                    <p key={paragraph}>{paragraph}</p>
                                ))}
                            </div>
                            <dl className="grid gap-4 sm:grid-cols-2">
                                {event.facts.map((fact) => (
                                    <div
                                        key={fact.label}
                                        className="rounded-3xl border border-white/10 bg-neutral-950 p-6"
                                    >
                                        <dt className="text-xs font-semibold tracking-[0.2em] text-[#F7B600] uppercase">
                                            {fact.label}
                                        </dt>
                                        <dd className="mt-2 font-semibold">
                                            {fact.value}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </Section>

                        {event.timeline && (
                            <Section title="Event schedules">
                                <ol className="flex flex-col divide-y divide-white/10 rounded-3xl border border-white/10 bg-neutral-950">
                                    {event.timeline.map((row) => (
                                        <li
                                            key={row.date + row.activity}
                                            className="flex flex-col gap-1 px-6 py-5 sm:flex-row sm:gap-8"
                                        >
                                            <span className="shrink-0 font-black text-[#F7B600] sm:w-56">
                                                {row.date}
                                            </span>
                                            <span className="text-white/80">
                                                {row.activity}
                                            </span>
                                        </li>
                                    ))}
                                </ol>
                            </Section>
                        )}

                        {event.criteria && (
                            <Section title="Judging criteria">
                                <div className="grid gap-4 md:grid-cols-2">
                                    {event.criteria.map((table) => (
                                        <div
                                            key={table.title}
                                            className="rounded-3xl border border-white/10 bg-neutral-950 p-6"
                                        >
                                            <h3 className="mb-4 font-black uppercase">
                                                {table.title}
                                            </h3>
                                            <ul className="flex flex-col divide-y divide-white/10 text-sm">
                                                {table.rows.map((row) => (
                                                    <li
                                                        key={row.criterion}
                                                        className="flex justify-between gap-4 py-2.5"
                                                    >
                                                        <span className="text-white/80">
                                                            {row.criterion}
                                                        </span>
                                                        <span className="font-bold text-[#F7B600] tabular-nums">
                                                            {row.weight}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </Section>
                        )}

                        {event.prizes && (
                            <Section title="Prizes and recognition">
                                <div className="grid gap-4 sm:grid-cols-3">
                                    {event.prizes.map((prize) => (
                                        <div
                                            key={prize.award}
                                            className="rounded-3xl border border-white/10 bg-neutral-950 p-6 text-center"
                                        >
                                            <p className="text-3xl font-black text-[#F7B600]">
                                                {prize.prize}
                                            </p>
                                            <p className="mt-1 text-sm font-semibold tracking-wide text-white/70 uppercase">
                                                {prize.award}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                {event.prizeNote && (
                                    <p className="text-white/70">
                                        {event.prizeNote}
                                    </p>
                                )}
                            </Section>
                        )}

                        <Section title={`Learn more about ${event.title}`}>
                            <div className="flex flex-col gap-3">
                                {event.faqs.map((faq) => (
                                    <details
                                        key={faq.question}
                                        className="group rounded-2xl border border-white/10 bg-neutral-950 px-6 py-4 open:border-[#F7B600]/40"
                                    >
                                        <summary className="cursor-pointer list-none font-bold marker:hidden">
                                            {faq.question}
                                        </summary>
                                        <div className="mt-3 flex flex-col gap-2 text-sm text-white/75">
                                            {Array.isArray(faq.answer) ? (
                                                faq.answer.map((line) => (
                                                    <p key={line}>{line}</p>
                                                ))
                                            ) : (
                                                <ul className="list-disc space-y-1.5 pl-5">
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
                                ))}
                            </div>
                        </Section>

                        {event.showContact !== false && (
                            <Section title="Contact information">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="rounded-3xl border border-white/10 bg-neutral-950 p-6 text-sm">
                                        <p className="font-black uppercase">
                                            DOST Marinduque
                                        </p>
                                        <p className="mt-3 flex items-center gap-2 text-white/80">
                                            <Mail className="size-4 shrink-0" />
                                            pstc.marinduque@mimaropa.dost.gov.ph
                                        </p>
                                        <p className="mt-2 flex items-center gap-2 text-white/80">
                                            <Phone className="size-4 shrink-0" />
                                            (042) 332-0302 · 0967 084 7266
                                        </p>
                                    </div>
                                    <div className="rounded-3xl border border-white/10 bg-neutral-950 p-6 text-sm">
                                        <p className="font-black uppercase">
                                            Marinduque iHUB
                                        </p>
                                        <p className="mt-3 flex items-center gap-2 text-white/80">
                                            <Mail className="size-4 shrink-0" />
                                            marinduqueihub@gmail.com
                                        </p>
                                        <p className="mt-2 text-white/80">
                                            Event Coordinator: Santy Anthony J.
                                            Jalla · 0954 386 9865
                                        </p>
                                    </div>
                                </div>
                            </Section>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}
