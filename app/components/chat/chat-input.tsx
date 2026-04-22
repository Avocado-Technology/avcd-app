"use client";

import type { KeyboardEvent } from "react";

export interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  placeholder?: string;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  isLoading,
  placeholder,
}: ChatInputProps) {
  const trimmed = value.trim();
  const sendDisabled = trimmed === "" || isLoading;

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!sendDisabled) onSubmit();
    }
  }

  return (
    <div className="flex gap-2 border-t border-gray-200 bg-background p-3 md:p-4">
      <textarea
        className="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[touch-min] flex-1 resize-none rounded-lg border bg-transparent px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50"
        rows={2}
        placeholder={placeholder}
        value={value}
        disabled={isLoading}
        aria-label={placeholder ?? "Message"}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        type="button"
        className="border-input bg-primary text-primary-foreground hover:bg-primary/90 inline-flex min-h-touch-min min-w-touch-min shrink-0 items-center justify-center rounded-lg border px-4 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50"
        aria-label="Send"
        disabled={sendDisabled}
        onClick={() => {
          if (!sendDisabled) onSubmit();
        }}
      >
        Send
      </button>
    </div>
  );
}
