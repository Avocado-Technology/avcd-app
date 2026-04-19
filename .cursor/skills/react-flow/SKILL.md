# React Flow Development Skill

Library for building node-based UIs, interactive diagrams, and flowchart editors in React.

## Description

This skill provides comprehensive guidance for using **React Flow** (package: `@xyflow/react`) - a highly customizable React component for building node-based editors, workflow builders, data flow diagrams, and interactive visualizations.

## When to Use This Skill

Trigger this skill when:
- Building flowcharts, diagrams, or node-based interfaces
- Creating workflow editors or process visualizations
- Implementing org charts, dependency graphs, or mind maps
- Building visual programming interfaces
- Creating data pipelines or ETL visualizations
- User mentions: "react flow", "nodes", "edges", "flowchart", "diagram", "graph visualization"

## Core Concepts

### 1. **Nodes**
- React components that can be positioned and connected
- Can contain any React content (forms, charts, images)
- Support custom styling and interactions
- Dragable by default

### 2. **Edges**
- Connections between nodes
- Built-in types: `default` (bezier), `straight`, `step`, `smoothstep`
- Fully customizable with React components
- Support labels, markers, and animations

### 3. **Handles**
- Connection points on nodes
- Can be positioned anywhere on a node
- Support validation and custom connection logic
- Required for edges to connect

### 4. **Viewport**
- Container managing pan and zoom
- Coordinates: x, y, zoom
- Supports fit-to-view and programmatic control

## Installation

```bash
npm install @xyflow/react
```

**Note**: Modern package name is `@xyflow/react` (previously `reactflow` v10-11)

### Import Styles (Required)
```tsx
import '@xyflow/react/dist/style.css'
// or
import 'reactflow/dist/style.css'  // if using v11
```

## Basic Setup

### 1. Minimal Example
```tsx
import { ReactFlow } from '@xyflow/react'
import '@xyflow/react/dist/style.css'

const nodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
  { id: '2', position: { x: 200, y: 100 }, data: { label: 'Node 2' } },
]

const edges = [
  { id: 'e1-2', source: '1', target: '2' },
]

function Flow() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow nodes={nodes} edges={edges} />
    </div>
  )
}
```

### 2. Controlled Flow (Recommended)
```tsx
import { useState, useCallback } from 'react'
import { 
  ReactFlow, 
  useNodesState, 
  useEdgesState,
  addEdge,
  Connection,
  Edge
} from '@xyflow/react'

function ControlledFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )
  
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
    />
  )
}
```

## Custom Nodes

**CRITICAL**: Custom nodes **MUST** include Handle components to enable connections.

### 1. Create Custom Node Component
```tsx
import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'

interface CustomNodeData {
  label: string
  value: number
}

export const CustomNode = memo(({ data }: NodeProps<CustomNodeData>) => {
  return (
    <div className="custom-node">
      {/* REQUIRED: Handles for connections */}
      <Handle type="target" position={Position.Left} />
      
      <div>
        <h3>{data.label}</h3>
        <p>{data.value}</p>
      </div>
      
      <Handle type="source" position={Position.Right} />
    </div>
  )
})
```

### 2. Register Node Type
```tsx
const nodeTypes = {
  custom: CustomNode,
}

// Define outside component to prevent re-renders
function Flow() {
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
    />
  )
}
```

### 3. Use Custom Node
```tsx
const nodes = [
  {
    id: '1',
    type: 'custom',  // References nodeTypes key
    position: { x: 0, y: 0 },
    data: { label: 'Custom Node', value: 42 }
  }
]
```

## Handles (Connection Points)

**Required for edges to render!** Without handles, edges are invisible.

### Handle Types & Positions
```tsx
import { Handle, Position } from '@xyflow/react'

// Source handle (edges go OUT)
<Handle type="source" position={Position.Right} />

// Target handle (edges come IN)
<Handle type="target" position={Position.Left} />

// Positions: Top, Right, Bottom, Left
```

