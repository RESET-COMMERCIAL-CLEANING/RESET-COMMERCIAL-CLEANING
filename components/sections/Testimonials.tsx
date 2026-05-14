'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
  {
    name: 'Sarah Mitchell',
    company: 'Tech Startup HQ',
    role: 'Operations Manager',
    text: 'RESET completely transformed our office. The attention to detail and reliability are unmatched. Our clients notice the difference immediately.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  },
  {
    name: 'James Chen',
    company: 'Medical Clinic Sydney',
    role: 'Clinical Director',
    text: 'As a medical facility, cleanliness is non-negotiable. RESET understands our strict requirements and delivers consistently. Outstanding service.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
  },
  {
    name: 'Emma Rodriguez',
    company: 'Retail Fashion Group',
    role: 'Store Manager',
    text: 'Our store looks pristine every morning. The RESET team is professional, punctual, and genuinely cares about our space. Highly recommended!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
  },
  {
    name: 'Michael Wong',
    company: 'Corporate Legal Offices',
    role: 'Facilities Director',
    text: 'Working with RESET has streamlined our cleaning operations. Their transparent pricing and before-and-after reports give us complete confidence.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function Testimonials() {
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
            <span className="block text-white">Trusted By</span>
            <span className="gradient-text">Sydney's Best</span>
          </h2>
          <p className="text-xl text-gray-400">
            Hear from businesses that have experienced the RESET difference.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="group relative p-8 rounded-xl glass hover:glass-dark transition-all duration-300"
            >
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-reset-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

              {/* Content */}
              <div className="relative z-10">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-reset-green text-reset-green" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-gray-300 mb-6 text-lg leading-relaxed italic">
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-reset-green/30">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-400">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 flex justify-center"
        >
          <div className="inline-block px-6 py-3 rounded-full glass text-center">
            <p className="text-gray-300">
              <span className="text-reset-green font-bold">1000+</span> businesses trust RESET
            </p>
          </div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-reset-green/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-reset-green/5 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}
