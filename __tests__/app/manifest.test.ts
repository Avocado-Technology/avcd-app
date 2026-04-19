import manifest from "@/app/manifest";

describe("app/manifest", () => {
  it("returns AVCD branding and standalone display", () => {
    const m = manifest();
    expect(m.short_name).toBe("AVCD");
    expect(m.display).toBe("standalone");
    expect(m.start_url).toBe("/");
  });

  it("includes at least three icons with root-relative paths", () => {
    const m = manifest();
    expect(m.icons).toBeDefined();
    expect(m.icons!.length).toBeGreaterThanOrEqual(3);
    for (const icon of m.icons!) {
      expect(icon.src).toMatch(/^\/icons\//);
    }
  });

  it("includes a maskable512 icon entry", () => {
    const m = manifest();
    const maskable = m.icons!.find(
      (i) => i.purpose === "maskable" && i.sizes === "512x512",
    );
    expect(maskable).toBeDefined();
    expect(maskable!.src).toBe("/icons/icon-maskable-512x512.png");
  });
});
