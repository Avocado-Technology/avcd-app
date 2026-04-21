import { redirect } from "@/i18n/navigation";

/**
 * Legacy path: organization chart now lives at `/`.
 * Keep redirect for bookmarks and external links.
 */
export default function OrganizationLegacyPage() {
  redirect({ href: "/", locale: "en" });
}
