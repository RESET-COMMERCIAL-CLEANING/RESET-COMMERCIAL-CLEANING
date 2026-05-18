'use client';

import { motion } from 'framer-motion';
import { Check, X, Search, ChevronDown, AlertCircle, Shield, Calendar, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Timestamp } from 'firebase/firestore';
import { subscribeToAllContracts, createContract, updateContract, Contract } from '@/lib/db/contracts';
import { subscribeToAllUsers, UserProfile } from '@/lib/db/users';
import { Toast, useToast } from '@/components/Toast';

// Frequency to visits per month mapping
const FREQUENCY_VISITS: Record<string, number> = {
  'daily': 22,
  'twice-weekly': 8,
  'weekly': 4,
  'bi-weekly': 2,
  'monthly': 1,
  'one-time': 0.5,
};

export default function ContractManagement() {
  const { toasts, addToast, removeToast } = useToast();
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selectedClient, setSelectedClient] = useState<UserProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAssignSubcontractor, setShowAssignSubcontractor] = useState(false);
  const [subcontractorSearchQuery, setSubcontractorSearchQuery] = useState('');
  const [removalReason, setRemovalReason] = useState('');
  const [showRemovalPrompt, setShowRemovalPrompt] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [availabilityWarning, setAvailabilityWarning] = useState<{ conflictDates: string[]; count: number } | null>(null);
  const [overrideWarning, setOverrideWarning] = useState(false);
  const [pendingAssignmentSub, setPendingAssignmentSub] = useState<UserProfile | null>(null);

  useEffect(() => {
    const unsub1 = subscribeToAllUsers(setAllUsers);
    const unsub2 = subscribeToAllContracts(setContracts);
    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  const clients = allUsers.filter(u => u.role === 'client');
  const subcontractors = allUsers.filter(u => u.role === 'subcontractor');

  const filteredClients = clients.filter(c => {
    const query = searchQuery.toLowerCase();
    return !query ||
      c.company?.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(query);
  });

  const filteredSubcontractors = subcontractors.filter(s => {
    const query = subcontractorSearchQuery.toLowerCase();
    return !query ||
      s.email.toLowerCase().includes(query) ||
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(query) ||
      s.suburb?.toLowerCase().includes(query);
  });

  const getActiveContractForClient = (clientId: string): Contract | null => {
    return contracts.find(c => c.clientId === clientId && c.status === 'active') || null;
  };

  const getContractHistoryForClient = (clientId: string): Contract[] => {
    return contracts.filter(c => c.clientId === clientId && (c.status === 'ended' || c.status === 'cancelled'));
  };

  const getSubcontractorProfile = (subId: string): UserProfile | null => {
    return allUsers.find(u => u.id === subId) || null;
  };

  // Generate projected job dates for next 30 days based on frequency
  const getProjectedJobDates = (client: UserProfile): string[] => {
    const dates: string[] = [];
    const frequency = client.cleaningFrequency || 'weekly';
    const visitsPerMonth = FREQUENCY_VISITS[frequency] || 4;
    const today = new Date();

    // Simple approximation: distribute visits evenly over 30 days
    const daysPerVisit = Math.ceil(30 / visitsPerMonth);
    for (let i = 0; i < visitsPerMonth && i < 10; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i * daysPerVisit);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  // Check if subcontractor is available on projected dates
  const checkSubcontractorAvailability = (subcontractor: UserProfile, client: UserProfile): { hasConflict: boolean; conflictDates: string[] } => {
    const projectedDates = getProjectedJobDates(client);
    const unavailableDates = subcontractor.unavailableDates || [];
    const workingDays = subcontractor.workingDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const conflictDates: string[] = [];

    projectedDates.forEach(dateStr => {
      const date = new Date(dateStr);
      const dayName = date.toLocaleDateString('en-AU', { weekday: 'short' });

      // Check if on unavailable date
      const isUnavailable = unavailableDates.some(u => u.date === dateStr);

      // Check if on non-working day
      const isWorkingDay = workingDays.includes(dayName);

      if (isUnavailable || !isWorkingDay) {
        conflictDates.push(dateStr);
      }
    });

    return {
      hasConflict: conflictDates.length > 0,
      conflictDates,
    };
  };

  const formatDate = (date: string | Timestamp | undefined): string => {
    if (!date) return 'N/A';
    if (date instanceof Timestamp) {
      return date.toDate().toLocaleDateString('en-AU');
    }
    return new Date(date).toLocaleDateString('en-AU');
  };

  const handleAssignSubcontractor = async (subcontractor: UserProfile) => {
    if (!selectedClient) return;

    // Check availability first
    const availability = checkSubcontractorAvailability(subcontractor, selectedClient);

    if (availability.hasConflict && !overrideWarning) {
      setAvailabilityWarning({
        conflictDates: availability.conflictDates,
        count: availability.conflictDates.length,
      });
      setPendingAssignmentSub(subcontractor);
      return;
    }

    setIsSubmitting(true);
    try {
      await createContract({
        clientId: selectedClient.id,
        clientName: `${selectedClient.firstName} ${selectedClient.lastName}`,
        subcontractorId: subcontractor.id,
        subcontractorName: `${subcontractor.firstName} ${subcontractor.lastName}`,
        type: 'Ongoing Service',
        frequency: selectedClient.cleaningFrequency || 'Weekly',
        status: 'active',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        jobsCompleted: 0,
        onboardingStatus: 'completed',
        originalAssignedSubId: subcontractor.id,
      });
      setShowAssignSubcontractor(false);
      setSubcontractorSearchQuery('');
      setAvailabilityWarning(null);
      setPendingAssignmentSub(null);
      setOverrideWarning(false);
      addToast(`${subcontractor.firstName} assigned to ${selectedClient.company}`, 'success');
    } catch (error) {
      addToast('Failed to assign subcontractor', 'error');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveAssignment = async (contract: Contract) => {
    if (!removalReason.trim()) {
      addToast('Please provide a reason for removal', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateContract(contract.id, {
        status: 'ended',
        endDate: new Date().toISOString().split('T')[0],
        archivedAt: Timestamp.now(),
        endedReason: removalReason,
      });
      setShowRemovalPrompt(false);
      setRemovalReason('');
      addToast('Assignment removed and contract archived', 'success');
    } catch (error) {
      addToast('Failed to remove assignment', 'error');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeContract = selectedClient ? getActiveContractForClient(selectedClient.id) : null;
  const activeSubcontractor = activeContract ? getSubcontractorProfile(activeContract.subcontractorId) : null;
  const contractHistory = selectedClient ? getContractHistoryForClient(selectedClient.id) : [];

  return (
    <>
      <Toast toasts={toasts} onRemove={removeToast} />
      <div className="p-6 lg:p-8 rounded-xl glass border border-reset-green/30 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel: Client List */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-bold text-white mb-4">Clients</h3>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 text-white rounded focus:outline-none focus:border-reset-green"
            />
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredClients.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">No clients found</p>
            ) : (
              filteredClients.map((client) => {
                const active = getActiveContractForClient(client.id);
                return (
                  <button
                    key={client.id}
                    onClick={() => setSelectedClient(client)}
                    className={`w-full p-3 rounded-lg border transition-all text-left text-sm ${
                      selectedClient?.id === client.id
                        ? 'bg-reset-green/20 border-reset-green/50'
                        : 'bg-gray-900/50 border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <p className="font-bold text-white truncate">{client.company}</p>
                    <p className="text-xs text-gray-400 mb-2">{client.propertyType ? `${client.propertyType} • ` : ''}{client.cleaningFrequency}</p>
                    <div className="flex items-center justify-between">
                      {active ? (
                        <span className="text-xs bg-reset-green/20 text-reset-green px-2 py-1 rounded">
                          ✓ Assigned
                        </span>
                      ) : (
                        <span className="text-xs bg-gray-600/20 text-gray-400 px-2 py-1 rounded">
                          Unassigned
                        </span>
                      )}
                      {active && (
                        <span className="text-xs text-gray-400">{active.subcontractorName.split(' ')[0]}</span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Panel: Client Profile + Assignment */}
        {selectedClient && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Client Onboarding Profile */}
            <div className="p-6 bg-white/5 border border-reset-green/20 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-4">{selectedClient.company}</h3>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Address</p>
                  <p className="text-white font-medium">{selectedClient.address || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-400">Property Type</p>
                  <p className="text-white font-medium">{selectedClient.propertyType || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-400">Size / Floors</p>
                  <p className="text-white font-medium">{selectedClient.squareFeet || '—'} sq ft • {selectedClient.propertyFloors || '—'} floors</p>
                </div>
                <div>
                  <p className="text-gray-400">Company Size</p>
                  <p className="text-white font-medium">{selectedClient.companySize || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-400">Cleaning Frequency</p>
                  <p className="text-white font-medium">{selectedClient.cleaningFrequency || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-400">Preferred Time</p>
                  <p className="text-white font-medium">{selectedClient.preferredTime || '—'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-400">Service Types</p>
                  <p className="text-white font-medium">{selectedClient.serviceTypes || '—'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-400">Special Requirements</p>
                  <p className="text-white font-medium">{selectedClient.specialRequirements || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-400">Estimated Budget</p>
                  <p className="text-white font-medium">{selectedClient.estimatedBudget || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-400">Billing Preference</p>
                  <p className="text-white font-medium">{selectedClient.billingPreference || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-400">Primary Contact</p>
                  <p className="text-white font-medium">{selectedClient.primaryContactName || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-400">Contact Phone</p>
                  <p className="text-white font-medium">{selectedClient.primaryContactPhone || '—'}</p>
                </div>
              </div>
            </div>

            {/* Current Assignment or Assignment UI */}
            {activeContract && activeSubcontractor ? (
              <div className="p-6 bg-white/5 border border-reset-green/20 rounded-xl">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-lg font-bold text-white">Current Assignment</h4>
                  <span className="text-xs bg-reset-green/20 text-reset-green px-3 py-1 rounded-full">Active</span>
                </div>

                {/* Subcontractor Profile */}
                <div className="space-y-4 mb-6 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                  <div>
                    <p className="text-xl font-bold text-white">{activeSubcontractor.firstName} {activeSubcontractor.lastName}</p>
                    <p className="text-sm text-gray-400">{activeSubcontractor.email}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Location</p>
                      <p className="text-white font-medium">{activeSubcontractor.suburb || '—'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Hourly Rate</p>
                      <p className="text-reset-green font-bold">${activeSubcontractor.baseHourlyRate || '—'}/hr</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-400">Specializations</p>
                      <p className="text-white font-medium">{activeSubcontractor.specializations || '—'}</p>
                    </div>
                  </div>

                  {/* Compliance Badges */}
                  <div className="flex gap-2 flex-wrap pt-2">
                    {activeSubcontractor.abn && (
                      <div className="flex items-center gap-1 text-xs bg-reset-green/20 text-reset-green px-2 py-1 rounded">
                        <Shield size={14} /> ABN ✓
                      </div>
                    )}
                    {activeSubcontractor.hasPublicLiability && (
                      <div className="flex items-center gap-1 text-xs bg-reset-green/20 text-reset-green px-2 py-1 rounded">
                        <Shield size={14} /> Public Liability ✓
                      </div>
                    )}
                    {activeSubcontractor.hasPoliceCheck && (
                      <div className="flex items-center gap-1 text-xs bg-reset-green/20 text-reset-green px-2 py-1 rounded">
                        <Check size={14} /> Police Check ✓
                      </div>
                    )}
                  </div>
                </div>

                {/* Contract Details */}
                <div className="grid grid-cols-2 gap-4 text-sm mb-6 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                  <div>
                    <p className="text-gray-400">Start Date</p>
                    <p className="text-white font-medium">{formatDate(activeContract.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Status</p>
                    <p className="text-reset-green font-medium">{activeContract.status}</p>
                  </div>
                </div>

                {!showRemovalPrompt ? (
                  <button
                    onClick={() => setShowRemovalPrompt(true)}
                    className="w-full px-4 py-3 bg-red-600/20 border border-red-600/50 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors font-bold"
                  >
                    Remove Assignment
                  </button>
                ) : (
                  <div className="p-4 bg-red-900/20 border border-red-600/50 rounded-lg">
                    <p className="text-sm text-white mb-3 font-bold">Why are you removing this assignment?</p>
                    <textarea
                      placeholder="Reason for removal..."
                      value={removalReason}
                      onChange={(e) => setRemovalReason(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded text-sm mb-3 focus:outline-none focus:border-red-600"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setShowRemovalPrompt(false);
                          setRemovalReason('');
                        }}
                        disabled={isSubmitting}
                        className="flex-1 px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleRemoveAssignment(activeContract)}
                        disabled={isSubmitting || !removalReason.trim()}
                        className="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-bold disabled:opacity-50"
                      >
                        {isSubmitting ? 'Removing...' : 'Confirm Remove'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : !showAssignSubcontractor ? (
              <div className="p-6 bg-yellow-900/20 border border-yellow-600/50 rounded-xl text-center">
                <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                <p className="text-white font-bold mb-4">No Subcontractor Assigned</p>
                <button
                  onClick={() => setShowAssignSubcontractor(true)}
                  className="px-6 py-3 bg-reset-green text-black rounded-lg hover:bg-reset-green/80 transition-colors font-bold"
                >
                  Assign Subcontractor
                </button>
              </div>
            ) : (
              <div className="p-6 bg-white/5 border border-reset-green/20 rounded-xl">
                <h4 className="text-lg font-bold text-white mb-4">Select Subcontractor</h4>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search subcontractors..."
                    value={subcontractorSearchQuery}
                    onChange={(e) => setSubcontractorSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 text-white rounded focus:outline-none focus:border-reset-green"
                  />
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredSubcontractors.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-4">No subcontractors found</p>
                  ) : (
                    filteredSubcontractors.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => handleAssignSubcontractor(sub)}
                        disabled={isSubmitting}
                        className="w-full p-4 bg-gray-900/50 border border-gray-700 rounded-lg hover:border-reset-green/50 transition-all text-left"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-bold text-white">{sub.firstName} {sub.lastName}</p>
                            <p className="text-xs text-gray-400 mb-2">{sub.email}</p>
                            <div className="flex items-center gap-2 text-sm">
                              {sub.suburb && <span className="text-gray-400">{sub.suburb}</span>}
                              {sub.baseHourlyRate && (
                                <span className="font-bold text-reset-green">${sub.baseHourlyRate}/hr</span>
                              )}
                            </div>
                            {sub.specializations && (
                              <p className="text-xs text-gray-500 mt-1">{sub.specializations}</p>
                            )}
                          </div>
                          {sub.abn && sub.hasPublicLiability && (
                            <div className="text-xs bg-reset-green/20 text-reset-green px-2 py-1 rounded flex-shrink-0 ml-2">
                              Compliant
                            </div>
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>

                <button
                  onClick={() => setShowAssignSubcontractor(false)}
                  className="w-full mt-4 px-4 py-2 border border-gray-700 text-gray-400 rounded-lg hover:bg-gray-800 transition-colors font-bold"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Contract History */}
            {contractHistory.length > 0 && (
              <div className="p-6 bg-white/5 border border-reset-green/20 rounded-xl">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="w-full flex items-center justify-between font-bold text-white hover:text-reset-green transition-colors"
                >
                  <span>Contract History ({contractHistory.length})</span>
                  <ChevronDown size={20} className={`transition-transform ${showHistory ? 'rotate-180' : ''}`} />
                </button>

                {showHistory && (
                  <div className="mt-4 space-y-3">
                    {contractHistory.map((contract) => {
                      const sub = getSubcontractorProfile(contract.subcontractorId);
                      return (
                        <div key={contract.id} className="p-3 bg-gray-900/50 rounded-lg border border-gray-700 text-sm">
                          <p className="font-bold text-white">{sub?.firstName} {sub?.lastName}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDate(contract.startDate)} → {formatDate(contract.endDate)}
                          </p>
                          {contract.endedReason && (
                            <p className="text-xs text-gray-500 mt-1">Reason: {contract.endedReason}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {!selectedClient && (
          <div className="lg:col-span-2 flex items-center justify-center min-h-96">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Select a client to view and manage assignments</p>
            </div>
          </div>
        )}
      </div>

      {/* Availability Warning Modal */}
      {availabilityWarning && pendingAssignmentSub && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => {
            setAvailabilityWarning(null);
            setPendingAssignmentSub(null);
            setOverrideWarning(false);
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 rounded-lg border border-yellow-600/30 p-8 max-w-lg w-full"
          >
            <div className="flex items-start gap-4 mb-6">
              <AlertTriangle className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-white">Availability Conflict</h3>
                <p className="text-sm text-gray-400 mt-1">
                  {pendingAssignmentSub.firstName} {pendingAssignmentSub.lastName} has unavailable dates that overlap with this contract's projected schedule.
                </p>
              </div>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-600/50 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-400 font-semibold mb-3">Conflicting Dates:</p>
              <div className="flex flex-wrap gap-2">
                {availabilityWarning.conflictDates.slice(0, 5).map((date) => (
                  <span key={date} className="text-xs bg-yellow-600/30 text-yellow-300 px-2 py-1 rounded">
                    {new Date(date).toLocaleDateString('en-AU', { month: 'short', day: 'numeric' })}
                  </span>
                ))}
                {availabilityWarning.conflictDates.length > 5 && (
                  <span className="text-xs text-yellow-400 px-2 py-1">+{availabilityWarning.conflictDates.length - 5} more</span>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={overrideWarning}
                  onChange={(e) => setOverrideWarning(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-gray-600 bg-gray-800 text-reset-green"
                />
                <span className="text-sm text-gray-300">I understand the conflict and want to assign anyway. I'll manage reassignments if needed.</span>
              </label>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    if (overrideWarning && pendingAssignmentSub) {
                      handleAssignSubcontractor(pendingAssignmentSub);
                      setAvailabilityWarning(null);
                      setPendingAssignmentSub(null);
                      setOverrideWarning(false);
                    }
                  }}
                  disabled={!overrideWarning || isSubmitting}
                  className="flex-1 px-4 py-3 bg-reset-green text-black rounded-lg font-bold hover:bg-reset-green/80 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Assigning...' : 'Assign Anyway'}
                </button>
                <button
                  onClick={() => {
                    setAvailabilityWarning(null);
                    setPendingAssignmentSub(null);
                    setOverrideWarning(false);
                  }}
                  className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-lg font-bold hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
