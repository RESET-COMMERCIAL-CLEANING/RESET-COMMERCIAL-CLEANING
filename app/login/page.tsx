'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Building2, Users, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Toast, useToast } from '@/components/Toast';
import { loginUser } from '@/lib/auth';
import PasswordChange from '@/components/PasswordChange';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function LoginPage() {
  const router = useRouter();
  const { toasts, addToast, removeToast } = useToast();
  const [step, setStep] = useState<'role' | 'email' | 'password' | 'success' | 'changePassword'>('role');
  const [role, setRole] = useState<'client' | 'subcontractor' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [email_error, setEmailError] = useState('');
  const [password_error, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const handleRoleSelect = (selected: 'client' | 'subcontractor') => {
    setRole(selected);
    setStep('email');
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setEmailError('Please enter your email');
      return;
    }
    setEmailError('');
    setStep('password');
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setPasswordError('Please enter your password');
      return;
    }

    setIsLoading(true);
    setPasswordError('');

    try {
      const result = await loginUser(email, password);

      if (result.success && result.user) {
        // Check if password change is required
        if (result.user.requiresPasswordChange) {
          setUserData(result.user);
          setShowPasswordChange(true);
          setIsLoading(false);
        } else {
          setStep('success');
          addToast(`Welcome! Signed in as ${result.user.firstName} ${result.user.lastName}`, 'success', 3000);

          setTimeout(() => {
            const portalUrl = result.user?.role === 'client' ? '/RESET-COMMERCIAL-CLEANING/portal/client' : '/RESET-COMMERCIAL-CLEANING/portal/subcontractor';
            router.push(portalUrl);
          }, 1500);
        }
      } else {
        setPasswordError(result.error || 'Login failed. Please try again.');
        addToast(result.error || 'Login failed. Please try again.', 'error', 5000);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setPasswordError('Login failed. Please try again.');
      addToast('Login failed. Please try again.', 'error', 5000);
      setIsLoading(false);
    }
  };

  const handlePasswordChanged = async (newPassword: string) => {
    if (!userData) return;

    setIsLoading(true);
    try {
      // Update password in Firestore
      const userRef = doc(db, 'users', userData.id);
      await updateDoc(userRef, {
        password: newPassword,
        requiresPasswordChange: false
      });

      // Complete login
      setStep('success');
      addToast(`Welcome! Signed in as ${userData.firstName} ${userData.lastName}`, 'success', 3000);

      setTimeout(() => {
        const portalUrl = userData?.role === 'client' ? '/RESET-COMMERCIAL-CLEANING/portal/client' : '/RESET-COMMERCIAL-CLEANING/portal/subcontractor';
        router.push(portalUrl);
      }, 1500);
    } catch (error) {
      console.error('Failed to update password:', error);
      setPasswordError('Failed to update password. Please try again.');
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'email') setStep('role');
    if (step === 'password') setStep('email');
    if (step === 'success') {
      setStep('role');
      setEmail('');
      setPassword('');
      setRole(null);
    }
  };

  return (
    <>
      <Toast toasts={toasts} onRemove={removeToast} />
      <div className="min-h-screen bg-black pt-32 pb-20 flex items-center justify-center">
      <div className="container max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Sign In</h1>
            <p className="text-gray-400">Access your RESET account</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8 flex justify-center gap-2">
            {['role', 'email', 'password', 'success'].map((s) => (
              <motion.div
                key={s}
                className={`h-2 rounded-full transition-all ${
                  ['role', 'email', 'password', 'success'].indexOf(s) < ['role', 'email', 'password', 'success'].indexOf(step)
                    ? 'bg-reset-green w-6'
                    : s === step
                    ? 'bg-reset-green w-8'
                    : 'bg-reset-green/20 w-6'
                }`}
              />
            ))}
          </div>

          {/* Question-based Flow */}
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white/5 border border-reset-green/30 rounded-2xl p-8 mb-6"
          >
            {step === 'role' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-8">What type of account do you have?</h2>
                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRoleSelect('client')}
                    className="w-full p-6 rounded-xl border-2 border-reset-green/30 hover:border-reset-green hover:bg-reset-green/5 transition-all text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-reset-green/20 rounded-lg flex items-center justify-center group-hover:bg-reset-green/30 transition-colors">
                        <Building2 className="w-6 h-6 text-reset-green" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">I'm a Business</h3>
                        <p className="text-sm text-gray-400">Corporate or commercial account</p>
                      </div>
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRoleSelect('subcontractor')}
                    className="w-full p-6 rounded-xl border-2 border-reset-green/30 hover:border-reset-green hover:bg-reset-green/5 transition-all text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-reset-green/20 rounded-lg flex items-center justify-center group-hover:bg-reset-green/30 transition-colors">
                        <Users className="w-6 h-6 text-reset-green" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">I'm a Service Provider</h3>
                        <p className="text-sm text-gray-400">Cleaner or subcontractor account</p>
                      </div>
                    </div>
                  </motion.button>
                </div>
              </div>
            )}

            {step === 'email' && (
              <form onSubmit={handleEmailSubmit}>
                <h2 className="text-2xl font-bold text-white mb-2">What's your email address?</h2>
                <p className="text-gray-400 mb-6">
                  {role === 'client' ? 'Business account email' : 'Your registered email'}
                </p>

                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError('');
                    }}
                    placeholder="your@email.com"
                    className="w-full px-5 py-4 rounded-lg bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none focus:ring-1 focus:ring-reset-green/50 transition-all text-lg"
                    autoFocus
                  />
                  {email_error && <p className="text-red-400 text-sm mt-2">{email_error}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full mt-6 py-4 bg-reset-green text-black font-bold rounded-lg hover:bg-opacity-80 transition-all glow-green-hover"
                >
                  Continue <ArrowRight className="inline ml-2" size={18} />
                </button>
              </form>
            )}

            {step === 'password' && (
              <>
                {showPasswordChange && userData ? (
                  <PasswordChange
                    tempPassword={password}
                    onPasswordChanged={handlePasswordChanged}
                    isLoading={isLoading}
                  />
                ) : (
                  <form onSubmit={handlePasswordSubmit}>
                    <h2 className="text-2xl font-bold text-white mb-2">Enter your password</h2>
                    <p className="text-gray-400 mb-6 text-sm">{email}</p>

                    {password_error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex gap-2"
                      >
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-red-400 text-sm">{password_error}</p>
                      </motion.div>
                    )}

                    <div>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setPasswordError('');
                        }}
                        placeholder="••••••••"
                        className="w-full px-5 py-4 rounded-lg bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none focus:ring-1 focus:ring-reset-green/50 transition-all text-lg"
                        autoFocus
                        disabled={isLoading}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full mt-6 py-4 bg-reset-green text-black font-bold rounded-lg hover:bg-opacity-80 transition-all glow-green-hover disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <span className="animate-spin inline-block mr-2">⏳</span>
                          Signing in...
                        </>
                      ) : (
                        <>
                          Sign In <ArrowRight className="inline ml-2" size={18} />
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleBack}
                      className="block text-center text-reset-green text-sm font-bold mt-4 hover:underline w-full"
                    >
                      ← Back
                    </button>
                  </form>
                )}
              </>
            )}

            {step === 'success' && (
              <div className="text-center">
                <div className="w-16 h-16 bg-reset-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <motion.div
                    animate={{ scale: [0.8, 1.2, 1] }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl"
                  >
                    ✓
                  </motion.div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Welcome back!</h2>
                <p className="text-gray-400 mb-6">You're now signed in to your {role === 'client' ? 'business' : 'provider'} account</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => {
                    setStep('role');
                    setEmail('');
                    setPassword('');
                    setRole(null);
                  }}
                  className="text-reset-green font-bold hover:underline"
                >
                  Sign in with different account
                </motion.button>
              </div>
            )}
          </motion.div>

          {/* Navigation Buttons */}
          {step !== 'success' && (
            <div className="flex gap-4">
              {step !== 'role' && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={handleBack}
                  className="flex-1 py-3 rounded-lg border-2 border-reset-green text-reset-green font-bold hover:bg-reset-green/10 transition-all"
                >
                  Back
                </motion.button>
              )}
            </div>
          )}

          {/* Sign up link */}
          <p className="text-center text-gray-400 mt-8">
            Don't have an account?{' '}
            <Link href="/signup" className="text-reset-green hover:underline font-bold">
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
      </div>
    </>
  );
}
