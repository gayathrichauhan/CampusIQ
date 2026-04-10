import { QRCodeSVG } from "qrcode.react";

type Props = {
    qrData: {
        sessionId: string;
        token: string;
        expiresAt: number;
    };
};

export default function QRGenerator({ qrData }: Props) {
    return (
        <div className="flex flex-col items-center mt-4">
            <h2 className="text-sm mb-2">Scan to mark attendance</h2>

            <div className="bg-white p-4 rounded-xl shadow">
                <QRCodeSVG
                    value={JSON.stringify(qrData)}
                    size={200}
                />
            </div>
        </div>
    );
}