### Multiple Handles
```tsx
export const MultiHandleNode = () => (
  <div>
    <Handle type="target" position={Position.Left} id="a" />
    <Handle type="target" position={Position.Top} id="b" />
    
    <div>Node Content</div>
    
    <Handle type="source" position={Position.Right} id="c" />
    <Handle type="source" position={Position.Bottom} id="d" />
  </div>
)
```

### Styled Handles
```tsx
<Handle
  type="source"
  position={Position.Right}
  style={{
    background: '#555',
    width: 12,
    height: 12,
    border: '2px solid white'
  }}
/>
```

### Validation
```tsx
<Handle
  type="target"
  position={Position.Left}
  isValidConnection={(connection) => {
    // Only allow connections from specific source nodes
    return connection.source === 'node-1'
  }}
/>
```

## Node Configuration

### Node Object Structure
```tsx
interface Node {
  id: string
  type?: string
  position: { x: number, y: number }
  data: any
  
  // Optional properties
  draggable?: boolean
  selectable?: boolean
  connectable?: boolean
  deletable?: boolean
  
  // Styling
  style?: CSSProperties
  className?: string
  
  // Layout
  width?: number
  height?: number
  
  // Parent-child relationships
  parentNode?: string
  extent?: 'parent' | [[number, number], [number, number]]
  expandParent?: boolean
  
  // Z-index
  zIndex?: number
  
  // Hidden
  hidden?: boolean
}
```

### Built-in Node Types
```tsx
// Default node (simple box)
{ id: '1', type: 'default', data: { label: 'Default' } }

// Input node (only source handle)
{ id: '2', type: 'input', data: { label: 'Input' } }

// Output node (only target handle)
{ id: '3', type: 'output', data: { label: 'Output' } }
```

## Custom Edges

### 1. Create Custom Edge Component
```tsx
import { 
  BaseEdge, 
  EdgeLabelRenderer,
  getStraightPath,
  EdgeProps
} from '@xyflow/react'

export const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })
  
  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <button onClick={() => console.log(`Edge ${id} clicked`)}>
            ×
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  )
}
```

### 2. Register Edge Type
```tsx
const edgeTypes = {
  custom: CustomEdge,
}

<ReactFlow edgeTypes={edgeTypes} />
```

### 3. Use Custom Edge
```tsx
const edges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'custom'
  }
]
```

## Edge Configuration

### Edge Object Structure
```tsx
interface Edge {
  id: string
  source: string
  target: string
  
  // Optional
  type?: 'default' | 'straight' | 'step' | 'smoothstep' | 'custom'
  sourceHandle?: string  // For multiple handles
  targetHandle?: string
  
  // Styling
  animated?: boolean
  style?: CSSProperties
  className?: string
  
  // Markers (arrows)
  markerStart?: MarkerType
  markerEnd?: MarkerType
  
  // Labels
  label?: string | ReactNode
  labelStyle?: CSSProperties
  labelShowBg?: boolean
  labelBgStyle?: CSSProperties
  labelBgPadding?: [number, number]
  labelBgBorderRadius?: number
  
  // Interaction
  interactionWidth?: number
  selectable?: boolean
  deletable?: boolean
  
  // Z-index
  zIndex?: number
  
  // Hidden
  hidden?: boolean
  
  // Custom data
  data?: any
}
```

### Edge Types & Styling
```tsx
import { MarkerType } from '@xyflow/react'

const edges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#ff0000', strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#ff0000',
    },
    label: 'Edge Label',
  }
]
```

## Layout & Positioning

### Automatic Layout with Dagre
```tsx
import dagre from 'dagre'
import { Node, Edge } from '@xyflow/react'

function getLayoutedElements(nodes: Node[], edges: Edge[], direction = 'TB') {
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))
  dagreGraph.setGraph({ rankdir: direction })
  
  // Add nodes
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 172, height: 36 })
  })
  
  // Add edges
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target)
  })
  
  // Calculate layout
  dagre.layout(dagreGraph)
  
  // Apply positions
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id)
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - 172 / 2,
        y: nodeWithPosition.y - 36 / 2,
      },
    }
  })
  
  return { nodes: layoutedNodes, edges }
}
```

