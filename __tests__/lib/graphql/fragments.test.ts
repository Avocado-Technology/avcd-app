/**
 * Test: GraphQL Fragments
 * 
 * Following TDD - tests written first
 */

import { print } from 'graphql';

describe('GraphQL Fragments', () => {
  describe('Organization Fragment', () => {
    it('should include all required fields', async () => {
      const { ORGANIZATION_FIELDS } = await import('@/lib/graphql/fragments/organization');
      const printed = print(ORGANIZATION_FIELDS);
      
      expect(printed).toContain('id');
      expect(printed).toContain('name');
      expect(printed).toContain('address');
      expect(printed).toContain('userId');
    });

    it('should be named OrganizationFields', async () => {
      const { ORGANIZATION_FIELDS } = await import('@/lib/graphql/fragments/organization');
      const printed = print(ORGANIZATION_FIELDS);
      
      expect(printed).toContain('fragment OrganizationFields');
      expect(printed).toContain('on Organization');
    });
  });

  describe('Store Fragment', () => {
    it('should include all required fields', async () => {
      const { STORE_FIELDS } = await import('@/lib/graphql/fragments/store');
      const printed = print(STORE_FIELDS);
      
      expect(printed).toContain('id');
      expect(printed).toContain('name');
      expect(printed).toContain('address');
      expect(printed).toContain('organizationId');
    });

    it('should be named StoreFields', async () => {
      const { STORE_FIELDS } = await import('@/lib/graphql/fragments/store');
      const printed = print(STORE_FIELDS);
      
      expect(printed).toContain('fragment StoreFields');
      expect(printed).toContain('on Store');
    });
  });

  describe('Employee Fragment', () => {
    it('should include all required fields', async () => {
      const { EMPLOYEE_FIELDS } = await import('@/lib/graphql/fragments/employee');
      const printed = print(EMPLOYEE_FIELDS);
      
      expect(printed).toContain('id');
      expect(printed).toContain('name');
      expect(printed).toContain('address');
      expect(printed).toContain('salary');
      expect(printed).toContain('organizationId');
    });

    it('should be named EmployeeFields', async () => {
      const { EMPLOYEE_FIELDS } = await import('@/lib/graphql/fragments/employee');
      const printed = print(EMPLOYEE_FIELDS);
      
      expect(printed).toContain('fragment EmployeeFields');
      expect(printed).toContain('on Employee');
    });
  });
});
