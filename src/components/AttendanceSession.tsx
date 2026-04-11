import { useState, useEffect, useRef } from "react";
import { QrCode, StopCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import VerbalPinDisplay from "@/components/VerbalPinDisplay";

const SESSION_ID = "CS101-" + Date.now();
const REFRESH_INTERVAL = 30_000; // QR rotates every 30s (PIN rotates every 60s independently)

// ─── SLRTCE, Kanakia Road, Mira Road East, Thane – 401107 ────────────────────
const COLLEGE_LAT = 19.2840;
const COLLEGE_LNG = 72.8710;
// ─────────────────────────────────────────────────────────────────────────────

function generateQRData(sessionId: string): string {
    const payload = {
        sessionId,
        lat: COLLEGE_LAT,
        lng: COLLEGE_LNG,
        expiresAt: Date.now() + REFRESH_INTERVAL,
    };
    return JSON.stringify(payload);
}

const AttendanceSession = () => {
    const [active, setActive] = useState(false);
    const [qrValue, setQrValue] = useState<string>("");
    const [countdown, setCountdown] = useState(REFRESH_INTERVAL / 1000);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const startSession = () => {
        setQrValue(generateQRData(SESSION_ID));
        setActive(true);
        setCountdown(REFRESH_INTERVAL / 1000);
        localStorage.setItem("active_session", SESSION_ID);

        // QR rotation
        intervalRef.current = setInterval(() => {
            setQrValue(generateQRData(SESSION_ID));
            setCountdown(REFRESH_INTERVAL / 1000);
        }, REFRESH_INTERVAL);

        // QR countdown ticker
        countdownRef.current = setInterval(() => {
            setCountdown((prev) => (prev <= 1 ? REFRESH_INTERVAL / 1000 : prev - 1));
        }, 1000);
    };

    const stopSession = () => {
        setActive(false);
        setQrValue("");
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (countdownRef.current) clearInterval(countdownRef.current);
        localStorage.removeItem("active_session");
    };

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (countdownRef.current) clearInterval(countdownRef.current);
        };
    }, []);

    return (
        <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-2 mb-1">
                <QrCode className="h-5 w-5 text-primary" />
                <h2 className="text-foreground font-semibold">Attendance Session</h2>
            </div>
            <p className="text-muted-foreground text-sm mb-6">
                {active
                    ? "Session active — QR rotates every 30s, PIN rotates every 60s"
                    : "Start a session to generate QR code and verbal PIN"}
            </p>

            <div className="flex flex-col items-center py-4 gap-6">
                {active && qrValue ? (
                    <>
                        {/* QR + PIN side by side on larger screens, stacked on mobile */}
                        <div className="flex flex-col lg:flex-row items-center gap-6 w-full">

                            {/* QR Code panel */}
                            <div className="flex flex-col items-center gap-3 flex-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                                    Step 1 — Show this QR
                                </p>
                                <div className="bg-white p-3 rounded-xl shadow-md">
                                    <QRCodeSVG
                                        value={qrValue}
                                        size={160}
                                        bgColor="#ffffff"
                                        fgColor="#000000"
                                        level="M"
                                    />
                                </div>
                                <p className="text-muted-foreground text-xs">
                                    QR refreshes in{" "}
                                    <span className="text-warning font-semibold">{countdown}s</span>
                                </p>
                            </div>

                            {/* Divider */}
                            <div className="hidden lg:flex flex-col items-center gap-2 text-muted-foreground/40 select-none">
                                <div className="w-px h-16 bg-border" />
                                <span className="text-xs">+</span>
                                <div className="w-px h-16 bg-border" />
                            </div>

                            {/* Verbal PIN panel */}
                            <div className="flex flex-col items-center gap-3 flex-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                                    Step 2 — Read this aloud
                                </p>
                                <VerbalPinDisplay sessionId={SESSION_ID} />
                            </div>
                        </div>

                        {/* Session info */}
                        <div className="text-center">
                            <h3 className="text-foreground font-medium">Computer Science 101</h3>
                            <p className="text-muted-foreground text-sm mt-1">
                                Session:{" "}
                                <span className="text-primary font-mono text-xs">{SESSION_ID}</span>
                            </p>
                            <p className="text-muted-foreground text-xs mt-1">
                                📍 SLRTCE, Mira Road East
                            </p>
                        </div>

                        <Button
                            onClick={stopSession}
                            variant="outline"
                            className="border-destructive text-destructive hover:bg-destructive/10 gap-2"
                        >
                            <StopCircle className="h-4 w-4" />
                            Stop Session
                        </Button>
                    </>
                ) : (
                    <>
                        <div className="w-32 h-32 border-2 border-border rounded-xl flex items-center justify-center">
                            <QrCode className="h-16 w-16 text-muted-foreground/40" />
                        </div>
                        <h3 className="text-foreground font-medium">Computer Science 101</h3>
                        <p className="text-muted-foreground text-sm">
                            Click below to start attendance tracking
                        </p>
                        <Button
                            onClick={startSession}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                        >
                            <QrCode className="h-4 w-4" />
                            Start Session
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

export default AttendanceSession;