import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { authInputClass } from "@/lib/auth-styles";
import { COURSE_GROUPS } from "@/lib/courses";
import { cn } from "@/lib/utils";

function filterGroups(query: string) {
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

    const isListed = COURSE_GROUPS.some((group) =>
        group.courses.includes(query),
    );

    if (words.length === 0 || isListed) {
        return COURSE_GROUPS;
    }

    return COURSE_GROUPS.map((group) => ({
        ...group,
        courses: group.courses.filter((course) => {
            const text = `${course} ${group.college}`.toLowerCase();

            return words.every((word) => text.includes(word));
        }),
    })).filter((group) => group.courses.length > 0);
}

export default function CourseCombobox({
    id,
    name,
}: {
    id: string;
    name: string;
}) {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(-1);
    const listRef = useRef<HTMLDivElement>(null);
    const listId = useId();

    const groups = filterGroups(query);
    const options = groups.flatMap((group) => group.courses);
    const optionId = (index: number) => `${listId}-option-${index}`;

    useEffect(() => {
        if (active < 0) {
            return;
        }

        listRef.current
            ?.querySelector(`[data-index="${active}"]`)
            ?.scrollIntoView({ block: "nearest" });
    }, [active]);

    const choose = (course: string) => {
        setQuery(course);
        setOpen(false);
        setActive(-1);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        switch (event.key) {
            case "ArrowDown":
                event.preventDefault();
                setOpen(true);
                setActive((index) => Math.min(index + 1, options.length - 1));
                break;
            case "ArrowUp":
                event.preventDefault();
                setActive((index) => Math.max(index - 1, 0));
                break;
            case "Enter":
                if (open && active >= 0) {
                    event.preventDefault();
                    choose(options[active]);
                }
                break;
            case "Escape":
                setOpen(false);
                break;
        }
    };

    let index = -1;

    return (
        <div className="relative">
            <Input
                id={id}
                name={name}
                required
                role="combobox"
                autoComplete="off"
                aria-autocomplete="list"
                aria-expanded={open}
                aria-controls={listId}
                aria-activedescendant={
                    open && active >= 0 ? optionId(active) : undefined
                }
                value={query}
                onChange={(event) => {
                    setQuery(event.target.value);
                    setOpen(true);
                    setActive(-1);
                }}
                onFocus={() => setOpen(true)}
                onClick={() => setOpen(true)}
                onBlur={() => setOpen(false)}
                onKeyDown={handleKeyDown}
                placeholder="Search or type your course"
                className={cn(authInputClass, "pr-10")}
            />
            <ChevronDown
                className={cn(
                    "pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-white/50 transition-transform",
                    open && "rotate-180",
                )}
            />

            {open && (
                <div
                    ref={listRef}
                    id={listId}
                    role="listbox"
                    onMouseDown={(event) => event.preventDefault()}
                    className="absolute inset-x-0 top-full z-20 mt-2 max-h-72 overflow-y-auto rounded-lg border border-white/10 bg-[#1A1919] shadow-2xl shadow-black/50 [color-scheme:dark]"
                >
                    {groups.length === 0 ? (
                        <p className="px-4 py-3 text-sm text-white/60">
                            Not in the list. We'll save{" "}
                            <span className="font-medium text-white">
                                "{query.trim()}"
                            </span>{" "}
                            as your course.
                        </p>
                    ) : (
                        groups.map((group) => (
                            <div
                                key={group.college}
                                role="group"
                                aria-label={group.college}
                                className="pb-1"
                            >
                                <div className="sticky top-0 border-b border-white/5 bg-[#1A1919] px-4 py-2 text-[11px] font-semibold tracking-[0.15em] text-[#F7B600] uppercase">
                                    {group.college}
                                </div>
                                {group.courses.map((course) => {
                                    index += 1;
                                    const optionIndex = index;
                                    const selected = course === query;

                                    return (
                                        <div
                                            key={course}
                                            id={optionId(optionIndex)}
                                            data-index={optionIndex}
                                            role="option"
                                            aria-selected={selected}
                                            onClick={() => choose(course)}
                                            onMouseEnter={() =>
                                                setActive(optionIndex)
                                            }
                                            className={cn(
                                                "mx-1 mt-1 flex cursor-pointer items-start gap-2 rounded-md px-3 py-2 text-sm text-white/80",
                                                optionIndex === active &&
                                                    "bg-[#F15E00]/15 text-white",
                                                selected &&
                                                    "font-medium text-white",
                                            )}
                                        >
                                            <span className="flex-1">
                                                {course}
                                            </span>
                                            {selected && (
                                                <Check className="mt-0.5 size-4 shrink-0 text-[#F15E00]" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
