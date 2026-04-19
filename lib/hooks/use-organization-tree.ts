/**
 * useOrganizationTree Hook
 * 
 * Fetches organization data from GraphQL API and transforms it to match
 * the structure expected by the AnimatedOrgChart component
 */

'use client';

import { useQuery } from '@apollo/client/react';
import { useState, useEffect } from 'react';
import {
  GET_ORGANIZATIONS,
  GET_STORES_BY_ORG,
  GET_EMPLOYEES_BY_ORG,
} from '../graphql/queries/get-organization-tree';
import { transformApiToOrgData } from '../graphql/transforms/api-to-mock';
import type { Organization } from '../mock-org-data';

interface UseOrganizationTreeResult {
  data: Organization[] | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

interface ApiOrganization {
  id: string;
  [key: string]: unknown;
}

/**
 * Hook to fetch and transform organization tree data
 * 
 * Executes 3 separate queries:
 * 1. Fetch all organizations
 * 2. For each org, fetch stores
 * 3. For each org, fetch employees
 * 
 * Then transforms the flat data into nested structure
 * 
 * @returns {UseOrganizationTreeResult} Organization data, loading state, errors, and refetch function
 */
export function useOrganizationTree(): UseOrganizationTreeResult {
  const [transformedData, setTransformedData] = useState<Organization[] | null>(null);
  const [isTransforming, setIsTransforming] = useState(false);
  const [transformError, setTransformError] = useState<Error | null>(null);

  // Query 1: Get all organizations
  const {
    data: orgsData,
    loading: orgsLoading,
    error: orgsError,
    refetch: refetchOrgs,
    client,
  } = useQuery(GET_ORGANIZATIONS, {
    fetchPolicy: 'cache-and-network',
  });

  // Fetch stores and employees when organizations are loaded
  useEffect(() => {
    async function fetchAndTransform() {
      if (!orgsData?.organizations || orgsLoading) {
        return;
      }

      try {
        setIsTransforming(true);
        setTransformError(null);

        const organizations = orgsData.organizations;
        const storesByOrg = new Map();
        const employeesByOrg = new Map();

        // Fetch stores and employees for each organization in parallel
        await Promise.all(
          organizations.map(async (org: ApiOrganization) => {
            try {
              // Fetch stores for this org
              const storesResult = await client.query({
                query: GET_STORES_BY_ORG,
                variables: { organizationId: org.id },
              });
              storesByOrg.set(org.id, storesResult.data.stores || []);

              // Fetch employees for this org
              const employeesResult = await client.query({
                query: GET_EMPLOYEES_BY_ORG,
                variables: { organizationId: org.id },
              });
              employeesByOrg.set(org.id, employeesResult.data.employees || []);
            } catch (error) {
              console.error(`Error fetching data for org ${org.id}:`, error);
              // Set empty arrays for this org if fetch fails
              storesByOrg.set(org.id, []);
              employeesByOrg.set(org.id, []);
            }
          })
        );

        // Transform the data
        const transformed = transformApiToOrgData({
          organizations,
          storesByOrg,
          employeesByOrg,
        });

        setTransformedData(transformed);
      } catch (error) {
        console.error('Error transforming organization data:', error);
        setTransformError(error as Error);
      } finally {
        setIsTransforming(false);
      }
    }

    fetchAndTransform();
  }, [orgsData, orgsLoading, client]);

  // Refetch function
  const refetch = async () => {
    setTransformedData(null);
    await refetchOrgs();
  };

  return {
    data: transformedData,
    loading: orgsLoading || isTransforming,
    error: orgsError || transformError,
    refetch,
  };
}
