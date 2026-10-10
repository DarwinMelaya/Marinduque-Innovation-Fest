import { Head } from '@inertiajs/react';
import { Printer } from 'lucide-react';
import AdminPageHeading from '@/components/layout/AdminPageHeading';
import DeleteBonusBatch from '@/components/modals/admin/DeleteBonusBatch';
import GenerateBonusCodes from '@/components/modals/admin/GenerateBonusCodes';
import { index as qrCodesIndex, print } from '@/routes/admin/qr-codes';

type Batch = {
    id: number;
    label: string;
    points: number;
    codes: number;
    redeemed: number;
    createdAt: string | null;
};

type Props = {
    stats: {
        codes: number;
        redeemed: number;
        points: number;
    };
    batches: Batch[];
    maxQuantity: number;
    maxPoints: number;
};

const dateFormat = new Intl.DateTimeFormat('en-PH', {
    dateStyle: 'medium',
    timeZone: 'Asia/Manila',
});

const CARD_CLASS = 'rounded-3xl border border-white/10 bg-neutral-950';

const LABEL_CLASS =
    'text-xs font-semibold tracking-[0.2em] text-white/50 uppercase';

const formatNumber = (value: number) => value.toLocaleString('en-PH');

function ScanProgress({ batch }: { batch: Batch }) {
    const percent = batch.codes > 0 ? (batch.redeemed / batch.codes) * 100 : 0;

    return (
        <div className="flex min-w-36 flex-col gap-1.5">
            <p className="text-sm">
                <span className="font-bold tabular-nums">
                    {formatNumber(batch.redeemed)}
                </span>
                <span className="text-white/50">
                    {' '}
                    / {formatNumber(batch.codes)} scanned
                </span>
            </p>
            <div
                role="progressbar"
                aria-label={`${batch.label} codes scanned`}
                aria-valuemin={0}
                aria-valuemax={batch.codes}
                aria-valuenow={batch.redeemed}
                className="h-1.5 overflow-hidden rounded-full bg-white/10"
            >
                <div
                    className="h-full rounded-full bg-[#F7B600]"
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    );
}

function BatchActions({ batch }: { batch: Batch }) {
    const unscanned = batch.codes - batch.redeemed;

    return (
        <div className="flex justify-end gap-1">
            {unscanned > 0 ? (
                <a
                    href={print.url(batch.id)}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                >
                    <Printer className="size-3.5" />
                    Print
                </a>
            ) : (
                <span className="inline-flex h-8 items-center px-3 text-sm text-white/40">
                    All scanned
                </span>
            )}
            <DeleteBonusBatch batch={batch} />
        </div>
    );
}

export default function GenerateQrCode({
    stats,
    batches,
    maxQuantity,
    maxPoints,
}: Props) {
    return (
        <>
            <Head title="Generate QR Code" />

            <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:gap-8 lg:p-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <AdminPageHeading
                        eyebrow="Bonus points"
                        title="Bonus QR codes"
                        description="Single-use QR codes that give visitors extra points when they scan them from their account."
                    />
                    <GenerateBonusCodes
                        maxQuantity={maxQuantity}
                        maxPoints={maxPoints}
                    />
                </div>

                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: 'Codes generated', value: stats.codes },
                        { label: 'Scanned', value: stats.redeemed },
                        {
                            label: 'Bonus points given',
                            value: stats.points,
                            accent: true,
                        },
                    ].map(({ label, value, accent }) => (
                        <div key={label} className={`${CARD_CLASS} p-4 sm:p-5`}>
                            <p
                                className={`${LABEL_CLASS} text-[10px] sm:text-xs`}
                            >
                                {label}
                            </p>
                            <p
                                className={`mt-2 text-2xl font-black sm:text-4xl ${accent ? 'text-[#F7B600]' : ''}`}
                            >
                                {formatNumber(value)}
                            </p>
                        </div>
                    ))}
                </div>

                {batches.length === 0 ? (
                    <p className="rounded-3xl border border-white/10 bg-neutral-950 px-6 py-16 text-center text-white/50">
                        No QR codes yet. Generate a batch to hide around the
                        fest or hand out as prizes.
                    </p>
                ) : (
                    <>
                        <ul className="flex flex-col gap-3 md:hidden">
                            {batches.map((batch) => (
                                <li
                                    key={batch.id}
                                    className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-neutral-950 p-5"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="font-bold">
                                                {batch.label}
                                            </p>
                                            {batch.createdAt && (
                                                <p className="text-sm text-white/50">
                                                    {dateFormat.format(
                                                        new Date(
                                                            batch.createdAt,
                                                        ),
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                        <span className="shrink-0 rounded-full bg-[#F7B600]/15 px-3 py-1 text-sm font-bold text-[#F7B600] tabular-nums">
                                            +{batch.points} pts
                                        </span>
                                    </div>
                                    <ScanProgress batch={batch} />
                                    <div className="border-t border-white/10 pt-3">
                                        <BatchActions batch={batch} />
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="hidden overflow-x-auto rounded-3xl border border-white/10 bg-neutral-950 md:block">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-white/10 text-xs tracking-[0.2em] text-white/50 uppercase">
                                    <tr>
                                        <th className="px-5 py-4 font-semibold">
                                            Label
                                        </th>
                                        <th className="px-5 py-4 font-semibold">
                                            Points each
                                        </th>
                                        <th className="px-5 py-4 font-semibold">
                                            Scanned
                                        </th>
                                        <th className="px-5 py-4 font-semibold">
                                            Generated
                                        </th>
                                        <th className="px-5 py-4 text-right font-semibold">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {batches.map((batch) => (
                                        <tr
                                            key={batch.id}
                                            className="hover:bg-white/5"
                                        >
                                            <td className="px-5 py-4 font-semibold">
                                                {batch.label}
                                            </td>
                                            <td className="px-5 py-4 font-bold text-[#F7B600] tabular-nums">
                                                +{batch.points}
                                            </td>
                                            <td className="px-5 py-4">
                                                <ScanProgress batch={batch} />
                                            </td>
                                            <td className="px-5 py-4 whitespace-nowrap text-white/60">
                                                {batch.createdAt &&
                                                    dateFormat.format(
                                                        new Date(
                                                            batch.createdAt,
                                                        ),
                                                    )}
                                            </td>
                                            <td className="px-5 py-4">
                                                <BatchActions batch={batch} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

GenerateQrCode.layout = {
    breadcrumbs: [
        {
            title: 'Generate QR Code',
            href: qrCodesIndex(),
        },
    ],
};
