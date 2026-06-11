'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { listItemVariants } from '@/lib/animations';

interface AnimatedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
  emptyMessage?: string;
  className?: string;
  staggerDelay?: number;
}

export function AnimatedList<T>({
  items,
  renderItem,
  keyExtractor,
  emptyMessage = 'No items found',
  className = '',
  staggerDelay = 0.1,
}: AnimatedListProps<T>) {
  return (
    <AnimatePresence mode="popLayout">
      {items.length === 0 ? (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-center py-12"
        >
          <p className="text-gray-400">{emptyMessage}</p>
        </motion.div>
      ) : (
        <motion.div
          className={className}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: staggerDelay,
              },
            },
          }}
        >
          {items.map((item, index) => (
            <motion.div
              key={keyExtractor(item)}
              variants={listItemVariants}
              exit={{ opacity: 0, x: -20 }}
              layout
            >
              {renderItem(item, index)}
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
