import { describe, it, expect } from '@jest/globals'
import {
  NODE_TYPES,
  type BaseNodeData,
  type EmployeeNodeData,
  type AnimatedEmployeeNodeData,
  type StoreNodeData,
  type AnimatedStoreNodeData,
  type OrganizationNodeData,
  type NodeType,
} from '@/components/org-chart/types'

describe('Shared Type Definitions', () => {
  describe('BaseNodeData', () => {
    it('should have id property', () => {
      const base: BaseNodeData = { id: 'test-1' }
      expect(base.id).toBe('test-1')
    })
  })

  describe('EmployeeNodeData', () => {
    it('should extend BaseNodeData', () => {
      const employee: EmployeeNodeData = {
        id: 'emp-1',
        name: 'John Doe',
        role: 'Manager',
      }
      
      expect(employee.id).toBe('emp-1')
      expect(employee.name).toBe('John Doe')
      expect(employee.role).toBe('Manager')
    })

    it('should be assignable to BaseNodeData', () => {
      const employee: EmployeeNodeData = {
        id: 'emp-1',
        name: 'John Doe',
        role: 'Manager',
      }
      
      const base: BaseNodeData = employee
      expect(base.id).toBe('emp-1')
    })
  })

  describe('AnimatedEmployeeNodeData', () => {
    it('should extend EmployeeNodeData with animation properties', () => {
      const animatedEmployee: AnimatedEmployeeNodeData = {
        id: 'emp-1',
        name: 'John Doe',
        role: 'Manager',
        isRecent: true,
        isHighlighted: false,
      }
      
      expect(animatedEmployee.id).toBe('emp-1')
      expect(animatedEmployee.name).toBe('John Doe')
      expect(animatedEmployee.role).toBe('Manager')
      expect(animatedEmployee.isRecent).toBe(true)
      expect(animatedEmployee.isHighlighted).toBe(false)
    })

    it('should have optional animation properties', () => {
      const animatedEmployee: AnimatedEmployeeNodeData = {
        id: 'emp-1',
        name: 'John Doe',
        role: 'Manager',
      }
      
      expect(animatedEmployee.isRecent).toBeUndefined()
      expect(animatedEmployee.isHighlighted).toBeUndefined()
    })

    it('should be assignable to EmployeeNodeData', () => {
      const animatedEmployee: AnimatedEmployeeNodeData = {
        id: 'emp-1',
        name: 'John Doe',
        role: 'Manager',
      }
      
      const employee: EmployeeNodeData = animatedEmployee
      expect(employee.id).toBe('emp-1')
    })
  })

  describe('StoreNodeData', () => {
    it('should extend BaseNodeData with store properties', () => {
      const store: StoreNodeData = {
        id: 'store-1',
        name: 'Downtown Store',
        location: 'New York, NY',
        employeeCount: 5,
      }
      
      expect(store.id).toBe('store-1')
      expect(store.name).toBe('Downtown Store')
      expect(store.location).toBe('New York, NY')
      expect(store.employeeCount).toBe(5)
    })
  })

  describe('AnimatedStoreNodeData', () => {
    it('should extend StoreNodeData with animation properties', () => {
      const animatedStore: AnimatedStoreNodeData = {
        id: 'store-1',
        name: 'Store',
        location: 'Location',
        employeeCount: 5,
        isRecent: true,
        isHighlighted: false,
      }
      
      expect(animatedStore.isRecent).toBe(true)
      expect(animatedStore.isHighlighted).toBe(false)
    })
  })

  describe('OrganizationNodeData', () => {
    it('should extend BaseNodeData with organization properties', () => {
      const org: OrganizationNodeData = {
        id: 'org-1',
        name: 'AVCD Corporation',
      }
      
      expect(org.id).toBe('org-1')
      expect(org.name).toBe('AVCD Corporation')
    })
  })

  describe('NODE_TYPES constant', () => {
    it('should have correct string values', () => {
      expect(NODE_TYPES.ORGANIZATION).toBe('organizationNode')
      expect(NODE_TYPES.STORE).toBe('storeNode')
      expect(NODE_TYPES.EMPLOYEE).toBe('employeeNode')
    })

    it('should be immutable (const assertion)', () => {
      // TypeScript will catch attempts to modify at compile time
      // At runtime, we can verify the values are as expected
      const types = NODE_TYPES
      expect(types).toBeDefined()
      expect(Object.keys(types).length).toBe(3)
    })

    it('should have all expected node types', () => {
      expect(NODE_TYPES).toHaveProperty('ORGANIZATION')
      expect(NODE_TYPES).toHaveProperty('STORE')
      expect(NODE_TYPES).toHaveProperty('EMPLOYEE')
    })
  })

  describe('NodeType union', () => {
    it('should accept valid node type strings', () => {
      const orgType: NodeType = 'organizationNode'
      const storeType: NodeType = 'storeNode'
      const employeeType: NodeType = 'employeeNode'
      
      expect(orgType).toBe('organizationNode')
      expect(storeType).toBe('storeNode')
      expect(employeeType).toBe('employeeNode')
    })

    it('should match NODE_TYPES values', () => {
      const types: NodeType[] = [
        NODE_TYPES.ORGANIZATION,
        NODE_TYPES.STORE,
        NODE_TYPES.EMPLOYEE,
      ]
      
      expect(types).toHaveLength(3)
      expect(types).toContain('organizationNode')
      expect(types).toContain('storeNode')
      expect(types).toContain('employeeNode')
    })
  })

  describe('Type compatibility', () => {
    it('should allow animated types to be used where base types are expected', () => {
      const animatedEmployee: AnimatedEmployeeNodeData = {
        id: 'emp-1',
        name: 'John',
        role: 'Dev',
        isRecent: true,
      }
      
      // Should be assignable to base type
      const employee: EmployeeNodeData = animatedEmployee
      expect(employee.name).toBe('John')
    })

    it('should allow all node data types to be assigned to BaseNodeData', () => {
      const employee: EmployeeNodeData = { id: 'e1', name: 'John', role: 'Dev' }
      const store: StoreNodeData = { id: 's1', name: 'Store', location: 'NY', employeeCount: 5 }
      const org: OrganizationNodeData = { id: 'o1', name: 'Corp' }
      
      const baseEmployee: BaseNodeData = employee
      const baseStore: BaseNodeData = store
      const baseOrg: BaseNodeData = org
      
      expect(baseEmployee.id).toBe('e1')
      expect(baseStore.id).toBe('s1')
      expect(baseOrg.id).toBe('o1')
    })
  })

  describe('Type inference', () => {
    it('should infer NODE_TYPES as literal types', () => {
      // The typeof NODE_TYPES should preserve literal types
      type OrgType = typeof NODE_TYPES.ORGANIZATION
      type StoreType = typeof NODE_TYPES.STORE
      type EmployeeType = typeof NODE_TYPES.EMPLOYEE
      
      const org: OrgType = 'organizationNode'
      const store: StoreType = 'storeNode'
      const employee: EmployeeType = 'employeeNode'
      
      expect(org).toBe('organizationNode')
      expect(store).toBe('storeNode')
      expect(employee).toBe('employeeNode')
    })
  })
})
