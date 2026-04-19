/**
 * Organization Tree Queries
 * 
 * Separate queries for organizations, stores, and employees
 * (API doesn't support nested queries)
 */

import { gql } from '@apollo/client';
import { ORGANIZATION_FIELDS } from '../fragments/organization';
import { STORE_FIELDS } from '../fragments/store';
import { EMPLOYEE_FIELDS } from '../fragments/employee';

/**
 * Query 1: Get all organizations
 */
export const GET_ORGANIZATIONS = gql`
  query GetOrganizations {
    organizations {
      ...OrganizationFields
    }
  }
  ${ORGANIZATION_FIELDS}
`;

/**
 * Query 2: Get stores by organization
 */
export const GET_STORES_BY_ORG = gql`
  query GetStoresByOrganization($organizationId: String!) {
    stores(organizationId: $organizationId) {
      ...StoreFields
    }
  }
  ${STORE_FIELDS}
`;

/**
 * Query 3: Get employees by organization
 */
export const GET_EMPLOYEES_BY_ORG = gql`
  query GetEmployeesByOrganization($organizationId: String!) {
    employees(organizationId: $organizationId) {
      ...EmployeeFields
    }
  }
  ${EMPLOYEE_FIELDS}
`;
