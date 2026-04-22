---
title: Type-Safe useChat with Agents
description: Build end-to-end type-safe agents by inferring UIMessage types from your agent definition.
---

# Type-Safe useChat with Agents

Build end-to-end type-safe agents by inferring `UIMessage` types from your agent definition for type-safe UI rendering with `useChat`.

## Recommended Structure

```
lib/
  agents/
    my-agent.ts       # Agent definition + type export
  tools/
    weather-tool.ts   # Individual tool definitions
```

## Define Tools

```ts
// lib/tools/weather-tool.ts
import { tool } from 'ai';
import { z } from 'zod';

export const weatherTool = tool({
  description: 'Get current weather for a location',
  inputSchema: z.object({
    location: z.string().describe('City name'),
  }),
  execute: async ({ location }) => {
    return { temperature: 72, condition: 'sunny', location };
  },
});

// Export invocation type for UI components
export type WeatherToolInvocation = UIToolInvocation<typeof weatherTool>;
```

## Define Agent and Export Type

```ts
// lib/agents/my-agent.ts
import { ToolLoopAgent, InferAgentUIMessage } from 'ai';
import { weatherTool } from '../tools/weather-tool';

export const myAgent = new ToolLoopAgent({
  model: 'anthropic/claude-sonnet-4',
  instructions: 'You are a helpful assistant.',
  tools: { weather: weatherTool },
});

export type MyAgentUIMessage = InferAgentUIMessage<typeof myAgent>;
```

## Use with `useChat`

```tsx
// app/chat.tsx
import { useChat } from '@ai-sdk/react';
import type { MyAgentUIMessage } from '@/lib/agents/my-agent';

export function Chat() {
  const { messages } = useChat<MyAgentUIMessage>();
  // messages are fully typed — message.parts has typed tool parts
}
```

## Rendering Parts with Type Safety

```tsx
function Message({ message }: { message: MyAgentUIMessage }) {
  return (
    <div>
      {message.parts.map((part, i) => {
        switch (part.type) {
          case 'text':
            return <p key={i}>{part.text}</p>;
          case 'tool-weather':
            if (part.state === 'output-available') {
              return <div key={i}>Weather: {part.output.temperature}F in {part.input.location}</div>;
            }
            return <div key={i}>Loading weather...</div>;
          default:
            return null;
        }
      })}
    </div>
  );
}
```
