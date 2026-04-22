import type { D3OrgChartNode } from '../types'

/** Minimal flextree/hierarchy node shape after d3-org-chart layout */
export interface OrgChartFlexNode {
  data: D3OrgChartNode
  x: number
  y: number
  width: number
  height: number
  parent: OrgChartFlexNode | null
  children?: OrgChartFlexNode[]
}

export interface OrgChartAttrsLike {
  root: OrgChartFlexNode
  siblingsMargin: (node: OrgChartFlexNode) => number
  childrenMargin: (node: OrgChartFlexNode) => number
}

function walkDepthFirstPre(node: OrgChartFlexNode, fn: (n: OrgChartFlexNode) => void): void {
  fn(node)
  const ch = node.children
  if (!ch?.length) return
  for (const c of ch) walkDepthFirstPre(c, fn)
}

/**
 * Stack sibling employees vertically under each store while keeping their x aligned
 * with the store center. d3-flextree lays out same-depth siblings horizontally; this
 * pass runs immediately after flexTreeLayout().
 */
export function applyVerticalEmployeeLayout(root: OrgChartFlexNode, attrs: OrgChartAttrsLike): void {
  walkDepthFirstPre(root, (node) => {
    if (node.data.nodeType !== 'store' || !node.children?.length) return

    const employees = node.children.filter((c) => c.data.nodeType === 'employee')
    if (employees.length <= 1) return

    employees.sort((a, b) => a.data.id.localeCompare(b.data.id))

    const gap = attrs.siblingsMargin(node)
    const top = attrs.childrenMargin(node)
    let y = node.y + node.height + top

    for (const emp of employees) {
      emp.x = node.x
      emp.y = y
      y += emp.height + gap
    }
  })
}

const patchedOrgChartClasses = new WeakSet<object>()

export type OrgChartWithState = {
  getChartState: () => OrgChartAttrsLike & {
    flexTreeLayout: (root: OrgChartFlexNode) => unknown
  }
  update: (root: OrgChartFlexNode) => void
}

/** Patch once per imported OrgChart class — runs after each render when flexTreeLayout is recreated */
export function installVerticalEmployeeLayoutPatch(OrgChartClass: object): void {
  if (patchedOrgChartClasses.has(OrgChartClass)) return

  const proto = (OrgChartClass as { prototype: { render?: (...args: unknown[]) => unknown } }).prototype
  const originalRender = proto.render
  if (typeof originalRender !== 'function') return

  patchedOrgChartClasses.add(OrgChartClass)

  proto.render = function patchedRender(this: OrgChartWithState, ...args: unknown[]) {
    const result = originalRender.apply(this, args)

    const attrs = this.getChartState?.()
    if (!attrs?.flexTreeLayout || !attrs.root) return result

    const inner = attrs.flexTreeLayout
    attrs.flexTreeLayout = function wrappedFlexTreeLayout(root: OrgChartFlexNode) {
      const treeData = inner(root)
      applyVerticalEmployeeLayout(attrs.root, attrs)
      return treeData
    }

    this.update(attrs.root)
    return result
  }
}
