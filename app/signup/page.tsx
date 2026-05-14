'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Building2, Users, ArrowRight, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function SignupPage() {
  const [selectedRole, setSelectedRole] = useState<'client' | 'subcontractor' | null>(null);

  if (selectedRole === 'client') {
    return <ClientSignupForm />;
  }

  if (selectedRole === 'subcontractor') {
    return <SubcontractorSignupForm />;
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
            <span className="gradient-text">Today</span>
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
            whileHover={{ y: -15, boxShadow: '0 20px 40px rgba(124, 255, 79, 0.2)' }}
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
            whileHover={{ y: -15, boxShadow: '0 20px 40px rgba(124, 255, 79, 0.2)' }}
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

function ClientSignupForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    address: '',
    industry: '',
    squareFootage: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Account created successfully!');
  };

  const questions = [
    {
      title: "What's your company name?",
      field: 'companyName',
      type: 'text',
      placeholder: 'Your Company Name',
    },
    {
      title: 'What industry are you in?',
      field: 'industry',
      type: 'select',
      options: ['Office', 'Retail', 'Medical', 'Warehouse', 'Other'],
    },
    {
      title: "What's your email address?",
      field: 'email',
      type: 'email',
      placeholder: 'your@email.com',
    },
    {
      title: 'What is your phone number?',
      field: 'phone',
      type: 'tel',
      placeholder: '+61 2 9234 5678',
    },
    {
      title: 'What is your business address?',
      field: 'address',
      type: 'text',
      placeholder: 'Street Address',
    },
    {
      title: 'How large is your space?',
      description: '(in square feet)',
      field: 'squareFootage',
      type: 'number',
      placeholder: '5000',
    },
    {
      title: 'Create a password',
      field: 'password',
      type: 'password',
      placeholder: '••••••••',
    },
    {
      title: 'Confirm your password',
      field: 'confirmPassword',
      type: 'password',
      placeholder: '••••••••',
    },
  ];

  const currentQuestion = questions[step - 1];

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 flex items-center justify-center">
      <div className="container max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Create Your Account</h1>
            <p className="text-gray-400">Question {step} of {questions.length}</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-10 w-full bg-reset-green/10 rounded-full h-2">
            <motion.div
              className="bg-reset-green h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(step / questions.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Question Card */}
          <motion.form
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={(e) => {
              e.preventDefault();
              if (step < questions.length) {
                setStep(step + 1);
              } else {
                handleSubmit(e);
              }
            }}
            className="bg-white/5 border border-reset-green/30 rounded-2xl p-8 mb-6"
          >
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {currentQuestion.title}
              </h2>
              {currentQuestion.description && (
                <p className="text-gray-400 text-sm">{currentQuestion.description}</p>
              )}
            </div>

            {currentQuestion.type === 'select' ? (
              <select
                name={currentQuestion.field}
                value={formData[currentQuestion.field as keyof typeof formData]}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-lg bg-white/5 border border-reset-green/30 text-white focus:border-reset-green focus:outline-none focus:ring-1 focus:ring-reset-green/50 transition-all text-lg"
                autoFocus
                required
              >
                <option value="">Select an option</option>
                {currentQuestion.options?.map((opt) => (
                  <option key={opt} value={opt.toLowerCase()}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={currentQuestion.type}
                name={currentQuestion.field}
                value={formData[currentQuestion.field as keyof typeof formData]}
                onChange={handleChange}
                placeholder={currentQuestion.placeholder}
                className="w-full px-5 py-4 rounded-lg bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none focus:ring-1 focus:ring-reset-green/50 transition-all text-lg"
                autoFocus
                required
              />
            )}

            <button
              type="submit"
              className="w-full mt-8 py-4 bg-reset-green text-black font-bold rounded-lg hover:bg-opacity-80 transition-all glow-green-hover text-lg"
            >
              {step < questions.length ? (
                <>
                  Next <ArrowRight className="inline ml-2" size={20} />
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </motion.form>

          {/* Navigation */}
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="w-full py-3 text-reset-green font-bold hover:underline"
            >
              ← Back
            </button>
          )}

          <p className="text-center text-gray-400 mt-8">
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

function SubcontractorSignupForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    experience: '',
    availability: '',
    certifications: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Application submitted successfully!');
  };

  const questions = [
    {
      title: "What's your full name?",
      field: 'fullName',
      type: 'text',
      placeholder: 'Your Full Name',
    },
    {
      title: 'What is your email address?',
      field: 'email',
      type: 'email',
      placeholder: 'your@email.com',
    },
    {
      title: 'What is your phone number?',
      field: 'phone',
      type: 'tel',
      placeholder: '+61 2 9234 5678',
    },
    {
      title: 'How many years of experience do you have?',
      field: 'experience',
      type: 'select',
      options: ['0-1 years', '1-3 years', '3-5 years', '5+ years'],
    },
    {
      title: 'What is your availability?',
      field: 'availability',
      type: 'select',
      options: ['Full-time', 'Part-time', 'Weekends Only', 'Flexible'],
    },
    {
      title: 'Do you have any certifications?',
      description: '(Optional)',
      field: 'certifications',
      type: 'textarea',
      placeholder: 'List any certifications...',
    },
    {
      title: 'Create a password',
      field: 'password',
      type: 'password',
      placeholder: '••••••••',
    },
    {
      title: 'Confirm your password',
      field: 'confirmPassword',
      type: 'password',
      placeholder: '••••••••',
    },
  ];

  const currentQuestion = questions[step - 1];

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 flex items-center justify-center">
      <div className="container max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Join Our Team</h1>
            <p className="text-gray-400">Question {step} of {questions.length}</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-10 w-full bg-reset-green/10 rounded-full h-2">
            <motion.div
              className="bg-reset-green h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(step / questions.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Question Card */}
          <motion.form
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={(e) => {
              e.preventDefault();
              if (step < questions.length) {
                setStep(step + 1);
              } else {
                handleSubmit(e);
              }
            }}
            className="bg-white/5 border border-reset-green/30 rounded-2xl p-8 mb-6"
          >
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {currentQuestion.title}
              </h2>
              {currentQuestion.description && (
                <p className="text-gray-400 text-sm">{currentQuestion.description}</p>
              )}
            </div>

            {currentQuestion.type === 'select' ? (
              <select
                name={currentQuestion.field}
                value={formData[currentQuestion.field as keyof typeof formData]}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-lg bg-white/5 border border-reset-green/30 text-white focus:border-reset-green focus:outline-none focus:ring-1 focus:ring-reset-green/50 transition-all text-lg"
                autoFocus
                required={currentQuestion.field !== 'certifications'}
              >
                <option value="">Select an option</option>
                {currentQuestion.options?.map((opt) => (
                  <option key={opt} value={opt.toLowerCase()}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : currentQuestion.type === 'textarea' ? (
              <textarea
                name={currentQuestion.field}
                value={formData[currentQuestion.field as keyof typeof formData]}
                onChange={handleChange}
                placeholder={currentQuestion.placeholder}
                rows={3}
                className="w-full px-5 py-4 rounded-lg bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none focus:ring-1 focus:ring-reset-green/50 transition-all text-lg resize-none"
                autoFocus
              />
            ) : (
              <input
                type={currentQuestion.type}
                name={currentQuestion.field}
                value={formData[currentQuestion.field as keyof typeof formData]}
                onChange={handleChange}
                placeholder={currentQuestion.placeholder}
                className="w-full px-5 py-4 rounded-lg bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none focus:ring-1 focus:ring-reset-green/50 transition-all text-lg"
                autoFocus
                required={currentQuestion.field !== 'certifications'}
              />
            )}

            <button
              type="submit"
              className="w-full mt-8 py-4 bg-reset-green text-black font-bold rounded-lg hover:bg-opacity-80 transition-all glow-green-hover text-lg"
            >
              {step < questions.length ? (
                <>
                  Next <ArrowRight className="inline ml-2" size={20} />
                </>
              ) : (
                'Submit Application'
              )}
            </button>
          </motion.form>

          {/* Navigation */}
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="w-full py-3 text-reset-green font-bold hover:underline"
            >
              ← Back
            </button>
          )}

          <p className="text-center text-gray-400 mt-8">
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
