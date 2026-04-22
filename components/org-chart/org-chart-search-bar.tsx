'use client'

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { Organization } from '@/lib/mock-org-data'
import {
  buildOrgSearchIndex,
  filterOrgSearchHits,
  orgSearchKindLabel,
  type OrgSearchHit,
} from './utils/org-search'

export interface OrgChartSearchBarProps {
  organization: Organization
  /** Called when the user picks a row (by node id in the chart data) */
  onSelectNode: (nodeId: string) => void
}

export function OrgChartSearchBar({
  organization,
  onSelectNode,
}: OrgChartSearchBarProps) {
  const inputId = useId()
  const listboxId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const allHits = useMemo(
    () => buildOrgSearchIndex(organization),
    [organization]
  )

  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const filtered = useMemo(
    () => filterOrgSearchHits(allHits, query),
    [allHits, query]
  )

  useEffect(() => {
    setActiveIndex(0)
  }, [query, filtered.length])

  const choose = useCallback(
    (hit: OrgSearchHit) => {
      onSelectNode(hit.id)
      setQuery(hit.label)
      setOpen(false)
      inputRef.current?.blur()
    },
    [onSelectNode]
  )

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [])

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open || filtered.length === 0) {
      if (e.key === 'ArrowDown' && allHits.length > 0) {
        setOpen(true)
      }
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const hit = filtered[activeIndex]
      if (hit) choose(hit)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const showMatches = open && filtered.length > 0
  const showEmpty =
    open && query.trim().length > 0 && filtered.length === 0

  return (
    <label
      htmlFor={inputId}
      className="relative flex w-full min-w-0 shrink-0 flex-col gap-1"
    >
      <span className="sr-only">Search organization, stores, or employees</span>
      <div ref={containerRef} className="relative w-full min-w-0">
        <Input
          ref={inputRef}
          id={inputId}
          type="search"
          role="combobox"
          aria-expanded={showMatches || showEmpty}
          aria-controls={listboxId}
          aria-activedescendant={
            showMatches ? `${listboxId}-opt-${activeIndex}` : undefined
          }
          autoComplete="off"
          placeholder="Search organization, stores, people…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className={cn(
            'w-full min-w-0 border-[var(--g500)] bg-[var(--bg)] text-sm'
          )}
        />
        {showMatches ? (
          <ul
            id={listboxId}
            role="listbox"
            className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[min(18rem,calc(100dvh-10rem))] overflow-auto rounded-md border border-[var(--g200)] bg-[var(--bg)] py-1 shadow-none"
          >
            {filtered.map((hit, i) => (
              <li
                key={hit.id}
                id={`${listboxId}-opt-${i}`}
                role="option"
                aria-selected={i === activeIndex}
                className={cn(
                  'flex min-h-[44px] cursor-pointer flex-col justify-center px-3 py-2 text-sm md:min-h-0',
                  i === activeIndex ? 'bg-[var(--g100)]' : ''
                )}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseDown={(e) => {
                  e.preventDefault()
                  choose(hit)
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="min-w-0 flex-1 truncate font-medium text-[var(--g900)]">
                    {hit.label}
                  </span>
                  <span className="shrink-0 rounded border border-[var(--g200)] px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-[var(--g500)]">
                    {orgSearchKindLabel(hit.kind)}
                  </span>
                </div>
                {hit.subtitle ? (
                  <div className="mt-0.5 truncate font-mono text-xs text-[var(--g500)]">
                    {hit.subtitle}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}
        {showEmpty ? (
          <div
            role="status"
            className="absolute left-0 right-0 top-full z-50 mt-1 rounded-md border border-[var(--g200)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--g500)]"
          >
            No matches
          </div>
        ) : null}
      </div>
    </label>
  )
}
