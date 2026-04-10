import { useState, useEffect, useRef } from "react";
import { QrCode, StopCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";

const SESSION_ID = "CS101-" + Date.now();
const REFRESH_INTERVAL = 45000; // 45 seconds

// Teacher's fixed demo location (can be replaced with real geolocation)
const TEACHER_LAT = 19.076;
const TEACHER_LNG = 72.8777;

function generateQRData(sessionId: string): string {
    const payload = {
        sessionId,
        lat: TEACHER_LAT,
        lng: TEACHER_LNG,
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
        const initial = generateQRData(SESSION_ID);
        setQrValue(initial);
        setActive(true);
        setCountdown(REFRESH_INTERVAL / 1000);

        // Store session info for RealtimeFeed
        localStorage.setItem("active_session", SESSION_ID);

        // QR rotation
        intervalRef.current = setInterval(() => {
            setQrValue(generateQRData(SESSION_ID));
            setCountdown(REFRESH_INTERVAL / 1000);
        }, REFRESH_INTERVAL);

        // Countdown ticker
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
                {active ? "Session active – QR rotates every 45 seconds" : "Start a session to generate QR code"}
            </p>

            <div className="flex flex-col items-center py-4">
                {active && qrValue ? (
                    <>
                        {/* White background wrapper so QR is always visible */}
                        <div className="bg-white p-3 rounded-xl mb-4 shadow-md">
                            <QRCodeSVG
                                value={qrValue}
                                size={160}
                                bgColor="#ffffff"
                                fgColor="#000000"
                                level="M"
                            />
                        </div>
                        <h3 className="text-foreground font-medium">Computer Science 101</h3>
                        <p className="text-muted-foreground text-sm mt-1">
                            Session: <span className="text-primary font-mono text-xs">{SESSION_ID}</span>
                        </p>
                        <p className="text-muted-foreground text-xs mt-1 mb-4">
                            QR refreshes in{" "}
                            <span className="text-warning font-semibold">{countdown}s</span>
                        </p>
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
                        <div className="w-32 h-32 border-2 border-border rounded-xl flex items-center justify-center mb-4">
                            <QrCode className="h-16 w-16 text-muted-foreground/40" />
                        </div>
                        <h3 className="text-foreground font-medium">Computer Science 101</h3>
                        <p className="text-muted-foreground text-sm mt-1 mb-4">
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