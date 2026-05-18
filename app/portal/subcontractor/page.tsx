'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { MapPin, DollarSign, Camera, Clock, LogOut, User, TrendingUp, MessageSquare, CheckCircle, Calendar, X, Heart, AlertCircle, Send } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { logout, getUserProfile } from '@/lib/auth';
import { uploadBeforeAfterPhoto } from '@/lib/storage';
import { SupportModal } from '@/components/SupportModal';
import { createTicket, generateTicketNumber } from '@/lib/db/tickets';
import { subscribeToContractsBySubcontractor, Contract } from '@/lib/db/contracts';
import { subscribeToJobs, CleaningJob, updateJob } from '@/lib/db/jobs';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AvailableJob {
  id: number;
  location: string;
  distance: string;
  rate: string;
  date: string;
  type: string;
  duration: string;
  interested?: boolean;
}

interface ChecklistItem {
  id: string;
  task: string;
  completed: boolean;
  requiresPhotos: boolean;
  beforePhoto?: string;
  afterPhoto?: string;
  comments?: string;
}

interface DailyJobChecklist {
  jobId: string;
  date: string;
  tasks: ChecklistItem[];
}

interface TaskUploadState {
  selectedTaskId: string | null;
  beforeFile: File | null;
  afterFile: File | null;
  beforePreview: string | null;
  afterPreview: string | null;
  photoComments: string;
  uploading: boolean;
}

