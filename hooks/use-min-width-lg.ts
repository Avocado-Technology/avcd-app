"use client";

import { useSyncExternalStore } from "react";

/** Matches Tailwind `lg:` breakpoint (1024px). */
const QUERY = "(min-width: 1024px)";

function subscribe(onStoreChange: () => void): () => void {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return () => {};
  }
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

/**
 * Match SSR/hydration: previously `typeof window === "undefined"` returned `true`.
 * Keeps server HTML aligned with the client’s first hydratable paint (React 18+ uses
 * getServerSnapshot during SSR and hydration — see react.dev useSyncExternalStore).
 */
function getServerSnapshot(): boolean {
  return true;
}

/** Live `lg` breakpoint; avoids hydration mismatch from useState + window in initializer. */
export function useMinWidthLg(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
