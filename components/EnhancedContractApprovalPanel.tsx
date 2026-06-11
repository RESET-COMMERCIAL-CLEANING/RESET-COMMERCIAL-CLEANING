'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, CheckCircle, XCircle, Calendar, User, Upload, Trash2, Clock, Edit2, Save, Eye, Send, Users, Download } from 'lucide-react';
import { useState } from 'react';
import { Contract, ContractDocument } from '@/lib/db/contracts';
import { updateContract, markContractForSignature, markContractAsSigned, assignContractToSubcontractor } from '@/lib/db/contracts';
import { uploadContractDocument } from '@/lib/storage';
import { Toast, useToast } from '@/components/Toast';
import { Timestamp } from 'firebase/firestore';
import DigitalSignaturePad from '@/components/DigitalSignaturePad';
import { generateBusinessOwnerContractHTML, generateSubcontractorContractHTML, getContractFilename } from '@/lib/contracts/contractGenerator';
import { calculatePricing, type PricingCalculationInput } from '@/lib/pricing/pricingCalculator';

interface EnhancedContractApprovalPanelProps {
  contract: Contract;
  onClose: () => void;
  onApproval: () => void;
  subcontractors?: Array<{ id: string; name: string }>;
}

type TabType = 'overview' | 'edit' | 'pricing' | 'contract' | 'signature' | 'assignment' | 'documents';

