'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatedOrgChart, type AnimatedOrgChartRef } from '@/components/org-chart/animated-org-chart'
import type { Employee, Organization, Store } from '@/lib/mock-org-data'
import { mockOrgData } from '@/lib/mock-org-data'

const DEMO_IDS = {
  tempEmployee: 'emp-demo-temp',
  tempStore: 'store-demo-coast',
  tempStoreEmployee: 'emp-demo-coast-1',
} as const

function cloneOrg(org: Organization): Organization {
  return structuredClone(org)
}

function addEmployee(org: Organization, storeId: string, employee: Employee): Organization {
  const next = cloneOrg(org)
  const store = next.stores.find((s) => s.id === storeId)
  if (store) store.employees.push(employee)
  return next
}

function addStore(org: Organization, store: Store): Organization {
  const next = cloneOrg(org)
  next.stores.push(store)
  return next
}

function removeEmployeeById(org: Organization, employeeId: string): Organization {
  const next = cloneOrg(org)
  for (const store of next.stores) {
    store.employees = store.employees.filter((e) => e.id !== employeeId)
  }
  return next
}

function removeStoreById(org: Organization, storeId: string): Organization {
  const next = cloneOrg(org)
  next.stores = next.stores.filter((s) => s.id !== storeId)
  return next
}

function moveEmployee(org: Organization, employeeId: string, toStoreId: string): Organization {
  const next = cloneOrg(org)
  let moved: Employee | undefined
  for (const s of next.stores) {
    const idx = s.employees.findIndex((e) => e.id === employeeId)
    if (idx >= 0) {
      moved = s.employees.splice(idx, 1)[0]
      break
    }
  }
  if (moved) {
    const target = next.stores.find((s) => s.id === toStoreId)
    if (target) target.employees.push(moved)
  }
  return next
}

export function OrgChartTestDemo() {
  const chartRef = useRef<AnimatedOrgChartRef>(null)

  const [org, setOrg] = useState<Organization>(() => cloneOrg(mockOrgData))
  const [caption, setCaption] = useState('Starting demo…')

  useEffect(() => {
    let cancelled = false

    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const pace = reducedMotion ? 1.65 : 1

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        setTimeout(() => resolve(), ms * pace)
      })

    const afterLayout = (fn: () => void) => {
      setTimeout(fn, 420 * pace)
    }

    async function runCycle() {
      if (cancelled) return

      setCaption('Resetting to baseline…')
      setOrg(cloneOrg(mockOrgData))
      await wait(1400)
      if (cancelled) return

      setCaption('Adding a new team member at Downtown…')
      setOrg((prev) =>
        addEmployee(prev, 'store-1', {
          id: DEMO_IDS.tempEmployee,
          name: 'Alex Rivera',
          role: 'Specialist',
          email: 'alex@avcd.com',
        }),
      )
      afterLayout(() => {
        if (!cancelled) chartRef.current?.markAsRecent(DEMO_IDS.tempEmployee)
      })

      await wait(4000)
      if (cancelled) return

      setCaption('Opening a new store with a lead…')
      setOrg((prev) =>
        addStore(prev, {
          id: DEMO_IDS.tempStore,
          name: 'Coast Pop-up',
          location: 'Long Beach, CA',
          employees: [
            {
              id: DEMO_IDS.tempStoreEmployee,
              name: 'Sam Lee',
              role: 'Lead',
              email: 'sam@avcd.com',
            },
          ],
        }),
      )
      afterLayout(() => {
        if (!cancelled) {
          chartRef.current?.markAsRecent(DEMO_IDS.tempStore)
          chartRef.current?.markAsRecent(DEMO_IDS.tempStoreEmployee)
        }
      })

      await wait(4400)
      if (cancelled) return

      setCaption('Moving Jane Smith from Downtown to Uptown…')
      chartRef.current?.highlightNode('store-1')
      chartRef.current?.highlightNode('store-2')
      await wait(500)
      if (cancelled) return

      setOrg((prev) => moveEmployee(prev, 'emp-2', 'store-2'))
      afterLayout(() => {
        if (!cancelled) chartRef.current?.markAsRecent('emp-2')
      })

      await wait(4400)
      if (cancelled) return

      setCaption('Removing the temporary hire…')
      setOrg((prev) => removeEmployeeById(prev, DEMO_IDS.tempEmployee))

      await wait(3400)
      if (cancelled) return

      setCaption('Closing the pop-up location…')
      setOrg((prev) => removeStoreById(prev, DEMO_IDS.tempStore))

      await wait(3400)
      if (cancelled) return

      setCaption('Restoring original org data…')
      setOrg(cloneOrg(mockOrgData))

      await wait(3000)
      if (cancelled) return

      setCaption('Repeating demo — adds, moves, removals, layout refresh.')
    }

    async function loop() {
      while (!cancelled) {
        await runCycle()
      }
    }

    void loop()

    return () => {
      cancelled = true
      chartRef.current?.clearAll()
    }
  }, [])

  return (
    <div
      className="flex flex-col"
      style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}
    >
      <div
        className="shrink-0 px-4 py-3 border-b flex flex-wrap items-center gap-3"
        style={{
          borderColor: 'var(--g200)',
          background: 'var(--bg)',
        }}
      >
        <span
          className="text-xs font-mono uppercase tracking-wide"
          style={{ color: 'var(--g500)' }}
        >
          Live demo
        </span>
        <p
          className="text-sm flex-1 min-w-[12rem]"
          style={{ color: 'var(--g800)' }}
          aria-live="polite"
        >
          {caption}
        </p>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <AnimatedOrgChart ref={chartRef} data={org} />
      </div>
    </div>
  )
}
