"use client"

import { FinanceLoading } from "./finance-loading"
import { Eyebrow } from "@/components/ui/eyebrow"
import { SURFACE_CARD_CLASS } from "@/components/ui/surface-card"
import { cn } from "@/lib/utils"

interface GraphQLErrorExtension {
  code?: string
  [key: string]: unknown
}

interface GraphQLErrorShape {
  message: string
  extensions?: GraphQLErrorExtension
}

interface ErrorWithGraphQL extends Error {
  errors?: GraphQLErrorShape[]
}

import { useTranslations } from 'next-intl'

export interface FinanceGraphQLErrorProps {
  error: ErrorWithGraphQL | Error
  refetch: () => Promise<void>
  className?: string
}

export function FinanceGraphQLError({ error, refetch, className }: FinanceGraphQLErrorProps) {
  const t = useTranslations("Finance")
  const isGQLError = error && "errors" in error
  const isAuthError =
    isGQLError &&
    (error as ErrorWithGraphQL).errors?.some(
      (err) =>
        err.extensions?.code === "UNAUTHENTICATED" || err.extensions?.code === "FORBIDDEN",
    )

  const errorMessage = isAuthError
    ? t("notAuthorized")
    : t("failedToLoad")

  return (
    <div
      className={cn(
        "flex min-h-0 w-full flex-1 flex-col bg-[var(--g50)] px-[var(--sp-4)] pb-[var(--sp-4)] pt-[var(--sp-6)] lg:px-[var(--sp-6)] lg:pb-[var(--sp-6)]",
        className,
      )}
    >
      <div className="flex min-h-[min(420px,70vh)] flex-col items-center justify-center">
        <div
          role="alert"
          className={cn(SURFACE_CARD_CLASS, "w-full max-w-md px-[var(--sp-6)] py-[var(--sp-8)] text-center")}
        >
          <Eyebrow as="p" className="text-[var(--red)]">
            {t("couldNotLoad")}
          </Eyebrow>
          <p className="mt-2 text-sm text-[var(--g700)]">{errorMessage}</p>
          <button
            type="button"
            className="mt-[var(--sp-6)] rounded-[var(--r-md)] border border-[var(--g200)] bg-[var(--bg)] px-[var(--sp-4)] py-2 text-sm font-medium text-[var(--g900)] transition-colors hover:border-[var(--g400)]"
            onClick={() => {
              void refetch()
            }}
          >
            {t("retry")}
          </button>
        </div>
      </div>
    </div>
  )
}

/** Full-page loading state matching finance shell spacing. */
export function FinancePageLoading() {
  return (
    <div className="flex min-h-0 w-full flex-1 flex-col bg-[var(--g50)] px-[var(--sp-4)] pb-[var(--sp-4)] pt-[var(--sp-6)] lg:px-[var(--sp-6)] lg:pb-[var(--sp-6)]">
      <FinanceLoading />
    </div>
  )
}
