# Motion Animation Library Skill

Production-grade animation library for React, JavaScript, and Vue (formerly Framer Motion).

## Description

This skill provides comprehensive guidance for using **Motion** - a modern animation library with a hybrid engine that runs at 120fps using native browser APIs (Web Animations API, ScrollTimeline) with JavaScript fallbacks for advanced physics and gestures.

## When to Use This Skill

Trigger this skill when:
- Adding animations, transitions, or micro-interactions
- Creating scroll-based effects (parallax, scroll-triggered animations)
- Implementing gestures (hover, tap, drag)
- Building layout animations or shared element transitions
- Animating SVG paths or elements
- User mentions: "animate", "motion", "framer motion", "transition", "gesture", "scroll animation"

## Core Concepts

### 1. **Hybrid Animation Engine**
- **Native**: Uses Web Animations API + ScrollTimeline for 120fps
- **JavaScript Fallback**: For spring physics, interruptible keyframes, gesture tracking
- **Performance**: Hardware-accelerated, same performance as CSS animations

### 2. **Declarative API**
- Animations linked directly to React state and props
- No imperative animation management
- Automatic cleanup and optimization

### 3. **Production Ready**
- TypeScript-first
- Tree-shakable (import only what you need)
- Trusted by Framer, Figma (30M+ downloads/month)

## Installation

```bash
npm install motion
```

### Import Path
```tsx
// ✅ Motion for React
import { motion } from "motion/react"

// ❌ OLD (Framer Motion) - Don't use
import { motion } from "framer-motion"
```

**Migration Note**: If migrating from Framer Motion, change imports from `framer-motion` to `motion/react`.

## The `motion` Component

The foundation of Motion for React. Prefix any HTML/SVG element with `motion.` to enable animations:

```tsx
<motion.div />
<motion.button />
<motion.svg />
<motion.path />
```

### Core Animation Props

| Prop | Purpose | Example |
|------|---------|---------|
| `animate` | Target animation state | `animate={{ x: 100 }}` |
| `initial` | Starting state | `initial={{ opacity: 0 }}` |
| `exit` | Exit animation | `exit={{ opacity: 0 }}` |
| `transition` | Animation config | `transition={{ duration: 0.3 }}` |
| `whileHover` | Hover state | `whileHover={{ scale: 1.1 }}` |
| `whileTap` | Tap/click state | `whileTap={{ scale: 0.95 }}` |
| `whileFocus` | Focus state | `whileFocus={{ outline: "2px solid blue" }}` |
| `whileDrag` | Dragging state | `whileDrag={{ scale: 1.1 }}` |
| `whileInView` | In-viewport state | `whileInView={{ opacity: 1 }}` |
| `drag` | Enable dragging | `drag="x"` or `drag={true}` |

## Animation Patterns

### 1. Basic Animation
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Fades in and slides up
</motion.div>
```

### 2. Spring Physics (Default for Physical Properties)
```tsx
// x, y, scale, rotate use springs by default
<motion.div animate={{ x: 100 }} />

// Customize spring
<motion.div
  animate={{ x: 100 }}
  transition={{
    type: "spring",
    stiffness: 260,
    damping: 20
  }}
/>
```

### 3. Tween Animations (Default for Visual Properties)
```tsx
// opacity, backgroundColor use tweens by default
<motion.div
  animate={{ opacity: 1 }}
  transition={{
    duration: 0.3,
    ease: "easeInOut"
  }}
/>
```

### 4. Keyframes
```tsx
<motion.div
  animate={{
    scale: [1, 1.2, 1.2, 1, 1],
    rotate: [0, 0, 180, 180, 0]
  }}
  transition={{
    duration: 2,
    times: [0, 0.2, 0.5, 0.8, 1]
  }}
/>
```

## Gestures

Motion provides cross-platform, accessible gesture handlers:

### Hover Animation
```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  onHoverStart={() => console.log("hover started")}
  onHoverEnd={() => console.log("hover ended")}
