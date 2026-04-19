import { describe, it, expect } from "@jest/globals";
import {
  transformOrgToNodes,
  transformOrgToEdges,
} from "@/components/org-chart/utils/layout-utils";
import { mockOrgData } from "@/lib/mock-org-data";

describe("Layout Utils - transformOrgToNodes", () => {
  it("should create organization node", () => {
    const nodes = transformOrgToNodes(mockOrgData);
    const orgNode = nodes.find((n) => n.id === "org-1");

    expect(orgNode).toBeDefined();
    expect(orgNode?.type).toBe("organizationNode");
    expect(orgNode?.data.name).toBe("AVCD Corporation");
  });

  it("should create store nodes", () => {
    const nodes = transformOrgToNodes(mockOrgData);
    const storeNodes = nodes.filter((n) => n.type === "storeNode");

    expect(storeNodes.length).toBe(2);
  });

  it("should create employee nodes", () => {
    const nodes = transformOrgToNodes(mockOrgData);
    const employeeNodes = nodes.filter((n) => n.type === "employeeNode");

    expect(employeeNodes.length).toBe(3);
  });
});

describe("Layout Utils - transformOrgToEdges", () => {
  it("should create edges from org to stores", () => {
    const edges = transformOrgToEdges(mockOrgData);
    const orgToStoreEdges = edges.filter((e) => e.source === "org-1");

    expect(orgToStoreEdges.length).toBe(2);
  });

  it("should create edges from stores to employees", () => {
    const edges = transformOrgToEdges(mockOrgData);
    const storeToEmployeeEdges = edges.filter((e) =>
      e.source.startsWith("store-"),
    );

    expect(storeToEmployeeEdges.length).toBe(3);
  });

  it("should use smoothstep edge type", () => {
    const edges = transformOrgToEdges(mockOrgData);
    expect(edges[0].type).toBe("smoothstep");
  });
});
