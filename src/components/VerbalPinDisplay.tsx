import { useEffect, useState } from "react";
import { Shield, RefreshCw } from "lucide-react";
import { currentPin, msUntilNextPin, PIN_TTL_MS } from "@/lib/Verbalpin.ts";

interface Props {
    sessionId: string;
}

/**
 * Displays the rotating 4-digit verbal PIN for the teacher to read aloud.
 * Drop this anywhere on the teacher's attendance page — it is self-contained.
 *
 * Usage:
 *   <VerbalPinDisplay sessionId={SESSION_ID} />
 */
const VerbalPinDisplay = ({ sessionId }: Props) => {
    const [pin, setPin] = useState("····");
    const [countdown, setCountdown] = useState(60);
    const [flashing, setFlashing] = useState(false);

    // Derive and refresh the PIN every time the 60-second window flips
    useEffect(() => {
        let rafId: number;
        let prevWindow = -1;

        const tick = async () => {
            const now = Date.now();
            const windowIndex = Math.floor(now / PIN_TTL_MS);
            const remaining = Math.ceil(msUntilNextPin(now) / 1000);

            setCountdown(remaining);

            // Only re-derive when the window actually changes
            if (windowIndex !== prevWindow) {
                prevWindow = windowIndex;
                const newPin = await currentPin(sessionId);
                setPin(newPin);
                // Flash briefly to signal rotation
                setFlashing(true);
                setTimeout(() => setFlashing(false), 600);
            }

            rafId = requestAnimationFrame(tick);
        };

        // Kick off immediately
        rafId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafId);
    }, [sessionId]);

    // Colour ring around countdown circle
    const fraction = countdown / 60;
    const ringColor =
        fraction > 0.4
            ? "text-green-500"
            : fraction > 0.2
                ? "text-yellow-500"
                : "text-red-500";

    return (
        <div
            className={`
        bg-card border border-border rounded-2xl p-6 flex flex-col items-center gap-4
        transition-all duration-300
        ${flashing ? "ring-2 ring-primary ring-offset-2" : ""}
      `}
        >
            {/* Header */}
            <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">
          Verbal PIN — read this aloud
        </span>
            </div>

            {/* Big PIN digits */}
            <div className="flex items-center gap-3">
                {pin.split("").map((digit, i) => (
                    <div
                        key={i}
                        className="w-14 h-16 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center"
                    >
            <span className="text-4xl font-bold tracking-widest text-primary">
              {digit}
            </span>
                    </div>
                ))}
            </div>

            {/* Countdown + refresh icon */}
            <div className={`flex items-center gap-1.5 text-sm font-medium ${ringColor}`}>
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Changes in {countdown}s</span>
            </div>

            {/* Instruction */}
            <p className="text-xs text-muted-foreground text-center max-w-[200px]">
                Say: &quot;The attendance code is{" "}
                <span className="font-mono font-semibold text-foreground">
          {pin.split("").join(" — ")}
        </span>
                &quot;
            </p>
        </div>
    );
};

export default VerbalPinDisplay;