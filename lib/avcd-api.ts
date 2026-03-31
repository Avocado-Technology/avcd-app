/**
 * Base URL for server-side calls from Next.js to the AVCD FastAPI service.
 * Not exposed to the browser — set `AVCD_API_URL` in .env.local, Docker Compose, or Vercel env.
 */
export function getAvcdApiBaseUrl(): string {
  const raw = process.env.AVCD_API_URL?.trim();
  if (!raw) {
    throw new Error(
      "AVCD_API_URL is not set. For local dev add it to web/.env.local (e.g. http://localhost:8000).",
    );
  }
  return raw.replace(/\/+$/, "");
}
