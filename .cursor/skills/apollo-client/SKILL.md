---
name: apollo-client
description: >
  Comprehensive guide for integrating Apollo Client 4.x with the AVCD GraphQL API
  in Next.js. Covers setup, authentication with Auth0, cache management, mutations,
  queries, subscriptions, error handling, optimistic UI, testing patterns, and
  code generation. Use when setting up GraphQL client, making API calls, managing
  cache, implementing authentication headers, or testing GraphQL operations.
  Triggers on: "Apollo Client", "GraphQL setup", "useQuery", "useMutation",
  "GraphQL cache", "GraphQL testing", or any request related to frontend-backend
  GraphQL integration.
---

# Apollo Client Integration Guide

Complete guide for integrating Apollo Client 4.x with the AVCD GraphQL API (Strawberry/Python backend) in Next.js 15. **Read this entire file before implementing any GraphQL client code.**

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Installation & Setup](#2-installation--setup)
3. [Client Configuration](#3-client-configuration)
4. [Authentication Integration](#4-authentication-integration)
5. [Cache Management](#5-cache-management)
6. [Queries & Mutations](#6-queries--mutations)
7. [Error Handling](#7-error-handling)
8. [Optimistic UI](#8-optimistic-ui)
9. [Testing Patterns](#9-testing-patterns)
10. [Code Generation](#10-code-generation)
11. [Best Practices](#11-best-practices)
12. [Performance Optimization](#12-performance-optimization)

---

## 1. Architecture Overview

### Client-Server Flow

```
┌─────────────────────────────────────────────────────────────┐
│                   Next.js App (Client)                       │
│  ┌───────────────────────────────────────────────────┐      │
│  │         React Components                           │      │
│  │  (useQuery, useMutation, useSubscription)         │      │
│  └───────────────┬───────────────────────────────────┘      │
│                  │                                            │
│  ┌───────────────▼───────────────────────────────────┐      │
│  │         Apollo Client 4.x                          │      │
│  │  • InMemoryCache (Normalized)                     │      │
│  │  • AuthLink (JWT injection)                       │      │
│  │  • ErrorLink (Token refresh)                      │      │
│  │  • HttpLink (GraphQL endpoint)                    │      │
│  └───────────────┬───────────────────────────────────┘      │
└──────────────────┼───────────────────────────────────────────┘
                   │ HTTPS + JWT Bearer Token
┌──────────────────▼───────────────────────────────────────────┐
│              AVCD GraphQL API (Python)                       │
│  ┌───────────────────────────────────────────────────┐      │
│  │         FastAPI + Strawberry                       │      │
│  │  • JWT Validation                                  │      │
│  │  • Multi-tenant RBAC (owner_sub)                  │      │
│  │  • Domain Modules (Users, Orgs, Stores, etc.)    │      │
│  └───────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Apollo Client 4.x Key Features

- **Bundle Size:** Opt-in architecture reduces bundle by 20-30%
- **Modern Targets:** Supports browsers from 2023+, Node.js 20+
- **Framework Agnostic:** React hooks in `@apollo/client/react`
- **RxJS Integration:** Better debugging and operator support
- **TypeScript First:** Full type safety with code generation

---

## 2. Installation & Setup

### Required Packages

```bash
# Core Apollo Client
npm install @apollo/client graphql

# Code Generation (optional but highly recommended)
npm install -D @graphql-codegen/cli \
  @graphql-codegen/typescript \
  @graphql-codegen/typescript-operations \
  @graphql-codegen/typed-document-node

# Testing
npm install -D @apollo/client-react-testing msw
```

### Package Versions (2026 Compatible)

```json
{
  "dependencies": {
    "@apollo/client": "^4.1.7",
    "graphql": "^16.9.0"
  },
  "devDependencies": {
    "@graphql-codegen/cli": "^5.0.5",
    "@graphql-codegen/typescript": "^4.3.0",
    "@graphql-codegen/typescript-operations": "^4.5.0",
    "@graphql-codegen/typed-document-node": "^5.1.0"
  }
}
```

---

## 3. Client Configuration

### Basic Client Setup (Next.js App Router)

Create `lib/apollo-client.ts`:

```typescript
import { ApolloClient, InMemoryCache, HttpLink, from, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { getSession } from '@auth0/nextjs-auth0';

// Environment variables
const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:8000/graphql';

/**
 * Create Apollo Client instance for server-side operations
 * Use this in server components and API routes
 */
export function createServerApolloClient() {
  const httpLink = new HttpLink({
    uri: GRAPHQL_ENDPOINT,
    fetchOptions: { cache: 'no-store' }, // Disable Next.js fetch cache
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: httpLink,
    ssrMode: true, // Enable SSR mode
  });
}

/**
 * Create Apollo Client instance for client-side operations
 * Use this in client components with 'use client' directive
 */
export function createClientApolloClient() {
  const httpLink = new HttpLink({
    uri: GRAPHQL_ENDPOINT,
  });

  // Auth link to inject JWT token
  const authLink = setContext(async (_, { headers }) => {
    // Get token from Auth0 session (client-side)
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
  const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        if (err.extensions?.code === 'UNAUTHENTICATED' || err.message.includes('401')) {
          // Token expired, redirect to login
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
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            // Pagination field policies (see Cache Management section)
          },
        },
      },
    }),
    link: from([errorLink, authLink, httpLink]),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
      },
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
  });
}
```

### Apollo Provider Setup (App Router)

Create `lib/apollo-provider.tsx`:

```typescript
'use client';

import { ApolloProvider as ApolloProviderBase, ApolloClient } from '@apollo/client';
import { useMemo } from 'react';
import { createClientApolloClient } from './apollo-client';

let apolloClient: ApolloClient<any> | null = null;

function getClient() {
  // Singleton pattern for client-side Apollo Client
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

### Layout Integration

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

## 4. Authentication Integration

### Auth0 Token Management

Create API route `app/api/auth/token/route.ts`:

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

### Server-Side Authentication

For server components using Apollo Client:

```typescript
import { getSession } from '@auth0/nextjs-auth0';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

export async function createAuthenticatedServerClient() {
  const session = await getSession();
  const accessToken = session?.accessToken;

  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
    fetchOptions: { cache: 'no-store' },
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: accessToken ? `Bearer ${accessToken}` : '',
      },
    };
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
    ssrMode: true,
  });
}
```

### Token Refresh Pattern

Implement automatic token refresh on 401 errors:

```typescript
import { onError } from '@apollo/client/link/error';
import { fromPromise } from '@apollo/client';

let isRefreshing = false;
let pendingRequests: Function[] = [];

const resolvePendingRequests = () => {
  pendingRequests.map((callback) => callback());
  pendingRequests = [];
};

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (err.extensions?.code === 'UNAUTHENTICATED') {
        if (!isRefreshing) {
          isRefreshing = true;

          return fromPromise(
            fetch('/api/auth/refresh', { method: 'POST' })
              .then((response) => response.json())
              .then(({ accessToken }) => {
                isRefreshing = false;
                resolvePendingRequests();
                
                // Update operation context with new token
                operation.setContext(({ headers = {} }) => ({
                  headers: {
                    ...headers,
                    authorization: `Bearer ${accessToken}`,
                  },
                }));
                
                return accessToken;
              })
              .catch(() => {
                isRefreshing = false;
                pendingRequests = [];
                // Redirect to login
                window.location.href = '/api/auth/login';
                return;
              })
          ).flatMap(() => forward(operation));
        } else {
          // Queue the request while refreshing
          return fromPromise(
            new Promise((resolve) => {
              pendingRequests.push(() => resolve());
            })
          ).flatMap(() => forward(operation));
        }
      }
    }
  }
});
```

---

## 5. Cache Management

### Normalized Cache Configuration

```typescript
import { InMemoryCache, NormalizedCacheObject } from '@apollo/client';

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        // Relay-style pagination for connections
        users_connection: {
          keyArgs: ['filter', 'orderBy'], // Cache separately by filter/sort
          merge(existing, incoming, { args }) {
            if (!existing || args?.after === null) {
              return incoming; // First page or reset
            }
            
            return {
              ...incoming,
              edges: [...(existing.edges || []), ...(incoming.edges || [])],
            };
          },
        },
        
        // Offset pagination
        users: {
          keyArgs: ['filter', 'orderBy'],
          merge(existing = [], incoming, { args }) {
            const offset = args?.offset || 0;
            const merged = existing ? existing.slice(0) : [];
            for (let i = 0; i < incoming.length; i++) {
              merged[offset + i] = incoming[i];
            }
            return merged;
          },
        },
      },
    },
    
    // Entity-level cache configuration
    User: {
      keyFields: ['id'], // Default, but explicit is good
      fields: {
        // Custom field policies if needed
      },
    },
    
    Organization: {
      keyFields: ['id'],
    },
    
    Store: {
      keyFields: ['id'],
    },
    
    Employee: {
      keyFields: ['id'],
    },
  },
});
```

### Cache Updates After Mutations

**Pattern 1: Automatic Update (Recommended)**

```typescript
// If mutation returns the updated entity with same ID,
// Apollo automatically updates the cache
const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id              # Required for cache identification
      name
      email
      role
      updatedAt
    }
  }
`;
```

**Pattern 2: Manual Cache Update**

```typescript
import { gql, useMutation } from '@apollo/client';

const CREATE_ORGANIZATION = gql`
  mutation CreateOrganization($input: CreateOrganizationInput!) {
    createOrganization(input: $input) {
      id
      name
      slug
      createdAt
    }
  }
`;

const GET_ORGANIZATIONS = gql`
  query GetOrganizations {
    organizations {
      id
      name
      slug
      createdAt
    }
  }
`;

function CreateOrganizationForm() {
  const [createOrg] = useMutation(CREATE_ORGANIZATION, {
    update(cache, { data }) {
      // Read existing query
      const existing = cache.readQuery({ query: GET_ORGANIZATIONS });
      
      if (existing && data?.createOrganization) {
        // Write updated data back to cache
        cache.writeQuery({
          query: GET_ORGANIZATIONS,
          data: {
            organizations: [...existing.organizations, data.createOrganization],
          },
        });
      }
    },
  });
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      createOrg({ variables: { input: { /* ... */ } } });
    }}>
      {/* Form fields */}
    </form>
  );
}
```

**Pattern 3: RefetchQueries (Simplest)**

```typescript
const [deleteUser] = useMutation(DELETE_USER, {
  refetchQueries: [
    { query: GET_USERS },
    { query: GET_USERS_CONNECTION, variables: { first: 20 } },
  ],
  awaitRefetchQueries: true, // Wait for refetch before resolving
});
```

### Cache Eviction

```typescript
import { useApolloClient } from '@apollo/client';

function DeleteUserButton({ userId }: { userId: string }) {
  const client = useApolloClient();
  const [deleteUser] = useMutation(DELETE_USER);
  
  const handleDelete = async () => {
    await deleteUser({ variables: { id: userId } });
    
    // Evict deleted entity from cache
    client.cache.evict({ id: client.cache.identify({ __typename: 'User', id: userId }) });
    
    // Garbage collect unreachable objects
    client.cache.gc();
  };
  
  return <button onClick={handleDelete}>Delete User</button>;
}
```

### Cache Persistence (Optional)

For offline support or faster initial load:

```typescript
import { persistCache, LocalStorageWrapper } from 'apollo3-cache-persist';

async function setupCache() {
  const cache = new InMemoryCache();
  
  await persistCache({
    cache,
    storage: new LocalStorageWrapper(window.localStorage),
    maxSize: 1048576, // 1MB
    debug: process.env.NODE_ENV === 'development',
  });
  
  return cache;
}
```

---

## 6. Queries & Mutations

### Query Patterns

**Basic Query**

```typescript
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

function UsersList() {
  const { data, loading, error, refetch } = useQuery(GET_USERS);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <ul>
      {data?.users.map((user) => (
        <li key={user.id}>{user.name} ({user.email})</li>
      ))}
    </ul>
  );
}
```

**Query with Variables**

```typescript
const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
      role
      organizations {
        id
        name
      }
    }
  }
`;

function UserProfile({ userId }: { userId: string }) {
  const { data, loading, error } = useQuery(GET_USER, {
    variables: { id: userId },
    skip: !userId, // Don't execute if userId is missing
  });
  
  // ...
}
```

**Lazy Query (Manual Execution)**

```typescript
import { gql, useLazyQuery } from '@apollo/client';

function SearchUsers() {
  const [searchUsers, { data, loading, error }] = useLazyQuery(SEARCH_USERS);
  
  return (
    <div>
      <input
        type="text"
        onChange={(e) => {
          if (e.target.value.length > 2) {
            searchUsers({ variables: { query: e.target.value } });
          }
        }}
      />
      {loading && <div>Searching...</div>}
      {data && <UserResults users={data.searchUsers} />}
    </div>
  );
}
```

**Polling Query**

```typescript
const { data } = useQuery(GET_REALTIME_DATA, {
  pollInterval: 5000, // Poll every 5 seconds
});
```

**Fetch More (Pagination)**

```typescript
const GET_USERS_CONNECTION = gql`
  query GetUsersConnection($first: Int!, $after: String) {
    usersConnection(first: $first, after: $after) {
      edges {
        node {
          id
          name
          email
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

function InfiniteUsersList() {
  const { data, loading, fetchMore } = useQuery(GET_USERS_CONNECTION, {
    variables: { first: 20 },
  });
  
  const loadMore = () => {
    fetchMore({
      variables: {
        after: data?.usersConnection.pageInfo.endCursor,
      },
    });
  };
  
  return (
    <div>
      {data?.usersConnection.edges.map(({ node }) => (
        <UserCard key={node.id} user={node} />
      ))}
      {data?.usersConnection.pageInfo.hasNextPage && (
        <button onClick={loadMore} disabled={loading}>
          Load More
        </button>
      )}
    </div>
  );
}
```

### Mutation Patterns

**Basic Mutation**

```typescript
const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      email
      role
      createdAt
    }
  }
`;

function CreateUserForm() {
  const [createUser, { data, loading, error }] = useMutation(CREATE_USER);
  
  const handleSubmit = async (formData: FormData) => {
    try {
      const result = await createUser({
        variables: {
          input: {
            name: formData.name,
            email: formData.email,
            role: formData.role,
          },
        },
      });
      
      console.log('User created:', result.data.createUser);
    } catch (err) {
      console.error('Failed to create user:', err);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create User'}
      </button>
      {error && <div className="error">{error.message}</div>}
    </form>
  );
}
```

**Mutation with Optimistic Response**

```typescript
const [updateUserName] = useMutation(UPDATE_USER_NAME, {
  optimisticResponse: {
    updateUser: {
      __typename: 'User',
      id: userId,
      name: newName,
    },
  },
});
```

### Fragments

**Define Reusable Fragments**

```typescript
const USER_FRAGMENT = gql`
  fragment UserFields on User {
    id
    name
    email
    role
    createdAt
  }
`;

const GET_USERS = gql`
  ${USER_FRAGMENT}
  query GetUsers {
    users {
      ...UserFields
    }
  }
`;

const GET_USER = gql`
  ${USER_FRAGMENT}
  query GetUser($id: ID!) {
    user(id: $id) {
      ...UserFields
      organizations {
        id
        name
      }
    }
  }
`;
```

---

## 7. Error Handling

### Error Types in Apollo Client 4.x

Apollo Client distinguishes between two error types:

1. **GraphQL Errors**: Server-side execution errors
2. **Network Errors**: Transport-level failures

### Error Identification

```typescript
import { ApolloError } from '@apollo/client';
import { CombinedGraphQLErrors, ServerError } from '@apollo/client/errors';

function handleError(error: ApolloError) {
  if (CombinedGraphQLErrors.is(error)) {
    // GraphQL execution errors
    console.error('GraphQL errors:', error.graphQLErrors);
    error.graphQLErrors.forEach((gqlError) => {
      console.error('- Message:', gqlError.message);
      console.error('- Code:', gqlError.extensions?.code);
      console.error('- Path:', gqlError.path);
    });
  }
  
  if (ServerError.is(error.networkError)) {
    // HTTP-level errors (4xx, 5xx)
    console.error('Server error:', error.networkError.statusCode);
  }
  
  if (error.networkError && !ServerError.is(error.networkError)) {
    // Network failures (timeout, no connection)
    console.error('Network error:', error.networkError);
  }
}
```

### Error Policies

Control how partial data is handled:

```typescript
const { data, error } = useQuery(GET_USERS, {
  errorPolicy: 'all', // Return both data and error
  // Options: 'none' (default), 'ignore', 'all'
});

// With 'all' policy, you can show partial data
if (data) {
  return <UsersList users={data.users} warning={error} />;
}
```

### Error Boundaries

For suspense hooks, use React Error Boundaries:

```typescript
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }: any) {
  return (
    <div role="alert">
      <h2>Something went wrong</h2>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <UsersList />
    </ErrorBoundary>
  );
}
```

### Global Error Handling

```typescript
const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      const errorCode = extensions?.code;
      
      // Handle specific error codes
      switch (errorCode) {
        case 'UNAUTHENTICATED':
          // Redirect to login
          window.location.href = '/api/auth/login';
          break;
        case 'FORBIDDEN':
          // Show permission denied message
          toast.error('You do not have permission to perform this action');
          break;
        case 'NOT_FOUND':
          toast.error('Resource not found');
          break;
        default:
          // Log to error tracking service
          console.error(`[GraphQL error]: Message: ${message}, Path: ${path}`);
      }
    });
  }
  
  if (networkError) {
    // Log network errors
    console.error(`[Network error]: ${networkError}`);
    toast.error('Network error. Please check your connection.');
  }
});
```

### Retry Logic

```typescript
import { RetryLink } from '@apollo/client/link/retry';

const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: 5000,
    jitter: true,
  },
  attempts: {
    max: 3,
    retryIf: (error) => {
      // Only retry on network errors, not GraphQL errors
      return !!error && !error.result;
    },
  },
});

// Add to link chain
const link = from([retryLink, errorLink, authLink, httpLink]);
```

---

## 8. Optimistic UI

### Basic Optimistic Response

```typescript
const [updateUserName, { loading }] = useMutation(UPDATE_USER_NAME, {
  optimisticResponse: {
    __typename: 'Mutation',
    updateUser: {
      __typename: 'User',
      id: userId,
      name: newName,
      // Include all fields that will be updated
    },
  },
});
```

### Optimistic UI with Cache Updates

```typescript
const [createOrganization] = useMutation(CREATE_ORGANIZATION, {
  optimisticResponse: {
    __typename: 'Mutation',
    createOrganization: {
      __typename: 'Organization',
      id: 'temp-id-' + Date.now(), // Temporary ID
      name: input.name,
      slug: input.slug,
      createdAt: new Date().toISOString(),
    },
  },
  update(cache, { data }) {
    const existing = cache.readQuery({ query: GET_ORGANIZATIONS });
    
    if (existing && data?.createOrganization) {
      cache.writeQuery({
        query: GET_ORGANIZATIONS,
        data: {
          organizations: [...existing.organizations, data.createOrganization],
        },
      });
    }
  },
});
```

### Visual Feedback for Pending State

```typescript
function TodoItem({ todo }: { todo: Todo }) {
  const [updateTodo, { loading }] = useMutation(UPDATE_TODO);
  
  return (
    <div style={{ opacity: loading ? 0.5 : 1 }}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => {
          updateTodo({
            variables: { id: todo.id, completed: !todo.completed },
            optimisticResponse: {
              updateTodo: {
                __typename: 'Todo',
                id: todo.id,
                completed: !todo.completed,
              },
            },
          });
        }}
      />
      {todo.title}
      {loading && <Spinner size="sm" />}
    </div>
  );
}
```

### Conditional Optimistic Updates

```typescript
import { IGNORE } from '@apollo/client';

const [updateUser] = useMutation(UPDATE_USER, {
  optimisticResponse: (vars) => {
    // Skip optimistic update if conditions aren't met
    if (!shouldOptimisticallyUpdate(vars)) {
      return IGNORE;
    }
    
    return {
      updateUser: {
        __typename: 'User',
        id: vars.id,
        ...vars.input,
      },
    };
  },
});
```

---

## 9. Testing Patterns

### Component Testing with MockedProvider

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { GET_USERS } from './queries';
import UsersList from './UsersList';

describe('UsersList', () => {
  it('renders users after loading', async () => {
    const mocks = [
      {
        request: {
          query: GET_USERS,
        },
        result: {
          data: {
            users: [
              { id: '1', name: 'Alice', email: 'alice@example.com' },
              { id: '2', name: 'Bob', email: 'bob@example.com' },
            ],
          },
        },
      },
    ];
    
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <UsersList />
      </MockedProvider>
    );
    
    // Loading state
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    // Wait for data
    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
    });
  });
  
  it('handles error state', async () => {
    const mocks = [
      {
        request: {
          query: GET_USERS,
        },
        error: new Error('Failed to fetch users'),
      },
    ];
    
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <UsersList />
      </MockedProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
```

### Testing Mutations

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { CREATE_USER } from './mutations';
import CreateUserForm from './CreateUserForm';

it('creates a user on form submit', async () => {
  const mocks = [
    {
      request: {
        query: CREATE_USER,
        variables: {
          input: {
            name: 'Charlie',
            email: 'charlie@example.com',
            role: 'USER',
          },
        },
      },
      result: {
        data: {
          createUser: {
            id: '3',
            name: 'Charlie',
            email: 'charlie@example.com',
            role: 'USER',
          },
        },
      },
    },
  ];
  
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <CreateUserForm />
    </MockedProvider>
  );
  
  fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Charlie' } });
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'charlie@example.com' } });
  fireEvent.click(screen.getByText('Create User'));
  
  await waitFor(() => {
    expect(screen.getByText('User created successfully')).toBeInTheDocument();
  });
});
```

### Integration Testing with MSW

```typescript
import { setupServer } from 'msw/node';
import { graphql, HttpResponse } from 'msw';
import { render, screen, waitFor } from '@testing-library/react';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

const server = setupServer(
  graphql.query('GetUsers', () => {
    return HttpResponse.json({
      data: {
        users: [
          { id: '1', name: 'Alice', email: 'alice@example.com' },
        ],
      },
    });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it('fetches users from real network request', async () => {
  const client = new ApolloClient({
    uri: 'http://localhost:8000/graphql',
    cache: new InMemoryCache(),
  });
  
  render(
    <ApolloProvider client={client}>
      <UsersList />
    </ApolloProvider>
  );
  
  await waitFor(() => {
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });
});
```

### Testing Best Practices

1. **Create New Client Per Test**: Avoid cache pollution
2. **Test User Behavior**: Don't test Apollo's internal implementation
3. **Test All States**: Loading, success, error, empty
4. **Use Exact Variable Matching**: Mocks must match exact variables
5. **Disable `addTypename` in Tests**: Unless testing `__typename` logic

---

## 10. Code Generation

### Setup GraphQL Code Generator

Create `codegen.ts`:

```typescript
import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:8000/graphql',
  documents: ['app/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}', 'lib/**/*.{ts,tsx}'],
  ignoreNoDocuments: true,
  generates: {
    './lib/__generated__/graphql.ts': {
      plugins: ['typescript'],
      config: {
        skipTypename: false,
        enumsAsTypes: true,
        scalars: {
          DateTime: 'string',
          UUID: 'string',
          JSON: 'Record<string, any>',
        },
      },
    },
    './lib/__generated__/': {
      preset: 'near-operation-file',
      presetConfig: {
        baseTypesPath: 'graphql.ts',
        extension: '.generated.ts',
      },
      plugins: ['typescript-operations', 'typed-document-node'],
      config: {
        nonOptionalTypename: true,
        skipTypeNameForRoot: true,
        defaultScalarType: 'unknown',
      },
    },
  },
};

export default config;
```

### Add Scripts to package.json

```json
{
  "scripts": {
    "codegen": "graphql-codegen --config codegen.ts",
    "codegen:watch": "graphql-codegen --config codegen.ts --watch",
    "dev": "concurrently \"graphql-codegen --watch\" \"next dev\""
  }
}
```

### Usage with Type-Safe Hooks

```typescript
// queries.ts
import { gql } from '@apollo/client';

export const GET_USERS = gql`
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

// Component with auto-generated types
import { useQuery } from '@apollo/client';
import { GET_USERS } from './queries';

function UsersList() {
  // TypeScript automatically infers types from generated code
  const { data, loading, error } = useQuery(GET_USERS);
  
  // data.users is fully typed!
  return (
    <ul>
      {data?.users.map((user) => (
        <li key={user.id}>
          {user.name} - {user.email}
        </li>
      ))}
    </ul>
  );
}
```

### Custom Scalars Mapping

```typescript
// In codegen.ts
config: {
  scalars: {
    DateTime: 'string',     // ISO 8601 string
    UUID: 'string',         // UUID v4 string
    JSON: 'Record<string, any>',
    BigInt: 'number',
    Decimal: 'number',
  },
}
```

---

## 11. Best Practices

### Query Naming

Always name your operations:

```typescript
// ✅ Good
const GET_USERS = gql`
  query GetUsers {
    users { id name }
  }
`;

// ❌ Bad
const GET_USERS = gql`
  query {
    users { id name }
  }
`;
```

### Use Variables

Always use variables instead of string interpolation:

```typescript
// ✅ Good
const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) { id name }
  }
`;
useQuery(GET_USER, { variables: { id: userId } });

// ❌ Bad (security risk, no server-side caching)
const GET_USER = gql`
  query GetUser {
    user(id: "${userId}") { id name }
  }
`;
```

### Separate Data Concerns

Fetch global and user-specific data separately:

```typescript
// ✅ Good (maximizes server-side caching)
const GET_GLOBAL_CONFIG = gql`
  query GetGlobalConfig {
    config { theme maxUploadSize }
  }
`;

const GET_USER_DATA = gql`
  query GetUserData {
    currentUser { id name preferences }
  }
`;

// ❌ Bad (breaks server-side cache)
const GET_ALL_DATA = gql`
  query GetAllData {
    config { theme maxUploadSize }
    currentUser { id name preferences }
  }
`;
```

### App Metadata

Help Apollo Studio segment metrics:

```typescript
const client = new ApolloClient({
  uri: GRAPHQL_ENDPOINT,
  name: 'avcd-web',
  version: '1.0.0',
  // ... other config
});
```

### Fragment Colocation

Keep fragments near the components that use them:

```typescript
// UserCard.tsx
export const USER_CARD_FRAGMENT = gql`
  fragment UserCardFields on User {
    id
    name
    email
    avatar
  }
`;

export function UserCard({ user }: { user: UserCardFieldsFragment }) {
  return (
    <div>
      <img src={user.avatar} alt={user.name} />
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
}

// ParentComponent.tsx
const GET_USERS = gql`
  ${USER_CARD_FRAGMENT}
  query GetUsers {
    users {
      ...UserCardFields
    }
  }
`;
```

### Avoid Over-Fetching

Only request fields you need:

```typescript
// ✅ Good
const GET_USER_NAMES = gql`
  query GetUserNames {
    users {
      id
      name
    }
  }
`;

// ❌ Bad (fetching unnecessary data)
const GET_USER_NAMES = gql`
  query GetUserNames {
    users {
      id
      name
      email
      phone
      address
      organizations { id name }
      createdAt
      updatedAt
    }
  }
`;
```

---

## 12. Performance Optimization

### Batch Queries with DataLoader (Server-Side)

If you control the backend, implement DataLoader to batch N+1 queries.

### Use Fragments to Deduplicate Data

```typescript
const USER_FRAGMENT = gql`
  fragment UserInfo on User {
    id
    name
    email
  }
`;

// Multiple queries can share the same fragment
const GET_USER = gql`
  ${USER_FRAGMENT}
  query GetUser($id: ID!) {
    user(id: $id) { ...UserInfo }
  }
`;

const GET_USERS = gql`
  ${USER_FRAGMENT}
  query GetUsers {
    users { ...UserInfo }
  }
`;
```

### Defer Non-Critical Data

Use `@defer` directive (if supported by backend):

```typescript
const GET_USER_WITH_DEFER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
      ... @defer {
        organizations {
          id
          name
        }
      }
    }
  }
`;
```

### Cache-First for Static Data

```typescript
const { data } = useQuery(GET_GLOBAL_CONFIG, {
  fetchPolicy: 'cache-first', // Only fetch once
});
```

### Prefetch on Hover

```typescript
function UserLink({ userId }: { userId: string }) {
  const client = useApolloClient();
  
  const prefetch = () => {
    client.query({
      query: GET_USER,
      variables: { id: userId },
    });
  };
  
  return (
    <Link href={`/users/${userId}`} onMouseEnter={prefetch}>
      View User
    </Link>
  );
}
```

### Connection Pooling

For server-side Apollo Client, reuse the client instance:

```typescript
// lib/apollo-server.ts
let serverApolloClient: ApolloClient<any> | null = null;

export function getServerApolloClient() {
  if (!serverApolloClient) {
    serverApolloClient = createServerApolloClient();
  }
  return serverApolloClient;
}
```

---

## Quick Reference

### Essential Hooks

| Hook | Purpose | Returns |
|------|---------|---------|
| `useQuery` | Fetch data automatically | `{ data, loading, error, refetch }` |
| `useLazyQuery` | Fetch data manually | `[execute, { data, loading, error }]` |
| `useMutation` | Execute mutations | `[mutate, { data, loading, error }]` |
| `useSubscription` | Real-time subscriptions | `{ data, loading, error }` |
| `useApolloClient` | Access client instance | `ApolloClient` |

### Fetch Policies

| Policy | Description |
|--------|-------------|
| `cache-first` | Check cache before network |
| `cache-and-network` | Return cached data, fetch fresh in background |
| `network-only` | Always fetch from network, write to cache |
| `no-cache` | Bypass cache entirely |
| `cache-only` | Only read from cache, never network |

### Error Policies

| Policy | Description |
|--------|-------------|
| `none` | Return error, set data to undefined |
| `ignore` | Ignore errors, return data |
| `all` | Return both error and partial data |

---

## Migration Guide (v3 → v4)

If upgrading from Apollo Client 3.x:

```bash
# Use official codemod
npx @apollo/client-codemod-migrate-3-to-4 src
```

### Key Changes

1. **React imports**: Move from `@apollo/client` to `@apollo/client/react`
2. **Observable**: Migrated from `zen-observable` to RxJS
3. **Optional features**: HttpLink and local state now opt-in
4. **Error types**: New `.is()` methods for type checking

---

## Troubleshooting

### Common Issues

**Cache not updating after mutation**
- Ensure mutation returns the same `id` and `__typename`
- Use `update` function to manually modify cache
- Use `refetchQueries` as last resort

**Variables not matching**
- Check exact variable types in mocks
- Variables must match exactly for cache hits
- Use `JSON.stringify()` to debug variable differences

**Authentication errors**
- Verify token is being sent in headers
- Check token expiration
- Ensure Auth0 session is valid

**TypeScript errors with generated types**
- Run `npm run codegen` after schema changes
- Check `codegen.ts` configuration
- Verify `graphql` package version matches

---

## Resources

- [Apollo Client Docs](https://www.apollographql.com/docs/react)
- [GraphQL Code Generator](https://the-guild.dev/graphql/codegen)
- [Apollo DevTools](https://www.apollographql.com/docs/react/development-testing/developer-tooling)
- [Best Practices](https://www.apollographql.com/docs/react/data/operation-best-practices)
- [AVCD API Schema](http://localhost:8000/graphql) - Local GraphQL Playground

---

## Next Steps

1. **Install Apollo Client**: `npm install @apollo/client graphql`
2. **Create Apollo Provider**: Set up `lib/apollo-client.ts` and `lib/apollo-provider.tsx`
3. **Configure Authentication**: Create `/api/auth/token` route
4. **Setup Code Generation**: Create `codegen.ts` and run `npm run codegen`
5. **Write First Query**: Create a component with `useQuery`
6. **Add Tests**: Set up `MockedProvider` in Jest

---

**Last Updated**: April 2026  
**Apollo Client Version**: 4.1.7  
**Next.js Version**: 15.5.14  
**AVCD API**: Strawberry GraphQL (Python)
