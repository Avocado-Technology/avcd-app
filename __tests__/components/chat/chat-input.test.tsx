import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ChatInput } from "@/app/components/chat/chat-input";

describe("ChatInput", () => {
  it("GivenEmptyInput_WhenRendering_ThenSendButtonIsDisabled", () => {
    render(
      <ChatInput
        value=""
        onChange={() => {}}
        onSubmit={() => {}}
        isLoading={false}
      />,
    );
    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
  });

  it("GivenNonEmptyInput_WhenRendering_ThenSendButtonIsEnabled", () => {
    render(
      <ChatInput
        value="hello"
        onChange={() => {}}
        onSubmit={() => {}}
        isLoading={false}
      />,
    );
    expect(screen.getByRole("button", { name: "Send" })).not.toBeDisabled();
  });

  it("GivenLoadingState_WhenRendering_ThenSendButtonIsDisabled", () => {
    render(
      <ChatInput
        value="hello"
        onChange={() => {}}
        onSubmit={() => {}}
        isLoading={true}
      />,
    );
    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
  });

  it("GivenUserTyping_WhenInputChanges_ThenOnChangeCalled", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <ChatInput
        value=""
        onChange={onChange}
        onSubmit={() => {}}
        isLoading={false}
      />,
    );
    await user.type(screen.getByRole("textbox"), "x");
    expect(onChange).toHaveBeenCalled();
  });

  it("GivenEnterKeyPress_WhenInputHasValue_ThenOnSubmitCalled", () => {
    const onSubmit = jest.fn();
    render(
      <ChatInput
        value="hi"
        onChange={() => {}}
        onSubmit={onSubmit}
        isLoading={false}
      />,
    );
    const textarea = screen.getByRole("textbox");
    fireEvent.keyDown(textarea, { key: "Enter", code: "Enter", shiftKey: false });
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("GivenEnterKeyPress_WhenInputIsEmpty_ThenOnSubmitNotCalled", () => {
    const onSubmit = jest.fn();
    render(
      <ChatInput
        value=""
        onChange={() => {}}
        onSubmit={onSubmit}
        isLoading={false}
      />,
    );
    fireEvent.keyDown(screen.getByRole("textbox"), {
      key: "Enter",
      code: "Enter",
      shiftKey: false,
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
