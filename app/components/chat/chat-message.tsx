import type { CSSProperties } from "react";

import { MemoizedMarkdown } from "@/app/components/chat/memoized-markdown";

type ChatRole = "user" | "assistant" | "system";

export interface ChatMessageProps {
  role: ChatRole;
  content: string;
  /** Unique stable id used for memoization keys (message.id from useChat) */
  messageId?: string;
  className?: string;
}

export function ChatMessage({
  role,
  content,
  messageId,
  className,
}: ChatMessageProps) {
  const alignment: CSSProperties =
    role === "user"
      ? { justifyContent: "flex-end" }
      : { justifyContent: "flex-start" };

  if (role === "user") {
    return (
      <div
        className={`flex w-full ${className ?? ""}`}
        style={alignment}
        data-role={role}
      >
        <div className="max-w-[85%] rounded-xl border border-green-600 bg-green-600 px-4 py-3 text-sm text-white shadow-sm">
          <div className="whitespace-pre-wrap break-words">{content}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex w-full ${className ?? ""}`}
      style={alignment}
      data-role={role}
    >
      <div className="max-w-[85%] rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-900 shadow-sm">
        <MemoizedMarkdown
          content={content}
          id={messageId ?? "msg"}
        />
      </div>
    </div>
  );
}
