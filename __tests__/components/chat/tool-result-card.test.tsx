import { describe, expect, it } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";

import { ToolResultCard } from "@/app/components/chat/tool-result-card";

describe("ToolResultCard", () => {
  it("GivenMcpUiResource_WhenRendering_ThenRendersIframeWithSrcDoc", () => {
    const result = {
      type: "resource" as const,
      resource: {
        uri: "ui://x",
        mimeType: "text/html;profile=mcp-app" as const,
        text: "<p>hello</p>",
      },
    };
    render(<ToolResultCard toolName="t1" result={result} />);
    const iframe = screen.getByTitle("MCP UI: t1");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute("srcDoc", "<p>hello</p>");
  });

  it("GivenMcpUiResourceWithBlob_WhenRendering_ThenDecodesAndUsesSrcDoc", () => {
    const html = "<span>blob</span>";
    const blob = Buffer.from(html, "utf8").toString("base64");
    const result = {
      type: "resource" as const,
      resource: {
        uri: "ui://x",
        mimeType: "text/html;profile=mcp-app" as const,
        blob,
      },
    };
    render(<ToolResultCard toolName="t2" result={result} />);
    expect(screen.getByTitle("MCP UI: t2")).toHaveAttribute("srcDoc", html);
  });

  it("GivenPlainStringResult_WhenRendering_ThenShowsCollapsedChipNotIframe", () => {
    render(<ToolResultCard toolName="my_tool" result="plain" />);
    expect(screen.getByText(/Used tool: my tool/i)).toBeInTheDocument();
    expect(screen.queryByTitle(/MCP UI/)).not.toBeInTheDocument();
    // raw text is hidden until expanded
    expect(screen.queryByText("plain")).not.toBeInTheDocument();
  });

  it("GivenPlainStringResult_WhenExpanded_ThenShowsRawText", () => {
    render(<ToolResultCard toolName="x" result="plain" />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText("plain")).toBeInTheDocument();
  });

  it("GivenObjectResult_WhenExpanded_ThenRendersAsJsonText", () => {
    render(<ToolResultCard toolName="x" result={{ a: 1 }} />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText(/\{\s*"a":\s*1\s*\}/)).toBeInTheDocument();
  });

  it("GivenErrorResult_WhenRendering_ThenShowsErrorChip", () => {
    render(<ToolResultCard toolName="x" result={{ isError: true, content: [{ type: "text", text: "oops" }] }} />);
    expect(screen.getByText(/Tool error: x/i)).toBeInTheDocument();
  });

  it("GivenNullResult_WhenRendering_ThenRendersNothing", () => {
    const { container } = render(
      <ToolResultCard toolName="x" result={null} />,
    );
    expect(container.firstChild).toBeNull();
  });
});
