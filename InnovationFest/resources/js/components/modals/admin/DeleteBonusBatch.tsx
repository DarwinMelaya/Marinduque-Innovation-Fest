import { Form } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { destroy } from '@/routes/admin/qr-codes';

type Props = {
    batch: {
        id: number;
        label: string;
        codes: number;
        redeemed: number;
    };
};

const DeleteBonusBatch = ({ batch }: Props) => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    aria-label={`Delete ${batch.label}`}
                    className="h-8 rounded-full px-3 text-red-400/80 hover:bg-red-500/10 hover:text-red-400"
                >
                    <Trash2 className="size-3.5" />
                    Delete
                </Button>
            </DialogTrigger>

            <DialogContent className="rounded-3xl border-white/10 bg-neutral-950 text-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black tracking-tight uppercase">
                        Delete QR codes?
                    </DialogTitle>
                    <DialogDescription className="text-white/60">
                        All {batch.codes.toLocaleString('en-PH')}{' '}
                        <span className="font-semibold text-white">
                            {batch.label}
                        </span>{' '}
                        codes will stop working, including printed ones. This
                        cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                {batch.redeemed > 0 && (
                    <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                        {batch.redeemed.toLocaleString('en-PH')}{' '}
                        {batch.redeemed === 1
                            ? 'visitor already scanned a code'
                            : 'visitors already scanned these codes'}{' '}
                        and will lose those bonus points.
                    </p>
                )}

                <Form
                    {...destroy.form(batch.id)}
                    disableWhileProcessing
                    onSuccess={() => setOpen(false)}
                >
                    {({ processing }) => (
                        <DialogFooter className="gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setOpen(false)}
                                className="h-11 rounded-full text-white/80 hover:bg-white/10 hover:text-white"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="h-11 rounded-full bg-red-600 px-6 font-bold text-white hover:bg-red-700"
                            >
                                {processing && <Spinner />}
                                Delete codes
                            </Button>
                        </DialogFooter>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteBonusBatch;
