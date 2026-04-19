/**
 * Test: GetOrganizationTree Queries
 * 
 * Following TDD - tests written first
 */

import { print } from 'graphql';

describe('GetOrganizationTree Queries', () => {
  describe('GET_ORGANIZATIONS query', () => {
    it('should include organizations query', async () => {
      const { GET_ORGANIZATIONS } = await import('@/lib/graphql/queries/get-organization-tree');
      const printed = print(GET_ORGANIZATIONS);
      
      expect(printed).toContain('query GetOrganizations');
      expect(printed).toContain('organizations');
      expect(printed).toContain('...OrganizationFields');
    });

    it('should have no variables', async () => {
      const { GET_ORGANIZATIONS } = await import('@/lib/graphql/queries/get-organization-tree');
      const printed = print(GET_ORGANIZATIONS);
      
      // Should not have parameter list
      expect(printed).not.toContain('$');
    });
  });

  describe('GET_STORES_BY_ORG query', () => {
    it('should include stores query with organizationId parameter', async () => {
      const { GET_STORES_BY_ORG } = await import('@/lib/graphql/queries/get-organization-tree');
      const printed = print(GET_STORES_BY_ORG);
      
      expect(printed).toContain('query GetStoresByOrganization');
      expect(printed).toContain('$organizationId');
      expect(printed).toContain('String!');
      expect(printed).toContain('stores');
      expect(printed).toContain('organizationId: $organizationId');
      expect(printed).toContain('...StoreFields');
    });
  });

  describe('GET_EMPLOYEES_BY_ORG query', () => {
    it('should include employees query with organizationId parameter', async () => {
      const { GET_EMPLOYEES_BY_ORG } = await import('@/lib/graphql/queries/get-organization-tree');
      const printed = print(GET_EMPLOYEES_BY_ORG);
      
      expect(printed).toContain('query GetEmployeesByOrganization');
      expect(printed).toContain('$organizationId');
      expect(printed).toContain('String!');
      expect(printed).toContain('employees');
      expect(printed).toContain('organizationId: $organizationId');
      expect(printed).toContain('...EmployeeFields');
    });
  });
});
