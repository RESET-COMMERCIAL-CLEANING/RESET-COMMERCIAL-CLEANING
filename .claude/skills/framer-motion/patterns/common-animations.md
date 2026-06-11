# Common Framer Motion Animation Patterns

## 1. Fade In/Out

### Simple Fade
```jsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

### Fade with Stagger (List Items)
```jsx
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
}

<motion.ul variants={containerVariants} initial="hidden" animate="show">
  {items.map((item) => (
    <motion.li key={item.id} variants={itemVariants}>
      {item.name}
    </motion.li>
  ))}
</motion.ul>
```

## 2. Slide In/Out

### Slide from Left
```jsx
<motion.div
  initial={{ x: -100, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  exit={{ x: -100, opacity: 0 }}
  transition={{ type: "spring", stiffness: 100 }}
>
  Content
</motion.div>
```

### Slide from Top
```jsx
<motion.div
  initial={{ y: -50, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  exit={{ y: -50, opacity: 0 }}
>
  Content
</motion.div>
```

## 3. Scale In/Out

### Pop In Effect
```jsx
<motion.div
  initial={{ scale: 0.8, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  exit={{ scale: 0.8, opacity: 0 }}
  transition={{ type: "spring", damping: 15, stiffness: 200 }}
>
  Content
</motion.div>
```

### Grow Animation
```jsx
<motion.div
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

## 4. Modal/Dialog

### Centered Modal with Backdrop
```jsx
<AnimatePresence>
  {isOpen && (
    <>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50"
      />
      <motion.div
        key="modal"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        {/* Modal content */}
      </motion.div>
    </>
  )}
</AnimatePresence>
```

## 5. Button Interactions

### Hover and Tap Effects
```jsx
<motion.button
  whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
>
  Click Me
</motion.button>
```

### Button with Icon Animation
```jsx
<motion.button
  className="flex items-center gap-2"
  whileHover="hover"
  initial="initial"
  animate="initial"
>
  <span>Subscribe</span>
  <motion.span
    variants={{
      initial: { x: 0 },
      hover: { x: 5 },
    }}
  >
    →
  </motion.span>
</motion.button>
```

## 6. List Animations

### Staggered List Entry
```jsx
const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1 },
}

<motion.ul
  variants={listVariants}
  initial="hidden"
  animate="visible"
>
  {items.map((item) => (
    <motion.li key={item.id} variants={itemVariants}>
      {item.name}
    </motion.li>
  ))}
</motion.ul>
```

### Reordering List
```jsx
<motion.li layout key={item.id}>
  {item.name}
</motion.li>
```

The `layout` prop animates position changes when list reorders.

## 7. Page Transitions

### Page Fade Transition
```jsx
<AnimatePresence mode="wait">
  <motion.div
    key={location.pathname}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
</AnimatePresence>
```

## 8. Drawer/Sidebar

### Slide-in Drawer
```jsx
<AnimatePresence>
  {isOpen && (
    <motion.div
      key="drawer"
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      exit={{ x: -300 }}
      transition={{ type: "spring", damping: 20 }}
      className="fixed left-0 top-0 h-screen w-80 bg-white"
    >
      {/* Drawer content */}
    </motion.div>
  )}
</AnimatePresence>
```

## 9. Tooltip

### Tooltip with Pointer
```jsx
<motion.div
  initial={{ opacity: 0, y: -10, pointerEvents: "none" }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -10, pointerEvents: "none" }}
  transition={{ duration: 0.2 }}
  className="bg-gray-900 text-white px-3 py-2 rounded"
>
  Tooltip text
</motion.div>
```

## 10. Loading Spinner

### Rotating Spinner
```jsx
<motion.div
  animate={{ rotate: 360 }}
  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
  className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
/>
```

### Pulsing Dot
```jsx
<motion.div
  animate={{ scale: [1, 1.2, 1] }}
  transition={{ duration: 1.5, repeat: Infinity }}
  className="w-3 h-3 bg-blue-500 rounded-full"
/>
```
