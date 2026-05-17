'use client';

import { motion } from 'framer-motion';
import { LogIn, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function SupportLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Clear any existing session on page load
  useEffect(() => {
    logout();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      setIsLoading(false);
      return;
    }

    try {
      // Query Firestore for support member with matching username and password
      const supportTeamRef = collection(db, 'supportTeam');
      const q = query(
        supportTeamRef,
        where('username', '==', username),
        where('password', '==', password)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setError('Invalid username or password');
        setIsLoading(false);
        return;
      }

      const member = snapshot.docs[0].data();
      const memberId = snapshot.docs[0].id;

      // Store member in localStorage
      localStorage.setItem(
        'supportMember',
        JSON.stringify({
          id: memberId,
          name: member.name,
          email: member.email,
          role: member.role,
          username: member.username,
        })
      );

      router.push('/portal/support-member');
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 pt-40">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo/Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-reset-green mb-2">Support Team</h1>
          <h2 className="text-3xl font-bold text-white mb-4">Portal Login</h2>
          <p className="text-gray-400">Enter your credentials provided by your superuser</p>
        </motion.div>

        {/* Form Card */}
        <div className="glass border border-reset-green/20 p-8 space-y-6">
          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-red-600/20 border border-red-500/30 rounded-lg flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username Input */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none transition-colors"
                disabled={isLoading}
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none transition-colors"
                disabled={isLoading}
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-reset-green text-black rounded-lg hover:bg-reset-green/80 transition-colors font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  Access Portal
                </>
              )}
            </button>
          </form>

          {/* Demo Info */}
          <div className="p-4 glass border border-reset-green/20 max-h-64 overflow-y-auto">
            <p className="text-xs text-gray-400 mb-3 font-bold">DEMO CREDENTIALS (5 TEAM MEMBERS):</p>
            <div className="space-y-3 text-xs text-gray-400">
              <div>
                <p className="text-gray-300 font-bold mb-1">👤 John Support (Support)</p>
                <p>Username: <span className="text-reset-green">john.support</span></p>
                <p>Password: <span className="text-reset-green">Support@123!</span></p>
              </div>
              <div>
                <p className="text-gray-300 font-bold mb-1">👤 Maria Support (Support)</p>
                <p>Username: <span className="text-reset-green">maria.support</span></p>
                <p>Password: <span className="text-reset-green">Support@456!</span></p>
              </div>
              <div>
                <p className="text-gray-300 font-bold mb-1">👤 Alex Chen (Senior Support)</p>
                <p>Username: <span className="text-reset-green">alex.chen</span></p>
                <p>Password: <span className="text-reset-green">Support@789!</span></p>
              </div>
              <div>
                <p className="text-gray-300 font-bold mb-1">👤 Sarah Williams (Support)</p>
                <p>Username: <span className="text-reset-green">sarah.williams</span></p>
                <p>Password: <span className="text-reset-green">Support@234!</span></p>
              </div>
              <div>
                <p className="text-gray-300 font-bold mb-1">👤 David Lee (Support Lead)</p>
                <p>Username: <span className="text-reset-green">david.lee</span></p>
                <p>Password: <span className="text-reset-green">Support@567!</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="text-center mt-8 text-xs text-gray-500">
          <p>If you don't have login credentials, please contact your superuser administrator.</p>
        </div>
      </motion.div>
    </div>
  );
}
