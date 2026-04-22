import { describe, expect, it, jest, beforeEach } from "@jest/globals";
import { render, screen } from "@testing-library/react";

import { chatUseChatStub } from "../../mocks/ai-sdk-react";

import { ChatClient } from "@/app/[locale]/chat/chat-client";

describe("ChatClient", () => {
  beforeEach(() => {
    chatUseChatStub.messages = [];
    chatUseChatStub.sendMessage = jest.fn();
    chatUseChatStub.status = "ready";
    chatUseChatStub.error = undefined;
  });

  it("GivenNoMessages_WhenRendering_ThenShowsInputBar", () => {
    render(<ChatClient />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send" })).toBeInTheDocument();
  });

  it("GivenLoadingState_WhenRendering_ThenShowsLoadingLabel", () => {
    chatUseChatStub.status = "streaming";

    render(<ChatClient />);
    expect(screen.getByText("Chat.loadingLabel")).toBeInTheDocument();
  });

  it("GivenMessages_WhenRendering_ThenShowsChatMessageComponents", () => {
    chatUseChatStub.messages = [
      {
        id: "1",
        role: "user",
        parts: [{ type: "text", text: "hello" }],
      },
    ];

    render(<ChatClient />);
    expect(screen.getByText("hello")).toBeInTheDocument();
  });

  it("GivenErrorState_WhenRendering_ThenShowsErrorLabel", () => {
    chatUseChatStub.error = new Error("fail");

    render(<ChatClient />);
    expect(screen.getByText("Chat.errorLabel")).toBeInTheDocument();
  });
});
