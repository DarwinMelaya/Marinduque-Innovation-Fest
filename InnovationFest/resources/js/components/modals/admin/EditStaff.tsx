import { Form } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import {
    INPUT_CLASS,
    MAX_SCAN_POINTS,
    defaultPassword,
} from '@/components/modals/admin/AddStaff';
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
import { update } from '@/routes/admin/staff';

type Props = {
    staff: {
        id: number;
        boothName: string;
        name: string;
        scanPoints: number;
    };
};

const EditStaff = ({ staff }: Props) => {
    const [open, setOpen] = useState(false);
    const [boothName, setBoothName] = useState(staff.boothName);

    const handleOpenChange = (next: boolean) => {
        setOpen(next);

        if (next) {
            setBoothName(staff.boothName);
        }
    };

    const boothRenamed = boothName.trim() !== staff.boothName;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    aria-label={`Edit ${staff.boothName}`}
                    className="h-8 rounded-full px-3 text-white/70 hover:bg-white/10 hover:text-white"
                >
                    <Pencil className="size-3.5" />
                    Edit
                </Button>
            </DialogTrigger>

            <DialogContent className="rounded-3xl border-white/10 bg-neutral-950 text-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black tracking-tight uppercase">
                        Edit staff
                    </DialogTitle>
                    <DialogDescription className="text-white/60">
                        Visits already recorded keep their points.
                    </DialogDescription>
                </DialogHeader>

                <Form
                    {...update.form(staff.id)}
                    disableWhileProcessing
                    onSuccess={() => setOpen(false)}
                    className="flex flex-col gap-5"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor={`booth_name_${staff.id}`}>
                                    Booth name
                                </Label>
                                <Input
                                    id={`booth_name_${staff.id}`}
                                    name="booth_name"
                                    required
                                    maxLength={100}
                                    value={boothName}
                                    onChange={(event) =>
                                        setBoothName(event.target.value)
                                    }
                                    className={INPUT_CLASS}
                                />
                                <InputError message={errors.booth_name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor={`name_${staff.id}`}>
                                    Staff name
                                </Label>
                                <Input
                                    id={`name_${staff.id}`}
                                    name="name"
                                    required
                                    maxLength={255}
                                    defaultValue={staff.name}
                                    className={INPUT_CLASS}
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor={`scan_points_${staff.id}`}>
                                    Points per scan
                                </Label>
                                <Input
                                    id={`scan_points_${staff.id}`}
                                    name="scan_points"
                                    type="number"
                                    required
                                    min={0}
                                    max={MAX_SCAN_POINTS}
                                    defaultValue={staff.scanPoints}
                                    className={INPUT_CLASS}
                                />
                                <InputError message={errors.scan_points} />
                            </div>

                            {boothRenamed && boothName.trim() && (
                                <p className="rounded-lg border border-[#F7B600]/30 bg-[#F7B600]/10 px-3 py-2 text-xs text-[#FFD66B]">
                                    Renaming the booth changes the password to{' '}
                                    <span className="font-mono font-bold">
                                        {defaultPassword(boothName)}
                                    </span>
                                    . Let the staff know.
                                </p>
                            )}

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
                                    Save changes
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default EditStaff;
