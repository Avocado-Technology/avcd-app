import type { UIMessage } from "ai";

export type ChatMessageShape = UIMessage;

export interface McpUiResource {
  type: "resource";
  resource: {
    uri: string;
    mimeType: "text/html;profile=mcp-app";
    text?: string;
    blob?: string;
  };
}

export function isMcpUiResource(value: unknown): value is McpUiResource {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  const res = v.resource as Record<string, unknown> | undefined;
  return (
    v.type === "resource" &&
    typeof res === "object" &&
    res !== null &&
    res.mimeType === "text/html;profile=mcp-app"
  );
}
