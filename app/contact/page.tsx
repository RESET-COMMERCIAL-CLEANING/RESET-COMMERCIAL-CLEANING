'use client';

import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, Loader, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { Toast, useToast } from '@/components/Toast';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function ContactPage() {
  const { toasts, addToast, removeToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const generateTicketNumber = (): string => {
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

      console.log('✅ Starting contact ticket creation...');
      const newTicketNumber = generateTicketNumber();
      console.log('✅ Generated ticket number:', newTicketNumber);

      const ticketsRef = collection(db, 'tickets');

      const ticketData = {
        ticketNumber: newTicketNumber,
        userId: `client-${Date.now()}`,
        userName: formData.name,
        userEmail: formData.email,
        userPhone: formData.phone,
        userType: 'client',
        category: 'general-inquiry',
        subject: `Contact Request from ${formData.name}`,
        message: formData.message,
        priority: 'low',
        status: 'assigned',
        createdAt: Timestamp.now(),
        attachments: [],
      };

      console.log('✅ Submitting to Firestore:', ticketData);
      console.time('Firestore Write');

      const docRef = await addDoc(ticketsRef, ticketData);

      console.timeEnd('Firestore Write');
      console.log('✅ Contact ticket created successfully with ID:', docRef.id);
      console.log('✅ Document reference:', docRef);

      console.log('Setting ticket number:', newTicketNumber);
      setTicketNumber(newTicketNumber);

      console.log('Setting isLoading to false');
      setIsLoading(false);

      console.log('Setting submitted to true');
      setSubmitted(true);

      console.log('Clearing form data');
      setFormData({ name: '', email: '', phone: '', message: '' });

      console.log('Adding toast notification');
      addToast('Message sent successfully!', 'success', 6000);

      console.log('✅ All state updates completed successfully');
    } catch (error: any) {
      console.error('❌ CRITICAL ERROR in contact submission');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      console.error('Full error stack:', error.stack);

      let errorMessage = 'Failed to send message. Please try again.';

      if (error.code === 'permission-denied') {
        console.error('❌ PERMISSION DENIED - Firestore rules are blocking the write');
        errorMessage = 'Permission denied. Firestore rules may need to be deployed. Check Firebase console.';
      } else if (error.code === 'unauthenticated') {
        console.error('❌ UNAUTHENTICATED - User not authenticated');
        errorMessage = 'Authentication required. Please refresh and try again.';
      } else if (error.code === 'unavailable') {
        console.error('❌ SERVICE UNAVAILABLE - Firebase is down or unreachable');
        errorMessage = 'Firebase service unavailable. Please try again in a moment.';
      } else if (error.code === 'internal') {
        console.error('❌ INTERNAL ERROR - Firebase internal error');
        errorMessage = 'Internal error. Please try again.';
      } else {
        console.error('❌ UNKNOWN ERROR:', error.code || 'unknown');
      }

      addToast(errorMessage, 'error', 8000);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toast toasts={toasts} onRemove={removeToast} />
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
              <span className="block text-white">Get In</span>
              <span className="gradient-text">Touch</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl">
              Have questions? We'd love to hear from you. Reach out to discuss your cleaning needs.
            </p>
          </motion.div>
        </div>

        <div className="absolute top-1/4 right-0 w-96 h-96 bg-reset-green/5 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Contact Info & Form */}
      <section className="w-full py-20">
        <div className="container">
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
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-2">Message Sent!</h2>
              <p className="text-xl text-reset-green font-semibold mb-6">Your inquiry has been successfully received</p>

              {/* Ticket Number */}
              {ticketNumber && (
                <div className="bg-reset-green/10 border border-reset-green/50 rounded-lg p-6 mb-8 inline-block">
                  <p className="text-gray-400 text-sm mb-2">Your Support Ticket Number</p>
                  <p className="text-3xl font-bold text-reset-green font-mono">{ticketNumber}</p>
                  <p className="text-gray-400 text-xs mt-2">Save this number for your records</p>
                </div>
              )}

              {/* Details */}
              <p className="text-base sm:text-lg text-gray-400 mb-2">
                Thank you for reaching out to RESET.
              </p>
              <p className="text-sm sm:text-base text-gray-400 mb-12">
                We've received your message at <span className="text-reset-green font-semibold">{formData.email}</span> and will get back to you within 24 hours. Our support team will use the ticket number above to track your inquiry.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setTicketNumber('');
                    setFormData({ name: '', email: '', phone: '', message: '' });
                  }}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-reset-green text-black font-bold rounded-lg hover:bg-reset-green/80 transition-all"
                >
                  Send Another Message
                  <Send size={18} />
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold text-white mb-12">Contact Information</h2>

                <div className="space-y-8">
                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-reset-green/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-reset-green" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">Phone</h3>
                      <a href="tel:+61292345678" className="text-gray-400 hover:text-reset-green transition-colors">
                        +61 2 9234 5678
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-reset-green/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-reset-green" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">Email</h3>
                      <a href="mailto:info@reset.com.au" className="text-gray-400 hover:text-reset-green transition-colors">
                        info@reset.com.au
                      </a>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-reset-green/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-reset-green" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">Location</h3>
                      <p className="text-gray-400">Sydney, NSW Australia</p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-reset-green/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-reset-green" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">Hours</h3>
                      <p className="text-gray-400">Monday - Friday: 8am - 6pm</p>
                      <p className="text-gray-400">Saturday: 9am - 2pm</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="p-8 rounded-xl glass"
              >
                <h2 className="text-4xl font-bold text-white mb-8">Send us a Message</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-semibold text-white mb-2">Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="name"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none transition-colors"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-sm font-semibold text-white mb-2">Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="contact-phone" className="block text-sm font-semibold text-white mb-2">Phone (Optional)</label>
                  <input
                    id="contact-phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none transition-colors"
                    placeholder="+61 2 9234 5678"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-sm font-semibold text-white mb-2">Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    autoComplete="off"
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none transition-colors resize-none"
                    placeholder="Tell us about your cleaning needs..."
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-3 rounded-lg bg-reset-green text-black font-bold hover:bg-opacity-80 transition-all duration-300 glow-green-hover flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send size={18} />
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
            </div>
          )}
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="w-full py-20 bg-gradient-to-b from-transparent to-reset-green/5">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="w-full h-96 rounded-xl overflow-hidden"
          >
            <div className="w-full h-full bg-gradient-to-br from-reset-green/10 to-reset-green/5 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-reset-green/40 mx-auto mb-4" />
                <p className="text-gray-400">Interactive map coming soon</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      </div>
    </>
  );
}
