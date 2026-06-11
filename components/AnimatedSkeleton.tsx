'use client';

import { motion } from 'framer-motion';

interface AnimatedSkeletonProps {
  width?: string | number;
  height?: string | number;
  count?: number;
  circle?: boolean;
  className?: string;
  variant?: 'text' | 'card' | 'avatar' | 'list';
}

export function AnimatedSkeleton({
  width = '100%',
  height = '20px',
  count = 1,
  circle = false,
  className = '',
  variant = 'text',
}: AnimatedSkeletonProps) {
  const shimmerAnimation = {
    backgroundPosition: ['0% 0%', '100% 0%'],
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'avatar':
        return 'w-12 h-12 rounded-full';
      case 'card':
        return 'w-full h-32 rounded-lg';
      case 'list':
        return 'w-full h-16 rounded-lg';
      case 'text':
      default:
        return '';
    }
  };

  const style = {
    width: variant !== 'card' && variant !== 'avatar' && variant !== 'list' ? width : 'auto',
    height: variant !== 'card' && variant !== 'avatar' && variant !== 'list' ? height : 'auto',
    borderRadius: circle ? '50%' : '0.5rem',
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className={`bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 ${getVariantStyles()}`}
          style={{
            ...style,
            backgroundSize: '200% 100%',
          }}
          animate={shimmerAnimation}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}
