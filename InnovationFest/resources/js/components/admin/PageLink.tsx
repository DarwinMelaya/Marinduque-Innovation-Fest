import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';

const PAGE_LINK_CLASS =
    'inline-flex min-h-10 items-center gap-1.5 rounded-full border border-white/25 px-4 text-xs font-bold tracking-wide uppercase transition-colors';

export default function PageLink({
    href,
    label,
    children,
}: {
    href: string | null;
    label: string;
    children: ReactNode;
}) {
    if (href === null) {
        return (
            <span
                aria-disabled="true"
                aria-label={label}
                className={`${PAGE_LINK_CLASS} cursor-not-allowed opacity-40`}
            >
                {children}
            </span>
        );
    }

    return (
        <Link
            href={href}
            preserveScroll
            aria-label={label}
            className={`${PAGE_LINK_CLASS} hover:border-white hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-[#F7B600] focus-visible:outline-none`}
        >
            {children}
        </Link>
    );
}
