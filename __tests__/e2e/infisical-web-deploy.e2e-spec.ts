/**
 * @jest-environment node
 */
/**
 * E2E: validates deployed web stack uses Infisical-sourced Keycloak config.
 * Skip locally with E2E_SKIP_DEPLOY=1 when dev.avcd.ai is unreachable.
 */
describe("E2E: Web Infisical deploy — Goal: OIDC export enables Keycloak login", () => {
  it("should redirect /api/auth/login to Keycloak when deployed with Infisical secrets", async () => {
    if (process.env.E2E_SKIP_DEPLOY === "1") {
      return;
    }

    const baseUrl = process.env.E2E_WEB_URL ?? "https://dev.avcd.ai";

    const res = await fetch(`${baseUrl}/api/auth/login`, { redirect: "manual" });

    expect(res.status).not.toBe(500);
    expect([302, 307]).toContain(res.status);
    const location = res.headers.get("location") ?? "";
    expect(location).toMatch(/auth\.dev\.avcd\.ai\/realms\/avcd/);
  });
});
