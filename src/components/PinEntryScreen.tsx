import { useState, useRef, useEffect } from "react";
import { Shield, XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PinEntryScreenProps {
    sessionId: string;          // from the scanned QR payload
    onSuccess: () => void;      // called when PIN is correct
    onCancel: () => void;       // called when student cancels
}

interface StoredPin {
    pin: string;
    sessionId: string;
    expiresAt: number;
}

const PinEntryScreen = ({ sessionId, onSuccess, onCancel }: PinEntryScreenProps) => {
    const [digits, setDigits] = useState<string[]>(["", "", "", ""]);
    const [error, setError] = useState<string>("");
    const [shake, setShake] = useState(false);
    const inputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ];

    // Auto-focus first box on mount
    useEffect(() => {
        inputRefs[0].current?.focus();
    }, []);

    const handleChange = (index: number, value: string) => {
        // Only accept single digits
        const digit = value.replace(/\D/g, "").slice(-1);
        const next = [...digits];
        next[index] = digit;
        setDigits(next);
        setError("");

        // Auto-advance to next box
        if (digit && index < 3) {
            inputRefs[index + 1].current?.focus();
        }

        // Auto-submit when all 4 filled
        if (digit && index === 3) {
            const complete = [...next];
            if (complete.every((d) => d !== "")) {
                validatePin(complete.join(""));
            }
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !digits[index] && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
        if (e.key === "Enter") {
            const entered = digits.join("");
            if (entered.length === 4) validatePin(entered);
        }
    };

    const triggerShake = () => {
        setShake(true);
        setTimeout(() => setShake(false), 500);
    };

    const validatePin = (entered: string) => {
        // Read stored PIN from localStorage (written by VerbalPinDisplay on teacher device)
        const raw = localStorage.getItem("verbal_pin");

        if (!raw) {
            setError("No active PIN found. Ask your teacher to start a session.");
            triggerShake();
            return;
        }

        let stored: StoredPin;
        try {
            stored = JSON.parse(raw);
        } catch {
            setError("PIN data corrupted. Please try again.");
            triggerShake();
            return;
        }

        // Check expiry
        if (Date.now() > stored.expiresAt) {
            setError("PIN has expired. Ask your teacher to announce the new code.");
            triggerShake();
            setDigits(["", "", "", ""]);
            inputRefs[0].current?.focus();
            return;
        }

        // Check session match
        if (stored.sessionId !== sessionId) {
            setError("PIN doesn't match this session. Ensure you're in the right class.");
            triggerShake();
            return;
        }

        // Check PIN match
        if (stored.pin !== entered) {
            setError("Wrong PIN. Listen carefully and try again.");
            triggerShake();
            setDigits(["", "", "", ""]);
            inputRefs[0].current?.focus();
            return;
        }

        // All good
        onSuccess();
    };

    const handleSubmit = () => {
        const entered = digits.join("");
        if (entered.length < 4) {
            setError("Please enter all 4 digits.");
            return;
        }
        validatePin(entered);
    };

    return (
        <div className="flex flex-col items-center text-center max-w-xs mx-auto">
            {/* Icon */}
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-5">
                <Shield className="h-10 w-10 text-primary" />
            </div>

            <h2 className="text-foreground font-semibold text-xl mb-1">Enter Verbal Code</h2>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                Type the 4-digit code your teacher just announced out loud
            </p>

            {/* 4-box PIN input */}
            <div
                className={`flex gap-3 mb-4 ${shake ? "animate-[shake_0.4s_ease-in-out]" : ""}`}
                style={
                    shake
                        ? { animation: "shake 0.4s ease-in-out" }
                        : {}
                }
            >
                {digits.map((d, i) => (
                    <input
                        key={i}
                        ref={inputRefs[i]}
                        type="tel"
                        inputMode="numeric"
                        maxLength={1}
                        value={d}
                        onChange={(e) => handleChange(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        className={`w-14 h-16 text-center text-2xl font-bold rounded-xl border-2 bg-background text-foreground outline-none transition-colors
              ${d ? "border-primary" : "border-border"}
              ${error ? "border-destructive" : ""}
              focus:border-primary focus:ring-0
            `}
                    />
                ))}
            </div>

            {/* Error message */}
            {error && (
                <div className="flex items-center gap-2 text-destructive text-sm mb-4">
                    <XCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Submit */}
            <Button
                onClick={handleSubmit}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mb-3"
                disabled={digits.some((d) => d === "")}
            >
                Verify & Mark Present
            </Button>

            {/* Cancel */}
            <button
                onClick={onCancel}
                className="flex items-center gap-1.5 text-muted-foreground text-sm hover:text-foreground transition-colors"
            >
                <ArrowLeft className="h-3.5 w-3.5" />
                Cancel scan
            </button>

            {/* Shake keyframes injected inline */}
            <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-8px); }
          40%       { transform: translateX(8px); }
          60%       { transform: translateX(-6px); }
          80%       { transform: translateX(6px); }
        }
      `}</style>
        </div>
    );
};

export default PinEntryScreen;