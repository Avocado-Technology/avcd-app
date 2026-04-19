/**
 * API to Mock Data Transformation
 * 
 * Transforms flat API data (organizations, stores, employees) into
 * the nested structure expected by the AnimatedOrgChart component
 */

import type { Organization, Store, Employee } from '@/lib/mock-org-data';

/**
 * API types from GraphQL schema
 */
interface ApiOrganization {
  id: string;
  name: string;
  address: string;
  userId: string;
}

interface ApiStore {
  id: string;
  name: string;
  address: string;
  organizationId: string;
}

interface ApiEmployee {
  id: string;
  name: string;
  address: string;
  salary: number;
  organizationId: string;
}

interface TransformApiToOrgDataParams {
  organizations: ApiOrganization[];
  storesByOrg: Map<string, ApiStore[]>;
  employeesByOrg: Map<string, ApiEmployee[]>;
}

/**
 * Transform API data to mock Organization structure
 * 
 * Handles the following transformations:
 * 1. Converts flat lists to nested structure (Org -> Stores -> Employees)
 * 2. Maps API field names to mock field names (address -> location)
 * 3. Assigns all employees to the first store of each organization
 * 4. Generates email placeholders for employees
 * 5. Uses address as role placeholder for employees
 * 
 * @param params - Organizations and their related stores/employees
 * @returns Array of Organizations in mock data format
 */
export function transformApiToOrgData(
  params: TransformApiToOrgDataParams
): Organization[] {
  const { organizations, storesByOrg, employeesByOrg } = params;

  return organizations.map((org) => {
    // Get stores for this organization
    const orgStores = storesByOrg.get(org.id) || [];
    
    // Get employees for this organization
    const orgEmployees = employeesByOrg.get(org.id) || [];

    // Transform stores
    const transformedStores: Store[] = orgStores.map((apiStore, index) => {
      // Transform employees (assign all to first store)
      const storeEmployees: Employee[] = 
        index === 0 
          ? orgEmployees.map((apiEmployee) => ({
              id: apiEmployee.id,
              name: apiEmployee.name,
              // Use address as role (API doesn't have role field)
              role: apiEmployee.address,
              // Generate email placeholder from name
              email: generateEmailFromName(apiEmployee.name),
            }))
          : []; // All other stores have no employees

      return {
        id: apiStore.id,
        name: apiStore.name,
        // Map address to location
        location: apiStore.address,
        employees: storeEmployees,
      };
    });

    return {
      id: org.id,
      name: org.name,
      stores: transformedStores,
    };
  });
}

/**
 * Generate a placeholder email from a name
 * Converts "John Doe" -> "john.doe@example.com"
 * 
 * @param name - Employee name
 * @returns Generated email address
 */
function generateEmailFromName(name: string): string {
  const normalized = name
    .toLowerCase()
    .replace(/\s+/g, '.')
    .replace(/[^a-z0-9.]/g, '');
  
  return `${normalized}@example.com`;
}
