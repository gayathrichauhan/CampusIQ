import { QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";

const AttendanceSession = () => {
  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center gap-2 mb-1">
        <QrCode className="h-5 w-5 text-primary" />
        <h2 className="text-foreground font-semibold">Attendance Session</h2>
      </div>
      <p className="text-muted-foreground text-sm mb-6">Start a session to generate QR code</p>

      <div className="flex flex-col items-center py-6">
        <div className="w-32 h-32 border-2 border-border rounded-xl flex items-center justify-center mb-4">
          <QrCode className="h-16 w-16 text-muted-foreground/40" />
        </div>
        <h3 className="text-foreground font-medium">Computer Science 101</h3>
        <p className="text-muted-foreground text-sm mt-1 mb-4">Click below to start attendance tracking</p>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
          <QrCode className="h-4 w-4" />
          Start Session
        </Button>
      </div>
    </div>
  );
};

export default AttendanceSession;
