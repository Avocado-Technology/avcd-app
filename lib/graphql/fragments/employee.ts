/**
 * Employee Fragment
 * 
 * Defines the fields to fetch for Employee type
 */

import { gql } from '@apollo/client';

export const EMPLOYEE_FIELDS = gql`
  fragment EmployeeFields on Employee {
    id
    name
    address
    salary
    organizationId
  }
`;