export default function SubcontractorPortal() {
  const router = useRouter();
  const [selectedContract, setSelectedContract] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState<{
    type: 'job' | 'contract';
    id: string | number;
    label: string;
    contractId?: number;
  } | null>(null);
  const [rescheduleForm, setRescheduleForm] = useState({
    reason: '',
    requestedDate: '',
    urgency: 'flexible' as 'same-day' | 'next-day' | 'this-week' | 'flexible',
  });
  const [rescheduleSubmitting, setRescheduleSubmitting] = useState(false);

  // Check authentication
  useEffect(() => {
    const userJson = localStorage.getItem('currentUser');
    const userProfile = localStorage.getItem('userProfile');
    if (!userJson && !userProfile) {
      router.push('/login');
      return;
    }

    try {
      const user = JSON.parse(userJson || '{}');
      const profile = JSON.parse(userProfile || '{}');

      if (user.isSuperuser || (user.role && user.role !== 'subcontractor')) {
        router.push('/login');
        return;
      }

      // Set current user for support modal
      setCurrentUser({
        id: profile.id || user.id,
        name: `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || user.name || 'User',
        email: profile.email || user.email || '',
      });
    } catch {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const [taskUploadStates, setTaskUploadStates] = useState<{ [key: string]: TaskUploadState }>({});
  const [currentAssignment, setCurrentAssignment] = useState<any>({
    id: 1,
    date: 'Today, 10:00 AM - 2:00 PM',
    client: 'Tech Startup HQ',
    location: 'Sydney Office - Level 2',
    type: 'Standard Clean',
    duration: '4 hours',
    rate: '$65',
  });
  const [acceptedJobs, setAcceptedJobs] = useState<string[]>([]);
  const [rescheduledOffers, setRescheduledOffers] = useState<number>(3);
  const [interestedJobs, setInterestedJobs] = useState<string[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: 'cl1',
      task: 'Sweep and vacuum all areas',
      completed: true,
      requiresPhotos: true,
      beforePhoto: '📸',
      afterPhoto: '📸',
      comments: 'Removed all debris and dust from carpeted areas. Deep vacuumed all rooms including under furniture.'
    },
    {
      id: 'cl2',
      task: 'Mop and clean floors',
      completed: true,
      requiresPhotos: true,
      beforePhoto: '📸',
      afterPhoto: '📸',
      comments: 'Applied eco-friendly floor cleaner. All hard floors are spotless and shining. No streaks detected.'
    },
    {
      id: 'cl3',
      task: 'Clean and disinfect surfaces',
      completed: true,
      requiresPhotos: true,
      beforePhoto: '📸',
      afterPhoto: '📸',
      comments: 'All surfaces cleaned and disinfected with appropriate cleaning agents.'
    },
    {
      id: 'cl4',
      task: 'Empty trash and replace liners',
      completed: false,
      requiresPhotos: true
    },
    {
      id: 'cl5',
      task: 'Clean windows and glass',
      completed: false,
      requiresPhotos: true
    },
  ]);

  const [contracts, setContracts] = useState<Contract[]>([]);
  const [allFirestoreJobs, setAllFirestoreJobs] = useState<CleaningJob[]>([]);

  // Subscribe to contracts
  useEffect(() => {
    if (!currentUser?.id) return;
    const unsub = subscribeToContractsBySubcontractor(currentUser.id, setContracts);
    return () => unsub();
  }, [currentUser?.id]);

  // Subscribe to jobs
  useEffect(() => {
    if (!currentUser?.id) return;
    const unsub = subscribeToJobs((jobs) => {
      setAllFirestoreJobs(jobs.filter(j =>
        j.subcontractorId === currentUser.id || j.status === 'available'
      ));
    });
    return () => unsub();
  }, [currentUser?.id]);

  const hasExtendedContracts = contracts.some(c => c.status === 'active');

  const upcomingJobs = allFirestoreJobs
    .filter(j => j.subcontractorId === currentUser?.id &&
      (j.status === 'assigned' || j.status === 'in-progress'))
    .map(j => ({
      id: j.id,
      date: j.scheduledDate.toDate().toLocaleDateString('en-AU', { weekday: 'long', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      client: j.clientName,
      location: j.location,
      type: j.type,
      duration: `${j.duration} hours`,
      rate: `$${j.rate}`,
    }));

  const recentJobs = allFirestoreJobs
    .filter(j => j.subcontractorId === currentUser?.id && j.status === 'completed')
    .slice(0, 10)
    .map(j => ({
      date: j.scheduledDate.toDate().toLocaleDateString('en-AU', { year: 'numeric', month: 'short', day: 'numeric' }),
      client: j.clientName,
      duration: `${j.duration} hrs`,
      earnings: `$${j.rate * j.duration}`,
    }));

  const availableJobs = allFirestoreJobs
    .filter(j => j.status === 'available')
    .slice(0, hasExtendedContracts ? 2 : 3)
    .map(j => ({
      id: j.id,
      location: j.location,
      distance: '', // Not available in CleaningJob
      rate: `$${j.rate}/hr`,
      date: j.scheduledDate.toDate().toLocaleDateString('en-AU', { weekday: 'long', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      type: j.type,
      duration: `${j.duration} hours`,
    }));

  const stats = [
    { icon: TrendingUp, label: 'This Month', value: `$${upcomingJobs.reduce((sum, j) => sum + parseInt(j.rate), 0)}` },
    { icon: Clock, label: 'Hours Worked', value: `${upcomingJobs.reduce((sum, j) => sum + parseInt(j.duration), 0)} hrs` },
    { icon: CheckCircle, label: 'Jobs Completed', value: (recentJobs.length + acceptedJobs.length).toString() },
    { icon: Calendar, label: 'Offers Rescheduled', value: rescheduledOffers.toString() },
  ];

  const addNotification = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  const handleAcceptJob = (job: any) => {
    setCurrentAssignment(job);
    setAcceptedJobs(prev => [...prev, job.id]);
    addNotification(`Job accepted! ${job.type} scheduled for ${job.date}. Go to Current Assignment section.`, 'success');
  };

  const handleExpressInterest = (job: any) => {
    setInterestedJobs(prev => [...prev, job.id]);
    addNotification(`Interest expressed for ${job.location}! 📧 Email sent to RESET team. You'll hear from us within 2 hours.`, 'success');
  };

  const handleToggleTask = (taskId: string) => {
    setChecklist(prev => prev.map(item =>
      item.id === taskId ? { ...item, completed: !item.completed } : item
    ));
  };

  const handleAddPhotoAndComment = (taskId: string, beforePhoto: string, afterPhoto: string, comments: string) => {
    setChecklist(prev => prev.map(item =>
      item.id === taskId ? { ...item, beforePhoto, afterPhoto, comments, completed: true } : item
    ));
    addNotification('Photos and comments added successfully!', 'success');
  };

  const allTasksCompleted = checklist.every(task =>
    task.completed && task.beforePhoto && task.afterPhoto && task.comments
  );

  const handleMarkJobComplete = async () => {
    if (!allTasksCompleted) {
      addNotification('All tasks must be completed, including photos and comments, before marking the job complete.', 'error');
      return;
    }
    if (currentAssignment) {
      try {
        await updateJob(currentAssignment.id, { status: 'completed' });
        setCurrentAssignment(null);
        setChecklist(checklist.map(item => ({ ...item, completed: false, beforePhoto: undefined, afterPhoto: undefined, comments: undefined })));
        addNotification('Excellent work! Job marked complete. Payment will be processed within 48 hours.', 'success');
      } catch (error) {
        addNotification('Failed to mark job complete. Please try again.', 'error');
        console.error(error);
      }
    }
  };

  const handleCompleteCurrentJob = async () => {
    if (currentAssignment) {
      try {
        await updateJob(currentAssignment.id, { status: 'completed' });
        setCurrentAssignment(null);
        addNotification('Excellent work! Job marked complete. Payment will be processed within 48 hours.', 'success');
      } catch (error) {
        addNotification('Failed to mark job complete. Please try again.', 'error');
        console.error(error);
      }
    }
  };

  const handleRescheduleCurrentJob = () => {
    if (currentAssignment) {
      setRescheduleTarget({
        type: 'job',
        id: currentAssignment.id,
        label: `${currentAssignment.type} - ${currentAssignment.client}`,
      });
      setShowRescheduleModal(true);
    }
  };

  const handleViewContract = (contractId: string) => {
    setSelectedContract(selectedContract === contractId ? null : contractId);
  };

  const getTaskUploadState = (taskId: string): TaskUploadState => {
    return taskUploadStates[taskId] || {
      selectedTaskId: null,
      beforeFile: null,
      afterFile: null,
      beforePreview: null,
      afterPreview: null,
      photoComments: '',
      uploading: false,
    };
  };

  const updateTaskUploadState = (taskId: string, updates: Partial<TaskUploadState>) => {
    setTaskUploadStates(prev => ({
      ...prev,
      [taskId]: { ...getTaskUploadState(taskId), ...updates },
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, taskId: string, type: 'before' | 'after') => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      if (type === 'before') {
        updateTaskUploadState(taskId, { beforeFile: file, beforePreview: preview });
      } else {
        updateTaskUploadState(taskId, { afterFile: file, afterPreview: preview });
      }
    }
  };

  const handleSubmitPhotos = async (taskId: string) => {
    const state = getTaskUploadState(taskId);

    if (!state.beforeFile || !state.afterFile || !state.photoComments.trim()) {
      addNotification('Please upload both photos and add comments', 'error');
      return;
    }

    updateTaskUploadState(taskId, { uploading: true });

    try {
      const jobId = `job-${Date.now()}`;

      const beforeUrl = await uploadBeforeAfterPhoto(jobId, taskId, 'before', state.beforeFile);
      const afterUrl = await uploadBeforeAfterPhoto(jobId, taskId, 'after', state.afterFile);

      handleAddPhotoAndComment(taskId, beforeUrl, afterUrl, state.photoComments);

      updateTaskUploadState(taskId, {
        selectedTaskId: null,
        beforeFile: null,
        afterFile: null,
        beforePreview: null,
        afterPreview: null,
        photoComments: '',
        uploading: false,
      });

      addNotification('Photos uploaded successfully!', 'success');
    } catch (error) {
      addNotification('Failed to upload photos. Please try again.', 'error');
      console.error(error);
      updateTaskUploadState(taskId, { uploading: false });
    }
  };

  const handleConnectGoogleCalendar = () => {
    addNotification('Redirecting to Google Calendar authorization... Please complete the login to sync your schedule.', 'info');
    // In production, this would redirect to OAuth flow
  };

  // Weekly schedule for display
  const weeklySchedule = [
    { day: 'Mon', hours: 4, jobs: ['Tech Startup HQ - 4 hrs'] },
    { day: 'Tue', hours: 5, jobs: ['Finance Corp Ltd - 2 hrs', 'Tech Startup HQ - 3 hrs'] },
    { day: 'Wed', hours: 4, jobs: ['Tech Startup HQ - 4 hrs'] },
    { day: 'Thu', hours: 6, jobs: ['Finance Corp Ltd - 6 hrs'] },
    { day: 'Fri', hours: 4, jobs: ['Tech Startup HQ - 4 hrs'] },
  ];

  const urgencyToPriority = (urgency: string) => {
    switch (urgency) {
      case 'same-day':
        return 'urgent';
      case 'next-day':
        return 'high';
      case 'this-week':
        return 'medium';
      default:
        return 'low';
    }
  };

  const handleRescheduleSubmit = async () => {
    if (!rescheduleTarget || !rescheduleForm.reason.trim() || !rescheduleForm.requestedDate) {
      addNotification('Please fill in all fields', 'error');
      return;
    }

    setRescheduleSubmitting(true);
    try {
      const ticketNumber = await generateTicketNumber();
      const ticketData = {
        ticketNumber,
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        userType: 'subcontractor' as const,
        category: 'reschedule' as const,
        subject: `Reschedule Request: ${rescheduleTarget.label}`,
        message: rescheduleForm.reason,
        priority: urgencyToPriority(rescheduleForm.urgency) as 'low' | 'medium' | 'high' | 'urgent',
        status: 'unassigned' as const,
        source: 'reschedule-request' as const,
        ...(rescheduleTarget.type === 'job' && { jobId: String(rescheduleTarget.id) }),
        ...(rescheduleTarget.type === 'contract' && { contractId: String(rescheduleTarget.id) }),
        requestedDate: rescheduleForm.requestedDate,
        rescheduleReason: rescheduleForm.reason,
        rescheduleUrgency: rescheduleForm.urgency,
      };
      await createTicket(ticketData);
      addNotification('Reschedule request submitted! The RESET team will contact you shortly.', 'success');
      setShowRescheduleModal(false);
      setRescheduleForm({ reason: '', requestedDate: '', urgency: 'flexible' });
      setRescheduleTarget(null);
    } catch (error) {
      addNotification('Failed to submit request. Please try again.', 'error');
      console.error(error);
    } finally {
      setRescheduleSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      {/* Notifications */}
      <AnimatePresence>
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-24 right-6 z-50 rounded-lg px-6 py-4 flex items-center gap-3 shadow-lg backdrop-blur ${
              notif.type === 'success' ? 'bg-reset-green/90 text-black' :
              notif.type === 'error' ? 'bg-red-500/90 text-white' :
              'bg-blue-500/90 text-white'
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">{notif.message}</span>
            <button
              onClick={() => setNotifications(prev => prev.filter(n => n.id !== notif.id))}
              className="ml-2 opacity-70 hover:opacity-100"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-2">Welcome, Service Provider</h1>
          <p className="text-gray-400">Manage your jobs and extended contracts - Member since February 2025</p>
        </motion.div>

        {/* Navigation Shortcuts */}
        <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3">
          <button onClick={() => document.getElementById('schedule-section')?.scrollIntoView({ behavior: 'smooth' })} className="px-2 sm:px-4 py-2 text-xs sm:text-sm bg-reset-green/20 text-reset-green rounded-lg hover:bg-reset-green/30 transition-colors font-semibold text-center">
            <span className="sm:hidden">Week</span>
            <span className="hidden sm:inline">Schedule</span>
          </button>
          <button onClick={() => document.getElementById('current-section')?.scrollIntoView({ behavior: 'smooth' })} className="px-2 sm:px-4 py-2 text-xs sm:text-sm bg-reset-green/20 text-reset-green rounded-lg hover:bg-reset-green/30 transition-colors font-semibold text-center">
            <span className="sm:hidden">Active</span>
            <span className="hidden sm:inline">Current Job</span>
          </button>
          <button onClick={() => document.getElementById('jobs-section')?.scrollIntoView({ behavior: 'smooth' })} className="px-2 sm:px-4 py-2 text-xs sm:text-sm bg-reset-green/20 text-reset-green rounded-lg hover:bg-reset-green/30 transition-colors font-semibold text-center">
            <span className="sm:hidden">Open</span>
            <span className="hidden sm:inline">Available</span>
          </button>
          <button onClick={() => document.getElementById('history-section')?.scrollIntoView({ behavior: 'smooth' })} className="px-2 sm:px-4 py-2 text-xs sm:text-sm bg-reset-green/20 text-reset-green rounded-lg hover:bg-reset-green/30 transition-colors font-semibold text-center">
            <span className="sm:hidden">Past</span>
            <span className="hidden sm:inline">History</span>
          </button>
        </div>

        {/* Stats - KPIs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        >
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-4 lg:p-6 rounded-xl glass"
              >
                <div className="flex flex-col lg:flex-row items-center lg:items-center gap-2 lg:gap-4">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-reset-green/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-reset-green" />
                  </div>
                  <div className="text-center lg:text-left">
                    <p className="text-xs lg:text-sm text-gray-400 mb-1">{stat.label}</p>
                    <p className="text-lg lg:text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Extended Contracts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 p-8 rounded-xl glass border-2 border-reset-green/50"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Your Extended Contracts</h2>
            <button
              onClick={() => setShowSupportModal(true)}
              className="px-4 py-2 bg-reset-green/20 text-reset-green rounded-lg hover:bg-reset-green/30 text-sm font-bold transition-colors flex items-center gap-2"
            >
              <MessageSquare size={16} />
              Support
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contracts.length === 0 ? (
              <p className="text-gray-400 col-span-2">No contracts found. You'll see them here once the super user creates them.</p>
            ) : (
              contracts.map((contract) => (
                <div key={contract.id}>
                  <button
                    onClick={() => handleViewContract(contract.id)}
                    className="w-full p-6 rounded-lg border-2 border-reset-green/30 hover:border-reset-green/70 transition-all text-left group bg-reset-green/5 hover:bg-reset-green/10"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-white group-hover:text-reset-green transition-colors mb-1">{contract.clientName}</h3>
                        <p className="text-sm text-reset-green font-bold">{contract.type}</p>
                      </div>
                      <span className={`px-3 py-1 rounded text-xs font-bold ${
                        contract.status === 'active' ? 'bg-reset-green/30 text-reset-green' : 'bg-gray-600/30 text-gray-300'
                      }`}>
                        {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-gray-400 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-reset-green" />
                        {contract.startDate} to {contract.endDate}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-reset-green" />
                        {contract.frequency}
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign size={14} className="text-reset-green" />
                        {contract.hourlyRate}
                      </div>
                    </div>

                    {selectedContract === contract.id && (
                      <div className="pt-4 border-t border-reset-green/20 text-xs text-gray-400">
                        <p>Jobs completed: <span className="text-reset-green font-bold">{contract.jobsCompleted}</span></p>
                      </div>
                    )}
                  </button>

                  {/* Contract-specific reschedule button */}
                  <button
                    onClick={() => {
                      setRescheduleTarget({
                        type: 'contract',
                        id: contract.id,
                        label: contract.clientName,
                      });
                      setShowRescheduleModal(true);
                    }}
                    className="w-full mt-3 py-2 bg-reset-green/10 text-reset-green rounded-lg hover:bg-reset-green/20 text-xs font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <Calendar size={14} />
                    Request Reschedule
                  </button>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Schedule */}
            <motion.div
              id="schedule-section"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="p-6 lg:p-8 rounded-xl glass border-2 border-reset-green/30"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-3">
                <h2 className="text-xl lg:text-2xl font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-reset-green" />
                  Upcoming Schedule
                </h2>
                <button
                  onClick={handleConnectGoogleCalendar}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-bold transition-colors flex items-center gap-2"
                >
                  📅 Google Calendar
                </button>
              </div>

              {/* Weekly Schedule Grid - Responsive */}
              <div className="mb-8">
                <p className="text-sm font-bold text-gray-400 mb-4">This Week's Schedule</p>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
                  {weeklySchedule.map((schedule, i) => (
                    <div key={i} className="p-3 rounded-lg border border-reset-green/20 hover:border-reset-green/50 transition-colors text-center">
                      <p className="font-bold text-white text-sm mb-1">{schedule.day}</p>
                      <p className="text-base lg:text-lg text-reset-green font-bold mb-2">{schedule.hours}h</p>
                      <div className="text-xs text-gray-400 space-y-0.5 hidden lg:block">
                        {schedule.jobs.map((job, j) => (
                          <div key={j} className="truncate">{job}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Jobs - Simplified */}
              <div>
                <p className="text-sm font-bold text-gray-400 mb-4">Your Assigned Jobs This Week</p>
                <div className="space-y-2">
                  {upcomingJobs.length > 0 ? (
                    upcomingJobs.map((job) => (
                      <div key={job.id} className="p-3 border border-reset-green/20 rounded-lg text-sm">
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between">
                            <div className="flex-1">
                              <p className="font-bold text-white text-sm">{job.date}</p>
                              <p className="text-xs text-gray-400">{job.location} • {job.type}</p>
                            </div>
                            <div className="text-sm sm:text-right">
                              <p className="text-xs text-reset-green font-bold">{job.duration}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setRescheduleTarget({
                                type: 'job',
                                id: job.id,
                                label: `${job.type} - ${job.client}`,
                              });
                              setShowRescheduleModal(true);
                            }}
                            className="px-2 py-1 text-xs bg-reset-green/10 text-reset-green rounded hover:bg-reset-green/20 transition-colors self-start font-semibold"
                          >
                            Request Reschedule
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-gray-400 text-sm">
                      <p>No upcoming jobs scheduled</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Current Assignment - With Checklist */}
            {currentAssignment ? (
              <motion.div
                id="current-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="p-6 lg:p-8 rounded-xl glass border-2 border-reset-green/50"
              >
                <div className="mb-6">
                  <h2 className="text-xl lg:text-2xl font-bold text-white mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-reset-green" />
                    Current Assignment
                  </h2>
                  <p className="text-sm text-gray-400">{currentAssignment.client} • {currentAssignment.location}</p>
                </div>

                {/* Job Details - Simplified for Mobile */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-8 p-4 bg-reset-green/10 rounded-lg border border-reset-green/20">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Service</p>
                    <p className="font-bold text-white text-sm">{currentAssignment.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Duration</p>
                    <p className="font-bold text-white text-sm">{currentAssignment.duration}</p>
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <p className="text-xs text-gray-400 mb-1">Rate</p>
                    <p className="font-bold text-reset-green text-sm">{currentAssignment.rate}/hr</p>
                  </div>
                </div>

                {/* Daily Checklist */}
                <div className="mb-8">
                  <h3 className="text-base lg:text-lg font-bold text-white mb-4">Daily Task Checklist</h3>
                  <div className="space-y-2">
                    {checklist.map((task) => {
                      const uploadState = getTaskUploadState(task.id);
                      return (
                        <div key={task.id} className="border border-reset-green/20 rounded-lg overflow-hidden">
                          <div className="p-3 lg:p-4 bg-black/30">
                            <div className="flex items-start gap-3 mb-3">
                              <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => {
                                  if (task.requiresPhotos && (!task.beforePhoto || !task.afterPhoto || !task.comments)) {
                                    addNotification('Upload before & after photos with comments before completing this task', 'error');
                                    return;
                                  }
                                  handleToggleTask(task.id);
                                }}
                                disabled={task.requiresPhotos && (!task.beforePhoto || !task.afterPhoto || !task.comments)}
                                className={`w-5 h-5 accent-reset-green mt-1 ${
                                  task.requiresPhotos && (!task.beforePhoto || !task.afterPhoto || !task.comments)
                                    ? 'cursor-not-allowed opacity-50'
                                    : 'cursor-pointer'
                                }`}
                              />
                              <div className="flex-1">
                                <p className={`font-semibold ${task.completed ? 'text-gray-500 line-through' : 'text-white'}`}>
                                  {task.task}
                                </p>
                                {task.requiresPhotos && (
                                  <>
                                    {task.beforePhoto && task.afterPhoto && task.comments ? (
                                      <p className="text-xs text-reset-green mt-1">✓ Photos uploaded and verified</p>
                                    ) : (
                                      <p className="text-xs text-orange-400 mt-1">⚠️ Photos & comments required before completion</p>
                                    )}
                                  </>
                                )}
                              </div>
                              {task.completed && (
                                <span className="text-reset-green font-bold">✓</span>
                              )}
                            </div>

                            {/* Photos & Comments Section */}
                            {task.requiresPhotos && (
                              <div className="mt-4 pt-4 border-t border-reset-green/20">
                                {task.beforePhoto && task.afterPhoto && task.comments ? (
                                  <div className="bg-reset-green/10 p-3 rounded space-y-2">
                                    <p className="text-xs text-gray-400">✓ Documentation Complete</p>
                                    <p className="text-xs text-gray-300"><strong>Comments:</strong> {task.comments}</p>
                                    <div className="flex gap-2 text-xs text-gray-500">
                                      <span>📸 Before photo</span>
                                      <span>📸 After photo</span>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    {uploadState.selectedTaskId === task.id ? (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-3"
                                      >
                                        <div className="flex items-center justify-between mb-3">
                                          <h4 className="text-sm font-bold text-white">Upload Before & After Photos</h4>
                                          <button
                                            onClick={() => updateTaskUploadState(task.id, {
                                              selectedTaskId: null,
                                              beforeFile: null,
                                              afterFile: null,
                                              beforePreview: null,
                                              afterPreview: null,
                                              photoComments: '',
                                            })}
                                            className="text-xs text-gray-400 hover:text-white"
                                          >
                                            ✕
                                          </button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                          {/* Before Photo */}
                                          <div>
                                            <label className="block text-xs font-bold text-gray-300 mb-2">Before Photo</label>
                                            <div className="relative">
                                              <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileChange(e, task.id, 'before')}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                disabled={uploadState.uploading}
                                              />
                                              <div className="border-2 border-dashed border-gray-600 rounded-lg p-3 text-center hover:border-reset-green transition-colors cursor-pointer">
                                                {uploadState.beforePreview ? (
                                                  <img src={uploadState.beforePreview} alt="Before" className="w-full h-20 object-cover rounded" />
                                                ) : (
                                                  <div>
                                                    <Camera className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                                                    <p className="text-xs text-gray-400">Click to upload</p>
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </div>

                                          {/* After Photo */}
                                          <div>
                                            <label className="block text-xs font-bold text-gray-300 mb-2">After Photo</label>
                                            <div className="relative">
                                              <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileChange(e, task.id, 'after')}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                disabled={uploadState.uploading}
                                              />
                                              <div className="border-2 border-dashed border-gray-600 rounded-lg p-3 text-center hover:border-reset-green transition-colors cursor-pointer">
                                                {uploadState.afterPreview ? (
                                                  <img src={uploadState.afterPreview} alt="After" className="w-full h-20 object-cover rounded" />
                                                ) : (
                                                  <div>
                                                    <Camera className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                                                    <p className="text-xs text-gray-400">Click to upload</p>
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Comments */}
                                        <div>
                                          <label className="block text-xs font-bold text-gray-300 mb-2">Comments</label>
                                          <textarea
                                            value={uploadState.photoComments}
                                            onChange={(e) => updateTaskUploadState(task.id, { photoComments: e.target.value })}
                                            placeholder="Describe what was done..."
                                            disabled={uploadState.uploading}
                                            className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-reset-green focus:outline-none text-xs disabled:opacity-50"
                                            rows={2}
                                          />
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                          onClick={() => handleSubmitPhotos(task.id)}
                                          disabled={uploadState.uploading}
                                          className="w-full py-2 bg-reset-green text-black font-bold rounded-lg hover:bg-reset-green/80 disabled:opacity-50 transition-all text-sm"
                                        >
                                          {uploadState.uploading ? 'Uploading...' : 'Submit Photos'}
                                        </button>
                                      </motion.div>
                                    ) : (
                                      <button
                                        onClick={() => updateTaskUploadState(task.id, { selectedTaskId: task.id })}
                                        className="w-full py-2 bg-reset-green/20 text-reset-green rounded text-xs font-bold hover:bg-reset-green/30 transition-colors flex items-center justify-center gap-2"
                                      >
                                        <Camera size={14} />
                                        Upload Before & After
                                      </button>
                                    )}
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Completion Status */}
                  <div className="mt-6 p-4 rounded-lg border border-reset-green/20 bg-reset-green/5">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-bold text-white">Task Progress</p>
                      <p className="text-reset-green font-bold">{checklist.filter(t => t.completed).length}/{checklist.length} completed</p>
                    </div>
                    <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-reset-green transition-all duration-300"
                        style={{ width: `${(checklist.filter(t => t.completed).length / checklist.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={handleMarkJobComplete}
                    disabled={!allTasksCompleted}
                    className={`flex-1 py-3 font-bold rounded-lg transition-all ${
                      allTasksCompleted
                        ? 'bg-reset-green text-black hover:bg-reset-green/80'
                        : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    {allTasksCompleted ? 'Mark Complete' : 'Complete All Tasks First'}
                  </button>
                  <button
                    onClick={handleRescheduleCurrentJob}
                    className="flex-1 py-3 border-2 border-reset-green text-reset-green font-bold rounded-lg hover:bg-reset-green/10 transition-all"
                  >
                    Reschedule
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="p-8 rounded-xl glass border-2 border-reset-green/30"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Current Assignment</h2>
                <div className="text-center py-12">
                  <p className="text-gray-400 mb-4">No active assignment right now.</p>
                  <p className="text-sm text-gray-500">Your assigned jobs will appear here when ready.</p>
                </div>
              </motion.div>
            )}


            {/* Available Jobs Near You */}
            <motion.div
              id="jobs-section"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="p-6 lg:p-8 rounded-xl glass border border-reset-green/30"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-3">
                <h2 className="text-xl lg:text-2xl font-bold text-white">Available Jobs Near You</h2>
                {hasExtendedContracts && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-reset-green/20 text-reset-green rounded-full text-xs font-bold">
                    <AlertCircle size={14} />
                    Extended Contract
                  </div>
                )}
              </div>

              {hasExtendedContracts && (
                <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-xs text-blue-300">
                    💡 You're viewing limited jobs as an extended contract holder. Focus on your current contracts for more opportunities!
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {availableJobs.map((job) => (
                  <div key={job.id} className="p-4 border border-reset-green/20 rounded-lg hover:glass-dark transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0">
                      <div className="flex-1">
                        <h3 className="font-bold text-white">{job.location}</h3>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400 mt-2">
                          {job.distance && (
                            <span className="flex items-center gap-1">
                              <MapPin size={14} className="text-reset-green" />
                              {job.distance}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <DollarSign size={14} className="text-reset-green" />
                            {job.rate}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} className="text-reset-green" />
                            {job.duration}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">{job.type} • {job.date}</p>
                      </div>
                      <button
                        onClick={() => handleExpressInterest(job)}
                        disabled={interestedJobs.includes(job.id)}
                        className={`w-full sm:w-auto px-3 sm:px-4 py-2 rounded font-bold text-xs sm:text-sm transition-colors flex items-center justify-center sm:justify-start gap-2 ${
                          interestedJobs.includes(job.id)
                            ? 'bg-reset-green/30 text-reset-green cursor-default'
                            : 'bg-reset-green/20 text-reset-green hover:bg-reset-green/40'
                        }`}
                      >
                        <Heart size={16} />
                        <span className="sm:hidden">{interestedJobs.includes(job.id) ? 'Interested ✓' : 'Interest'}</span>
                        <span className="hidden sm:inline">{interestedJobs.includes(job.id) ? 'Interested ✓' : 'Express Interest'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-xs text-yellow-300">
                  ℹ️ When you express interest, our RESET team will review and contact you within 2 hours with a job offer. No direct acceptance needed!
                </p>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Previous Jobs Completed */}
            <motion.div
              id="history-section"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="p-6 rounded-xl glass"
            >
              <h3 className="text-base lg:text-lg font-bold text-white mb-4">Previous Jobs Completed</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {recentJobs.length > 0 ? (
                  recentJobs.map((job, i) => (
                    <div key={i} className="p-3 border border-reset-green/20 rounded text-sm hover:border-reset-green/50 transition-colors cursor-pointer">
                      <div className="flex justify-between mb-1">
                        <p className="font-bold text-white text-xs">{job.client}</p>
                        <p className="text-reset-green font-bold text-xs">{job.earnings}</p>
                      </div>
                      <p className="text-xs text-gray-400">{job.date}</p>
                      <p className="text-xs text-gray-500 mt-1">{job.duration} completed</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 text-center py-4">No completed jobs yet</p>
                )}
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* Support Modal */}
      {currentUser && (
        <SupportModal
          isOpen={showSupportModal}
          onClose={() => setShowSupportModal(false)}
          userName={currentUser.name}
          userEmail={currentUser.email}
          userId={currentUser.id}
          userType="subcontractor"
          source="subcontractor-portal"
        />
      )}

      {/* Reschedule Modal */}
      <AnimatePresence>
        {showRescheduleModal && rescheduleTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowRescheduleModal(false);
              setRescheduleForm({ reason: '', requestedDate: '', urgency: 'flexible' });
              setRescheduleTarget(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 rounded-lg border border-reset-green/30 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Request Reschedule</h2>
                <button
                  onClick={() => {
                    setShowRescheduleModal(false);
                    setRescheduleForm({ reason: '', requestedDate: '', urgency: 'flexible' });
                    setRescheduleTarget(null);
                  }}
                  className="text-gray-400 hover:text-white transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Reference (Read-only) */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Job/Contract Reference</label>
                  <div className="px-4 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm">
                    {rescheduleTarget.label}
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Reason for Rescheduling *</label>
                  <textarea
                    value={rescheduleForm.reason}
                    onChange={(e) => setRescheduleForm({ ...rescheduleForm, reason: e.target.value })}
                    placeholder="Please explain why you need to reschedule this job..."
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 text-white rounded focus:outline-none focus:border-reset-green h-24"
                  />
                </div>

                {/* Preferred New Date/Time */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Preferred New Date & Time *</label>
                  <input
                    type="datetime-local"
                    value={rescheduleForm.requestedDate}
                    onChange={(e) => setRescheduleForm({ ...rescheduleForm, requestedDate: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 text-white rounded focus:outline-none focus:border-reset-green"
                  />
                </div>

                {/* Urgency */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">How Urgent is This Reschedule?</label>
                  <select
                    value={rescheduleForm.urgency}
                    onChange={(e) => setRescheduleForm({ ...rescheduleForm, urgency: e.target.value as any })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 text-white rounded focus:outline-none focus:border-reset-green"
                  >
                    <option value="flexible">Flexible (Not urgent)</option>
                    <option value="this-week">This Week</option>
                    <option value="next-day">Next Day</option>
                    <option value="same-day">Same Day (Urgent)</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-6">
                  <button
                    onClick={handleRescheduleSubmit}
                    disabled={rescheduleSubmitting}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-reset-green text-black rounded-lg font-bold hover:bg-reset-green/90 transition disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    {rescheduleSubmitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                  <button
                    onClick={() => {
                      setShowRescheduleModal(false);
                      setRescheduleForm({ reason: '', requestedDate: '', urgency: 'flexible' });
                      setRescheduleTarget(null);
                    }}
                    className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-lg font-bold hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
