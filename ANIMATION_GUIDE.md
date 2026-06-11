# Portal Animation Guide

This guide shows how to use the new animated components throughout the RESET portal pages.

## Quick Start

### 1. AnimatedStats - Dashboard Metrics

Use for displaying KPIs, metrics, and statistics with staggered animations.

```tsx
import { AnimatedStats } from '@/components/AnimatedStats';

export function Dashboard() {
  const stats = [
    {
      label: 'Active Contracts',
      value: 42,
      icon: <ContractIcon />,
      color: 'text-reset-green',
      change: '+12%'
    },
    // ... more stats
  ];

  return (
    <AnimatedStats
      stats={stats}
      title="Dashboard"
      description="Your key metrics at a glance"
    />
  );
}
```

**Features:**
- Staggered entrance animations
- Hover effects that lift cards
- Icon animations on hover
- Responsive grid layout
- Optional "change" indicator badges

**Use Cases:**
- Admin dashboard KPIs
- Client portal summaries
- Support team metrics
- Contract statistics

---

### 2. AnimatedList - Dynamic Lists

Use for ticket lists, job lists, or any dynamic list that adds/removes items smoothly.

```tsx
import { AnimatedList } from '@/components/AnimatedList';

export function TicketList({ tickets }) {
  return (
    <AnimatedList
      items={tickets}
      keyExtractor={(ticket) => ticket.id}
      renderItem={(ticket, index) => (
        <TicketCard ticket={ticket} />
      )}
      emptyMessage="No tickets found"
      staggerDelay={0.1}
    />
  );
}
```

**Features:**
- Smooth add/remove animations
- Staggered item entrance
- Empty state support
- Responsive layout support
- Customizable stagger delay

**Use Cases:**
- Support ticket lists
- Job/cleaning lists
- Contract lists
- Activity logs
- Comment threads

---

### 3. AnimatedSkeleton - Loading States

Use for professional loading placeholders while data is fetching.

```tsx
import { AnimatedSkeleton } from '@/components/AnimatedSkeleton';

export function LoadingDashboard() {
  return (
    <div className="space-y-8">
      <AnimatedSkeleton variant="text" count={1} />
      <AnimatedSkeleton variant="card" count={4} />
      <AnimatedSkeleton variant="list" count={5} />
    </div>
  );
}
```

**Variants:**
- `text`: Single line skeleton
- `card`: Large card placeholder
- `avatar`: Circular skeleton
- `list`: Full-width row skeleton

**Features:**
- Shimmer animation effect
- Customizable dimensions
- Multiple item support
- Responsive

**Use Cases:**
- Data loading states
- Page initial load
- Modal loading
- List placeholder

---

## Animation Utilities

Use the reusable animation variants from `lib/animations.ts`:

```tsx
import { 
  pageVariants,
  containerVariants,
  itemVariants,
  buttonHoverVariants,
  modalVariants,
  listItemVariants,
} from '@/lib/animations';
```

### Page Entrance/Exit
```tsx
<motion.div
  variants={pageVariants}
  initial="initial"
  animate="animate"
  exit="exit"
>
  Page content
</motion.div>
```

### Staggered Container
```tsx
<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
  {items.map(item => (
    <motion.div key={item.id} variants={itemVariants}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### Button Interactions
```tsx
<motion.button
  variants={buttonHoverVariants}
  whileHover="hover"
  whileTap="tap"
>
  Click me
</motion.button>
```

### Modal Animations
```tsx
<AnimatePresence>
  {isOpen && (
    <>
      <motion.div
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      />
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        Modal content
      </motion.div>
    </>
  )}
</AnimatePresence>
```

---

## Implementation Examples

### Example 1: Enhanced Ticket Dashboard

```tsx
'use client';

import { AnimatedStats } from '@/components/AnimatedStats';
import { AnimatedList } from '@/components/AnimatedList';
import { useState, useEffect } from 'react';

