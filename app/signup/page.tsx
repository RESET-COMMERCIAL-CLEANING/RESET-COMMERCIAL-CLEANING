'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Building2, Users, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { createUser } from '@/lib/db/users';
import { useToast } from '@/components/Toast';
import { Toast } from '@/components/Toast';

export default function SignupPage() {
  const [selectedRole, setSelectedRole] = useState<'client' | 'subcontractor' | null>(null);

  if (selectedRole === 'client') {
    return <ClientSignupForm onBack={() => setSelectedRole(null)} />;
  }

  if (selectedRole === 'subcontractor') {
    return <SubcontractorSignupForm onBack={() => setSelectedRole(null)} />;
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="block text-white">Join RESET</span>
            <span className="bg-gradient-to-r from-reset-green to-reset-green bg-clip-text text-transparent">Today</span>
          </h1>
          <p className="text-xl text-gray-400">Choose your role to get started</p>
        </motion.div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            onClick={() => setSelectedRole('client')}
            whileHover={{ y: -15, boxShadow: '0 20px 40px rgba(58, 158, 104, 0.2)' }}
            className="group relative p-10 rounded-2xl glass hover:glass-dark transition-all duration-300 text-left border-2 border-reset-green/20 hover:border-reset-green/60 cursor-pointer overflow-hidden h-full flex flex-col"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-reset-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10">
              <div className="w-16 h-16 bg-reset-green/20 group-hover:bg-reset-green/30 rounded-xl flex items-center justify-center mb-6 transition-colors">
                <Building2 className="w-8 h-8 text-reset-green" />
              </div>

              <h2 className="text-3xl font-bold text-white mb-4">Business Owner</h2>
              <p className="text-gray-400 mb-8">Find professional cleaning services</p>

              <div className="space-y-3 mb-8">
                {['Browse services', 'Get quotes', 'Track jobs', 'View reports'].map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-reset-green flex-shrink-0" />
                    <span className="text-gray-300">{f}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-reset-green font-bold group-hover:gap-4 transition-all mt-auto">
                Create Account <ArrowRight size={20} />
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onClick={() => setSelectedRole('subcontractor')}
            whileHover={{ y: -15, boxShadow: '0 20px 40px rgba(58, 158, 104, 0.2)' }}
            className="group relative p-10 rounded-2xl glass hover:glass-dark transition-all duration-300 text-left border-2 border-reset-green/20 hover:border-reset-green/60 cursor-pointer overflow-hidden h-full flex flex-col"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-reset-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10">
              <div className="w-16 h-16 bg-reset-green/20 group-hover:bg-reset-green/30 rounded-xl flex items-center justify-center mb-6 transition-colors">
                <Users className="w-8 h-8 text-reset-green" />
              </div>

              <h2 className="text-3xl font-bold text-white mb-4">Service Provider</h2>
              <p className="text-gray-400 mb-8">Join our cleaning network</p>

              <div className="space-y-3 mb-8">
                {['Find jobs', 'Flexible hours', 'Earn money', 'Build reputation'].map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-reset-green flex-shrink-0" />
                    <span className="text-gray-300">{f}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-reset-green font-bold group-hover:gap-4 transition-all mt-auto">
                Apply Now <ArrowRight size={20} />
              </div>
            </div>
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center pt-8 border-t border-reset-green/20"
        >
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-reset-green hover:underline font-bold">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function ClientSignupForm({ onBack }: { onBack: () => void }) {
  const { toasts, addToast, removeToast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Basic info
    companyName: '',
    email: '',
    phone: '',
    industry: '',
    // Property details
    propertyType: '',
    squareFootage: '',
    propertyFloors: '',
    companySize: '',
    address: '',
    accessRequirements: '',
    // Cleaning requirements
    cleaningFrequency: '',
    preferredTime: '',
    serviceTypes: [] as string[],
    focusAreas: '',
    specialRequirements: '',
    // Billing
    estimatedBudget: '',
    billingPreference: '',
    primaryContactName: '',
    primaryContactPhone: '',
    // Auth
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        serviceTypes: checked
          ? [...prev.serviceTypes, value]
          : prev.serviceTypes.filter(t => t !== value)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.password || formData.password !== formData.confirmPassword) {
      addToast('Passwords do not match', 'error');
      return;
    }

    if (formData.password.length < 6) {
      addToast('Password must be at least 6 characters', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const uid = `client-${Date.now().toString()}`;
      const userData = {
        firstName: formData.companyName.split(' ')[0],
        lastName: formData.companyName.split(' ').slice(1).join(' '),
        email: formData.email,
        phone: formData.phone,
        role: 'client' as const,
        status: 'pending' as const,
        company: formData.companyName,
        address: formData.address,
        squareFeet: formData.squareFootage,
        isVerified: false,
        password: formData.password,
        propertyType: formData.propertyType as any,
        propertyFloors: formData.propertyFloors ? parseInt(formData.propertyFloors) : undefined,
        companySize: formData.companySize as any,
        cleaningFrequency: formData.cleaningFrequency as any,
        preferredTime: formData.preferredTime as any,
        serviceTypes: formData.serviceTypes.join(', '),
        focusAreas: formData.focusAreas,
        specialRequirements: formData.specialRequirements,
        estimatedBudget: formData.estimatedBudget,
        billingPreference: formData.billingPreference as any,
        primaryContactName: formData.primaryContactName,
        primaryContactPhone: formData.primaryContactPhone,
        accessRequirements: formData.accessRequirements,
      };

      await createUser(uid, userData);
      addToast('Account created successfully! Please log in.', 'success');
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      addToast('Failed to create account. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-black pt-32 pb-20 flex items-center justify-center">
        <div className="container max-w-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 bg-reset-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <motion.div
                animate={{ scale: [0.8, 1.2, 1] }}
                transition={{ duration: 0.6 }}
                className="text-5xl"
              >
                ✓
              </motion.div>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Account Created!</h2>
            <p className="text-lg sm:text-xl text-gray-400 mb-4">
              Welcome to RESET Commercial Cleaning.
            </p>
            <p className="text-base sm:text-lg text-gray-400 mb-12">
              Your account has been successfully created. You can now log in and start exploring our services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-reset-green text-black font-bold rounded-lg hover:bg-reset-green/80 transition-all"
              >
                Sign In Now
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 border-2 border-reset-green text-reset-green font-bold rounded-lg hover:bg-reset-green/10 transition-all"
              >
                Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <Toast toasts={toasts} onRemove={removeToast} />
      <div className="container max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white">Create Your Account</h1>
              <p className="text-gray-400 mt-2">Business Owner</p>
            </div>
            <button
              onClick={onBack}
              className="px-4 py-2 text-reset-green border border-reset-green/50 rounded-lg hover:bg-reset-green/10 transition-colors"
            >
              ← Back
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Company Information Section */}
            <div className="bg-white/5 border border-reset-green/20 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Company Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Company Name *</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Your Company Name"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-reset-green transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Industry *</label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-reset-green transition-colors"
                    required
                  >
                    <option value="">Select industry</option>
                    <option value="office">Office</option>
                    <option value="retail">Retail</option>
                    <option value="medical">Medical</option>
                    <option value="warehouse">Warehouse</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="school">School</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="bg-white/5 border border-reset-green/20 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-reset-green transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+61 2 9234 5678"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-reset-green transition-colors"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Property Details Section */}
            <div className="bg-white/5 border border-reset-green/20 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Property Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Property Type *</label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-reset-green transition-colors"
                    required
                  >
                    <option value="">Select property type</option>
                    <option value="office">Office</option>
                    <option value="warehouse">Warehouse</option>
                    <option value="retail">Retail</option>
                    <option value="medical">Medical Facility</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="school">School</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Square Footage *</label>
                  <input
                    type="number"
                    name="squareFootage"
                    value={formData.squareFootage}
                    onChange={handleChange}
                    placeholder="5000"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-reset-green transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Number of Floors</label>
                  <input
                    type="number"
                    name="propertyFloors"
                    value={formData.propertyFloors}
                    onChange={handleChange}
                    placeholder="1"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-reset-green transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Company Size *</label>
                  <select
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-reset-green transition-colors"
                    required
                  >
                    <option value="">Select company size</option>
                    <option value="micro">Micro (less than 10 staff)</option>
                    <option value="small">Small (10-50 staff)</option>
                    <option value="medium">Medium (50-200 staff)</option>
                    <option value="large">Large (200+ staff)</option>
                  </select>
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-bold text-gray-300 mb-2">Business Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street Address"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-reset-green transition-colors"
                  required
                />
              </div>
              <div className="mt-6">
                <label className="block text-sm font-bold text-gray-300 mb-2">Access Requirements</label>
                <textarea
                  name="accessRequirements"
                  value={formData.accessRequirements}
                  onChange={handleChange}
                  placeholder="Security codes, keycard info, special instructions..."
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-reset-green transition-colors h-20"
                />
              </div>
            </div>

            {/* Cleaning Requirements Section */}
            <div className="bg-white/5 border border-reset-green/20 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Cleaning Requirements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Cleaning Frequency *</label>
                  <select
                    name="cleaningFrequency"
                    value={formData.cleaningFrequency}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-reset-green transition-colors"
                    required
                  >
                    <option value="">Select frequency</option>
                    <option value="daily">Daily</option>
                    <option value="twice-weekly">Twice Weekly</option>
                    <option value="weekly">Weekly</option>
                    <option value="bi-weekly">Bi-Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="one-time">One-Time</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Preferred Time *</label>
                  <select
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-reset-green transition-colors"
                    required
                  >
                    <option value="">Select time</option>
                    <option value="early-morning">Early Morning (5-8am)</option>
                    <option value="business-hours">Business Hours (9-5pm)</option>
                    <option value="evening">Evening (6-10pm)</option>
                    <option value="weekend">Weekend</option>
                  </select>
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-bold text-gray-300 mb-3">Service Types</label>
                <div className="space-y-2">
                  {['Standard Clean', 'Deep Clean', 'Carpet/Floors', 'Window Cleaning', 'High-Touch Disinfection'].map(type => (
                    <label key={type} className="flex items-center gap-3 text-gray-300 cursor-pointer">
                      <input
                        type="checkbox"
                        name="serviceTypes"
                        value={type}
                        onChange={handleChange}
                        className="w-4 h-4 accent-reset-green"
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-bold text-gray-300 mb-2">Focus Areas</label>
                <textarea
                  name="focusAreas"
                  value={formData.focusAreas}
                  onChange={handleChange}
                  placeholder="Kitchen, washrooms, conference rooms, etc."
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-reset-green transition-colors h-20"
                />
              </div>
              <div className="mt-6">
                <label className="block text-sm font-bold text-gray-300 mb-2">Special Requirements</label>
                <textarea
                  name="specialRequirements"
                  value={formData.specialRequirements}
                  onChange={handleChange}
                  placeholder="Eco-friendly products, allergies, special instructions..."
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-reset-green transition-colors h-20"
                />
              </div>
            </div>

            {/* Billing Section */}
            <div className="bg-white/5 border border-reset-green/20 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Billing Preferences</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Estimated Budget</label>
                  <input
                    type="text"
                    name="estimatedBudget"
                    value={formData.estimatedBudget}
                    onChange={handleChange}
                    placeholder="e.g. $500-$1000/month"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-reset-green transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Billing Preference</label>
                  <select
                    name="billingPreference"
                    value={formData.billingPreference}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-reset-green transition-colors"
                  >
                    <option value="">Select preference</option>
                    <option value="per-service">Per Service</option>
                    <option value="monthly">Monthly Invoice</option>
                    <option value="quarterly">Quarterly Invoice</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Primary Contact Name</label>
                  <input
                    type="text"
                    name="primaryContactName"
                    value={formData.primaryContactName}
                    onChange={handleChange}
                    placeholder="Contact person name"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-reset-green transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Primary Contact Phone</label>
                  <input
                    type="tel"
                    name="primaryContactPhone"
                    value={formData.primaryContactPhone}
                    onChange={handleChange}
                    placeholder="+61 2 9234 5678"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-reset-green transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="bg-white/5 border border-reset-green/20 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Security</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-reset-green transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Confirm Password *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-reset-green transition-colors"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-reset-green text-black font-bold rounded-lg hover:bg-reset-green/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-lg"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>

            <p className="text-center text-gray-400">
              Already have an account?{' '}
              <Link href="/login" className="text-reset-green hover:underline font-bold">
                Sign in
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

function SubcontractorSignupForm({ onBack }: { onBack: () => void }) {
  const { toasts, addToast, removeToast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Basic info
    fullName: '',
    email: '',
    phone: '',
    // Service profile
    suburb: '',
    serviceAreaKm: '',
    weeklyAvailableHours: '',
    preferredShifts: [] as string[],
    specializations: [] as string[],
    equipmentOwned: '',
    // Compliance
    abn: '',
    hasPublicLiability: 'no',
    liabilityInsuranceExpiry: '',
    liabilityPolicyNumber: '',
    hasPoliceCheck: 'no',
    policeCheckExpiry: '',
    // Rates
    baseHourlyRate: '',
    ecoFriendlyCapable: 'no',
    references: '',
    // Auth
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name.includes('Shifts') ? 'preferredShifts' : 'specializations']: checked
          ? [...prev[name.includes('Shifts') ? 'preferredShifts' : 'specializations'], value]
          : prev[name.includes('Shifts') ? 'preferredShifts' : 'specializations'].filter(t => t !== value)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.password || formData.password !== formData.confirmPassword) {
      addToast('Passwords do not match', 'error');
      return;
    }

    if (formData.password.length < 6) {
      addToast('Password must be at least 6 characters', 'error');
      return;
    }

    if (!formData.abn) {
      addToast('ABN is required', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const uid = `subcontractor-${Date.now().toString()}`;
      const [firstName, ...lastNameParts] = formData.fullName.split(' ');

      const userData = {
        firstName,
        lastName: lastNameParts.join(' '),
        email: formData.email,
        phone: formData.phone,
        role: 'subcontractor' as const,
        status: 'pending' as const,
        isVerified: false,
        password: formData.password,
        // Service profile
        suburb: formData.suburb,
        serviceAreaKm: formData.serviceAreaKm ? parseInt(formData.serviceAreaKm) : undefined,
        weeklyAvailableHours: formData.weeklyAvailableHours ? parseInt(formData.weeklyAvailableHours) : undefined,
        preferredShifts: formData.preferredShifts.join(', '),
        specializations: formData.specializations.join(', '),
        equipmentOwned: formData.equipmentOwned,
        // Compliance
        abn: formData.abn,
        hasPublicLiability: formData.hasPublicLiability === 'yes',
        liabilityInsuranceExpiry: formData.liabilityInsuranceExpiry,
        liabilityPolicyNumber: formData.liabilityPolicyNumber,
        hasPoliceCheck: formData.hasPoliceCheck === 'yes',
        policeCheckExpiry: formData.policeCheckExpiry,
        // Rates
        baseHourlyRate: formData.baseHourlyRate ? parseInt(formData.baseHourlyRate) : undefined,
        ecoFriendlyCapable: formData.ecoFriendlyCapable === 'yes',
        references: formData.references,
      };

      await createUser(uid, userData);
      addToast('Account created successfully! Please log in.', 'success');
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      addToast('Failed to create account. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-black pt-32 pb-20 flex items-center justify-center">
        <div className="container max-w-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 bg-reset-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <motion.div
                animate={{ scale: [0.8, 1.2, 1] }}
                transition={{ duration: 0.6 }}
                className="text-5xl"
              >
                ✓
              </motion.div>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Account Created!</h2>
            <p className="text-lg sm:text-xl text-gray-400 mb-4">
              Welcome to RESET Commercial Cleaning.
            </p>
            <p className="text-base sm:text-lg text-gray-400 mb-12">
              Your account has been successfully created. You can now log in and start finding jobs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-reset-green text-black font-bold rounded-lg hover:bg-reset-green/80 transition-all"
              >
                Sign In Now
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 border-2 border-reset-green text-reset-green font-bold rounded-lg hover:bg-reset-green/10 transition-all"
              >
                Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <Toast toasts={toasts} onRemove={removeToast} />
      <div className="container max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white">Apply to Join RESET</h1>
              <p className="text-gray-400 mt-2">Service Provider</p>
            </div>
            <button
              onClick={onBack}
              className="px-4 py-2 text-reset-green border border-reset-green/50 rounded-lg hover:bg-reset-green/10 transition-colors"
            >
              ← Back
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div className="bg-white/5 border border-reset-green/20 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Your Full Name"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-reset-green transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-reset-green transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+61 2 9234 5678"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-reset-green transition-colors"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Service Profile Section */}
            <div className="bg-white/5 border border-reset-green/20 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Service Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Home Suburb/Area *</label>
                  <input
                    type="text"
                    name="suburb"
                    value={formData.suburb}
                    onChange={handleChange}
                    placeholder="Your suburb"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-reset-green transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Service Area Radius (km)</label>
                  <input
                    type="number"
                    name="serviceAreaKm"
                    value={formData.serviceAreaKm}
                    onChange={handleChange}
                    placeholder="15"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-reset-green transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Weekly Available Hours</label>
                  <input
                    type="number"
                    name="weeklyAvailableHours"
                    value={formData.weeklyAvailableHours}
                    onChange={handleChange}
                    placeholder="40"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-reset-green transition-colors"
                  />
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-bold text-gray-300 mb-3">Preferred Shifts</label>
                <div className="space-y-2">
                  {['Morning', 'Afternoon', 'Evening', 'Weekends'].map(shift => (
                    <label key={shift} className="flex items-center gap-3 text-gray-300 cursor-pointer">
                      <input
                        type="checkbox"
                        name="preferredShifts"
                        value={shift}
                        onChange={handleChange}
                        className="w-4 h-4 accent-reset-green"
                      />
                      {shift}
                    </label>
                  ))}
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-bold text-gray-300 mb-3">Specializations</label>
                <div className="space-y-2">
                  {['Commercial Offices', 'Medical Facilities', 'Warehouses', 'Retail', 'Post-Construction', 'Window Cleaning'].map(spec => (
                    <label key={spec} className="flex items-center gap-3 text-gray-300 cursor-pointer">
                      <input
                        type="checkbox"
                        name="specializations"
                        value={spec}
                        onChange={handleChange}
                        className="w-4 h-4 accent-reset-green"
                      />
                      {spec}
                    </label>
                  ))}
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-bold text-gray-300 mb-2">Equipment You Own</label>
                <textarea
                  name="equipmentOwned"
                  value={formData.equipmentOwned}
                  onChange={handleChange}
                  placeholder="Commercial vacuum, floor polisher, pressure washer, etc."
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-reset-green transition-colors h-20"
                />
              </div>
            </div>

            {/* Compliance Section */}
            <div className="bg-white/5 border border-reset-green/20 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Compliance & Insurance</h2>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">ABN (Australian Business Number) *</label>
                <input
                  type="text"
                  name="abn"
                  value={formData.abn}
                  onChange={handleChange}
                  placeholder="11 123 456 789"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-reset-green transition-colors mb-6"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-300 mb-3">Do you have public liability insurance? *</label>
                <select
                  name="hasPublicLiability"
                  value={formData.hasPublicLiability}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-reset-green transition-colors"
                  required
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              {formData.hasPublicLiability === 'yes' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Insurance Expiry Date</label>
                    <input
                      type="date"
                      name="liabilityInsuranceExpiry"
                      value={formData.liabilityInsuranceExpiry}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-reset-green transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Policy Number</label>
                    <input
                      type="text"
                      name="liabilityPolicyNumber"
                      value={formData.liabilityPolicyNumber}
                      onChange={handleChange}
                      placeholder="Policy number"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-reset-green transition-colors"
                    />
                  </div>
                </div>
              )}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-300 mb-3">Do you have a current police clearance? *</label>
                <select
                  name="hasPoliceCheck"
                  value={formData.hasPoliceCheck}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-reset-green transition-colors"
                  required
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              {formData.hasPoliceCheck === 'yes' && (
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-300 mb-2">Check Expiry Date</label>
                  <input
                    type="date"
                    name="policeCheckExpiry"
                    value={formData.policeCheckExpiry}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-reset-green transition-colors"
                  />
                </div>
              )}
            </div>

            {/* Rates Section */}
            <div className="bg-white/5 border border-reset-green/20 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Rates & Skills</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Base Hourly Rate (AUD) *</label>
                  <input
                    type="number"
                    name="baseHourlyRate"
                    value={formData.baseHourlyRate}
                    onChange={handleChange}
                    placeholder="45"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-reset-green transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-3">Eco-friendly Products? *</label>
                  <select
                    name="ecoFriendlyCapable"
                    value={formData.ecoFriendlyCapable}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-reset-green transition-colors"
                    required
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-bold text-gray-300 mb-2">References (Optional)</label>
                <textarea
                  name="references"
                  value={formData.references}
                  onChange={handleChange}
                  placeholder="Previous employers or professional references"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-reset-green transition-colors h-20"
                />
              </div>
            </div>

            {/* Security Section */}
            <div className="bg-white/5 border border-reset-green/20 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Security</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-reset-green transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Confirm Password *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-reset-green transition-colors"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-reset-green text-black font-bold rounded-lg hover:bg-reset-green/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-lg"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>

            <p className="text-center text-gray-400">
              Already have an account?{' '}
              <Link href="/login" className="text-reset-green hover:underline font-bold">
                Sign in
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
