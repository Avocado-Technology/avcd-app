import {
  describe,
  expect,
  it,
  jest,
  beforeEach,
  afterEach,
} from "@jest/globals";
import { NextRequest } from "next/server";

function postJson(body: unknown) {
  return new NextRequest("http://localhost/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("Chat API route POST", () => {
  const originalKey = process.env.OPENAI_API_KEY;

  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    process.env.OPENAI_API_KEY = originalKey;
  });

  it("GivenNoOpenAiKey_WhenPOST_ThenReturns503", async () => {
    delete process.env.OPENAI_API_KEY;

    const { POST } = await import("@/app/api/chat/route");
    const res = await POST(
      postJson({
        messages: [
          {
            id: "1",
            role: "user",
            parts: [{ type: "text", text: "hi" }],
          },
        ],
      }),
    );

    expect(res.status).toBe(503);
  });

  it("GivenNoAccessToken_WhenPOST_ThenReturns401", async () => {
    process.env.OPENAI_API_KEY = "sk-test-key";

    const { auth0 } = require("@/lib/auth0") as typeof import("@/lib/auth0");
    jest.mocked(auth0.getAccessToken).mockResolvedValue({
      token: "",
      expiresAt: 0,
    });

    const { POST } = await import("@/app/api/chat/route");
    const res = await POST(
      postJson({
        messages: [
          {
            id: "1",
            role: "user",
            parts: [{ type: "text", text: "hi" }],
          },
        ],
      }),
    );

    expect(res.status).toBe(401);
  });

  it("GivenEmptyMessages_WhenPOST_ThenReturns400", async () => {
    process.env.OPENAI_API_KEY = "sk-test-key";

    const { auth0 } = require("@/lib/auth0") as typeof import("@/lib/auth0");
    jest.mocked(auth0.getAccessToken).mockResolvedValue({
      token: "tok",
      expiresAt: Date.now() / 1000 + 3600,
    });

    const { POST } = await import("@/app/api/chat/route");
    const res = await POST(postJson({ messages: [] }));

    expect(res.status).toBe(400);
  });
});
