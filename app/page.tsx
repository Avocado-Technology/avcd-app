import { auth } from "@/auth";

import { ApiKeysPanel } from "./components/ApiKeysPanel";
import { GoogleLoginGate } from "./components/GoogleLoginGate";

export default async function Home() {
  const session = await auth();

  if (!session) {
    return <GoogleLoginGate />;
  }

  return (
    <main
      style={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "clamp(1.25rem, 4vw, 2rem)",
        paddingBottom: "clamp(2rem, 6vw, 3rem)",
        textAlign: "center",
        background: "var(--avcd-surface-light)",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "1.05rem",
          fontFamily: "var(--font-body)",
          color: "var(--avcd-text-on-light)",
          lineHeight: 1.6,
          maxWidth: "28ch",
        }}
      >
        You are signed in. Use the bar above to sign out when you are done.
      </p>
      <ApiKeysPanel />
    </main>
  );
}
