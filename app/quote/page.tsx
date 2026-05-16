'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Loader } from 'lucide-react';
import { useState } from 'react';
import { Toast, useToast } from '@/components/Toast';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function QuotePage() {
  const { toasts, addToast, removeToast } = useToast();
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
  const [isLoading, setIsLoading] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const generateTicketNumber = (): string => {
    // Generate ticket number from timestamp (simpler, no DB query needed)
    const timestamp = Date.now();
    const randomPart = Math.floor(Math.random() * 9000) + 1000;
    return `TKT-${timestamp.toString().slice(-6)}${randomPart.toString().slice(-2)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!db) {
        console.error('🔴 Firebase db is null - not initialized');
        addToast('Firebase not initialized. Refreshing...', 'error', 3000);
        setTimeout(() => window.location.reload(), 1000);
        return;
      }

      console.log('✅ Starting quote ticket creation...');
      const newTicketNumber = generateTicketNumber();
      console.log('✅ Generated ticket number:', newTicketNumber);

      const ticketsRef = collection(db, 'tickets');

      const ticketData = {
        ticketNumber: newTicketNumber,
        userId: `client-${Date.now()}`,
        userName: formData.company,
        userEmail: formData.email,
        userPhone: formData.phone,
        userType: 'client',
        category: formData.serviceType,
        subject: `Quote Request - ${formData.serviceType}`,
        message: `Company: ${formData.company}\nPhone: ${formData.phone}\nSquare Footage: ${formData.squareFeet}\nFrequency: ${formData.frequency}\n\nAdditional Details:\n${formData.message}`,
        priority: 'medium',
        status: 'assigned',
        createdAt: Timestamp.now(),
        attachments: [],
      };

      console.log('✅ Submitting to Firestore:', ticketData);
      const docRef = await addDoc(ticketsRef, ticketData);
      console.log('✅ Ticket created successfully with ID:', docRef.id);

      setTicketNumber(newTicketNumber);
      setIsLoading(false);
      setSubmitted(true);
      addToast('Quote request submitted successfully!', 'success', 6000);
    } catch (error: any) {
      console.error('❌ Failed to create quote ticket');
      console.error('Error:', error);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);

      let errorMessage = 'Failed to submit quote. Please try again.';

      if (error.code === 'permission-denied') {
        errorMessage = 'Permission denied. Firestore rules may need to be deployed.';
      } else if (error.message?.includes('Failed to get')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.code === 'unavailable') {
        errorMessage = 'Firebase service unavailable. Please try again in a moment.';
      }

      addToast(errorMessage, 'error', 8000);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toast toasts={toasts} onRemove={removeToast} />
      <div className="min-h-screen bg-black pt-32 pb-20">
        <div className="container max-w-2xl">
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-20"
          >
            {/* Success Icon */}
            <div className="w-24 h-24 bg-reset-green/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <motion.div
                animate={{ scale: [0.8, 1.2, 1] }}
                transition={{ duration: 0.6 }}
                className="text-6xl"
              >
                ✓
              </motion.div>
            </div>

            {/* Main Message */}
            <h2 className="text-5xl font-bold text-white mb-2">Quote Request Submitted!</h2>
            <p className="text-xl text-reset-green font-semibold mb-6">Your request has been successfully received</p>

            {/* Ticket Number */}
            {ticketNumber && (
              <div className="bg-reset-green/10 border border-reset-green/50 rounded-lg p-6 mb-8 inline-block">
                <p className="text-gray-400 text-sm mb-2">Your Ticket Number</p>
                <p className="text-3xl font-bold text-reset-green font-mono">{ticketNumber}</p>
                <p className="text-gray-400 text-xs mt-2">Save this number for your records</p>
              </div>
            )}

            {/* Details */}
            <p className="text-lg text-gray-400 mb-2">
              Thank you for choosing RESET Commercial Cleaning.
            </p>
            <p className="text-base text-gray-400 mb-12">
              Our team will review your request and contact you at <span className="text-reset-green font-semibold">{formData.email}</span> within 24 hours with a customized quote tailored to your cleaning needs.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setTicketNumber('');
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
                <label htmlFor="company" className="block text-white font-bold mb-2">Company Name</label>
                <input
                  id="company"
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Your company name"
                  autoComplete="organization"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none focus:ring-1 focus:ring-reset-green/50 transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-white font-bold mb-2">Email Address</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none focus:ring-1 focus:ring-reset-green/50 transition-all"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-white font-bold mb-2">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+61 2 XXXX XXXX"
                  autoComplete="tel"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none focus:ring-1 focus:ring-reset-green/50 transition-all"
                />
              </div>

              {/* Service Type */}
              <div>
                <label htmlFor="serviceType" className="block text-white font-bold mb-2">Service Type</label>
                <select
                  id="serviceType"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  autoComplete="off"
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
                <label htmlFor="squareFeet" className="block text-white font-bold mb-2">Approximate Square Footage</label>
                <input
                  id="squareFeet"
                  type="text"
                  name="squareFeet"
                  value={formData.squareFeet}
                  onChange={handleChange}
                  placeholder="e.g., 5,000 sqft"
                  autoComplete="off"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none focus:ring-1 focus:ring-reset-green/50 transition-all"
                />
              </div>

              {/* Frequency */}
              <div>
                <label htmlFor="frequency" className="block text-white font-bold mb-2">Cleaning Frequency</label>
                <select
                  id="frequency"
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  autoComplete="off"
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
                <label htmlFor="message" className="block text-white font-bold mb-2">Additional Details</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us anything specific about your cleaning needs..."
                  autoComplete="off"
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none focus:ring-1 focus:ring-reset-green/50 transition-all"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-reset-green text-black font-bold rounded-lg hover:bg-reset-green/80 transition-all glow-green-hover flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Request Quote
                    <ArrowRight size={20} />
                  </>
                )}
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
    </>
  );
}
