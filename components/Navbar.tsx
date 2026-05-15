'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, LogOut, User, Phone, MessageSquare } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const pathname = usePathname();

  const isPortalPage = pathname.includes('/portal/');
  const isAuthenticated = isPortalPage;

  const [profile, setProfile] = useState({
    company: 'Tech Startup HQ',
    email: 'admin@techstartuphq.com',
    phone: '+61 2 9234 5678',
    address: '123 Tech Street, Sydney NSW 2000',
    industry: 'Technology',
    squareFeet: '5,000 sqft',
  });

  const [editProfile, setEditProfile] = useState(profile);

  const navItems = [
    { label: 'Services', href: '/services' },
    { label: 'About', href: '/about' },
    { label: 'Journey', href: '/journey' },
    { label: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  const handleSaveProfile = () => {
    setProfile(editProfile);
    setShowProfileEdit(false);
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 w-full z-50 glass-dark border-b border-reset-green/20"
    >
      <div className="container flex items-center justify-between h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
          <img
            src="/RESET-COMMERCIAL-CLEANING/logos/reset-logo-horizontal-dark.svg"
            alt="RESET Commercial Cleaning"
            className="h-14 w-auto"
          />
        </Link>

        {/* Desktop Navigation - Hide on portal pages */}
        {!isPortalPage && (
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`font-medium transition-colors duration-300 ${
                  isActive(item.href)
                    ? 'text-reset-green border-b-2 border-reset-green pb-1'
                    : 'text-gray-300 hover:text-reset-green'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}

        {/* CTA Buttons / Profile Panel */}
        {!isAuthenticated ? (
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg border border-reset-green text-reset-green font-semibold hover:bg-reset-green/10 transition-all duration-300"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-6 py-2 rounded-lg bg-reset-green text-black font-bold hover:bg-opacity-80 transition-all duration-300 glow-green-hover"
            >
              Sign Up
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-2 relative">
            <button
              onClick={() => setShowProfilePanel(!showProfilePanel)}
              className="p-2 md:px-4 md:py-2 rounded-lg bg-reset-green/20 text-reset-green font-semibold hover:bg-reset-green/30 transition-all duration-300 flex items-center gap-2"
            >
              <User size={16} />
              <span className="hidden md:inline">Profile</span>
            </button>

            {/* Profile Panel */}
            <AnimatePresence>
              {showProfilePanel && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 bg-gray-950 border-2 border-reset-green/50 rounded-lg shadow-2xl z-50 p-6"
                  style={{
                    backdropFilter: 'blur(10px)',
                    backgroundColor: 'rgba(3, 7, 18, 0.95)',
                  }}
                >
                  {/* Profile Header */}
                  <div className="text-center mb-6 pb-6 border-b border-reset-green/20">
                    <div className="w-16 h-16 bg-reset-green/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <User className="w-8 h-8 text-reset-green" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{profile.company}</h3>
                    <p className="text-xs text-gray-400 mt-1">{profile.industry} • {profile.squareFeet}</p>
                    <p className="text-xs text-gray-500 mt-2">{profile.email}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        setEditProfile(profile);
                        setShowProfileEdit(true);
                        setShowProfilePanel(false);
                      }}
                      className="w-full py-2 text-sm text-white bg-reset-green/10 border border-reset-green rounded hover:bg-reset-green/20 transition-colors font-bold"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={() => {
                        alert('Connecting to support...');
                        setShowProfilePanel(false);
                      }}
                      className="w-full py-2 text-sm text-white bg-blue-600/20 border border-blue-600/30 rounded hover:bg-blue-600/30 transition-colors font-bold flex items-center justify-center gap-2"
                    >
                      <MessageSquare size={14} />
                      Contact Support
                    </button>
                    <Link
                      href="/"
                      onClick={() => setShowProfilePanel(false)}
                      className="w-full py-2 text-sm text-red-400 border border-red-500/30 rounded hover:bg-red-500/10 transition-colors font-bold flex items-center justify-center gap-2 text-center"
                    >
                      <LogOut size={14} />
                      Logout
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Mobile/Tablet Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-reset-green p-2"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-dark border-t border-reset-green/20"
          >
            <div className="container py-4 flex flex-col gap-4">
              {!isPortalPage && navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`transition-colors py-2 font-medium ${
                    isActive(item.href)
                      ? 'text-reset-green border-l-4 border-reset-green pl-2'
                      : 'text-gray-300 hover:text-reset-green pl-2'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {!isAuthenticated ? (
                <>
                  <Link
                    href="/login"
                    className="px-6 py-2 rounded-lg border border-reset-green text-reset-green font-bold text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="px-6 py-2 rounded-lg bg-reset-green text-black font-bold text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <div className="bg-reset-green/10 border border-reset-green/20 rounded-lg p-4 mt-4">
                    <div className="text-center mb-4">
                      <div className="w-12 h-12 bg-reset-green/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <User className="w-6 h-6 text-reset-green" />
                      </div>
                      <p className="text-sm font-bold text-white">{profile.company}</p>
                      <p className="text-xs text-gray-400">{profile.industry}</p>
                    </div>
                    <button
                      onClick={() => {
                        setEditProfile(profile);
                        setShowProfileEdit(true);
                        setIsOpen(false);
                      }}
                      className="w-full py-2 text-sm text-white bg-reset-green/20 border border-reset-green rounded hover:bg-reset-green/30 transition-colors font-bold mb-2"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={() => {
                        alert('Connecting to support...');
                        setIsOpen(false);
                      }}
                      className="w-full py-2 text-sm text-white bg-blue-600/20 border border-blue-600/30 rounded hover:bg-blue-600/30 transition-colors font-bold flex items-center justify-center gap-2 mb-2"
                    >
                      <Phone size={14} />
                      Support
                    </button>
                    <Link
                      href="/"
                      className="w-full py-2 text-sm text-red-400 border border-red-500/30 rounded hover:bg-red-500/10 transition-colors font-bold flex items-center justify-center gap-2 text-center"
                      onClick={() => setIsOpen(false)}
                    >
                      <LogOut size={14} />
                      Logout
                    </Link>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Edit Modal */}
      <AnimatePresence>
        {showProfileEdit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto"
            onClick={() => setShowProfileEdit(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-black border border-reset-green/30 rounded-xl p-6 sm:p-8 max-w-md w-full mx-4 shadow-2xl my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-white mb-6">Edit Profile</h2>
              <div className="space-y-4">
                {Object.entries(editProfile).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-bold text-gray-400 mb-2 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <input
                      type="text"
                      value={value as string}
                      onChange={(e) => setEditProfile({ ...editProfile, [key]: e.target.value })}
                      className="w-full px-4 py-2 rounded bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none"
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setShowProfileEdit(false)}
                  className="flex-1 py-2 border border-reset-green text-reset-green rounded hover:bg-reset-green/10 transition-colors font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 py-2 bg-reset-green text-black rounded hover:bg-reset-green/80 transition-colors font-bold"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
