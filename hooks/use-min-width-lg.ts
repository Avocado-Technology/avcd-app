"use client"

import { useEffect, useState } from "react"

/** Matches Tailwind `lg:` breakpoint (1024px). Uses live `matchMedia` so Jest mocks apply. */
const QUERY = "(min-width: 1024px)"

function readMinWidthLg(): boolean {
  if (typeof window === "undefined") return true
  if (typeof window.matchMedia !== "function") return true
  return window.matchMedia(QUERY).matches
}

export function useMinWidthLg(): boolean {
  const [matches, setMatches] = useState(readMinWidthLg)

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return
    const mq = window.matchMedia(QUERY)
    const handler = () => setMatches(mq.matches)
    setMatches(mq.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  return matches
}
