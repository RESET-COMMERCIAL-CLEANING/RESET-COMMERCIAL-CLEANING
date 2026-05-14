'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Phone, Mail } from 'lucide-react';

export function FinalCTA() {
  return (
    <section className="relative w-full bg-black py-20 md:py-32 overflow-hidden">
      <div className="container">
        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8"
          >
            <span className="block text-white">Ready to</span>
            <span className="gradient-text">Reset Your Space?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto"
          >
            Let's discuss how RESET can transform your business space. Get in touch today for a free assessment.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-center gap-4"
          >
            <Link
              href="/quote"
              className="px-10 py-4 rounded-lg bg-reset-green text-black font-bold hover:bg-opacity-80 transition-all duration-300 glow-green-hover inline-flex items-center justify-center gap-2"
            >
              Get Free Quote
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/contact"
              className="px-10 py-4 rounded-lg border-2 border-reset-green text-reset-green font-bold hover:bg-reset-green/10 transition-all duration-300 inline-flex items-center justify-center gap-2"
            >
              Schedule Consultation
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto border-t border-reset-green/20 pt-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <a
              href="tel:+61292345678"
              className="flex items-center gap-4 group p-4 rounded-lg hover:glass transition-all duration-300"
            >
              <div className="w-12 h-12 bg-reset-green/20 rounded-lg flex items-center justify-center group-hover:bg-reset-green/30 transition-colors">
                <Phone className="w-6 h-6 text-reset-green" />
              </div>
              <div className="text-left">
                <p className="text-gray-400 text-sm">Call us</p>
                <p className="text-white font-bold">+61 2 9234 5678</p>
              </div>
            </a>

            <a
              href="mailto:info@reset.com.au"
              className="flex items-center gap-4 group p-4 rounded-lg hover:glass transition-all duration-300"
            >
              <div className="w-12 h-12 bg-reset-green/20 rounded-lg flex items-center justify-center group-hover:bg-reset-green/30 transition-colors">
                <Mail className="w-6 h-6 text-reset-green" />
              </div>
              <div className="text-left">
                <p className="text-gray-400 text-sm">Email us</p>
                <p className="text-white font-bold">info@reset.com.au</p>
              </div>
            </a>
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        >
          <div className="p-6 rounded-xl glass">
            <div className="text-4xl font-bold text-reset-green mb-2">1000+</div>
            <p className="text-gray-400">Happy Clients</p>
          </div>
          <div className="p-6 rounded-xl glass">
            <div className="text-4xl font-bold text-reset-green mb-2">10+</div>
            <p className="text-gray-400">Years Experience</p>
          </div>
          <div className="p-6 rounded-xl glass">
            <div className="text-4xl font-bold text-reset-green mb-2">100%</div>
            <p className="text-gray-400">Satisfaction Guaranteed</p>
          </div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-1/3 w-96 h-96 bg-reset-green/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-reset-green/5 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}
