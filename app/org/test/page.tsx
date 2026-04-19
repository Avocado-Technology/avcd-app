'use client'

import 'reactflow/dist/style.css'
import { useState, useRef, useEffect } from 'react'
import { AnimatedOrgChart, AnimatedOrgChartRef } from '@/components/org-chart/animated-org-chart'
import { mockOrgData } from '@/lib/mock-org-data'
import {
  generateMockEmployee,
  addEmployeeToOrg,
  moveEmployeeBetweenStores,
} from '@/lib/mock-realtime-updates'
import type { Organization } from '@/lib/mock-org-data'

export default function OrgChartTestPage() {
  const [orgData, setOrgData] = useState<Organization>(mockOrgData)
  const [autoPlay, setAutoPlay] = useState(false)
  const chartRef = useRef<AnimatedOrgChartRef>(null)
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const handleAddEmployee = () => {
    const newEmployee = generateMockEmployee()
    const storeId = orgData.stores[0].id
    const newData = addEmployeeToOrg(orgData, storeId, newEmployee)

    setOrgData(newData)

    // Mark as recent after state update
    setTimeout(() => {
      chartRef.current?.markAsRecent(newEmployee.id, 800)
    }, 50)
  }

  const handleMoveEmployee = () => {
    if (orgData.stores.length < 2) return
    if (orgData.stores[0].employees.length === 0) return

    const empId = orgData.stores[0].employees[0].id
    const fromStoreId = orgData.stores[0].id
    const toStoreId = orgData.stores[1].id

    const newData = moveEmployeeBetweenStores(orgData, empId, fromStoreId, toStoreId)

    setOrgData(newData)

    // Highlight moved employee
    setTimeout(() => {
      chartRef.current?.highlightNode(empId, 1500)
    }, 50)
  }

  const handleReset = () => {
    setOrgData(mockOrgData)
    chartRef.current?.clearAll()
    setAutoPlay(false)
  }

  const toggleAutoPlay = () => {
    setAutoPlay(!autoPlay)
  }

  useEffect(() => {
    if (autoPlay) {
      const actions = [
        () => {
          // Add employee
          console.log('🎬 AUTO-PLAY: Adding employee...')
          const newEmployee = generateMockEmployee()
          const randomStore = orgData.stores[Math.floor(Math.random() * orgData.stores.length)]
          const newData = addEmployeeToOrg(orgData, randomStore.id, newEmployee)
          console.log('📝 New employee:', newEmployee.name, 'ID:', newEmployee.id)
          console.log('📊 Employee count before:', orgData.stores.reduce((sum, s) => sum + s.employees.length, 0))
          console.log('📊 Employee count after:', newData.stores.reduce((sum, s) => sum + s.employees.length, 0))
          setOrgData(newData)
          setTimeout(() => {
            console.log('⭐ Marking as recent:', newEmployee.id)
            chartRef.current?.markAsRecent(newEmployee.id, 2000)
          }, 100)
        },
        () => {
          // Move employee
          console.log('🎬 AUTO-PLAY: Moving employee...')
          if (orgData.stores.length < 2) return
          const sourceStore = orgData.stores.find(s => s.employees.length > 0)
          if (!sourceStore) return
          
          const targetStoreIndex = orgData.stores.findIndex(s => s.id !== sourceStore.id)
          if (targetStoreIndex === -1) return
          
          const empId = sourceStore.employees[0].id
          console.log('👤 Moving employee:', empId, 'from', sourceStore.name, 'to', orgData.stores[targetStoreIndex].name)
          const newData = moveEmployeeBetweenStores(orgData, empId, sourceStore.id, orgData.stores[targetStoreIndex].id)
          setOrgData(newData)
          setTimeout(() => {
            console.log('💡 Highlighting moved employee:', empId)
            chartRef.current?.highlightNode(empId, 2000)
          }, 100)
        },
        () => {
          // Highlight random employee
          console.log('🎬 AUTO-PLAY: Highlighting random employee...')
          const allEmployees = orgData.stores.flatMap(s => s.employees)
          if (allEmployees.length === 0) return
          const randomEmp = allEmployees[Math.floor(Math.random() * allEmployees.length)]
          console.log('🌟 Highlighting:', randomEmp.name, 'ID:', randomEmp.id)
          chartRef.current?.highlightNode(randomEmp.id, 1500)
        }
      ]

      autoPlayIntervalRef.current = setInterval(() => {
        const randomAction = actions[Math.floor(Math.random() * actions.length)]
        randomAction()
      }, 3000)

      return () => {
        if (autoPlayIntervalRef.current) {
          clearInterval(autoPlayIntervalRef.current)
        }
      }
    }
  }, [autoPlay, orgData])

  return (
    <div className="flex flex-col h-screen">
      <div className="flex gap-2 p-4 border-b" style={{ background: 'var(--g50)' }}>
        <button
          onClick={toggleAutoPlay}
          className="px-4 py-2 rounded-lg font-medium"
          style={{
            background: autoPlay ? '#ef4444' : '#22c55e',
            color: 'var(--bg)',
          }}
        >
          {autoPlay ? '⏸ Stop Auto-Play' : '▶ Start Auto-Play'}
        </button>
        <div className="w-px bg-gray-300 mx-2" />
        <button
          onClick={handleAddEmployee}
          className="px-4 py-2 rounded-lg font-medium"
          style={{
            background: 'var(--g900)',
            color: 'var(--bg)',
            opacity: autoPlay ? 0.5 : 1,
          }}
          disabled={autoPlay}
        >
          Add Employee
        </button>
        <button
          onClick={handleMoveEmployee}
          className="px-4 py-2 rounded-lg font-medium"
          style={{
            background: 'var(--g700)',
            color: 'var(--bg)',
            opacity: autoPlay ? 0.5 : 1,
          }}
          disabled={autoPlay}
        >
          Move Employee
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-lg font-medium border"
          style={{
            background: 'var(--bg)',
            color: 'var(--g900)',
            borderColor: 'var(--g300)',
          }}
        >
          Reset
        </button>
        <div className="flex-1" />
        <div className="flex items-center gap-4">
          {autoPlay && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-mono" style={{ color: 'var(--g600)' }}>
                Auto-playing...
              </span>
            </div>
          )}
          <div className="text-sm font-mono" style={{ color: 'var(--g600)' }}>
            Employees: {orgData.stores.reduce((sum, s) => sum + s.employees.length, 0)}
          </div>
        </div>
      </div>

      <div className="flex-1">
        <AnimatedOrgChart ref={chartRef} data={orgData} />
      </div>
    </div>
  )
}