export default function TicketDashboard() {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch tickets...
  }, []);

  const stats = [
    {
      label: 'Open',
      value: tickets.filter(t => t.status === 'open').length,
      icon: <AlertIcon />,
      color: 'text-yellow-400',
    },
    {
      label: 'Resolved',
      value: tickets.filter(t => t.status === 'resolved').length,
      icon: <CheckIcon />,
      color: 'text-green-400',
    },
    // ... more stats
  ];

  if (isLoading) {
    return <AnimatedSkeleton variant="card" count={4} />;
  }

  return (
    <div className="space-y-12">
      <AnimatedStats
        stats={stats}
        title="Ticket Dashboard"
        description="Real-time support metrics"
      />

      <AnimatedList
        items={tickets}
        keyExtractor={(t) => t.id}
        renderItem={(ticket) => (
          <TicketCard ticket={ticket} />
        )}
        emptyMessage="No tickets to display"
      />
    </div>
  );
}
```

### Example 2: Contract Management Portal

```tsx
import { AnimatedStats } from '@/components/AnimatedStats';
import { AnimatedList } from '@/components/AnimatedList';

export default function ContractPortal() {
  const stats = [
    {
      label: 'Active',
      value: activeContracts.length,
      icon: <CheckCircleIcon />,
      color: 'text-reset-green',
      change: '+3 this month',
    },
    {
      label: 'Pending',
      value: pendingContracts.length,
      icon: <ClockIcon />,
      color: 'text-blue-400',
    },
    {
      label: 'Completed',
      value: completedContracts.length,
      icon: <TrendingUpIcon />,
      color: 'text-purple-400',
    },
    {
      label: 'Total Value',
      value: `$${totalValue.toLocaleString()}`,
      icon: <DollarIcon />,
      color: 'text-amber-400',
    },
  ];

  return (
    <div className="space-y-12">
      <AnimatedStats
        stats={stats}
        title="Contract Overview"
        description="All your active and completed contracts"
      />

      <div className="grid md:grid-cols-2 gap-8">
        <section>
          <h3 className="text-2xl font-bold mb-6">Active Contracts</h3>
          <AnimatedList
            items={activeContracts}
            keyExtractor={(c) => c.id}
            renderItem={(contract) => (
              <ContractCard contract={contract} />
            )}
          />
        </section>

        <section>
          <h3 className="text-2xl font-bold mb-6">Pending Approval</h3>
          <AnimatedList
            items={pendingContracts}
            keyExtractor={(c) => c.id}
            renderItem={(contract) => (
              <ContractCard contract={contract} status="pending" />
            )}
          />
        </section>
      </div>
    </div>
  );
}
```

---

## Best Practices

### 1. **Use whileInView for Performance**
```tsx
<AnimatedStats
  stats={stats}
  // Stats will only animate when they come into view
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
/>
```

### 2. **Respect User Preferences**
```tsx
import { useReducedMotion } from 'framer-motion';

export function Component() {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      animate={{ opacity: 1 }}
      transition={shouldReduce ? { duration: 0 } : { duration: 0.5 }}
    />
  );
}
```

### 3. **Keep Animations Brief**
- Page transitions: 200-400ms
- List items: 100-300ms
- Hover effects: 100-200ms
- Modal entrance: 200-300ms

### 4. **Test on Mobile**
- Animations are smoother on modern browsers
- Consider disabling on very low-end devices
- Test touch interactions thoroughly

---

## Next Steps

1. **Replace admin dashboard stats** with `<AnimatedStats>`
2. **Replace ticket lists** with `<AnimatedList>`
3. **Add loading states** with `<AnimatedSkeleton>`
4. **Enhance buttons** with `buttonHoverVariants`
5. **Add page transitions** with `pageVariants`

---

## Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Animation Patterns](./lib/animations.ts)
- [Component Code](./components/)

---

*Last Updated: June 11, 2026*
