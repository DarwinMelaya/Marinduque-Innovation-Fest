import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

type Props = {
    children: ReactNode;
    /** Stagger in milliseconds. */
    delay?: number;
    className?: string;
    direction?: "up" | "left" | "right" | "none";
};

const HIDDEN = {
    up: "translate-y-8",
    left: "-translate-x-8",
    right: "translate-x-8",
    none: "",
};

/** Fades and slides its children in once they scroll into view. Skipped for reduced-motion users. */
export default function Reveal({
    children,
    delay = 0,
    className = "",
    direction = "up",
}: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const [shown, setShown] = useState(false);

    useEffect(() => {
        const el = ref.current;

        if (
            !el ||
            typeof IntersectionObserver === "undefined" ||
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
            setShown(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShown(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
        );
        observer.observe(el);

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
            className={`transition-all duration-700 ease-out ${
                shown
                    ? "translate-0 opacity-100"
                    : `opacity-0 ${HIDDEN[direction]}`
            } ${className}`}
        >
            {children}
        </div>
    );
}