>
  Hover me
</motion.button>
```

### Tap Animation
```tsx
<motion.button
  whileTap={{ scale: 0.95 }}
  onTap={() => console.log("tapped")}
>
  Tap me
</motion.button>
```

### Drag
```tsx
// Drag anywhere
<motion.div drag>
  Drag me
</motion.div>

// Drag on specific axis
<motion.div drag="x">
  Drag horizontally
</motion.div>

// Drag with constraints
<motion.div
  drag
  dragConstraints={{ left: 0, right: 300, top: 0, bottom: 300 }}
  dragElastic={0.1}
>
  Drag with bounds
</motion.div>
```

### Drag with State
```tsx
<motion.div
  drag
  whileDrag={{ scale: 1.1, cursor: "grabbing" }}
  onDragStart={() => console.log("drag start")}
  onDrag={(event, info) => console.log(info.point)}
  onDragEnd={() => console.log("drag end")}
/>
```

## Scroll Animations

### 1. Scroll-Triggered (whileInView)
Animates when element enters viewport:

```tsx
<motion.div
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 0.6 }}
>
  Fades in on scroll
</motion.div>
```

**Options**:
- `once: true` - Animate only once
- `amount: 0.3` - Trigger when 30% visible
- `margin: "-100px"` - Offset viewport trigger point

### 2. Scroll-Linked (useScroll)
Directly links animation to scroll position:

```tsx
import { useScroll, motion } from "motion/react"

function Component() {
  const { scrollYProgress } = useScroll()
  
  return (
    <motion.div style={{ scaleX: scrollYProgress }} />
  )
}
```

**useScroll Options**:
```tsx
const { scrollY, scrollYProgress } = useScroll({
  target: ref,           // Scroll container ref
  offset: ["start end", "end start"]  // When to start/end
})
```

### 3. Parallax Effect
```tsx
import { useScroll, useTransform, motion } from "motion/react"

function Parallax() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 1000], [0, -300])
  
  return (
    <motion.div style={{ y }}>
      Parallax content
    </motion.div>
  )
}
```

## Layout Animations

Automatically animates layout changes (size, position, reorder):

### Basic Layout Animation
```tsx
<motion.div layout>
  {/* Changes to this element's layout will animate */}
</motion.div>
```

### Shared Element Transitions
```tsx
// On Page 1
<motion.div layoutId="hero-image">
  <img src="..." />
</motion.div>

// On Page 2 (same layoutId)
<motion.div layoutId="hero-image">
  <img src="..." />
</motion.div>
```

### Layout Group (for coordinated animations)
```tsx
import { LayoutGroup } from "motion/react"

<LayoutGroup>
  <motion.div layout />
  <motion.div layout />
</LayoutGroup>
```

### Prevent Scale Distortion
```tsx
<motion.div layout>
  <motion.div layout="position">
    {/* This won't scale, only repositions */}
  </motion.div>
</motion.div>
```

## Exit Animations

Use `AnimatePresence` to animate elements as they leave the DOM:

```tsx
import { motion, AnimatePresence } from "motion/react"

<AnimatePresence>
  {isVisible && (
    <motion.div
      key="modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      Modal content
    </motion.div>
  )}
</AnimatePresence>
```

### Exit with Multiple Children
```tsx
<AnimatePresence>
  {items.map(item => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {item.name}
    </motion.div>
  ))}
</AnimatePresence>
```

### Wait for Exit Before Entering
```tsx
<AnimatePresence mode="wait">
  {/* Only one child will be mounted at a time */}
</AnimatePresence>
```

## SVG Animations

Motion has first-class SVG support:

### Path Drawing
```tsx
<motion.svg>
  <motion.path
    d="M..."
    initial={{ pathLength: 0 }}
    animate={{ pathLength: 1 }}
    transition={{ duration: 2 }}
  />
