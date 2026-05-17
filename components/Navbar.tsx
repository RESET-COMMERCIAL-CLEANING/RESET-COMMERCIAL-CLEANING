'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, LogOut, User, Phone, MessageSquare, Edit } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { logout } from '@/lib/auth';
import { uploadProfilePicture } from '@/lib/storage';
import { updateUser, getUser } from '@/lib/db/users';
import { updateSupportMember, getSupportTeamMember } from '@/lib/db/supportTeam';
import { createTicket, generateTicketNumber } from '@/lib/db/tickets';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportForm, setSupportForm] = useState({ name: '', email: '', message: '' });
  const [supportSubmitted, setSupportSubmitted] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [isSubmittingSupport, setIsSubmittingSupport] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const profilePanelRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);

  const isPortalPage = pathname.includes('/portal/');
  const isAdminPortal = pathname.includes('/portal/admin') || pathname.includes('/portal/superuser-login');
  const isSupportPortal = pathname.includes('/portal/support-member');
  const isSupportLogin = pathname.includes('/portal/support-login');
  const isClientLogin = pathname.includes('/login');
  const isSuperuserLogin = pathname.includes('/superuser-login');
  const isLoginPage = isSupportLogin || isClientLogin || isSuperuserLogin;
  const isAuthenticated = isPortalPage && loggedInUser && !isLoginPage;

  // Get logged-in user from localStorage
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    const userProfile = localStorage.getItem('userProfile');
    const supportMember = localStorage.getItem('supportMember');

    // Priority: support member > regular user > currentUser (admin/superuser)
    if (supportMember && isSupportPortal) {
      // Support member portal - use support member data
      setLoggedInUser(JSON.parse(supportMember));
    } else if (userProfile) {
      // Client or subcontractor - use user profile
      const profile = JSON.parse(userProfile);
      setLoggedInUser({
        id: profile.id,
        name: `${profile.firstName} ${profile.lastName}`,
        email: profile.email,
        company: profile.company || 'N/A',
        avatar: profile.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      });
    } else if (currentUser) {
      // Superuser/Admin
      setLoggedInUser(JSON.parse(currentUser));
    }
  }, [pathname, isSupportPortal]);

  // Click-outside detection for profile panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profilePanelRef.current &&
        profileButtonRef.current &&
        !profilePanelRef.current.contains(event.target as Node) &&
        !profileButtonRef.current.contains(event.target as Node)
      ) {
        setShowProfilePanel(false);
      }
    };

    if (showProfilePanel) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showProfilePanel]);

  const [profile, setProfile] = useState({
    name: '',
    avatar: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    industry: '',
    squareFeet: '',
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

  const handleSaveProfile = async () => {
    if (!loggedInUser?.id) {
      console.error('❌ No logged in user');
      return;
    }

    try {
      console.log('💾 Saving profile for user:', loggedInUser.id);
      setProfile(editProfile);

      // Prepare update data
      const updateData: any = {
        ...(editProfile.name && { name: editProfile.name }),
        ...(editProfile.email && { email: editProfile.email }),
        ...(editProfile.phone && { phone: editProfile.phone }),
        ...(editProfile.company && { company: editProfile.company }),
        ...(editProfile.address && { address: editProfile.address }),
        ...(editProfile.industry && { industry: editProfile.industry }),
        ...(editProfile.squareFeet && { squareFeet: editProfile.squareFeet }),
      };

      // Add avatar if it's a Firebase URL (not a blob)
      if (editProfile.avatar && !editProfile.avatar.startsWith('blob:')) {
        if (isSupportPortal) {
          updateData.avatar = editProfile.avatar;
        } else {
          updateData.avatarUrl = editProfile.avatar;
        }
      }

      console.log('📝 Updating Firestore with:', updateData);

      // Save to Firestore
      if (isSupportPortal) {
        // Support member
        await updateSupportMember(loggedInUser.id, updateData);
      } else {
        // Regular user (client or subcontractor)
        await updateUser(loggedInUser.id, updateData);
      }

      console.log('✅ Profile saved successfully');
      setShowProfileEdit(false);
    } catch (error) {
      console.error('❌ Failed to save profile:', error);
      console.log('Profile save failed, please try again');
    }
  };

  const handleSupportSubmit = async () => {
    if (!supportForm.name.trim() || !supportForm.email.trim() || !supportForm.message.trim()) {
      return;
    }

    if (!loggedInUser?.id) {
      console.error('❌ No logged in user');
      return;
    }

    setIsSubmittingSupport(true);

    try {
      const userType = loggedInUser.role === 'subcontractor' ? 'subcontractor' : 'client';
      const ticketNumber = await generateTicketNumber();

      await createTicket({
        ticketNumber,
        userId: loggedInUser.id,
        userName: supportForm.name,
        userEmail: supportForm.email,
        userType,
        category: 'general',
        subject: 'Support Request',
        message: supportForm.message,
        priority: 'low',
        status: 'unassigned',
        source: 'contact-support',
        attachments: [],
      });

      setSupportSubmitted(true);
      setTimeout(() => {
        setShowSupportModal(false);
        setSupportForm({ name: '', email: '', message: '' });
        setSupportSubmitted(false);
        setIsSubmittingSupport(false);
      }, 2000);
    } catch (error) {
      console.error('❌ Failed to submit support ticket:', error);
      setIsSubmittingSupport(false);
    }
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
        <Link
          href={isSupportPortal ? "/portal/support-member" : "/"}
          className="flex items-center hover:opacity-80 transition-opacity"
        >
          <img
            src="/RESET-COMMERCIAL-CLEANING/logos/reset-logo-horizontal-dark.svg"
            alt="RESET Commercial Cleaning"
            className="h-14 w-auto"
          />
        </Link>

        {/* Desktop Navigation - Hide on portal pages */}
        {!isPortalPage && !isSupportLogin && (
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

        {/* CTA Buttons / Profile Panel - Hide everything on support-login */}
        {!isSupportLogin && (
          <>
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
              ref={profileButtonRef}
              onClick={() => setShowProfilePanel(!showProfilePanel)}
              className="px-2 md:px-4 py-2 rounded-lg bg-reset-green/20 hover:bg-reset-green/30 transition-all duration-300 flex items-center gap-2 text-white font-semibold"
            >
              <img
                src={loggedInUser?.avatar || profile.avatar}
                alt={loggedInUser?.name || profile.name}
                className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover border border-reset-green"
              />
              <span className="hidden md:inline text-sm">{loggedInUser?.name || profile.name}</span>
            </button>

            {/* Profile Panel */}
            <AnimatePresence>
              {showProfilePanel && (
                <motion.div
                  ref={profilePanelRef}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 md:right-0 left-auto md:left-auto top-full mt-2 w-72 md:w-80 bg-gray-950 border-2 border-reset-green/50 rounded-lg shadow-2xl z-50 p-6"
                  style={{
                    backdropFilter: 'blur(10px)',
                    backgroundColor: 'rgba(3, 7, 18, 0.95)',
                  }}
                >
                  {!showProfileEdit ? (
                    <>
                      {/* Profile Header */}
                      <div className="text-center mb-6 pb-6 border-b border-reset-green/20">
                        <img
                          src={loggedInUser?.avatar || profile.avatar}
                          alt={loggedInUser?.name || profile.name}
                          className="w-16 h-16 rounded-lg object-cover border-2 border-reset-green mx-auto mb-3"
                        />
                        <h3 className="text-lg font-bold text-white">{loggedInUser?.name || profile.name}</h3>
                        <p className="text-xs text-gray-400 mt-1">{loggedInUser?.role || loggedInUser?.company || profile.company}</p>
                        <p className="text-xs text-gray-500 mt-2">{loggedInUser?.email || profile.email}</p>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        <button
                          onClick={async () => {
                            if (!loggedInUser?.id) return;
                            try {
                              console.log('📂 Loading profile data from Firestore...');
                              let fullUserData;
                              if (isSupportPortal) {
                                fullUserData = await getSupportTeamMember(loggedInUser.id);
                              } else {
                                fullUserData = await getUser(loggedInUser.id);
                              }
                              if (fullUserData) {
                                console.log('✅ Profile data loaded');
                                const dataToEdit = isSupportPortal
                                  ? fullUserData
                                  : {
                                      name: `${fullUserData.firstName} ${fullUserData.lastName}`,
                                      email: fullUserData.email,
                                      phone: fullUserData.phone,
                                      company: fullUserData.company,
                                      address: fullUserData.address,
                                      industry: fullUserData.industry,
                                      squareFeet: fullUserData.squareFeet,
                                      avatar: fullUserData.avatarUrl || '',
                                    };
                                setEditProfile(dataToEdit);
                                setShowProfileEdit(true);
                              } else {
                                setEditProfile(loggedInUser || profile);
                                setShowProfileEdit(true);
                              }
                            } catch (error) {
                              console.error('❌ Failed to load profile data:', error);
                              setEditProfile(loggedInUser || profile);
                              setShowProfileEdit(true);
                            }
                          }}
                          className="w-full py-2 text-sm text-white bg-reset-green/10 border border-reset-green rounded hover:bg-reset-green/20 transition-colors font-bold flex items-center justify-center gap-2"
                        >
                          <Edit size={14} />
                          Edit Profile
                        </button>
                        {!isAdminPortal && !isSupportPortal && (
                          <button
                            onClick={() => {
                              setShowSupportModal(true);
                              setShowProfilePanel(false);
                            }}
                            className="w-full py-2 text-sm text-white bg-blue-600/20 border border-blue-600/30 rounded hover:bg-blue-600/30 transition-colors font-bold flex items-center justify-center gap-2"
                          >
                            <MessageSquare size={14} />
                            Contact Support
                          </button>
                        )}
                        <button
                          onClick={() => {
                            logout();
                            setShowProfilePanel(false);
                            if (isAdminPortal) {
                              router.push('/portal/superuser-login');
                            } else if (isSupportPortal) {
                              router.push('/portal/support-login');
                            } else {
                              router.push('/');
                            }
                          }}
                          className="w-full py-2 text-sm text-red-400 border border-red-500/30 rounded hover:bg-red-500/10 transition-colors font-bold flex items-center justify-center gap-2 text-center"
                        >
                          <LogOut size={14} />
                          Logout
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Edit Profile Form */}
                      <h3 className="text-lg font-bold text-white mb-6">Edit Profile</h3>
                      <div className="space-y-3 max-h-80 overflow-y-auto">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1 font-bold">Name</label>
                          <input
                            type="text"
                            value={editProfile.name || ''}
                            onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })}
                            className="w-full px-3 py-2 bg-white/5 border border-reset-green/30 rounded text-white text-sm focus:border-reset-green outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1 font-bold">Email</label>
                          <input
                            type="email"
                            value={editProfile.email || ''}
                            onChange={(e) => setEditProfile({ ...editProfile, email: e.target.value })}
                            className="w-full px-3 py-2 bg-white/5 border border-reset-green/30 rounded text-white text-sm focus:border-reset-green outline-none"
                          />
                        </div>
                        {editProfile.phone && (
                          <div>
                            <label className="block text-xs text-gray-400 mb-1 font-bold">Phone</label>
                            <input
                              type="tel"
                              value={editProfile.phone}
                              onChange={(e) => setEditProfile({ ...editProfile, phone: e.target.value })}
                              className="w-full px-3 py-2 bg-white/5 border border-reset-green/30 rounded text-white text-sm focus:border-reset-green outline-none"
                            />
                          </div>
                        )}
                        {editProfile.company && (
                          <div>
                            <label className="block text-xs text-gray-400 mb-1 font-bold">Company</label>
                            <input
                              type="text"
                              value={editProfile.company}
                              onChange={(e) => setEditProfile({ ...editProfile, company: e.target.value })}
                              className="w-full px-3 py-2 bg-white/5 border border-reset-green/30 rounded text-white text-sm focus:border-reset-green outline-none"
                            />
                          </div>
                        )}
                      </div>

                      {/* Edit Form Actions */}
                      <div className="flex gap-2 mt-6">
                        <button
                          onClick={() => {
                            setShowProfileEdit(false);
                            setEditProfile(profile);
                          }}
                          className="flex-1 py-2 text-sm text-reset-green border border-reset-green rounded hover:bg-reset-green/10 transition-colors font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            setProfile(editProfile);
                            setShowProfileEdit(false);
                            setLoggedInUser(editProfile);
                          }}
                          className="flex-1 py-2 text-sm text-black bg-reset-green rounded hover:bg-reset-green/80 transition-colors font-bold"
                        >
                          Save
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
            )}
          </>
        )}

        {/* Mobile/Tablet Menu Button - Only show on non-portal pages */}
        {!isPortalPage && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-reset-green p-2"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}
      </div>

      {/* Mobile Menu - Only show on non-portal pages */}
      <AnimatePresence>
        {isOpen && !isPortalPage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-dark border-t border-reset-green/20 max-h-96 overflow-y-auto"
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

              {!isSupportLogin && (
                <>
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
                      onClick={async () => {
                        if (!loggedInUser?.id) return;
                        try {
                          console.log('📂 Loading profile data from Firestore (mobile)...');
                          let fullUserData;
                          if (isSupportPortal) {
                            fullUserData = await getSupportTeamMember(loggedInUser.id);
                          } else {
                            fullUserData = await getUser(loggedInUser.id);
                          }
                          if (fullUserData) {
                            console.log('✅ Profile data loaded');
                            const dataToEdit = isSupportPortal
                              ? fullUserData
                              : {
                                  name: `${fullUserData.firstName} ${fullUserData.lastName}`,
                                  email: fullUserData.email,
                                  phone: fullUserData.phone,
                                  company: fullUserData.company,
                                  address: fullUserData.address,
                                  industry: fullUserData.industry,
                                  squareFeet: fullUserData.squareFeet,
                                  avatar: fullUserData.avatarUrl || '',
                                };
                            setEditProfile(dataToEdit);
                            setShowProfileEdit(true);
                          } else {
                            setEditProfile(loggedInUser || profile);
                            setShowProfileEdit(true);
                          }
                        } catch (error) {
                          console.error('❌ Failed to load profile data:', error);
                          setEditProfile(loggedInUser || profile);
                          setShowProfileEdit(true);
                        }
                        setIsOpen(false);
                      }}
                      className="w-full py-2 text-sm text-white bg-reset-green/20 border border-reset-green rounded hover:bg-reset-green/30 transition-colors font-bold mb-2"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={() => {
                        setShowSupportModal(true);
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
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Support Modal */}
      <AnimatePresence>
        {showSupportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 w-full min-h-screen bg-black/95 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowSupportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-black border-2 border-blue-600/40 rounded-xl max-w-md w-11/12 sm:w-full shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {supportSubmitted ? (
                <div className="p-6 sm:p-8 text-center py-12">
                  <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <motion.div
                      animate={{ scale: [0.8, 1.2, 1] }}
                      transition={{ duration: 0.6 }}
                      className="text-4xl"
                    >
                      ✓
                    </motion.div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Message Sent!</h3>
                  <p className="text-gray-400">Our support team will get back to you shortly.</p>
                </div>
              ) : (
                <>
                  <div className="p-4 sm:p-6 border-b border-blue-600/20">
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Contact Support</h2>
                  </div>

                  <div className="flex-1 p-4 sm:p-6 space-y-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-gray-400 mb-2">Name</label>
                      <input
                        type="text"
                        value={supportForm.name}
                        onChange={(e) => setSupportForm({ ...supportForm, name: e.target.value })}
                        placeholder="Your name"
                        className="w-full px-3 py-2 rounded bg-white/5 border border-blue-600/30 text-white placeholder-gray-500 focus:border-blue-600 focus:outline-none text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-gray-400 mb-2">Email</label>
                      <input
                        type="email"
                        value={supportForm.email}
                        onChange={(e) => setSupportForm({ ...supportForm, email: e.target.value })}
                        placeholder="your@email.com"
                        className="w-full px-3 py-2 rounded bg-white/5 border border-blue-600/30 text-white placeholder-gray-500 focus:border-blue-600 focus:outline-none text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-gray-400 mb-2">Message</label>
                      <textarea
                        value={supportForm.message}
                        onChange={(e) => setSupportForm({ ...supportForm, message: e.target.value })}
                        placeholder="How can we help?"
                        rows={3}
                        className="w-full px-3 py-2 rounded bg-white/5 border border-blue-600/30 text-white placeholder-gray-500 focus:border-blue-600 focus:outline-none text-sm resize-none"
                      />
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 border-t border-blue-600/20 flex gap-2 sm:gap-3">
                    <button
                      onClick={() => setShowSupportModal(false)}
                      className="flex-1 py-2 text-xs sm:text-sm border border-blue-600 text-blue-600 rounded hover:bg-blue-600/10 transition-colors font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSupportSubmit}
                      disabled={isSubmittingSupport}
                      className="flex-1 py-2 text-xs sm:text-sm bg-blue-600 text-white rounded hover:bg-blue-600/80 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmittingSupport ? 'Sending...' : 'Send'}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
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
            className="fixed top-0 left-0 w-full min-h-screen bg-black/95 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowProfileEdit(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-black border-2 border-reset-green/40 rounded-xl max-w-md w-11/12 sm:w-full shadow-2xl flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 sm:p-6 border-b border-reset-green/20">
                <h2 className="text-xl sm:text-2xl font-bold text-white">Edit Profile</h2>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
                {/* Profile Picture Upload */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-400 mb-2">Profile Picture</label>
                  <div className="flex flex-col gap-2">
                    <img
                      src={editProfile.avatar}
                      alt="Profile preview"
                      className="w-16 h-16 rounded-lg object-cover border-2 border-reset-green"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            // Show preview immediately using blob URL
                            const preview = URL.createObjectURL(file);
                            setEditProfile({ ...editProfile, avatar: preview });

                            // Upload to Firebase Storage in background
                            const userId = loggedInUser?.id || 'unknown';
                            const firebaseUrl = await uploadProfilePicture(userId, file);
                            // Update with actual Firebase URL
                            setEditProfile((prev) => ({ ...prev, avatar: firebaseUrl }));
                          } catch (error) {
                            console.error('Failed to upload profile picture:', error);
                          }
                        }
                      }}
                      className="w-full px-3 py-1.5 rounded bg-white/5 border border-reset-green/30 text-gray-300 text-xs focus:border-reset-green focus:outline-none file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-reset-green file:text-black file:font-bold file:cursor-pointer file:text-xs hover:file:bg-reset-green/80"
                    />
                  </div>
                </div>

                {/* Other Profile Fields */}
                {Object.entries(editProfile).map(([key, value]) => {
                  if (key === 'avatar') return null;
                  return (
                    <div key={key}>
                      <label className="block text-xs sm:text-sm font-bold text-gray-400 mb-1 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <input
                        type="text"
                        value={value as string}
                        onChange={(e) => setEditProfile({ ...editProfile, [key]: e.target.value })}
                        className="w-full px-3 py-1.5 rounded bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none text-xs sm:text-sm"
                      />
                    </div>
                  );
                })}
              </div>

              <div className="p-4 sm:p-6 border-t border-reset-green/20 flex gap-2 sm:gap-3">
                <button
                  onClick={() => setShowProfileEdit(false)}
                  className="flex-1 py-2 text-xs sm:text-sm border border-reset-green text-reset-green rounded hover:bg-reset-green/10 transition-colors font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 py-2 text-xs sm:text-sm bg-reset-green text-black rounded hover:bg-reset-green/80 transition-colors font-bold"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
