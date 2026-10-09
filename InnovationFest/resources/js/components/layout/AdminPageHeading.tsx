import type { ReactNode } from 'react';

const BRAND_GRADIENT = 'bg-[linear-gradient(to_right,#030209,#3230C1)]';

type Props = {
    eyebrow: string;
    title: string;
    description?: ReactNode;
};

const AdminPageHeading = ({ eyebrow, title, description }: Props) => {
    return (
        <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold tracking-[0.2em] text-[#F7B600] uppercase sm:text-sm">
                {eyebrow}
            </p>
            <h1 className="text-2xl font-black tracking-tight text-balance uppercase sm:text-3xl lg:text-4xl">
                {title}
            </h1>
            <div
                aria-hidden
                className={`h-1 w-16 rounded-full ${BRAND_GRADIENT}`}
            />
            {description && (
                <p className="text-sm text-white/60 sm:text-base">
                    {description}
                </p>
            )}
        </div>
    );
};

export default AdminPageHeading;
