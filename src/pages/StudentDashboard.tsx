import { useNavigate } from "react-router-dom";
import { QrCode, AlertTriangle, CheckCircle, XCircle, Camera, LogOut, BookOpen, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const attendanceData = [
  { subject: "CS-101", attended: 12, total: 15, percentage: 80 },
  { subject: "ECE-201", attended: 14, total: 15, percentage: 93 },
  { subject: "ME-301", attended: 10, total: 15, percentage: 67 },
  { subject: "PHY-102", attended: 13, total: 15, percentage: 87 },
];

const getAlertStatus = (percentage: number) => {
  if (percentage >= 85) return { status: "safe", color: "text-primary", bg: "bg-primary/10", icon: CheckCircle, message: "You're on track!" };
  if (percentage >= 75) return { status: "warning", color: "text-warning", bg: "bg-warning/10", icon: AlertTriangle, message: "Attend next 4 classes to stay safe" };
  return { status: "danger", color: "text-destructive", bg: "bg-destructive/10", icon: XCircle, message: "Attendance shortage! Contact your advisor" };
};

const overallPercentage = Math.round(
  attendanceData.reduce((acc, s) => acc + s.percentage, 0) / attendanceData.length
);
const alert = getAlertStatus(overallPercentage);

const StudentDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">SC</span>
          </div>
          <div>
            <h1 className="text-foreground font-semibold text-sm">Smart Campus</h1>
            <p className="text-muted-foreground text-xs">Student View</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm text-foreground">Rahul Kumar</p>
            <p className="text-xs text-muted-foreground">Roll: CS2024-042</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => navigate("/login")} className="text-muted-foreground">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Alert Banner */}
        <div className={`rounded-xl border border-border p-5 ${alert.bg}`}>
          <div className="flex items-center gap-3">
            <alert.icon className={`h-6 w-6 ${alert.color}`} />
            <div>
              <p className={`font-semibold ${alert.color}`}>
                Overall Attendance: {overallPercentage}%
              </p>
              <p className="text-muted-foreground text-sm">{alert.message}</p>
            </div>
          </div>
        </div>

        {/* Scan QR Button */}
        <div className="bg-card rounded-xl border border-border p-6 text-center">
          <Camera className="h-12 w-12 text-primary mx-auto mb-3 opacity-60" />
          <h2 className="text-foreground font-semibold text-lg mb-1">Mark Attendance</h2>
          <p className="text-muted-foreground text-sm mb-4">Scan the QR code displayed by your teacher</p>
          <Button
            onClick={() => navigate("/student/scan")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
          >
            <QrCode className="h-4 w-4" />
            Open Scanner
          </Button>
        </div>

        {/* Subject-wise Attendance */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="text-foreground font-semibold">Subject-wise Attendance</h2>
          </div>
          <div className="space-y-4">
            {attendanceData.map((subject) => {
              const status = getAlertStatus(subject.percentage);
              return (
                <div key={subject.subject} className="bg-secondary rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-foreground font-medium text-sm">{subject.subject}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${status.color}`}>{subject.percentage}%</span>
                      <status.icon className={`h-4 w-4 ${status.color}`} />
                    </div>
                  </div>
                  <Progress value={subject.percentage} className="h-2" />
                  <p className="text-muted-foreground text-xs mt-1">
                    {subject.attended} / {subject.total} classes attended
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-foreground font-semibold">Recent Activity</h2>
          </div>
          <div className="space-y-3">
            {[
              { time: "Today 10:15 AM", subject: "CS-101", status: "present", score: 95 },
              { time: "Today 8:00 AM", subject: "PHY-102", status: "present", score: 100 },
              { time: "Yesterday 2:00 PM", subject: "ME-301", status: "proxy_attempt", score: 15 },
              { time: "Yesterday 10:00 AM", subject: "ECE-201", status: "present", score: 88 },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-foreground text-sm">{item.subject}</p>
                  <p className="text-muted-foreground text-xs">{item.time}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    item.status === "present" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                  }`}>
                    {item.status === "present" ? "Present" : "Proxy Alert"}
                  </span>
                  <span className={`text-xs font-medium ${
                    item.score >= 80 ? "text-primary" : item.score >= 50 ? "text-warning" : "text-destructive"
                  }`}>
                    {item.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
