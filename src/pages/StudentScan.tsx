import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, CheckCircle, XCircle, MapPin, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

type ScanState = "idle" | "scanning" | "success" | "proxy_alert";

const StudentScan = () => {
  const navigate = useNavigate();
  const [scanState, setScanState] = useState<ScanState>("idle");

  const handleStartScan = () => {
    setScanState("scanning");
    // Simulate scan after 2 seconds
    setTimeout(() => {
      const isProxy = Math.random() > 0.7;
      setScanState(isProxy ? "proxy_alert" : "success");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/student")} className="text-muted-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-foreground font-semibold text-sm">Scan QR Code</h1>
          <p className="text-muted-foreground text-xs">Point your camera at the QR code</p>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        {scanState === "idle" && (
          <div className="text-center">
            <div className="w-64 h-64 border-2 border-dashed border-border rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <Camera className="h-16 w-16 text-muted-foreground/40" />
            </div>
            <h2 className="text-foreground font-semibold text-lg mb-2">Ready to Scan</h2>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs">
              Ask your teacher to display the QR code, then tap below to scan
            </p>
            <Button onClick={handleStartScan} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
              <Camera className="h-4 w-4" />
              Start Camera
            </Button>
          </div>
        )}

        {scanState === "scanning" && (
          <div className="text-center">
            <div className="w-64 h-64 border-2 border-primary rounded-2xl flex items-center justify-center mb-6 mx-auto relative overflow-hidden">
              <div className="absolute inset-0 bg-primary/5" />
              <div className="w-48 h-1 bg-primary/60 absolute animate-pulse" style={{ top: "50%" }} />
              <Camera className="h-16 w-16 text-primary/60" />
            </div>
            <h2 className="text-foreground font-semibold text-lg mb-2">Scanning...</h2>
            <p className="text-muted-foreground text-sm">
              <MapPin className="h-3 w-3 inline mr-1" />
              Acquiring GPS location...
            </p>
          </div>
        )}

        {scanState === "success" && (
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6 mx-auto">
              <CheckCircle className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-foreground font-semibold text-xl mb-2">Attendance Marked!</h2>
            <p className="text-muted-foreground text-sm mb-2">CS-101 • Room 301</p>
            <div className="flex items-center justify-center gap-2 mb-6">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-primary text-sm font-medium">Confidence Score: 95</span>
            </div>
            <div className="bg-card rounded-lg border border-border p-4 text-left max-w-xs mx-auto mb-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="text-primary font-medium">Present</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time</span>
                  <span className="text-foreground">{new Date().toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">GPS Verified</span>
                  <span className="text-primary">✓ Within range</span>
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate("/student")} className="border-border text-foreground">
              Back to Dashboard
            </Button>
          </div>
        )}

        {scanState === "proxy_alert" && (
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center mb-6 mx-auto">
              <XCircle className="h-12 w-12 text-destructive" />
            </div>
            <h2 className="text-destructive font-semibold text-xl mb-2">Proxy Attempt Detected</h2>
            <p className="text-muted-foreground text-sm mb-2">Your location doesn't match the classroom</p>
            <div className="flex items-center justify-center gap-2 mb-6">
              <Shield className="h-4 w-4 text-destructive" />
              <span className="text-destructive text-sm font-medium">Confidence Score: 15</span>
            </div>
            <div className="bg-destructive/5 rounded-lg border border-destructive/20 p-4 text-left max-w-xs mx-auto mb-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="text-destructive font-medium">Proxy Alert</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">GPS Check</span>
                  <span className="text-destructive">✗ Outside geofence</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Distance</span>
                  <span className="text-destructive">~2.3 km away</span>
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={() => { setScanState("idle"); }} className="border-border text-foreground">
              Try Again
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentScan;
