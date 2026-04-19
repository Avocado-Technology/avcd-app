/**
 * Store Fragment
 * 
 * Defines the fields to fetch for Store type
 */

import { gql } from '@apollo/client';

export const STORE_FIELDS = gql`
  fragment StoreFields on Store {
    id
    name
    address
    organizationId
  }
`;
