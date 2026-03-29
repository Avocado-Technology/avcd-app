import type { Metadata } from "next";
import { Fraunces, Newsreader } from "next/font/google";
import { auth } from "@/auth";

import { AppTopBar } from "./components/AppTopBar";
import { SessionProvider } from "./components/SessionProvider";
import "./globals.css";

const fontDisplay = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600"],
});

const fontBody = Newsreader({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "AVCD Tech",
  description:
    "Sign in to download the MCP bundle and copy your bearer token for Claude Desktop.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" className={`${fontDisplay.variable} ${fontBody.variable}`}>
      <body style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <SessionProvider>
          {session ? <AppTopBar session={session} /> : null}
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
