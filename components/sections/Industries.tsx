'use client';

import { motion } from 'framer-motion';
import { Building2, Store, Wrench, Stethoscope, Building, Factory } from 'lucide-react';

const industries = [
  {
    icon: Building2,
    title: 'Corporate Offices',
    description: 'Professional workspaces that demand excellence',
    color: 'from-reset-green/25 to-reset-green/10',
  },
  {
    icon: Building,
    title: 'Commercial Buildings',
    description: 'Multi-story complexes and mixed-use facilities',
    color: 'from-reset-green/20 to-reset-green/8',
  },
  {
    icon: Wrench,
    title: 'Car Parks',
    description: 'High-traffic areas requiring specialized care',
    color: 'from-reset-green/25 to-reset-green/10',
  },
  {
    icon: Stethoscope,
    title: 'Medical Clinics',
    description: 'Hygiene-critical environments with strict standards',
    color: 'from-reset-green/20 to-reset-green/8',
  },
  {
    icon: Store,
    title: 'Retail Spaces',
    description: 'Customer-facing areas that make first impressions',
    color: 'from-reset-green/25 to-reset-green/10',
  },
  {
    icon: Factory,
    title: 'Warehouses',
    description: 'Large-scale industrial cleaning solutions',
    color: 'from-reset-green/20 to-reset-green/8',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 },
  },
};

export function Industries() {
  return (
    <section className="relative w-full bg-black py-20 md:py-32 overflow-hidden">
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-2xl mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="block text-white">Industries We</span>
            <span className="gradient-text">Serve</span>
          </h2>
          <p className="text-xl text-gray-400">
            From corporate towers to specialized facilities, we clean every industry with precision.
          </p>
        </motion.div>

        {/* Industries Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4"
        >
          {industries.map((industry, index) => {
            const Icon = industry.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="group relative overflow-hidden rounded-lg glass hover:glass-dark transition-all duration-300 p-6"
              >
                {/* Icon */}
                <div className={`w-12 h-12 bg-gradient-to-br ${industry.color} rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-reset-green" />
                </div>

                {/* Content */}
                <h3 className="text-sm font-bold text-white mb-2">
                  {industry.title}
                </h3>
                <p className="text-xs text-gray-400">
                  {industry.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Decorative background */}
        <div className="absolute -top-96 right-1/3 w-full h-96 bg-gradient-to-b from-reset-green/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      </div>
    </section>
  );
}
