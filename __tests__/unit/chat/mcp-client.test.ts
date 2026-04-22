import { beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("@modelcontextprotocol/sdk/client/streamableHttp.js", () => ({
  StreamableHTTPClientTransport: jest.fn().mockImplementation(() => ({})),
}));

jest.mock("@modelcontextprotocol/sdk/client/index.js", () => ({
  Client: jest.fn().mockImplementation(function ClientImpl(this: {
    connect: jest.Mock;
  }) {
    this.connect = jest.fn(() => Promise.resolve());
    return this;
  }),
}));

// Require after mocks are registered (CommonJS resolution order).
// eslint-disable-next-line @typescript-eslint/no-require-imports -- Jest mock hoisting pattern
const { createMcpClient } = require("@/lib/chat/mcp-client") as typeof import("@/lib/chat/mcp-client");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const {
  StreamableHTTPClientTransport,
} = require("@modelcontextprotocol/sdk/client/streamableHttp.js") as {
  StreamableHTTPClientTransport: jest.Mock;
};
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Client } = require("@modelcontextprotocol/sdk/client/index.js") as {
  Client: jest.Mock;
};

describe("createMcpClient", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GivenValidUrlAndBearerToken_WhenCreating_ThenConnectsWithAuthHeader", async () => {
    await createMcpClient("https://example.com/mcp", "Bearer tok");

    expect(StreamableHTTPClientTransport).toHaveBeenCalledWith(
      new URL("https://example.com/mcp"),
      expect.objectContaining({
        requestInit: {
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Authorization: "Bearer tok",
          }),
        },
      }),
    );
    expect(Client).toHaveBeenCalledWith({
      name: "avcd-web-chat",
      version: "1.0.0",
    });
    const instance = Client.mock.results[0]?.value as { connect: jest.Mock };
    expect(instance.connect).toHaveBeenCalledTimes(1);
  });

  it("GivenEmptyUrl_WhenCreating_ThenThrows", async () => {
    await expect(createMcpClient("", "Bearer x")).rejects.toThrow(
      "mcpUrl is required",
    );
    expect(StreamableHTTPClientTransport).not.toHaveBeenCalled();
  });

  it("GivenNullBearerToken_WhenCreating_ThenOmitsAuthorizationHeader", async () => {
    await createMcpClient("http://localhost:3001/mcp", null);

    expect(StreamableHTTPClientTransport).toHaveBeenCalledWith(
      new URL("http://localhost:3001/mcp"),
      expect.objectContaining({
        requestInit: {
          headers: {
            "Content-Type": "application/json",
          },
        },
      }),
    );
  });
});
