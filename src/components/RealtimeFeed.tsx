import { useEffect, useState } from "react";
import { Users, FileDown } from "lucide-react";

interface AttendanceRecord {
  name: string;
  time: string;
  status: "present" | "proxy";
  sessionId?: string;
}

const POLL_INTERVAL = 1000; // 1 second

function loadAttendance(): AttendanceRecord[] {
  try {
    const raw = localStorage.getItem("attendance_records");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

const RealtimeFeed = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>(loadAttendance);

  useEffect(() => {
    const id = setInterval(() => {
      setRecords(loadAttendance());
    }, POLL_INTERVAL);
    return () => clearInterval(id);
  }, []);

  const present = records.filter((r) => r.status === "present").length;
  const proxies = records.filter((r) => r.status === "proxy").length;
  const total = 35;
  const rate = total > 0 ? Math.round((present / total) * 100) : 0;

  const handleDownload = () => {
    const csv = [
      "Name,Time,Status,Session",
      ...records.map(
          (r) => `${r.name},${r.time},${r.status},${r.sessionId ?? ""}`
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "attendance_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h3 className="text-foreground font-semibold">Real-time Feed</h3>
          </div>
          <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 text-muted-foreground text-xs hover:text-foreground transition-colors"
          >
            <FileDown className="h-3.5 w-3.5" />
            Download Attendance Report
          </button>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-6 bg-secondary/50 rounded-lg p-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Present</p>
            <p className="text-foreground font-semibold">
              {present}{" "}
              <span className="text-muted-foreground font-normal">/ {total}</span>
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Proxy Alerts</p>
            <p className="text-warning font-semibold">{proxies}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Rate</p>
            <p className="text-primary font-semibold">{rate}%</p>
          </div>
        </div>

        {records.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-muted-foreground">
              <Users className="h-10 w-10 mb-2 opacity-40" />
              <p className="text-sm">No active session</p>
            </div>
        ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {[...records].reverse().map((record, i) => (
                  <div
                      key={i}
                      className="flex items-center justify-between bg-secondary/50 rounded-lg px-3 py-2"
                  >
                    <div>
                      <p className="text-foreground text-sm font-medium">{record.name}</p>
                      <p className="text-muted-foreground text-xs">{record.time}</p>
                    </div>
                    <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            record.status === "present"
                                ? "bg-primary/10 text-primary"
                                : "bg-destructive/10 text-destructive"
                        }`}
                    >
                {record.status === "present" ? "Present" : "Proxy Alert"}
              </span>
                  </div>
              ))}
            </div>
        )}
      </div>
  );
};

export default RealtimeFeed;