**Direction Options**: `'TB'` (top-bottom), `'LR'` (left-right), `'BT'`, `'RL'`

## Hooks & API

### useReactFlow Hook
```tsx
import { useReactFlow } from '@xyflow/react'

function Component() {
  const reactFlowInstance = useReactFlow()
  
  // Get all nodes/edges
  const nodes = reactFlowInstance.getNodes()
  const edges = reactFlowInstance.getEdges()
  
  // Get specific node
  const node = reactFlowInstance.getNode('node-1')
  
  // Viewport controls
  reactFlowInstance.fitView()
  reactFlowInstance.zoomIn()
  reactFlowInstance.zoomOut()
  reactFlowInstance.setCenter(x, y, zoom)
  
  // Programmatic updates
  reactFlowInstance.addNodes(newNodes)
  reactFlowInstance.addEdges(newEdges)
  reactFlowInstance.setNodes(nodes)
  reactFlowInstance.setEdges(edges)
  reactFlowInstance.deleteElements({ nodes: [{ id: '1' }] })
  
  // Convert coordinates
  reactFlowInstance.project({ x: 100, y: 100 })  // Screen to flow
  reactFlowInstance.flowToScreenPosition({ x: 0, y: 0 })  // Flow to screen
}
```

### useNodesState & useEdgesState
```tsx
import { useNodesState, useEdgesState } from '@xyflow/react'

const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

// Automatically handles:
// - Node dragging
// - Node selection
// - Node removal
// - Dimensions update
```

## Event Handlers

```tsx
<ReactFlow
  // Node events
  onNodeClick={(event, node) => {}}
  onNodeDoubleClick={(event, node) => {}}
  onNodeMouseEnter={(event, node) => {}}
  onNodeMouseLeave={(event, node) => {}}
  onNodeDragStart={(event, node) => {}}
  onNodeDrag={(event, node) => {}}
  onNodeDragStop={(event, node) => {}}
  
  // Edge events
  onEdgeClick={(event, edge) => {}}
  onEdgeDoubleClick={(event, edge) => {}}
  onEdgeMouseEnter={(event, edge) => {}}
  onEdgeMouseLeave={(event, edge) => {}}
  
  // Connection events
  onConnect={(connection) => {}}
  onConnectStart={(event, params) => {}}
  onConnectEnd={(event) => {}}
  
  // Selection events
  onSelectionChange={(elements) => {}}
  onSelectionDragStart={(event, nodes) => {}}
  onSelectionDrag={(event, nodes) => {}}
  onSelectionDragStop={(event, nodes) => {}}
  
  // Pane events
  onPaneClick={(event) => {}}
  onPaneScroll={(event) => {}}
  onPaneContextMenu={(event) => {}}
  
  // General events
  onInit={(reactFlowInstance) => {}}
  onMove={(event, viewport) => {}}
  onMoveStart={(event, viewport) => {}}
  onMoveEnd={(event, viewport) => {}}
/>
```

## Components

### Controls
```tsx
import { Controls } from '@xyflow/react'

<ReactFlow>
  <Controls 
    showZoom={true}
    showFitView={true}
    showInteractive={true}
  />
</ReactFlow>
```

### MiniMap
```tsx
import { MiniMap } from '@xyflow/react'

<ReactFlow>
  <MiniMap 
    nodeColor={(node) => node.style?.background || '#eee'}
    nodeStrokeWidth={3}
    zoomable
    pannable
  />
</ReactFlow>
```

### Background
```tsx
import { Background, BackgroundVariant } from '@xyflow/react'

<ReactFlow>
  <Background 
    variant={BackgroundVariant.Dots}
    gap={12}
    size={1}
    color="#ddd"
  />
</ReactFlow>
```

**Variants**: `Dots`, `Lines`, `Cross`

### Panel (Custom Overlays)
```tsx
import { Panel } from '@xyflow/react'

<ReactFlow>
  <Panel position="top-left">
    <button>Custom Action</button>
  </Panel>
  <Panel position="top-right">
    <div>Status: Active</div>
  </Panel>
</ReactFlow>
```

