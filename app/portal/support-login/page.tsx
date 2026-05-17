'use client';

import { motion } from 'framer-motion';
import { LogIn, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/auth';
import { collection, query, where, getDocs, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import PasswordChange from '@/components/PasswordChange';
import { verifyPassword, encryptPassword } from '@/lib/crypto';

export default function SupportLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [memberData, setMemberData] = useState<any>(null);

  // Clear any existing session on page load
  useEffect(() => {
    logout();
  }, []);

  const handlePasswordChanged = async (newPassword: string) => {
    if (!memberData) {
      console.error('❌ No member data available');
      setError('Session error. Please login again.');
      return;
    }

    setIsLoading(true);
    try {
      console.log('🔄 Updating password for member:', {
        memberId: memberData.id,
        memberName: memberData.name,
        memberEmail: memberData.email
      });

      // Encrypt the new password
      const encryptedPassword = encryptPassword(newPassword);

      // Update password in Firestore and mark password change as complete
      const memberRef = doc(db, 'supportTeam', memberData.id);
      const updateData = {
        password: encryptedPassword,
        requiresPasswordChange: false,
        passwordChangedAt: Timestamp.now(),
      };

      console.log('📝 Updating Firestore with encrypted password');
      await updateDoc(memberRef, updateData);

      console.log('✅ Password updated successfully in Firestore');

      // Complete login with new password
      const sessionData = {
        id: memberData.id,
        name: memberData.name,
        email: memberData.email,
        role: memberData.role,
        username: memberData.username,
      };

      console.log('💾 Saving session:', sessionData);
      localStorage.setItem('supportMember', JSON.stringify(sessionData));

      console.log('🔀 Redirecting to support dashboard...');
      setIsLoading(false);

      // Delay redirect slightly to ensure Firestore update is complete
      setTimeout(() => {
        router.push('/portal/support-member');
      }, 500);
    } catch (error) {
      console.error('❌ Failed to update password:', error);
      setError('Failed to update password. Please try again.');
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      setIsLoading(false);
      return;
    }

    try {
      // Query Firestore for support member with matching email
      const supportTeamRef = collection(db, 'supportTeam');
      const q = query(
        supportTeamRef,
        where('email', '==', email.toLowerCase())
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setError('Invalid email or password');
        setIsLoading(false);
        return;
      }

      const member = snapshot.docs[0].data();
      const memberId = snapshot.docs[0].id;

      // Check if password matches (either temp password or regular password)
      const tempPasswordMatch = member.tempPassword && verifyPassword(password, member.tempPassword);
      const passwordMatch = member.password && verifyPassword(password, member.password);

      if (!tempPasswordMatch && !passwordMatch) {
        setError('Invalid email or password');
        setIsLoading(false);
        return;
      }

      console.log('🔐 Support member found:', {
        name: member.name,
        email: member.email,
        requiresPasswordChange: member.requiresPasswordChange,
        usedTempPassword: tempPasswordMatch,
        memberId
      });

      // Check if password change is required (first login)
      if (member.requiresPasswordChange === true) {
        console.log('⚠️ Password change REQUIRED - showing password change form');
        setMemberData({ ...member, id: memberId });
        setShowPasswordChange(true);
        setIsLoading(false);
      } else {
        console.log('✅ Password already changed, completing login');
        // Complete login
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
      }
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
          {showPasswordChange && memberData ? (
            <PasswordChange
              tempPassword={password}
              onPasswordChanged={handlePasswordChanged}
              isLoading={isLoading}
            />
          ) : (
            <>
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
            {/* Email Input */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
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
                    <p className="text-gray-300 font-bold mb-1">👤 John Support</p>
                    <p>Email: <span className="text-reset-green">john.support@reset.com</span></p>
                    <p>Password: <span className="text-reset-green">Support@123!</span></p>
                  </div>
                  <div>
                    <p className="text-gray-300 font-bold mb-1">👤 Maria Support</p>
                    <p>Email: <span className="text-reset-green">maria.support@reset.com</span></p>
                    <p>Password: <span className="text-reset-green">Support@456!</span></p>
                  </div>
                  <div>
                    <p className="text-gray-300 font-bold mb-1">👤 Alex Chen (Senior Support)</p>
                    <p>Email: <span className="text-reset-green">alex.chen@reset.com</span></p>
                    <p>Password: <span className="text-reset-green">Support@789!</span></p>
                  </div>
                  <div>
                    <p className="text-gray-300 font-bold mb-1">👤 Sarah Williams</p>
                    <p>Email: <span className="text-reset-green">sarah.williams@reset.com</span></p>
                    <p>Password: <span className="text-reset-green">Support@234!</span></p>
                  </div>
                  <div>
                    <p className="text-gray-300 font-bold mb-1">👤 David Lee (Support Lead)</p>
                    <p>Email: <span className="text-reset-green">david.lee@reset.com</span></p>
                    <p>Password: <span className="text-reset-green">Support@567!</span></p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Info */}
        <div className="text-center mt-8 text-xs text-gray-500">
          <p>If you don't have login credentials, please contact your superuser administrator.</p>
        </div>
      </motion.div>
    </div>
  );
}
