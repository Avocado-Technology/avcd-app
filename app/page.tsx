import { getSession } from "@auth0/nextjs-auth0";
import { getMcpServerUrl } from "@/lib/mcp-server-url";

import { AvcdAccessTokenPanel } from "./components/AvcdAccessTokenPanel";
import { ClaudeConnectionSteps } from "./components/ClaudeConnectionSteps";
import { GoogleLoginGate } from "./components/GoogleLoginGate";
import { OAuthCredentialsPanel } from "./components/OAuthCredentialsPanel";

const MCP_BUNDLE_PATH = "/mcp/avcd-graphql.mcpb";

export default async function Home() {
  const session = await getSession();
  const mcpServerUrl = getMcpServerUrl();

  if (!session || !session.user) {
    return <GoogleLoginGate mcpServerUrl={mcpServerUrl} />;
  }

  const publicApiBase = process.env.NEXT_PUBLIC_AVCD_API_URL?.trim();
  const installerApiUrl = publicApiBase?.replace(/\/$/, "");

  return (
    <main
      style={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "var(--sp-12) var(--sp-6) var(--sp-16)",
        background: "var(--g50)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1080px",
          textAlign: "left",
          display: "flex",
          flexDirection: "column",
          gap: "var(--sp-8)",
        }}
      >
        <header>
          <h1
            style={{
              margin: 0,
              fontSize: "2rem",
              fontFamily: "var(--sans)",
              fontWeight: 600,
              color: "var(--g900)",
              letterSpacing: "-0.03em",
              lineHeight: 1.2,
            }}
          >
            MCP Setup
          </h1>
          <p style={{ margin: "var(--sp-3) 0 0", fontSize: "1rem", color: "var(--g700)", lineHeight: 1.6 }}>
            <a
              href={MCP_BUNDLE_PATH}
              download="avcd-graphql.mcpb"
              style={{
                fontFamily: "var(--sans)",
                fontSize: "1rem",
                fontWeight: 400,
              }}
            >
              Download MCP bundle
            </a>
          </p>
          <p
            style={{
              margin: "var(--sp-2) 0 0",
              fontSize: "0.875rem",
              fontFamily: "var(--mono)",
              color: "var(--g500)",
              lineHeight: 1.5,
            }}
          >
            Bundle missing? Run <code style={{ fontSize: "0.875rem" }}>make -C mcp publish</code>.
          </p>
        </header>

        {installerApiUrl ? (
          <p
            style={{
              margin: 0,
              fontSize: "0.875rem",
              fontFamily: "var(--sans)",
              color: "var(--g700)",
              lineHeight: 1.6,
            }}
          >
            API URL for the installer:{" "}
            <code
              style={{
                fontSize: "0.875rem",
                wordBreak: "break-all",
                fontFamily: "var(--mono)",
                color: "var(--g500)",
              }}
            >
              {installerApiUrl}
            </code>
          </p>
        ) : null}

        {/* OAuth client credentials - primary method */}
        <OAuthCredentialsPanel mcpServerUrl={mcpServerUrl} />

        {/* Connection instructions for both OAuth and manual bearer */}
        <ClaudeConnectionSteps mcpServerUrl={mcpServerUrl} />

        {/* Access token for manual/fallback/API use */}
        <AvcdAccessTokenPanel mcpServerUrl={mcpServerUrl} />
      </div>
    </main>
  );
}
