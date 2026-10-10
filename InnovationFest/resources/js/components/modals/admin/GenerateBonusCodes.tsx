import { Form } from '@inertiajs/react';
import { QrCode } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { INPUT_CLASS } from '@/components/modals/admin/AddStaff';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/admin/qr-codes';

type Props = {
    maxQuantity: number;
    maxPoints: number;
};

const GenerateBonusCodes = ({ maxQuantity, maxPoints }: Props) => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="h-11 rounded-full bg-[#F15E00] px-5 text-sm font-bold tracking-wide text-white uppercase hover:bg-[#FA0A00]">
                    <QrCode className="size-4" />
                    Generate QR codes
                </Button>
            </DialogTrigger>

            <DialogContent className="rounded-3xl border-white/10 bg-neutral-950 text-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black tracking-tight uppercase">
                        Generate QR codes
                    </DialogTitle>
                    <DialogDescription className="text-white/60">
                        Each code gives its points to the first visitor who
                        scans it, then stops working.
                    </DialogDescription>
                </DialogHeader>

                <Form
                    {...store.form()}
                    resetOnSuccess
                    disableWhileProcessing
                    onSuccess={() => setOpen(false)}
                    className="flex flex-col gap-5"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="label">Label</Label>
                                <Input
                                    id="label"
                                    name="label"
                                    required
                                    autoFocus
                                    maxLength={100}
                                    placeholder="e.g. Treasure hunt"
                                    className={INPUT_CLASS}
                                />
                                <p className="text-xs text-white/50">
                                    Printed on each code and shown to visitors.
                                </p>
                                <InputError message={errors.label} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="points">
                                        Points per code
                                    </Label>
                                    <Input
                                        id="points"
                                        name="points"
                                        type="number"
                                        required
                                        min={1}
                                        max={maxPoints}
                                        defaultValue={10}
                                        className={INPUT_CLASS}
                                    />
                                    <InputError message={errors.points} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="quantity">
                                        How many codes
                                    </Label>
                                    <Input
                                        id="quantity"
                                        name="quantity"
                                        type="number"
                                        required
                                        min={1}
                                        max={maxQuantity}
                                        defaultValue={20}
                                        className={INPUT_CLASS}
                                    />
                                    <InputError message={errors.quantity} />
                                </div>
                            </div>
                            <p className="-mt-3 text-xs text-white/50">
                                Up to {maxQuantity} codes at a time.
                            </p>

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
                                    className="h-11 rounded-full bg-[#F15E00] px-6 font-bold text-white hover:bg-[#FA0A00]"
                                >
                                    {processing && <Spinner />}
                                    Generate
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default GenerateBonusCodes;
