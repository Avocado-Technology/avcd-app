# Apollo Client Integration Skill

Complete Apollo Client 4.x integration guide for the AVCD project, covering everything from setup to advanced patterns.

---

## What's Included

This skill provides comprehensive documentation for integrating Apollo Client with the AVCD GraphQL API (Strawberry/Python backend) in a Next.js 15 application with Auth0 authentication.

### 📚 Documentation Files

| File | Description | Size | For |
|------|-------------|------|-----|
| **SKILL.md** | Complete Apollo Client guide | 1,200+ lines | Developers |
| **QUICK_START.md** | 15-minute setup guide | ~300 lines | Beginners |
| **AVCD_API_REFERENCE.md** | GraphQL API schema reference | ~600 lines | Reference |
| **README.md** | This overview | ~200 lines | Overview |

---

## When to Use This Skill

This skill is triggered when you mention:
- "Apollo Client"
- "GraphQL"
- "useQuery", "useMutation", "useSubscription"
- "GraphQL cache"
- "GraphQL testing"
- "Frontend-backend integration"

---

## Quick Links

### For Beginners
Start here: **[QUICK_START.md](./QUICK_START.md)**
- 15-minute setup guide
- Copy-paste ready code
- Step-by-step instructions

### For Developers
Main reference: **[SKILL.md](./SKILL.md)**
- Complete API coverage
- Best practices
- Advanced patterns
- Testing strategies
- Performance optimization

### For API Integration
API reference: **[AVCD_API_REFERENCE.md](./AVCD_API_REFERENCE.md)**
- Complete schema documentation
- All queries and mutations
- Example GraphQL operations
- Error codes and handling

---

## What You'll Learn

### Core Concepts
- ✅ Apollo Client 4.x architecture
- ✅ Next.js App Router integration
- ✅ Auth0 JWT authentication
- ✅ Normalized cache management
- ✅ Query and mutation patterns
- ✅ Pagination (Relay-style connections)
- ✅ Error handling strategies
- ✅ Optimistic UI updates
- ✅ Testing with MockedProvider and MSW
- ✅ TypeScript code generation
- ✅ Performance optimization

### Advanced Topics
- 🔥 Cache normalization strategies
- 🔥 Field policies for pagination
- 🔥 Manual cache updates
- 🔥 Token refresh patterns
- 🔥 Fragment composition
- 🔥 Suspense integration
- 🔥 Prefetching strategies
- 🔥 Cache persistence

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────┐
│              Next.js 15 (App Router)                  │
│  ┌────────────────────────────────────────────┐      │
│  │  Components (useQuery, useMutation)        │      │
│  └────────────────┬───────────────────────────┘      │
│                   │                                    │
│  ┌────────────────▼───────────────────────────┐      │
│  │         Apollo Client 4.x                   │      │
│  │  • InMemoryCache (Normalized)              │      │
│  │  • AuthLink (JWT injection)                │      │
│  │  • ErrorLink (Token refresh)               │      │
│  │  • HttpLink (GraphQL endpoint)             │      │
│  └────────────────┬───────────────────────────┘      │
└───────────────────┼───────────────────────────────────┘
                    │ HTTPS + JWT Bearer
