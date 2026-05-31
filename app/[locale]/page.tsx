import { getSession } from "@/lib/auth/session";
import { getMcpServerUrl } from "@/lib/mcp-server-url";
import { GoogleLoginGate } from "../components/GoogleLoginGate";
import { OrgPageWithData } from "./org/org-page-with-data";

export default async function Home() {
  const session = await getSession();
  const mcpServerUrl = getMcpServerUrl();

  if (!session?.user) {
    return <GoogleLoginGate mcpServerUrl={mcpServerUrl} />;
  }

  return <OrgPageWithData />;
}
