import type { Metadata, Viewport } from "next";
import { getSession } from "@auth0/nextjs-auth0";

import { AppTopBar } from "./components/AppTopBar";
import { SessionProvider } from "./components/SessionProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarWrapper } from "@/components/sidebar-wrapper";
import { SidebarInset } from "@/components/ui/sidebar";
import { MobileNavigationChrome } from "@/components/mobile-navigation-chrome";
import { ApolloProvider } from "@/lib/apollo-provider";
import { cn } from "@/lib/utils";
import "./globals.css";

export const metadata: Metadata = {
  title: "AVCD — Organization",
  description: "Company org chart and team management",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5, // Allow zoom for accessibility
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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{
          __html: `
            try {
              const theme = localStorage.getItem('avcd-theme') || 'system';
              if (theme === 'dark' || 
                 (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.add('light');
              }
            } catch {}
          `
        }} />
      </head>
      <body
        className={cn("bg-background text-foreground")}
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <ThemeProvider>
          <SessionProvider>
            <ApolloProvider>
              {serializedSession ? (
                <SidebarProvider>
                  <SidebarWrapper user={serializedSession.user} />
                  <SidebarInset>
                    <AppTopBar session={serializedSession} />
                    <MobileNavigationChrome>{children}</MobileNavigationChrome>
                  </SidebarInset>
                </SidebarProvider>
              ) : (
                children
              )}
            </ApolloProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
