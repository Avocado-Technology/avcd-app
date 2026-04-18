import type { Metadata } from "next";
import { getSession } from "@auth0/nextjs-auth0";

import { AppTopBar } from "./components/AppTopBar";
import { SessionProvider } from "./components/SessionProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "AVCD — MCP Setup",
  description:
    "Connect your AVCD GraphQL API to Claude via OAuth or bearer token.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  // Serialize session for client components (only pass plain objects)
  const serializedSession = session ? {
    user: {
      name: session.user?.name,
      email: session.user?.email,
      picture: session.user?.picture,
    },
    accessToken: session.accessToken,
  } : null;

  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <SessionProvider>
          {serializedSession ? <AppTopBar session={serializedSession} /> : null}
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
