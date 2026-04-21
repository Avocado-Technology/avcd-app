"use client";

import { useLocale, useTranslations } from "next-intl";
import { Languages, ChevronDown } from "lucide-react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const localeLabels = {
  en: "localeEn",
  pt: "localePt",
} as const;

export function SettingsLocalePreference() {
  const t = useTranslations("Settings");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const currentLabelKey = localeLabels[locale as keyof typeof localeLabels];
  const currentLabel = currentLabelKey ? t(currentLabelKey) : locale.toUpperCase();

  return (
    <section
      aria-labelledby="settings-language-heading"
      style={{
        width: "100%",
        padding: "var(--sp-6)",
        borderRadius: "var(--r-xl)",
        background: "var(--bg)",
        border: "1px solid var(--g200)",
        textAlign: "left",
      }}
    >
      <h2
        id="settings-language-heading"
        style={{
          margin: 0,
          fontSize: "0.875rem",
          fontFamily: "var(--sans)",
          fontWeight: 600,
          color: "var(--g900)",
          letterSpacing: "-0.02em",
        }}
      >
        {t("languageLabel")}
      </h2>
      <p
        style={{
          margin: "var(--sp-2) 0 var(--sp-4)",
          fontSize: "0.8125rem",
          color: "var(--g500)",
          lineHeight: 1.55,
        }}
      >
        {t("languageHelp")}
      </p>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="secondary"
            className="min-h-11 w-full max-w-xs justify-between font-sans text-sm font-normal"
            aria-label={t("languageMenuAria")}
          >
            <span className="flex items-center gap-2 truncate">
              <Languages className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
              <span className="truncate">{currentLabel}</span>
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-60" aria-hidden />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[var(--radix-dropdown-menu-trigger-width)] max-w-xs">
          {routing.locales.map((code) => {
            const key = localeLabels[code as keyof typeof localeLabels];
            const label = key ? t(key) : code.toUpperCase();
            const selected = code === locale;
            return (
              <DropdownMenuItem
                key={code}
                className={selected ? "bg-accent font-medium" : undefined}
                onClick={() => {
                  if (code !== locale) {
                    router.replace(pathname, { locale: code });
                  }
                }}
              >
                {label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </section>
  );
}
