import type QrScanner from 'qr-scanner';
import { useEffect, useEffectEvent, useRef, useState } from 'react';

/**
 * Stream the back camera into the returned video element and call `onScan` with every QR code it reads.
 * `fallback` tells the user what to do instead when the camera can't be opened, e.g. "type the code below".
 */
export function useQrCamera(onScan: (code: string) => void, fallback: string) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const handleScan = useEffectEvent(onScan);
    const fallbackMessage = useEffectEvent(() =>
        window.isSecureContext
            ? `Couldn't open the camera. Allow camera access, or ${fallback}.`
            : `The camera only works over HTTPS. ${fallback.charAt(0).toUpperCase()}${fallback.slice(1)} instead.`,
    );

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

                scanner = new Scanner(video, (scan) => handleScan(scan.data), {
                    preferredCamera: 'environment',
                    maxScansPerSecond: 5,
                    returnDetailedScanResult: true,
                });

                return scanner.start();
            })
            .catch(() => {
                if (!cancelled) {
                    setCameraError(fallbackMessage());
                }
            });

        return () => {
            cancelled = true;
            scanner?.destroy();
        };
    }, []);

    return { videoRef, cameraError };
}
