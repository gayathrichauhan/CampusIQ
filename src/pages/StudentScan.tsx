import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, CheckCircle, XCircle, MapPin, Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Html5Qrcode } from "html5-qrcode";
import { haversineDistance } from "@/lib/distance";

type ScanState = "idle" | "scanning" | "locating" | "success" | "proxy_alert" | "expired" | "error";

interface QRPayload {
  sessionId: string;
  lat: number;
  lng: number;
  expiresAt: number;
}

interface ScanResult {
  distance: number;
  confidence: number;
  time: string;
  sessionId: string;
}

const GEOFENCE_RADIUS = 30; // metres
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

function calcConfidence(distance: number, accuracy: number): number {
  let score = 100;
  if (accuracy > 100) score -= 30;
  if (distance > GEOFENCE_RADIUS) score -= 60;
  else if (distance > 15) score -= 20;
  return Math.max(0, score);
}

const StudentScan = () => {
  const navigate = useNavigate();
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerStarted = useRef(false);

  const stopScanner = async () => {
    if (scannerRef.current && scannerStarted.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch {
        // ignore
      }
      scannerStarted.current = false;
    }
  };

  const handleQRSuccess = async (decodedText: string) => {
    // Stop scanner immediately
    await stopScanner();
    setScanState("locating");

    // Parse QR
    let payload: QRPayload;
    try {
      payload = JSON.parse(decodedText);
      if (!payload.sessionId || !payload.lat || !payload.lng || !payload.expiresAt) {
        throw new Error("Invalid QR");
      }
    } catch {
      setErrorMsg("Invalid QR code format. Please scan the correct QR.");
      setScanState("error");
      return;
    }

    // Check expiry
    if (Date.now() > payload.expiresAt) {
      setScanState("expired");
      return;
    }

    // Get GPS
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser.");
      setScanState("error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;
          const distance = haversineDistance(latitude, longitude, payload.lat, payload.lng);
          const confidence = calcConfidence(distance, accuracy);
          const time = new Date().toLocaleTimeString();

          const record = {
            name: STUDENT_NAME,
            time,
            sessionId: payload.sessionId,
            status: distance <= GEOFENCE_RADIUS ? ("present" as const) : ("proxy" as const),
          };

          saveAttendance(record);

          setResult({ distance, confidence, time, sessionId: payload.sessionId });
          setScanState(distance <= GEOFENCE_RADIUS ? "success" : "proxy_alert");
        },
        (err) => {
          console.error("GPS error:", err);
          setErrorMsg("Could not get your location. Please enable location access.");
          setScanState("error");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const startScanner = async () => {
    setScanState("scanning");
    setErrorMsg("");

    // Small delay to ensure DOM element is mounted
    await new Promise((r) => setTimeout(r, 200));

    try {
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      const cameras = await Html5Qrcode.getCameras();
      if (!cameras || cameras.length === 0) {
        setErrorMsg("No camera found on this device.");
        setScanState("error");
        return;
      }

      await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          handleQRSuccess,
          () => {} // ignore intermediate failures
      );
      scannerStarted.current = true;
    } catch (err: any) {
      console.error("Scanner error:", err);
      setErrorMsg("Camera access denied or unavailable. Please allow camera permission.");
      setScanState("error");
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="border-b border-border px-4 py-3 flex items-center gap-3">
          <Button
              variant="ghost"
              size="icon"
              onClick={async () => {
                await stopScanner();
                navigate("/student");
              }}
              className="text-muted-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-foreground font-semibold text-sm">Scan QR Code</h1>
            <p className="text-muted-foreground text-xs">Point your camera at the QR code</p>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center p-6">
          {/* IDLE */}
          {scanState === "idle" && (
              <div className="text-center">
                <div className="w-64 h-64 border-2 border-dashed border-border rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <Camera className="h-16 w-16 text-muted-foreground/40" />
                </div>
                <h2 className="text-foreground font-semibold text-lg mb-2">Ready to Scan</h2>
                <p className="text-muted-foreground text-sm mb-6 max-w-xs">
                  Ask your teacher to display the QR code, then tap below to scan
                </p>
                <Button
                    onClick={startScanner}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                >
                  <Camera className="h-4 w-4" />
                  Start Camera
                </Button>
              </div>
          )}

          {/* SCANNING */}
          {scanState === "scanning" && (
              <div className="text-center w-full max-w-sm">
                <div
                    id="qr-reader"
                    className="rounded-2xl overflow-hidden border-2 border-primary mb-4"
                    style={{ width: "100%" }}
                />
                <p className="text-muted-foreground text-sm">
                  <MapPin className="h-3 w-3 inline mr-1" />
                  Point camera at the QR code displayed by your teacher
                </p>
                <Button
                    variant="outline"
                    className="mt-4 border-border text-muted-foreground"
                    onClick={async () => {
                      await stopScanner();
                      setScanState("idle");
                    }}
                >
                  Cancel
                </Button>
              </div>
          )}

          {/* LOCATING */}
          {scanState === "locating" && (
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6 mx-auto">
                  <Loader2 className="h-12 w-12 text-primary animate-spin" />
                </div>
                <h2 className="text-foreground font-semibold text-xl mb-2">Verifying Location...</h2>
                <p className="text-muted-foreground text-sm">
                  <MapPin className="h-3 w-3 inline mr-1" />
                  Acquiring GPS location...
                </p>
              </div>
          )}

          {/* SUCCESS */}
          {scanState === "success" && result && (
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6 mx-auto">
                  <CheckCircle className="h-12 w-12 text-primary" />
                </div>
                <h2 className="text-foreground font-semibold text-xl mb-2">Attendance Marked!</h2>
                <p className="text-muted-foreground text-sm mb-2">
                  {result.sessionId} • Room 301
                </p>
                <div className="flex items-center justify-center gap-2 mb-6">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="text-primary text-sm font-medium">
                Confidence Score: {result.confidence}
              </span>
                </div>
                <div className="bg-card rounded-lg border border-border p-4 text-left max-w-xs mx-auto mb-6">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <span className="text-primary font-medium">Present</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time</span>
                      <span className="text-foreground">{result.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Distance</span>
                      <span className="text-primary">{Math.round(result.distance)}m away</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">GPS Verified</span>
                      <span className="text-primary">✓ Within range</span>
                    </div>
                  </div>
                </div>
                <Button
                    variant="outline"
                    onClick={() => navigate("/student")}
                    className="border-border text-foreground"
                >
                  Back to Dashboard
                </Button>
              </div>
          )}

          {/* PROXY ALERT */}
          {scanState === "proxy_alert" && result && (
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center mb-6 mx-auto">
                  <XCircle className="h-12 w-12 text-destructive" />
                </div>
                <h2 className="text-destructive font-semibold text-xl mb-2">Proxy Attempt Detected</h2>
                <p className="text-muted-foreground text-sm mb-2">
                  Your location doesn't match the classroom
                </p>
                <div className="flex items-center justify-center gap-2 mb-6">
                  <Shield className="h-4 w-4 text-destructive" />
                  <span className="text-destructive text-sm font-medium">
                Confidence Score: {result.confidence}
              </span>
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
                      <span className="text-destructive">{Math.round(result.distance)}m away</span>
                    </div>
                  </div>
                </div>
                <Button
                    variant="outline"
                    onClick={() => setScanState("idle")}
                    className="border-border text-foreground"
                >
                  Try Again
                </Button>
              </div>
          )}

          {/* EXPIRED */}
          {scanState === "expired" && (
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-warning/10 flex items-center justify-center mb-6 mx-auto">
                  <XCircle className="h-12 w-12 text-warning" />
                </div>
                <h2 className="text-warning font-semibold text-xl mb-2">QR Code Expired</h2>
                <p className="text-muted-foreground text-sm mb-6">
                  This QR code has expired. Please ask your teacher to refresh it.
                </p>
                <Button
                    variant="outline"
                    onClick={() => setScanState("idle")}
                    className="border-border text-foreground"
                >
                  Try Again
                </Button>
              </div>
          )}

          {/* ERROR */}
          {scanState === "error" && (
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center mb-6 mx-auto">
                  <XCircle className="h-12 w-12 text-destructive" />
                </div>
                <h2 className="text-destructive font-semibold text-xl mb-2">Something went wrong</h2>
                <p className="text-muted-foreground text-sm mb-6 max-w-xs">{errorMsg}</p>
                <Button
                    variant="outline"
                    onClick={() => setScanState("idle")}
                    className="border-border text-foreground"
                >
                  Try Again
                </Button>
              </div>
          )}
        </main>
      </div>
  );
};

export default StudentScan;