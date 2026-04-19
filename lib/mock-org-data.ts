export interface Employee {
  id: string;
  name: string;
  role: string;
  email: string;
}

export interface Store {
  id: string;
  name: string;
  location: string;
  employees: Employee[];
}

export interface Organization {
  id: string;
  name: string;
  stores: Store[];
}

export const mockOrgData: Organization = {
  id: "org-1",
  name: "AVCD Corporation",
  stores: [
    {
      id: "store-1",
      name: "Downtown Store",
      location: "New York, NY",
      employees: [
        {
          id: "emp-1",
          name: "John Doe",
          role: "Manager",
          email: "john@avcd.com",
        },
        {
          id: "emp-2",
          name: "Jane Smith",
          role: "Associate",
          email: "jane@avcd.com",
        },
      ],
    },
    {
      id: "store-2",
      name: "Uptown Store",
      location: "Brooklyn, NY",
      employees: [
        {
          id: "emp-3",
          name: "Bob Wilson",
          role: "Manager",
          email: "bob@avcd.com",
        },
      ],
    },
  ],
};
