'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Upload, X, Search, Check, ChevronRight, ChevronLeft, TrendingUp } from 'lucide-react';
import { subscribeToAllUsers, UserProfile } from '@/lib/db/users';
import { createContract, updateContract } from '@/lib/db/contracts';
import { uploadContractPdf } from '@/lib/storage';
import { useToast } from '@/components/Toast';

const PRICING_GUIDE: Record<string, { min: number; max: number }> = {
  office: { min: 65, max: 90 },
  warehouse: { min: 55, max: 75 },
  retail: { min: 60, max: 80 },
  medical: { min: 80, max: 100 },
  restaurant: { min: 70, max: 90 },
  school: { min: 55, max: 70 },
  other: { min: 60, max: 80 },
};

export default function Onboarding() {
  const { addToast } = useToast();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [clientSearchQuery, setClientSearchQuery] = useState('');
  const [subSearchQuery, setSubSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<UserProfile | null>(null);
  const [selectedSubcontractor, setSelectedSubcontractor] = useState<UserProfile | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const [contractForm, setContractForm] = useState({
    type: '',
    chargeRate: '',
    subcontractorRate: '',
    estimatedHoursPerVisit: '',
    visitsPerMonth: '',
    overheadPercent: '10',
    startDate: '',
    endDate: '',
    notes: '',
  });

  useEffect(() => {
    const unsub = subscribeToAllUsers((allUsers) => {
      setUsers(allUsers);
    });
    return () => unsub();
  }, []);

  const filteredClients = users.filter(user => {
    const matchesType = user.role === 'client';
    const matchesSearch = !clientSearchQuery.trim() ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
      (user.company && user.company.toLowerCase().includes(clientSearchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const filteredSubcontractors = users.filter(user => {
    const matchesType = user.role === 'subcontractor';
    const matchesSearch = !subSearchQuery.trim() ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(subSearchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(subSearchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getPropertyTypeLabel = (type?: string) => {
    const labels: Record<string, string> = {
      office: 'Office',
      warehouse: 'Warehouse',
      retail: 'Retail',
      medical: 'Medical Facility',
      restaurant: 'Restaurant',
      school: 'School',
      other: 'Other',
    };
    return labels[type || 'other'] || 'Unknown';
  };

  const calculatePnL = () => {
    const chargeRate = parseFloat(contractForm.chargeRate) || 0;
    const subRate = parseFloat(contractForm.subcontractorRate) || 0;
    const hoursPerVisit = parseFloat(contractForm.estimatedHoursPerVisit) || 0;
    const visitsPerMonth = parseFloat(contractForm.visitsPerMonth) || 0;
    const overheadPct = parseFloat(contractForm.overheadPercent) || 0;

    const monthlyRevenue = chargeRate * hoursPerVisit * visitsPerMonth;
    const monthlySubCost = subRate * hoursPerVisit * visitsPerMonth;
    const overhead = monthlyRevenue > 0 ? (monthlyRevenue - monthlySubCost) * (overheadPct / 100) : 0;
    const grossProfit = monthlyRevenue - monthlySubCost;
    const netProfit = grossProfit - overhead;
    const netMargin = monthlyRevenue > 0 ? ((netProfit / monthlyRevenue) * 100).toFixed(1) : '0';

    return { monthlyRevenue, monthlySubCost, overhead, grossProfit, netProfit, netMargin };
  };

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
    if (!selectedClient || !selectedSubcontractor) {
      addToast('Please select both client and subcontractor', 'error');
      return;
    }

    if (!contractForm.type.trim() || !contractForm.chargeRate || !contractForm.subcontractorRate ||
        !contractForm.estimatedHoursPerVisit || !contractForm.visitsPerMonth ||
        !contractForm.startDate || !contractForm.endDate) {
      addToast('Please fill in all required contract details', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const frequency = selectedClient.cleaningFrequency || contractForm.type;

      // 1. Create contract document
      const onboardingStatus: 'pending' | 'completed' = pdfFile ? 'pending' : 'completed';
      const contractData = {
        clientId: selectedClient.id,
        clientName: `${selectedClient.firstName} ${selectedClient.lastName}`,
        subcontractorId: selectedSubcontractor.id,
        subcontractorName: `${selectedSubcontractor.firstName} ${selectedSubcontractor.lastName}`,
        type: contractForm.type,
        frequency: frequency,
        chargeRate: parseFloat(contractForm.chargeRate),
        subcontractorRate: parseFloat(contractForm.subcontractorRate),
        estimatedHoursPerVisit: parseFloat(contractForm.estimatedHoursPerVisit),
        visitsPerMonth: parseFloat(contractForm.visitsPerMonth),
        overheadPercent: parseFloat(contractForm.overheadPercent),
        startDate: contractForm.startDate,
        endDate: contractForm.endDate,
        notes: contractForm.notes,
        status: 'active' as const,
        jobsCompleted: 0,
        totalHoursCompleted: 0,
        actualRevenue: 0,
        actualSubcontractorCost: 0,
        onboardingStatus,
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
      }

      addToast('Contract created successfully! The users can now view it in their portals.', 'success');

      // Reset wizard
      setStep(1);
      setSelectedClient(null);
      setSelectedSubcontractor(null);
      setContractForm({
        type: '',
        chargeRate: '',
        subcontractorRate: '',
        estimatedHoursPerVisit: '',
        visitsPerMonth: '',
        overheadPercent: '10',
        startDate: '',
        endDate: '',
        notes: '',
      });
      setPdfFile(null);
      setClientSearchQuery('');
      setSubSearchQuery('');
    } catch (error) {
      console.error('❌ Failed to create contract:', error);
      addToast('Failed to create contract. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const canProceedToStep2 = selectedClient !== null;
  const canProceedToStep3 = selectedSubcontractor !== null;
  const canProceedToStep4 = contractForm.type.trim() && contractForm.chargeRate && contractForm.subcontractorRate &&
                            contractForm.estimatedHoursPerVisit && contractForm.visitsPerMonth;

  return (
    <div className="p-6 lg:p-8 rounded-xl glass border border-reset-green/30">
      <h2 className="text-2xl font-bold text-white mb-8">Contract Assignment Wizard</h2>

      {/* Step Indicator */}
      <div className="mb-8 flex items-center justify-between max-w-2xl">
        {[1, 2, 3, 4].map((s) => (
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
            {s < 4 && (
              <div
                className={`w-12 h-1 transition-all ${
                  step > s ? 'bg-reset-green' : 'bg-gray-700'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Select Client */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-6"
        >
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Step 1: Select Client</h3>
            <p className="text-gray-400 text-sm mb-4">Choose the business owner/client for this contract</p>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search by name, email, or company..."
                value={clientSearchQuery}
                onChange={(e) => setClientSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 text-white rounded focus:outline-none focus:border-reset-green"
              />
            </div>

            {/* Client List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredClients.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">No clients found</p>
              ) : (
                filteredClients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => setSelectedClient(client)}
                    className={`w-full p-4 rounded-lg border transition-all text-left ${
                      selectedClient?.id === client.id
                        ? 'bg-reset-green/20 border-reset-green/50'
                        : 'bg-gray-900/50 border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-bold text-white">{client.company || `${client.firstName} ${client.lastName}`}</p>
                        <p className="text-xs text-gray-400">{client.email}</p>
                        {client.propertyType && (
                          <p className="text-xs text-gray-500 mt-1">Type: {getPropertyTypeLabel(client.propertyType)}</p>
                        )}
                        {client.squareFeet && (
                          <p className="text-xs text-gray-500">Size: {client.squareFeet} sq ft</p>
                        )}
                        {client.cleaningFrequency && (
                          <p className="text-xs text-reset-green/70 mt-1">Frequency: {client.cleaningFrequency}</p>
                        )}
                      </div>
                      {selectedClient?.id === client.id && (
                        <div className="ml-4 flex-shrink-0">
                          <Check className="w-5 h-5 text-reset-green" />
                        </div>
                      )}
                    </div>
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

      {/* Step 2: Select Subcontractor */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-6"
        >
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Step 2: Select Subcontractor</h3>
            <p className="text-gray-400 text-sm mb-4">Choose the service provider for {selectedClient?.company || selectedClient?.firstName} {selectedClient?.lastName}</p>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={subSearchQuery}
                onChange={(e) => setSubSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 text-white rounded focus:outline-none focus:border-reset-green"
              />
            </div>

            {/* Subcontractor List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredSubcontractors.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">No subcontractors found</p>
              ) : (
                filteredSubcontractors.map((sub) => {
                  const hasCompliance = sub.abn && sub.hasPublicLiability;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => {
                        setSelectedSubcontractor(sub);
                        if (sub.baseHourlyRate) {
                          setContractForm(prev => ({ ...prev, subcontractorRate: sub.baseHourlyRate!.toString() }));
                        }
                      }}
                      className={`w-full p-4 rounded-lg border transition-all text-left ${
                        selectedSubcontractor?.id === sub.id
                          ? 'bg-reset-green/20 border-reset-green/50'
                          : 'bg-gray-900/50 border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-bold text-white">{sub.firstName} {sub.lastName}</p>
                          <p className="text-xs text-gray-400">{sub.email}</p>
                          {sub.suburb && (
                            <p className="text-xs text-gray-500 mt-1">Location: {sub.suburb}</p>
                          )}
                          {sub.specializations && (
                            <p className="text-xs text-gray-500">Specializations: {sub.specializations}</p>
                          )}
                          {sub.baseHourlyRate && (
                            <p className="text-sm font-bold text-reset-green mt-1">${sub.baseHourlyRate}/hr</p>
                          )}
                        </div>
                        <div className="ml-4 flex-shrink-0 space-y-2">
                          {selectedSubcontractor?.id === sub.id && (
                            <div className="flex justify-end">
                              <Check className="w-5 h-5 text-reset-green" />
                            </div>
                          )}
                          {hasCompliance && (
                            <div className="text-xs bg-reset-green/20 text-reset-green px-2 py-1 rounded">
                              Compliant
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
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

      {/* Step 3: Financial Terms */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-6"
        >
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Step 3: Financial Terms</h3>
            <p className="text-gray-400 text-sm mb-6">Set pricing and scope for this contract</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Contract Type/Description *</label>
                <input
                  type="text"
                  placeholder="e.g. Extended - 6 months, Deep Clean"
                  value={contractForm.type}
                  onChange={(e) => setContractForm({ ...contractForm, type: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 text-white rounded focus:outline-none focus:border-reset-green"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Visits Per Month *</label>
                <input
                  type="number"
                  placeholder="e.g. 4, 8"
                  value={contractForm.visitsPerMonth}
                  onChange={(e) => setContractForm({ ...contractForm, visitsPerMonth: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 text-white rounded focus:outline-none focus:border-reset-green"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Hours Per Visit *</label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="e.g. 3, 4"
                  value={contractForm.estimatedHoursPerVisit}
                  onChange={(e) => setContractForm({ ...contractForm, estimatedHoursPerVisit: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 text-white rounded focus:outline-none focus:border-reset-green"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Overhead % (Admin)</label>
                <input
                  type="number"
                  placeholder="10"
                  value={contractForm.overheadPercent}
                  onChange={(e) => setContractForm({ ...contractForm, overheadPercent: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 text-white rounded focus:outline-none focus:border-reset-green"
                />
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-gray-300">Charge Rate (to Client) *</label>
                  {selectedClient?.propertyType && (
                    <span className="text-xs text-gray-400">
                      Guide: ${PRICING_GUIDE[selectedClient.propertyType]?.min || 60}–${PRICING_GUIDE[selectedClient.propertyType]?.max || 80}/hr
                    </span>
                  )}
                </div>
                <input
                  type="number"
                  placeholder="e.g. 75"
                  value={contractForm.chargeRate}
                  onChange={(e) => setContractForm({ ...contractForm, chargeRate: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 text-white rounded focus:outline-none focus:border-reset-green"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Subcontractor Rate (Payment) *</label>
                <input
                  type="number"
                  placeholder="e.g. 50"
                  value={contractForm.subcontractorRate}
                  onChange={(e) => setContractForm({ ...contractForm, subcontractorRate: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 text-white rounded focus:outline-none focus:border-reset-green"
                />
              </div>
            </div>

            {/* P&L Preview */}
            {(() => {
              const pnl = calculatePnL();
              return (
                <div className="p-4 bg-reset-green/10 border border-reset-green/30 rounded-lg mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-reset-green" />
                    <h4 className="font-bold text-reset-green">Monthly P&L Preview</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-300">
                      <span>Revenue ({contractForm.chargeRate}×{contractForm.estimatedHoursPerVisit}×{contractForm.visitsPerMonth}):</span>
                      <span className="font-bold text-reset-green">${pnl.monthlyRevenue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Sub Cost ({contractForm.subcontractorRate}×{contractForm.estimatedHoursPerVisit}×{contractForm.visitsPerMonth}):</span>
                      <span className="font-bold text-red-400">-${pnl.monthlySubCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Overhead ({contractForm.overheadPercent}%):</span>
                      <span className="font-bold text-red-400">-${pnl.overhead.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-700 pt-2 mt-2 flex justify-between text-white">
                      <span className="font-bold">Net Profit / Month:</span>
                      <span className="text-xl font-bold text-reset-green">${pnl.netProfit.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-400 text-xs">
                      <span>Margin:</span>
                      <span>{pnl.netMargin}%</span>
                    </div>
                  </div>
                </div>
              );
            })()}
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
              onClick={() => setStep(4)}
              disabled={!canProceedToStep4}
              className={`ml-auto px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${
                canProceedToStep4
                  ? 'bg-reset-green text-black hover:bg-reset-green/80'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
              }`}
            >
              Next <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 4: Dates & Confirm */}
      {step === 4 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-6"
        >
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Step 4: Contract Dates & PDF</h3>
            <p className="text-gray-400 text-sm mb-6">Set the contract period and upload signed PDF</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
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

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-300 mb-2">Terms & Notes</label>
              <textarea
                placeholder="Any special conditions, scope details, etc."
                value={contractForm.notes}
                onChange={(e) => setContractForm({ ...contractForm, notes: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 text-white rounded focus:outline-none focus:border-reset-green h-20"
              />
            </div>

            {/* Contract Summary */}
            <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 mb-6">
              <h4 className="font-bold text-white mb-3">Contract Summary</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>Client:</span>
                  <span className="font-bold">{selectedClient?.company || `${selectedClient?.firstName} ${selectedClient?.lastName}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subcontractor:</span>
                  <span className="font-bold">{selectedSubcontractor?.firstName} {selectedSubcontractor?.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Contract Type:</span>
                  <span className="font-bold">{contractForm.type}</span>
                </div>
                <div className="flex justify-between">
                  <span>Charge Rate:</span>
                  <span className="font-bold text-reset-green">${contractForm.chargeRate}/hr</span>
                </div>
                <div className="flex justify-between">
                  <span>Sub Rate:</span>
                  <span className="font-bold text-reset-green">${contractForm.subcontractorRate}/hr</span>
                </div>
                <div className="flex justify-between">
                  <span>Period:</span>
                  <span className="font-bold">{contractForm.startDate} to {contractForm.endDate}</span>
                </div>
                <div className="flex justify-between border-t border-gray-700 pt-2 mt-2">
                  <span>Est. Monthly Profit:</span>
                  <span className="font-bold text-reset-green">${(() => calculatePnL().netProfit)().toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* PDF Upload */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Signed Contract PDF (Optional)</label>
              <p className="text-xs text-gray-500 mb-2">Upload the signed physical contract. Can be added later.</p>
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
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-3 pt-6 border-t border-gray-700">
            <button
              onClick={() => setStep(3)}
              className="px-4 py-2 rounded-lg border border-reset-green text-reset-green hover:bg-reset-green/10 transition-colors font-bold flex items-center gap-2"
            >
              <ChevronLeft size={18} /> Back
            </button>
            <button
              onClick={handleCreateContract}
              disabled={submitting || !contractForm.startDate || !contractForm.endDate}
              className={`ml-auto px-6 py-2 rounded-lg font-bold transition-all ${
                submitting || !contractForm.startDate || !contractForm.endDate
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
                  : 'bg-reset-green text-black hover:bg-reset-green/80'
              }`}
            >
              {submitting ? 'Creating...' : 'Create Contract'}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
