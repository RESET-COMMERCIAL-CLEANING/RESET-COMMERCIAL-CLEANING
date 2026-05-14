'use client';

import { motion } from 'framer-motion';
import { Search, Zap, Camera, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: Search,
    number: '01',
    title: 'Assessment',
    description: 'We thoroughly evaluate your space, identify specific cleaning needs, and create a customized plan tailored to your business.',
  },
  {
    icon: Zap,
    number: '02',
    title: 'Reset Cleaning',
    description: 'Our professional team executes the reset with precision, using industry-leading techniques and eco-friendly products.',
  },
  {
    icon: Camera,
    number: '03',
    title: 'Report Delivery',
    description: 'You receive a comprehensive before-and-after photo report, documenting the complete transformation of your space.',
  },
  {
    icon: CheckCircle,
    number: '04',
    title: 'Ongoing Maintenance',
    description: 'Scheduled follow-up cleanings keep your space reset-ready. We adapt our approach based on your specific needs.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6 },
  },
};

export function Journey() {
  return (
    <section id="journey" className="relative w-full bg-black py-20 md:py-32">
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
            <span className="block text-white">Your RESET</span>
            <span className="gradient-text">Journey</span>
          </h2>
          <p className="text-xl text-gray-400">
            Four simple steps to transform your space.
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative"
        >
          {/* Connecting line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-reset-green via-reset-green/50 to-transparent transform -translate-x-1/2" />

          <div className="space-y-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <motion.div key={index} variants={itemVariants} className="relative">
                  <div className={`flex gap-8 items-center ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                    {/* Content */}
                    <div className="flex-1">
                      <div className="rounded-xl glass p-8 hover:glass-dark transition-all duration-300">
                        <div className="flex items-center gap-4 mb-4">
                          <span className="text-reset-green text-4xl font-bold">{step.number}</span>
                          <div className="w-12 h-12 bg-reset-green/20 rounded-lg flex items-center justify-center">
                            <Icon className="w-6 h-6 text-reset-green" />
                          </div>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                        <p className="text-gray-400">{step.description}</p>
                      </div>
                    </div>

                    {/* Timeline dot */}
                    <div className="hidden lg:flex flex-col items-center">
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        className="w-6 h-6 bg-reset-green rounded-full ring-4 ring-black z-10"
                      />
                      {index < steps.length - 1 && (
                        <div className="h-16 w-1 bg-gradient-to-b from-reset-green/50 to-transparent" />
                      )}
                    </div>

                    {/* Visual Element with Image */}
                    <div className="flex-1 hidden lg:block">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="w-full h-64 rounded-xl overflow-hidden relative"
                        style={{
                          backgroundImage: index === 0 ? 'url("/RESET-COMMERCIAL-CLEANING/images/services/assessment.png")' :
                                          index === 1 ? 'url("/RESET-COMMERCIAL-CLEANING/images/services/cleaning.png")' :
                                          index === 2 ? 'url("/RESET-COMMERCIAL-CLEANING/images/services/reporting.png")' :
                                          'url("/RESET-COMMERCIAL-CLEANING/images/services/assessment.png")',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      >
                        {/* Overlay for better contrast */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-reset-green/5 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}