</motion.svg>
```

### SVG Properties
```tsx
<motion.circle
  cx={50}
  cy={50}
  r={20}
  animate={{
    cx: 100,
    fill: "#ff0000",
    pathLength: 1
  }}
/>
```

### ViewBox Animation
```tsx
<motion.svg
  animate={{ viewBox: "0 0 200 200" }}
  transition={{ duration: 1 }}
/>
```

## Variants System

Organize complex animations with variants:

```tsx
const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
}

<motion.div
  variants={variants}
  initial="hidden"
  animate="visible"
>
  Content
</motion.div>
```

### Orchestration with Variants
```tsx
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

<motion.ul variants={container} initial="hidden" animate="visible">
  <motion.li variants={item}>Item 1</motion.li>
  <motion.li variants={item}>Item 2</motion.li>
  <motion.li variants={item}>Item 3</motion.li>
</motion.ul>
```

## Hooks API

### useMotionValue
Create animated values independent of React state:

```tsx
import { useMotionValue, motion } from "motion/react"

const x = useMotionValue(0)

<motion.div style={{ x }} drag="x" />
```

### useTransform
Transform one motion value into another:

```tsx
import { useMotionValue, useTransform } from "motion/react"

const x = useMotionValue(0)
const opacity = useTransform(x, [-100, 0, 100], [0, 1, 0])

<motion.div style={{ x, opacity }} drag="x" />
```

### useSpring
Smooth out motion values with spring physics:

```tsx
import { useMotionValue, useSpring } from "motion/react"

const x = useMotionValue(0)
const springX = useSpring(x, { stiffness: 100, damping: 10 })

<motion.div style={{ x: springX }} />
```

### useScroll
Track scroll position:

```tsx
const { scrollY, scrollYProgress } = useScroll()

// scrollY: absolute pixels
// scrollYProgress: 0 to 1
```

### useInView
Detect when element is in viewport:

```tsx
import { useInView } from "motion/react"
import { useRef } from "react"

const ref = useRef(null)
const isInView = useInView(ref, { once: true })

<div ref={ref}>
  {isInView ? "In view!" : "Not in view"}
</div>
```

### useAnimate
Imperative animations (use sparingly):

```tsx
import { useAnimate } from "motion/react"

const [scope, animate] = useAnimate()

function handleClick() {
  animate(scope.current, { rotate: 360 })
}

<div ref={scope} onClick={handleClick}>Click me</div>
```

## Performance Optimization

### 1. LazyMotion (Reduce Bundle Size)
```tsx
import { LazyMotion, domAnimation, m } from "motion/react"

<LazyMotion features={domAnimation}>
  <m.div animate={{ x: 100 }} />
</LazyMotion>
```

### 2. MotionConfig (Global Defaults)
```tsx
import { MotionConfig } from "motion/react"

<MotionConfig transition={{ duration: 0.3, ease: "easeOut" }}>
  {/* All child animations inherit these defaults */}
</MotionConfig>
```

### 3. useReducedMotion Hook
Respect user preferences:

```tsx
import { useReducedMotion } from "motion/react"

const shouldReduceMotion = useReducedMotion()

<motion.div
  animate={{
    x: shouldReduceMotion ? 0 : 100
  }}
/>
```

### 4. Transform vs Layout
```tsx
// ✅ FAST: Transforms (x, y, scale, rotate) are GPU-accelerated
<motion.div animate={{ x: 100 }} />

// ❌ SLOW: Layout properties trigger reflow
<motion.div animate={{ left: "100px" }} />
```

## Common Patterns

### 1. Stagger Children
```tsx
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}
```

### 2. Repeat Animation
```tsx
<motion.div
  animate={{ rotate: 360 }}
  transition={{
    repeat: Infinity,
    duration: 2,
    ease: "linear"
  }}
