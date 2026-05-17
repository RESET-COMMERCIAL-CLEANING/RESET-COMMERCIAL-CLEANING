'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X, Send, AlertCircle } from 'lucide-react';
import { createTicket, generateTicketNumber } from '@/lib/db/tickets';
import { SupportTicket } from '@/lib/db/tickets';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userEmail: string;
  userId: string;
  userType: 'client' | 'subcontractor' | 'business-owner';
  source?: SupportTicket['source'];
}

export function SupportModal({ isOpen, onClose, userName, userEmail, userId, userType, source = 'contact-support' }: SupportModalProps) {
  const [supportForm, setSupportForm] = useState({
    name: userName,
    email: userEmail,
    subject: '',
    category: 'general',
    message: ''
  });
  const [supportSubmitted, setSupportSubmitted] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSupportSubmit = async () => {
    if (!supportForm.subject.trim() || !supportForm.message.trim()) {
      setValidationError('Please fill in all required fields');
      return;
    }
    setValidationError('');
    setIsSubmitting(true);

    try {
      const ticketNumber = await generateTicketNumber();
      await createTicket({
        ticketNumber,
        userId,
        userName: supportForm.name,
        userEmail: supportForm.email,
        userType,
        category: supportForm.category,
        subject: supportForm.subject,
        message: supportForm.message,
        priority: 'medium',
        status: 'unassigned',
        source,
        attachments: [],
      });

      setSupportSubmitted(true);

      setTimeout(() => {
        onClose();
        setSupportForm({
          name: userName,
          email: userEmail,
          subject: '',
          category: 'general',
          message: ''
        });
        setSupportSubmitted(false);
        setValidationError('');
        setIsSubmitting(false);
      }, 2000);
    } catch (error: any) {
      console.error('❌ Failed to create support ticket:', error);
      setValidationError(`Failed to submit ticket: ${error.message || 'Unknown error'}`);
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed top-0 left-0 w-full min-h-screen bg-black/95 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-black border-2 border-blue-600/40 rounded-xl max-w-md w-11/12 sm:w-full shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            setValidationError('');
            onClose();
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {supportSubmitted ? (
          <div className="p-6 sm:p-8 text-center py-16">
            <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <motion.div
                animate={{ scale: [0.8, 1.2, 1] }}
                transition={{ duration: 0.6 }}
                className="text-4xl"
              >
                ✓
              </motion.div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Ticket Submitted!</h3>
            <p className="text-gray-400">Our support team will review your issue and get back to you shortly.</p>
          </div>
        ) : (
          <>
            <div className="p-4 sm:p-6 border-b border-blue-600/20">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Contact Support</h2>
              <p className="text-xs text-gray-400 mt-1">Report an issue or ask for help</p>
            </div>

            <div className="flex-1 p-4 sm:p-6 space-y-4">
              {/* Validation Error */}
              <AnimatePresence>
                {validationError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3 rounded bg-red-500/20 border border-red-500/30 flex items-center gap-2"
                  >
                    <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
                    <p className="text-xs sm:text-sm text-red-400">{validationError}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-400 mb-2">Name</label>
                <input
                  type="text"
                  value={supportForm.name}
                  onChange={(e) => setSupportForm({ ...supportForm, name: e.target.value })}
                  placeholder="Your name"
                  disabled
                  className="w-full px-3 py-2 rounded bg-white/5 border border-blue-600/30 text-white placeholder-gray-500 focus:border-blue-600 focus:outline-none text-sm disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  value={supportForm.email}
                  onChange={(e) => setSupportForm({ ...supportForm, email: e.target.value })}
                  placeholder="your@email.com"
                  disabled
                  className="w-full px-3 py-2 rounded bg-white/5 border border-blue-600/30 text-white placeholder-gray-500 focus:border-blue-600 focus:outline-none text-sm disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-400 mb-2">Category</label>
                <select
                  value={supportForm.category}
                  onChange={(e) => setSupportForm({ ...supportForm, category: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-white/5 border border-blue-600/30 text-white focus:border-blue-600 focus:outline-none text-sm"
                >
                  <option value="general">General Question</option>
                  <option value="billing">Billing Issue</option>
                  <option value="technical">Technical Problem</option>
                  <option value="quality">Quality Complaint</option>
                  <option value="job">Job Related</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-400 mb-2">Subject</label>
                <input
                  type="text"
                  value={supportForm.subject}
                  onChange={(e) => setSupportForm({ ...supportForm, subject: e.target.value })}
                  placeholder="Brief description of your issue"
                  className="w-full px-3 py-2 rounded bg-white/5 border border-blue-600/30 text-white placeholder-gray-500 focus:border-blue-600 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-400 mb-2">Message</label>
                <textarea
                  value={supportForm.message}
                  onChange={(e) => setSupportForm({ ...supportForm, message: e.target.value })}
                  placeholder="Please describe your issue in detail..."
                  rows={4}
                  className="w-full px-3 py-2 rounded bg-white/5 border border-blue-600/30 text-white placeholder-gray-500 focus:border-blue-600 focus:outline-none text-sm resize-none"
                />
              </div>
            </div>

            <div className="p-4 sm:p-6 border-t border-blue-600/20 flex gap-2 sm:gap-3">
              <button
                onClick={() => {
                  setValidationError('');
                  onClose();
                }}
                className="flex-1 py-2 text-xs sm:text-sm border border-blue-600 text-blue-600 rounded hover:bg-blue-600/10 transition-colors font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleSupportSubmit}
                disabled={isSubmitting}
                className="flex-1 py-2 text-xs sm:text-sm bg-blue-600 text-white rounded hover:bg-blue-600/80 transition-colors font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={14} />
                {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
