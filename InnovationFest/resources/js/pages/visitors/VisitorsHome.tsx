import { Head, router } from '@inertiajs/react';
import {
    Download,
    Gift,
    LogOut,
    Maximize2,
    QrCode,
    Sparkles,
    Star,
    Store,
} from 'lucide-react';
import { useState } from 'react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import ScanBonusQr from '@/components/visitors/ScanBonusQr';
import { logout } from '@/routes/visitor';
import logoIcon from '../../../pictures/Marinduque Innovation Fest 206 logo.png';

type Visit = {
    id: number;
    boothName: string;
    points: number;
    visitedAt: string | null;
};

type Bonus = {
    id: number;
    label: string;
    points: number;
    redeemedAt: string | null;
};

type Props = {
    participant: {
        name: string;
        firstName: string;
        festId: string;
        qrCode: string;
        qrTicket: string;
    };
    stats: {
        points: number;
        visits: number;
        booths: number;
    };
    visits: Visit[];
    bonuses: Bonus[];
};

const dateFormat = new Intl.DateTimeFormat('en-PH', {
    month: 'short',
    day: 'numeric',
    timeZone: 'Asia/Manila',
});

const timeFormat = new Intl.DateTimeFormat('en-PH', {
    timeStyle: 'short',
    timeZone: 'Asia/Manila',
});

const CARD_CLASS =
    'rounded-3xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/40 backdrop-blur-xl';

const LABEL_CLASS =
    'text-[11px] font-semibold tracking-[0.2em] text-white/50 uppercase';

const FOCUS_RING =
    'focus-visible:ring-2 focus-visible:ring-[#F7B600] focus-visible:outline-none';

function FestPass({ participant }: Pick<Props, 'participant'>) {
    return (
        <section
            aria-labelledby="pass-title"
            className={`${CARD_CLASS} relative flex flex-col overflow-hidden`}
        >
            <div className="flex flex-col items-center gap-5 p-6 text-center sm:p-8">
                <div className="flex items-center gap-2 rounded-full border border-[#F7B600]/25 bg-[#F7B600]/10 px-3 py-1 text-xs font-semibold text-[#FFD66B]">
                    <QrCode className="size-3.5" />
                    <h2 id="pass-title">Your fest pass</h2>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <button
                            type="button"
                            aria-label="Enlarge QR code"
                            className={`group relative rounded-2xl bg-white p-3 shadow-xl shadow-[#F15E00]/10 transition-transform hover:scale-[1.02] active:scale-[0.98] ${FOCUS_RING}`}
                        >
                            <img
                                src={participant.qrCode}
                                alt={`QR code for ${participant.festId}`}
                                className="size-52 sm:size-56"
                            />
                            <span className="absolute right-2 bottom-2 flex size-8 items-center justify-center rounded-full bg-[#0B0A0A] text-white shadow-md transition-transform group-hover:scale-110">
                                <Maximize2 className="size-4" />
                            </span>
                        </button>
                    </DialogTrigger>
                    <DialogContent className="dark flex max-h-[calc(100svh-2rem)] flex-col items-center gap-5 overflow-y-auto rounded-3xl border-white/10 bg-[#0B0A0A] p-8 text-center text-white sm:max-w-md">
                        <div className="flex flex-col gap-1">
                            <DialogTitle className="text-xl font-semibold">
                                {participant.name}
                            </DialogTitle>
                            <DialogDescription className="text-white/60">
                                Let the booth staff scan this code.
                            </DialogDescription>
                        </div>
                        <img
                            src={participant.qrCode}
                            alt={`QR code for ${participant.festId}`}
                            className="aspect-square w-full max-w-80 rounded-2xl bg-white p-4"
                        />
                        <p className="font-mono text-2xl font-bold tracking-wider">
                            {participant.festId}
                        </p>
                    </DialogContent>
                </Dialog>

                <div className="flex flex-col gap-1">
                    <p className="font-mono text-2xl font-bold tracking-wider">
                        {participant.festId}
                    </p>
                    <p className="text-sm text-white/60">{participant.name}</p>
                </div>
            </div>

            <div aria-hidden className="relative flex items-center">
                <span className="absolute -left-3 size-6 rounded-full bg-[#0B0A0A]" />
                <span className="mx-5 h-px flex-1 border-t border-dashed border-white/15" />
                <span className="absolute -right-3 size-6 rounded-full bg-[#0B0A0A]" />
            </div>

            <div className="flex flex-col gap-4 p-6 sm:p-8">
                <p className="text-center text-sm text-white/60">
                    Show this QR code at every booth you visit to earn points.
                </p>
                <a
                    href={participant.qrTicket}
                    download={`${participant.festId}.png`}
                    className={`inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 text-sm font-semibold text-white transition-colors hover:bg-white/10 ${FOCUS_RING}`}
                >
                    <Download className="size-4" />
                    Save QR code
                </a>
            </div>
        </section>
    );
}

