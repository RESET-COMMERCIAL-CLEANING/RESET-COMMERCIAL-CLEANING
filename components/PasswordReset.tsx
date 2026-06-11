'use client';

import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { Toast, useToast } from '@/components/Toast';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import crypto from 'crypto-js';

interface PasswordResetProps {
  onBack: () => void;
}

export function PasswordReset({ onBack }: PasswordResetProps) {
  const { toasts, addToast, removeToast } = useToast();
  const [step, setStep] = useState<'email' | 'verification' | 'password' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [userId, setUserId] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Find user by email in Firestore
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('No account found with this email address.');
        setIsLoading(false);
        return;
      }

      const user = querySnapshot.docs[0];
      const userData = user.data();

      // Generate a 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);
      setUserId(user.id);

      // In production, send email with code
      // For now, display the code in console and toast
      console.log(`🔐 Password Reset Code for ${email}: ${code}`);
      addToast(`Reset code: ${code} (Check console in development)`, 'info', 10000);

      setStep('verification');
      setIsLoading(false);
    } catch (err) {
      console.error('Error finding user:', err);
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (resetCode !== generatedCode) {
      setError('Invalid reset code. Please check and try again.');
      return;
    }

    setStep('password');
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (newPassword !== confirmPassword) {
        setError('Passwords do not match.');
        setIsLoading(false);
        return;
      }

      if (newPassword.length < 6) {
        setError('Password must be at least 6 characters long.');
        setIsLoading(false);
        return;
      }

      // Update password in Firestore
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        password: newPassword,
        passwordResetAt: new Date(),
      });

      addToast('Password reset successfully! Please log in with your new password.', 'success', 3000);
      setStep('success');
      setIsLoading(false);
    } catch (err) {
      console.error('Error resetting password:', err);
      setError('Failed to reset password. Please try again.');
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'email') {
      onBack();
    } else if (step === 'verification') {
      setStep('email');
      setResetCode('');
    } else if (step === 'password') {
      setStep('verification');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      onBack();
    }
  };

  return (
    <>
      <Toast toasts={toasts} onRemove={removeToast} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Reset Password</h2>
          <p className="text-gray-400">
            {step === 'email' && 'Enter your email to receive a reset code'}
            {step === 'verification' && 'Enter the reset code sent to your email'}
            {step === 'password' && 'Create your new password'}
            {step === 'success' && 'Password reset successfully!'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{error}</p>
          </motion.div>
        )}

        {/* Email Step */}
        {step === 'email' && (
          <motion.form onSubmit={handleEmailSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none focus:ring-1 focus:ring-reset-green/50 transition-all"
              />
              <p className="text-gray-500 text-xs mt-2">
                Enter the email address associated with your account
              </p>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-3 bg-reset-green text-black rounded-lg font-bold hover:bg-reset-green/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? 'Sending...' : (
                <>
                  <Mail size={18} />
                  Send Reset Code
                </>
              )}
            </motion.button>
          </motion.form>
        )}

        {/* Verification Step */}
        {step === 'verification' && (
          <motion.form onSubmit={handleVerificationSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Reset Code</label>
              <input
                type="text"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                placeholder="000000"
                maxLength={6}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none focus:ring-1 focus:ring-reset-green/50 transition-all text-center text-2xl tracking-widest font-mono"
              />
              <p className="text-gray-500 text-xs mt-2">
                Enter the 6-digit code sent to your email
              </p>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-3 bg-reset-green text-black rounded-lg font-bold hover:bg-reset-green/80 transition-colors flex items-center justify-center gap-2"
            >
              Verify Code
            </motion.button>
          </motion.form>
        )}

        {/* Password Step */}
        {step === 'password' && (
          <motion.form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none focus:ring-1 focus:ring-reset-green/50 transition-all"
              />
              <p className="text-gray-500 text-xs mt-2">
                At least 6 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none focus:ring-1 focus:ring-reset-green/50 transition-all"
              />
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-3 bg-reset-green text-black rounded-lg font-bold hover:bg-reset-green/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </motion.button>
          </motion.form>
        )}

        {/* Success Step */}
        {step === 'success' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center mb-6"
            >
              <CheckCircle className="w-16 h-16 text-reset-green" />
            </motion.div>
            <p className="text-gray-300 mb-6">
              Your password has been reset successfully. You can now log in with your new password.
            </p>
            <motion.button
              onClick={handleBack}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-3 bg-reset-green text-black rounded-lg font-bold hover:bg-reset-green/80 transition-colors"
            >
              Back to Login
            </motion.button>
          </motion.div>
        )}

        {/* Back Button */}
        {step !== 'success' && (
          <motion.button
            onClick={handleBack}
            className="mt-6 w-full flex items-center justify-center gap-2 text-gray-400 hover:text-reset-green transition-colors"
          >
            <ArrowLeft size={18} />
            {step === 'email' ? 'Back to Sign In' : 'Back'}
          </motion.button>
        )}
      </motion.div>
    </>
  );
}
