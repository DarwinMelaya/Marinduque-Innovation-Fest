import { Camera } from "lucide-react";
import AttendanceScanner from "@/components/attendance/AttendanceScanner";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { store } from "@/routes/admin/attendance";

const ScanAttendance = () => (
    <Dialog>
        <DialogTrigger asChild>
            <Button className="h-11 rounded-full bg-[#F15E00] px-6 text-sm font-bold tracking-wide text-white uppercase hover:bg-[#FA0A00]">
                <Camera className="size-5" />
                Scan attendance
            </Button>
        </DialogTrigger>

        <DialogContent className="rounded-3xl border-white/10 bg-neutral-950 text-white sm:max-w-md">
            <DialogHeader>
                <DialogTitle className="text-xl font-black tracking-tight uppercase">
                    Scan attendance
                </DialogTitle>
                <DialogDescription className="text-white/60">
                    Each participant can check in once per day.
                </DialogDescription>
            </DialogHeader>

            <AttendanceScanner action={store.url()} />
        </DialogContent>
    </Dialog>
);

export default ScanAttendance;
