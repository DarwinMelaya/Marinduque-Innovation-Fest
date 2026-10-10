import { router } from '@inertiajs/react';
import { Camera, CircleAlert, CircleCheck } from 'lucide-react';
import type QrScanner from 'qr-scanner';
import { useEffect, useEffectEvent, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
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
import { store } from '@/routes/booth/visits';
import type { BoothVisit } from '@/types';

type ScanResult =
    | { type: 'success'; visit: BoothVisit }
    | { type: 'error'; message: string };

/** The camera keeps seeing the same QR code after a scan; ignore it for this long instead of re-submitting. */
const REPEAT_SCAN_MS = 4000;

function cameraErrorMessage() {
    return window.isSecureContext
        ? "Couldn't open the camera. Allow camera access, or type the fest ID below."
        : 'The camera only works over HTTPS. Type the fest ID below instead.';
}

function VisitorScanner() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const busy = useRef(false);
    const lastScan = useRef<{ code: string; at: number } | null>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState<ScanResult | null>(null);
    const [manualId, setManualId] = useState('');

    const record = (festId: string) => {
        const code = festId.trim();
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
            { fest_id: code },
            {
                preserveScroll: true,
                preserveState: true,
                onFlash: (flash) => {
                    const visit = (flash as { visit?: BoothVisit }).visit;

                    if (visit) {
                        setResult({ type: 'success', visit });
                        setManualId('');
                    }
                },
                onError: (errors) =>
                    setResult({
                        type: 'error',
                        message:
                            errors.fest_id ?? "Couldn't record this visit.",
                    }),
                onFinish: () => {
                    busy.current = false;
                    setProcessing(false);
                },
            },
        );
    };

    const onScan = useEffectEvent((code: string) => record(code));

    useEffect(() => {
        const video = videoRef.current;
        let scanner: QrScanner | null = null;
        let cancelled = false;

        if (!video) {
            return;
        }

        import('qr-scanner')
            .then(({ default: Scanner }) => {
                if (cancelled) {
                    return;
                }

                scanner = new Scanner(video, (scan) => onScan(scan.data), {
                    preferredCamera: 'environment',
                    maxScansPerSecond: 5,
                    returnDetailedScanResult: true,
                });

                return scanner.start();
            })
            .catch(() => {
                if (!cancelled) {
                    setCameraError(cameraErrorMessage());
                }
            });

        return () => {
            cancelled = true;
            scanner?.destroy();
        };
    }, []);

    const submitManual = (event: FormEvent) => {
        event.preventDefault();
        lastScan.current = null;
        record(manualId);
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
                    <div className="flex items-start gap-3 rounded-2xl border border-[#229D1C]/40 bg-[#229D1C]/10 px-4 py-3">
                        <CircleCheck className="mt-0.5 size-5 shrink-0 text-[#6FD66A]" />
                        <div>
                            <p className="font-bold">{result.visit.name}</p>
                            <p className="text-sm text-white/60">
                                {result.visit.festId} ·{' '}
                                {result.visit.municipality} · Visit recorded
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
                        Point the camera at the visitor's QR code.
                    </p>
                )}
            </div>

            <form onSubmit={submitManual} className="flex gap-2">
                <Input
                    value={manualId}
                    onChange={(event) => setManualId(event.target.value)}
                    placeholder="Or type the fest ID, e.g. MIF2026-00001"
                    aria-label="Fest ID"
                    maxLength={50}
                    className="h-11 rounded-lg border-white/15 bg-white/5 text-white placeholder:text-white/40 focus-visible:border-[#F7B600] focus-visible:ring-[#F7B600]/30"
                />
                <Button
                    type="submit"
                    disabled={processing || !manualId.trim()}
                    className="h-11 rounded-full bg-white/10 px-5 font-bold text-white hover:bg-white/20"
                >
                    Record
                </Button>
            </form>
        </div>
    );
}

const ScanVisitor = () => (
    <Dialog>
        <DialogTrigger asChild>
            <Button className="h-14 w-full rounded-full bg-[#F15E00] px-8 text-base font-bold tracking-wide text-white uppercase hover:bg-[#FA0A00] sm:w-auto">
                <Camera className="size-5" />
                Scan visitor
            </Button>
        </DialogTrigger>

        <DialogContent className="rounded-3xl border-white/10 bg-neutral-950 text-white sm:max-w-md">
            <DialogHeader>
                <DialogTitle className="text-xl font-black tracking-tight uppercase">
                    Scan visitor
                </DialogTitle>
                <DialogDescription className="text-white/60">
                    Each participant is counted once per day at your booth.
                </DialogDescription>
            </DialogHeader>

            <VisitorScanner />
        </DialogContent>
    </Dialog>
);

export default ScanVisitor;
