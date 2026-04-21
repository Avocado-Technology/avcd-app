"use client"

import { Link } from "@/i18n/navigation"

import { Eyebrow } from "@/components/ui/eyebrow"
import { SURFACE_CARD_CLASS } from "@/components/ui/surface-card"
import { cn } from "@/lib/utils"
import { useTranslations } from 'next-intl'

export function FinanceNoOrganization({ className }: { className?: string }) {
  const t = useTranslations("Finance")

  return (
    <div
      className={cn(
        "flex min-h-0 w-full flex-1 flex-col bg-[var(--g50)] px-[var(--sp-4)] pb-[var(--sp-4)] pt-[var(--sp-6)] lg:px-[var(--sp-6)] lg:pb-[var(--sp-6)]",
        className,
      )}
    >
      <div className="flex min-h-[min(360px,60vh)] flex-col items-center justify-center">
        <div
          role="status"
          className={cn(SURFACE_CARD_CLASS, "w-full max-w-md px-[var(--sp-6)] py-[var(--sp-10)] text-center")}
        >
          <Eyebrow as="p">{t("noOrganization")}</Eyebrow>
          <p className="mt-2 text-sm text-[var(--g700)]">
            {t("createOrganizationFirst")}
          </p>
          <Link
            href="/"
            className="mt-[var(--sp-6)] inline-flex rounded-[var(--r-md)] border border-[var(--g200)] bg-[var(--bg)] px-[var(--sp-4)] py-2 text-sm font-medium text-[var(--g900)] transition-colors hover:border-[var(--g400)]"
          >
            {t("goToOrganization")}
          </Link>
        </div>
      </div>
    </div>
  )
}
