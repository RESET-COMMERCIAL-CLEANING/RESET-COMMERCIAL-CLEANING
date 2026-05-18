'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Upload, X, Search, Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { subscribeToAllUsers, UserProfile } from '@/lib/db/users';
import { createContract, updateContract } from '@/lib/db/contracts';
import { uploadContractPdf } from '@/lib/storage';
import { useToast } from '@/components/Toast';

export default function Onboarding() {
  const { addToast } = useToast();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [contractType, setContractType] = useState<'client' | 'subcontractor'>('client');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const [contractForm, setContractForm] = useState({
    type: '',
    frequency: '',
    hourlyRate: '',
    startDate: '',
    endDate: '',
    notes: '',
  });

  // Subscribe to all users
  useEffect(() => {
    const unsub = subscribeToAllUsers((allUsers) => {
      setUsers(allUsers);
    });
    return () => unsub();
  }, []);

  const filteredUsers = users.filter(user => {
    const userType = contractType === 'client' ? 'client' : 'subcontractor';
    const matchesType = user.role === userType;
    const matchesSearch = !searchQuery.trim() ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.company && user.company.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type === 'application/pdf') {
        setPdfFile(file);
      } else {
        addToast('Please upload a PDF file', 'error');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type === 'application/pdf') {
        setPdfFile(file);
      } else {
        addToast('Please upload a PDF file', 'error');
      }
    }
  };

  const handleCreateContract = async () => {
    if (!selectedUser) {
      addToast('Please select a user', 'error');
      return;
    }

    if (!contractForm.type.trim() || !contractForm.frequency.trim() ||
        !contractForm.hourlyRate.trim() || !contractForm.startDate || !contractForm.endDate) {
      addToast('Please fill in all required contract details', 'error');
      return;
    }

    setSubmitting(true);
    try {
      // 1. Create contract document
      const contractData = {
        clientId: contractType === 'client' ? selectedUser.id : '',
        clientName: contractType === 'client'
          ? `${selectedUser.firstName} ${selectedUser.lastName}`
          : '',
        subcontractorId: contractType === 'subcontractor' ? selectedUser.id : '',
        subcontractorName: contractType === 'subcontractor'
          ? `${selectedUser.firstName} ${selectedUser.lastName}`
          : '',
        type: contractForm.type,
        frequency: contractForm.frequency,
        hourlyRate: contractForm.hourlyRate,
        startDate: contractForm.startDate,
        endDate: contractForm.endDate,
        notes: contractForm.notes,
        status: 'active' as const,
        jobsCompleted: 0,
        onboardingStatus: 'pending' as const,
      };

      const newContract = await createContract(contractData);
      console.log('✅ Contract created:', newContract.id);

      // 2. Upload PDF if provided
      if (pdfFile) {
        const pdfUrl = await uploadContractPdf(newContract.id, pdfFile);
        await updateContract(newContract.id, {
          signedPdfUrl: pdfUrl,
          onboardingStatus: 'completed',
        });
      } else {
        await updateContract(newContract.id, { onboardingStatus: 'completed' });
      }

      addToast('Contract created successfully! The user can now view it in their portal.', 'success');

      // Reset wizard
      setStep(1);
      setSelectedUser(null);
      setContractForm({
        type: '',
        frequency: '',
        hourlyRate: '',
        startDate: '',
        endDate: '',
        notes: '',
      });
      setPdfFile(null);
      setSearchQuery('');
    } catch (error) {
      console.error('❌ Failed to create contract:', error);
      addToast('Failed to create contract. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const canProceedToStep2 = selectedUser !== null;
  const canProceedToStep3 = contractForm.type.trim() && contractForm.frequency.trim() &&
                            contractForm.hourlyRate.trim() && contractForm.startDate && contractForm.endDate;

  return (
    <div className="p-6 lg:p-8 rounded-xl glass border border-reset-green/30">
      <h2 className="text-2xl font-bold text-white mb-8">Contract Onboarding Wizard</h2>

      {/* Step Indicator */}
      <div className="mb-8 flex items-center justify-between max-w-md">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                step === s
                  ? 'bg-reset-green text-black scale-110'
                  : step > s
                  ? 'bg-reset-green/30 text-reset-green'
                  : 'bg-gray-700 text-gray-400'
              }`}
            >
              {step > s ? <Check size={20} /> : s}
            </div>
            {s < 3 && (
              <div
                className={`w-12 h-1 transition-all ${
                  step > s ? 'bg-reset-green' : 'bg-gray-700'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Select User */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-6"
        >
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Step 1: Select User</h3>
            <p className="text-gray-400 text-sm mb-4">Choose the client or subcontractor for this contract</p>

            {/* Contract Type Toggle */}
            <div className="flex gap-3 mb-6">
              {(['client', 'subcontractor'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setContractType(type);
                    setSelectedUser(null);
                    setSearchQuery('');
                  }}
                  className={`px-4 py-2 rounded-lg font-bold transition-all ${
                    contractType === type
                      ? 'bg-reset-green text-black'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {type === 'client' ? 'Client/Business' : 'Subcontractor'}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search by name, email, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 text-white rounded focus:outline-none focus:border-reset-green"
              />
            </div>

            {/* User List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredUsers.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">No {contractType === 'client' ? 'clients' : 'subcontractors'} found</p>
              ) : (
                filteredUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className={`w-full p-4 rounded-lg border transition-all text-left flex items-start justify-between ${
                      selectedUser?.id === user.id
                        ? 'bg-reset-green/20 border-reset-green/50'
                        : 'bg-gray-900/50 border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex-1">
                      <p className="font-bold text-white">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                      {user.company && (
                        <p className="text-xs text-gray-500 mt-1">{user.company}</p>
                      )}
                    </div>
                    {selectedUser?.id === user.id && (
                      <div className="ml-4 flex-shrink-0">
                        <Check className="w-5 h-5 text-reset-green" />
                      </div>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-3 pt-6 border-t border-gray-700">
            <button
              disabled
              className="px-4 py-2 rounded-lg border border-gray-700 text-gray-500 cursor-not-allowed opacity-50"
            >
              ← Back
            </button>
            <button
              onClick={() => setStep(2)}
              disabled={!canProceedToStep2}
              className={`ml-auto px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${
                canProceedToStep2
                  ? 'bg-reset-green text-black hover:bg-reset-green/80'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
              }`}
            >
              Next <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 2: Contract Details */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-6"
        >
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Step 2: Contract Details</h3>
            <p className="text-gray-400 text-sm mb-6">Fill in the contract information for {selectedUser?.firstName} {selectedUser?.lastName}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Contract Type *</label>
                <input
                  type="text"
                  placeholder="e.g. Extended - 6 months, One-time Deep Clean"
                  value={contractForm.type}
                  onChange={(e) => setContractForm({ ...contractForm, type: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 text-white rounded focus:outline-none focus:border-reset-green"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Frequency *</label>
                <input
                  type="text"
                  placeholder="e.g. Twice weekly, Weekly, Monthly"
                  value={contractForm.frequency}
                  onChange={(e) => setContractForm({ ...contractForm, frequency: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 text-white rounded focus:outline-none focus:border-reset-green"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Hourly Rate *</label>
                <input
                  type="text"
                  placeholder="e.g. $65/hr"
                  value={contractForm.hourlyRate}
                  onChange={(e) => setContractForm({ ...contractForm, hourlyRate: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 text-white rounded focus:outline-none focus:border-reset-green"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Start Date *</label>
                  <input
                    type="date"
                    value={contractForm.startDate}
                    onChange={(e) => setContractForm({ ...contractForm, startDate: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 text-white rounded focus:outline-none focus:border-reset-green"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">End Date *</label>
                  <input
                    type="date"
                    value={contractForm.endDate}
                    onChange={(e) => setContractForm({ ...contractForm, endDate: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 text-white rounded focus:outline-none focus:border-reset-green"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Terms & Notes</label>
                <textarea
                  placeholder="Scope of work, special conditions, etc."
                  value={contractForm.notes}
                  onChange={(e) => setContractForm({ ...contractForm, notes: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 text-white rounded focus:outline-none focus:border-reset-green h-24"
                />
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-3 pt-6 border-t border-gray-700">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 rounded-lg border border-reset-green text-reset-green hover:bg-reset-green/10 transition-colors font-bold flex items-center gap-2"
            >
              <ChevronLeft size={18} /> Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!canProceedToStep3}
              className={`ml-auto px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${
                canProceedToStep3
                  ? 'bg-reset-green text-black hover:bg-reset-green/80'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
              }`}
            >
              Next <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Upload PDF & Confirm */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-6"
        >
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Step 3: Upload & Confirm</h3>

            {/* Summary */}
            <div className="mb-6 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
              <h4 className="font-bold text-white mb-3">Contract Summary</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>User:</span>
                  <span className="font-bold">{selectedUser?.firstName} {selectedUser?.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span className="font-bold">{contractForm.type}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frequency:</span>
                  <span className="font-bold">{contractForm.frequency}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rate:</span>
                  <span className="font-bold">{contractForm.hourlyRate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Period:</span>
                  <span className="font-bold">{contractForm.startDate} to {contractForm.endDate}</span>
                </div>
              </div>
            </div>

            {/* PDF Upload */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Signed Contract PDF</label>
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                  dragActive
                    ? 'bg-reset-green/20 border-reset-green'
                    : 'bg-gray-900/50 border-gray-600 hover:border-reset-green/50'
                }`}
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="pdf-upload"
                />
                {pdfFile ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Upload className="w-5 h-5 text-reset-green" />
                      <div className="text-left">
                        <p className="font-bold text-white">{pdfFile.name}</p>
                        <p className="text-xs text-gray-400">
                          {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setPdfFile(null)}
                      className="p-2 hover:bg-red-500/20 rounded transition-colors"
                    >
                      <X className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                ) : (
                  <label htmlFor="pdf-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-white font-bold">Drag and drop your PDF</p>
                    <p className="text-xs text-gray-400 mt-1">or click to select</p>
                  </label>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">PDF files only. Maximum 10 MB.</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-3 pt-6 border-t border-gray-700">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 rounded-lg border border-reset-green text-reset-green hover:bg-reset-green/10 transition-colors font-bold flex items-center gap-2"
            >
              <ChevronLeft size={18} /> Back
            </button>
            <button
              onClick={handleCreateContract}
              disabled={submitting}
              className={`ml-auto px-6 py-2 rounded-lg font-bold transition-all ${
                submitting
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
                  : 'bg-reset-green text-black hover:bg-reset-green/80'
              }`}
            >
              {submitting ? 'Creating...' : 'Confirm & Create Contract'}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
