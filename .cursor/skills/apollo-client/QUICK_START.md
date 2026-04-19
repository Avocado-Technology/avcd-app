# Apollo Client Quick Start

Get Apollo Client integrated with the AVCD GraphQL API in 15 minutes.

---

## Prerequisites

- Next.js 15+ project with App Router
- Auth0 configured for authentication
- AVCD GraphQL API running locally (http://localhost:8000/graphql)

---

## Step 1: Install Dependencies (2 minutes)

```bash
# Install Apollo Client
npm install @apollo/client graphql

# Install Code Generation (optional but recommended)
npm install -D @graphql-codegen/cli \
  @graphql-codegen/typescript \
  @graphql-codegen/typescript-operations \
  @graphql-codegen/typed-document-node
```

---

## Step 2: Create Apollo Client Configuration (5 minutes)

Create `lib/apollo-client.ts`:

```typescript
import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:8000/graphql';

export function createClientApolloClient() {
  const httpLink = new HttpLink({
    uri: GRAPHQL_ENDPOINT,
  });

  // Auth link to inject JWT token
  const authLink = setContext(async (_, { headers }) => {
    try {
      const response = await fetch('/api/auth/token');
      const { accessToken } = await response.json();

      return {
        headers: {
          ...headers,
          authorization: accessToken ? `Bearer ${accessToken}` : '',
        },
      };
    } catch (error) {
      console.error('Failed to get access token:', error);
      return { headers };
    }
  });

  // Error link for handling authentication errors
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        if (err.extensions?.code === 'UNAUTHENTICATED') {
          window.location.href = '/api/auth/login';
          return;
        }
      }
    }

    if (networkError) {
      console.error('[Network error]:', networkError);
    }
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: from([errorLink, authLink, httpLink]),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      },
    },
  });
}
```

Create `lib/apollo-provider.tsx`:

```typescript
'use client';

import { ApolloProvider as ApolloProviderBase } from '@apollo/client';
import { useMemo } from 'react';
import { createClientApolloClient } from './apollo-client';

let apolloClient: any = null;

function getClient() {
  if (!apolloClient) {
    apolloClient = createClientApolloClient();
  }
  return apolloClient;
}

export function ApolloProvider({ children }: { children: React.ReactNode }) {
  const client = useMemo(() => getClient(), []);
  return <ApolloProviderBase client={client}>{children}</ApolloProviderBase>;
}
```

---

## Step 3: Add Auth0 Token Route (3 minutes)

Create `app/api/auth/token/route.ts`:

```typescript
import { getAccessToken } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { accessToken } = await getAccessToken();
    return NextResponse.json({ accessToken });
  } catch (error) {
    console.error('Token retrieval error:', error);
    return NextResponse.json({ accessToken: null }, { status: 401 });
  }
}
```

---

## Step 4: Update Root Layout (2 minutes)

Update `app/layout.tsx`:

```typescript
import { ApolloProvider } from '@/lib/apollo-provider';
import { UserProvider } from '@auth0/nextjs-auth0/client';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <ApolloProvider>
            {children}
          </ApolloProvider>
        </UserProvider>
      </body>
    </html>
  );
}
```

---

## Step 5: Create Your First Query Component (3 minutes)

Create `app/users/page.tsx`:

```typescript
'use client';

import { gql, useQuery } from '@apollo/client';

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      role
      createdAt
    }
  }
`;

export default function UsersPage() {
  const { data, loading, error } = useQuery(GET_USERS);

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {data?.users.map((user: any) => (
          <li key={user.id}>
            {user.name} - {user.email} ({user.role})
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Step 6: Test Your Setup

1. Start the API:
   ```bash
   cd api
   uv run uvicorn src.main:app --reload
   ```

2. Start the web app:
   ```bash
   cd web
   npm run dev
   ```

3. Navigate to: http://localhost:3000/users

4. You should see a list of users fetched from the GraphQL API!

---

## Optional: Setup Code Generation

### 1. Create `codegen.ts`:

```typescript
import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:8000/graphql',
  documents: ['app/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}', 'lib/**/*.{ts,tsx}'],
  ignoreNoDocuments: true,
  generates: {
    './lib/__generated__/graphql.ts': {
      plugins: ['typescript'],
      config: {
        skipTypename: false,
        enumsAsTypes: true,
      },
    },
    './lib/__generated__/': {
      preset: 'near-operation-file',
      presetConfig: {
        baseTypesPath: 'graphql.ts',
        extension: '.generated.ts',
      },
      plugins: ['typescript-operations', 'typed-document-node'],
    },
  },
};

export default config;
```

### 2. Add scripts to `package.json`:

```json
{
  "scripts": {
    "codegen": "graphql-codegen --config codegen.ts",
    "codegen:watch": "graphql-codegen --config codegen.ts --watch"
  }
}
```

### 3. Generate types:

```bash
npm run codegen
```

Now your queries and mutations will have full TypeScript support!

---

## Next Steps

### Learn More

1. **Read the full skill**: `apollo-client/SKILL.md`
2. **API Reference**: `apollo-client/AVCD_API_REFERENCE.md`
3. **Add mutations**: Implement create/update/delete operations
4. **Add pagination**: Implement infinite scroll with `usersConnection`
5. **Add optimistic UI**: Improve UX with instant feedback
6. **Add tests**: Write tests with `MockedProvider`

### Common Patterns

**Mutation with refetch:**
```typescript
const [createUser] = useMutation(CREATE_USER, {
  refetchQueries: ['GetUsers'],
});
```

**Pagination:**
```typescript
const { data, fetchMore } = useQuery(GET_USERS_CONNECTION, {
  variables: { first: 20 },
});

const loadMore = () => {
  fetchMore({
    variables: { after: data.usersConnection.pageInfo.endCursor },
  });
};
```

**Error handling:**
```typescript
const { data, loading, error } = useQuery(GET_USERS, {
  errorPolicy: 'all', // Return both data and error
});

if (error) {
  return <ErrorMessage error={error} />;
}
```

---

## Troubleshooting

### Issue: "Network error: Failed to fetch"

**Solution**: Make sure the API is running on http://localhost:8000

### Issue: "UNAUTHENTICATED error"

**Solution**: 
1. Verify Auth0 is configured
2. Check `/api/auth/token` returns a valid token
3. Ensure you're logged in to Auth0

### Issue: "Types not found"

**Solution**: Run `npm run codegen` to generate TypeScript types

### Issue: "Cache not updating after mutation"

**Solution**: Add `refetchQueries` to your mutation or implement manual cache updates

---

## Resources

- [Apollo Client Documentation](https://www.apollographql.com/docs/react)
- [AVCD API Schema](http://localhost:8000/graphql)
- [Auth0 Next.js SDK](https://auth0.com/docs/quickstart/webapp/nextjs)

---

**Estimated Time**: 15 minutes  
**Difficulty**: Beginner  
**Last Updated**: April 2026
