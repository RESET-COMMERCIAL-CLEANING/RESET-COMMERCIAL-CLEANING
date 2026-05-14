'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Services', href: '#services' },
        { label: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'Client',
      links: [
        { label: 'Get Quote', href: '/quote' },
        { label: 'Client Portal', href: '/client' },
        { label: 'Book Cleaning', href: '/book' },
      ],
    },
    {
      title: 'Partner',
      links: [
        { label: 'Join Team', href: '/subcontractor' },
        { label: 'Subcontractor Portal', href: '/subcontractor-portal' },
        { label: 'Partner Program', href: '/partner' },
      ],
    },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-black border-t border-reset-green/20"
    >
      <div className="container section">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-4">
              <img
                src="/logos/reset-logo-horizontal-dark.svg"
                alt="RESET Commercial Cleaning"
                className="h-8 w-auto"
              />
            </div>
            <p className="text-gray-400 text-sm">
              Premium commercial cleaning. We don't just clean. We Reset.
            </p>
          </motion.div>

          {/* Links */}
          {footerLinks.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: (i + 1) * 0.1 }}
            >
              <h4 className="font-bold text-white mb-4">{section.title}</h4>
              <div className="flex flex-col gap-2">
                {section.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-gray-400 hover:text-reset-green transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-reset-green/20 pt-8 flex items-center justify-between flex-col md:flex-row gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} RESET Commercial Cleaning. All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
