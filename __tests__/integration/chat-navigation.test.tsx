import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";

import { SidebarNav } from "@/components/sidebar/sidebar-nav";

describe("Chat navigation integration", () => {
  it("GivenSidebarNav_WhenRendered_ThenIncludesChatLinkToSlashChat", () => {
    render(<SidebarNav currentPath="/finance" />);

    const chat = screen.getByRole("link", { name: "Navigation.chat" });
    expect(chat).toHaveAttribute("href", "/chat");
  });
});
