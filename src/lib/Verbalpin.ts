// ─── Verbal PIN utility ───────────────────────────────────────────────────────
// PIN rotates every PIN_TTL_MS. It is derived deterministically from
// (sessionId + windowIndex) so the server can re-derive and verify it
// without any extra database write on generation.
//
// Flow:
//   Teacher screen shows PIN  →  teacher reads it aloud  →  student types it
//   Student submits (QR nonce + PIN + sessionId) → server verifies all three
// ─────────────────────────────────────────────────────────────────────────────

export const PIN_TTL_MS = 60_000; // 60 seconds per PIN window

/**
 * Returns which 60-second window we are currently in.
 * Both client and server call this with Date.now() so they stay in sync.
 */
export function currentWindowIndex(now = Date.now()): number {
    return Math.floor(now / PIN_TTL_MS);
}

/**
 * How many milliseconds remain in the current PIN window.
 */
export function msUntilNextPin(now = Date.now()): number {
    return PIN_TTL_MS - (now % PIN_TTL_MS);
}

/**
 * Derives a 4-digit PIN from sessionId + windowIndex using a simple
 * hash so it is deterministic and verifiable server-side.
 *
 * We also accept windowIndex-1 on the server (grace period) in case
 * the student submits right as the window flips.
 */
export async function derivePin(
    sessionId: string,
    windowIndex: number
): Promise<string> {
    const raw = `${sessionId}:${windowIndex}:campusiq-pin-salt`;
    const encoded = new TextEncoder().encode(raw);
    const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    // Take first 4 bytes, map each to a digit 0-9
    const digits = hashArray.slice(0, 4).map((b) => b % 10);
    return digits.join("");
}

/**
 * Convenience: returns the PIN for RIGHT NOW given a sessionId.
 */
export async function currentPin(sessionId: string): Promise<string> {
    return derivePin(sessionId, currentWindowIndex());
}

/**
 * Server-side verification: accepts current window OR previous window
 * (so a student who typed right as the PIN flipped still passes).
 */
export async function verifyPin(
    sessionId: string,
    submittedPin: string
): Promise<boolean> {
    const now = currentWindowIndex();
    const [pinNow, pinPrev] = await Promise.all([
        derivePin(sessionId, now),
        derivePin(sessionId, now - 1),
    ]);
    return submittedPin === pinNow || submittedPin === pinPrev;
}