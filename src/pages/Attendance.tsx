import CampusSidebar from "@/components/CampusSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import RealtimeFeed from "@/components/RealtimeFeed";
import { Badge } from "@/components/ui/badge";
import { Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import QRGenerator from "@/components/QRGenerator";

const recentSessions = [
  { id: "S-001", room: "CR-101", course: "CS-101", date: "Apr 10", present: 32, total: 35, proxies: 1 },
  { id: "S-002", room: "CR-103", course: "ECE-201", date: "Apr 9", present: 28, total: 30, proxies: 0 },
  { id: "S-003", room: "CR-106", course: "ME-301", date: "Apr 9", present: 40, total: 45, proxies: 2 },
  { id: "S-004", room: "CR-108", course: "PHY-102", date: "Apr 8", present: 25, total: 28, proxies: 0 },
];

type QRData = {
  sessionId: string;
  token: string;
  expiresAt: number;
};

const Attendance = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [qrData, setQrData] = useState<QRData | null>(null);
  const [timeLeft, setTimeLeft] = useState(600);
  const [isActive, setIsActive] = useState(false);

  // 🚀 Start session
  const startSession = () => {
    const newSession = "SESSION_" + Date.now();
    setSessionId(newSession);
    setTimeLeft(600);
    setIsActive(true);
  };

  // 🛑 End session manually (extra control)
  const endSession = () => {
    setSessionId(null);
    setQrData(null);
    setIsActive(false);
    setTimeLeft(0);
  };

  // 🔁 QR GENERATION + ROTATION
  useEffect(() => {
    if (!sessionId) return;

    const generateQR = () => {
      const newQR: QRData = {
        sessionId,
        token: Math.random().toString(36).substring(2, 10),
        expiresAt: Date.now() + 45000,
      };

      setQrData(newQR);
    };

    generateQR(); // instant first QR
    const interval = setInterval(generateQR, 45000);

    return () => clearInterval(interval);
  }, [sessionId]);

  // ⏳ SESSION TIMER (10 mins)
  useEffect(() => {
    if (!sessionId) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionId]);

  return (
      <div className="flex min-h-screen">
        <CampusSidebar />

        <main className="flex-1 p-6 overflow-auto">
          <DashboardHeader />

          <Badge variant="outline" className="mb-4 text-xs text-muted-foreground border-border">
            Attendance Management
          </Badge>

          {/* 🔥 SESSION SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">

            {/* LEFT PANEL */}
            <div className="bg-card rounded-xl border border-border p-6 text-center">
              <h2 className="text-lg font-semibold mb-4">Live Session</h2>

              {!isActive ? (
                  <Button onClick={startSession}>
                    Start Session
                  </Button>
              ) : (
                  <>
                    {/* STATUS */}
                    <p className="text-sm text-green-600 mb-1">
                      ● Session Active
                    </p>

                    {/* TIMER */}
                    <p className="text-sm text-muted-foreground mb-2">
                      Ends in: {timeLeft}s
                    </p>

                    {/* SESSION ID */}
                    <p className="text-xs text-muted-foreground mb-4">
                      {sessionId}
                    </p>

                    {/* 🔥 QR COMPONENT */}
                    {qrData && <QRGenerator qrData={qrData} />}

                    {/* CONTROLS */}
                    <div className="mt-4">
                      <Button variant="destructive" onClick={endSession}>
                        End Session
                      </Button>
                    </div>
                  </>
              )}
            </div>

            {/* RIGHT PANEL */}
            <RealtimeFeed />

          </div>

          {/* 📊 HISTORY */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-foreground font-semibold text-lg">
                Session History
              </h2>

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
                  <th className="py-3 pr-4">Session</th>
                  <th className="py-3 pr-4">Room</th>
                  <th className="py-3 pr-4">Course</th>
                  <th className="py-3 pr-4">Date</th>
                  <th className="py-3 pr-4">Attendance</th>
                  <th className="py-3">Proxies</th>
                </tr>
                </thead>

                <tbody>
                {recentSessions.map((s) => (
                    <tr key={s.id} className="border-b border-border/50 last:border-0">
                      <td className="py-3 pr-4">{s.id}</td>
                      <td className="py-3 pr-4">{s.room}</td>
                      <td className="py-3 pr-4">{s.course}</td>
                      <td className="py-3 pr-4">{s.date}</td>
                      <td className="py-3 pr-4">
                        {s.present}/{s.total}
                      </td>
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