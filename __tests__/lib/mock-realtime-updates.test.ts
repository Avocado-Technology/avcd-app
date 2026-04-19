import { describe, it, expect } from "@jest/globals";
import {
  generateMockEmployee,
  generateMockStore,
  addEmployeeToOrg,
  moveEmployeeBetweenStores,
  removeEmployeeFromOrg,
} from "@/lib/mock-realtime-updates";
import { mockOrgData } from "@/lib/mock-org-data";

describe("Mock Realtime Updates", () => {
  describe("generateMockEmployee", () => {
    it("should generate unique employee IDs", () => {
      const emp1 = generateMockEmployee();
      const emp2 = generateMockEmployee();

      expect(emp1.id).not.toBe(emp2.id);
    });

    it("should generate valid employee structure", () => {
      const emp = generateMockEmployee();

      expect(emp).toHaveProperty("id");
      expect(emp).toHaveProperty("name");
      expect(emp).toHaveProperty("role");
      expect(emp).toHaveProperty("email");
    });

    it("should use provided name if given", () => {
      const emp = generateMockEmployee("Custom Name");
      expect(emp.name).toBe("Custom Name");
    });
  });

  describe("addEmployeeToOrg", () => {
    it("should add employee to specified store", () => {
      const employee = generateMockEmployee();
      const result = addEmployeeToOrg(mockOrgData, "store-1", employee);

      const store = result.stores.find((s) => s.id === "store-1");
      expect(store?.employees).toContainEqual(employee);
    });

    it("should not modify original org data", () => {
      const employee = generateMockEmployee();
      const originalEmployeeCount = mockOrgData.stores[0].employees.length;

      addEmployeeToOrg(mockOrgData, "store-1", employee);

      expect(mockOrgData.stores[0].employees.length).toBe(
        originalEmployeeCount,
      );
    });

    it("should throw error if store not found", () => {
      const employee = generateMockEmployee();

      expect(() => {
        addEmployeeToOrg(mockOrgData, "invalid-store", employee);
      }).toThrow("Store not found");
    });
  });

  describe("moveEmployeeBetweenStores", () => {
    it("should move employee from source to target store", () => {
      const empId = mockOrgData.stores[0].employees[0].id;
      const result = moveEmployeeBetweenStores(
        mockOrgData,
        empId,
        "store-1",
        "store-2",
      );

      const sourceStore = result.stores.find((s) => s.id === "store-1");
      const targetStore = result.stores.find((s) => s.id === "store-2");

      expect(
        sourceStore?.employees.find((e) => e.id === empId),
      ).toBeUndefined();
      expect(targetStore?.employees.find((e) => e.id === empId)).toBeDefined();
    });

    it("should throw error if employee not found in source store", () => {
      expect(() => {
        moveEmployeeBetweenStores(
          mockOrgData,
          "invalid-emp",
          "store-1",
          "store-2",
        );
      }).toThrow("Employee not found");
    });
  });

  describe("removeEmployeeFromOrg", () => {
    it("should remove employee from organization", () => {
      const empId = mockOrgData.stores[0].employees[0].id;
      const result = removeEmployeeFromOrg(mockOrgData, empId);

      const allEmployees = result.stores.flatMap((s) => s.employees);
      expect(allEmployees.find((e) => e.id === empId)).toBeUndefined();
    });
  });
});
