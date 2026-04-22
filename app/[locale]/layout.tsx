import type { Metadata, Viewport } from "next";
import { auth0 } from "@/lib/auth0";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";

// IMPORTANT: import paths changed from "./" to "../" because this file
// is now one directory deeper than the original app/layout.tsx
import { AppTopBar } from "../components/AppTopBar";
import { SessionProvider } from "../components/SessionProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarWrapper } from "@/components/sidebar-wrapper";
import { SidebarInset } from "@/components/ui/sidebar";
import { MobileNavigationChrome } from "@/components/mobile-navigation-chrome";
import { ApolloProvider } from "@/lib/apollo-provider";
import { cn } from "@/lib/utils";
import "../globals.css"; // CHANGED from "./globals.css"

export const metadata: Metadata = {
  title: "AVCD — Organization",
  description: "Company org chart and team management",
  metadataBase: new URL(
    process.env.APP_BASE_URL ??
      process.env.AUTH0_BASE_URL ??
      "http://localhost:3000",
  ),
  icons: {
    icon: [{ url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

// Required for Next.js static generation with [locale] dynamic segment
// Tells Next.js which locale values are valid for standalone output
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const session = await auth0.getSession();

  const serializedSession = session
    ? {
        user: {
          name: session.user?.name,
          email: session.user?.email,
          picture: session.user?.picture,
        },
      }
    : null;

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{
          __html: `try{const t=localStorage.getItem('avcd-theme')||'system';if(t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}else{document.documentElement.classList.add('light')}}catch{}`
        }} />
      </head>
      <body
        className={cn("bg-background text-foreground")}
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        {/* NextIntlClientProvider must be outermost to provide locale to all client components */}
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <SessionProvider user={session?.user}>
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
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
