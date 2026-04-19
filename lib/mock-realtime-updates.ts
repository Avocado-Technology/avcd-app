import { Organization, Employee, Store } from "./mock-org-data";

const FIRST_NAMES = [
  "Alice",
  "Bob",
  "Charlie",
  "Diana",
  "Eve",
  "Frank",
  "Grace",
  "Henry",
];
const LAST_NAMES = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
];
const ROLES = [
  "Manager",
  "Associate",
  "Supervisor",
  "Specialist",
  "Coordinator",
  "Analyst",
];

export function generateMockEmployee(name?: string): Employee {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  const fullName = name || `${firstName} ${lastName}`;
  const role = ROLES[Math.floor(Math.random() * ROLES.length)];

  return {
    id: `emp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: fullName,
    role,
    email: `${fullName.toLowerCase().replace(" ", ".")}@avcd.com`,
  };
}

export function generateMockStore(name?: string): Store {
  const storeNames = ["Downtown", "Uptown", "Midtown", "Eastside", "Westside"];
  const cities = [
    "New York, NY",
    "Los Angeles, CA",
    "Chicago, IL",
    "Houston, TX",
  ];

  const storeName =
    name ||
    `${storeNames[Math.floor(Math.random() * storeNames.length)]} Store`;
  const location = cities[Math.floor(Math.random() * cities.length)];

  return {
    id: `store-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: storeName,
    location,
    employees: [],
  };
}

export function addEmployeeToOrg(
  org: Organization,
  storeId: string,
  employee: Employee,
): Organization {
  const storeIndex = org.stores.findIndex((s) => s.id === storeId);

  if (storeIndex === -1) {
    throw new Error("Store not found");
  }

  return {
    ...org,
    stores: org.stores.map((store, index) =>
      index === storeIndex
        ? { ...store, employees: [...store.employees, employee] }
        : store,
    ),
  };
}

export function moveEmployeeBetweenStores(
  org: Organization,
  employeeId: string,
  fromStoreId: string,
  toStoreId: string,
): Organization {
  const fromStoreIndex = org.stores.findIndex((s) => s.id === fromStoreId);
  const toStoreIndex = org.stores.findIndex((s) => s.id === toStoreId);

  if (fromStoreIndex === -1 || toStoreIndex === -1) {
    throw new Error("Store not found");
  }

  const employee = org.stores[fromStoreIndex].employees.find(
    (e) => e.id === employeeId,
  );

  if (!employee) {
    throw new Error("Employee not found in source store");
  }

  return {
    ...org,
    stores: org.stores.map((store, index) => {
      if (index === fromStoreIndex) {
        return {
          ...store,
          employees: store.employees.filter((e) => e.id !== employeeId),
        };
      }
      if (index === toStoreIndex) {
        return {
          ...store,
          employees: [...store.employees, employee],
        };
      }
      return store;
    }),
  };
}

export function removeEmployeeFromOrg(
  org: Organization,
  employeeId: string,
): Organization {
  return {
    ...org,
    stores: org.stores.map((store) => ({
      ...store,
      employees: store.employees.filter((e) => e.id !== employeeId),
    })),
  };
}
