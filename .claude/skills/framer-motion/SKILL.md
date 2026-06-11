# Framer Motion Skill

Advanced animation framework for React components. This skill provides patterns, best practices, and component examples for creating smooth, performant animations using Framer Motion.

## What This Skill Provides

### Core Animations
- **Exit Animations**: AnimatePresence for animated unmounting
- **Layout Animations**: Smooth position/size transitions
- **Gesture Animations**: Drag, hover, and tap interactions
- **Keyframe Animations**: Complex multi-step sequences
- **Spring Physics**: Natural, bouncy animations

### Design Patterns
- Modal transitions
- Sidebar animations
- List item entrance/exit
- Page transitions
- Staggered children animations
- Morphing shapes

### Best Practices
- Performance optimization (GPU acceleration)
- Accessibility considerations
- Mobile gesture support
- Reduced motion preferences
- Layout shift prevention

## Quick Start

### Basic Animation
```jsx
import { motion } from "framer-motion"

export function MyComponent() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      Content
    </motion.div>
  )
}
```

### With AnimatePresence
```jsx
import { motion, AnimatePresence } from "framer-motion"

export function List({ items }) {
  return (
    <AnimatePresence>
      {items.map(item => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
        >
          {item.name}
        </motion.div>
      ))}
    </AnimatePresence>
  )
}
```

## Key Components

### AnimatePresence
Handles exit animations for components being removed from the DOM.

**Props:**
- `mode`: "sync" (default) or "wait" - controls animation timing
- `initial`: Show initial animation (default: true)
- `onExitComplete`: Callback when all exits complete
- `presenceAffectsLayout`: Whether exit affects layout (default: true)

### motion.* Elements
`motion.div`, `motion.span`, `motion.button`, etc.

**Props:**
- `initial`: Starting animation state
- `animate`: Target animation state
- `exit`: State when unmounting
- `transition`: Animation timing (duration, delay, ease, etc.)
- `whileHover`, `whileTap`, `whileDrag`: Gesture states
- `layoutId`: For shared layout animations

## Common Patterns

### Staggered List
```jsx
<motion.ul>
  <motion.li variants={itemVariants} initial="hidden" animate="show">
    Item 1
  </motion.li>
</motion.ul>
```

### Drag & Drop
```jsx
<motion.div
  drag
  dragElastic={0.2}
  onDragEnd={(event, info) => {
    // Handle drop
  }}
/>
```

### Gesture Animations
```jsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Click me
</motion.button>
```

### Conditional Presence
```jsx
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

## Performance Tips

1. Use `layoutId` for shared layout animations instead of individual transitions
2. Enable GPU acceleration with `will-change` in Tailwind
3. Use `MotionConfig` to set global animation defaults
4. Limit simultaneous animations on complex components
5. Use `transform` and `opacity` for best performance
6. Avoid animating dimensions - use scale instead

## Accessibility

Always respect user preferences:
```jsx
import { useReducedMotion } from "framer-motion"

export function Component() {
  const shouldReduceMotion = useReducedMotion()
  
  return (
    <motion.div
      animate={{ opacity: 1 }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5 }}
    >
      Content
    </motion.div>
  )
}
```

## Documentation
- [Official Docs](https://www.framer.com/motion/)
- [API Reference](https://www.framer.com/motion/animation/)
- [Examples Gallery](https://www.framer.com/motion/examples/)

## Version
Framer Motion ^10.16.4 (installed in project)