function PointsSummary({ stats }: Pick<Props, 'stats'>) {
    return (
        <section aria-label="Points summary" className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#F15E00] via-[#FF8A3D] to-[#F7B600] p-6 text-white shadow-2xl shadow-[#F15E00]/25 sm:p-8">
                <Star
                    aria-hidden
                    className="absolute -top-6 -right-6 size-40 rotate-12 fill-white/15 text-transparent"
                />
                <p className="text-[11px] font-semibold tracking-[0.2em] text-white/80 uppercase">
                    Points earned
                </p>
                <p className="mt-1 flex items-baseline gap-2">
                    <span className="text-6xl font-black drop-shadow-sm">
                        {stats.points}
                    </span>
                    <span className="text-lg font-bold text-white/85">pts</span>
                </p>
                <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-white/90">
                    <Sparkles className="size-4" />
                    {stats.points > 0
                        ? 'Great job! Keep exploring.'
                        : 'Visit a booth to earn your first points.'}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className={`${CARD_CLASS} p-5`}>
                    <p className={LABEL_CLASS}>Booths</p>
                    <p className="mt-1 text-4xl font-black">{stats.booths}</p>
                </div>
                <div className={`${CARD_CLASS} p-5`}>
                    <p className={LABEL_CLASS}>Visits</p>
                    <p className="mt-1 text-4xl font-black">{stats.visits}</p>
                </div>
            </div>

            <ScanBonusQr />
        </section>
    );
}

