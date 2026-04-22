import type { ReactNode } from "react";

/**
 * Pass-through root layout. The real <html> and <body> live in
 * `app/[locale]/layout.tsx` with the correct `lang` for i18n.
 * Nesting a second <html> under the default root <html> caused
 * "In HTML, <html> cannot be a child of <body>" and hydration errors.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
