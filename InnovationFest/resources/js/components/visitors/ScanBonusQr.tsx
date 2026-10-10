import { router } from '@inertiajs/react';
import { CircleAlert, Gift, ScanLine } from 'lucide-react';
import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { useQrCamera } from '@/hooks/use-qr-camera';
import { store } from '@/routes/visitor/bonus';

type Bonus = { label: string; points: number };

type ScanResult =
    { type: 'success'; bonus: Bonus } | { type: 'error'; message: string };

/** The camera keeps seeing the same QR code after a scan; ignore it for this long instead of re-submitting. */
const REPEAT_SCAN_MS = 4000;

const FOCUS_RING =
    'focus-visible:ring-2 focus-visible:ring-[#F7B600] focus-visible:outline-none';

function BonusScanner() {
    const busy = useRef(false);
    const lastScan = useRef<{ code: string; at: number } | null>(null);
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState<ScanResult | null>(null);
    const [manualCode, setManualCode] = useState('');

    const redeem = (value: string) => {
        const code = value.trim();
        const now = Date.now();

        if (!code || busy.current) {
            return;
        }

        if (
            lastScan.current?.code === code &&
            now - lastScan.current.at < REPEAT_SCAN_MS
        ) {
            return;
        }

        lastScan.current = { code, at: now };
        busy.current = true;
        setProcessing(true);

        router.post(
            store.url(),
            { code },
            {
                preserveScroll: true,
                preserveState: true,
                onFlash: (flash) => {
                    const bonus = (flash as { bonus?: Bonus }).bonus;

                    if (bonus) {
                        setResult({ type: 'success', bonus });
                        setManualCode('');
                    }
                },
                onError: (errors) =>
                    setResult({
                        type: 'error',
                        message:
                            errors.code ??
                            Object.values(errors)[0] ??
                            "Couldn't scan this QR code.",
                    }),
                onFinish: () => {
                    busy.current = false;
                    setProcessing(false);
                },
            },
        );
    };

    const { videoRef, cameraError } = useQrCamera(
        redeem,
        'type the code printed under the QR code',
    );

    const submitManual = (event: FormEvent) => {
        event.preventDefault();
        lastScan.current = null;
        redeem(manualCode);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black">
                <video
                    ref={videoRef}
                    muted
                    playsInline
                    className="aspect-square w-full object-cover"
                />
                {cameraError ? (
                    <p className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-white/70">
                        {cameraError}
                    </p>
                ) : (
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-[15%] rounded-2xl border-2 border-[#F7B600] shadow-[0_0_0_100vmax_rgb(0_0_0/0.35)]"
                    />
                )}
            </div>

            <div aria-live="polite" className="min-h-16">
                {processing ? (
                    <p className="flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm text-white/70">
                        <Spinner />
                        Checking…
                    </p>
                ) : result?.type === 'success' ? (
                    <div className="flex items-center gap-3 rounded-2xl border border-[#F7B600]/40 bg-[#F7B600]/10 px-4 py-3">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#F7B600]/20 text-[#F7B600]">
                            <Gift className="size-5" />
                        </span>
                        <div className="min-w-0">
                            <p className="text-lg font-black text-[#F7B600]">
                                +{result.bonus.points} points!
                            </p>
                            <p className="truncate text-sm text-white/70">
                                {result.bonus.label}
                            </p>
                        </div>
                    </div>
                ) : result?.type === 'error' ? (
                    <p className="flex items-start gap-3 rounded-2xl border border-[#FA0A00]/40 bg-[#FA0A00]/10 px-4 py-3 text-sm">
                        <CircleAlert className="mt-0.5 size-5 shrink-0 text-[#FF6B5F]" />
                        {result.message}
                    </p>
                ) : (
                    <p className="px-1 py-3 text-sm text-white/50">
                        Point the camera at a bonus QR code. Each code can only
                        be scanned once.
                    </p>
                )}
            </div>

            <form onSubmit={submitManual} className="flex gap-2">
                <Input
                    value={manualCode}
                    onChange={(event) => setManualCode(event.target.value)}
                    placeholder="Or type the code, e.g. MIFB-ABCD234567"
                    aria-label="Bonus code"
                    autoComplete="off"
                    maxLength={50}
                    className="h-11 rounded-lg border-white/15 bg-white/5 font-mono text-white uppercase placeholder:font-sans placeholder:normal-case placeholder:text-white/40 focus-visible:border-[#F7B600] focus-visible:ring-[#F7B600]/30"
                />
                <button
                    type="submit"
                    disabled={processing || !manualCode.trim()}
                    className={`h-11 shrink-0 rounded-lg bg-white/10 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/20 disabled:opacity-50 ${FOCUS_RING}`}
                >
                    Claim
                </button>
            </form>
        </div>
    );
}

const ScanBonusQr = () => (
    <Dialog>
        <DialogTrigger asChild>
            <button
                type="button"
                className={`inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[#F7B600]/40 bg-[#F7B600]/10 text-sm font-bold text-[#FFD66B] transition-colors hover:bg-[#F7B600]/20 ${FOCUS_RING}`}
            >
                <ScanLine className="size-5" />
                Scan bonus QR code
            </button>
        </DialogTrigger>

        <DialogContent className="dark max-h-[calc(100svh-2rem)] overflow-y-auto rounded-3xl border-white/10 bg-[#0B0A0A] text-white sm:max-w-md">
            <DialogHeader>
                <DialogTitle className="text-xl font-semibold tracking-tight">
                    Scan bonus QR code
                </DialogTitle>
                <DialogDescription className="text-white/60">
                    Found a bonus QR code around the fest? Scan it for extra
                    points.
                </DialogDescription>
            </DialogHeader>

            <BonusScanner />
        </DialogContent>
    </Dialog>
);

export default ScanBonusQr;
