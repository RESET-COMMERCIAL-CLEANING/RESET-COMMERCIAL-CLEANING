'use client';

import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/RESET-COMMERCIAL-CLEANING/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: `client-${Date.now()}`,
          userName: formData.name,
          userEmail: formData.email,
          userType: 'client',
          category: 'general-inquiry',
          subject: `Contact Request from ${formData.name}`,
          message: formData.message,
          priority: 'low',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        alert('Failed to send message: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Failed to create contact ticket:', error);
      alert('Failed to send message. Please try again.');
    }
  };

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
              <div className="w-20 h-20 bg-reset-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <motion.div
                  animate={{ scale: [0.8, 1.2, 1] }}
                  transition={{ duration: 0.6 }}
                  className="text-5xl"
                >
                  ✓
                </motion.div>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Message Sent!</h2>
              <p className="text-lg sm:text-xl text-gray-400 mb-4">
                Thank you for reaching out to RESET.
              </p>
              <p className="text-base sm:text-lg text-gray-400 mb-12">
                We've received your message and will get back to you within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-reset-green text-black font-bold rounded-lg hover:bg-reset-green/80 transition-all"
              >
                Send Another Message
              </button>
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
                  <label className="block text-sm font-semibold text-white mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none transition-colors"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Phone (Optional)</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none transition-colors"
                    placeholder="+61 2 9234 5678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
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
                  className="w-full px-6 py-3 rounded-lg bg-reset-green text-black font-bold hover:bg-opacity-80 transition-all duration-300 glow-green-hover flex items-center justify-center gap-2"
                >
                  Send Message
                  <Send size={18} />
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
  );
}
