import { auth } from "@/auth";
import { getMcpServerUrl } from "@/lib/mcp-server-url";

import { AvcdAccessTokenPanel } from "./components/AvcdAccessTokenPanel";
import { ClaudeConnectionSteps } from "./components/ClaudeConnectionSteps";
import { GoogleLoginGate } from "./components/GoogleLoginGate";

const MCP_BUNDLE_PATH = "/mcp/avcd-graphql.mcpb";

export default async function Home() {
  const session = await auth();
  const mcpServerUrl = getMcpServerUrl();

  if (!session) {
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
        padding: "clamp(1.5rem, 5vw, 2.5rem)",
        paddingBottom: "clamp(2.5rem, 8vw, 4rem)",
        background: "var(--avcd-surface-light)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "min(32rem, 100%)",
          textAlign: "left",
          display: "flex",
          flexDirection: "column",
          gap: "2.25rem",
        }}
      >
        <header>
          <h1
            style={{
              margin: 0,
              fontSize: "1.25rem",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              color: "var(--avcd-text-on-light)",
              letterSpacing: "-0.02em",
              lineHeight: 1.3,
            }}
          >
            MCP setup
          </h1>
          <p style={{ margin: "0.85rem 0 0" }}>
            <a
              href={MCP_BUNDLE_PATH}
              download="avcd-graphql.mcpb"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.9375rem",
                fontWeight: 500,
              }}
            >
              Download MCP bundle
            </a>
          </p>
          <p
            style={{
              margin: "0.65rem 0 0",
              fontSize: "0.75rem",
              fontFamily: "var(--font-body)",
              color: "var(--avcd-text-muted)",
              lineHeight: 1.45,
            }}
          >
            Bundle missing? Run <code style={{ fontSize: "0.7em" }}>make -C mcp publish</code>.
          </p>
        </header>

        {installerApiUrl ? (
          <p
            style={{
              margin: 0,
              fontSize: "0.875rem",
              fontFamily: "var(--font-body)",
              color: "var(--avcd-text-on-light)",
              lineHeight: 1.5,
            }}
          >
            API URL for the installer:{" "}
            <code
              style={{
                fontSize: "0.82em",
                wordBreak: "break-all",
                fontFamily: "ui-monospace, monospace",
              }}
            >
              {installerApiUrl}
            </code>
          </p>
        ) : null}

        <ClaudeConnectionSteps mcpServerUrl={mcpServerUrl} />

        <AvcdAccessTokenPanel mcpServerUrl={mcpServerUrl} />
      </div>
    </main>
  );
}
