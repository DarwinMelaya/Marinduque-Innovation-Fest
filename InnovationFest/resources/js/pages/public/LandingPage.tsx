import { Head } from "@inertiajs/react";
import {
    ArrowRight,
    Award,
    CalendarDays,
    Facebook,
    Gift,
    ImageIcon,
    Instagram,
    MapPin,
    Menu,
    Mic,
    Plus,
    Users,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import logoIcon from "../../../pictures/Marinduque Innovation Fest 206 logo.png";
import logoName from "../../../pictures/logoname.png";

const EVENT = {
    name: "Marinduque Innovation Fest 2026",
    theme: "From Ideas to Solutions: Connect, Innovate, Transform",
    dates: "October 30-31, 2026",
    startsAt: "2026-10-30T08:00:00+08:00",
    venue: "Marinduque State University",
    organizer: "DOST MIMAROPA – DOST Marinduque",
};

const NAV_LINKS = [
    { label: "Home", href: "#home" },
    { label: "Major Events", href: "#events" },
    { label: "Schedules", href: "#schedule" },
];

const SOCIALS = [
    { label: "Facebook", href: "#", icon: Facebook },
    { label: "Instagram", href: "#", icon: Instagram },
];

const STATS = [
    { value: "10+", label: "Speakers", icon: Mic, color: "text-[#229D1C]" },
    { value: "500+", label: "Attendees", icon: Users, color: "text-[#F7B600]" },
];

const PERKS = [
    {
        title: "Event Swags",
        description:
            "Merch, freebies, and more from our partners and sponsors.",
        icon: Gift,
        color: "text-[#F15E00]",
    },
    {
        title: "Certificate of Attendance",
        description:
            "All attendees will receive their own e-certificate of participation.",
        icon: Award,
        color: "text-[#FA0A00]",
    },
];

type MajorEvent = {
    title: string;
    description: string;
    image?: string;
};

const MAJOR_EVENTS: MajorEvent[] = [
    {
        title: "Launching of Marinduque Innovation Hub (iHUB)",
        description:
            "The official inauguration of the Marinduque iHUB, featuring a Ceremonial Signing of the Memorandum of Understanding (MOU) and Pledge of Commitment with key regional partners and stakeholders.",
    },
    {
        title: "Forums and Panel Discussions",
        description:
            "A series of talks and fireside chats at The Nexus Stage featuring industry experts, researchers, government agencies, and tech organizations discussing technopreneurship, design thinking, robotics, and emerging technologies.",
    },
    {
        title: "Innovation Fest Hackathon",
        description:
            "A two-day collaborative challenge where student teams develop and pitch working tech-business prototypes (apps or websites) addressing local community needs in Marinduque.",
    },
    {
        title: "Idea Pitching Competition",
        description:
            "Student innovators present creative, research-backed solutions and five-slide pitch decks to a panel of judges under the theme “Imagine. Innovate. Impact: Building a Smarter Marinduque”.",
    },
    {
        title: "E-Games Sports Development Challenge",
        description:
            "A student competition where teams design and showcase original skill-based e-sports games centered on local culture, smart cities, and community themes.",
    },
    {
        title: "Kuwentolohiya: Short Video Contest",
        description:
            "A creative short-form storytelling competition exploring the connection between stories (Kuwento), local culture (Kultura), and technology (Teknolohiya).",
    },
    {
        title: "Technology Exhibits, Gamers Den, and Robots Den",
        description:
            "Interactive exhibition spaces featuring robotics demonstrations, playable entries from the game development contest, and technology showcases from partner organizations and local startups.",
    },
    {
        title: "Closing Ceremonies and Awarding",
        description:
            "Official recognition and awarding of prize money, medals, and certificates to winning teams and participating qualifiers across all challenge components.",
    },
];

const EMAIL_LINK_CLASS =
    "font-medium text-white underline decoration-white/30 underline-offset-4 hover:decoration-white";

const FAQS: { question: string; answer: ReactNode }[] = [
    {
        question: "What is the Marinduque Innovation Fest 2026?",
        answer: "The Marinduque Innovation Fest 2026 is a provincial event organized by DOST MIMAROPA - PSTO Marinduque together with partner institutions to showcase local technology, foster student entrepreneurship, and strengthen Marinduque’s innovation ecosystem.",
    },
    {
        question: "When and where will the festival take place?",
        answer: "The festival will take place from October 26 to 30, 2026. Main events, exhibits, and challenge presentations will be held across the Marinduque State University Gymnasium, The Nexus Stage, and the Marinduque Innovation Hub at DOST Marinduque in Boac, Marinduque.",
    },
    {
        question: "Who can attend the event?",
        answer: "The forums, panel discussions, and technology exhibits are open to everyone, including students, teachers, researchers, local entrepreneurs, public officials, and community members. Specific competitions are open to enrolled high school and college student teams in Marinduque.",
    },
    {
        question: "How can I register for the competitions?",
        answer: "Teams must select a designated Team Leader to fill out the official online registration form provided for each specific challenge on or before October 6, 2026. Participants under 18 years old are required to submit a signed Parent/Guardian Consent Form upon registration.",
    },
    {
        question: "Is there a registration fee to participate or attend?",
        answer: "Attendance at the forums, exhibits, and competition showcases is free for the public. Participating teams in the Hackathon are provided with lunch and snacks during competition days, though participants are responsible for their own transportation and accommodation.",
    },
    {
        question:
            "How can our organization become a partner, sponsor, or exhibitor?",
        answer: (
            <>
                The festival welcomes partnerships, sponsorships, and exhibition
                participation from government agencies, academic institutions,
                private tech companies, and local startups. Interested
                organizations can contact the organizers via email at{" "}
                <a
                    href="mailto:pstc.marinduque@mimaropa.dost.gov.ph"
                    className={EMAIL_LINK_CLASS}
                >
                    pstc.marinduque@mimaropa.dost.gov.ph
                </a>{" "}
                or{" "}
                <a
                    href="mailto:marinduqueihub@gmail.com"
                    className={EMAIL_LINK_CLASS}
                >
                    marinduqueihub@gmail.com
                </a>
                , or reach out through the official DOST-Provincial S&T Center
                Marinduque or Marinduque iHub Facebook pages.
            </>
        ),
    },
];

const ORGANIZER_SLOTS = 8;

const BRAND_GRADIENT = "bg-[linear-gradient(to_right,#030209,#3230C1)]";

/** Moves the element at a different speed than the page once its parent scrolls past the top of the viewport. */
function useParallax<T extends HTMLElement>(speed: number) {
    const ref = useRef<T>(null);

    useEffect(() => {
        const el = ref.current;
        const parent = el?.parentElement;
        if (
            !el ||
            !parent ||
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
            return;
        }

        let frame = 0;
        const update = () => {
            frame = 0;
            const top = Math.min(parent.getBoundingClientRect().top, 0);
            el.style.transform = `translate3d(0, ${-top * speed}px, 0)`;
        };
        const schedule = () => {
            if (!frame) frame = requestAnimationFrame(update);
        };

        update();
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("scroll", schedule);
            window.removeEventListener("resize", schedule);
        };
    }, [speed]);

    return ref;
}

