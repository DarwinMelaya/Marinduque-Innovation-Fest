import { Head } from '@inertiajs/react';
import { Printer } from 'lucide-react';
import { useState } from 'react';
import qrLogo from '../../../images/mail/logo-icon.png';
import logoIcon from '../../../pictures/Marinduque Innovation Fest 206 logo.png';

type Props = {
    batch: {
        id: number;
        label: string;
        points: number;
    };
    codes: {
        code: string;
        qr: string;
    }[];
    /** Logo width as a share of the QR code, matching the white box left in its center. */
    logoRatio: number;
};

/** Card layouts for one A4 sheet (210 × 297 mm with a 10 mm margin). Sizes are in mm and pt so print matches exactly. */
const LAYOUTS = {
    small: {
        name: 'Small',
        columns: 4,
        rows: 5,
        qr: 30,
        label: 6,
        points: 11,
        hint: 5.5,
        code: 6,
        logo: 0,
    },
    medium: {
        name: 'Medium',
        columns: 3,
        rows: 4,
        qr: 40,
        label: 7.5,
        points: 14,
        hint: 6.5,
        code: 7.5,
        logo: 0,
    },
    large: {
        name: 'Large',
        columns: 2,
        rows: 3,
        qr: 54,
        label: 9.5,
        points: 19,
        hint: 8,
        code: 9,
        logo: 0,
    },
    poster: {
        name: 'Poster',
        columns: 1,
        rows: 1,
        qr: 140,
        label: 20,
        points: 44,
        hint: 14,
        code: 16,
        logo: 28,
    },
} as const;

type LayoutKey = keyof typeof LAYOUTS;

function chunk<T>(items: T[], size: number): T[][] {
    const pages: T[][] = [];

    for (let i = 0; i < items.length; i += size) {
        pages.push(items.slice(i, i + size));
    }

    return pages;
}

export default function PrintQrCodes({ batch, codes, logoRatio }: Props) {
    const [layoutKey, setLayoutKey] = useState<LayoutKey>('medium');
    const layout = LAYOUTS[layoutKey];
    const pages = chunk(codes, layout.columns * layout.rows);

    return (
        <>
            <Head title={`Print ${batch.label} QR codes`} />
            <style>{`
                @page { size: A4; margin: 0; }
                @media print {
                    html, body { background: #fff !important; }
                }
            `}</style>

            <div className="min-h-svh bg-neutral-800 text-white print:min-h-0 print:bg-white">
                <header className="sticky top-0 z-10 border-b border-white/10 bg-neutral-950/95 backdrop-blur print:hidden">
                    <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-lg font-black tracking-tight uppercase">
                                {batch.label}
                            </h1>
                            <p className="text-sm text-white/60">
                                {codes.length} unscanned{' '}
                                {codes.length === 1 ? 'code' : 'codes'} · +
                                {batch.points} points each · {pages.length} A4{' '}
                                {pages.length === 1 ? 'page' : 'pages'}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <div
                                role="radiogroup"
                                aria-label="Code size"
                                className="flex rounded-full border border-white/15 bg-white/5 p-1"
                            >
                                {(
                                    Object.entries(LAYOUTS) as [
                                        LayoutKey,
                                        (typeof LAYOUTS)[LayoutKey],
                                    ][]
                                ).map(([key, option]) => (
                                    <label
                                        key={key}
                                        className="cursor-pointer rounded-full px-3 py-1.5 text-center text-xs font-semibold text-white/70 transition-colors hover:text-white has-checked:bg-[#F15E00] has-checked:text-white has-focus-visible:ring-2 has-focus-visible:ring-[#F7B600]"
                                    >
                                        <input
                                            type="radio"
                                            name="layout"
                                            value={key}
                                            checked={layoutKey === key}
                                            onChange={() => setLayoutKey(key)}
                                            className="sr-only"
                                        />
                                        {option.name}
                                        <span className="block text-[10px] font-normal opacity-70">
                                            {option.columns * option.rows} per
                                            page
                                        </span>
                                    </label>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={() => window.print()}
                                disabled={codes.length === 0}
                                className="inline-flex h-11 items-center gap-2 rounded-full bg-[#F15E00] px-5 text-sm font-bold tracking-wide text-white uppercase transition-colors hover:bg-[#FA0A00] focus-visible:ring-2 focus-visible:ring-[#F7B600] focus-visible:outline-none disabled:opacity-50"
                            >
                                <Printer className="size-4" />
                                Print
                            </button>
                        </div>
                    </div>
                </header>

                {codes.length === 0 ? (
                    <p className="px-4 py-24 text-center text-white/60 print:hidden">
                        Every code in this batch has been scanned.
                    </p>
                ) : (
                    <div className="flex flex-col items-center gap-6 py-6 print:block print:p-0">
                        {pages.map((page, index) => (
                            <section
                                key={index}
                                aria-label={`Page ${index + 1}`}
                                className="grid shrink-0 overflow-hidden bg-white text-[#0A1F44] shadow-2xl [print-color-adjust:exact] print:shadow-none"
                                style={{
                                    width: '210mm',
                                    height: '296mm',
                                    padding: '10mm',
                                    gridTemplateColumns: `repeat(${layout.columns}, 1fr)`,
                                    gridTemplateRows: `repeat(${layout.rows}, 1fr)`,
                                    breakAfter:
                                        index < pages.length - 1
                                            ? 'page'
                                            : 'auto',
                                }}
                            >
                                {page.map(({ code, qr }) => (
                                    <div
                                        key={code}
                                        className="flex min-h-0 flex-col items-center justify-center overflow-hidden border border-dashed border-neutral-300 text-center"
                                        style={{ gap: '1.5mm', padding: '2mm' }}
                                    >
                                        {layout.logo > 0 && (
                                            <img
                                                src={logoIcon}
                                                alt=""
                                                style={{
                                                    height: `${layout.logo}mm`,
                                                }}
                                            />
                                        )}
                                        <p
                                            className="max-w-full truncate font-semibold tracking-[0.15em] text-neutral-500 uppercase"
                                            style={{
                                                fontSize: `${layout.label}pt`,
                                            }}
                                        >
                                            {batch.label}
                                        </p>
                                        <div
                                            className="relative shrink-0"
                                            style={{
                                                width: `${layout.qr}mm`,
                                                height: `${layout.qr}mm`,
                                            }}
                                        >
                                            <img
                                                src={qr}
                                                alt={`QR code ${code}`}
                                                className="size-full"
                                            />
                                            <img
                                                src={qrLogo}
                                                alt=""
                                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-contain"
                                                style={{
                                                    width: `${logoRatio * 100}%`,
                                                    height: `${logoRatio * 100}%`,
                                                }}
                                            />
                                        </div>
                                        <p
                                            className="leading-none font-black text-[#F15E00]"
                                            style={{
                                                fontSize: `${layout.points}pt`,
                                            }}
                                        >
                                            +{batch.points} POINTS
                                        </p>
                                        <p
                                            className="text-neutral-600"
                                            style={{
                                                fontSize: `${layout.hint}pt`,
                                            }}
                                        >
                                            Scan in your Innovation Fest account
                                        </p>
                                        <p
                                            className="font-mono font-bold"
                                            style={{
                                                fontSize: `${layout.code}pt`,
                                            }}
                                        >
                                            {code}
                                        </p>
                                    </div>
                                ))}
                            </section>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
