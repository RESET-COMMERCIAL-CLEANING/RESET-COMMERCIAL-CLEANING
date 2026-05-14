'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function QuotePage() {
  const [formData, setFormData] = useState({
    company: '',
    email: '',
    phone: '',
    serviceType: '',
    squareFeet: '',
    frequency: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <div className="container max-w-2xl">
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 bg-reset-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <motion.div
                animate={{ scale: [0.8, 1.2, 1] }}
                transition={{ duration: 0.6 }}
                className="text-5xl"
              >
                ✓
              </motion.div>
            </div>
            <h2 className="text-5xl font-bold text-white mb-4">Quote Request Submitted!</h2>
            <p className="text-xl text-gray-400 mb-4">
              Thank you for choosing RESET Commercial Cleaning.
            </p>
            <p className="text-lg text-gray-400 mb-12">
              Our team will review your request and contact you within 24 hours with a customized quote tailored to your cleaning needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    company: '',
                    email: '',
                    phone: '',
                    serviceType: '',
                    squareFeet: '',
                    frequency: '',
                    message: '',
                  });
                }}
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-reset-green text-black font-bold rounded-lg hover:bg-reset-green/80 transition-all"
              >
                Submit Another Quote
                <ArrowRight size={18} />
              </button>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 border-2 border-reset-green text-reset-green font-bold rounded-lg hover:bg-reset-green/10 transition-all"
              >
                Back to Home
                <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">Get a Quote</h1>
              <p className="text-xl text-gray-400">
                Tell us about your cleaning needs and we'll provide a customized quote within 24 hours.
              </p>
            </div>

            {/* Form */}
            <motion.form
              onSubmit={handleSubmit}
              className="p-8 rounded-xl glass space-y-6"
            >
              {/* Company Name */}
              <div>
                <label className="block text-white font-bold mb-2">Company Name</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Your company name"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none focus:ring-1 focus:ring-reset-green/50 transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-white font-bold mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none focus:ring-1 focus:ring-reset-green/50 transition-all"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-white font-bold mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+61 2 XXXX XXXX"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none focus:ring-1 focus:ring-reset-green/50 transition-all"
                />
              </div>

              {/* Service Type */}
              <div>
                <label className="block text-white font-bold mb-2">Service Type</label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-reset-green/30 text-white focus:border-reset-green focus:outline-none focus:ring-1 focus:ring-reset-green/50 transition-all"
                >
                  <option value="" disabled>Select a service</option>
                  <option value="office">Office Cleaning</option>
                  <option value="commercial">Commercial Cleaning</option>
                  <option value="carpark">Car Park Cleaning</option>
                  <option value="endlease">End of Lease Cleaning</option>
                  <option value="medical">Medical Facility Cleaning</option>
                  <option value="maintenance">Scheduled Maintenance</option>
                </select>
              </div>

              {/* Square Feet */}
              <div>
                <label className="block text-white font-bold mb-2">Approximate Square Footage</label>
                <input
                  type="text"
                  name="squareFeet"
                  value={formData.squareFeet}
                  onChange={handleChange}
                  placeholder="e.g., 5,000 sqft"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none focus:ring-1 focus:ring-reset-green/50 transition-all"
                />
              </div>

              {/* Frequency */}
              <div>
                <label className="block text-white font-bold mb-2">Cleaning Frequency</label>
                <select
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-reset-green/30 text-white focus:border-reset-green focus:outline-none focus:ring-1 focus:ring-reset-green/50 transition-all"
                >
                  <option value="" disabled>Select frequency</option>
                  <option value="daily">Daily</option>
                  <option value="3x-weekly">3x Weekly</option>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="one-time">One-time</option>
                </select>
              </div>

              {/* Additional Details */}
              <div>
                <label className="block text-white font-bold mb-2">Additional Details</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us anything specific about your cleaning needs..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none focus:ring-1 focus:ring-reset-green/50 transition-all"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-reset-green text-black font-bold rounded-lg hover:bg-reset-green/80 transition-all glow-green-hover flex items-center justify-center gap-2"
              >
                Request Quote
                <ArrowRight size={20} />
              </button>

              {/* Back Link */}
              <div className="text-center">
                <Link href="/services" className="text-reset-green hover:underline font-bold">
                  Back to Services
                </Link>
              </div>
            </motion.form>
          </motion.div>
        )}
      </div>
    </div>
  );
}
