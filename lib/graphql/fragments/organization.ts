/**
 * Organization Fragment
 * 
 * Defines the fields to fetch for Organization type
 */

import { gql } from '@apollo/client';

export const ORGANIZATION_FIELDS = gql`
  fragment OrganizationFields on Organization {
    id
    name
    address
    userId
  }
`;
