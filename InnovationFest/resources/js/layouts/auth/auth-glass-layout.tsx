import { Link } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import { home } from "@/routes";
import type { AuthLayoutProps } from "@/types";
import logoIcon from "../../../pictures/Marinduque Innovation Fest 206 logo.png";

export default function AuthGlassLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="dark relative flex min-h-svh items-center justify-center overflow-hidden bg-[#0B0A0A] px-6 py-12 text-white">
            <div
                aria-hidden
                className="pointer-events-none absolute -top-[24rem] -left-[20rem] size-[50rem] rounded-full bg-[radial-gradient(circle,transparent_40%,#FFE4A3_46%,#F7B600_51%,#F15E00_58%,transparent_67%)] blur-[40px]"
            />

            <div className="relative flex w-full max-w-md flex-col gap-4">
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-10">
                    <div className="mb-8 flex flex-col gap-6">
                        <Link
                            href={home()}
                            className="w-fit rounded-md focus-visible:ring-2 focus-visible:ring-[#F7B600] focus-visible:outline-none"
                        >
                            <img
                                src={logoIcon}
                                alt="Marinduque Innovation Fest"
                                className="h-11 w-auto"
                            />
                        </Link>
                        <div className="flex flex-col gap-2">
                            <h1 className="text-3xl font-semibold tracking-tight">
                                {title}
                            </h1>
                            {description && (
                                <p className="text-sm text-white/60">
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>

                    {children}
                </div>

                <Link
                    href={home()}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm font-medium text-white/70 backdrop-blur-xl transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:ring-2 focus-visible:ring-[#F7B600] focus-visible:outline-none"
                >
                    <ArrowLeft className="size-4" />
                    Back to Marinduque Innovation Fest
                </Link>
            </div>
        </div>
    );
}
