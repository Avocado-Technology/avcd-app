# AVCD GraphQL API Reference

Quick reference for the AVCD GraphQL API schema to use with Apollo Client.

---

## API Endpoint

```
Local Development: http://localhost:8000/graphql
GraphQL Playground: http://localhost:8000/graphql
```

---

## Authentication

All requests require JWT Bearer token in the Authorization header:

```typescript
headers: {
  Authorization: `Bearer ${accessToken}`,
}
```

The API uses Auth0 JWT tokens with `owner_sub` for multi-tenancy isolation.

---

## Core Domains

### 1. Users

**Types:**
- `User`: User entity
- `UserRole`: Enum (ADMIN, MANAGER, USER)

**Queries:**
```graphql
users: [User!]!
user(id: ID!): User
usersConnection(first: Int!, after: String, filter: UserFilter, orderBy: UserOrderBy): UserConnection!
```

**Mutations:**
```graphql
createUser(input: CreateUserInput!): User!
updateUser(id: ID!, input: UpdateUserInput!): User!
deleteUser(id: ID!): Boolean!
```

**Example Query:**
```graphql
query GetUsers {
  users {
    id
    name
    email
    role
    createdAt
    updatedAt
  }
}
```

**Example Mutation:**
```graphql
mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    name
    email
    role
    createdAt
  }
}
```

---

### 2. Organizations

**Types:**
- `Organization`: Organization entity

**Queries:**
```graphql
organizations: [Organization!]!
organization(id: ID!): Organization
organizationsConnection(first: Int!, after: String, filter: OrganizationFilter, orderBy: OrganizationOrderBy): OrganizationConnection!
```

**Mutations:**
```graphql
createOrganization(input: CreateOrganizationInput!): Organization!
updateOrganization(id: ID!, input: UpdateOrganizationInput!): Organization!
deleteOrganization(id: ID!): Boolean!
```

**Example Query:**
```graphql
query GetOrganizations {
  organizations {
    id
    name
    slug
    description
    createdAt
    updatedAt
  }
}
```

---

### 3. Stores

**Types:**
- `Store`: Store entity

**Queries:**
```graphql
stores: [Store!]!
store(id: ID!): Store
storesConnection(first: Int!, after: String, filter: StoreFilter, orderBy: StoreOrderBy): StoreConnection!
```

**Mutations:**
```graphql
createStore(input: CreateStoreInput!): Store!
updateStore(id: ID!, input: UpdateStoreInput!): Store!
deleteStore(id: ID!): Boolean!
```

**Example Query:**
```graphql
query GetStores {
  stores {
    id
    name
    address
    city
    state
    zipCode
    organizationId
    createdAt
    updatedAt
  }
}
```

---

### 4. Employees

**Types:**
- `Employee`: Employee entity

**Queries:**
```graphql
employees: [Employee!]!
employee(id: ID!): Employee
employeesConnection(first: Int!, after: String, filter: EmployeeFilter, orderBy: EmployeeOrderBy): EmployeeConnection!
```

**Mutations:**
```graphql
createEmployee(input: CreateEmployeeInput!): Employee!
updateEmployee(id: ID!, input: UpdateEmployeeInput!): Employee!
deleteEmployee(id: ID!): Boolean!
```

**Example Query:**
```graphql
query GetEmployees {
  employees {
    id
    firstName
    lastName
    email
    phone
    position
    storeId
    createdAt
    updatedAt
  }
}
```

---

### 5. API Keys

**Types:**
- `ApiKey`: API key entity

**Queries:**
```graphql
apiKeys: [ApiKey!]!
```

**Mutations:**
```graphql
createApiKey(input: CreateApiKeyInput!): ApiKey!
revokeApiKey(id: ID!): Boolean!
```

---

## Connection Types (Relay-style Pagination)

All entities support connection-based pagination:

```graphql
type UserConnection {
  edges: [UserEdge!]!
  pageInfo: PageInfo!
}

type UserEdge {
  node: User!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}
```

**Example Pagination Query:**
```graphql
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
```

---

## Filtering & Ordering

### Filter Input Types

Each entity has a corresponding filter input:

```graphql
input UserFilter {
  name: StringFilter
  email: StringFilter
  role: UserRoleFilter
  # ... more fields
}

input StringFilter {
  equals: String
  in: [String!]
  contains: String
  startsWith: String
  endsWith: String
}
```

### Order By

```graphql
input UserOrderBy {
  field: UserOrderByField!
  direction: OrderDirection!
}

enum UserOrderByField {
  NAME
  EMAIL
  CREATED_AT
  UPDATED_AT
}

enum OrderDirection {
  ASC
  DESC
}
```

**Example Filtered Query:**
```graphql
query GetFilteredUsers($filter: UserFilter, $orderBy: UserOrderBy) {
  users(filter: $filter, orderBy: $orderBy) {
    id
    name
    email
    role
  }
}

# Variables:
{
  "filter": {
    "role": { "equals": "ADMIN" }
  },
  "orderBy": {
    "field": "NAME",
    "direction": "ASC"
  }
}
```

---

## RBAC (Role-Based Access Control)

The API implements RBAC with three roles:

