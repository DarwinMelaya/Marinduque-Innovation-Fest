import { router } from '@inertiajs/react';
import { ImageUp, UserRound } from 'lucide-react';
import { useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import InputError from '@/components/input-error';
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
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { authButtonClass, authInputClass, authLabelClass } from '@/lib/auth-styles';
import { login } from '@/routes/visitor';

const VisitorSignIn = () => {
    const fileInput = useRef<HTMLInputElement>(null);
    const [festId, setFestId] = useState('');
    const [error, setError] = useState<string | undefined>();
    const [processing, setProcessing] = useState(false);

    const signIn = (code: string) => {
        setError(undefined);
        setProcessing(true);

        router.post(
            login.url(),
            { fest_id: code },
            {
                onError: (errors) =>
                    setError(
                        errors.fest_id ??
                            Object.values(errors)[0] ??
                            "Couldn't open your account.",
                    ),
                onFinish: () => setProcessing(false),
            },
        );
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();
        signIn(festId);
    };

    const readQrImage = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = '';

        if (!file) {
            return;
        }

        setError(undefined);
        setProcessing(true);

        try {
            const { default: QrScanner } = await import('qr-scanner');
            const { data } = await QrScanner.scanImage(file, {
                returnDetailedScanResult: true,
            });

            setFestId(data);
            signIn(data);
        } catch {
            setProcessing(false);
            setError(
                "We couldn't find a QR code in that image. Try a clearer photo or type your ID.",
            );
        }
    };

    return (
        <Dialog onOpenChange={() => setError(undefined)}>
            <DialogTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    className="h-11 w-full rounded-lg border-white/15 bg-transparent font-semibold text-white hover:bg-white/5 hover:text-white sm:w-auto"
                >
                    <UserRound className="size-4" />
                    Open my account
                </Button>
            </DialogTrigger>

            <DialogContent className="dark rounded-3xl border-white/10 bg-[#0B0A0A] text-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold tracking-tight">
                        Open my account
                    </DialogTitle>
                    <DialogDescription className="text-white/60">
                        Enter your Innovation Fest ID or upload your QR code to
                        see your booth visits and points.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="flex flex-col gap-5">
                    <div className="grid gap-2">
                        <Label htmlFor="fest_id" className={authLabelClass}>
                            Innovation Fest ID
                        </Label>
                        <Input
                            id="fest_id"
                            name="fest_id"
                            required
                            autoFocus
                            autoComplete="off"
                            maxLength={50}
                            value={festId}
                            onChange={(event) => setFestId(event.target.value)}
                            placeholder="MIF2026-00001"
                            className={`font-mono uppercase placeholder:normal-case ${authInputClass}`}
                        />
                        <InputError message={error} />
                    </div>

                    <Button
                        type="submit"
                        disabled={processing || !festId.trim()}
                        className={authButtonClass}
                    >
                        {processing && <Spinner />}
                        Continue
                    </Button>

                    <div className="flex items-center gap-3 text-xs tracking-[0.2em] text-white/40 uppercase">
                        <span className="h-px flex-1 bg-white/10" />
                        or
                        <span className="h-px flex-1 bg-white/10" />
                    </div>

                    <input
                        ref={fileInput}
                        type="file"
                        accept="image/*"
                        onChange={readQrImage}
                        className="sr-only"
                        tabIndex={-1}
                        aria-hidden
                    />
                    <Button
                        type="button"
                        variant="outline"
                        disabled={processing}
                        onClick={() => fileInput.current?.click()}
                        className="h-11 w-full rounded-lg border-white/15 bg-white/5 font-semibold text-white hover:bg-white/10 hover:text-white"
                    >
                        <ImageUp className="size-4" />
                        Upload QR code
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default VisitorSignIn;