┌───────────────────▼───────────────────────────────────┐
│         AVCD GraphQL API (Strawberry/Python)          │
│  • JWT Validation                                     │
│  • Multi-tenant RBAC (owner_sub)                      │
│  • Domain Modules (Users, Orgs, Stores, Employees)   │
└──────────────────────────────────────────────────────┘
```

---

## Getting Started

### 1. Install Dependencies

```bash
npm install @apollo/client graphql
```

### 2. Follow Quick Start

See **[QUICK_START.md](./QUICK_START.md)** for step-by-step setup instructions.

### 3. Explore Examples

All examples in the skill use the AVCD API schema:
- Users
- Organizations
- Stores
- Employees
- API Keys

---

## Key Features

### 🔐 Authentication Integration

Full Auth0 JWT integration with automatic token injection and refresh:

```typescript
const authLink = setContext(async (_, { headers }) => {
  const response = await fetch('/api/auth/token');
  const { accessToken } = await response.json();
  
  return {
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${accessToken}` : '',
    },
  };
});
```

### 💾 Smart Cache Management

Normalized caching with automatic updates:

```typescript
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        users: {
          merge(existing, incoming) {
            return incoming; // Or custom merge logic
          },
        },
      },
    },
  },
});
```

### ⚡ Optimistic UI

Instant feedback for mutations:

```typescript
const [updateUser] = useMutation(UPDATE_USER, {
  optimisticResponse: {
    updateUser: {
      __typename: 'User',
      id: userId,
      name: newName,
    },
  },
});
```

### 🧪 Testing Patterns

MockedProvider for unit tests:

```typescript
const mocks = [
  {
    request: { query: GET_USERS },
    result: { data: { users: [...] } },
  },
];

render(
  <MockedProvider mocks={mocks}>
    <UsersList />
  </MockedProvider>
);
```

### 📝 TypeScript Support

Full type safety with code generation:

```bash
npm run codegen
```

---

## Real-World Examples

### Query Example

```typescript
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

function OrganizationsList() {
  const { data, loading, error } = useQuery(GET_ORGANIZATIONS);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <ul>
      {data.organizations.map((org) => (
        <li key={org.id}>{org.name}</li>
      ))}
    </ul>
  );
}
```

### Mutation Example

```typescript
const CREATE_STORE = gql`
  mutation CreateStore($input: CreateStoreInput!) {
    createStore(input: $input) {
      id
      name
      address
    }
  }
`;

function CreateStoreForm() {
  const [createStore, { loading }] = useMutation(CREATE_STORE, {
    refetchQueries: ['GetStores'],
  });
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      createStore({ variables: { input: formData } });
    }}>
      {/* Form fields */}
    </form>
  );
}
```

### Pagination Example

```typescript
const { data, fetchMore } = useQuery(GET_USERS_CONNECTION, {
  variables: { first: 20 },
});

const loadMore = () => {
  fetchMore({
    variables: {
      after: data.usersConnection.pageInfo.endCursor,
    },
  });
};
```

---

## Best Practices Covered

### ✅ DO

- Always name your GraphQL operations
- Use variables instead of string interpolation
- Implement proper error handling
- Use fragments to avoid duplication
- Test with MockedProvider
- Generate TypeScript types
- Cache-first for static data
- Optimistic UI for better UX

### ❌ DON'T

- Fetch unnecessary fields (over-fetching)
- Mix global and user-specific data in one query
- Ignore error states in UI
- Skip testing
- Hardcode values in queries
- Use `any` types
- Forget to handle loading states

---

## Testing Strategy

### Unit Tests
```typescript
// Use MockedProvider for component tests
<MockedProvider mocks={mocks}>
  <Component />
</MockedProvider>
```

### Integration Tests
```typescript
// Use MSW for network-level tests
const server = setupServer(
  graphql.query('GetUsers', () => {
    return HttpResponse.json({ data: { users: [...] } });
  })
);
```

### E2E Tests
```typescript
// Test against real API with Playwright/Cypress
// See testing section in SKILL.md
```

---

## Performance Tips

1. **Use Fragments**: Reduce duplicate field definitions
2. **Cache-First**: For static/rarely-changing data
3. **Pagination**: Use connections for large lists
4. **Prefetch**: Prefetch data on hover
5. **Defer**: Use `@defer` for non-critical data
6. **Batch**: Enable batch queries if supported
7. **Persist Cache**: For offline support

---

## Troubleshooting

### Common Issues

**Cache not updating**
- Ensure mutation returns `id` and `__typename`
- Use `refetchQueries` or manual `update`

**Authentication errors**
- Verify token in `/api/auth/token`
- Check Auth0 configuration
- Ensure token hasn't expired

**TypeScript errors**
- Run `npm run codegen`
- Check `codegen.ts` configuration
- Verify schema URL is correct

**Network errors**
- Check API is running
- Verify CORS configuration
- Check network tab in DevTools

---

## Contributing

Found a better pattern? Discovered an issue?

1. Update the relevant skill file
2. Add examples
3. Update this README
4. Test with sample queries

---

## Resources

### Official Documentation
- [Apollo Client Docs](https://www.apollographql.com/docs/react)
- [GraphQL Code Generator](https://the-guild.dev/graphql/codegen)
- [Next.js Documentation](https://nextjs.org/docs)
- [Auth0 Next.js SDK](https://auth0.com/docs/quickstart/webapp/nextjs)

### AVCD Project
- **API Endpoint**: http://localhost:8000/graphql
- **GraphQL Playground**: http://localhost:8000/graphql
- **API Skill**: `/api/.cursor/skills/api-architecture/SKILL.md`

### Tools
- [Apollo DevTools](https://www.apollographql.com/docs/react/development-testing/developer-tooling)
- [GraphQL Playground](https://github.com/graphql/graphql-playground)
- [Altair GraphQL Client](https://altair.sirmuel.design/)

---

## Version Information

| Component | Version | Notes |
|-----------|---------|-------|
| Apollo Client | 4.1.7 | Latest stable (2026) |
| GraphQL | 16.9.0 | Core dependency |
| Next.js | 15.5.14 | App Router required |
| React | 19.1.0 | Latest stable |
| TypeScript | 5.x | Recommended |
| Node.js | 20+ | Minimum version |

---

## Skill Statistics

- **Total Lines**: 1,200+ lines
- **File Size**: ~50KB
- **Coverage**: Complete Apollo Client 4.x API
- **Examples**: 50+ code examples
- **Topics**: 12 major sections
- **Patterns**: 30+ best practices

---

## Maintenance

### Last Updated
April 2026

### Update Schedule
- Check for Apollo Client updates quarterly
- Review best practices semi-annually
- Update examples as API evolves

### Changelog
- **April 2026**: Initial creation
  - Apollo Client 4.1.7 coverage
  - Full AVCD API integration
  - Auth0 JWT authentication
  - TypeScript code generation
  - Comprehensive testing guide

---

## Quick Reference Card

```typescript
// Setup
npm install @apollo/client graphql

// Provider
<ApolloProvider client={client}>
  <App />
</ApolloProvider>

// Query
const { data, loading, error } = useQuery(QUERY);

// Mutation
const [mutate, { loading }] = useMutation(MUTATION);

// Pagination
const { data, fetchMore } = useQuery(QUERY, { variables: { first: 20 } });

// Error Handling
errorPolicy: 'all' // Return both data and error

// Testing
<MockedProvider mocks={mocks}>
  <Component />
</MockedProvider>
```

---

**Created**: April 2026  
**Project**: AVCD Web Application  
**Authors**: Development Team  
**License**: Internal Use
