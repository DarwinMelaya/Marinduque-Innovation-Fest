import { Head, Link } from "@inertiajs/react";
import {
    ArrowRight,
    Award,
    Bot,
    CalendarDays,
    ChevronDown,
    Facebook,
    Gift,
    Instagram,
    MapPin,
    Menu,
    MessagesSquare,
    Plus,
    Rocket,
    Trophy,
    type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import Organizers from "@/components/public/Organizers";
import Reveal from "@/components/public/Reveal";
import logoIcon from "../../../pictures/Marinduque Innovation Fest 206 logo.png";
import logoName from "../../../pictures/logoname.png";
import hackathonImage from "../../../pictures/majorevents/Innovation Fest Hackathon.png";
import ideaPitchingImage from "../../../pictures/majorevents/Idea Pitching Competition.png";
import eGamesImage from "../../../pictures/majorevents/E-Games Sports Development Challenge.png";
import kuwentolohiyaImage from "../../../pictures/majorevents/Kuwentolohiya Short Video Contest.png";

const EVENT = {
    name: "Marinduque Innovation Fest 2026",
    theme: "From Ideas to Solutions: Connect, Innovate, Transform",
    dates: "October 30-31, 2026",
    venue: "Marinduque Convention Center",
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
    /** Shown on the brand-color background when there is no image. */
    icon?: LucideIcon;
};

const MAJOR_EVENTS: MajorEvent[] = [
    {
        title: "Launching of Marinduque Innovation Hub (iHUB)",
        description:
            "The official inauguration of the Marinduque iHUB, featuring a Ceremonial Signing of the Memorandum of Understanding (MOU) and Pledge of Commitment with key regional partners and stakeholders.",
        icon: Rocket,
    },
    {
        title: "Forums and Panel Discussions",
        description:
            "A series of talks and fireside chats at The Nexus Stage featuring industry experts, researchers, government agencies, and tech organizations discussing technopreneurship, design thinking, robotics, and emerging technologies.",
        icon: MessagesSquare,
    },
    {
        title: "Innovation Fest Hackathon",
        description:
            "A two-day collaborative challenge where student teams develop and pitch working tech-business prototypes (apps or websites) addressing local community needs in Marinduque.",
        image: hackathonImage,
    },
    {
        title: "Idea Pitching Competition",
        description:
            "Student innovators present creative, research-backed solutions and five-slide pitch decks to a panel of judges under the theme “Imagine. Innovate. Impact: Building a Smarter Marinduque”.",
        image: ideaPitchingImage,
    },
    {
        title: "E-Games Sports Development Challenge",
        description:
            "A student competition where teams design and showcase original skill-based e-sports games centered on local culture, smart cities, and community themes.",
        image: eGamesImage,
    },
    {
        title: "Kuwentolohiya: Short Video Contest",
        description:
            "A creative short-form storytelling competition exploring the connection between stories (Kuwento), local culture (Kultura), and technology (Teknolohiya).",
        image: kuwentolohiyaImage,
    },
    {
        title: "Technology Exhibits, Gamers Den, and Robots Den",
        description:
            "Interactive exhibition spaces featuring robotics demonstrations, playable entries from the game development contest, and technology showcases from partner organizations and local startups.",
        icon: Bot,
    },
    {
        title: "Closing Ceremonies and Awarding",
        description:
            "Official recognition and awarding of prize money, medals, and certificates to winning teams and participating qualifiers across all challenge components.",
        icon: Trophy,
    },
];

/** Brand-color backgrounds for event cards without a photo. */
const EVENT_FALLBACK_COLORS = [
    "from-[#F15E00] to-[#7a2f00]",
    "from-[#0078D9] to-[#003a6b]",
    "from-[#229D1C] to-[#0f4a0c]",
    "from-[#FA0A00] to-[#7a0500]",
    "from-[#F7B600] to-[#7a5a00]",
];

/** Maps each major event to its page under /events/{slug}. */
const EVENT_SLUGS: Record<string, string> = {
    "Launching of Marinduque Innovation Hub (iHUB)": "ihub-launching",
    "Forums and Panel Discussions": "forums-panel-discussions",
    "Innovation Fest Hackathon": "hackathon",
    "Idea Pitching Competition": "idea-pitching",
    "E-Games Sports Development Challenge": "e-games",
    "Kuwentolohiya: Short Video Contest": "kuwentolohiya",
    "Technology Exhibits, Gamers Den, and Robots Den": "exhibits",
    "Closing Ceremonies and Awarding": "closing-awarding",
};

const EMAIL_LINK_CLASS =
    "font-medium text-white underline decoration-white/30 underline-offset-4 hover:decoration-white";

const FAQS: { question: string; answer: ReactNode }[] = [
    {
        question: "What is the Marinduque Innovation Fest 2026?",
        answer: "The Marinduque Innovation Fest 2026 is a provincial event organized by DOST MIMAROPA - PSTO Marinduque together with partner institutions to showcase local technology, foster student entrepreneurship, and strengthen Marinduque’s innovation ecosystem.",
    },
    {
        question: "When and where will the festival take place?",
        answer: "The festival will take place from October 26 to 30, 2026. Main events, exhibits, and challenge presentations will be held across the Marinduque Convention Center, The Nexus Stage, and the Marinduque Innovation Hub at DOST Marinduque in Boac, Marinduque.",
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
        <Reveal className="flex flex-col gap-4">
            <p className="text-sm font-semibold tracking-[0.2em] text-[#F7B600] uppercase">
                {eyebrow}
            </p>
            <h2 className="text-3xl font-black tracking-tight text-balance uppercase sm:text-4xl lg:text-5xl">
                {title}
            </h2>
            <GradientRule />
        </Reveal>
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
                            <li key={link.href} className="group relative">
                                <a
                                    href={link.href}
                                    className="inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold tracking-wide text-white/70 uppercase transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-[#F7B600] focus-visible:outline-none"
                                >
                                    {link.label}
                                    {link.href === "#events" && (
                                        <ChevronDown className="size-4 transition-transform group-focus-within:rotate-180 group-hover:rotate-180" />
                                    )}
                                </a>
                                {link.href === "#events" && (
                                    <div className="invisible absolute top-full left-0 z-50 w-80 pt-2 opacity-0 transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                                        <ul className="overflow-hidden rounded-xl border border-white/10 bg-black py-2 shadow-2xl">
                                            {MAJOR_EVENTS.map((event) => (
                                                <li key={event.title}>
                                                    <a
                                                        href={`/events/${EVENT_SLUGS[event.title]}`}
                                                        className="block px-5 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-[#F7B600] focus-visible:bg-white/10 focus-visible:outline-none"
                                                    >
                                                        {event.title}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="flex items-center gap-2">
                    <Link
                        href="/register"
                        className="hidden rounded-full bg-[#F15E00] px-5 py-2.5 text-sm font-bold tracking-wide uppercase transition-colors hover:bg-[#FA0A00] focus-visible:ring-2 focus-visible:ring-[#F7B600] focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none sm:inline-flex"
                    >
                        Register
                    </Link>

                    <Sheet>
                        <SheetTrigger
                            className="inline-flex size-11 items-center justify-center rounded-md border border-white/20 text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#F7B600] focus-visible:outline-none lg:hidden"
                            aria-label="Open menu"
                        >
                            <Menu className="size-6" />
                        </SheetTrigger>
                        <SheetContent
                            side="right"
                            className="overflow-y-auto border-white/10 bg-black text-white"
                        >
                            <SheetTitle className="px-6 pt-6 text-white">
                                Menu
                            </SheetTitle>
                            <nav aria-label="Mobile" className="px-3">
                                <ul className="flex flex-col">
                                    {NAV_LINKS.map((link) => (
                                        <li key={link.href}>
                                            {link.href === "#events" ? (
                                                <details className="group">
                                                    <summary className="flex cursor-pointer list-none items-center justify-between rounded-md px-3 py-3 text-base font-semibold tracking-wide uppercase hover:bg-white/10 [&::-webkit-details-marker]:hidden">
                                                        {link.label}
                                                        <ChevronDown className="size-5 transition-transform group-open:rotate-180" />
                                                    </summary>
                                                    <ul className="mb-2 ml-3 flex flex-col border-l border-white/15 pl-3">
                                                        <li>
                                                            <SheetClose asChild>
                                                                <a
                                                                    href="#events"
                                                                    className="block rounded-md px-3 py-2.5 text-sm font-bold text-[#F7B600] hover:bg-white/10"
                                                                >
                                                                    View all
                                                                    events
                                                                </a>
                                                            </SheetClose>
                                                        </li>
                                                        {MAJOR_EVENTS.map(
                                                            (event) => (
                                                                <li
                                                                    key={
                                                                        event.title
                                                                    }
                                                                >
                                                                    <SheetClose
                                                                        asChild
                                                                    >
                                                                        <a
                                                                            href={`/events/${EVENT_SLUGS[event.title]}`}
                                                                            className="block rounded-md px-3 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
                                                                        >
                                                                            {
                                                                                event.title
                                                                            }
                                                                        </a>
                                                                    </SheetClose>
                                                                </li>
                                                            ),
                                                        )}
                                                    </ul>
                                                </details>
                                            ) : (
                                                <SheetClose asChild>
                                                    <a
                                                        href={link.href}
                                                        className="block rounded-md px-3 py-3 text-base font-semibold tracking-wide uppercase hover:bg-white/10"
                                                    >
                                                        {link.label}
                                                    </a>
                                                </SheetClose>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                            <div className="mt-auto p-6">
                                <SheetClose asChild>
                                    <Link
                                        href="/register"
                                        className="flex w-full items-center justify-center rounded-full bg-[#F15E00] px-5 py-3 font-bold tracking-wide uppercase hover:bg-[#FA0A00]"
                                    >
                                        Register
                                    </Link>
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

function Hero() {
    return (
        <section id="home" className="relative bg-black scroll-mt-20">
            <div className="mx-auto max-w-7xl px-5 pt-12 pb-24 duration-1000 animate-in fade-in slide-in-from-bottom-4 sm:px-6 lg:pt-16 lg:pb-28">
                <p className="text-sm font-semibold tracking-[0.2em] text-white/60 uppercase">
                    {EVENT.organizer} presents
                </p>

                <h1 className="sr-only">{EVENT.name}</h1>
                {/* mix-blend-lighten drops the PNG's black box into the page; same file, no crop. */}
                <div className="-mx-5 mt-5 min-w-0 sm:mx-0 sm:mt-7">
                    <img
                        src={logoName}
                        alt={`${EVENT.name} — ${EVENT.theme}`}
                        width={3840}
                        height={1008}
                        decoding="async"
                        fetchPriority="high"
                        draggable={false}
                        className="block h-auto w-full max-w-full select-none object-contain mix-blend-lighten sm:max-w-4xl lg:max-w-5xl"
                    />
                </div>

                <ul className="mt-7 flex flex-col gap-2.5 text-base text-white/80 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-2 sm:text-lg">
                    <li className="inline-flex items-center gap-2">
                        <CalendarDays className="size-5 shrink-0 text-[#F7B600]" />
                        {EVENT.dates}
                    </li>
                    <li className="inline-flex items-center gap-2">
                        <MapPin className="size-5 shrink-0 text-[#F7B600]" />
                        {EVENT.venue}
                    </li>
                </ul>

                <div className="mt-8 sm:mt-10">
                    <Link
                        href="/register"
                        className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#F15E00] px-8 text-sm font-bold tracking-wide uppercase transition-colors hover:bg-[#FA0A00] focus-visible:ring-2 focus-visible:ring-[#F7B600] focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none sm:min-h-14 sm:w-auto sm:px-10 sm:text-base"
                    >
                        Register
                        <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                <ul
                    className="mt-12 flex items-center gap-3 border-t border-white/10 pt-7 sm:mt-14 sm:pt-8"
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
                <Reveal
                    delay={150}
                    direction="right"
                    className="flex flex-col gap-6 text-lg leading-relaxed text-white/70"
                >
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
                </Reveal>
            </div>
        </section>
    );
}

function Schedule() {
    return (
        <section id="schedule" className="scroll-mt-20 bg-black">
            <div className="mx-auto max-w-7xl px-6 py-24 lg:py-32">
                <Reveal className="flex flex-col justify-between gap-10 rounded-3xl bg-[#0078D9] p-8 sm:flex-row sm:items-end sm:gap-16 lg:p-12">
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
                </Reveal>

                <div className="mt-6 grid gap-6 md:grid-cols-3">
                    <Reveal>
                        <div className="h-full rounded-3xl border border-white/10 bg-neutral-950 p-8 transition duration-300 hover:-translate-y-1 hover:border-white/30">
                            <p className="text-lg leading-relaxed text-white/70">
                                Join and network with a community of
                                professionals, students, innovators, and more.
                            </p>
                        </div>
                    </Reveal>
                    {PERKS.map(
                        ({ title, description, icon: Icon, color }, i) => (
                            <Reveal key={title} delay={(i + 1) * 120}>
                                <div className="group flex h-full flex-col gap-4 rounded-3xl border border-white/10 bg-neutral-950 p-8 transition duration-300 hover:-translate-y-1 hover:border-white/30">
                                    <Icon
                                        className={`size-7 ${color} group-hover:animate-hang motion-reduce:animate-none`}
                                    />
                                    <h3 className="text-xl font-bold">
                                        {title}
                                    </h3>
                                    <p className="text-white/60">
                                        {description}
                                    </p>
                                </div>
                            </Reveal>
                        ),
                    )}
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

                <div
                    role="list"
                    className="mt-16 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
                >
                    {MAJOR_EVENTS.map((event, index) => (
                        <Reveal
                            key={event.title}
                            delay={(index % 4) * 100}
                            className="aspect-[4/5]"
                        >
                            <div
                                role="listitem"
                                className="group relative size-full overflow-hidden rounded-xl border border-white/10 bg-neutral-900 transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_-12px_rgba(241,94,0,0.4)]"
                            >
                                {event.image ? (
                                    <img
                                        src={event.image}
                                        alt=""
                                        className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div
                                        aria-hidden
                                        className={`absolute inset-0 bg-linear-to-br transition-transform duration-500 group-hover:scale-105 ${
                                            EVENT_FALLBACK_COLORS[
                                                index %
                                                    EVENT_FALLBACK_COLORS.length
                                            ]
                                        }`}
                                    >
                                        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.18)_1px,transparent_1px)] bg-size-[18px_18px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_60%)]" />
                                        {event.icon && (
                                            <div className="absolute inset-0 flex items-center justify-center pb-20">
                                                <div className="rounded-full bg-white/10 p-7 ring-1 ring-white/25 backdrop-blur-sm transition-transform duration-500 group-hover:-rotate-6">
                                                    <event.icon
                                                        className="size-16 text-white drop-shadow-lg"
                                                        strokeWidth={1.5}
                                                    />
                                                </div>
                                            </div>
                                        )}
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
                            </div>
                        </Reveal>
                    ))}
                </div>
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

                <Reveal
                    delay={150}
                    direction="right"
                    className="divide-y divide-white/10 border-y border-white/10"
                >
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
                </Reveal>
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
                        className="w-full max-w-sm mix-blend-lighten"
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
