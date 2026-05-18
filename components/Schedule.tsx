'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, AlertCircle, CheckCircle, Filter, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Timestamp } from 'firebase/firestore';
import { subscribeToAllContracts, updateContract, Contract } from '@/lib/db/contracts';
import { subscribeToJobs, updateJob, CleaningJob } from '@/lib/db/jobs';
import { subscribeToTickets, SupportTicket } from '@/lib/db/tickets';
import { subscribeToAllUsers, UserProfile } from '@/lib/db/users';
import { Toast, useToast } from '@/components/Toast';

export default function Schedule() {
  const { toasts, addToast, removeToast } = useToast();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [jobs, setJobs] = useState<CleaningJob[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);

  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [filterSubcontractor, setFilterSubcontractor] = useState<string>('all');
  const [rescheduleJobId, setRescheduleJobId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsub1 = subscribeToAllContracts((data) => setContracts(data));
    const unsub2 = subscribeToJobs((data) => setJobs(data));
    const unsub3 = subscribeToTickets((data) => setTickets(data));
    const unsub4 = subscribeToAllUsers((data) => setUsers(data));

    return () => {
      unsub1();
      unsub2();
      unsub3();
      unsub4();
    };
  }, []);

  const activeContracts = contracts.filter(c => c.status === 'active');

  const filteredContracts = filterSubcontractor === 'all'
    ? activeContracts
    : activeContracts.filter(c => c.subcontractorId === filterSubcontractor);

  const associatedJobs = selectedContract
    ? jobs.filter(j => j.contractId === selectedContract.id)
    : [];

  const rescheduleTickets = selectedContract
    ? tickets.filter(t =>
        t.source === 'reschedule-request' &&
        t.contractId === selectedContract.id
      )
    : [];

  const handleRescheduleJob = async () => {
    if (!rescheduleJobId || !rescheduleDate) {
      addToast('Please select a date', 'error');
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

  const formatDate = (date: string | Timestamp): string => {
    if (!date) return 'N/A';
    if (date instanceof Timestamp) {
      return date.toDate().toLocaleDateString('en-AU');
    }
    return new Date(date).toLocaleDateString('en-AU');
  };

  const formatDateTime = (date: Timestamp): string => {
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
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'scheduled':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'in-progress':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const checkJobAvailability = (job: CleaningJob): boolean => {
    if (!job.subcontractorId) return true;

    const subcontractor = users.find(u => u.id === job.subcontractorId);
    if (!subcontractor) return true;

    const jobDate = job.scheduledDate instanceof Timestamp
      ? job.scheduledDate.toDate().toISOString().split('T')[0]
      : new Date(job.scheduledDate).toISOString().split('T')[0];

    const unavailableDates = subcontractor.unavailableDates || [];
    const isUnavailable = unavailableDates.some(u => u.date === jobDate);

    if (isUnavailable) return false;

    const workingDays = subcontractor.workingDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const jobDateObj = new Date(jobDate);
    const dayName = jobDateObj.toLocaleDateString('en-AU', { weekday: 'short' });

    return workingDays.includes(dayName);
  };

  return (
    <>
      <Toast toasts={toasts} onRemove={removeToast} />
      <div className="p-6 lg:p-8 rounded-xl glass border border-reset-green/30 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel: Contract List */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-reset-green" />
            <h3 className="text-lg font-bold text-white">Contracts</h3>
          </div>

          {/* Filter */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-300 mb-2">Filter by Subcontractor</label>
            <select
              value={filterSubcontractor}
              onChange={(e) => setFilterSubcontractor(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded text-sm focus:outline-none focus:border-reset-green"
            >
              <option value="all">All Subcontractors</option>
              {Array.from(new Set(activeContracts.map(c => c.subcontractorId))).map(subId => {
                const contract = activeContracts.find(c => c.subcontractorId === subId);
                return (
                  <option key={subId} value={subId}>
                    {contract?.subcontractorName}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Contract List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredContracts.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">No active contracts</p>
            ) : (
              filteredContracts.map((contract) => (
                <button
                  key={contract.id}
                  onClick={() => setSelectedContract(contract)}
                  className={`w-full p-4 rounded-lg border transition-all text-left ${
                    selectedContract?.id === contract.id
                      ? 'bg-reset-green/20 border-reset-green/50'
                      : 'bg-gray-900/50 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <p className="font-bold text-white text-sm">{contract.clientName}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {contract.subcontractorName.split(' ')[0]} • {contract.frequency}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs">
                    <span className={`px-2 py-1 rounded ${getStatusColor(contract.status)}`}>
                      {contract.status}
                    </span>
                    <span className="text-gray-500">{associatedJobs.length} jobs</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Panel: Jobs & Reschedule Requests */}
        {selectedContract ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Contract Header */}
            <div className="p-4 bg-white/5 border border-reset-green/20 rounded-lg">
              <h3 className="text-lg font-bold text-white mb-2">{selectedContract.clientName}</h3>
              <p className="text-sm text-gray-400">
                {selectedContract.subcontractorName} • {selectedContract.frequency} • Started {formatDate(selectedContract.startDate)}
              </p>
            </div>

            {/* Jobs List */}
            <div className="p-6 bg-white/5 border border-reset-green/20 rounded-lg">
              <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Clock size={20} />
                Scheduled Jobs
              </h4>

              {associatedJobs.length === 0 ? (
                <p className="text-gray-400 text-center py-6">No jobs scheduled for this contract</p>
              ) : (
                <div className="space-y-3">
                  {associatedJobs.map((job) => {
                    const isAvailable = checkJobAvailability(job);
                    const cardColor = !isAvailable && (job.status === 'assigned' || job.status === 'in-progress')
                      ? 'bg-yellow-600/20 text-yellow-400 border-yellow-600/50'
                      : getStatusColor(job.status);

                    return (
                    <div key={job.id} className={`p-4 rounded-lg border ${cardColor}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-bold text-white">{job.type}</p>
                          <p className="text-xs opacity-80 mt-1">
                            {formatDate(job.scheduledDate)} at {job.location}
                          </p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-black/30 rounded">
                          {job.status}
                        </span>
                      </div>

                      {(job.status === 'assigned' || job.status === 'in-progress') && (
                        <>
                          {rescheduleJobId === job.id ? (
                            <div className="mt-3 pt-3 border-t border-current/30 space-y-2">
                              <input
                                type="datetime-local"
                                value={rescheduleDate}
                                onChange={(e) => setRescheduleDate(e.target.value)}
                                className="w-full px-3 py-2 bg-black/40 border border-current/50 text-white rounded text-sm focus:outline-none"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setRescheduleJobId(null);
                                    setRescheduleDate('');
                                  }}
                                  className="flex-1 px-3 py-1 bg-black/40 hover:bg-black/60 rounded text-xs font-bold transition-colors"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={handleRescheduleJob}
                                  disabled={isSubmitting || !rescheduleDate}
                                  className="flex-1 px-3 py-1 bg-reset-green text-black rounded text-xs font-bold hover:bg-reset-green/80 transition-colors disabled:opacity-50"
                                >
                                  {isSubmitting ? 'Saving...' : 'Save'}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => setRescheduleJobId(job.id)}
                              className="mt-3 px-3 py-1 text-xs font-bold bg-black/40 hover:bg-black/60 rounded transition-colors"
                            >
                              Reschedule
                            </button>
                          )}
                        </>
                      )}

                      {!isAvailable && (job.status === 'assigned' || job.status === 'in-progress') && (
                        <div className="mt-3 pt-3 border-t border-current/30 flex items-start gap-2 text-xs text-yellow-400">
                          <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                          <span>Subcontractor unavailable on this date. Please reschedule or reassign.</span>
                        </div>
                      )}
                    </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Reschedule Requests */}
            {rescheduleTickets.length > 0 && (
              <div className="p-6 bg-white/5 border border-yellow-600/30 rounded-lg">
                <h4 className="text-lg font-bold text-yellow-400 mb-4 flex items-center gap-2">
                  <AlertCircle size={20} />
                  Reschedule Requests ({rescheduleTickets.length})
                </h4>

                <div className="space-y-3">
                  {rescheduleTickets.map((ticket) => (
                    <div key={ticket.id} className="p-4 bg-yellow-900/20 border border-yellow-600/50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-bold text-white">{ticket.subject}</p>
                        <span className={`text-xs px-2 py-1 rounded ${
                          ticket.status === 'resolved'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {ticket.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mb-2">{ticket.message}</p>
                      <p className="text-xs text-gray-500">
                        Requested by {ticket.userName} • {formatDateTime(ticket.createdAt as any)}
                      </p>
                      {ticket.requestedDate && (
                        <p className="text-xs text-yellow-400 mt-2">
                          Requested date: {formatDate(ticket.requestedDate)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="lg:col-span-2 flex items-center justify-center min-h-96">
            <div className="text-center">
              <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Select a contract to view and manage schedule</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
