'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut, Menu, X, Lock, MessageSquare, Users, Calendar, TrendingUp, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import { logout } from '@/lib/auth';
import { buttonHoverVariants } from '@/lib/animations';

interface PortalNavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  requiredRole?: string[];
}

const PORTAL_ITEMS: PortalNavItem[] = [
  { label: 'Support Tickets', path: '/portal/admin#tickets', icon: <MessageSquare size={18} /> },
  { label: 'Users', path: '/portal/admin#users', icon: <Users size={18} /> },
  { label: 'Support Team', path: '/portal/admin#support-team', icon: <Users size={18} /> },
  { label: 'Superusers', path: '/portal/admin#superusers', icon: <Lock size={18} /> },
  { label: 'Contracts', path: '/portal/admin#contracts', icon: <BarChart3 size={18} /> },
  { label: 'Schedule', path: '/portal/admin#schedule', icon: <Calendar size={18} /> },
  { label: 'P&L Analysis', path: '/portal/admin#profit-analysis', icon: <TrendingUp size={18} /> },
];

export function PortalNavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/portal/superuser-login');
  };

  const handleNavClick = (path: string) => {
    setIsOpen(false);
    // Extract the section from the path
    const [pagePath, section] = path.split('#');
    if (section) {
      // Navigate and trigger the tab change via URL hash
      router.push(path);
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 bg-black/95 backdrop-blur border-b border-reset-green/20"
    >
      <div className="container px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <Link href="/portal/admin">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <span className="text-reset-green font-bold text-lg">⚡ RESET</span>
              <span className="text-gray-400 text-sm hidden md:inline">Admin Portal</span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {PORTAL_ITEMS.map((item) => (
              <motion.button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                variants={buttonHoverVariants}
                whileHover="hover"
                whileTap="tap"
                className="px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-reset-green hover:bg-reset-green/10 transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                {item.icon}
                <span className="hidden xl:inline">{item.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="lg:hidden p-2 rounded-lg hover:bg-reset-green/10 transition-colors text-gray-300 hover:text-reset-green"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>

            {/* Logout Button */}
            <motion.button
              onClick={handleLogout}
              variants={buttonHoverVariants}
              whileHover="hover"
              whileTap="tap"
              className="px-4 py-2 rounded-lg text-sm text-gray-300 hover:text-reset-green hover:bg-reset-green/10 transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-reset-green/20 mt-4 pt-4"
          >
            <div className="space-y-2">
              {PORTAL_ITEMS.map((item) => (
                <motion.button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  whileHover={{ x: 5 }}
                  className="w-full px-4 py-3 rounded-lg text-sm text-gray-300 hover:text-reset-green hover:bg-reset-green/10 transition-colors flex items-center gap-3"
                >
                  {item.icon}
                  {item.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
