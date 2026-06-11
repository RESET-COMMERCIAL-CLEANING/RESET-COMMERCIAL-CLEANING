# Framer Motion Best Practices

## Performance Optimization

### 1. Animate Only Transform and Opacity
**Good** - Uses GPU acceleration:
```jsx
<motion.div
  animate={{ x: 100, opacity: 0.5 }}
/>
```

**Avoid** - Triggers layout recalculation:
```jsx
<motion.div
  animate={{ width: 200, left: 50 }}
/>
```

### 2. Use `transform` Instead of Positioning
```jsx
// ✅ Good - Uses GPU, smooth performance
<motion.div animate={{ x: 100, y: 50 }} />

// ❌ Bad - Forces layout recalculation
<motion.div animate={{ left: 100, top: 50 }} />
```

### 3. Use Scale Instead of Dimensions
```jsx
// ✅ Good - High performance
<motion.div animate={{ scale: 1.5 }} />

// ❌ Bad - Triggers layout shifts
<motion.div animate={{ width: 300, height: 300 }} />
```

## Animation Timing

### 1. Choose Appropriate Durations
- **UI interactions** (hover, click): 100-300ms
- **Dialog/modal open**: 200-400ms
- **Page transitions**: 300-500ms
- **Complex sequences**: 600-1000ms

### 2. Use Spring for Natural Feel
```jsx
<motion.div
  animate={{ x: 100 }}
  transition={{
    type: "spring",
    stiffness: 100,    // Higher = snappier
    damping: 10,       // Higher = less bouncy
    mass: 1            // Higher = heavier
  }}
/>
```

### 3. Use Easing for Predictable Timing
```jsx
<motion.div
  animate={{ x: 100 }}
  transition={{
    type: "tween",
    duration: 0.5,
    ease: "easeInOut"  // or custom easings
  }}
/>
```

## Accessibility

### 1. Always Respect `prefers-reduced-motion`
```jsx
import { useReducedMotion } from "framer-motion"

export function Button() {
  const shouldReduce = useReducedMotion()

  return (
    <motion.button
      whileHover={shouldReduce ? {} : { scale: 1.05 }}
      transition={shouldReduce ? { duration: 0 } : { duration: 0.2 }}
    >
      Click me
    </motion.button>
  )
}
```

### 2. Ensure Readability During Animation
- Don't animate text in ways that make it hard to read
- Fade in text before other animations
- Use clear entry points for content

### 3. Support Keyboard Navigation
```jsx
<motion.button
  onKeyDown={(e) => {
    if (e.key === "Enter") handleClick()
  }}
  whileHover={{ scale: 1.05 }}
>
  Submit
</motion.button>
```

## Layout Animations

### 1. Use `layoutId` for Shared Layout Animations
```jsx
// Smooth transition between different layouts
<motion.div layoutId="box" />
// Later in a different component:
<motion.div layoutId="box" /> // Animates position smoothly
```

### 2. Use `layout` Prop for Responsive Changes
```jsx
// Animates size changes gracefully
<motion.div layout className={isMobile ? "w-full" : "w-1/2"} />
```

### 3. Avoid Layout Shifts with `layoutDependency`
```jsx
<motion.div
  layout
  layoutDependency={[items.length]}
  transition={{ type: "spring", damping: 20 }}
>
  {/* Content */}
</motion.div>
```

## Children and Variants

### 1. Use Variants for Complex Animations
```jsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

<motion.div variants={containerVariants} initial="hidden" animate="visible">
  {items.map((item) => (
    <motion.div key={item.id} variants={childVariants}>
      {item.name}
    </motion.div>
  ))}
</motion.div>
```

### 2. Stagger Children Effectively
```jsx
transition={{
  staggerChildren: 0.1,     // Delay between each child
  delayChildren: 0.2,       // Delay before first child
  type: "spring"
}}
```

## Common Pitfalls

### 1. Forgetting Keys in Lists
```jsx
// ❌ Bad - Missing keys
<AnimatePresence>
  {items.map((item) => (
    <motion.div>  {/* No key! */}
      {item.name}
    </motion.div>
  ))}
</AnimatePresence>

// ✅ Good - Keys present
<AnimatePresence>
  {items.map((item) => (
    <motion.div key={item.id}>
      {item.name}
    </motion.div>
  ))}
</AnimatePresence>
```

### 2. Animating Width/Height
```jsx
// ❌ Bad - Causes layout thrashing
animate={{ height: 200 }}

// ✅ Good - Use scaleY with origin
animate={{ scaleY: 0.5 }}
style={{ originY: 0 }}
```

### 3. Too Many Simultaneous Animations
- Limit to 3-5 simultaneous animations
- Use staggering to spread animations over time
- Monitor performance with DevTools

### 4. Missing onAnimationComplete Cleanup
```jsx
<motion.div
  animate={{ x: 100 }}
  onAnimationComplete={() => {
    // Cleanup or next step
    setIsAnimating(false)
  }}
/>
```

## Responsive Animations

### 1. Adjust Animations Based on Screen Size
```jsx
const isMobile = useMediaQuery("(max-width: 768px)")

<motion.div
  animate={{ x: isMobile ? 50 : 100 }}
  transition={{ duration: isMobile ? 0.5 : 0.3 }}
/>
```

### 2. Disable Animations on Low-End Devices
```jsx
const prefersReducedMotion = useReducedMotion()
const isLowEnd = navigator.deviceMemory < 4

const shouldAnimate = !prefersReducedMotion && !isLowEnd

<motion.div
  animate={shouldAnimate ? { x: 100 } : {}}
/>
```

## Testing Animations

### 1. Mock Framer Motion for Unit Tests
```tsx
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children }: any) => children,
  },
  AnimatePresence: ({ children }: any) => children,
}))
```

### 2. Use Cypress for Visual Testing
```javascript
// Verify animation completes
cy.get("[data-testid=animated-element]")
  .should("have.css", "transform", "matrix(...)")
```

## Debugging

### 1. Visualize Animation Frames
```jsx
<motion.div
  animate={{ x: 100 }}
  transition={{ duration: 2 }}
  onUpdate={(latest) => console.log(latest)}
/>
```

### 2. Use Browser DevTools
- Slow down animations: DevTools → More tools → Rendering → Animations
- Inspect computed styles during animation
- Check performance tab for janky frames

### 3. Check for Layout Thrashing
- Use Chrome DevTools Performance tab
- Look for recalculate style and layout repaints
- Minimize property changes during animation
