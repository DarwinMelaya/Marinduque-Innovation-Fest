import { Form } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { INPUT_CLASS, MAX_SCAN_POINTS } from '@/components/modals/admin/AddStaff';
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
    staffId: number;
    boothName: string;
    scanPoints: number;
};

const EditStaffPoints = ({ staffId, boothName, scanPoints }: Props) => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    aria-label={`Edit points for ${boothName}`}
                    className="h-8 rounded-full px-3 text-white/70 hover:bg-white/10 hover:text-white"
                >
                    <Pencil className="size-3.5" />
                    Edit
                </Button>
            </DialogTrigger>

            <DialogContent className="rounded-3xl border-white/10 bg-neutral-950 text-white sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black tracking-tight uppercase">
                        Points per scan
                    </DialogTitle>
                    <DialogDescription className="text-white/60">
                        Points a participant earns each time {boothName} scans
                        them. Visits already recorded keep their points.
                    </DialogDescription>
                </DialogHeader>

                <Form
                    {...update.form(staffId)}
                    disableWhileProcessing
                    onSuccess={() => setOpen(false)}
                    className="flex flex-col gap-5"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor={`scan_points_${staffId}`}>
                                    Points
                                </Label>
                                <Input
                                    id={`scan_points_${staffId}`}
                                    name="scan_points"
                                    type="number"
                                    required
                                    autoFocus
                                    min={0}
                                    max={MAX_SCAN_POINTS}
                                    defaultValue={scanPoints}
                                    className={INPUT_CLASS}
                                />
                                <InputError message={errors.scan_points} />
                            </div>

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
                                    Save points
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default EditStaffPoints;
