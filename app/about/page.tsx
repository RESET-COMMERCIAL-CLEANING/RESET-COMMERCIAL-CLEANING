'use client';

import { motion } from 'framer-motion';
import { Award, Users, Target, Zap } from 'lucide-react';

export default function AboutPage() {
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
              <span className="block text-white">About</span>
              <span className="gradient-text">RESET</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl">
              A premium commercial cleaning company redefining industry standards.
            </p>
          </motion.div>
        </div>

        <div className="absolute top-1/4 right-0 w-96 h-96 bg-reset-green/5 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Company Story */}
      <section className="w-full py-20">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="prose prose-invert"
          >
            <div className="p-8 rounded-xl glass">
              <h2 className="text-4xl font-bold text-white mb-6">Our Story</h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Founded in 2014, RESET Commercial Cleaning emerged with a single vision: to transform commercial spaces
                from ordinary to extraordinary. What started as a small team of dedicated professionals has grown into
                Sydney's leading B2B cleaning partner.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                We believe cleaning is more than removing dirt—it's about resetting spaces to their best state,
                creating environments where businesses can thrive.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="w-full py-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-xl glass"
            >
              <Target className="w-12 h-12 text-reset-green mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
              <p className="text-gray-400">
                Deliver exceptional cleaning services that exceed expectations and empower businesses to focus on growth.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-xl glass"
            >
              <Zap className="w-12 h-12 text-reset-green mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
              <p className="text-gray-400">
                To be the most trusted and innovative commercial cleaning company in Australia.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="p-8 rounded-xl glass"
            >
              <Award className="w-12 h-12 text-reset-green mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Our Values</h3>
              <p className="text-gray-400">
                Excellence, integrity, reliability, and environmental responsibility in everything we do.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="w-full py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-5xl font-bold mb-6">
              <span className="block text-white">Meet The</span>
              <span className="gradient-text">Team</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl">
              Dedicated professionals committed to excellence.
            </p>
          </motion.div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-full h-64 bg-gradient-to-br from-reset-green/20 to-reset-green/5 rounded-xl mb-4 flex items-center justify-center">
                  <Users className="w-20 h-20 text-reset-green/40" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Team Member {i}</h3>
                <p className="text-gray-400 text-sm">Position</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-20 bg-gradient-to-b from-transparent to-reset-green/5">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: '1000+', label: 'Happy Clients' },
              { number: '10+', label: 'Years Experience' },
              { number: '500+', label: 'Monthly Jobs' },
              { number: '100%', label: 'Satisfaction Rate' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-xl glass"
              >
                <div className="text-4xl font-bold text-reset-green mb-2">{stat.number}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
