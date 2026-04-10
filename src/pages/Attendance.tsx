import CampusSidebar from "@/components/CampusSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import AttendanceSession from "@/components/AttendanceSession";
import RealtimeFeed from "@/components/RealtimeFeed";
import { Badge } from "@/components/ui/badge";
import { Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

const recentSessions = [
  { id: "S-001", room: "CR-101", course: "CS-101", date: "Apr 10", present: 32, total: 35, proxies: 1 },
  { id: "S-002", room: "CR-103", course: "ECE-201", date: "Apr 9", present: 28, total: 30, proxies: 0 },
  { id: "S-003", room: "CR-106", course: "ME-301", date: "Apr 9", present: 40, total: 45, proxies: 2 },
  { id: "S-004", room: "CR-108", course: "PHY-102", date: "Apr 8", present: 25, total: 28, proxies: 0 },
];

const Attendance = () => {
  return (
    <div className="flex min-h-screen">
      <CampusSidebar />
      <main className="flex-1 p-6 overflow-auto">
        <DashboardHeader />
        <Badge variant="outline" className="mb-4 text-xs text-muted-foreground border-border">
          Attendance Management
        </Badge>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <AttendanceSession />
          <RealtimeFeed />
        </div>

        {/* Session History */}
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
                  <th className="text-left text-muted-foreground font-normal py-3 pr-4">Session</th>
                  <th className="text-left text-muted-foreground font-normal py-3 pr-4">Room</th>
                  <th className="text-left text-muted-foreground font-normal py-3 pr-4">Course</th>
                  <th className="text-left text-muted-foreground font-normal py-3 pr-4">Date</th>
                  <th className="text-left text-muted-foreground font-normal py-3 pr-4">Attendance</th>
                  <th className="text-left text-muted-foreground font-normal py-3">Proxies</th>
                </tr>
              </thead>
              <tbody>
                {recentSessions.map((s) => (
                  <tr key={s.id} className="border-b border-border/50 last:border-0">
                    <td className="py-3 pr-4 text-foreground font-medium">{s.id}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{s.room}</td>
                    <td className="py-3 pr-4 text-foreground">{s.course}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{s.date}</td>
                    <td className="py-3 pr-4">
                      <span className="text-primary font-medium">{s.present}</span>
                      <span className="text-muted-foreground">/{s.total}</span>
                      <span className="text-muted-foreground ml-2">({Math.round(s.present / s.total * 100)}%)</span>
                    </td>
                    <td className="py-3">
                      {s.proxies > 0 ? (
                        <span className="text-destructive font-medium">{s.proxies}</span>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </td>
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
