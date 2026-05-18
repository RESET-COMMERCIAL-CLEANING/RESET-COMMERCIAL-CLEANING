'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, X, Save, Calendar, Clock, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Timestamp } from 'firebase/firestore';
import { subscribeToAllContracts, updateContract, Contract } from '@/lib/db/contracts';
import { subscribeToJobs, updateJob, CleaningJob } from '@/lib/db/jobs';
import { subscribeToAllUsers, UserProfile } from '@/lib/db/users';
import { subscribeToTickets, SupportTicket } from '@/lib/db/tickets';
import { Toast, useToast } from '@/components/Toast';

export default function ContractManagement() {
  const { toasts, addToast, removeToast } = useToast();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [jobs, setJobs] = useState<CleaningJob[]>([]);
  const [subcontractors, setSubcontractors] = useState<UserProfile[]>([]);
  const [allTickets, setAllTickets] = useState<SupportTicket[]>([]);

  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [filterSubcontractor, setFilterSubcontractor] = useState<string>('all');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Contract>>({});
  const [rescheduleJobId, setRescheduleJobId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribeContracts = subscribeToAllContracts((data) => setContracts(data));
    const unsubscribeJobs = subscribeToJobs((data) => setJobs(data));
    const unsubscribeTickets = subscribeToTickets((data) => setAllTickets(data));

    return () => {
      unsubscribeContracts();
      unsubscribeJobs();
      unsubscribeTickets();
    };
  }, []);

  useEffect(() => {
    const unsubscribeUsers = subscribeToAllUsers((users) => {
      const subs = users.filter(u => u.role === 'subcontractor');
      setSubcontractors(subs);
    });

    return () => unsubscribeUsers();
  }, []);

  const filteredContracts = filterSubcontractor === 'all'
    ? contracts
    : contracts.filter(c => c.subcontractorId === filterSubcontractor);

  const associatedJobs = selectedContract
    ? jobs.filter(j => j.contractId === selectedContract.id)
    : [];

  const linkedTickets = selectedContract
    ? allTickets.filter(t =>
        (t.source === 'reschedule-request' || t.category === 'reschedule') &&
        t.userEmail === selectedContract.subcontractorName
      ).slice(0, 3)
    : [];

  const handleEditContract = () => {
    if (selectedContract) {
      setEditForm({
        type: selectedContract.type,
        frequency: selectedContract.frequency,
        hourlyRate: selectedContract.hourlyRate,
        status: selectedContract.status,
        endDate: selectedContract.endDate,
        notes: selectedContract.notes,
      });
      setIsEditing(true);
    }
  };

  const handleSaveContract = async () => {
    if (!selectedContract) return;

    setIsSubmitting(true);
    try {
      await updateContract(selectedContract.id, editForm);
      setSelectedContract({ ...selectedContract, ...editForm });
      setIsEditing(false);
      addToast('Contract updated successfully', 'success');
    } catch (error) {
      addToast('Failed to update contract', 'error');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRescheduleJob = async () => {
    if (!rescheduleJobId || !rescheduleDate) {
      addToast('Please select a date and time', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const newDate = new Date(rescheduleDate);
      await updateJob(rescheduleJobId, {
        scheduledDate: Timestamp.fromDate(newDate),
      });
      setRescheduleJobId(null);
      setRescheduleDate('');
      addToast('Job rescheduled successfully', 'success');
    } catch (error) {
      addToast('Failed to reschedule job', 'error');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: string | Timestamp) => {
    if (!date) return 'N/A';
    if (date instanceof Timestamp) {
      return date.toDate().toLocaleDateString('en-AU', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
    return new Date(date).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (date: Timestamp) => {
    return date.toDate().toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'completed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'paused':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <Toast toasts={toasts} onRemove={removeToast} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Contract List */}
        <div className="lg:col-span-1">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Contracts</h2>
            <select
              value={filterSubcontractor}
              onChange={(e) => {
                setFilterSubcontractor(e.target.value);
                setSelectedContract(null);
              }}
              className="w-full px-4 py-2 bg-gray-900 border border-reset-green/30 text-white rounded-lg focus:outline-none focus:border-reset-green"
            >
              <option value="all">All Subcontractors</option>
              {subcontractors.map(sub => (
                <option key={sub.id} value={sub.id}>
                  {sub.firstName} {sub.lastName}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredContracts.length === 0 ? (
              <div className="text-gray-400 text-center py-8">
                No contracts found
              </div>
            ) : (
              filteredContracts.map(contract => (
                <motion.button
                  key={contract.id}
                  onClick={() => setSelectedContract(contract)}
                  whileHover={{ x: 4 }}
                  className={`w-full p-4 rounded-lg text-left transition-all ${
                    selectedContract?.id === contract.id
                      ? 'bg-reset-green/20 border-reset-green/50 border-2'
                      : 'bg-gray-900/50 border border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="font-semibold text-white truncate">{contract.clientName}</div>
                  <div className="text-sm text-gray-400 truncate">{contract.subcontractorName}</div>
                  <div className="text-xs text-gray-500 mt-1">{contract.type}</div>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(contract.status)}`}>
                      {contract.status}
                    </span>
                    <span className="text-xs text-gray-400">{contract.frequency}</span>
                  </div>
                </motion.button>
              ))
            )}
          </div>
        </div>

        {/* Right Column - Contract Details */}
        <div className="lg:col-span-2">
          {!selectedContract ? (
            <div className="bg-gray-900/50 rounded-lg p-8 text-center text-gray-400">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Select a contract to view details</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Contract Info */}
              <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Contract Details</h3>
                  {!isEditing && (
                    <button
                      onClick={handleEditContract}
                      className="flex items-center gap-2 px-3 py-1 bg-reset-green/20 text-reset-green rounded hover:bg-reset-green/30 transition"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-300">Type</label>
                      <input
                        type="text"
                        value={editForm.type || ''}
                        onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                        className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded focus:outline-none focus:border-reset-green"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-300">Frequency</label>
                      <input
                        type="text"
                        value={editForm.frequency || ''}
                        onChange={(e) => setEditForm({ ...editForm, frequency: e.target.value })}
                        className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded focus:outline-none focus:border-reset-green"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-300">Hourly Rate</label>
                      <input
                        type="text"
                        value={editForm.hourlyRate || ''}
                        onChange={(e) => setEditForm({ ...editForm, hourlyRate: e.target.value })}
                        className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded focus:outline-none focus:border-reset-green"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-300">End Date</label>
                      <input
                        type="text"
                        value={editForm.endDate || ''}
                        onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                        className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded focus:outline-none focus:border-reset-green"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-300">Status</label>
                      <select
                        value={editForm.status || 'active'}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                        className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded focus:outline-none focus:border-reset-green"
                      >
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="paused">Paused</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-300">Notes</label>
                      <textarea
                        value={editForm.notes || ''}
                        onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                        className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded focus:outline-none focus:border-reset-green h-20"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveContract}
                        disabled={isSubmitting}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-reset-green text-black rounded font-semibold hover:bg-reset-green/90 transition disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {isSubmitting ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex-1 px-4 py-2 bg-gray-800 text-white rounded font-semibold hover:bg-gray-700 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-400">Type</div>
                      <div className="text-white font-semibold">{selectedContract.type}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Frequency</div>
                      <div className="text-white font-semibold">{selectedContract.frequency}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Hourly Rate</div>
                      <div className="text-white font-semibold">{selectedContract.hourlyRate}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Status</div>
                      <div className={`text-sm font-semibold mt-1 inline-block px-3 py-1 rounded border ${getStatusColor(selectedContract.status)}`}>
                        {selectedContract.status}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Start Date</div>
                      <div className="text-white font-semibold">{selectedContract.startDate}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">End Date</div>
                      <div className="text-white font-semibold">{selectedContract.endDate}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Jobs Completed</div>
                      <div className="text-white font-semibold">{selectedContract.jobsCompleted}</div>
                    </div>
                    {selectedContract.notes && (
                      <div className="col-span-2">
                        <div className="text-sm text-gray-400">Notes</div>
                        <div className="text-white text-sm">{selectedContract.notes}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Associated Jobs */}
              {associatedJobs.length > 0 && (
                <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-reset-green" />
                    Associated Jobs
                  </h3>
                  <div className="space-y-3">
                    {associatedJobs.map(job => (
                      <div key={job.id} className="bg-gray-800/50 p-4 rounded border border-gray-700">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-white">{job.type}</div>
                            <div className="text-sm text-gray-400">{job.location}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              Scheduled: {formatDateTime(job.scheduledDate)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-400">Status: {job.status}</div>
                            <button
                              onClick={() => {
                                setRescheduleJobId(job.id);
                                const currentDate = job.scheduledDate.toDate();
                                const isoString = currentDate.toISOString().slice(0, 16);
                                setRescheduleDate(isoString);
                              }}
                              className="mt-2 px-3 py-1 bg-reset-green/20 text-reset-green text-xs rounded hover:bg-reset-green/30 transition"
                            >
                              Reschedule
                            </button>
                          </div>
                        </div>

                        {rescheduleJobId === job.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 pt-4 border-t border-gray-600 space-y-3"
                          >
                            <div>
                              <label className="text-sm text-gray-300">New Date & Time</label>
                              <input
                                type="datetime-local"
                                value={rescheduleDate}
                                onChange={(e) => setRescheduleDate(e.target.value)}
                                className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded focus:outline-none focus:border-reset-green"
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={handleRescheduleJob}
                                disabled={isSubmitting}
                                className="flex-1 px-3 py-1 bg-reset-green text-black text-sm rounded font-semibold hover:bg-reset-green/90 transition disabled:opacity-50"
                              >
                                {isSubmitting ? 'Updating...' : 'Confirm'}
                              </button>
                              <button
                                onClick={() => {
                                  setRescheduleJobId(null);
                                  setRescheduleDate('');
                                }}
                                className="flex-1 px-3 py-1 bg-gray-700 text-white text-sm rounded font-semibold hover:bg-gray-600 transition"
                              >
                                Cancel
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Linked Reschedule Tickets */}
              {linkedTickets.length > 0 && (
                <div className="bg-gray-900/50 rounded-lg p-6 border border-yellow-500/30">
                  <h3 className="text-lg font-bold text-yellow-400 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Reschedule Requests
                  </h3>
                  <div className="space-y-2">
                    {linkedTickets.map(ticket => (
                      <div key={ticket.id} className="text-sm text-yellow-100 p-2 bg-yellow-900/20 rounded border border-yellow-500/30">
                        <div className="font-semibold">{ticket.ticketNumber}</div>
                        <div className="text-xs text-yellow-100/70 mt-1">{ticket.subject}</div>
                        {ticket.requestedDate && (
                          <div className="text-xs text-yellow-100/70 mt-1">
                            Requested: {new Date(ticket.requestedDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
