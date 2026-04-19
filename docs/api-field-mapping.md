# API Field Mapping - Mock vs. Actual API

## Overview

This document maps the differences between the mock data structure used in the UI and the actual GraphQL API structure. Understanding these differences is critical for implementing the correct data transformation layer.

## Architecture Differences

### Mock Structure (Nested)
```
Organization
└── stores[] (nested array)
    └── employees[] (nested array)
```

### API Structure (Flat with Foreign Keys)
```
Organization (separate query)
Store (separate query, filtered by organizationId)
Employee (separate query, filtered by organizationId)
```

**Critical**: Employees belong to **Organizations**, NOT Stores in the API!

## Type Field Mappings

### Organization

| Mock Field | API Field | Type | Notes |
|------------|-----------|------|-------|
| `id` | `id` | String | Direct mapping |
| `name` | `name` | String | Direct mapping |
| `stores` | N/A | Store[] | **Not available** - must fetch separately |
| N/A | `address` | String | API has this, mock doesn't |
| N/A | `userId` | String | API has this, mock doesn't |

**Transformation Strategy**: 
- Fetch organizations first
- For each org, fetch stores with `organizationId` filter
- Nest stores array into organization object

### Store

| Mock Field | API Field | Type | Notes |
|------------|-----------|------|-------|
| `id` | `id` | String | Direct mapping |
| `name` | `name` | String | Direct mapping |
| `location` | `address` | String | **Field name different** |
| `employees` | N/A | Employee[] | **Not available** - must fetch separately |
| N/A | `organizationId` | String | API has this for filtering |

**Transformation Strategy**:
- Map `address` → `location`
- Fetch employees separately and artificially group by store
- Since API employees have `organizationId` not `storeId`, we need a grouping strategy

### Employee

| Mock Field | API Field | Type | Notes |
|------------|-----------|------|-------|
| `id` | `id` | String | Direct mapping |
| `name` | `name` | String | Direct mapping |
| `role` | **MISSING** | String | **Not available in API** |
| `email` | **MISSING** | String | **Not available in API** |
| N/A | `address` | String | API has this, mock doesn't |
| N/A | `salary` | Float | API has this, mock doesn't |
| N/A | `organizationId` | String | **Critical**: Links to org, not store! |

**Transformation Strategy**:
- Use `name` as-is
- Use `address` as temporary `role` placeholder or leave empty
- Email will be empty/placeholder
- Hide `salary` from UI
- **Challenge**: Distribute employees to stores (see strategy below)

## Query Structure

### Mock Approach (What We Want)
```graphql
# This would be ideal but API doesn't support it
query {
  organization(id: $id) {
    id
    name
    stores {
      id
      name
      location
      employees {
        id
        name
        role
        email
      }
    }
  }
}
```

### Actual API Approach (What We Must Do)
```graphql
# Query 1: Get organizations
query GetOrganizations {
  organizations {
    id
    name
    address
    userId
  }
}

# Query 2: Get stores for each organization
query GetStoresByOrg($organizationId: String!) {
  stores(organizationId: $organizationId) {
    id
    name
    address
    organizationId
  }
}

# Query 3: Get employees for each organization
query GetEmployeesByOrg($organizationId: String!) {
  employees(organizationId: $organizationId) {
    id
    name
    address
    salary
    organizationId
  }
}
```

## Employee-to-Store Distribution Strategy

Since API employees have `organizationId` but mock expects them under stores, we need to artificially distribute them.

### Option A: All employees in first store (Recommended - Simplest)
```typescript
// Assign all employees to the first store of each organization
orgWithStores.stores[0].employees = allEmployeesForOrg;
```

**Pros**: 
- Simplest implementation
- Maintains compatibility with existing UI
- Clear and predictable

**Cons**: 
- Not accurate representation if stores really do have specific employees
- First store will always show all employees

### Option B: Round-robin distribution
```typescript
// Distribute employees evenly across stores
employees.forEach((emp, index) => {
  const storeIndex = index % stores.length;
  stores[storeIndex].employees.push(emp);
});
```

**Pros**: 
- Visual balance across stores
- Better for demo/testing

**Cons**: 
- Arbitrary assignment with no real meaning
- More complex logic

### Option C: Leave stores empty, show employees at org level
```typescript
// Don't nest employees under stores
// Modify UI to show employees at organization level
```

**Pros**: 
- Most accurate to API structure
- No artificial data

**Cons**: 
- Requires UI changes
- Breaks current AnimatedOrgChart structure

### Recommended: Option A
Use Option A (all employees in first store) as it:
1. Requires no UI changes
2. Is simplest to implement
3. Maintains compatibility with AnimatedOrgChart
4. Can be easily changed later if needed

## Transformation Function Signature

```typescript
interface TransformApiToMockParams {
  organizations: Array<{ id: string; name: string; address: string; userId: string }>;
  storesByOrg: Map<string, Array<{ id: string; name: string; address: string; organizationId: string }>>;
  employeesByOrg: Map<string, Array<{ id: string; name: string; address: string; salary: number; organizationId: string }>>;
}

function transformApiToOrgData(params: TransformApiToMockParams): Organization[] {
  // 1. For each organization
  // 2. Get its stores from storesByOrg map
  // 3. Get its employees from employeesByOrg map
  // 4. Transform fields (address → location, etc.)
  // 5. Distribute employees to stores (using Option A)
  // 6. Return nested structure matching mock
}
```

## Connection Types (Pagination)

The API also supports paginated queries via Connection types:
- `OrganizationConnection`
- `StoreConnection`
- `EmployeeConnection`

These include `pageInfo`, `edges`, `cursor`, and `totalCount`.

**For Phase 1**: Use simple list queries (`organizations`, `stores`, `employees`)
**For Future**: Implement pagination with Connection types

## Missing Fields Handling

| Field | Strategy |
|-------|----------|
| `Employee.role` | Use `address` as placeholder or set to "Employee" |
| `Employee.email` | Set to empty string or generate placeholder |
| Store count per org | Calculate from fetched stores |
| Employee count per store | Calculate after distribution |

## Testing Considerations

1. **Empty States**:
   - Organization with no stores
   - Organization with stores but no employees
   - Empty organizations list

2. **Edge Cases**:
   - Single store with many employees
   - Many stores with no employees (all will be empty after distribution)
   - Organization with only stores (no employees)

3. **Data Integrity**:
   - All organizationId references are valid
   - No orphaned stores or employees
   - Proper type conversions (salary as Float)

## Implementation Phases

1. ✅ **Phase 0**: Schema introspection (this document)
2. **Phase 1**: Basic queries without transformation
3. **Phase 2**: Implement transformation layer with Option A strategy
4. **Phase 3**: Test with real API data
5. **Phase 4**: Optimize with caching
6. **Future**: Add support for Connection types and pagination
