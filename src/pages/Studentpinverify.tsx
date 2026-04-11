import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, CheckCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import PinEntryScreen from "@/components/PinEntryScreen";

const STUDENT_NAME = "Rahul Kumar";

function saveAttendance(record: {
    name: string;
    time: string;
    status: "present" | "proxy";
    sessionId: string;
}) {
    try {
        const existing = JSON.parse(localStorage.getItem("attendance_records") || "[]");
        existing.push(record);
        localStorage.setItem("attendance_records", JSON.stringify(existing));
    } catch {
        // ignore
    }
}

const StudentPinVerify = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [done, setDone] = useState(false);
    const [markedTime, setMarkedTime] = useState("");

    const sessionId: string = location.state?.sessionId ?? "";

    if (!sessionId) {
        navigate("/student/scan");
        return null;
    }

    const handleSuccess = () => {
        const time = new Date().toLocaleTimeString();
        saveAttendance({
            name: STUDENT_NAME,
            time,
            sessionId,
            status: "present",
        });
        setMarkedTime(time);
        setDone(true);
    };

    const handleCancel = () => {
        navigate("/student/scan");
    };

    if (done) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <header className="border-b border-border px-4 py-3 flex items-center gap-3">
                    <div>
                        <h1 className="text-foreground font-semibold text-sm">Attendance Marked</h1>
                        <p className="text-muted-foreground text-xs">You are all set!</p>
                    </div>
                </header>
                <main className="flex-1 flex flex-col items-center justify-center p-6">
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                        <CheckCircle className="h-12 w-12 text-primary" />
                    </div>
                    <h2 className="text-foreground font-semibold text-xl mb-2">Attendance Marked!</h2>
                    <p className="text-muted-foreground text-sm mb-2">{sessionId}</p>
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <Shield className="h-4 w-4 text-primary" />
                        <span className="text-primary text-sm font-medium">Confidence Score: 100</span>
                    </div>
                    <div className="bg-card rounded-lg border border-border p-4 text-left max-w-xs w-full mx-auto mb-6">
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Status</span>
                                <span className="text-primary font-medium">Present ✓</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Student</span>
                                <span className="text-foreground">{STUDENT_NAME}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Time</span>
                                <span className="text-foreground">{markedTime}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Verified by</span>
                                <span className="text-primary">QR + Verbal PIN ✓</span>
                            </div>
                        </div>
                    </div>
                    <Button variant="outline" onClick={() => navigate("/student")} className="border-border text-foreground">
                        Back to Dashboard
                    </Button>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="border-b border-border px-4 py-3 flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate("/student/scan")}
                    className="text-muted-foreground"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-foreground font-semibold text-sm">Verify PIN</h1>
                    <p className="text-muted-foreground text-xs">Step 2 of 2 — Enter verbal code</p>
                </div>
            </header>
            <main className="flex-1 flex flex-col items-center justify-center p-6">
                <PinEntryScreen
                    sessionId={sessionId}
                    onSuccess={handleSuccess}
                    onCancel={handleCancel}
                />
            </main>
        </div>
    );
};

export default StudentPinVerify;