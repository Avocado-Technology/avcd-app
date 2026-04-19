# ELK Layout Troubleshooting

Common issues and solutions when using ELK.js for graph layout.

## Module Not Found: elkjs

### Error
```
Cannot find module 'elkjs' or 'elkjs/lib/elk.bundled.js'
```

### Solution
Install elkjs package:
```bash
npm install elkjs
```

### Verify Installation
```bash
npm list elkjs
```

Should show:
```
└── elkjs@0.x.x
```

---

## Layout Doesn't Update When Data Changes

### Symptoms
- Nodes don't reposition after data update
- Graph appears frozen
- fitView doesn't center new nodes

### Solutions

#### 1. Ensure ReactFlowProvider is Present

```typescript
// ❌ Missing provider
function App() {
  return <MyOrgChart />
}

// ✅ Correct
import { ReactFlowProvider } from 'reactflow'

function App() {
  return (
    <ReactFlowProvider>
      <MyOrgChart />
    </ReactFlowProvider>
  )
}
```

#### 2. Check useNodesInitialized

The `useAutoLayout` hook only runs when nodes are initialized:

```typescript
import { useNodesInitialized } from 'reactflow'

const nodesInitialized = useNodesInitialized()
console.log('Nodes initialized:', nodesInitialized) // Should be true
```

#### 3. Verify Data Dependencies

Ensure useEffect dependencies include the data:

```typescript
useEffect(() => {
  const layoutData = async () => {
    const rawNodes = transformOrgToNodes(data)
    // ...
  }
  layoutData()
}, [data]) // ✅ data is in dependencies
```

---

## Nodes Overlap or Spacing is Wrong

### Symptoms
- Nodes appear too close together
- Nodes overlap edges
- Layout looks cramped

### Solutions

#### 1. Check NODE_DIMENSIONS Config

Ensure dimensions match actual rendered sizes:

```typescript
// components/org-chart/config.ts
export const NODE_DIMENSIONS = {
  organizationNode: { width: 280, height: 80 },
  storeNode: { width: 240, height: 70 },
  employeeNode: { width: 180, height: 60 }
}
```

#### 2. Adjust Spacing Options

```typescript
await applyElkLayout(nodes, edges, {
  nodeSpacing: 100,    // Increase from 80
  layerSpacing: 200,   // Increase from 150
})
```

#### 3. Use Measured Dimensions

Let React Flow measure actual node sizes:

```typescript
// Nodes will have measured property after rendering
const node = {
  id: 'node-1',
  measured: { width: 250, height: 85 }, // Actual rendered size
  // ...
}
```

---

## Performance Degradation with Large Graphs

### Symptoms
- Slow layout calculation (> 2 seconds)
- UI freezes during layout
- Browser becomes unresponsive

### Solutions

#### 1. Add Debouncing

Prevent excessive re-layouts:

```typescript
import { debounce } from 'lodash'

const debouncedLayout = useMemo(
  () => debounce(applyAutoLayout, 500),
  [applyAutoLayout]
)

// Use debouncedLayout instead of applyAutoLayout
```

#### 2. Increase Spacing (Faster Calculation)

```typescript
await applyElkLayout(nodes, edges, {
  nodeSpacing: 100,   // Larger spacing = faster calculation
  layerSpacing: 200,
})
```

#### 3. Consider Pagination

For 500+ nodes, implement virtual scrolling or pagination:

```typescript
const NODES_PER_PAGE = 100

function PaginatedOrgChart({ allNodes }) {
  const [page, setPage] = useState(0)
  const visibleNodes = allNodes.slice(
    page * NODES_PER_PAGE,
    (page + 1) * NODES_PER_PAGE
  )
  
  return <ReactFlow nodes={visibleNodes} />
}
```

#### 4. Use Web Workers (Advanced)

Offload layout calculation to a worker thread:

```typescript
// elk-worker.ts
import ELK from 'elkjs/lib/elk.bundled.js'

self.onmessage = async (e) => {
  const elk = new ELK()
  const layout = await elk.layout(e.data)
  self.postMessage(layout)
}
```