**Positions**: `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right`

## Props & Configuration

### ReactFlow Component Props
```tsx
<ReactFlow
  // Data
  nodes={nodes}
  edges={edges}
  defaultNodes={nodes}    // Uncontrolled
  defaultEdges={edges}    // Uncontrolled
  
  // Node/Edge types
  nodeTypes={nodeTypes}
  edgeTypes={edgeTypes}
  
  // Viewport
  defaultViewport={{ x: 0, y: 0, zoom: 1 }}
  minZoom={0.1}
  maxZoom={4}
  fitView={true}
  fitViewOptions={{ padding: 0.2 }}
  
  // Interaction
  panOnScroll={true}
  zoomOnScroll={true}
  zoomOnPinch={true}
  zoomOnDoubleClick={true}
  panOnDrag={true}
  selectionOnDrag={false}
  selectionMode={SelectionMode.Partial}
  
  // Node defaults
  nodesDraggable={true}
  nodesConnectable={true}
  nodesFocusable={true}
  
  // Edge defaults
  edgesUpdatable={true}
  edgesFocusable={true}
  
  // Connection
  connectionMode={ConnectionMode.Loose}  // or Strict
  connectionLineType="smoothstep"
  connectionLineStyle={{ stroke: '#ddd', strokeWidth: 2 }}
  
  // Deletion
  deleteKeyCode="Backspace"
  
  // Multi-selection
  multiSelectionKeyCode="Control"
  
  // Styling
  className="react-flow-container"
  style={{ background: '#f5f5f5' }}
  
  // Performance
  nodeExtent={[[0, 0], [1000, 1000]]}
  translateExtent={[[-Infinity, -Infinity], [Infinity, Infinity]]}
  
  // Accessibility
  elevateNodesOnSelect={true}
  disableKeyboardA11y={false}
  
  // Callbacks
  onNodesChange={onNodesChange}
  onEdgesChange={onEdgesChange}
  onConnect={onConnect}
  onInit={onInit}
  // ... (see Event Handlers above)
/>
```

## Common Patterns

### 1. Add Node Programmatically
```tsx
const addNode = () => {
  const newNode = {
    id: `node-${Date.now()}`,
    type: 'default',
    position: { x: Math.random() * 500, y: Math.random() * 500 },
    data: { label: 'New Node' },
  }
  setNodes((nds) => [...nds, newNode])
}
```

### 2. Update Node Data
```tsx
const updateNodeData = (nodeId: string, newData: any) => {
  setNodes((nds) =>
    nds.map((node) =>
      node.id === nodeId
        ? { ...node, data: { ...node.data, ...newData } }
        : node
    )
  )
}
```

### 3. Delete Selected Elements
```tsx
import { useKeyPress } from '@xyflow/react'

useKeyPress(['Backspace', 'Delete'], () => {
  const selectedNodes = nodes.filter((n) => n.selected)
  const selectedEdges = edges.filter((e) => e.selected)
  
  setNodes((nds) => nds.filter((n) => !n.selected))
  setEdges((eds) => eds.filter((e) => !e.selected))
})
```

### 4. Persist Flow State
```tsx
const onSave = () => {
  const flow = {
    nodes: nodes,
    edges: edges,
    viewport: reactFlowInstance.getViewport(),
  }
  localStorage.setItem('flow', JSON.stringify(flow))
}

const onRestore = () => {
  const flow = JSON.parse(localStorage.getItem('flow'))
  if (flow) {
    setNodes(flow.nodes)
    setEdges(flow.edges)
    reactFlowInstance.setViewport(flow.viewport)
  }
}
```

### 5. Disable Node Dragging for Interactive Elements
```tsx
// Add 'nodrag' class to prevent drag on interactive elements
<Handle type="source" position={Position.Right} />
<input className="nodrag" onChange={handleChange} />
<button className="nodrag" onClick={handleClick}>Click</button>
```

