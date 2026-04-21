import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "@/i18n/navigation";

import { FinancePageShell } from "./finance-page-shell";

export default async function FinancePage() {
  const session = await getSession();
  if (!session?.user) {
    redirect({ href: "/", locale: "en" });
  }

  return <FinancePageShell />;
}
