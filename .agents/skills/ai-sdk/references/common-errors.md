---
title: Common Errors
description: Reference for common AI SDK errors and how to resolve them.
---

# Common Errors

## `maxTokens` → `maxOutputTokens`

```typescript
// ❌ Incorrect
const result = await generateText({
  model: 'anthropic/claude-opus-4.5',
  maxTokens: 512, // deprecated: use `maxOutputTokens` instead
  prompt: 'Write a short story',
});

// ✅ Correct
const result = await generateText({
  model: 'anthropic/claude-opus-4.5',
  maxOutputTokens: 512,
  prompt: 'Write a short story',
});
```

## `maxSteps` → `stopWhen: stepCountIs(n)`

```typescript
// ❌ Incorrect
const result = await generateText({
  model: 'anthropic/claude-opus-4.5',
  tools: { weather },
  maxSteps: 5, // deprecated: use `stopWhen: stepCountIs(n)` instead
  prompt: 'What is the weather in NYC?',
});

// ✅ Correct
import { generateText, stepCountIs } from 'ai';

const result = await generateText({
  model: 'anthropic/claude-opus-4.5',
  tools: { weather },
  stopWhen: stepCountIs(5),
  prompt: 'What is the weather in NYC?',
});
```

## `parameters` → `inputSchema` (in tool definition)

```typescript
// ❌ Incorrect
const weatherTool = tool({
  description: 'Get weather for a location',
  parameters: z.object({ location: z.string() }), // deprecated
  execute: async ({ location }) => ({ location, temp: 72 }),
});

// ✅ Correct
const weatherTool = tool({
  description: 'Get weather for a location',
  inputSchema: z.object({ location: z.string() }),
  execute: async ({ location }) => ({ location, temp: 72 }),
});
```

## `generateObject` → `generateText` with `output`

```typescript
// ❌ Deprecated
import { generateObject } from 'ai';
const result = await generateObject({ model: '...', schema: z.object({...}), prompt: '...' });

// ✅ Correct
import { generateText, Output } from 'ai';
const result = await generateText({
  model: 'anthropic/claude-opus-4.5',
  output: Output.object({ schema: z.object({ recipe: z.object({ name: z.string() }) }) }),
  prompt: 'Generate a recipe for chocolate cake',
});
console.log(result.output); // typed object
```

## `toDataStreamResponse` → `toUIMessageStreamResponse`

```typescript
// ❌ Incorrect (when using useChat)
return result.toDataStreamResponse();

// ✅ Correct
return result.toUIMessageStreamResponse();
```

## Removed managed input state in `useChat`

```tsx
// ❌ Deprecated
const { input, handleInputChange, handleSubmit } = useChat({ api: '/api/chat' });

// ✅ Correct
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';

const [input, setInput] = useState('');
const { sendMessage } = useChat({
  transport: new DefaultChatTransport({ api: '/api/chat' }),
});
const handleSubmit = e => {
  e.preventDefault();
  sendMessage({ text: input });
  setInput('');
};
```

## `CoreMessage` → `ModelMessage`

```typescript
// ❌ Incorrect
import { CoreMessage } from 'ai'; // renamed in v6

// ✅ Correct
import { ModelMessage, convertToModelMessages } from 'ai';
```

## `tool-invocation` → `tool-{toolName}` (typed tool parts)

```tsx
// ❌ Incorrect
case 'tool-invocation': // deprecated

// ✅ Correct
case 'tool-getWeather': // typed, tool-specific
  if (part.state === 'output-available') {
    return <div>{part.output.temperature}</div>;
  }
```

## Tool invocation states renamed

| Old (v5)        | New (v6)           |
|-----------------|--------------------|
| `partial-call`  | `input-streaming`  |
| `call`          | `input-available`  |
| `result`        | `output-available` |

## `addToolResult` → `addToolOutput`

```tsx
// ❌ Incorrect
addToolResult({ toolCallId: '...', result: 'Yes' });

// ✅ Correct
addToolOutput({ tool: 'askForConfirmation', toolCallId: '...', output: 'Yes' });
```

## `agent.generateText()` → `agent.generate()`
## `agent.streamText()` → `agent.stream()`
## `Experimental_Agent` → `ToolLoopAgent`
## `streamObject()` → `streamText()` with `output: Output.object()`
## `isLoading` → `status === "streaming" || status === "submitted"`
## `message.content` → `message.parts`
