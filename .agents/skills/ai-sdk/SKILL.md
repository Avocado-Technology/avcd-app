---
name: ai-sdk
description: Vercel AI SDK v6 expert guidance. Use when building AI-powered features — chat interfaces, text generation, structured output, tool calling, agents, MCP integration, streaming, embeddings, or working with any LLM provider. Also use when you encounter type errors or deprecated API patterns from v5.
metadata:
  priority: 8
  importPatterns:
    - "ai"
    - "@ai-sdk/*"
  pathPatterns:
    - "app/api/chat/**"
    - "src/app/api/chat/**"
    - "lib/ai/**"
    - "src/lib/ai/**"
    - "ai/**"
---

## Prerequisites

Check if `node_modules/ai/docs/` exists. If it does, search it for current APIs before anything else.

Do not install extra packages at this stage. Install provider packages (e.g., `@ai-sdk/openai`) only when the user's requirement calls for them.

## Critical: Do Not Trust Internal Knowledge

Everything you know about the AI SDK may be outdated. AI SDK v6 introduced significant breaking changes from v5.

**When working with the AI SDK:**

1. Search `node_modules/ai/docs/` and `node_modules/ai/src/` for current APIs
2. If not found locally, search [ai-sdk.dev](https://ai-sdk.dev/docs)
3. Never rely on memory — always verify against source code or docs
4. **`useChat` has changed significantly** — check [Common Errors](references/common-errors.md) before writing client code
5. When deciding which model to use, use the Vercel AI Gateway (see [AI Gateway Reference](references/ai-gateway.md))
6. **Always fetch current model IDs** — run the curl command in [AI Gateway Reference](references/ai-gateway.md) before writing code that references a model
7. Run typecheck after changes: `npx tsc --noEmit`
8. **Be minimal** — only specify options that differ from defaults

## Key v6 API Changes (Quick Reference)

See [Common Errors](references/common-errors.md) for full migration guide with examples.

| v5 (old, wrong)            | v6 (correct)                              |
|----------------------------|-------------------------------------------|
| `maxTokens`                | `maxOutputTokens`                         |
| `maxSteps: N`              | `stopWhen: stepCountIs(N)`                |
| `parameters:` in tool      | `inputSchema:`                            |
| `generateObject()`         | `generateText()` + `Output.object()`      |
| `streamObject()`           | `streamText()` + `output: Output.object()`|
| `toDataStreamResponse()`   | `toUIMessageStreamResponse()`             |
| `useChat({ api })`         | `useChat({ transport: new DefaultChatTransport({ api }) })` |
| `handleSubmit` / `input`   | `sendMessage({ text })` + `useState`      |
| `CoreMessage`              | `ModelMessage`                            |
| `tool-invocation` part     | `tool-{toolName}` typed parts             |
| `part.args`                | `part.input`                              |
| `part.result`              | `part.output`                             |
| `addToolResult()`          | `addToolOutput()`                         |
| `isLoading`                | `status === "streaming" \|\| "submitted"` |
| `message.content`          | `message.parts`                           |
| `Experimental_Agent`       | `ToolLoopAgent`                           |
| `agent.generateText()`     | `agent.generate()`                        |
| `agent.streamText()`       | `agent.stream()`                          |

## Building Agents

Always use `ToolLoopAgent`. See [Type-Safe Agents](references/type-safe-agents.md) for full patterns including:
- Where to save agent and tool files
- `InferAgentUIMessage<typeof myAgent>` for end-to-end type safety
- `UIToolInvocation<typeof myTool>` for per-tool component types
- Rendering `message.parts` with typed `tool-{toolName}` cases

## Finding Documentation

### ai@6.0.34+
```bash
# Search bundled docs
grep -r "your_query" node_modules/ai/docs/
grep -r "your_query" node_modules/ai/src/
```

Provider packages include docs at `node_modules/@ai-sdk/<provider>/docs/`.

### Earlier versions
Search: `https://ai-sdk.dev/api/search-docs?q=your_query`

## When Typecheck Fails

1. Check [Common Errors](references/common-errors.md) for the failing property/function name first
2. If not there, search `node_modules/ai/src/`
3. Then search ai-sdk.dev

## References

- [Common Errors](references/common-errors.md) — v5→v6 migration: renamed APIs, deprecated patterns
- [AI Gateway](references/ai-gateway.md) — Gateway setup, model discovery
- [Type-Safe Agents](references/type-safe-agents.md) — End-to-end type safety with `InferAgentUIMessage`
