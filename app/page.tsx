import { getSession } from "@auth0/nextjs-auth0";
import { getMcpServerUrl } from "@/lib/mcp-server-url";
import { GoogleLoginGate } from "./components/GoogleLoginGate";

export default async function Home() {
  const session = await getSession();
  const mcpServerUrl = getMcpServerUrl();

  if (!session || !session.user) {
    return <GoogleLoginGate mcpServerUrl={mcpServerUrl} />;
  }

  return (
    <main
      style={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--sp-6)",
        background: "var(--g50)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "640px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: "var(--sp-6)",
        }}
      >
        <header>
          <h1
            style={{
              margin: 0,
              fontSize: "1.5rem",
              fontFamily: "var(--sans)",
              fontWeight: 600,
              color: "var(--g900)",
              letterSpacing: "-0.03em",
              lineHeight: 1.2,
            }}
          >
            MCP Setup
          </h1>
          <p
            style={{
              margin: "var(--sp-3) 0 0",
              fontSize: "0.875rem",
              color: "var(--g500)",
              lineHeight: 1.6,
            }}
          >
            Connect Claude to your AVCD API with OAuth authentication
          </p>
        </header>

        <div
          style={{
            padding: "var(--sp-6)",
            borderRadius: "var(--r-xl)",
            background: "var(--bg)",
            border: "1px solid var(--g200)",
            textAlign: "left",
          }}
        >
          <div
            style={{
              marginBottom: "var(--sp-4)",
              padding: "var(--sp-4)",
              borderRadius: "var(--r-md)",
              background: "var(--g50)",
              border: "1px solid var(--g200)",
            }}
          >
            <div
              style={{
                fontSize: "0.75rem",
                fontFamily: "var(--mono)",
                fontWeight: 500,
                color: "var(--g500)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "var(--sp-3)",
              }}
            >
              MCP Server URL
            </div>
            <code
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontFamily: "var(--mono)",
                color: "var(--g900)",
                wordBreak: "break-all",
                lineHeight: 1.5,
              }}
            >
              {mcpServerUrl}
            </code>
          </div>

          <ol
            style={{
              margin: 0,
              paddingLeft: "var(--sp-6)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--sp-3)",
              fontSize: "0.875rem",
              fontFamily: "var(--sans)",
              color: "var(--g700)",
              lineHeight: 1.6,
            }}
          >
            <li>Open Claude Settings → Connectors → Add MCP Server</li>
            <li>Paste the MCP Server URL above</li>
            <li>Select OAuth authentication</li>
            <li>Sign in with your Google account</li>
          </ol>

          <div
            style={{
              marginTop: "var(--sp-5)",
              padding: "var(--sp-4)",
              borderRadius: "var(--r-md)",
              background: "var(--green-lt)",
              border: "1px solid var(--green-bd)",
              fontSize: "0.75rem",
              color: "var(--g700)",
              lineHeight: 1.6,
            }}
          >
            Authentication is handled automatically via OAuth. No API keys required.
          </div>
        </div>
      </div>
    </main>
  );
}
