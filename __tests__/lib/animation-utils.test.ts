import { describe, it, expect, beforeEach } from "@jest/globals";
import {
  getAnimationConfig,
  shouldUseReducedMotion,
} from "@/lib/animation-utils";

describe("Animation Utilities", () => {
  describe("shouldUseReducedMotion", () => {
    beforeEach(() => {
      // Reset matchMedia mock
      delete (window as any).matchMedia;
    });

    it("should return false when prefers-reduced-motion is not set", () => {
      window.matchMedia = jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }));

      expect(shouldUseReducedMotion()).toBe(false);
    });

    it("should return true when prefers-reduced-motion is reduce", () => {
      window.matchMedia = jest.fn().mockImplementation((query) => ({
        matches: query === "(prefers-reduced-motion: reduce)",
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }));

      expect(shouldUseReducedMotion()).toBe(true);
    });
  });

  describe("getAnimationConfig", () => {
    it("should return spring config for normal motion", () => {
      const config = getAnimationConfig(false);

      expect(config.type).toBe("spring");
      expect(config.stiffness).toBe(260);
      expect(config.damping).toBe(20);
    });

    it("should return instant config for reduced motion", () => {
      const config = getAnimationConfig(true);

      expect(config.type).toBe("tween");
      expect(config.duration).toBe(0);
    });

    it("should allow override of stiffness and damping", () => {
      const config = getAnimationConfig(false, { stiffness: 100, damping: 10 });

      expect(config.stiffness).toBe(100);
      expect(config.damping).toBe(10);
    });
  });
});
