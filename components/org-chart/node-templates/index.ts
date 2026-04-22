import type { D3OrgChartNode } from '../types'

/** Minimal XSS-safe escaping for HTML text nodes */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'U'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

function stateClasses(node: D3OrgChartNode): string {
  const parts = ['avcd-org-node']
  if (node.isRecent) parts.push('avcd-org-node--recent')
  if (node.isHighlighted) parts.push('avcd-org-node--highlighted')
  return parts.join(' ')
}

/** Building2-style icon (lucide) */
const ICON_ORG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>`

/** Store icon */
const ICON_STORE = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg>`

export function renderOrganizationNodeContent(node: D3OrgChartNode): string {
  const name = escapeHtml(node.name)
  return `<div class="${stateClasses(node)}" style="display:flex;align-items:center;gap:12px;padding:8px 12px;font-family:system-ui,sans-serif;background:var(--g50,#fafafa);border:1px solid var(--g200,#e2e8f0);border-radius:8px;box-sizing:border-box;">
    <div style="display:flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:8px;background:var(--g100,#f1f5f9);color:var(--g700,#334155);flex-shrink:0;">${ICON_ORG}</div>
    <h3 style="margin:0;font-size:1.125rem;font-weight:600;color:var(--g900,#0f172a);flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${name}</h3>
  </div>`
}

export function renderStoreNodeContent(node: D3OrgChartNode): string {
  const name = escapeHtml(node.name)
  const loc = escapeHtml(node.location ?? '')
  const count = node.employeeCount ?? 0
  const empLabel = count === 1 ? 'employee' : 'employees'
  return `<div class="${stateClasses(node)}" style="padding:8px 12px;font-family:system-ui,sans-serif;background:var(--g50,#fafafa);border:1px solid var(--g200,#e2e8f0);border-radius:8px;box-sizing:border-box;">
    <div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:8px;">
      <div style="display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:4px;background:var(--g100,#f1f5f9);color:var(--g700,#334155);flex-shrink:0;">${ICON_STORE}</div>
      <h4 style="margin:0;font-size:1rem;font-weight:500;color:var(--g900,#0f172a);flex:1;">${name}</h4>
    </div>
    <p style="margin:0;font-family:ui-monospace,monospace;font-size:0.75rem;color:var(--g500,#64748b);">${loc}</p>
    <p style="margin:4px 0 0;font-family:ui-monospace,monospace;font-size:0.75rem;color:var(--g500,#64748b);">${count} ${empLabel}</p>
  </div>`
}

export function renderEmployeeNodeContent(node: D3OrgChartNode): string {
  const name = escapeHtml(node.name)
  const role = escapeHtml(node.role ?? '')
  const initials = escapeHtml(initialsFromName(node.name))
  return `<div class="${stateClasses(node)}" style="display:flex;align-items:center;gap:12px;padding:8px 12px;font-family:system-ui,sans-serif;background:var(--g50,#fafafa);border:1px solid var(--g200,#e2e8f0);border-radius:8px;box-sizing:border-box;">
    <div data-testid="employee-avatar" style="display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:9999px;background:var(--g100,#f1f5f9);color:var(--g700,#334155);font-size:0.75rem;font-weight:500;flex-shrink:0;">${initials}</div>
    <div style="flex:1;min-width:0;">
      <div style="font-weight:500;font-size:0.875rem;color:var(--g900,#0f172a);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${name}</div>
      <div style="font-family:ui-monospace,monospace;font-size:0.75rem;color:var(--g500,#64748b);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${role}</div>
    </div>
  </div>`
}

export function renderNodeContent(node: D3OrgChartNode): string {
  switch (node.nodeType) {
    case 'organization':
      return renderOrganizationNodeContent(node)
    case 'store':
      return renderStoreNodeContent(node)
    case 'employee':
      return renderEmployeeNodeContent(node)
    default:
      return `<div class="${stateClasses(node)}" style="padding:8px;border:1px solid var(--g200,#e2e8f0);border-radius:8px;">${escapeHtml(node.name)}</div>`
  }
}
