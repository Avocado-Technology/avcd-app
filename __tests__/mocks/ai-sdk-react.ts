export type UseChatStub = {
  messages: Array<{
    id: string;
    role: string;
    parts: Array<{ type: string; text?: string }>;
  }>;
  sendMessage: ReturnType<typeof jest.fn>;
  status: string;
  error?: Error;
};

export const chatUseChatStub: UseChatStub = {
  messages: [],
  sendMessage: jest.fn(),
  status: "ready",
  error: undefined,
};

/** Wired via jest.config moduleNameMapper so `@ai-sdk/react` resolves here in tests */
export function useChat(_options?: unknown): UseChatStub {
  return chatUseChatStub;
}
