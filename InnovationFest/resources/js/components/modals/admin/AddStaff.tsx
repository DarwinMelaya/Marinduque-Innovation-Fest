import { Form } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
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
import { store } from '@/routes/admin/staff';

export const INPUT_CLASS =
    'h-11 rounded-lg border-white/15 bg-white/5 text-white placeholder:text-white/40 focus-visible:border-[#F7B600] focus-visible:ring-[#F7B600]/30';

/** Mirrors User::MAX_SCAN_POINTS. */
export const MAX_SCAN_POINTS = 1000;

/** Mirrors User::staffPassword() so admins can see the password before saving. */
function defaultPassword(boothName: string) {
    return `${boothName.replace(/\s+/g, '')}123`;
}

const AddStaff = () => {
    const [open, setOpen] = useState(false);
    const [boothName, setBoothName] = useState('');

    const handleOpenChange = (next: boolean) => {
        setOpen(next);

        if (!next) {
            setBoothName('');
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button className="h-11 rounded-full bg-[#F15E00] px-5 text-sm font-bold tracking-wide text-white uppercase hover:bg-[#FA0A00]">
                    <Plus className="size-4" />
                    Add staff
                </Button>
            </DialogTrigger>

            <DialogContent className="rounded-3xl border-white/10 bg-neutral-950 text-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black tracking-tight uppercase">
                        Add staff
                    </DialogTitle>
                    <DialogDescription className="text-white/60">
                        Create an account for the person manning a booth.
                    </DialogDescription>
                </DialogHeader>

                <Form
                    {...store.form()}
                    resetOnSuccess
                    disableWhileProcessing
                    onSuccess={() => handleOpenChange(false)}
                    className="flex flex-col gap-5"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="booth_name">Booth name</Label>
                                <Input
                                    id="booth_name"
                                    name="booth_name"
                                    required
                                    autoFocus
                                    maxLength={100}
                                    value={boothName}
                                    onChange={(event) =>
                                        setBoothName(event.target.value)
                                    }
                                    placeholder="e.g. DOST Booth"
                                    className={INPUT_CLASS}
                                />
                                <InputError message={errors.booth_name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="name">Staff name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    required
                                    maxLength={255}
                                    placeholder="e.g. Juan Dela Cruz"
                                    className={INPUT_CLASS}
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="scan_points">
                                    Points per scan
                                </Label>
                                <Input
                                    id="scan_points"
                                    name="scan_points"
                                    type="number"
                                    required
                                    min={0}
                                    max={MAX_SCAN_POINTS}
                                    defaultValue={10}
                                    className={INPUT_CLASS}
                                />
                                <p className="text-xs text-white/50">
                                    Points a participant earns each time this
                                    booth scans them.
                                </p>
                                <InputError message={errors.scan_points} />
                            </div>

                            <div className="grid gap-2">
                                <span className="text-sm font-medium">
                                    Password
                                </span>
                                <p className="flex h-11 items-center rounded-lg border border-dashed border-white/15 px-3 font-mono text-sm text-[#F7B600]">
                                    {boothName.trim()
                                        ? defaultPassword(boothName)
                                        : 'Booth name + 123'}
                                </p>
                                <p className="text-xs text-white/50">
                                    Generated automatically from the booth name.
                                </p>
                            </div>

                            <DialogFooter className="gap-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => handleOpenChange(false)}
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
                                    Save staff
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default AddStaff;
