# Node Component Architecture

## Overview

All org chart node components now use a generic base component pattern where dimensions are controlled by the parent component via the centralized `NODE_DIMENSIONS` config.

## Architecture

### Base Components

1. **`BaseNode`** (non-animated)
   - Generic container with configurable dimensions
   - Hover effects for border color changes
   - Accepts children for content rendering
   - Configurable handle positions (source/target)

2. **`BaseAnimatedNode`** (animated)
   - Extends `BaseNode` with motion capabilities
   - Supports animation states: `isRecent`, `isHighlighted`
   - Motion effects: hover, tap, entrance, exit
   - NEW badge for recent nodes
   - Pulse effect for highlighted nodes

### Specific Node Implementations

Each node type (Organization, Store, Employee) is a thin wrapper that:

1. **Reads dimensions from config**:
   ```tsx
   const { width, height } = NODE_DIMENSIONS[NODE_TYPES.EMPLOYEE]
   ```

2. **Passes dimensions to base component**:
   ```tsx
   <BaseAnimatedNode
     data={data}
     width={width}
     height={height}
     hasSourceHandle={true}
     hasTargetHandle={true}
   >
     <EmployeeContent name={name} role={role} />
   </BaseAnimatedNode>
   ```

3. **Renders content component**:
   - `<OrganizationContent />`
   - `<StoreContent />`
   - `<EmployeeContent />`

## Benefits

- ✅ **Single source of truth** for dimensions in `config.ts`
- ✅ **Consistent styling** across all node types
- ✅ **Easier maintenance** - update base once, affects all nodes
- ✅ **Type-safe dimensions** from centralized config
- ✅ **Reusable base components** for future node types
- ✅ **Clear separation** between layout and content

## Configuration

All dimensions are managed in `/components/org-chart/config.ts`:

```typescript
export const NODE_DIMENSIONS = {
  [NODE_TYPES.ORGANIZATION]: { width: 240, height: 80 },
  [NODE_TYPES.STORE]: { width: 240, height: 80 },
  [NODE_TYPES.EMPLOYEE]: { width: 240, height: 80 },
} as const
```

**To change node sizes:**
1. Update `NODE_DIMENSIONS` in `config.ts`
2. All node components automatically use the new dimensions
3. No need to modify individual node files

## File Structure

```
components/org-chart/nodes/
├── base-node.tsx                    # Base non-animated component
├── base-animated-node.tsx           # Base animated component
├── organization-node.tsx            # Organization wrapper
├── animated-organization-node.tsx   # Animated org wrapper
├── store-node.tsx                   # Store wrapper
├── animated-store-node.tsx          # Animated store wrapper
├── employee-node.tsx                # Employee wrapper
├── animated-employee-node.tsx       # Animated employee wrapper
└── index.ts                         # Exports
```

## Handle Positions

### Dynamic Handle Positioning (v2.0)

Base components now support dynamic handle positions based on layout direction:

```typescript
// Vertical layout (DOWN/UP) - uses Top/Bottom handles
<BaseAnimatedNode direction="DOWN" hasSourceHandle hasTargetHandle>
  <Content />
</BaseAnimatedNode>

// Horizontal layout (RIGHT/LEFT) - uses Right/Left handles  
<BaseAnimatedNode direction="RIGHT" hasSourceHandle hasTargetHandle>
  <Content />
</BaseAnimatedNode>
```

**Default**: `direction="DOWN"` (as of v2.0)

### How It Works

The base components compute handle positions automatically:

```typescript
// In BaseAnimatedNode / BaseNode
const isVertical = direction === 'DOWN' || direction === 'UP'
const sourcePos = sourcePosition ?? (isVertical ? Position.Bottom : Position.Right)
const targetPos = targetPosition ?? (isVertical ? Position.Top : Position.Left)
```

### Explicit Override

You can still explicitly set handle positions if needed:

```typescript
<BaseNode
  direction="DOWN"
  sourcePosition={Position.Left}  // Override computed position
  targetPosition={Position.Right}
>
  <Content />
</BaseNode>
```

## Testing

All node components have unit tests verifying:
- Dimensions match config values
- Content renders correctly
- Handles are positioned properly (including dynamic positioning)
- Hover states work
- Animations trigger (for animated variants)
- Handle positions adapt to direction prop

Run tests: `npm test`

## Future Enhancements

This architecture makes it easy to:
- Add new node types by creating thin wrappers
- Implement theme-based dynamic sizing
- Support responsive node dimensions
- Create node variants without duplicating logic
- Support additional layout directions (diagonal, radial)
