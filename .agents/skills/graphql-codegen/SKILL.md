---
name: graphql-codegen
description: GraphQL Code Generator guidance for this project using @graphql-codegen/cli with the client-preset. Use when writing new GraphQL operations (queries/mutations/fragments), regenerating types after schema changes, adding new scalars, or debugging type issues with generated code.
metadata:
  pathPatterns:
    - "lib/graphql/**"
    - "lib/__generated__/**"
    - "codegen.ts"
  importPatterns:
    - "@graphql-codegen/"
---

# GraphQL Code Generator — Project Guide

This project uses `@graphql-codegen/cli` with the `client` preset, generating types into `lib/__generated__/`.

## Project Config (`codegen.ts`)

```ts
// Schema: http://localhost:8000/graphql (local dev server must be running)
// Documents: lib/graphql/**/*.ts and app/**/*.tsx
// Output: ./lib/__generated__/
// fragmentMasking: false (Apollo Client handles data masking natively)
```

## Running Codegen

```bash
# One-time generation (requires running API)
npm run codegen

# Watch mode (auto-regenerates on document changes)
npm run codegen:watch
```

## File Layout

```
lib/
  __generated__/          # DO NOT EDIT — auto-generated
    graphql.ts            # All TypeScript types
    gql.ts                # gql() helper
    index.ts              # Re-exports
    schema-introspection.ts
  graphql/                # Your GraphQL operations (edit these)
    queries/
    mutations/
    fragments/
```

## Writing Operations

Always use the project's `gql` helper from `lib/__generated__/gql` (not `graphql-tag` directly):

```ts
// lib/graphql/queries/users.ts
import { gql } from '@/lib/__generated__/gql';

export const GET_USERS = gql(/* GraphQL */`
  query GetUsers($orgId: UUID!) {
    users(condition: { organizationId: $orgId }) {
      nodes {
        id
        email
        fullName
      }
    }
  }
`);
```

## Using Generated Types in Apollo Client

```ts
// The generated hook types flow automatically with Apollo
import { useQuery } from '@apollo/client';
import { GET_USERS } from '@/lib/graphql/queries/users';
import type { GetUsersQuery, GetUsersQueryVariables } from '@/lib/__generated__/graphql';

// Option 1: Let TypeScript infer from the query document (preferred)
const { data } = useQuery(GET_USERS, { variables: { orgId } });
// data is typed as GetUsersQuery | undefined automatically

// Option 2: Explicit typing
const { data } = useQuery<GetUsersQuery, GetUsersQueryVariables>(GET_USERS, {
  variables: { orgId },
});
```

## Custom Scalars (as configured)

| GraphQL Scalar | TypeScript Type         |
|----------------|-------------------------|
| `DateTime`     | `string`                |
| `UUID`         | `string`                |
| `JSON`         | `Record<string, any>`   |
| anything else  | `unknown`               |

When adding a new scalar in the schema, update `codegen.ts`:

```ts
scalars: {
  DateTime: "string",
  UUID: "string",
  JSON: "Record<string, any>",
  MyNewScalar: "YourTSType",  // add here
},
```

## Fragment Usage (fragmentMasking: false)

Fragment masking is disabled — you can spread fragments freely without `useFragment()`:

```ts
export const USER_FIELDS = gql(/* GraphQL */`
  fragment UserFields on User {
    id
    email
    fullName
    createdAt
  }
`);

export const GET_USER = gql(/* GraphQL */`
  query GetUser($id: UUID!) {
    user(id: $id) {
      ...UserFields
    }
  }
  ${USER_FIELDS}
`);
```

## Troubleshooting

**Types are stale / missing**
→ Run `npm run codegen` (API server must be running at `localhost:8000`)

**`Cannot find module '@/lib/__generated__/gql'`**
→ Run codegen first; the `__generated__` folder is empty until generation runs

**New field not in generated types**
→ The field must exist on the running API server first, then regenerate

**Type error on a query result**
→ Check `avoidOptionals.field: true` — all query fields are non-optional by design; use conditional rendering rather than optional chaining

**Schema endpoint unreachable**
→ Ensure the API is running: `docker compose up` in the `api/` workspace
