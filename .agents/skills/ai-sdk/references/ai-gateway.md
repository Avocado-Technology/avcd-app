---
title: Vercel AI Gateway
description: Reference for using Vercel AI Gateway with the AI SDK.
---

# Vercel AI Gateway

The Vercel AI Gateway provides access to models from OpenAI, Anthropic, Google, and other providers through a single API with OIDC auth, failover, and cost tracking.

## Authentication

```env
AI_GATEWAY_API_KEY=your_api_key_here
```

## Usage

The AI Gateway is the default global provider — use a plain string model ID:

```ts
import { generateText } from 'ai';

const { text } = await generateText({
  model: 'anthropic/claude-sonnet-4.5',
  prompt: 'What is love?',
});
```

Or explicitly:

```ts
import { gateway } from 'ai';
// or: import { gateway } from '@ai-sdk/gateway';

model: gateway('anthropic/claude-sonnet-4.5');
```

## Find Available Models

**Always fetch the current model list — never use model IDs from memory:**

```bash
# All models
curl https://ai-gateway.vercel.sh/v1/models

# Anthropic models (newest first)
curl -s https://ai-gateway.vercel.sh/v1/models | jq -r '[.data[] | select(.id | startswith("anthropic/")) | .id] | reverse | .[]'

# OpenAI models
curl -s https://ai-gateway.vercel.sh/v1/models | jq -r '[.data[] | select(.id | startswith("openai/")) | .id] | reverse | .[]'

# Google models
curl -s https://ai-gateway.vercel.sh/v1/models | jq -r '[.data[] | select(.id | startswith("google/")) | .id] | reverse | .[]'
```

Use the model with the highest version number (e.g., prefer `claude-sonnet-4-5` over `claude-sonnet-4`).