/>
```

### 3. Sequence Animations
```tsx
<motion.div
  animate={{
    x: [0, 100, 100, 0],
    opacity: [0, 1, 1, 0]
  }}
  transition={{
    duration: 2,
    times: [0, 0.3, 0.7, 1]
  }}
/>
```

### 4. Path Morphing
```tsx
<motion.path
  d={isOpen ? openPath : closedPath}
  transition={{ duration: 0.3 }}
/>
```

### 5. Number Counter Animation
```tsx
import { useMotionValue, useTransform, motion } from "motion/react"
import { animate } from "motion"
import { useEffect } from "react"

function Counter({ to }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, Math.round)
  
  useEffect(() => {
    const animation = animate(count, to, { duration: 2 })
    return animation.stop
  }, [to])
  
  return <motion.span>{rounded}</motion.span>
}
```

## Transition Types

### Spring (Physical Properties)
```tsx
transition={{
  type: "spring",
  stiffness: 100,    // Higher = faster
  damping: 10,       // Higher = less bouncy
  mass: 1            // Higher = slower
}}
```

### Tween (Visual Properties)
```tsx
transition={{
  duration: 0.3,
  ease: "easeInOut"  // or [0.4, 0, 0.2, 1] (cubic bezier)
}}
```

### Inertia (Momentum-based)
```tsx
transition={{
  type: "inertia",
  velocity: 50,
  power: 0.8
}}
```

## Accessibility

### Respect Reduced Motion
```tsx
import { MotionConfig } from "motion/react"

<MotionConfig reducedMotion="user">
  {/* Automatically disables animations if user prefers reduced motion */}
</MotionConfig>
```

### Focus Visible
```tsx
<motion.button
  whileFocus={{ outline: "2px solid blue" }}
>
  Accessible button
</motion.button>
```

## Integration Examples

### With Next.js
```tsx
"use client"  // Client component required

import { motion } from "motion/react"

export default function AnimatedPage() {
  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
}
```

### With Tailwind CSS
```tsx
<motion.div
  className="bg-blue-500 p-4"
  whileHover={{ scale: 1.05 }}
/>
```

### With shadcn/ui
```tsx
import { Button } from "@/components/ui/button"
import { motion } from "motion/react"

const MotionButton = motion.create(Button)

<MotionButton whileHover={{ scale: 1.05 }}>
  Animated Button
</MotionButton>
```

## Troubleshooting

### Animation Not Working
1. Check component is wrapped in `<motion.x>` not `<x>`
2. Verify values are animatable (numbers, colors, etc.)
3. Ensure component is visible in DOM

### Exit Animation Not Running
1. Wrap in `<AnimatePresence>`
2. Ensure elements have unique `key` prop
3. Check conditional rendering logic

### Performance Issues
1. Use transforms (x, y, scale, rotate) instead of layout properties
2. Enable LazyMotion for tree-shaking
3. Reduce number of animated elements
4. Check for unnecessary re-renders

## Resources

- **Official Docs**: https://motion.dev/docs
- **React Guide**: https://motion.dev/docs/react
- **Examples**: https://motion.dev/examples
- **Tutorials**: https://motion.dev/tutorials
- **GitHub**: https://github.com/motiondivision/motion
- **Migration Guide**: https://motion.dev/docs/react-upgrade-guide

## Quick Reference

### Essential Imports
```tsx
import {
  motion,                 // Core component
  AnimatePresence,        // Exit animations
  LayoutGroup,            // Layout coordination
  LazyMotion,             // Bundle optimization
  MotionConfig,           // Global config
  useAnimate,             // Imperative API
  useInView,              // Viewport detection
  useMotionValue,         // Animated values
  useScroll,              // Scroll tracking
  useSpring,              // Spring smoothing
  useTransform,           // Value transformation
} from "motion/react"
```

---

**Last Updated**: April 2026  
**Motion Version**: 12.x (latest)  
**Package**: `motion` (formerly `framer-motion`)
