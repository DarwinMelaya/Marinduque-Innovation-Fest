import Reveal from "@/components/public/Reveal";
import mtbiLogo from "../../../pictures/partners/Marinduque Technology Business Incubation.png";
import marsuLogo from "../../../pictures/partners/Marinduque State Univesity.png";
import devconLogo from "../../../pictures/partners/DEV CON.png";
import cybercraftLogo from "../../../pictures/partners/CYBERCRAFT PH.png";
import erovoutikaLogo from "../../../pictures/partners/EROVOUTIKA.png";

const ORGANIZER = "DOST MIMAROPA – DOST Marinduque";

/** Marinduque Technology Business Incubation goes first. */
const PARTNERS = [
    { name: "Marinduque Technology Business Incubation", logo: mtbiLogo },
    { name: "Marinduque State University", logo: marsuLogo },
    { name: "DevCon", logo: devconLogo },
    { name: "Cybercraft PH", logo: cybercraftLogo },
    { name: "Erovoutika", logo: erovoutikaLogo },
];

export default function Organizers() {
    return (
        <section className="border-t border-white/10 bg-neutral-950">
            <div className="mx-auto max-w-7xl px-6 py-24 text-center lg:py-32">
                <Reveal>
                    <p className="text-sm font-semibold tracking-[0.2em] text-[#F7B600] uppercase">
                        Organized by
                    </p>
                    <h2 className="mt-4 text-2xl font-black tracking-tight uppercase sm:text-3xl">
                        {ORGANIZER}
                    </h2>
                </Reveal>
                <div className="mt-12 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
                    <div className="flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none">
                        {[0, 1].map((copy) => (
                            <ul
                                key={copy}
                                aria-hidden={copy === 1}
                                className="flex shrink-0 gap-4 pr-4"
                            >
                                {[...PARTNERS, ...PARTNERS].map(
                                    (partner, i) => (
                                        <li
                                            key={i}
                                            className="flex size-44 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black transition duration-300 hover:scale-105 hover:border-white/30"
                                        >
                                            <img
                                                src={partner.logo}
                                                alt={
                                                    copy === 1
                                                        ? ""
                                                        : partner.name
                                                }
                                                loading="lazy"
                                                className="size-full object-contain"
                                            />
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
