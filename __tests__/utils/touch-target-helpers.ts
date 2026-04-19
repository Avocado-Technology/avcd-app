/**
 * Touch target assertions for Jest + jsdom.
 * getComputedStyle() often returns NaN for height/width with Tailwind; fall back to class checks.
 */
import { expect } from "@jest/globals"

/**
 * Square touch targets (e.g. icon buttons): height and width must meet minimum.
 */
export function assertMinimumTouchTarget(
  element: HTMLElement,
  minSize = 44,
): void {
  const styles = window.getComputedStyle(element)
  const height = parseFloat(styles.height)
  const width = parseFloat(styles.width)

  const numericOk =
    !Number.isNaN(height) &&
    height > 0 &&
    !Number.isNaN(width) &&
    width > 0 &&
    height >= minSize &&
    width >= minSize

  if (numericOk) return

  const cls =
    typeof element.className === "string"
      ? element.className
      : [...element.classList].join(" ")

  if (minSize <= 44) {
    expect(cls).toMatch(
      /\b(h-11|h-12|h-13|h-14|min-h-\[44px\]|min-h-\[48px\]|min-h-\[56px\]|min-h-11|min-h-12|min-h-14)\b/,
    )
    expect(cls).toMatch(
      /\b(w-11|w-12|min-w-\[44px\]|min-w-11|min-w-12)\b/,
    )
  } else {
    expect(cls).toMatch(/\b(h-14|min-h-\[56px\]|min-h-14)\b/)
    expect(cls).toMatch(/\b(w-14|min-w-\[56px\])\b/)
  }
}

/** For full-width CTAs where only height must meet the minimum. */
export function assertMinimumTouchHeight(
  element: HTMLElement,
  minPx: number,
): void {
  const styles = window.getComputedStyle(element)
  const height = parseFloat(styles.height)

  if (!Number.isNaN(height) && height >= minPx) return

  const cls =
    typeof element.className === "string"
      ? element.className
      : [...element.classList].join(" ")

  if (minPx >= 56) {
    expect(cls).toMatch(/\b(h-14|min-h-\[56px\]|min-h-14)\b/)
  } else {
    expect(cls).toMatch(
      /\b(h-11|h-12|h-14|min-h-\[44px\]|min-h-11|min-h-14)\b/,
    )
  }
}

/** Assert element includes a Tailwind touch-friendly height utility. */
export function assertHasTouchHeightClass(element: HTMLElement): void {
  const cls =
    typeof element.className === "string"
      ? element.className
      : [...element.classList].join(" ")
  expect(/\bh-(9|10|11|12|13|14)\b/.test(cls)).toBe(true)
}
