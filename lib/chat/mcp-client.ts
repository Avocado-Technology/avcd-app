import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

export type McpClientInstance = Client;

export async function createMcpClient(
  mcpUrl: string,
  bearerToken: string | null,
): Promise<McpClientInstance> {
  if (!mcpUrl) throw new Error("mcpUrl is required");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (bearerToken) headers.Authorization = bearerToken;
  const transport = new StreamableHTTPClientTransport(new URL(mcpUrl), {
    requestInit: { headers },
  });
  const client = new Client({ name: "avcd-web-chat", version: "1.0.0" });
  await client.connect(transport);
  return client;
}
