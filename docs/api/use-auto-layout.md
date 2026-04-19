# useAutoLayout Hook

Auto-layout hook for React Flow using ELK.js. Automatically positions nodes in a graph layout when nodes are initialized or changed.

## Usage

```typescript
import { useAutoLayout } from '@/lib/hooks/useAutoLayout'

function MyComponent() {
  const { applyAutoLayout } = useAutoLayout({
    direction: 'RIGHT',
    nodeSpacing: 80,
    layerSpacing: 150
  })
  
  // Auto-layout runs on mount and when nodes/edges change
  // Manually trigger: applyAutoLayout()
}
```

## Parameters

### `options?: ElkLayoutOptions`

Optional configuration object for the ELK layout algorithm.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `direction` | `'RIGHT' \| 'DOWN' \| 'LEFT' \| 'UP'` | `'RIGHT'` | Layout direction |
| `nodeSpacing` | `number` | `80` | Horizontal spacing between nodes |
| `layerSpacing` | `number` | `150` | Vertical spacing between layers |
| `algorithm` | `'layered' \| 'force' \| 'stress'` | `'layered'` | Layout algorithm |
| `edgeRouting` | `'ORTHOGONAL' \| 'POLYLINE'` | `'ORTHOGONAL'` | Edge routing strategy |
| `returnOriginalOnError` | `boolean` | `false` | Return original positions on error |

## Returns

### `{ applyAutoLayout: () => Promise<void> }`

Returns an object with the `applyAutoLayout` function for manually triggering layout recalculation.

## When to Use

✅ **Use when:**
- Building dynamic organization charts with changing data
- Nodes are added/removed programmatically
- Layout needs to recalculate on data changes
- Building interactive node-based editors

❌ **Don't use when:**
- Layout is static and never changes
- You need custom positioning logic
- Performance is critical and changes happen in real-time (use debouncing)

## Examples

### Basic Usage

```typescript
function OrgChart({ data }) {
  const [nodes, setNodes] = useNodesState([])
  const [edges, setEdges] = useEdgesState([])
  
  const { applyAutoLayout } = useAutoLayout({
    direction: 'RIGHT',
    nodeSpacing: 80
  })
  
  // Layout runs automatically when nodes are initialized
  return <ReactFlow nodes={nodes} edges={edges} />
}
```

### Manual Triggering

```typescript
function OrgChart({ data }) {
  const { applyAutoLayout } = useAutoLayout()
  
  const handleAddNode = (newNode) => {
    setNodes(prev => [...prev, newNode])
    // Manually trigger re-layout
    applyAutoLayout()
  }
  
  return (
    <div>
      <button onClick={() => handleAddNode(createNode())}>
        Add Node
      </button>
      <ReactFlow nodes={nodes} edges={edges} />
    </div>
  )
}
```

### With Custom Options

```typescript
function CompactOrgChart() {
  const { applyAutoLayout } = useAutoLayout({
    direction: 'DOWN',
    nodeSpacing: 40,
    layerSpacing: 80,
    edgeRouting: 'POLYLINE'
  })
  
  return <ReactFlow nodes={nodes} edges={edges} />
}
```

## Important Notes

### 1. Requires ReactFlowProvider

This hook must be used inside a component wrapped by `ReactFlowProvider`:

```typescript
import { ReactFlowProvider } from 'reactflow'

function App() {
  return (
    <ReactFlowProvider>
      <MyOrgChart />
    </ReactFlowProvider>
  )
}
```

### 2. Runs on Node Initialization

The layout runs automatically when `useNodesInitialized()` returns `true`. You don't need to call `applyAutoLayout()` on mount.

### 3. Async Operation

Layout calculation is asynchronous. If you need to perform actions after layout completes, use:

```typescript
const { applyAutoLayout } = useAutoLayout()

await applyAutoLayout()
// Layout complete, safe to perform actions
```

### 4. fitView Animation

The hook automatically calls `fitView({ duration: 800 })` after layout with a 100ms delay to ensure smooth animation.

### 5. Cleanup

The hook automatically cleans up timeouts on unmount. No manual cleanup needed.

## Performance Considerations

### Large Graphs

For graphs with 100+ nodes, consider:

```typescript
// Debounce rapid changes
const debouncedApplyLayout = useMemo(
  () => debounce(applyAutoLayout, 300),
  [applyAutoLayout]
)
```

### Real-time Updates

If nodes change frequently (e.g., live data), consider:
- Increasing debounce delay
- Only re-layout on significant changes
- Using incremental layout updates

## Error Handling

The hook logs errors to console but doesn't throw. To handle errors:

```typescript
const { applyAutoLayout } = useAutoLayout({
  returnOriginalOnError: true // Fallback to original positions
})
```

## See Also

- [applyElkLayout API](./apply-elk-layout.md)
- [ELK Layout Troubleshooting](../troubleshooting/elk-layout.md)
- [Migration Guide](../migrations/dagre-to-elk.md)
