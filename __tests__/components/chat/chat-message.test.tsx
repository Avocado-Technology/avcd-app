import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";

import { ChatMessage } from "@/app/components/chat/chat-message";

describe("ChatMessage", () => {
  it("GivenUserMessage_WhenRendering_ThenAppliesUserAlignment", () => {
    const { container } = render(
      <ChatMessage role="user" content="hello" />,
    );
    const row = container.querySelector('[data-role="user"]') as HTMLElement;
    expect(row.style.justifyContent).toBe("flex-end");
  });

  it("GivenAssistantMessage_WhenRendering_ThenAppliesAssistantAlignment", () => {
    const { container } = render(
      <ChatMessage role="assistant" content="hi" />,
    );
    const row = container.querySelector('[data-role="assistant"]') as HTMLElement;
    expect(row.style.justifyContent).toBe("flex-start");
  });

  it("GivenAnyMessage_WhenRendering_ThenDisplaysContent", () => {
    render(<ChatMessage role="user" content="visible text" />);
    expect(screen.getByText("visible text")).toBeInTheDocument();
  });

  it("GivenEmptyContent_WhenRendering_ThenRendersWithoutCrashing", () => {
    const { container } = render(<ChatMessage role="assistant" content="" />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