function GradientRule({ className = "" }: { className?: string }) {
    return (
        <div
            aria-hidden
            className={`h-1 w-16 rounded-full ${BRAND_GRADIENT} ${className}`}
        />
    );
}

function SectionHeading({
    eyebrow,
    title,
}: {
    eyebrow: string;
    title: string;
}) {
    return (
        <div className="flex flex-col gap-4">
            <p className="text-sm font-semibold tracking-[0.2em] text-[#F7B600] uppercase">
                {eyebrow}
            </p>
            <h2 className="text-3xl font-black tracking-tight text-balance uppercase sm:text-4xl lg:text-5xl">
                {title}
            </h2>
            <GradientRule />
        </div>
    );
}

function Header() {
    return (
        <header className="sticky top-0 z-40 border-b border-white/10 bg-black">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:h-20">
                <a
                    href="#home"
                    className="flex items-center gap-3 rounded-md focus-visible:ring-2 focus-visible:ring-[#F7B600] focus-visible:outline-none"
                >
                    <img
                        src={logoIcon}
                        alt=""
                        className="h-10 w-auto lg:h-12"
                    />
                    <span className="text-sm leading-tight font-extrabold tracking-wide uppercase">
                        Marinduque
                        <br />
                        <span className="text-white/60">Innovation Fest</span>
                    </span>
                </a>

                <nav aria-label="Main" className="hidden lg:block">
                    <ul className="flex items-center gap-1">
                        {NAV_LINKS.map((link) => (
                            <li key={link.href}>
                                <a
                                    href={link.href}
                                    className="rounded-md px-4 py-2 text-sm font-semibold tracking-wide text-white/70 uppercase transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-[#F7B600] focus-visible:outline-none"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="flex items-center gap-2">
                    <a
                        href="#schedule"
                        className="hidden rounded-full bg-[#F15E00] px-5 py-2.5 text-sm font-bold tracking-wide uppercase transition-colors hover:bg-[#FA0A00] focus-visible:ring-2 focus-visible:ring-[#F7B600] focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none sm:inline-flex"
                    >
                        Register
                    </a>

                    <Sheet>
                        <SheetTrigger
                            className="inline-flex size-11 items-center justify-center rounded-md text-white/80 hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-[#F7B600] focus-visible:outline-none lg:hidden"
                            aria-label="Open menu"
                        >
                            <Menu className="size-6" />
                        </SheetTrigger>
                        <SheetContent
                            side="right"
                            className="border-white/10 bg-black text-white"
                        >
                            <SheetTitle className="px-6 pt-6 text-white">
                                Menu
                            </SheetTitle>
                            <nav aria-label="Mobile" className="px-3">
                                <ul className="flex flex-col">
                                    {NAV_LINKS.map((link) => (
                                        <li key={link.href}>
                                            <SheetClose asChild>
                                                <a
                                                    href={link.href}
                                                    className="block rounded-md px-3 py-3 text-base font-semibold tracking-wide uppercase hover:bg-white/10"
                                                >
                                                    {link.label}
                                                </a>
                                            </SheetClose>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                            <div className="mt-auto p-6">
                                <SheetClose asChild>
                                    <a
                                        href="#schedule"
                                        className="flex w-full items-center justify-center rounded-full bg-[#F15E00] px-5 py-3 font-bold tracking-wide uppercase hover:bg-[#FA0A00]"
                                    >
                                        Register
                                    </a>
                                </SheetClose>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
            <div aria-hidden className={`h-0.5 w-full ${BRAND_GRADIENT}`} />
        </header>
    );
}

function getTimeLeft(target: number, now: number) {
    const total = Math.max(target - now, 0);
    return {
        total,
        units: [
            { label: "Days", value: Math.floor(total / 86_400_000) },
            { label: "Hours", value: Math.floor(total / 3_600_000) % 24 },
            { label: "Minutes", value: Math.floor(total / 60_000) % 60 },
            { label: "Seconds", value: Math.floor(total / 1000) % 60 },
        ],
    };
}

function Countdown({ target }: { target: string }) {
    const targetTime = new Date(target).getTime();
    // Starts null so server-rendered HTML matches the first client render.
    const [now, setNow] = useState<number | null>(null);

    useEffect(() => {
        setNow(Date.now());
        const id = window.setInterval(() => setNow(Date.now()), 1000);
        return () => window.clearInterval(id);
    }, []);

    const { total, units } = getTimeLeft(targetTime, now ?? 0);
    if (now !== null && total === 0) return null;

    return (
        <div role="timer" aria-label="Countdown to the festival">
            <p className="text-sm font-semibold tracking-[0.2em] text-[#F7B600] uppercase">
                Festival starts in
            </p>
            <ul className="mt-3 flex gap-6 sm:gap-10">
                {units.map(({ label, value }) => (
                    <li key={label}>
                        <span className="block text-4xl font-black tabular-nums sm:text-5xl">
                            {now === null
                                ? "--"
                                : String(value).padStart(2, "0")}
                        </span>
                        <span className="text-xs font-semibold tracking-wider text-white/50 uppercase">
                            {label}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function Hero() {
    const contentRef = useParallax<HTMLDivElement>(0.12);

    return (
        <section
            id="home"
            className="relative overflow-hidden bg-black scroll-mt-20"
        >
            <div
                ref={contentRef}
                className="mx-auto max-w-7xl px-6 pt-14 pb-28 will-change-transform lg:pt-20 lg:pb-32"
            >
                <p className="text-sm font-semibold tracking-[0.2em] text-white/60 uppercase">
                    {EVENT.organizer} presents
                </p>

                <h1 className="sr-only">{EVENT.name}</h1>
                {/* Pulls the image left by its built-in transparent margin so the artwork lines up with the text. */}
                <div className="mt-6 max-w-4xl">
                    <img
                        src={logoName}
                        alt={`${EVENT.name} — ${EVENT.theme}`}
                        className="-ml-[2.6%] aspect-[4524/1360] w-[102.6%] max-w-none object-cover object-[0%_23%]"
                    />
                </div>

                <ul className="mt-8 flex flex-col gap-3 text-lg text-white/80 sm:flex-row sm:gap-8">
                    <li className="inline-flex items-center gap-2">
                        <CalendarDays className="size-5 text-[#F7B600]" />
                        {EVENT.dates}
                    </li>
                    <li className="inline-flex items-center gap-2">
                        <MapPin className="size-5 text-[#F7B600]" />
                        {EVENT.venue}
                    </li>
                </ul>

                <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row">
                    <a
                        href="#schedule"
                        className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-[#F15E00] px-8 text-base font-bold tracking-wide uppercase transition-colors hover:bg-[#FA0A00] focus-visible:ring-2 focus-visible:ring-[#F7B600] focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
                    >
                        View schedules
                        <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                    </a>
                    <a
                        href="#events"
                        className="inline-flex min-h-12 items-center rounded-full border border-white/25 px-8 text-base font-bold tracking-wide uppercase transition-colors hover:border-white hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-[#F7B600] focus-visible:outline-none"
                    >
                        Explore events
                    </a>
                </div>

                <div className="mt-14 flex flex-col gap-8 border-t border-white/10 pt-8 sm:flex-row sm:items-end sm:justify-between">
                    <Countdown target={EVENT.startsAt} />

                    <ul
                        className="flex items-center gap-3"
                        aria-label="Social media"
                    >
                        {SOCIALS.map(({ label, href, icon: Icon }) => (
                            <li key={label}>
                                <a
                                    href={href}
                                    aria-label={label}
                                    className="inline-flex size-11 items-center justify-center rounded-full border border-white/15 text-white/70 transition duration-300 hover:scale-90 hover:border-white hover:text-white focus-visible:ring-2 focus-visible:ring-[#F7B600] focus-visible:outline-none"
                                >
                                    <Icon className="size-5" />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}

function About() {
    const decorRef = useParallax<HTMLDivElement>(0.2);

    return (
        <section
            id="about"
            className="relative scroll-mt-20 overflow-hidden border-t border-white/10 bg-neutral-950"
        >
            <div
                ref={decorRef}
                aria-hidden
                className="pointer-events-none absolute top-1/2 -left-24 hidden w-96 will-change-transform lg:block"
            >
                <img
                    src={logoIcon}
                    alt=""
                    className="w-full -rotate-[21deg] opacity-10"
                />
            </div>
            <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[1fr_1.2fr] lg:gap-20 lg:py-32">
                <SectionHeading
                    eyebrow="About the festival"
                    title={EVENT.name}
                />
                <div className="flex flex-col gap-6 text-lg leading-relaxed text-white/70">
                    <p>
                        The {EVENT.name} is a provincial initiative designed to
                        promote the practical, inclusive, and collaborative
                        application of science, technology, and innovation
                        across governance, industry, education, research, and
                        local communities. Carrying the theme{" "}
                        <strong className="font-semibold text-white">
                            “{EVENT.theme},”
                        </strong>{" "}
                        the multi-component festival features technology
                        exhibits, panel forums, hackathons, idea pitching, video
                        storytelling, and e-games development competitions aimed
                        at strengthening Marinduque’s innovation ecosystem.
                    </p>
                    <p>
                        The festival aims to engage participants across the
                        province by providing a platform for students, local
                        innovators, startups, academe, government agencies, and
                        industry stakeholders to showcase technology-driven
                        solutions, enhance technical skills, and foster
                        sustainable partnerships.
                    </p>
                </div>
            </div>
        </section>
    );
}

function Schedule() {
    return (
        <section id="schedule" className="scroll-mt-20 bg-black">
            <div className="mx-auto max-w-7xl px-6 py-24 lg:py-32">
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="flex flex-col justify-between gap-10 rounded-3xl bg-[#0078D9] p-8 lg:col-span-2 lg:p-12">
                        <div className="flex flex-col gap-3">
                            <p className="text-sm font-semibold tracking-[0.2em] text-white/70 uppercase">
                                Schedule
                            </p>
                            <p className="text-4xl font-black tracking-tight uppercase sm:text-6xl">
                                {EVENT.dates}
                            </p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <p className="text-sm font-semibold tracking-[0.2em] text-white/70 uppercase">
                                Venue
                            </p>
                            <p className="max-w-xl text-xl font-semibold sm:text-2xl">
                                {EVENT.venue}
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-6">
                        {STATS.map(({ value, label, icon: Icon, color }) => (
                            <div
                                key={label}
                                className="flex items-center gap-6 rounded-3xl border border-white/10 bg-neutral-950 p-8"
                            >
                                <Icon className={`size-8 shrink-0 ${color}`} />
                                <div>
                                    <p className="text-4xl font-black tracking-tight">
                                        {value}
                                    </p>
                                    <p className="text-sm font-semibold tracking-[0.2em] text-white/60 uppercase">
                                        {label}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-3">
                    <div className="rounded-3xl border border-white/10 bg-neutral-950 p-8">
                        <p className="text-lg leading-relaxed text-white/70">
                            Join and network with a community of professionals,
                            students, innovators, and more.
                        </p>
                    </div>
                    {PERKS.map(({ title, description, icon: Icon, color }) => (
                        <div
                            key={title}
                            className="group flex flex-col gap-4 rounded-3xl border border-white/10 bg-neutral-950 p-8"
                        >
                            <Icon
                                className={`size-7 ${color} group-hover:animate-hang motion-reduce:animate-none`}
                            />
                            <h3 className="text-xl font-bold">{title}</h3>
                            <p className="text-white/60">{description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function MajorEvents() {
    return (
        <section
            id="events"
            className="scroll-mt-20 border-t border-white/10 bg-neutral-950"
        >
            <div className="mx-auto max-w-7xl px-6 py-24 lg:py-32">
                <SectionHeading
                    eyebrow="Major events"
                    title="What to expect this year"
                />

                <ol className="mt-16 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {MAJOR_EVENTS.map((event, index) => (
                        <li
                            key={event.title}
                            className="group relative aspect-[4/5] overflow-hidden rounded-xl border border-white/10 bg-neutral-900"
                        >
                            {event.image ? (
                                <img
                                    src={event.image}
                                    alt=""
                                    className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pb-16 text-white/25">
                                    <ImageIcon className="size-10" />
                                    <span className="text-sm">
                                        Photo coming soon
                                    </span>
                                </div>
                            )}

                            <div
                                aria-hidden
                                className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/50"
                            />

                            <span className="absolute top-3 left-3 rounded-md bg-black/60 px-2 py-1 text-sm font-black text-[#F7B600] tabular-nums backdrop-blur-sm">
                                {String(index + 1).padStart(2, "0")}
                            </span>

                            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-linear-to-t from-black/90 via-black/60 to-transparent p-3 pt-20">
                                <p className="max-h-0 overflow-hidden text-sm leading-relaxed text-white/85 opacity-0 transition-all duration-300 group-hover:max-h-48 group-hover:opacity-100">
                                    {event.description}
                                </p>
                                <h3 className="rounded-md bg-[#0078D9] px-3 py-2 text-sm font-bold tracking-wide transition-colors duration-300 group-hover:bg-[#FA0A00]">
                                    {event.title}
                                </h3>
                            </div>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}

function Faqs() {
    return (
        <section id="faqs" className="scroll-mt-20 bg-black">
            <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[1fr_1.6fr] lg:gap-20 lg:py-32">
                <SectionHeading
                    eyebrow="FAQs"
                    title="Frequently asked questions"
                />

                <div className="divide-y divide-white/10 border-y border-white/10">
                    {FAQS.map((faq) => (
                        <details key={faq.question} className="faq-item group">
                            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg font-semibold focus-visible:ring-2 focus-visible:ring-[#F7B600] focus-visible:outline-none [&::-webkit-details-marker]:hidden">
                                {faq.question}
                                <Plus className="size-5 shrink-0 text-[#F7B600] transition-transform group-open:rotate-45" />
                            </summary>
                            <p className="pb-6 leading-relaxed text-white/60">
                                {faq.answer}
                            </p>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Organizers() {
    return (
        <section className="border-t border-white/10 bg-neutral-950">
            <div className="mx-auto max-w-7xl px-6 py-24 text-center lg:py-32">
                <p className="text-sm font-semibold tracking-[0.2em] text-[#F7B600] uppercase">
                    Organized by
                </p>
                <h2 className="mt-4 text-2xl font-black tracking-tight uppercase sm:text-3xl">
                    {EVENT.organizer}
                </h2>
                <div className="mt-12 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
                    <div className="flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none">
                        {[0, 1].map((copy) => (
                            <ul
                                key={copy}
                                aria-hidden={copy === 1}
                                className="flex shrink-0 gap-4 pr-4"
                            >
                                {Array.from({ length: ORGANIZER_SLOTS }).map(
                                    (_, i) => (
                                        <li
                                            key={i}
                                            className="flex aspect-[3/2] w-48 items-center justify-center rounded-2xl border border-dashed border-white/15 text-sm text-white/30"
                                        >
                                            Partner logo
                                        </li>
                                    ),
                                )}
                            </ul>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function Footer() {
    return (
        <footer className="bg-black">
            <div aria-hidden className={`h-1 w-full ${BRAND_GRADIENT}`} />
            <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-[1.5fr_1fr_1fr]">
                <div className="flex flex-col gap-6">
                    <img
                        src={logoName}
                        alt={EVENT.name}
                        className="w-full max-w-sm"
                    />
                </div>

                <div>
                    <h2 className="text-sm font-semibold tracking-[0.2em] text-white/50 uppercase">
                        Major events
                    </h2>
                    <ul className="mt-4 flex flex-col gap-2">
                        {MAJOR_EVENTS.map((event) => (
                            <li key={event.title}>
                                <a
                                    href="#events"
                                    className="text-white/70 hover:text-white"
                                >
                                    {event.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h2 className="text-sm font-semibold tracking-[0.2em] text-white/50 uppercase">
                        Links
                    </h2>
                    <ul className="mt-4 flex flex-col gap-2">
                        {NAV_LINKS.map((link) => (
                            <li key={link.href}>
                                <a
                                    href={link.href}
                                    className="text-white/70 hover:text-white"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                        {SOCIALS.map((social) => (
                            <li key={social.label}>
                                <a
                                    href={social.href}
                                    className="text-white/70 hover:text-white"
                                >
                                    {social.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="border-t border-white/10">
                <p className="mx-auto max-w-7xl px-6 py-6 text-sm text-white/50">
                    Copyright © 2026 {EVENT.name} by {EVENT.organizer}
                </p>
            </div>
        </footer>
    );
}

export default function LandingPage() {
    return (
        <>
            <Head title={EVENT.name} />
            <div className="min-h-screen bg-black font-sans text-white antialiased">
                <Header />
                <main>
                    <Hero />
                    <About />
                    <Schedule />
                    <MajorEvents />
                    <Faqs />
                    <Organizers />
                </main>
                <Footer />
            </div>
        </>
    );
}
