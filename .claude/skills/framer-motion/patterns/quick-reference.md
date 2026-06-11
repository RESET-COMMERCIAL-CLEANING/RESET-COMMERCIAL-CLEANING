# Framer Motion Quick Reference

## Import
```jsx
import { motion, AnimatePresence } from "framer-motion"
```

## Motion Elements
```jsx
<motion.div />
<motion.span />
<motion.button />
<motion.img />
// Any HTML element with motion. prefix
```

## Core Props

### Animation States
```jsx
<motion.div
  initial={{ opacity: 0 }}      // Starting state
  animate={{ opacity: 1 }}      // Target state
  exit={{ opacity: 0 }}         // On unmount
/>
```

### Interactions
```jsx
<motion.button
  whileHover={{ scale: 1.05 }}  // While hovering
  whileTap={{ scale: 0.95 }}    // While clicking
  whileDrag={{ opacity: 0.5 }}  // While dragging
/>
```

### Dragging
```jsx
<motion.div
  drag                          // Enable dragging
  dragElastic={0.2}            // Bounce after drag
  dragConstraints={{ top: 0, left: 0, bottom: 100, right: 100 }}
  onDragEnd={(event, info) => {}}
/>
```

## Transitions

### Tween (Linear)
```jsx
transition={{ type: "tween", duration: 0.5, ease: "easeInOut" }}
```

### Spring (Natural)
```jsx
transition={{
  type: "spring",
  stiffness: 100,  // 0-500, higher = snappier
  damping: 10,     // 0-100, higher = less bouncy
  mass: 1          // > 0, higher = heavier
}}
```

### Inertia (After drag)
```jsx
transition={{
  type: "inertia",
  velocity: 50,
  power: 0.8,
  timeConstant: 200
}}
```

## Variants Pattern
```jsx
const variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 }
}

<motion.div
  variants={variants}
  initial="hidden"
  animate="visible"
  exit="exit"
>
  Content
</motion.div>
```

## Common Transitions

### Durations
- Fast: 100-200ms
- Medium: 300-400ms
- Slow: 500-800ms

### Easing Functions
```jsx
ease: "linear"        // Constant speed
ease: "easeIn"       // Accelerate
ease: "easeOut"      // Decelerate
ease: "easeInOut"    // Accelerate then decelerate
ease: "circIn"       // Circular
ease: "backIn"       // Overshoot
ease: "anticipate"   // Anticipate motion
ease: [0.17, 0.67, 0.83, 0.67]  // Custom cubic bezier
```

## Layout Animations
```jsx
<motion.div layout />           // Animate position/size changes
<motion.div layoutId="shared"/> // Shared layout animation
```

## Presence (Exit Animations)
```jsx
<AnimatePresence>
  {isVisible && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      Animated removal
    </motion.div>
  )}
</AnimatePresence>
```

### AnimatePresence Props
```jsx
<AnimatePresence
  mode="wait"              // "sync" | "wait"
  onExitComplete={() => {}} // Callback when all exit
  presenceAffectsLayout   // Default: true
/>
```

## Stagger Children
```jsx
<motion.ul
  variants={{
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,    // Delay per child
        delayChildren: 0.3       // Initial delay
      }
    }
  }}
>
  {items.map((item) => (
    <motion.li key={item.id}>
      {item}
    </motion.li>
  ))}
</motion.ul>
```

## Common Animations

### Fade
```jsx
animate={{ opacity: 1 }}
```

### Scale
```jsx
animate={{ scale: 1.2 }}
```

### Slide (Left)
```jsx
animate={{ x: 100 }}
```

### Slide (Top)
```jsx
animate={{ y: -50 }}
```

### Rotate
```jsx
animate={{ rotate: 360 }}
```

### Pop
```jsx
animate={{ scale: 1 }}
initial={{ scale: 0.8, opacity: 0 }}
```

### Blur
```jsx
animate={{ filter: "blur(0px)" }}
initial={{ filter: "blur(10px)" }}
```

## Hooks

### useAnimation
```jsx
const controls = useAnimation()
controls.start({ opacity: 1 })
<motion.div animate={controls} />
```

### useTransform
```jsx
const x = useMotionValue(0)
const opacity = useTransform(x, [-100, 0, 100], [0, 1, 0])
<motion.div style={{ x, opacity }} />
```

### useScroll
```jsx
const { scrollY } = useScroll()
const opacity = useTransform(scrollY, [0, 300], [1, 0])
```

### useReducedMotion
```jsx
const shouldReduce = useReducedMotion()
<motion.div animate={shouldReduce ? {} : { scale: 1.1 }} />
```

## Callbacks
```jsx
<motion.div
  onAnimationStart={() => console.log("start")}
  onAnimationComplete={() => console.log("done")}
  onHoverStart={() => console.log("hover start")}
  onHoverEnd={() => console.log("hover end")}
  onTap={() => console.log("tapped")}
  onDragEnd={() => console.log("drag done")}
/>
```

## Performance Tips
✅ Animate: opacity, x, y, rotate, scale  
❌ Don't animate: width, height, left, top  
✅ Use: transform  
❌ Don't use: positioning  
✅ Set: initialBrowser, skipAnimations for mobile  
❌ Don't: create too many simultaneous animations