### 6. Connection Validation
```tsx
const isValidConnection = (connection: Connection) => {
  // Prevent self-connections
  if (connection.source === connection.target) return false
  
  // Prevent duplicate connections
  const exists = edges.some(
    (edge) => edge.source === connection.source && edge.target === connection.target
  )
  return !exists
}

<ReactFlow isValidConnection={isValidConnection} />
```

## Styling

### Global Styles
```css
/* Override React Flow defaults */
.react-flow__node {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
}

.react-flow__node.selected {
  border-color: #1a192b;
  box-shadow: 0 0 0 2px #1a192b;
}

.react-flow__handle {
  background: #555;
  width: 8px;
  height: 8px;
}

.react-flow__edge-path {
  stroke: #b1b1b7;
  stroke-width: 2;
}

.react-flow__edge.selected .react-flow__edge-path {
  stroke: #1a192b;
}
```

### Tailwind CSS Integration
```tsx
<div className="w-full h-screen bg-gray-50">
  <ReactFlow nodes={nodes} edges={edges}>
    <Background className="bg-gray-100" />
  </ReactFlow>
</div>
```

## Performance Optimization

### 1. Memoize Node Types
```tsx
const nodeTypes = useMemo(() => ({
  custom: CustomNode,
}), [])
```

### 2. Use React.memo for Custom Nodes
```tsx
export const CustomNode = memo(({ data }: NodeProps) => {
  // Component implementation
})
```

### 3. Optimize Large Graphs
```tsx
<ReactFlow
  nodes={nodes}
  edges={edges}
  onlyRenderVisibleElements={true}  // Virtualization
  nodeExtent={[[0, 0], [5000, 5000]]}  // Limit node movement
/>
```

## TypeScript Support

### Typed Nodes & Edges
```tsx
import { Node, Edge } from '@xyflow/react'

interface CustomNodeData {
  label: string
  value: number
}

type CustomNode = Node<CustomNodeData, 'custom'>

const nodes: CustomNode[] = [
  {
    id: '1',
    type: 'custom',
    position: { x: 0, y: 0 },
    data: { label: 'Node 1', value: 42 }
  }
]
```

### Typed NodeProps
```tsx
import { NodeProps } from '@xyflow/react'

interface MyNodeData {
  label: string
}

export const MyNode = ({ data }: NodeProps<MyNodeData>) => {
  return <div>{data.label}</div>
}
```

## Common Issues & Solutions

### Issue: Edges Not Showing
**Solution**: Add Handle components to custom nodes
```tsx
<Handle type="target" position={Position.Left} />
<Handle type="source" position={Position.Right} />
```

### Issue: Parent Container Has No Height
**Solution**: Set explicit height on container
```tsx
<div style={{ width: '100%', height: '500px' }}>
  <ReactFlow />
</div>
```

### Issue: Nodes Not Updating
**Solution**: Use controlled state with onNodesChange
```tsx
const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)

<ReactFlow nodes={nodes} onNodesChange={onNodesChange} />
```

### Issue: CSS Variables Not Working in Edge Styles
**Solution**: Use actual color values, not CSS variables
```tsx
// ❌ May not work
style: { stroke: 'var(--g400)' }

// ✅ Works
style: { stroke: '#737373' }
```

## Resources

- **Official Docs**: https://reactflow.dev/
- **API Reference**: https://reactflow.dev/api-reference
- **Examples**: https://reactflow.dev/examples
- **Learn**: https://reactflow.dev/learn
- **GitHub**: https://github.com/xyflow/xyflow
- **Discord**: https://discord.com/invite/Bqt6xrs

## Quick Reference

### Essential Imports
```tsx
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  Handle,
  Position,
  MarkerType,
  useNodesState,
  useEdgesState,
  useReactFlow,
  addEdge,
  Node,
  Edge,
  Connection,
  NodeProps,
  EdgeProps,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
```

---

**Last Updated**: April 2026  
**React Flow Version**: 11.x / @xyflow/react  
**Package**: `@xyflow/react` or `reactflow` (v11)
