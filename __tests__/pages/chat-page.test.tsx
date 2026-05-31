import { describe, expect, it, jest, beforeEach } from "@jest/globals";
import { render } from "@testing-library/react";

jest.mock("@/i18n/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("next-intl/server", () => ({
  getTranslations: jest.fn(async () => (key: string) => key),
}));

jest.mock("@/app/[locale]/chat/chat-client", () => ({
  ChatClient: () => <div data-testid="chat-client">chat-client</div>,
}));

import { getSession } from "@/lib/auth/session";
import { redirect } from "@/i18n/navigation";

const mockedGetSession = jest.mocked(getSession);
const mockedRedirect = jest.mocked(redirect);

describe("ChatPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GivenUnauthenticatedUser_WhenVisitingChatPage_ThenRedirectsToRoot", async () => {
    mockedGetSession.mockResolvedValueOnce(null);

    const { default: ChatPage } = await import("@/app/[locale]/chat/page");

    await ChatPage();

    expect(mockedRedirect).toHaveBeenCalledWith({ href: "/", locale: "en" });
  });

  it("GivenAuthenticatedUser_WhenVisitingChatPage_ThenRendersChatClient", async () => {
    mockedGetSession.mockResolvedValueOnce({
      user: { sub: "u1", name: "Test" },
    } as never);

    const { default: ChatPage } = await import("@/app/[locale]/chat/page");

    const ui = await ChatPage();

    const { getByTestId } = render(ui);

    expect(getByTestId("chat-client")).toBeInTheDocument();
    expect(mockedRedirect).not.toHaveBeenCalled();
  });
});
