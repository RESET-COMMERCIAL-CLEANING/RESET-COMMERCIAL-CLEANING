'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, CheckCircle, XCircle, Calendar, User, Upload, Trash2, Clock } from 'lucide-react';
import { useState } from 'react';
import { Contract, ContractDocument } from '@/lib/db/contracts';
import { updateContract } from '@/lib/db/contracts';
import { uploadContractDocument } from '@/lib/storage';
import { Toast, useToast } from '@/components/Toast';
import { Timestamp } from 'firebase/firestore';

interface ContractApprovalPanelProps {
  contract: Contract;
  onClose: () => void;
  onApproval: () => void;
}

export default function ContractApprovalPanel({ contract, onClose, onApproval }: ContractApprovalPanelProps) {
  const { toasts, addToast, removeToast } = useToast();
  const [notes, setNotes] = useState(contract.approvalNotes || '');
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState<ContractDocument[]>(contract.documents || []);
  const [uploading, setUploading] = useState(false);

  const handleAddDocument = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadContractDocument(file, contract.id);
      const newDoc: ContractDocument = {
        id: Date.now().toString(),
        name: file.name,
        url,
        uploadedAt: Timestamp.now(),
        uploadedBy: 'superuser',
        documentType: 'supporting',
        version: 1,
      };
      setDocuments([...documents, newDoc]);
      addToast(`Document "${file.name}" uploaded successfully!`, 'success');
    } catch (error) {
      console.error('Error uploading document:', error);
      addToast('Failed to upload document', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveDocument = (docId: string) => {
    setDocuments(documents.filter(d => d.id !== docId));
    addToast('Document removed', 'info');
  };

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      await updateContract(contract.id, {
        status: 'approved',
        documents,
        approvalNotes: notes,
        approvedAt: Timestamp.now(),
        approvalHistory: [
          ...(contract.approvalHistory || []),
          {
            status: 'approved',
            changedAt: Timestamp.now(),
            changedBy: 'superuser',
            notes,
          },
        ],
      });
      addToast('Contract approved successfully!', 'success');
      onApproval();
    } catch (error) {
      console.error('Error approving contract:', error);
      addToast('Failed to approve contract', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      await updateContract(contract.id, {
        status: 'rejected',
        documents,
        approvalNotes: notes,
        approvalHistory: [
          ...(contract.approvalHistory || []),
          {
            status: 'rejected',
            changedAt: Timestamp.now(),
            changedBy: 'superuser',
            notes,
          },
        ],
      });
      addToast('Contract rejected', 'info');
      onApproval();
    } catch (error) {
      console.error('Error rejecting contract:', error);
      addToast('Failed to reject contract', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadgeColor = (status?: string) => {
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
    if (contract.contractType === 'business-owner') {
      return contract.company || 'Business Owner Contract';
    } else {
      return `${contract.firstName || ''} ${contract.lastName || ''}`.trim() || 'Service Provider Contract';
    }
  };

  return (
    <>
      <Toast toasts={toasts} onRemove={removeToast} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-black border border-reset-green/30 rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-black/95 border-b border-reset-green/30 p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">{getContractName()}</h2>
              <p className="text-gray-400 text-sm mt-1">
                {contract.contractType === 'business-owner' ? 'Business Owner Contract' : 'Service Provider Contract'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Status Section */}
            <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-white">Status</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadgeColor(contract.status)}`}>
                  {contract.status?.charAt(0).toUpperCase() + contract.status?.slice(1) || 'Draft'}
                </span>
              </div>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-reset-green" />
                  Submitted: {contract.submittedAt ? new Date(contract.submittedAt.toDate()).toLocaleDateString('en-AU') : 'Not submitted'}
                </div>
                {contract.approvedAt && (
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-reset-green" />
                    Approved: {new Date(contract.approvedAt.toDate()).toLocaleDateString('en-AU')}
                  </div>
                )}
              </div>
            </div>

            {/* Contract Details */}
            <div className="space-y-4">
              <h3 className="font-bold text-white">Contract Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {contract.contractType === 'business-owner' ? (
                  <>
                    <div className="p-3 bg-gray-900/50 rounded border border-gray-700/50">
                      <p className="text-gray-400 text-xs mb-1">Company</p>
                      <p className="text-white font-semibold">{contract.company || 'N/A'}</p>
                    </div>
                    <div className="p-3 bg-gray-900/50 rounded border border-gray-700/50">
                      <p className="text-gray-400 text-xs mb-1">Contact Name</p>
                      <p className="text-white font-semibold">{contract.primaryContactName || 'N/A'}</p>
                    </div>
                    <div className="p-3 bg-gray-900/50 rounded border border-gray-700/50">
                      <p className="text-gray-400 text-xs mb-1">Property Type</p>
                      <p className="text-white font-semibold">{contract.propertyType || 'N/A'}</p>
                    </div>
                    <div className="p-3 bg-gray-900/50 rounded border border-gray-700/50">
                      <p className="text-gray-400 text-xs mb-1">Cleaning Frequency</p>
                      <p className="text-white font-semibold">{contract.cleaningFrequency || 'N/A'}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-3 bg-gray-900/50 rounded border border-gray-700/50">
                      <p className="text-gray-400 text-xs mb-1">Name</p>
                      <p className="text-white font-semibold">{contract.firstName} {contract.lastName}</p>
                    </div>
                    <div className="p-3 bg-gray-900/50 rounded border border-gray-700/50">
                      <p className="text-gray-400 text-xs mb-1">Email</p>
                      <p className="text-white font-semibold text-xs">{contract.email || 'N/A'}</p>
                    </div>
                    <div className="p-3 bg-gray-900/50 rounded border border-gray-700/50">
                      <p className="text-gray-400 text-xs mb-1">Service Area</p>
                      <p className="text-white font-semibold">{contract.suburb || 'N/A'}</p>
                    </div>
                    <div className="p-3 bg-gray-900/50 rounded border border-gray-700/50">
                      <p className="text-gray-400 text-xs mb-1">Hourly Rate</p>
                      <p className="text-white font-semibold">${contract.baseHourlyRate || 'N/A'}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Documents Section */}
            <div className="space-y-3">
              <h3 className="font-bold text-white">Documents</h3>
              <div className="border-2 border-dashed border-reset-green/30 rounded-lg p-4">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    onChange={handleAddDocument}
                    disabled={uploading}
                    className="hidden"
                  />
                  <div className="flex items-center justify-center gap-2 text-reset-green hover:text-reset-green/80 transition-colors">
                    <Upload size={18} />
                    <span className="font-semibold">{uploading ? 'Uploading...' : 'Add Document'}</span>
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

            {/* Approval Notes */}
            <div className="space-y-3">
              <h3 className="font-bold text-white">Approval Notes</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this contract approval..."
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:border-reset-green focus:outline-none resize-none h-24"
              />
            </div>

            {/* Approval History */}
            {contract.approvalHistory && contract.approvalHistory.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-bold text-white">Approval History</h3>
                <div className="space-y-2">
                  {contract.approvalHistory.map((entry, idx) => (
                    <div key={idx} className="p-3 bg-gray-900/50 rounded border border-gray-700/50 text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock size={14} className="text-reset-green" />
                        <span className="font-semibold text-white capitalize">{entry.status}</span>
                        <span className="text-gray-500">
                          {new Date(entry.changedAt.toDate()).toLocaleDateString('en-AU')}
                        </span>
                      </div>
                      {entry.notes && (
                        <p className="text-gray-300 ml-6">{entry.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {!contract.status || contract.status !== 'approved' ? (
              <div className="flex gap-3 pt-4 border-t border-gray-700/50">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800/50 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg hover:bg-red-600/30 transition-colors font-semibold disabled:opacity-50"
                >
                  <XCircle className="inline mr-2" size={18} />
                  Reject
                </button>
                <button
                  onClick={handleApprove}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-reset-green text-black rounded-lg hover:bg-reset-green/80 transition-colors font-semibold disabled:opacity-50"
                >
                  <CheckCircle className="inline mr-2" size={18} />
                  Approve
                </button>
              </div>
            ) : (
              <div className="flex gap-3 pt-4 border-t border-gray-700/50">
                <button
                  onClick={onClose}
                  className="w-full px-4 py-3 bg-reset-green/20 text-reset-green border border-reset-green/30 rounded-lg hover:bg-reset-green/30 transition-colors font-semibold"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
