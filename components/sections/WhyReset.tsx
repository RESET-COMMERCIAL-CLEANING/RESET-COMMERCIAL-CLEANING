'use client';

import { motion } from 'framer-motion';
import { CheckCircle, DollarSign, Users, Zap, BarChart3 } from 'lucide-react';

const reasons = [
  {
    icon: Zap,
    title: 'Reset, Not Clean',
    description: 'We transform your space completely. Not just surface cleaning—deep, comprehensive reset of your entire environment.',
  },
  {
    icon: DollarSign,
    title: 'Fixed Transparent Pricing',
    description: 'No hidden fees. No surprises. Our pricing is simple, transparent, and locked in for your contract period.',
  },
  {
    icon: Users,
    title: 'B2B Specialists',
    description: 'We specialize in commercial spaces. Our teams are trained for office buildings, retail, medical facilities, and more.',
  },
  {
    icon: CheckCircle,
    title: 'Reliable Subcontractors',
    description: 'Vetted, professional, and accountable. Every cleaner is background-checked and fully insured.',
  },
  {
    icon: BarChart3,
    title: 'Before & After Reporting',
    description: 'Photographic evidence of every job. Track quality, identify improvements, and celebrate the reset.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function WhyReset() {
  return (
    <section id="services" className="relative w-full bg-black py-20 md:py-32">
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
            <span className="block text-white">Why Choose</span>
            <span className="gradient-text">RESET?</span>
          </h2>
          <p className="text-xl text-gray-400">
            We're not just another cleaning service. Here's what sets us apart.
          </p>
        </motion.div>

        {/* Reasons Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
        >
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative p-6 rounded-xl glass hover:glass-dark transition-all duration-300 cursor-pointer overflow-hidden"
              >
                {/* Background glow on hover */}
                <div className="absolute inset-0 bg-reset-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Content */}
                <div className="relative z-10">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="mb-4"
                  >
                    <Icon className="w-8 h-8 text-reset-green" />
                  </motion.div>

                  <h3 className="text-lg font-bold text-white mb-3">
                    {reason.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-reset-green/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-reset-green/5 rounded-full blur-3xl pointer-events-none" />
      </div>
    </section>
  );
}
