import CampusSidebar from "@/components/CampusSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import RealtimeFeed from "@/components/RealtimeFeed";
import { Badge } from "@/components/ui/badge";
import { Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

// ─── SLRTCE, Kanakia Road, Mira Road East, Thane – 401107 ───────────────────
const COLLEGE_LAT = 19.2840;
const COLLEGE_LNG = 72.8710;
const REFRESH_INTERVAL = 45000; // 45 seconds
// ─────────────────────────────────────────────────────────────────────────────

const recentSessions = [
  { id: "S-001", room: "CR-101", course: "CS-101", date: "Apr 10", present: 32, total: 35, proxies: 1 },
  { id: "S-002", room: "CR-103", course: "ECE-201", date: "Apr 9", present: 28, total: 30, proxies: 0 },
  { id: "S-003", room: "CR-106", course: "ME-301", date: "Apr 9", present: 40, total: 45, proxies: 2 },
  { id: "S-004", room: "CR-108", course: "PHY-102", date: "Apr 8", present: 25, total: 28, proxies: 0 },
];

function generateQRPayload(sessionId: string): string {
  return JSON.stringify({
    sessionId,
    lat: COLLEGE_LAT,
    lng: COLLEGE_LNG,
    expiresAt: Date.now() + REFRESH_INTERVAL,
  });
}

const Attendance = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [qrValue, setQrValue] = useState<string>("");
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL / 1000);
  const [timeLeft, setTimeLeft] = useState(600);
  const [isActive, setIsActive] = useState(false);
  const [intervalRef, setIntervalRef] = useState<ReturnType<typeof setInterval> | null>(null);
  const [countdownRef, setCountdownRef] = useState<ReturnType<typeof setInterval> | null>(null);

  const startSession = () => {
    const newSession = "CS101-" + Date.now();
    setSessionId(newSession);
    setTimeLeft(600);
    setIsActive(true);
    setCountdown(REFRESH_INTERVAL / 1000);
    setQrValue(generateQRPayload(newSession));
    localStorage.setItem("active_session", newSession);

    // QR rotation every 45s
    const qrInterval = setInterval(() => {
      setQrValue(generateQRPayload(newSession));
      setCountdown(REFRESH_INTERVAL / 1000);
    }, REFRESH_INTERVAL);
    setIntervalRef(qrInterval);

    // Countdown ticker
    const cdInterval = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? REFRESH_INTERVAL / 1000 : prev - 1));
    }, 1000);
    setCountdownRef(cdInterval);
  };

  const endSession = () => {
    setSessionId(null);
    setQrValue("");
    setIsActive(false);
    setTimeLeft(0);
    if (intervalRef) clearInterval(intervalRef);
    if (countdownRef) clearInterval(countdownRef);
    localStorage.removeItem("active_session");
  };

  // Session timer (10 mins)
  useEffect(() => {
    if (!isActive) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { endSession(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isActive]);

  // Cleanup on unmounting
  useEffect(() => {
    return () => {
      if (intervalRef) clearInterval(intervalRef);
      if (countdownRef) clearInterval(countdownRef);
    };
  }, [intervalRef, countdownRef]);

  return (
      <div className="flex min-h-screen">
        <CampusSidebar />

        <main className="flex-1 p-6 overflow-auto">
          <DashboardHeader />

          <Badge variant="outline" className="mb-4 text-xs text-muted-foreground border-border">
            Attendance Management
          </Badge>

          {/* SESSION SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">

            {/* LEFT PANEL — QR Generator */}
            <div className="bg-card rounded-xl border border-border p-6 text-center">
              <h2 className="text-lg font-semibold mb-4">Live Session</h2>

              {!isActive ? (
                  <Button onClick={startSession}>Start Session</Button>
              ) : (
                  <>
                    <p className="text-sm text-green-500 mb-1">● Session Active</p>
                    <p className="text-xs text-muted-foreground mb-1">
                      Session ends in: <span className="font-semibold">{timeLeft}s</span>
                    </p>
                    <p className="text-xs text-muted-foreground mb-3 font-mono">{sessionId}</p>

                    {/* QR Code with embedded lat/lng */}
                    {qrValue && (
                        <div className="flex flex-col items-center mt-2 mb-4">
                          <p className="text-sm text-muted-foreground mb-2">Scan to mark attendance</p>
                          <div className="bg-white p-4 rounded-xl shadow-md">
                            <QRCodeSVG
                                value={qrValue}
                                size={180}
                                bgColor="#ffffff"
                                fgColor="#000000"
                                level="M"
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Refreshes in <span className="text-yellow-500 font-semibold">{countdown}s</span>
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            📍 SLRTCE, Mira Road East
                          </p>
                        </div>
                    )}

                    <Button variant="destructive" onClick={endSession}>End Session</Button>
                  </>
              )}
            </div>

            {/* RIGHT PANEL — Realtime Feed */}
            <RealtimeFeed />
          </div>

          {/* SESSION HISTORY */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-foreground font-semibold text-lg">Session History</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="border-border text-muted-foreground gap-1">
                  <Filter className="h-3.5 w-3.5" /> Filter
                </Button>
                <Button variant="outline" size="sm" className="border-border text-muted-foreground gap-1">
                  <Download className="h-3.5 w-3.5" /> Export
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                <tr className="border-b border-border">
                  <th className="py-3 pr-4 text-left">Session</th>
                  <th className="py-3 pr-4 text-left">Room</th>
                  <th className="py-3 pr-4 text-left">Course</th>
                  <th className="py-3 pr-4 text-left">Date</th>
                  <th className="py-3 pr-4 text-left">Attendance</th>
                  <th className="py-3 text-left">Proxies</th>
                </tr>
                </thead>
                <tbody>
                {recentSessions.map((s) => (
                    <tr key={s.id} className="border-b border-border/50 last:border-0">
                      <td className="py-3 pr-4">{s.id}</td>
                      <td className="py-3 pr-4">{s.room}</td>
                      <td className="py-3 pr-4">{s.course}</td>
                      <td className="py-3 pr-4">{s.date}</td>
                      <td className="py-3 pr-4">{s.present}/{s.total}</td>
                      <td className="py-3">{s.proxies}</td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
  );
};

export default Attendance;