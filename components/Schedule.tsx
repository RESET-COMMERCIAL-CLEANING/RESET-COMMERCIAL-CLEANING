'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, AlertCircle, CheckCircle, Filter, AlertTriangle, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Timestamp } from 'firebase/firestore';
import { subscribeToJobs, updateJob, CleaningJob } from '@/lib/db/jobs';
import { subscribeToContractsByType, Contract } from '@/lib/db/contracts';
import { subscribeToTickets, SupportTicket } from '@/lib/db/tickets';
import { subscribeToAllUsers, UserProfile } from '@/lib/db/users';
import { Toast, useToast } from '@/components/Toast';

export default function Schedule() {
  const { toasts, addToast, removeToast } = useToast();
  const [jobs, setJobs] = useState<CleaningJob[]>([]);
  const [businessOwnerContracts, setBusinessOwnerContracts] = useState<Contract[]>([]);
  const [subcontractorContracts, setSubcontractorContracts] = useState<Contract[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);

  const [selectedJob, setSelectedJob] = useState<CleaningJob | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('assigned');
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [reassignSubId, setReassignSubId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsub1 = subscribeToJobs(setJobs);
    const unsub2 = subscribeToContractsByType('business-owner', setBusinessOwnerContracts);
    const unsub3 = subscribeToContractsByType('subcontractor', setSubcontractorContracts);
    const unsub4 = subscribeToTickets(setTickets);
    const unsub5 = subscribeToAllUsers(setUsers);

    return () => {
      unsub1();
      unsub2();
      unsub3();
      unsub4();
      unsub5();
    };
  }, []);

  const getClientName = (contractId: string): string => {
    const contract = businessOwnerContracts.find(c => c.userId === contractId);
    return contract?.company || 'Unknown Client';
  };

  const getSubcontractorName = (userId: string): string => {
    const contract = subcontractorContracts.find(c => c.userId === userId);
    if (!contract) return 'Unknown';
    return `${contract.firstName} ${contract.lastName}`.trim();
  };

  // Filter jobs by status
  const filteredJobs = filterStatus === 'all'
    ? jobs
    : jobs.filter(j => j.status === filterStatus);

  // Group jobs by client
  const jobsByClient: Record<string, CleaningJob[]> = {};
  filteredJobs.forEach(job => {
    if (!jobsByClient[job.contractId]) {
      jobsByClient[job.contractId] = [];
    }
    jobsByClient[job.contractId].push(job);
  });

  const handleRescheduleJob = async () => {
    if (!selectedJob || !rescheduleDate) {
      addToast('Please select a date', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const newDate = new Date(rescheduleDate);
      await updateJob(selectedJob.id, {
        scheduledDate: Timestamp.fromDate(newDate),
      });
      setRescheduleDate('');
      addToast('Job rescheduled successfully', 'success');
    } catch (error) {
      addToast('Failed to reschedule job', 'error');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReassignJob = async () => {
    if (!selectedJob || !reassignSubId) {
      addToast('Please select a subcontractor', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const reassignmentEntry = {
        from: selectedJob.subcontractorId,
        to: reassignSubId,
        reason: 'Admin reassignment',
        reassignedAt: Timestamp.now(),
      };

      const updatedHistory = [...(selectedJob.reassignmentHistory || []), reassignmentEntry];

      await updateJob(selectedJob.id, {
        subcontractorId: reassignSubId,
        subcontractorName: getSubcontractorName(reassignSubId),
        reassignmentHistory: updatedHistory,
      });

      setReassignSubId('');
      addToast('Job reassigned successfully', 'success');
    } catch (error) {
      addToast('Failed to reassign job', 'error');
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
      case 'in-progress':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'assigned':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'available':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
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

  const availableSubcontractors = subcontractorContracts.filter(
    c => c.userId !== selectedJob?.subcontractorId && c.status === 'active'
  );

  return (
    <>
      <Toast toasts={toasts} onRemove={removeToast} />
      <div className="p-6 lg:p-8 rounded-xl glass border border-reset-green/30 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel: Jobs List */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-reset-green" />
            <h3 className="text-lg font-bold text-white">Jobs</h3>
          </div>

          {/* Status Filter */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-300 mb-2">Filter by Status</label>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setSelectedJob(null);
              }}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded text-sm focus:outline-none focus:border-reset-green"
            >
              <option value="all">All Jobs</option>
              <option value="assigned">Assigned</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Jobs by Client */}
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {Object.keys(jobsByClient).length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">No jobs found</p>
            ) : (
              Object.entries(jobsByClient).map(([clientId, clientJobs]) => (
                <div key={clientId}>
                  <h4 className="text-xs font-bold text-reset-green mb-2">
                    {getClientName(clientId)}
                  </h4>
                  <div className="space-y-2">
                    {clientJobs.map((job) => (
                      <button
                        key={job.id}
                        onClick={() => setSelectedJob(job)}
                        className={`w-full p-3 rounded-lg border transition-all text-left text-sm ${
                          selectedJob?.id === job.id
                            ? 'bg-reset-green/20 border-reset-green/50'
                            : 'bg-gray-900/50 border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <p className="font-bold text-white truncate">{job.type}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(job.scheduledDate)} • {job.duration}h
                        </p>
                        <span className={`inline-block text-xs px-2 py-1 rounded mt-2 ${getStatusColor(job.status)}`}>
                          {job.status}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Panel: Job Details & Actions */}
        {selectedJob ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Job Header */}
            <div className="p-4 bg-white/5 border border-reset-green/20 rounded-lg">
              <h3 className="text-lg font-bold text-white mb-2">{selectedJob.type}</h3>
              <p className="text-sm text-gray-400">
                {getClientName(selectedJob.contractId)} • {selectedJob.location}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {formatDate(selectedJob.scheduledDate)} • {selectedJob.duration} hours
              </p>
            </div>

            {/* Job Details */}
            <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400">Current Subcontractor</p>
                  <p className="text-white font-semibold">{selectedJob.subcontractorName}</p>
                </div>
                <div>
                  <p className="text-gray-400">Status</p>
                  <p className={`font-semibold ${getStatusColor(selectedJob.status)}`}>
                    {selectedJob.status}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Duration</p>
                  <p className="text-white font-semibold">{selectedJob.duration}h</p>
                </div>
                <div>
                  <p className="text-gray-400">Rate</p>
                  <p className="text-white font-semibold">${selectedJob.rate}/hr</p>
                </div>
              </div>
            </div>

            {/* Reschedule Job */}
            {(selectedJob.status === 'assigned' || selectedJob.status === 'in-progress') && (
              <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
                <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                  <Clock size={18} />
                  Reschedule Job
                </h4>
                <div className="space-y-2">
                  <input
                    type="datetime-local"
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded text-sm focus:outline-none focus:border-blue-400"
                  />
                  <button
                    onClick={handleRescheduleJob}
                    disabled={isSubmitting || !rescheduleDate}
                    className="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-bold transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : 'Reschedule'}
                  </button>
                </div>
              </div>
            )}

            {/* Reassign Subcontractor */}
            {(selectedJob.status === 'assigned' || selectedJob.status === 'in-progress') && (
              <div className="p-4 bg-yellow-900/20 rounded-lg border border-yellow-500/30">
                <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                  <Users size={18} />
                  Reassign to Service Provider
                </h4>
                <div className="space-y-2">
                  <select
                    value={reassignSubId}
                    onChange={(e) => setReassignSubId(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded text-sm focus:outline-none focus:border-yellow-400"
                  >
                    <option value="">Select a service provider...</option>
                    {availableSubcontractors.map((sub) => (
                      <option key={sub.userId} value={sub.userId}>
                        {sub.firstName} {sub.lastName} (${sub.baseHourlyRate}/hr)
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleReassignJob}
                    disabled={isSubmitting || !reassignSubId}
                    className="w-full px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm font-bold transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Reassigning...' : 'Reassign'}
                  </button>
                </div>
              </div>
            )}

            {/* Availability Warning */}
            {!checkJobAvailability(selectedJob) && (
              <div className="p-4 bg-yellow-900/20 border border-yellow-600/50 rounded-lg flex items-start gap-3">
                <AlertTriangle size={18} className="flex-shrink-0 text-yellow-400 mt-0.5" />
                <div>
                  <p className="font-bold text-yellow-400">Subcontractor Unavailable</p>
                  <p className="text-sm text-yellow-300 mt-1">
                    {selectedJob.subcontractorName} is marked unavailable on {formatDate(selectedJob.scheduledDate)}.
                    Consider rescheduling or reassigning.
                  </p>
                </div>
              </div>
            )}

            {/* Reassignment History */}
            {selectedJob.reassignmentHistory && selectedJob.reassignmentHistory.length > 0 && (
              <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <h4 className="font-bold text-white mb-3">Reassignment History</h4>
                <div className="space-y-2 text-sm">
                  {selectedJob.reassignmentHistory.map((entry, idx) => (
                    <div key={idx} className="p-2 bg-gray-800/50 rounded border border-gray-700">
                      <p className="text-gray-300">
                        From: <span className="text-white font-semibold">{entry.from}</span> →{' '}
                        <span className="text-white font-semibold">{entry.to}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{entry.reason}</p>
                      <p className="text-xs text-gray-600">
                        {formatDateTime(entry.reassignedAt)}
                      </p>
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
              <p className="text-gray-400 text-lg">Select a job to view and manage schedule</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
