import { Head } from '@inertiajs/react';
import { index as qrCodesIndex } from '@/routes/admin/qr-codes';

const GenerateQrCode = () => {
    return (
        <>
            <Head title="Generate QR Code" />
            <div>GenerateQrCode</div>
        </>
    );
};

GenerateQrCode.layout = {
    breadcrumbs: [
        {
            title: 'Generate QR Code',
            href: qrCodesIndex(),
        },
    ],
};

export default GenerateQrCode;