- **ADMIN**: Full access to all operations
- **MANAGER**: Read/write access to assigned resources
- **USER**: Read-only access to assigned resources

**Role-based queries are automatically filtered** based on:
- User's role
- User's `owner_sub` (multi-tenant isolation)

---

## Error Handling

### Error Codes

- `UNAUTHENTICATED`: Missing or invalid JWT token
- `FORBIDDEN`: Insufficient permissions for operation
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Input validation failed
- `INTERNAL_ERROR`: Server error

### Error Response Format

```json
{
  "errors": [
    {
      "message": "User not found",
      "extensions": {
        "code": "NOT_FOUND",
        "path": ["user"]
      },
      "locations": [{ "line": 2, "column": 3 }],
      "path": ["user"]
    }
  ],
  "data": null
}
```

---

## Type Definitions Quick Reference

### User

```graphql
type User {
  id: ID!
  name: String!
  email: String!
  role: UserRole!
  ownerSub: String!
  createdAt: DateTime!
  updatedAt: DateTime!
}

input CreateUserInput {
  name: String!
  email: String!
  role: UserRole!
}

input UpdateUserInput {
  name: String
  email: String
  role: UserRole
}
```

### Organization

```graphql
type Organization {
  id: ID!
  name: String!
  slug: String!
  description: String
  ownerSub: String!
  createdAt: DateTime!
  updatedAt: DateTime!
}

input CreateOrganizationInput {
  name: String!
  slug: String!
  description: String
}

input UpdateOrganizationInput {
  name: String
  slug: String
  description: String
}
```

### Store

```graphql
type Store {
  id: ID!
  name: String!
  address: String!
  city: String!
  state: String!
  zipCode: String!
  organizationId: ID!
  ownerSub: String!
  createdAt: DateTime!
  updatedAt: DateTime!
}

input CreateStoreInput {
  name: String!
  address: String!
  city: String!
  state: String!
  zipCode: String!
  organizationId: ID!
}

input UpdateStoreInput {
  name: String
  address: String
  city: String
  state: String
  zipCode: String
}
```

### Employee

```graphql
type Employee {
  id: ID!
  firstName: String!
  lastName: String!
  email: String!
  phone: String
  position: String!
  storeId: ID!
  ownerSub: String!
  createdAt: DateTime!
  updatedAt: DateTime!
}

input CreateEmployeeInput {
  firstName: String!
  lastName: String!
  email: String!
  phone: String
  position: String!
  storeId: ID!
}

input UpdateEmployeeInput {
  firstName: String
  lastName: String
  email: String
  phone: String
  position: String
}
```

---

## Apollo Client Integration Examples

### 1. Basic Setup

```typescript
import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = new HttpLink({
  uri: 'http://localhost:8000/graphql',
});

const authLink = setContext(async (_, { headers }) => {
  const token = await getAccessToken(); // Your Auth0 token function
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([authLink, httpLink]),
});
```

### 2. Query Example

```typescript
import { gql, useQuery } from '@apollo/client';

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

### 3. Mutation Example

```typescript
import { gql, useMutation } from '@apollo/client';

const CREATE_STORE = gql`
  mutation CreateStore($input: CreateStoreInput!) {
    createStore(input: $input) {
      id
      name
      address
      city
      state
      zipCode
    }
  }
`;

function CreateStoreForm() {
  const [createStore, { loading }] = useMutation(CREATE_STORE, {
    refetchQueries: ['GetStores'],
  });
  
  const handleSubmit = async (formData) => {
    await createStore({
      variables: {
        input: {
          name: formData.name,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          organizationId: formData.organizationId,
        },
      },
    });
  };
  
  return <form onSubmit={handleSubmit}>{/* Form fields */}</form>;
}
```

### 4. Pagination Example

```typescript
const GET_USERS_CONNECTION = gql`
  query GetUsersConnection($first: Int!, $after: String) {
    usersConnection(first: $first, after: $after) {
      edges {
        node {
          id
          name
          email
          role
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
        after: data.usersConnection.pageInfo.endCursor,
      },
    });
  };
  
  return (
    <div>
      {data?.usersConnection.edges.map(({ node }) => (
        <UserCard key={node.id} user={node} />
      ))}
      {data?.usersConnection.pageInfo.hasNextPage && (
        <button onClick={loadMore}>Load More</button>
      )}
    </div>
  );
}
```

---

## Special Queries

### LLM API Guide

The API provides a special query for LLM clients:

```graphql
query GetLLMApiGuide {
  llmApiGuide
}
```

This returns a comprehensive markdown guide for the entire API schema.

---

## Testing Queries in GraphQL Playground

1. Start the API: `cd api && uv run uvicorn src.main:app --reload`
2. Open: http://localhost:8000/graphql
3. Add Authorization header in bottom-left panel:

```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

4. Run introspection query to explore schema:

```graphql
{
  __schema {
    types {
      name
      kind
      description
    }
  }
}
```

---

**Last Updated**: April 2026  
**API Version**: Strawberry GraphQL (Python)  
**Backend**: FastAPI + Strawberry  
**Multi-Tenancy**: `owner_sub` isolation
