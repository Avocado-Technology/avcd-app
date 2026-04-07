/**
 * Base URL for server-side calls from Next.js to the AVCD auth issuer (Google ID token → API JWT).
 * Not exposed to the browser — set `AVCD_AUTH_URL` in .env.local, Docker Compose, or Vercel env.
 */
export function getAvcdAuthBaseUrl(): string {
  const raw = process.env.AVCD_AUTH_URL?.trim();
  if (!raw) {
    throw new Error(
      "AVCD_AUTH_URL is not set. Examples: http://127.0.0.1:8010 (local auth), http://auth:8000 (web + auth on avcd_edge). If Next.js must call through Traefik, use the public issuer base including the path prefix, e.g. https://your-host/auth (POST …/google/token).",
    );
  }
  return raw.replace(/\/+$/, "");
}
