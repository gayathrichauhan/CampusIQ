import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, MapPin, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Html5Qrcode } from "html5-qrcode";

// ─── Types ────────────────────────────────────────────────────────────────────
type ScanState = "idle" | "scanning" | "processing" | "expired" | "error";

interface QRPayload {
  sessionId: string;
  lat: number;
  lng: number;
  expiresAt: number;
}

// ─── Component ────────────────────────────────────────────────────────────────
const StudentScan = () => {
  const navigate = useNavigate();
  const [scanState, setScanState] = useState<ScanState>("idle");
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
    await stopScanner();
    setScanState("processing");

    // Parse QR payload
    let payload: QRPayload;
    try {
      payload = JSON.parse(decodedText);
      if (!payload.sessionId || !payload.expiresAt) throw new Error("Invalid QR");
    } catch {
      setErrorMsg("Invalid QR code. Please scan the correct code shown by your teacher.");
      setScanState("error");
      return;
    }

    // Check QR expiry
    if (Date.now() > payload.expiresAt) {
      setScanState("expired");
      return;
    }

    // ── QR is valid → move to PIN verification step ──────────────────────────
    // Pass sessionId and scan timestamp so StudentPinVerify can derive the
    // correct PIN window and verify the student's input.
    navigate("/student/pin", {
      state: {
        sessionId: payload.sessionId,
        qrTimestamp: Date.now(),
      },
    });
  };

  const startScanner = async () => {
    setScanState("scanning");
    setErrorMsg("");

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
          () => {}
      );
      scannerStarted.current = true;
    } catch {
      setErrorMsg("Camera access denied or unavailable. Please allow camera permission.");
      setScanState("error");
    }
  };

  useEffect(() => {
    return () => { stopScanner(); };
  }, []);

  return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="border-b border-border px-4 py-3 flex items-center gap-3">
          <Button
              variant="ghost"
              size="icon"
              onClick={async () => { await stopScanner(); navigate("/student"); }}
              className="text-muted-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-foreground font-semibold text-sm">Scan QR Code</h1>
            <p className="text-muted-foreground text-xs">Step 1 of 2 — Point camera at the QR</p>
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
                <p className="text-muted-foreground text-sm mb-1 max-w-xs">
                  Ask your teacher to display the QR code, then tap below.
                </p>
                <p className="text-muted-foreground text-xs mb-6 max-w-xs">
                  After scanning you'll enter a verbal PIN your teacher announces.
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
                  Point camera at the QR on the board
                </p>
                <Button
                    variant="outline"
                    className="mt-4 border-border text-muted-foreground"
                    onClick={async () => { await stopScanner(); setScanState("idle"); }}
                >
                  Cancel
                </Button>
              </div>
          )}

          {/* PROCESSING */}
          {scanState === "processing" && (
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6 mx-auto">
                  <Loader2 className="h-12 w-12 text-primary animate-spin" />
                </div>
                <h2 className="text-foreground font-semibold text-xl mb-2">QR Verified</h2>
                <p className="text-muted-foreground text-sm">Loading PIN entry…</p>
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
                  Ask your teacher to refresh the QR code.
                </p>
                <Button variant="outline" onClick={() => setScanState("idle")} className="border-border text-foreground">
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
                <Button variant="outline" onClick={() => setScanState("idle")} className="border-border text-foreground">
                  Try Again
                </Button>
              </div>
          )}
        </main>
      </div>
  );
};

export default StudentScan;