'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Search, Building2, Users, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { subscribeToContractsByType, Contract } from '@/lib/db/contracts';
import { Toast, useToast } from '@/components/Toast';
import EnhancedContractApprovalPanel from '@/components/EnhancedContractApprovalPanel';

import { getSubcontractorsForContractAssignment } from '@/lib/db/subcontractors';

interface SubcontractorOption {
  id: string;
  name: string;
}

export default function ContractManagement() {
  const { toasts, addToast, removeToast } = useToast();
  const [businessOwnerContracts, setBusinessOwnerContracts] = useState<Contract[]>([]);
  const [subcontractorContracts, setSubcontractorContracts] = useState<Contract[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'business-owner' | 'subcontractor'>('business-owner');
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'submitted' | 'under-review' | 'approved' | 'rejected'>('all');
  const [subcontractors, setSubcontractors] = useState<SubcontractorOption[]>([]);
  const [isLoadingSubcontractors, setIsLoadingSubcontractors] = useState(false);

  // Load contracts
  useEffect(() => {
    const unsub1 = subscribeToContractsByType('business-owner', setBusinessOwnerContracts);
    const unsub2 = subscribeToContractsByType('subcontractor', setSubcontractorContracts);
    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  // Load subcontractors from database
  useEffect(() => {
    const loadSubcontractors = async () => {
      setIsLoadingSubcontractors(true);
      try {
        const subs = await getSubcontractorsForContractAssignment();
        setSubcontractors(subs);
      } catch (error) {
        console.error('Error loading subcontractors:', error);
        addToast('Failed to load subcontractors', 'error');
      } finally {
        setIsLoadingSubcontractors(false);
      }
    };

    loadSubcontractors();
  }, [addToast]);

  const contractsToShow = activeTab === 'business-owner' ? businessOwnerContracts : subcontractorContracts;
  const filteredContracts = contractsToShow.filter(c => {
    const query = searchQuery.toLowerCase();
    const statusMatch = filterStatus === 'all' || c.approvalStatus === filterStatus;

    if (activeTab === 'business-owner') {
      const nameMatch = !query || (c.company?.toLowerCase().includes(query) || c.primaryContactName?.toLowerCase().includes(query));
      return statusMatch && nameMatch;
    } else {
      const fullName = `${c.firstName || ''} ${c.lastName || ''}`.toLowerCase();
      const nameMatch = !query || fullName.includes(query) || c.suburb?.toLowerCase().includes(query);
      return statusMatch && nameMatch;
    }
  });

  return (
    <>
      <Toast toasts={toasts} onRemove={removeToast} />
      <div className="p-6 lg:p-8 rounded-xl glass border border-reset-green/30">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Signup Contracts</h2>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b border-gray-700">
            <button
              onClick={() => setActiveTab('business-owner')}
              className={`px-6 py-3 font-bold transition-colors border-b-2 ${
                activeTab === 'business-owner'
                  ? 'text-reset-green border-reset-green'
                  : 'text-gray-400 border-transparent hover:text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Building2 size={18} />
                Business Owners ({businessOwnerContracts.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('subcontractor')}
              className={`px-6 py-3 font-bold transition-colors border-b-2 ${
                activeTab === 'subcontractor'
                  ? 'text-reset-green border-reset-green'
                  : 'text-gray-400 border-transparent hover:text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users size={18} />
                Service Providers ({subcontractorContracts.length})
              </div>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder={activeTab === 'business-owner' ? 'Search by company or contact...' : 'Search by name or suburb...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 text-white rounded focus:outline-none focus:border-reset-green"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 flex-wrap">
              {['all', 'submitted', 'under-review', 'approved', 'rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status as typeof filterStatus)}
                  className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                    filterStatus === status
                      ? 'bg-reset-green text-black'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Contracts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContracts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">
                {activeTab === 'business-owner'
                  ? 'No business owner contracts found'
                  : 'No service provider contracts found'}
              </p>
            </div>
          ) : (
            filteredContracts.map((contract) => (
              <motion.div
                key={contract.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-white/5 border border-reset-green/20 rounded-lg hover:border-reset-green/50 transition-colors"
              >
                {activeTab === 'business-owner' ? (
                  <>
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-white mb-2">{contract.company}</h3>
                      <p className="text-sm text-gray-400">{contract.propertyType || '—'}</p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="text-gray-500">Contact</p>
                        <p className="text-white">{contract.primaryContactName || '—'}</p>
                        <p className="text-xs text-gray-400">{contract.primaryContactPhone || '—'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Address</p>
                        <p className="text-white text-xs">{contract.address || '—'}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div>
                          <p className="text-gray-500 text-xs">Frequency</p>
                          <p className="text-white text-sm">{contract.cleaningFrequency || '—'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Company Size</p>
                          <p className="text-white text-sm">{contract.companySize || '—'}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Service Types</p>
                        <p className="text-white text-xs">{contract.serviceTypes || '—'}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-white mb-2">
                        {contract.firstName} {contract.lastName}
                      </h3>
                      <p className="text-sm text-gray-400">{contract.suburb || '—'}</p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="text-gray-500">Email</p>
                        <p className="text-white text-xs">{contract.email || '—'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Phone</p>
                        <p className="text-white text-xs">{contract.phone || '—'}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div>
                          <p className="text-gray-500 text-xs">Hourly Rate</p>
                          <p className="text-reset-green font-bold">${contract.baseHourlyRate || '—'}/hr</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Service Area</p>
                          <p className="text-white text-sm">{contract.serviceAreaKm || '—'} km</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Specializations</p>
                        <p className="text-white text-xs">{contract.specializations || '—'}</p>
                      </div>

                      {/* Compliance */}
                      <div className="pt-3 border-t border-gray-700">
                        <p className="text-gray-500 text-xs mb-2">Compliance</p>
                        <div className="flex flex-wrap gap-2">
                          {contract.abn && (
                            <span className="text-xs bg-reset-green/20 text-reset-green px-2 py-1 rounded">ABN ✓</span>
                          )}
                          {contract.hasPublicLiability && (
                            <span className="text-xs bg-reset-green/20 text-reset-green px-2 py-1 rounded">Liability ✓</span>
                          )}
                          {contract.hasPoliceCheck && (
                            <span className="text-xs bg-reset-green/20 text-reset-green px-2 py-1 rounded">Police Check ✓</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Status */}
                <div className="mt-4 pt-4 border-t border-gray-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <span className={`text-xs px-3 py-1 rounded font-bold flex items-center gap-1 ${
                        contract.status === 'active'
                          ? 'bg-reset-green/20 text-reset-green'
                          : 'bg-gray-600/20 text-gray-400'
                      }`}>
                        {contract.status === 'active' && <CheckCircle size={12} />}
                        {contract.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                      {contract.approvalStatus && (
                        <span className={`text-xs px-3 py-1 rounded font-bold flex items-center gap-1 ${
                          contract.approvalStatus === 'approved'
                            ? 'bg-reset-green/20 text-reset-green'
                            : contract.approvalStatus === 'rejected'
                            ? 'bg-red-500/20 text-red-400'
                            : contract.approvalStatus === 'under-review'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {contract.approvalStatus === 'approved' && <CheckCircle size={12} />}
                          {contract.approvalStatus === 'rejected' && <XCircle size={12} />}
                          {contract.approvalStatus === 'under-review' && <Clock size={12} />}
                          {contract.approvalStatus.charAt(0).toUpperCase() + contract.approvalStatus.slice(1).replace('-', ' ')}
                        </span>
                      )}
                    </div>
                  </div>
                  {contract.approvalStatus !== 'approved' && (
                    <button
                      onClick={() => setSelectedContract(contract)}
                      className="w-full px-3 py-2 text-xs bg-reset-green/20 text-reset-green border border-reset-green/30 rounded hover:bg-reset-green/30 transition-colors font-semibold"
                    >
                      Review Contract
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Enhanced Contract Approval Panel */}
      <AnimatePresence>
        {selectedContract && (
          <EnhancedContractApprovalPanel
            contract={selectedContract}
            onClose={() => setSelectedContract(null)}
            onApproval={() => {
              setSelectedContract(null);
              addToast('Contract updated successfully!', 'success');
            }}
            subcontractors={subcontractors}
          />
        )}
      </AnimatePresence>
    </>
  );
}
