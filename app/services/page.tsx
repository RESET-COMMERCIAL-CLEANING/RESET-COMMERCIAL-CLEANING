'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Building2, Sparkles, Zap, Clock, Shield, TrendingUp, ArrowRight } from 'lucide-react';

const services = [
  {
    icon: Building2,
    title: 'Office Cleaning',
    description: 'Professional cleaning for corporate offices, ensuring a pristine work environment.',
    features: ['Daily/weekly schedules', 'Deep desk cleaning', 'Window & glass care', 'Carpet maintenance'],
    price: 'From $0.25/sqft',
  },
  {
    icon: Sparkles,
    title: 'Commercial Cleaning',
    description: 'Comprehensive cleaning solutions for retail spaces and commercial buildings.',
    features: ['Floor polishing', 'Display area cleaning', 'Customer zone focus', 'Evening/weekend scheduling'],
    price: 'From $0.20/sqft',
  },
  {
    icon: Zap,
    title: 'Car Park Cleaning',
    description: 'Specialized cleaning for parking facilities and vehicle spaces.',
    features: ['Pressure washing', 'Oil spot removal', 'Regular maintenance', 'Safety protocols'],
    price: 'From $0.15/sqft',
  },
  {
    icon: Clock,
    title: 'End of Lease Cleaning',
    description: 'Comprehensive deep cleaning for lease terminations and property handovers.',
    features: ['Bond-back ready', 'Carpet shampooing', 'Full facility reset', 'Detail-oriented'],
    price: 'From $0.40/sqft',
  },
  {
    icon: Shield,
    title: 'Medical Facility Cleaning',
    description: 'Hygiene-critical cleaning for healthcare environments and clinics.',
    features: ['Hospital-grade products', 'Infection control', 'HIPAA compliant', 'Certified protocols'],
    price: 'From $0.35/sqft',
  },
  {
    icon: TrendingUp,
    title: 'Scheduled Maintenance',
    description: 'Regular cleaning programs tailored to your business needs.',
    features: ['Customizable frequency', 'Contract flexibility', 'Dedicated team', 'Performance tracking'],
    price: 'From $0.18/sqft',
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

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative w-full pt-32 pb-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="block text-white">Our</span>
              <span className="gradient-text">Services</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl">
              Professional cleaning solutions tailored to every business need.
            </p>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-reset-green/5 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Services Grid */}
      <section className="w-full py-20">
        <div className="container">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {services.map((service, index) => {
              const Icon = service.icon;
              const serviceImages: { [key: number]: string } = {
                0: '/images/Domain/Office%20Cleaning.png',
                1: '/images/Domain/Commercial%20Cleaning.png',
                2: '/images/Domain/Car%20Park%20Cleaning.png',
                3: '/images/Domain/End%20of%20Lease%20Cleaning.png',
                4: '/images/Domain/Medical%20Facility%20Cleaning.png',
                5: '/images/Domain/Scheduled%20Maintenance.png',
              };

              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  className="group relative overflow-hidden rounded-xl glass hover:glass-dark transition-all duration-300 flex flex-col h-full"
                >
                  {/* Service Image */}
                  <div className="w-full h-72 overflow-hidden -m-0 relative bg-black/30 flex items-center justify-center">
                    <img
                      src={serviceImages[index]}
                      alt={service.title}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="p-8 flex-1 flex flex-col">
                    <div className="mb-6">
                      <div className="w-14 h-14 bg-reset-green/20 rounded-lg flex items-center justify-center group-hover:bg-reset-green/30 transition-colors">
                        <Icon className="w-7 h-7 text-reset-green" />
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
                    <p className="text-gray-400 mb-6">{service.description}</p>

                    {/* Features */}
                    <ul className="space-y-2 mb-6 flex-1">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-400">
                          <div className="w-1.5 h-1.5 bg-reset-green rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="border-t border-reset-green/20 pt-6 flex items-center justify-between">
                      <span className="text-reset-green font-bold">{service.price}</span>
                      <Link
                        href="/quote"
                        className="text-reset-green hover:text-white transition-colors inline-flex items-center gap-2"
                      >
                        Quote <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 bg-gradient-to-b from-transparent to-reset-green/5">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Ready to get started?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Get a custom quote for your specific cleaning needs.
            </p>
            <Link
              href="/quote"
              className="inline-flex items-center gap-2 px-10 py-4 bg-reset-green text-black font-bold rounded-lg hover:bg-opacity-80 transition-all glow-green-hover"
            >
              Get Quote Now
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
