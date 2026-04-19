export function shouldUseReducedMotion(): boolean {
  if (typeof window === "undefined") return false;

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export interface SpringConfig {
  type: "spring" | "tween";
  stiffness?: number;
  damping?: number;
  duration?: number;
}

export function getAnimationConfig(
  reducedMotion: boolean,
  override?: Partial<SpringConfig>,
): SpringConfig {
  if (reducedMotion) {
    return {
      type: "tween",
      duration: 0,
    };
  }

  return {
    type: "spring",
    stiffness: override?.stiffness ?? 260,
    damping: override?.damping ?? 20,
  };
}
