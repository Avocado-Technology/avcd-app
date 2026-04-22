import { describe, expect, it } from "@jest/globals";

import type { ChatMessageShape, McpUiResource } from "@/lib/chat/types";
import { isMcpUiResource } from "@/lib/chat/types";

describe("Chat types", () => {
  describe("ChatMessageShape", () => {
    it("GivenMinimalUserMessage_WhenAssigningToChatMessageShape_ThenAccepted", () => {
      const msg: ChatMessageShape = {
        id: "1",
        role: "user",
        parts: [{ type: "text", text: "hello" }],
      };
      expect(msg.role).toBe("user");
    });

    it("GivenAssistantMessageWithParts_WhenAssigningToChatMessageShape_ThenAccepted", () => {
      const msg: ChatMessageShape = {
        id: "2",
        role: "assistant",
        parts: [{ type: "text", text: "hi" }],
      };
      expect(msg.parts?.length).toBe(1);
    });
  });

  describe("McpUiResource shape", () => {
    it("GivenValidUiResource_WhenStructuralCheck_ThenHasMimeTypeProfile", () => {
      const r: McpUiResource = {
        type: "resource",
        resource: {
          uri: "ui://test/widget",
          mimeType: "text/html;profile=mcp-app",
          text: "<p>x</p>",
        },
      };
      expect(r.resource.mimeType).toBe("text/html;profile=mcp-app");
    });
  });

  describe("isMcpUiResource", () => {
    it("GivenValidMcpUiResource_WhenChecking_ThenReturnsTrue", () => {
      const value = {
        type: "resource",
        resource: {
          uri: "ui://x",
          mimeType: "text/html;profile=mcp-app",
          text: "<div/>",
        },
      };
      expect(isMcpUiResource(value)).toBe(true);
    });

    it("GivenWrongMimeType_WhenChecking_ThenReturnsFalse", () => {
      expect(
        isMcpUiResource({
          type: "resource",
          resource: { uri: "x", mimeType: "text/html" },
        }),
      ).toBe(false);
    });

    it("GivenNull_WhenChecking_ThenReturnsFalse", () => {
      expect(isMcpUiResource(null)).toBe(false);
    });

    it("GivenNonObject_WhenChecking_ThenReturnsFalse", () => {
      expect(isMcpUiResource("string")).toBe(false);
    });
  });
});
