/**
 * Read JWT `exp` (seconds since epoch) without verifying the signature.
 */
export function readJwtExpSeconds(jwt: string): number | null {
  try {
    const parts = jwt.split(".");
    if (parts.length < 2) return null;
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf8"),
    ) as { exp?: unknown };
    return typeof payload.exp === "number" ? payload.exp : null;
  } catch {
    return null;
  }
}

/** True if exp is in the future (with skewSeconds leeway). */
export function isJwtExpired(
  jwt: string,
  skewSeconds = 30,
): boolean {
  const exp = readJwtExpSeconds(jwt);
  if (exp === null) return false;
  const now = Math.floor(Date.now() / 1000);
  return exp <= now + skewSeconds;
}
