import { getTranslations } from "next-intl/server";

import { getSession } from "@/lib/auth/session";
import { redirect } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

import { ChatClient } from "./chat-client";

export default async function ChatPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect({ href: "/", locale: routing.defaultLocale });
  }

  const t = await getTranslations("Chat");

  return (
    <main className="flex min-h-0 flex-1 flex-col bg-background">
      <header className="border-b border-gray-200 px-6 py-4">
        <h1 className="font-sans text-xl font-semibold tracking-tight text-gray-900">
          {t("title")}
        </h1>
      </header>
      <ChatClient />
    </main>
  );
}
