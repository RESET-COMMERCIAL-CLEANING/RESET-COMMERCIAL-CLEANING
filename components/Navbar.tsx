'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { label: 'Services', href: '/services' },
    { label: 'About', href: '/about' },
    { label: 'Journey', href: '/journey' },
    { label: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
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
            src="/logos/reset-logo-horizontal-dark.svg"
            alt="RESET Commercial Cleaning"
            className="h-14 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
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

        {/* CTA Buttons */}
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

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-reset-green p-2"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden glass-dark border-t border-reset-green/20"
        >
          <div className="container py-4 flex flex-col gap-4">
            {navItems.map((item) => (
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
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
