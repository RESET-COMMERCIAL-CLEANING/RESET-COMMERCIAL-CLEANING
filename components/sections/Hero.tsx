'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black pt-20"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'linear-gradient(135deg, rgba(11, 11, 11, 0.75) 0%, rgba(11, 11, 11, 0.65) 50%, rgba(26, 26, 26, 0.75) 100%), url("/RESET-COMMERCIAL-CLEANING/images/about/Hero%20image.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-reset-green/10 rounded-full blur-3xl animate-pulse z-0" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-reset-green/5 rounded-full blur-3xl animate-pulse z-0" style={{ animationDelay: '1s' }} />

      {/* Content */}
      <div className="relative z-10 container flex flex-col items-start justify-center h-full max-w-4xl pb-32 md:pb-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl px-4 md:px-0"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-tight"
          >
            <span className="block text-white">We don't just</span>
            <span className="block gradient-text">clean. We Reset.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base md:text-lg lg:text-2xl text-gray-300 mb-8 max-w-xl leading-relaxed"
          >
            Premium commercial cleaning for businesses across Sydney. Transform your space with our precision and expertise.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
          >
            <Link
              href="/quote"
              className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg bg-reset-green text-black font-bold hover:bg-opacity-80 transition-all duration-300 glow-green-hover inline-flex items-center justify-center gap-2"
            >
              Get a Quote
              <ArrowRight size={18} className="hidden sm:inline" />
            </Link>
            <Link
              href="#services"
              className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg border-2 border-reset-green text-reset-green font-bold hover:bg-reset-green/10 transition-all duration-300 inline-flex items-center justify-center gap-2"
            >
              Explore Services
              <ArrowRight size={18} className="hidden sm:inline" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator - Hidden on mobile, shown on larger screens */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="hidden md:flex absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-gray-400 text-sm">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-reset-green rounded-full flex items-start justify-center p-2">
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-2 bg-reset-green rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
