'use client';

import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '@/lib/animations';

interface StatItem {
  label: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  color: string;
}

interface AnimatedStatsProps {
  stats: StatItem[];
  title?: string;
  description?: string;
}

export function AnimatedStats({ stats, title, description }: AnimatedStatsProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className="w-full"
    >
      {(title || description) && (
        <motion.div variants={itemVariants} className="mb-8">
          {title && <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>}
          {description && <p className="text-gray-400">{description}</p>}
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="relative p-6 rounded-xl glass border border-reset-green/20 hover:border-reset-green/40 overflow-hidden group"
          >
            {/* Animated background gradient */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-reset-green/10 via-transparent to-transparent opacity-0 group-hover:opacity-100"
              initial={false}
              transition={{ duration: 0.3 }}
            />

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <motion.div
                  className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  {stat.icon}
                </motion.div>
                {stat.change && (
                  <motion.span
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xs font-bold text-reset-green"
                  >
                    {stat.change}
                  </motion.span>
                )}
              </div>

              <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
              <motion.p
                className="text-3xl font-bold text-white"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                {stat.value}
              </motion.p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
