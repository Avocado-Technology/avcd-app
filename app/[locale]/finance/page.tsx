import { auth0 } from "@/lib/auth0";
import { redirect } from "@/i18n/navigation";

import { FinancePageShell } from "./finance-page-shell";

export default async function FinancePage() {
  const session = await auth0.getSession();
  if (!session?.user) {
    redirect({ href: "/", locale: "en" });
  }

  return <FinancePageShell />;
}
