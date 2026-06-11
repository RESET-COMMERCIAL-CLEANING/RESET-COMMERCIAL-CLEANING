# Framer Motion Skill for Claude Code

This skill provides comprehensive guidance for building smooth, performant animations using Framer Motion in React/Next.js applications.

## 📁 Structure

```
framer-motion/
├── SKILL.md                    # Main skill documentation
├── README.md                   # This file
├── components/
│   └── AnimatePresence.tsx    # Reference AnimatePresence implementation
├── patterns/
│   ├── common-animations.md   # 10+ common animation patterns
│   ├── best-practices.md      # Performance & accessibility tips
│   └── quick-reference.md     # Quick API reference
└── docs/
    └── (Additional resources)
```

## 🚀 Quick Start

### For Motion Components
When you want to animate something, reference:
- **Quick patterns**: `patterns/common-animations.md`
- **API reference**: `patterns/quick-reference.md`

### For Performance Issues
When animations are janky or slow:
- Check `patterns/best-practices.md#performance-optimization`
- Verify you're animating only `opacity`, `x`, `y`, `rotate`, `scale`
- Use DevTools Performance tab to identify bottlenecks

### For Accessibility
When ensuring reduced-motion support:
- Use `useReducedMotion()` hook
- Check `patterns/best-practices.md#accessibility`

## 💡 Key Patterns

### Exit Animations
```jsx
<AnimatePresence>
  {visible && <motion.div exit={{ opacity: 0 }} />}
</AnimatePresence>
```

### Staggered Lists
```jsx
<motion.ul variants={{ hidden: { opacity: 0 }, visible: { staggerChildren: 0.1 } }}>
  {items.map((item) => (
    <motion.li key={item.id} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
      {item}
    </motion.li>
  ))}
</motion.ul>
```

### Interactive Elements
```jsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Click me
</motion.button>
```

## 📊 Animation Complexity Guide

### Simple (100-150ms)
- Fade in/out
- Button hover effects
- Icon animations
- Tooltip slides

### Medium (200-400ms)
- Modal entrance/exit
- Dialog animations
- List item transitions
- Sidebar slides

### Complex (500-1000ms)
- Page transitions
- Multi-step sequences
- Parallax effects
- Orchestrated animations

## 🎯 When to Use This Skill

Use this skill when:
- ✅ Building enter/exit animations
- ✅ Creating interactive UI components
- ✅ Animating list changes or reordering
- ✅ Building gesture-based animations (drag, swipe)
- ✅ Optimizing animation performance
- ✅ Implementing accessible animations
- ✅ Creating page transitions

Don't use this for:
- ❌ Complex 3D graphics (use Three.js instead)
- ❌ Video-like animations (use video element)
- ❌ Chart animations (use D3.js or Recharts)

## 🔧 RESET Project Integration

### Current Usage
The RESET project has Framer Motion 10.16.4 installed and can use it in:
- Portal pages for user interface animations
- Contract/Schedule components for list animations
- Modal transitions for dialogs
- Button interactions for better UX

### Recommended First Use
1. Enhance portal page transitions with fade-in effects
2. Add staggered list animations to contract/schedule lists
3. Improve button interactions with hover/tap effects
4. Smooth modal open/close transitions

## 📚 Learning Resources

### In This Skill
- `SKILL.md` - Comprehensive documentation
- `patterns/common-animations.md` - Ready-to-use patterns
- `patterns/best-practices.md` - Performance & accessibility
- `patterns/quick-reference.md` - API cheat sheet
- `components/AnimatePresence.tsx` - Reference implementation

### Official Resources
- [Framer Motion Official Docs](https://www.framer.com/motion/)
- [Examples Gallery](https://www.framer.com/motion/examples/)
- [API Reference](https://www.framer.com/motion/animation/)

## ⚡ Performance Checklist

Before shipping animations:
- [ ] Only animating `opacity`, `x`, `y`, `rotate`, `scale`?
- [ ] Using `transform` instead of positioning?
- [ ] Using `scale` instead of width/height?
- [ ] Respecting `prefers-reduced-motion`?
- [ ] No more than 3-5 simultaneous animations?
- [ ] Using spring for natural feel or tween for predictable?
- [ ] Tested on mobile devices?
- [ ] Checked DevTools Performance tab (no janky frames)?

## 🐛 Troubleshooting

### Animations are Janky
→ Check `patterns/best-practices.md#performance-optimization`

### Exit animations not working
→ Ensure `AnimatePresence` wraps the conditionally rendered elements

### Elements jump position
→ Use `layout` or `layoutId` props

### Animation lags on mobile
→ Reduce animation complexity or disable on low-end devices

### Animation ignores my CSS
→ Framer Motion values override CSS; use inline styles or motion values

## 🤝 Contributing

When you discover new patterns or optimizations:
1. Document in `patterns/`
2. Add to quick reference if commonly used
3. Update SKILL.md if it changes core guidance

---

**Version**: Framer Motion ^10.16.4  
**Last Updated**: 2026-06-11  
**Skill Status**: ✅ Ready for production use