function PointsHistory({ visits, bonuses }: Pick<Props, 'visits' | 'bonuses'>) {
    const entries = [
        ...visits.map((visit) => ({
            key: `visit-${visit.id}`,
            title: visit.boothName,
            points: visit.points,
            at: visit.visitedAt,
            bonus: false,
        })),
        ...bonuses.map((bonus) => ({
            key: `bonus-${bonus.id}`,
            title: bonus.label,
            points: bonus.points,
            at: bonus.redeemedAt,
            bonus: true,
        })),
    ].sort((a, b) => (b.at ?? '').localeCompare(a.at ?? ''));

    return (
        <section
            aria-labelledby="history-title"
            className={`${CARD_CLASS} flex flex-col gap-2 p-6 sm:p-8`}
        >
            <div className="flex items-center justify-between gap-4">
                <h2 id="history-title" className="text-lg font-bold">
                    Points history
                </h2>
                {entries.length > 0 && (
                    <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-white/70 tabular-nums">
                        {entries.length}
                    </span>
                )}
            </div>

            {entries.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-10 text-center">
                    <span className="flex size-14 items-center justify-center rounded-full bg-white/5 text-white/40">
                        <Store className="size-6" />
                    </span>
                    <p className="font-semibold">No points yet</p>
                    <p className="max-w-xs text-sm text-white/50">
                        Head to a booth and show your QR code, or scan a bonus
                        QR code to start earning points.
                    </p>
                </div>
            ) : (
                <ul className="divide-y divide-white/10">
                    {entries.map((entry) => (
                        <li
                            key={entry.key}
                            className="flex items-center gap-3 py-3.5"
                        >
                            {entry.bonus ? (
                                <span
                                    aria-hidden
                                    className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#F7B600]/15 text-[#F7B600]"
                                >
                                    <Gift className="size-5" />
                                </span>
                            ) : (
                                <span
                                    aria-hidden
                                    className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#F15E00]/15 text-base font-black text-[#FF8A3D] uppercase"
                                >
                                    {entry.title.charAt(0)}
                                </span>
                            )}
                            <div className="min-w-0 flex-1">
                                <p className="truncate font-semibold">
                                    {entry.title}
                                </p>
                                <p className="text-sm text-white/50">
                                    {entry.bonus ? 'Bonus QR' : 'Booth visit'}
                                    {entry.at && (
                                        <>
                                            {' · '}
                                            {dateFormat.format(
                                                new Date(entry.at),
                                            )}{' '}
                                            ·{' '}
                                            {timeFormat.format(
                                                new Date(entry.at),
                                            )}
                                        </>
                                    )}
                                </p>
                            </div>
                            <span className="shrink-0 rounded-full bg-[#F7B600]/15 px-3 py-1 text-sm font-bold text-[#F7B600] tabular-nums">
                                +{entry.points}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

function LogoutButton({ festId }: { festId: string }) {
    const [processing, setProcessing] = useState(false);

    const confirmLogout = () =>
        router.post(
            logout.url(),
            {},
            {
                onStart: () => setProcessing(true),
                onFinish: () => setProcessing(false),
            },
        );

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button
                    type="button"
                    className={`inline-flex h-10 items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 text-sm font-semibold text-white/80 backdrop-blur-xl transition-colors hover:bg-white/10 hover:text-white ${FOCUS_RING}`}
                >
                    <LogOut className="size-4" />
                    Log out
                </button>
            </DialogTrigger>
            <DialogContent className="dark rounded-3xl border-white/10 bg-[#0B0A0A] p-6 text-white sm:max-w-sm sm:p-8">
                <DialogHeader className="items-center gap-3 text-center sm:text-center">
                    <span className="flex size-12 items-center justify-center rounded-full bg-[#F15E00]/15 text-[#FF8A3D]">
                        <LogOut className="size-5" />
                    </span>
                    <DialogTitle className="text-xl font-semibold">
                        Log out?
                    </DialogTitle>
                    <DialogDescription className="text-white/60">
                        You'll need your Innovation Fest ID{' '}
                        <span className="font-mono font-semibold whitespace-nowrap text-white">
                            {festId}
                        </span>{' '}
                        or your QR code to open your account again.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:flex-col">
                    <button
                        type="button"
                        onClick={confirmLogout}
                        disabled={processing}
                        className={`inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-[#F15E00] to-[#FF8A3D] text-sm font-semibold text-white shadow-lg shadow-[#F15E00]/20 transition hover:brightness-110 disabled:opacity-70 ${FOCUS_RING}`}
                    >
                        {processing && <Spinner />}
                        Yes, log out
                    </button>
                    <DialogClose asChild>
                        <button
                            type="button"
                            className={`inline-flex h-11 w-full items-center justify-center rounded-lg border border-white/15 text-sm font-semibold text-white/80 transition-colors hover:bg-white/5 hover:text-white ${FOCUS_RING}`}
                        >
                            Cancel
                        </button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

const VisitorsHome = ({ participant, stats, visits, bonuses }: Props) => (
    <>
        <Head title="My account" />

        <div className="dark relative min-h-svh overflow-hidden bg-[#0B0A0A] px-4 pt-5 pb-12 text-white sm:px-6 sm:pt-8">
            <div
                aria-hidden
                className="pointer-events-none absolute -top-[24rem] -left-[20rem] size-[50rem] rounded-full bg-[radial-gradient(circle,transparent_40%,#FFE4A3_46%,#F7B600_51%,#F15E00_58%,transparent_67%)] blur-[40px]"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute -right-40 bottom-0 size-[30rem] rounded-full bg-[#F15E00]/10 blur-[100px]"
            />

            <div className="relative mx-auto flex w-full max-w-4xl flex-col gap-6">
                <header className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <img src={logoIcon} alt="" className="h-10 w-auto" />
                        <span className="text-sm leading-tight font-extrabold tracking-wide uppercase">
                            Marinduque
                            <br />
                            <span className="text-white/70">
                                Innovation Fest
                            </span>
                        </span>
                    </div>
                    <LogoutButton festId={participant.festId} />
                </header>

                <div className="flex flex-col gap-1 pt-2">
                    <p className="text-xs font-semibold tracking-[0.2em] text-[#F7B600] uppercase">
                        Welcome back
                    </p>
                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                        Hi, {participant.firstName}!
                    </h1>
                </div>

                <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:items-start">
                    <FestPass participant={participant} />

                    <div className="flex flex-col gap-6">
                        <PointsSummary stats={stats} />
                        <PointsHistory visits={visits} bonuses={bonuses} />
                    </div>
                </div>
            </div>
        </div>
    </>
);

export default VisitorsHome;
