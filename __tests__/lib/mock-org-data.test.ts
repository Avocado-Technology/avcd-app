import { describe, it, expect } from "@jest/globals";
import { mockOrgData } from "@/lib/mock-org-data";

describe("Mock Organization Data", () => {
  it("should have organization with required fields", () => {
    expect(mockOrgData).toHaveProperty("id");
    expect(mockOrgData).toHaveProperty("name");
    expect(mockOrgData).toHaveProperty("stores");
  });

  it("should have at least one store", () => {
    expect(mockOrgData.stores.length).toBeGreaterThan(0);
  });

  it("should have valid store structure", () => {
    const store = mockOrgData.stores[0];
    expect(store).toHaveProperty("id");
    expect(store).toHaveProperty("name");
    expect(store).toHaveProperty("location");
    expect(store).toHaveProperty("employees");
  });

  it("should have valid employee structure", () => {
    const employee = mockOrgData.stores[0].employees[0];
    expect(employee).toHaveProperty("id");
    expect(employee).toHaveProperty("name");
    expect(employee).toHaveProperty("role");
    expect(employee).toHaveProperty("email");
  });
});
