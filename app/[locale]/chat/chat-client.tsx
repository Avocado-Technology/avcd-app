"use client";

import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import { DefaultChatTransport } from "ai";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

import { ChatInput } from "@/app/components/chat/chat-input";
import { ChatMessage } from "@/app/components/chat/chat-message";
import { ToolStatusPill } from "@/app/components/chat/tool-status-pill";

function textFromUiMessageParts(parts: UIMessage["parts"]): string {
  if (!parts?.length) return "";
  let out = "";
  for (const p of parts) {
    if (p.type === "text") out += (p as { type: "text"; text: string }).text;
  }
  return out;
}

export function ChatClient() {
  const t = useTranslations("Chat");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      credentials: "same-origin",
    }),
  });

  useEffect(() => {
    const el = scrollRef.current;
    if (el && typeof el.scrollTo === "function") {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages.length, status]);

  const loading = status === "submitted" || status === "streaming";

  const submit = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    await sendMessage({ text: trimmed });
    setInput("");
  }, [input, loading, sendMessage]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[var(--g50)]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto flex max-w-container flex-col gap-4">
          {messages.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">
              {t("emptyState")}
            </p>
          )}
          {messages.map((m) => (
            <div key={m.id} className="flex flex-col gap-2">
              {m.role === "user" && (
                <ChatMessage
                  role="user"
                  content={textFromUiMessageParts(m.parts)}
                />
              )}

              {m.role === "assistant" && (
                <>
                  {/* Tool status pills — animated during execution, null when done */}
                  {m.parts?.map((part, idx) =>
                    part.type === "dynamic-tool" ? (
                      <ToolStatusPill
                        key={part.toolCallId ?? `${m.id}-tool-${idx}`}
                        part={part}
                      />
                    ) : null,
                  )}
                  {/* Text response rendered after tool activity */}
                  {(() => {
                    const text = textFromUiMessageParts(m.parts);
                    if (!text) return null;
                    return (
                      <ChatMessage
                        role="assistant"
                        messageId={m.id}
                        content={text}
                      />
                    );
                  })()}
                </>
              )}
            </div>
          ))}
          {loading && (
            <p className="text-sm text-muted-foreground">{t("loadingLabel")}</p>
          )}
          {error && (
            <p className="text-sm text-destructive">{t("errorLabel")}</p>
          )}
        </div>
      </div>
      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={() => {
          void submit();
        }}
        isLoading={loading}
        placeholder={t("placeholder")}
      />
    </div>
  );
}
