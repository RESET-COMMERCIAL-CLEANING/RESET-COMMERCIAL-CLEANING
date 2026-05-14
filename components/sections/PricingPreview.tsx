'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';

const tiers = [
  {
    name: 'Bronze',
    description: 'Perfect for small offices',
    price: '$0.15',
    period: 'per sq ft',
    features: [
      'Weekly cleaning',
      'Vacuum & mop floors',
      'Clean desks & surfaces',
      'Empty trash bins',
      'Basic reporting',
    ],
    highlighted: false,
  },
  {
    name: 'Silver',
    description: 'Most popular for growing businesses',
    price: '$0.25',
    period: 'per sq ft',
    features: [
      'Bi-weekly deep cleaning',
      'All Bronze features',
      'Window & glass cleaning',
      'Kitchen & bathroom detail',
      'Comprehensive reporting',
      'Customizable schedule',
    ],
    highlighted: true,
  },
  {
    name: 'Platinum',
    description: 'Complete care for premium spaces',
    price: '$0.40',
    period: 'per sq ft',
    features: [
      'Weekly deep cleaning',
      'All Silver features',
      'Carpet & upholstery care',
      'Air quality management',
      'Monthly performance review',
      'Priority scheduling',
      'Dedicated team',
    ],
    highlighted: false,
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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export function PricingPreview() {
  return (
    <section className="relative w-full bg-black py-20 md:py-32">
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
            <span className="block text-white">Simple,</span>
            <span className="gradient-text">Transparent Pricing</span>
          </h2>
          <p className="text-xl text-gray-400">
            No hidden fees. No surprises. Choose the tier that fits your business.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {tiers.map((tier, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: tier.highlighted ? -15 : -10 }}
              className={`relative p-8 rounded-xl transition-all duration-300 ${
                tier.highlighted ? 'glass-dark scale-105 ring-2 ring-reset-green' : 'glass hover:glass-dark'
              }`}
            >
              {/* Highlighted badge */}
              {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-reset-green text-black px-4 py-1 rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Content */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <p className="text-gray-400 text-sm mb-6">{tier.description}</p>

                {/* Price */}
                <div className="mb-8">
                  <div className="text-4xl font-bold text-reset-green">
                    {tier.price}
                    <span className="text-lg text-gray-400 ml-2">{tier.period}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {tier.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-reset-green flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Link
                  href="/quote"
                  className={`w-full py-3 rounded-lg font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                    tier.highlighted
                      ? 'bg-reset-green text-black hover:bg-opacity-80 glow-green-hover'
                      : 'border-2 border-reset-green text-reset-green hover:bg-reset-green/10'
                  }`}
                >
                  Get Started
                  <ArrowRight size={18} />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-gray-400 mb-4">
            Need a custom quote? Our team can tailor a plan for your specific needs.
          </p>
          <Link
            href="/quote"
            className="inline-flex items-center gap-2 text-reset-green font-bold hover:gap-4 transition-all duration-300"
          >
            Get Custom Quote →
          </Link>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-reset-green/5 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}