---

## Tests Fail with "ELK is not defined"

### Error
```
ReferenceError: ELK is not defined
TypeError: ELK is not a constructor
```

### Solution

#### 1. Add ELK Mock to jest.setup.js

```javascript
// jest.setup.js
jest.mock('elkjs/lib/elk.bundled.js', () => {
  return class MockELK {
    async layout(graph) {
      // Return positioned graph
      return {
        id: graph.id,
        children: graph.children.map((child, i) => ({
          ...child,
          x: i * 200,
          y: i * 100
        })),
        edges: graph.edges
      }
    }
  }
})
```

#### 2. Update jest.config.js

```javascript
// jest.config.js
transformIgnorePatterns: [
  'node_modules/(?!(@auth0|jose|elkjs)/)',
],
```

---

## TypeScript Errors: Property 'measured' does not exist

### Error
```
Property 'measured' does not exist on type 'Node'
```

### Solution

Create interface extending Node:

```typescript
interface NodeWithMeasured extends Node {
  measured?: {
    width?: number
    height?: number
  }
}

const nodeWithMeasured = node as NodeWithMeasured
const width = nodeWithMeasured.measured?.width ?? 180
```

---

## Layout Appears Rotated or Mirrored

### Symptoms
- Graph flows in unexpected direction
- Edges point the wrong way

### Solution

Check direction option. As of v2.0, the default is `'DOWN'` (vertical):

```typescript
// Default is DOWN (vertical)
await applyElkLayout(nodes, edges)

// To use horizontal layout
await applyElkLayout(nodes, edges, {
  direction: 'RIGHT'
})
```

Valid directions: `'RIGHT'`, `'DOWN'`, `'LEFT'`, `'UP'`

**Common Issue**: If you see horizontal layout but expected vertical, check if `direction: 'RIGHT'` is explicitly set somewhere.

---

## Async/Await Issues

### Error
```
await is only valid in async function
```

### Solution

Wrap in async function:

```typescript
useEffect(() => {
  const layoutData = async () => {
    const layouted = await applyElkLayout(nodes, edges)
    setNodes(layouted)
  }
  layoutData()
}, [nodes, edges, setNodes])
```

---

## Debug Mode

Enable ELK debug logging:

```typescript
const elk = new ELK({
  defaultLayoutOptions: {
    'elk.debugMode': 'true',
    'elk.logging.logLevel': 'DEBUG'
  }
})
```

---

## Performance Profiling

Measure layout performance:

```typescript
const start = performance.now()
const layouted = await applyElkLayout(nodes, edges)
const duration = performance.now() - start

console.log(`Layout took ${duration}ms`)

// Alert if > 2 seconds
if (duration > 2000) {
  console.warn('Layout is slow, consider optimization')
}
```

---

## Common Patterns

### Fallback to Original Positions

```typescript
try {
  const layouted = await applyElkLayout(nodes, edges)
  setNodes(layouted)
} catch (error) {
  console.error('Layout failed:', error)
  // Use original positions
  setNodes(nodes)
}
```

### Retry with Different Options

```typescript
try {
  const layouted = await applyElkLayout(nodes, edges, {
    algorithm: 'layered'
  })
  setNodes(layouted)
} catch (error) {
  // Retry with simpler algorithm
  const layouted = await applyElkLayout(nodes, edges, {
    algorithm: 'force'
  })
  setNodes(layouted)
}
```

---

## Getting Help

If issues persist:

1. Check [ELK Documentation](https://www.eclipse.org/elk/)
2. Review [React Flow Examples](https://reactflow.dev/examples)
3. Search [GitHub Issues](https://github.com/kieler/elkjs/issues)
4. Post in [React Flow Discord](https://discord.gg/RVmnytFmGW)

Include in bug reports:
- Node/edge count
- ELK options used
- Browser/environment
- Error messages
- Minimal reproduction
