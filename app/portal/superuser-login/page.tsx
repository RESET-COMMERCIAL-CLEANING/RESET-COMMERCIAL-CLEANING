'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { loginSuperuser } from '@/lib/auth';

export default function SuperuserLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = loginSuperuser(email, password);
      if (success) {
        router.push('/portal/admin');
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 flex items-center justify-center">
      <div className="container max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-2">Superuser Portal</h1>
            <p className="text-gray-400">Admin Access Only</p>
          </div>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="p-8 rounded-xl glass border border-reset-green/30"
          >
            <div className="mb-6 pb-6 border-b border-reset-green/20">
              <p className="text-gray-400 text-sm">
                🔐 <strong>Secure Admin Access</strong>
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Only authorized superusers can access the admin dashboard and manage support tickets.
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

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@reset.com.au"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none focus:ring-1 focus:ring-reset-green/50 transition-all text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none focus:ring-1 focus:ring-reset-green/50 transition-all text-base"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-reset-green text-black font-bold rounded-lg hover:bg-opacity-80 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In as Superuser
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-8 pt-8 border-t border-reset-green/20">
              <p className="text-gray-500 text-xs mb-3 font-bold">DEMO CREDENTIALS:</p>
              <div className="space-y-2 text-xs text-gray-400 bg-black/50 p-3 rounded border border-reset-green/10">
                <p>
                  <span className="text-gray-300">Email:</span> admin@reset.com.au
                </p>
                <p>
                  <span className="text-gray-300">Password:</span> Reset@Admin123!
                </p>
                <p className="text-yellow-600 mt-2">
                  ⚠️ In production, use secure authentication with your backend system.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 p-6 bg-blue-500/10 border border-blue-500/20 rounded-xl"
          >
            <h3 className="text-white font-bold mb-3 text-sm">What is the Superuser Portal?</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>✓ Manage all support tickets from users</li>
              <li>✓ Respond to and resolve issues</li>
              <li>✓ Track ticket status and priority</li>
              <li>✓ View statistics and analytics</li>
              <li>✓ Handle billing, technical, and quality issues</li>
            </ul>
          </motion.div>

          {/* Back Link */}
          <div className="text-center mt-8">
            <a href="/" className="text-reset-green hover:underline font-bold text-sm">
              ← Back to Home
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
