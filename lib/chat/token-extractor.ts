export function extractBearerToken(
  token: string | null | undefined,
): string | null {
  const trimmed = token?.trim();
  if (!trimmed) return null;
  return `Bearer ${trimmed}`;
}
