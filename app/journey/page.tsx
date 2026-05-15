'use client';

import { motion } from 'framer-motion';
import { Search, Zap, Camera, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const steps = [
  {
    icon: Search,
    number: '01',
    title: 'Assessment',
    description: 'We thoroughly evaluate your space, identify specific cleaning needs, analyze square footage, assess current condition, and create a customized cleaning plan tailored to your business requirements.',
    details: [
      'On-site property evaluation',
      'Detailed cleaning needs analysis',
      'Custom plan creation',
      'Timeline establishment',
    ],
    image: '/RESET-COMMERCIAL-CLEANING/images/services/01 Assessment.png',
  },
  {
    icon: Zap,
    number: '02',
    title: 'Reset Cleaning',
    description: 'Our professional team executes the reset with precision, using industry-leading techniques, eco-friendly products, and proven methodologies to transform your space completely.',
    details: [
      'Professional deep cleaning',
      'Eco-friendly products used',
      'Quality assurance checks',
      'Minimal disruption to operations',
    ],
    image: '/RESET-COMMERCIAL-CLEANING/images/services/03 Reporting.png',
  },
  {
    icon: Camera,
    number: '03',
    title: 'Report Delivery',
    description: 'You receive a comprehensive before-and-after photo report, documenting the complete transformation of your space with detailed notes and insights.',
    details: [
      'Professional photography',
      'Detailed before/after comparisons',
      'Work documentation',
      'Quality verification',
    ],
    image: '/RESET-COMMERCIAL-CLEANING/images/services/02 Reset cleaning.png',
  },
  {
    icon: CheckCircle,
    number: '04',
    title: 'Ongoing Maintenance',
    description: 'Scheduled follow-up cleanings keep your space reset-ready. We adapt our approach based on your specific needs and feedback to ensure continuous excellence.',
    details: [
      'Regular scheduled cleanings',
      'Customizable frequency',
      'Continuous improvement',
      'Dedicated support team',
    ],
    image: '/RESET-COMMERCIAL-CLEANING/images/services/04 Ongoing Maintenance.png',
  },
];

export default function JourneyPage() {
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
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="block text-white">Your RESET</span>
              <span className="gradient-text">Journey</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl">
              Four simple steps to transform your business space.
            </p>
          </motion.div>
        </div>

        <div className="absolute top-1/4 right-0 w-96 h-96 bg-reset-green/5 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Journey Steps */}
      <section className="w-full py-20">
        <div className="container max-w-4xl">
          <div className="space-y-16">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 items-start`}
                >
                  {/* Content */}
                  <div className="flex-1">
                    <div className="rounded-xl glass p-6 lg:p-8 hover:glass-dark transition-all duration-300">
                      <div className="flex items-center gap-3 lg:gap-4 mb-6">
                        <span className="text-3xl lg:text-5xl font-bold text-reset-green">{step.number}</span>
                        <div className="w-12 h-12 lg:w-16 lg:h-16 bg-reset-green/20 rounded-xl flex items-center justify-center">
                          <Icon className="w-6 h-6 lg:w-8 lg:h-8 text-reset-green" />
                        </div>
                      </div>

                      <h3 className="text-xl lg:text-3xl font-bold text-white mb-4">{step.title}</h3>
                      <p className="text-gray-400 mb-6 text-base lg:text-lg">{step.description}</p>

                      {/* Details List */}
                      <ul className="space-y-2 lg:space-y-3 mb-6">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-start gap-3 text-gray-400 text-sm lg:text-base">
                            <div className="w-2 h-2 bg-reset-green rounded-full mt-2 flex-shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Visual Element */}
                  <div className="flex-1">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="w-full h-64 lg:h-96 rounded-xl bg-gradient-to-br from-reset-green/20 to-reset-green/5 flex items-center justify-center overflow-hidden glass"
                    >
                      <img
                        src={step.image}
                        alt={step.title}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          const parent = (e.target as HTMLImageElement).parentElement;
                          if (parent) {
                            parent.style.background = 'linear-gradient(135deg, rgba(58, 158, 104, 0.2) 0%, rgba(58, 158, 104, 0.05) 100%)';
                          }
                        }}
                      />
                    </motion.div>
                  </div>

                  {/* Timeline Connector */}
                  {index < steps.length - 1 && (
                    <div className="absolute left-1/2 transform -translate-x-1/2 h-16 w-1 bg-gradient-to-b from-reset-green to-transparent hidden lg:block" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why This Journey */}
      <section className="w-full py-20 bg-gradient-to-b from-transparent to-reset-green/5">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-8">Why This Approach?</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              {[
                {
                  title: 'Transparent',
                  description: 'Every step is documented and communicated with visual proof of work.',
                },
                {
                  title: 'Customized',
                  description: 'We assess your unique needs rather than applying a one-size-fits-all approach.',
                },
                {
                  title: 'Professional',
                  description: 'Our trained team uses industry-leading techniques and eco-friendly products.',
                },
                {
                  title: 'Accountable',
                  description: 'We track results and continuously improve based on your feedback.',
                },
              ].map((reason, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="p-5 lg:p-6 rounded-lg glass"
                >
                  <h3 className="text-lg lg:text-xl font-bold text-white mb-2">{reason.title}</h3>
                  <p className="text-sm lg:text-base text-gray-400">{reason.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-20">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6">Ready to Start Your Journey?</h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Begin your reset journey today with a free assessment.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link
                href="/quote"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-3 sm:py-4 bg-reset-green text-black font-bold rounded-lg hover:bg-opacity-80 transition-all glow-green-hover text-center"
              >
                Get Quote
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-3 sm:py-4 border-2 border-reset-green text-reset-green font-bold rounded-lg hover:bg-reset-green/10 transition-all text-center"
              >
                Contact Us
                <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