export default function EnhancedContractApprovalPanel({
  contract,
  onClose,
  onApproval,
  subcontractors = [],
}: EnhancedContractApprovalPanelProps) {
  const { toasts, addToast, removeToast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [editedContract, setEditedContract] = useState(contract);
  const [isEditing, setIsEditing] = useState(false);
  const [documents, setDocuments] = useState<ContractDocument[]>(contract.documents || []);
  const [approvalNotes, setApprovalNotes] = useState(contract.approvalNotes || '');
  const [contractPreview, setContractPreview] = useState<string>('');
  const [showSignature, setShowSignature] = useState(false);
  const [signatureData, setSignatureData] = useState<string>('');
  const [selectedSubcontractor, setSelectedSubcontractor] = useState<string>('');
  const [reassignmentReason, setReassignmentReason] = useState('');

  const isBusinessOwner = contract.contractType === 'business-owner';

  // Build pricing input for business owner contracts
  const pricingInput: PricingCalculationInput | null = isBusinessOwner
    ? {
        squareFeet: contract.propertyFloors ? 5000 : 0, // Placeholder, should come from actual property data
        propertyType: (contract.propertyType as any) || 'office',
        pricingTier: contract.pricingTier || 'standard',
        cleaningType: 'standard',
        numberOfFloors: contract.propertyFloors || 1,
        frequency: (contract.cleaningFrequency as any) || 'weekly',
        distanceKm: 15,
        contractMonths: 12,
        specialRequirements: [],
      }
    : null;

  const pricing = pricingInput ? calculatePricing(pricingInput) : null;

  const handleEditField = (field: keyof Contract, value: any) => {
    setEditedContract({ ...editedContract, [field]: value });
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      await updateContract(contract.id, {
        company: editedContract.company,
        primaryContactName: editedContract.primaryContactName,
        primaryContactPhone: editedContract.primaryContactPhone,
        address: editedContract.address,
        propertyType: editedContract.propertyType,
        cleaningFrequency: editedContract.cleaningFrequency,
        serviceTypes: editedContract.serviceTypes,
        specialRequirements: editedContract.specialRequirements,
        firstName: editedContract.firstName,
        lastName: editedContract.lastName,
        phone: editedContract.phone,
        suburb: editedContract.suburb,
        baseHourlyRate: editedContract.baseHourlyRate,
      });
      addToast('Contract information updated!', 'success');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating contract:', error);
      addToast('Failed to update contract', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateContract = async () => {
    setIsLoading(true);
    try {
      const html = isBusinessOwner
        ? generateBusinessOwnerContractHTML({ contract: editedContract, pricingInput, superuserName: 'RESET Admin' })
        : generateSubcontractorContractHTML({ contract: editedContract, superuserName: 'RESET Admin' });

      setContractPreview(html);
      setActiveTab('contract');
      addToast('Contract generated successfully!', 'success');
    } catch (error) {
      console.error('Error generating contract:', error);
      addToast('Failed to generate contract', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadContract = () => {
    if (!contractPreview) return;

    const element = document.createElement('a');
    const file = new Blob([contractPreview], { type: 'text/html;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = getContractFilename(editedContract);
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    addToast('Contract downloaded!', 'success');
  };

  const handleSignatureCapture = async (signatureData: string) => {
    setIsLoading(true);
    try {
      // Store signature data
      setSignatureData(signatureData);

      // Mark contract as signed
      await markContractAsSigned(contract.id);

      addToast('Contract signed successfully!', 'success');
      setShowSignature(false);
      setActiveTab('assignment');
    } catch (error) {
      console.error('Error saving signature:', error);
      addToast('Failed to save signature', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignToSubcontractor = async () => {
    if (!selectedSubcontractor) {
      addToast('Please select a subcontractor', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const selectedSub = subcontractors.find((s) => s.id === selectedSubcontractor);
      const previousAssignment = contract.currentAssignedSubcontractor;

      await assignContractToSubcontractor(
        contract.id,
        selectedSubcontractor,
        selectedSub?.name || 'Unknown',
        'superuser',
        previousAssignment?.subcontractorId,
        reassignmentReason || undefined
      );

      addToast(
        previousAssignment
          ? `Contract reassigned successfully! (was assigned to ${previousAssignment.subcontractorName})`
          : 'Contract assigned successfully!',
        'success'
      );

      setSelectedSubcontractor('');
      setReassignmentReason('');
      onApproval();
    } catch (error) {
      console.error('Error assigning contract:', error);
      addToast('Failed to assign contract', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDocument = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const url = await uploadContractDocument(file, contract.id);
      const newDoc: ContractDocument = {
        id: Date.now().toString(),
        name: file.name,
        url,
        uploadedAt: Timestamp.now(),
        uploadedBy: 'superuser',
      };
      setDocuments([...documents, newDoc]);
      addToast(`Document "${file.name}" uploaded successfully!`, 'success');
    } catch (error) {
      console.error('Error uploading document:', error);
      addToast('Failed to upload document', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveDocument = (docId: string) => {
    setDocuments(documents.filter((d) => d.id !== docId));
    addToast('Document removed', 'info');
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'approved':
        return 'bg-reset-green/20 text-reset-green border-reset-green/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'under-review':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'submitted':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-700/20 text-gray-300 border-gray-700/30';
    }
  };

  const getContractName = () => {
    if (isBusinessOwner) {
      return editedContract.company || 'Business Owner Contract';
    } else {
      return `${editedContract.firstName || ''} ${editedContract.lastName || ''}`.trim() || 'Service Provider Contract';
    }
  };

  return (
    <>
      <Toast toasts={toasts} onRemove={removeToast} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-black border border-reset-green/30 rounded-xl max-w-4xl w-full mx-4 my-8"
        >
          {/* Header */}
          <div className="sticky top-0 bg-black/95 border-b border-reset-green/30 p-6 flex items-center justify-between z-10">
            <div>
              <h2 className="text-2xl font-bold text-white">{getContractName()}</h2>
              <p className="text-gray-400 text-sm mt-1">
                {isBusinessOwner ? 'Business Owner Contract' : 'Service Provider Contract'} • {contract.id}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-700 px-6 overflow-x-auto">
            <div className="flex gap-1 min-w-max">
              {(['overview', 'edit', 'pricing', 'contract', 'signature', 'assignment', 'documents'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 font-semibold text-sm transition-colors border-b-2 ${
                    activeTab === tab
                      ? 'text-reset-green border-reset-green'
                      : 'text-gray-400 border-transparent hover:text-gray-300'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[calc(100vh-300px)] overflow-y-auto space-y-6">
            <AnimatePresence mode="wait">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="space-y-6">
                    {/* Status */}
                    <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/50">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-white">Status</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(contract.approvalStatus)}`}>
                          {contract.approvalStatus?.charAt(0).toUpperCase() + contract.approvalStatus?.slice(1) || 'Draft'}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-reset-green" />
                          Submitted: {contract.submittedAt ? new Date(contract.submittedAt.toDate()).toLocaleDateString('en-AU') : 'Not submitted'}
                        </div>
                        {contract.signingStatus && (
                          <div className="flex items-center gap-2">
                            <FileText size={14} className="text-reset-green" />
                            Signing Status: {contract.signingStatus}
                          </div>
                        )}
                        {contract.approvedAt && (
                          <div className="flex items-center gap-2">
                            <CheckCircle size={14} className="text-reset-green" />
                            Approved: {new Date(contract.approvedAt.toDate()).toLocaleDateString('en-AU')}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Contract Details */}
                    <div>
                      <h3 className="font-bold text-white mb-4">Contract Details</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {isBusinessOwner ? (
                          <>
                            <DetailItem label="Company" value={editedContract.company || 'N/A'} />
                            <DetailItem label="Contact Name" value={editedContract.primaryContactName || 'N/A'} />
                            <DetailItem label="Phone" value={editedContract.primaryContactPhone || 'N/A'} />
                            <DetailItem label="Address" value={editedContract.address || 'N/A'} />
                            <DetailItem label="Property Type" value={editedContract.propertyType || 'N/A'} />
                            <DetailItem label="Cleaning Frequency" value={editedContract.cleaningFrequency || 'N/A'} />
                          </>
                        ) : (
                          <>
                            <DetailItem label="Name" value={`${editedContract.firstName} ${editedContract.lastName}`} />
                            <DetailItem label="Email" value={editedContract.email || 'N/A'} />
                            <DetailItem label="Phone" value={editedContract.phone || 'N/A'} />
                            <DetailItem label="Service Area" value={editedContract.suburb || 'N/A'} />
                            <DetailItem label="Hourly Rate" value={`$${editedContract.baseHourlyRate || 'TBD'}/hr`} />
                            <DetailItem label="ABN" value={editedContract.abn || 'N/A'} />
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Edit Tab */}
              {activeTab === 'edit' && (
                <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-white">Edit Contract Information</h3>
                      {!isEditing ? (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="px-3 py-2 bg-reset-green/20 text-reset-green rounded hover:bg-reset-green/30 transition-colors font-semibold flex items-center gap-2"
                        >
                          <Edit2 size={16} />
                          Edit
                        </button>
                      ) : (
                        <button
                          onClick={handleSaveChanges}
                          disabled={isLoading}
                          className="px-3 py-2 bg-reset-green text-black rounded hover:bg-reset-green/80 transition-colors font-semibold disabled:opacity-50 flex items-center gap-2"
                        >
                          <Save size={16} />
                          Save Changes
                        </button>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="grid grid-cols-2 gap-4">
                        {isBusinessOwner ? (
                          <>
                            <EditableField
                              label="Company"
                              value={editedContract.company || ''}
                              onChange={(val) => handleEditField('company', val)}
                            />
                            <EditableField
                              label="Contact Name"
                              value={editedContract.primaryContactName || ''}
                              onChange={(val) => handleEditField('primaryContactName', val)}
                            />
                            <EditableField
                              label="Phone"
                              value={editedContract.primaryContactPhone || ''}
                              onChange={(val) => handleEditField('primaryContactPhone', val)}
                            />
                            <EditableField
                              label="Address"
                              value={editedContract.address || ''}
                              onChange={(val) => handleEditField('address', val)}
                            />
                            <EditableField
                              label="Property Type"
                              value={editedContract.propertyType || ''}
                              onChange={(val) => handleEditField('propertyType', val)}
                            />
                            <EditableField
                              label="Cleaning Frequency"
                              value={editedContract.cleaningFrequency || ''}
                              onChange={(val) => handleEditField('cleaningFrequency', val)}
                            />
                          </>
                        ) : (
                          <>
                            <EditableField
                              label="First Name"
                              value={editedContract.firstName || ''}
                              onChange={(val) => handleEditField('firstName', val)}
                            />
                            <EditableField
                              label="Last Name"
                              value={editedContract.lastName || ''}
                              onChange={(val) => handleEditField('lastName', val)}
                            />
                            <EditableField
                              label="Email"
                              value={editedContract.email || ''}
                              onChange={(val) => handleEditField('email', val)}
                            />
                            <EditableField
                              label="Phone"
                              value={editedContract.phone || ''}
                              onChange={(val) => handleEditField('phone', val)}
                            />
                            <EditableField
                              label="Service Area"
                              value={editedContract.suburb || ''}
                              onChange={(val) => handleEditField('suburb', val)}
                            />
                            <EditableField
                              label="Hourly Rate"
                              value={editedContract.baseHourlyRate?.toString() || ''}
                              onChange={(val) => handleEditField('baseHourlyRate', parseFloat(val))}
                            />
                          </>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">Click "Edit" to make changes to contract information.</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Pricing Tab */}
              {activeTab === 'pricing' && (
                <motion.div key="pricing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {pricing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 bg-reset-green/10 rounded-lg border border-reset-green/30">
                          <p className="text-gray-400 text-sm mb-1">Monthly Rate</p>
                          <p className="text-2xl font-bold text-reset-green">${pricing.monthlyRate.toFixed(2)}</p>
                        </div>
                        <div className="p-4 bg-reset-green/10 rounded-lg border border-reset-green/30">
                          <p className="text-gray-400 text-sm mb-1">Annual Rate</p>
                          <p className="text-2xl font-bold text-reset-green">${pricing.annualRate.toFixed(2)}</p>
                        </div>
                        <div className="p-4 bg-reset-green/10 rounded-lg border border-reset-green/30">
                          <p className="text-gray-400 text-sm mb-1">Per Visit</p>
                          <p className="text-2xl font-bold text-reset-green">${pricing.perVisitRate.toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="bg-gray-900/50 rounded-lg border border-gray-700/50 p-4">
                        <h4 className="font-bold text-white mb-3">Pricing Breakdown</h4>
                        <div className="space-y-2 text-sm">
                          {pricing.breakdown.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-700/30 last:border-0">
                              <div>
                                <p className="font-semibold text-gray-300">{item.category}</p>
                                <p className="text-xs text-gray-500">{item.description}</p>
                              </div>
                              <p className={`font-bold ${item.amount >= 0 ? 'text-reset-green' : 'text-blue-400'}`}>
                                ${item.amount.toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-400">Pricing calculation not available for this contract type.</p>
                  )}
                </motion.div>
              )}

              {/* Contract Tab */}
              {activeTab === 'contract' && (
                <motion.div key="contract" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="space-y-4">
                    {!contractPreview ? (
                      <button
                        onClick={handleGenerateContract}
                        disabled={isLoading}
                        className="w-full px-4 py-3 bg-reset-green text-black rounded-lg hover:bg-reset-green/80 transition-colors font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isLoading ? '⏳ Generating...' : (
                          <>
                            <FileText size={18} />
                            Generate Contract Document
                          </>
                        )}
                      </button>
                    ) : (
                      <>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setContractPreview('')}
                            className="flex-1 px-4 py-2 bg-gray-700/50 text-gray-300 rounded hover:bg-gray-700 transition-colors font-semibold"
                          >
                            Generate New
                          </button>
                          <button
                            onClick={handleDownloadContract}
                            className="flex-1 px-4 py-2 bg-reset-green/20 text-reset-green border border-reset-green/30 rounded hover:bg-reset-green/30 transition-colors font-semibold flex items-center justify-center gap-2"
                          >
                            <Download size={16} />
                            Download
                          </button>
                          <button
                            onClick={() => setShowSignature(true)}
                            className="flex-1 px-4 py-2 bg-reset-green text-black rounded hover:bg-reset-green/80 transition-colors font-semibold flex items-center justify-center gap-2"
                          >
                            <FileText size={16} />
                            Sign Document
                          </button>
                        </div>
                        <div className="bg-gray-900/50 rounded-lg border border-gray-700/50 p-4 max-h-96 overflow-y-auto">
                          <div
                            className="text-sm text-gray-300"
                            dangerouslySetInnerHTML={{ __html: contractPreview }}
                            style={{ fontSize: '12px', lineHeight: '1.4' }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Signature Tab */}
              {activeTab === 'signature' && (
                <motion.div key="signature" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {showSignature ? (
                    <DigitalSignaturePad
                      onSignatureCapture={handleSignatureCapture}
                      label={`Sign as ${getContractName()}`}
                      isLoading={isLoading}
                    />
                  ) : (
                    <div className="space-y-4">
                      {contract.signingStatus === 'signed' ? (
                        <div className="p-4 bg-reset-green/20 border border-reset-green/30 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-5 h-5 text-reset-green" />
                            <span className="font-bold text-reset-green">Contract Signed</span>
                          </div>
                          <p className="text-sm text-gray-300">
                            Signed on {contract.signedAt ? new Date(contract.signedAt.toDate()).toLocaleDateString('en-AU') : 'Unknown date'}
                          </p>
                        </div>
                      ) : (
                        <>
                          <p className="text-gray-400 text-sm">
                            Generate and review the contract document first, then sign it digitally below.
                          </p>
                          {contractPreview && (
                            <button
                              onClick={() => setShowSignature(true)}
                              className="w-full px-4 py-3 bg-reset-green text-black rounded-lg hover:bg-reset-green/80 transition-colors font-semibold flex items-center justify-center gap-2"
                            >
                              <FileText size={18} />
                              Sign Contract
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Assignment Tab */}
              {activeTab === 'assignment' && (
                <motion.div key="assignment" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="space-y-4">
                    {!isBusinessOwner && (
                      <>
                        {contract.currentAssignedSubcontractor && (
                          <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/50">
                            <p className="text-sm text-gray-400 mb-2">Currently Assigned To</p>
                            <p className="font-bold text-white text-lg">{contract.currentAssignedSubcontractor.subcontractorName}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Since {new Date(contract.currentAssignedSubcontractor.assignedAt.toDate()).toLocaleDateString('en-AU')}
                            </p>
                          </div>
                        )}

                        <div>
                          <label className="block text-sm font-bold text-gray-300 mb-3">Assign/Reassign to Subcontractor</label>
                          <select
                            value={selectedSubcontractor}
                            onChange={(e) => setSelectedSubcontractor(e.target.value)}
                            disabled={isLoading}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 text-white rounded focus:outline-none focus:border-reset-green mb-3"
                          >
                            <option value="">Select a subcontractor...</option>
                            {subcontractors.map((sub) => (
                              <option key={sub.id} value={sub.id}>
                                {sub.name}
                              </option>
                            ))}
                          </select>

                          {contract.currentAssignedSubcontractor && (
                            <textarea
                              placeholder="Reason for reassignment (optional)"
                              value={reassignmentReason}
                              onChange={(e) => setReassignmentReason(e.target.value)}
                              disabled={isLoading}
                              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 text-white rounded focus:outline-none focus:border-reset-green resize-none h-24 mb-3"
                            />
                          )}

                          <button
                            onClick={handleAssignToSubcontractor}
                            disabled={!selectedSubcontractor || isLoading}
                            className="w-full px-4 py-3 bg-reset-green text-black rounded-lg hover:bg-reset-green/80 transition-colors font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            {isLoading ? '⏳ Assigning...' : (
                              <>
                                <Users size={18} />
                                {contract.currentAssignedSubcontractor ? 'Reassign' : 'Assign'} Contract
                              </>
                            )}
                          </button>
                        </div>

                        {contract.assignments && contract.assignments.length > 0 && (
                          <div className="bg-gray-900/50 rounded-lg border border-gray-700/50 p-4">
                            <h4 className="font-bold text-white mb-3">Assignment History</h4>
                            <div className="space-y-2">
                              {contract.assignments.map((assignment, idx) => (
                                <div key={idx} className="text-sm py-2 border-b border-gray-700/30 last:border-0">
                                  <p className="font-semibold text-gray-300">{assignment.subcontractorName}</p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(assignment.assignedAt.toDate()).toLocaleDateString('en-AU')}
                                    {assignment.reassignmentReason && ` - ${assignment.reassignmentReason}`}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {isBusinessOwner && (
                      <p className="text-gray-400">Assignment is only available for service provider contracts.</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Documents Tab */}
              {activeTab === 'documents' && (
                <motion.div key="documents" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-reset-green/30 rounded-lg p-4">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          onChange={handleAddDocument}
                          disabled={isLoading}
                          className="hidden"
                        />
                        <div className="flex items-center justify-center gap-2 text-reset-green hover:text-reset-green/80 transition-colors">
                          <Upload size={18} />
                          <span className="font-semibold">{isLoading ? 'Uploading...' : 'Add Document'}</span>
                        </div>
                      </label>
                    </div>

                    {documents.length > 0 && (
                      <div className="space-y-2">
                        {documents.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between p-3 bg-gray-900/50 rounded border border-gray-700/50 hover:border-reset-green/30 transition-colors"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <FileText className="w-5 h-5 text-reset-green flex-shrink-0" />
                              <div className="min-w-0">
                                <a
                                  href={doc.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-white hover:text-reset-green transition-colors truncate block"
                                >
                                  {doc.name}
                                </a>
                                <p className="text-xs text-gray-500">
                                  {doc.uploadedAt ? new Date(doc.uploadedAt.toDate()).toLocaleDateString('en-AU') : 'Unknown date'}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoveDocument(doc.id)}
                              className="p-2 hover:bg-red-500/20 rounded transition-colors text-red-400"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-700/50 p-6 bg-black/50">
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800/50 transition-colors font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => setActiveTab('overview')}
                className="flex-1 px-4 py-3 bg-reset-green/20 text-reset-green border border-reset-green/30 rounded-lg hover:bg-reset-green/30 transition-colors font-semibold"
              >
                Back to Overview
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

// Helper Components

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 bg-gray-900/50 rounded border border-gray-700/50">
      <p className="text-gray-400 text-xs mb-1">{label}</p>
      <p className="text-white font-semibold">{value}</p>
    </div>
  );
}

function EditableField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-300 mb-2">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 text-white rounded focus:outline-none focus:border-reset-green"
      />
    </div>
  );
}
