/**
 * Streaming chat API: OpenAI GPT-4o + AVCD MCP tools (OAuth bearer from Auth0).
 */

import { createOpenAI } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  dynamicTool,
  jsonSchema,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai";
import type { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { NextRequest, NextResponse } from "next/server";

import { AccessTokenError } from "@auth0/nextjs-auth0/errors";

import { auth0 } from "@/lib/auth0";
import { createMcpClient } from "@/lib/chat/mcp-client";
import { extractBearerToken } from "@/lib/chat/token-extractor";
import { getMcpServerUrl } from "@/lib/mcp-server-url";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Fetch the LLM API guide from the GraphQL API so the model gets an
 * accurate schema on every request — prevents hallucinated field names.
 */
async function fetchLlmGuide(accessToken: string): Promise<string> {
  const base = (process.env.AVCD_API_URL ?? "").replace(/\/$/, "");
  if (!base) return "";
  try {
    const res = await fetch(`${base}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ query: "{ llmApiGuide }" }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return "";
    const json = (await res.json()) as { data?: { llmApiGuide?: string } };
    return json?.data?.llmApiGuide ?? "";
  } catch {
    return "";
  }
}

function safeToolKey(name: string, index: number): string {
  const sanitized = name
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 64);
  return sanitized.length > 0 ? sanitized : `tool_${index}`;
}

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY?.trim()) {
    return NextResponse.json(
      { error: "Chat service is not configured (OPENAI_API_KEY missing)." },
      { status: 503 },
    );
  }

  const tokenWrapper = new NextResponse();
  let accessToken: string | undefined;
  try {
    const tokenResult = await auth0.getAccessToken(req, tokenWrapper);
    accessToken = tokenResult.token;
  } catch (error) {
    if (error instanceof AccessTokenError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[chat] getAccessToken:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!accessToken?.trim()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const messagesUnknown = (raw as { messages?: unknown }).messages;
  if (!Array.isArray(messagesUnknown) || messagesUnknown.length === 0) {
    return NextResponse.json({ error: "messages required" }, { status: 400 });
  }

  const uiMessages = messagesUnknown as UIMessage[];

  let mcp: Client | undefined;
  try {
    mcp = await createMcpClient(
      getMcpServerUrl(),
      extractBearerToken(accessToken),
    );
  } catch (error) {
    console.warn("[chat] MCP connect failed; continuing without tools:", error);
  }

  const tools: Record<string, ReturnType<typeof dynamicTool>> = {};
  const seenKeys = new Set<string>();

  if (mcp) {
    try {
      const { tools: mcpTools } = await mcp.listTools();
      mcpTools.forEach((toolDef, index) => {
        let key = safeToolKey(toolDef.name, index);
        while (seenKeys.has(key)) {
          key = `${key}_${index}`;
        }
        seenKeys.add(key);
        try {
          tools[key] = dynamicTool({
            description: toolDef.description ?? `MCP tool: ${toolDef.name}`,
            inputSchema: jsonSchema(toolDef.inputSchema as Record<string, unknown>),
            execute: async (input) => {
              const out = await mcp!.callTool({
                name: toolDef.name,
                arguments: input as Record<string, unknown>,
              });
              return out;
            },
          });
        } catch (warnErr) {
          console.warn(`[chat] skipping tool registration for ${toolDef.name}:`, warnErr);
        }
      });
    } catch (warnErr) {
      console.warn("[chat] listTools failed; continuing without tools:", warnErr);
    }
  }

  let modelMessages;
  try {
    modelMessages = await convertToModelMessages(uiMessages);
  } catch (error) {
    console.error("[chat] convertToModelMessages:", error);
    await mcp?.close().catch(() => {});
    return NextResponse.json({ error: "Invalid messages payload" }, { status: 400 });
  }

  // Fetch the live API guide so the model knows the exact schema — prevents
  // hallucinated field names (e.g. querying for 'position' on Employee).
  const apiGuide = await fetchLlmGuide(accessToken);

  const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const result = streamText({
    model: openai(process.env.CHAT_MODEL?.trim() || "gpt-4o"),
    system: [
      "You are the AVCD assistant for this authenticated user.",
      "You have access to MCP tools that query the AVCD GraphQL API.",
      apiGuide
        ? `Use ONLY the fields listed in the API documentation below — never guess or add extra fields.\n\n${apiGuide}`
        : "",
      "When a tool call fails, do NOT retry the same call with the same fields.",
      "After at most 3 tool calls, always write a plain-text reply to the user summarising what you found (or explain the error briefly).",
      "Never finish your turn with only tool calls and no text.",
      "Prefer concise, actionable replies.",
    ]
      .filter(Boolean)
      .join("\n\n"),
    messages: modelMessages,
    tools: Object.keys(tools).length > 0 ? tools : undefined,
    stopWhen: stepCountIs(10),
    async onFinish() {
      await mcp?.close().catch(() => {});
    },
    async onError(event) {
      console.error("[chat] stream error:", event.error);
      await mcp?.close().catch(() => {});
    },
  });

  const streamResponse = result.toUIMessageStreamResponse({
    headers: {
      "Cache-Control": "private, no-store, max-age=0",
    },
  });

  tokenWrapper.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") {
      streamResponse.headers.append(key, value);
    }
  });

  return streamResponse;
}
