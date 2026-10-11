import { Download, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { qr } from "@/routes/admin/participants";

type Props = {
    participant: {
        id: number;
        festId: string;
        name: string;
    };
};

const ViewParticipantQr = ({ participant }: Props) => (
    <Dialog>
        <DialogTrigger asChild>
            <Button
                variant="ghost"
                size="sm"
                aria-label={`View QR code of ${participant.name}`}
                className="h-8 rounded-full px-3 text-[#F7B600] hover:bg-[#F7B600]/10 hover:text-[#F7B600]"
            >
                <QrCode className="size-3.5" />
                View QR
            </Button>
        </DialogTrigger>

        <DialogContent className="rounded-3xl border-white/10 bg-neutral-950 text-white sm:max-w-sm">
            <DialogHeader>
                <DialogTitle className="text-xl font-black tracking-tight">
                    {participant.name}
                </DialogTitle>
                <DialogDescription className="font-mono font-semibold text-[#F7B600]">
                    {participant.festId}
                </DialogDescription>
            </DialogHeader>

            <img
                src={qr.url(participant.id)}
                alt={`QR code for ${participant.festId}`}
                className="w-full rounded-2xl bg-white"
            />

            <Button
                asChild
                className="h-11 rounded-full bg-[#F15E00] font-bold text-white hover:bg-[#FA0A00]"
            >
                <a
                    href={qr.url(participant.id, {
                        query: { download: 1 },
                    })}
                    download={`${participant.festId}.png`}
                >
                    <Download className="size-4" />
                    Download
                </a>
            </Button>
        </DialogContent>
    </Dialog>
);

export default ViewParticipantQr;
