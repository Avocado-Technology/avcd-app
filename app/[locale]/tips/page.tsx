import { getSession } from "@/lib/auth/session"
import { redirect } from "@/i18n/navigation"
import { getTranslations } from "next-intl/server"

import { TipsClientMock } from "./tips-client-mock"

export async function generateMetadata() {
  const t = await getTranslations("Tips")
  return {
    title: t("pageTitle"),
  }
}

export default async function TipsPage() {
  const session = await getSession()
  if (!session?.user) {
    redirect({ href: "/", locale: "en" })
  }

  return <TipsClientMock />
}
