/**
 * d3-org-chart ships no TypeScript types. This module keeps `next build` strict
 * without shipping our own full API surface.
 */
declare module "d3-org-chart" {
  export class OrgChart {
    constructor()

    container(el: HTMLElement | string): this

    data(d: unknown[]): this

    render(): this

    initialExpandLevel(level: number): this

    nodeWidth(fn: () => number): this

    nodeHeight(fn: () => number): this

    layout(direction: string): this

    compact(flag: boolean): this

    nodeContent(fn: (d: { data: unknown }) => unknown): this

    fit(opts?: Record<string, unknown>): this

    setHighlighted(id: string): this

    clearHighlighting(): this
  }
}
