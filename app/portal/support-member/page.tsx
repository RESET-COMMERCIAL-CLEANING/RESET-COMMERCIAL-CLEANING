'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, CheckCircle, Clock, AlertCircle, X, CheckCircle2, HelpCircle, Send } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Timestamp } from 'firebase/firestore';
import { logSupportActivity } from '@/lib/supportTeamManagement';
import { subscribeToTicketsByAssignee, updateTicket, type Attachment } from '@/lib/db/tickets';
import { uploadTicketAttachment } from '@/lib/storage';
import { logActivity } from '@/lib/db/activity';

interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  userType: 'client' | 'subcontractor';
  category: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'assigned' | 'open' | 'in-progress' | 'response-given' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  response?: string;
  resolvedAt?: string;
  attachments?: Attachment[];
  assignedTo?: string;
  assignedToName?: string;
}

export default function SupportMemberPortal() {
  const router = useRouter();
  const [member, setMember] = useState<any>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [filter, setFilter] = useState<'all' | 'open' | 'in-progress' | 'resolved'>('all');
  const [uploadedFiles, setUploadedFiles] = useState<Attachment[]>([]);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [showMoreInfoModal, setShowMoreInfoModal] = useState(false);
  const [moreInfoText, setMoreInfoText] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Initialize tickets from localStorage
  const initializeTickets = (): SupportTicket[] => {
    if (typeof window === 'undefined') return [];
    const savedTickets = localStorage.getItem('supportTickets');
    if (savedTickets) {
      return JSON.parse(savedTickets);
    }
    // Fallback mock data with tickets assigned to different team members
    return [
      {
        id: '1',
        ticketNumber: 'TKT-001',
        userId: 'client-1',
        userName: 'Sarah Johnson',
        userEmail: 'admin@techstartuphq.com',
        userType: 'client',
        category: 'billing',
        subject: 'Extra charge on invoice',
        message: 'I noticed an extra charge on my monthly invoice that I do not recognize. Please review my March invoice for the service on March 5th.',
        createdAt: 'Mar 13, 2025, 2:30 PM',
        status: 'assigned',
        priority: 'medium',
        assignedTo: 'support-1',
        assignedToName: 'John Support',
      },
      {
        id: '2',
        ticketNumber: 'TKT-002',
        userId: 'sub-1',
        userName: 'John Smith',
        userEmail: 'john@elitecrew.com',
        userType: 'subcontractor',
        category: 'job',
        subject: 'Job assignment issue',
        message: 'I did not receive the job assignment for the deep cleaning on March 15th. Please check the system and resend the details.',
        createdAt: 'Mar 12, 2025, 10:15 AM',
        status: 'in-progress',
        priority: 'high',
        response: 'We are investigating this issue. Checking the assignment system now.',
        assignedTo: 'support-1',
        assignedToName: 'John Support',
      },
      {
        id: '3',
        ticketNumber: 'TKT-003',
        userId: 'client-2',
        userName: 'Michael Chen',
        userEmail: 'facilities@medicalcenter.com',
        userType: 'client',
        category: 'quality',
        subject: 'Quality concern about cleaning',
        message: 'The cleaning on March 10th did not meet our standards. Some areas were not properly cleaned and the bathrooms need attention.',
        createdAt: 'Mar 11, 2025, 9:00 AM',
        status: 'resolved',
        priority: 'high',
        response: 'We apologize for the quality issues. We have assigned our senior team for your next service.',
        resolvedAt: 'Mar 12, 2025, 11:30 AM',
        assignedTo: 'support-2',
        assignedToName: 'Maria Support',
      },
      {
        id: '4',
        ticketNumber: 'TKT-004',
        userId: 'sub-2',
        userName: 'Maria Rodriguez',
        userEmail: 'maria@proservices.com',
        userType: 'subcontractor',
        category: 'technical',
        subject: 'Cannot access portal',
        message: 'I cannot log into the portal. Getting an error message saying "Invalid credentials" even after password reset.',
        createdAt: 'Mar 10, 2025, 3:45 PM',
        status: 'resolved',
        priority: 'urgent',
        response: 'Password has been reset and temporary credentials sent via email. Please check spam folder.',
        resolvedAt: 'Mar 10, 2025, 5:00 PM',
        assignedTo: 'support-2',
        assignedToName: 'Maria Support',
      },
      {
        id: '5',
        ticketNumber: 'TKT-005',
        userId: 'client-3',
        userName: 'James Wilson',
        userEmail: 'james@corporation.com',
        userType: 'client',
        category: 'billing',
        subject: 'Invoice clarification needed',
        message: 'Can you explain the breakdown of charges on our latest invoice? We need this for our accounting records.',
        createdAt: 'Mar 14, 2025, 11:20 AM',
        status: 'assigned',
        priority: 'medium',
        assignedTo: 'support-3',
        assignedToName: 'Alex Chen',
      },
      {
        id: '6',
        ticketNumber: 'TKT-006',
        userId: 'sub-3',
        userName: 'David Brown',
        userEmail: 'david@services.com',
        userType: 'subcontractor',
        category: 'job',
        subject: 'Schedule change request',
        message: 'Can I reschedule the job on March 20th to March 22nd? I have a conflict with another booking.',
        createdAt: 'Mar 13, 2025, 8:45 AM',
        status: 'in-progress',
        priority: 'low',
        response: 'Checking availability for March 22nd. Will confirm within 24 hours.',
        assignedTo: 'support-3',
        assignedToName: 'Alex Chen',
      },
      {
        id: '7',
        ticketNumber: 'TKT-007',
        userId: 'client-4',
        userName: 'Lisa Anderson',
        userEmail: 'lisa@office.com',
        userType: 'client',
        category: 'quality',
        subject: 'Excellent service feedback',
        message: 'Just wanted to compliment your team on the excellent cleaning job. The attention to detail was outstanding!',
        createdAt: 'Mar 13, 2025, 5:30 PM',
        status: 'assigned',
        priority: 'low',
        assignedTo: 'support-4',
        assignedToName: 'Sarah Williams',
      },
      {
        id: '8',
        ticketNumber: 'TKT-008',
        userId: 'sub-4',
        userName: 'Emma Taylor',
        userEmail: 'emma@cleaning.com',
        userType: 'subcontractor',
        category: 'technical',
        subject: 'Mobile app not syncing',
        message: 'The mobile app is not syncing my completed jobs with the system. Last sync was 2 days ago.',
        createdAt: 'Mar 12, 2025, 2:15 PM',
        status: 'in-progress',
        priority: 'high',
        response: 'This appears to be a sync issue. Try reinstalling the app and logging in again.',
        assignedTo: 'support-4',
        assignedToName: 'Sarah Williams',
      },
      {
        id: '9',
        ticketNumber: 'TKT-009',
        userId: 'client-5',
        userName: 'Robert Martinez',
        userEmail: 'robert@enterprise.com',
        userType: 'client',
        category: 'billing',
        subject: 'Payment method update',
        message: 'Can I update the payment method on my account? I have a new corporate card.',
        createdAt: 'Mar 14, 2025, 9:00 AM',
        status: 'assigned',
        priority: 'low',
        assignedTo: 'support-5',
        assignedToName: 'David Lee',
      },
      {
        id: '10',
        ticketNumber: 'TKT-010',
        userId: 'sub-5',
        userName: 'Nicole Garcia',
        userEmail: 'nicole@team.com',
        userType: 'subcontractor',
        category: 'job',
        subject: 'Training request',
        message: 'Can I get trained on the new cleaning products? I want to ensure I\'m using them correctly.',
        createdAt: 'Mar 11, 2025, 4:20 PM',
        status: 'resolved',
        priority: 'medium',
        response: 'Training session scheduled for March 20th at 2 PM. Check your email for details.',
        resolvedAt: 'Mar 12, 2025, 10:00 AM',
        assignedTo: 'support-5',
        assignedToName: 'David Lee',
      },
    ];
  };

  const [tickets, setTickets] = useState<SupportTicket[]>([]);

  // Filter tickets assigned to this member
  const assignedTickets = tickets.filter(t => t.assignedTo === member?.id);
  const filteredTickets = assignedTickets.filter(t =>
    filter === 'all' ? true : t.status === filter
  );

  const handleSubmitResponse = async () => {
    if (!responseText.trim() || !selectedTicket) return;

    try {
      await updateTicket(selectedTicket.id, {
        response: responseText,
        status: 'in-progress' as const,
        attachments: uploadedFiles.length > 0 ? uploadedFiles : undefined,
      });

      // Log activity
      if (member?.id) {
        await logActivity({
          memberId: member.id,
          memberName: member.name,
          action: 'Added response to ticket',
          ticketId: selectedTicket.id,
          details: `Response: ${responseText.substring(0, 100)}...`,
        });
      }

      setSuccessMessage('Response submitted successfully!');
      setShowSuccessModal(true);
      setResponseText('');
      setUploadedFiles([]);
      setShowResponseForm(false);
      setTimeout(() => setShowSuccessModal(false), 2000);
    } catch (error) {
      console.error('Failed to submit response:', error);
    }
  };

  const handleRequestMoreInfo = () => {
    if (!moreInfoText.trim() || !selectedTicket) return;

    // Log activity for requesting more info
    if (member?.id) {
      logSupportActivity(
        member.id,
        'Requested more information',
        selectedTicket.ticketNumber,
        moreInfoText
      );
    }

    setSuccessMessage('Request sent to superuser. They will contact you soon.');
    setShowSuccessModal(true);
    setMoreInfoText('');
    setShowMoreInfoModal(false);

    setTimeout(() => setShowSuccessModal(false), 3000);
  };

  const handleResolve = () => {
    if (!selectedTicket) return;

    const resolvedTicket = {
      ...selectedTicket,
      status: 'resolved' as const,
      resolvedAt: new Date().toLocaleString(),
    };

    setTickets(tickets.map(t =>
      t.id === selectedTicket.id ? resolvedTicket : t
    ));

    // Log activity
    if (member?.id) {
      logSupportActivity(
        member.id,
        'Marked ticket as resolved',
        selectedTicket.ticketNumber,
        `Issue resolved successfully`
      );
    }

    setSuccessMessage('Ticket marked as resolved!');
    setShowSuccessModal(true);
    setSelectedTicket(null);

    setTimeout(() => setShowSuccessModal(false), 2000);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !selectedTicket) return;

    Array.from(files).forEach(async (file) => {
      try {
        const downloadUrl = await uploadTicketAttachment(selectedTicket.id, file);
        const newAttachment: Attachment = {
          id: Date.now().toString(),
          name: file.name,
          type: file.type,
          size: file.size,
          url: downloadUrl,
          uploadedAt: Timestamp.now(),
        };
        setUploadedFiles(prev => [...prev, newAttachment]);
      } catch (error) {
        console.error('Failed to upload file:', error);
      }
    });

    setFileInputKey(prev => prev + 1);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(uploadedFiles.filter(f => f.id !== fileId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'open': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'in-progress': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'response-given': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'resolved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getNextStatus = (currentStatus: string): string | null => {
    const statusFlow: { [key: string]: string } = {
      'assigned': 'open',
      'open': 'in-progress',
      'in-progress': 'response-given',
      'response-given': 'resolved',
      'resolved': null,
    };
    return statusFlow[currentStatus] || null;
  };

  const handleStatusChange = async (ticket: SupportTicket) => {
    const nextStatus = getNextStatus(ticket.status);
    if (!nextStatus) return;

    try {
      await updateTicket(ticket.id, {
        status: nextStatus as any,
      });

      if (member?.id) {
        await logActivity({
          memberId: member.id,
          memberName: member.name,
          action: `Changed ticket status to ${nextStatus}`,
          ticketId: ticket.id,
          details: `Status updated from ${ticket.status} to ${nextStatus}`,
        });
      }

      setSuccessMessage(`Ticket status updated to ${nextStatus.replace('-', ' ')}!`);
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 2000);
    } catch (error) {
      console.error('Failed to change ticket status:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-600 text-white';
      case 'medium': return 'bg-yellow-600 text-white';
      case 'low': return 'bg-blue-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const stats = [
    { label: 'Assigned', value: assignedTickets.filter(t => t.status === 'assigned').length, icon: AlertCircle, color: 'text-blue-400' },
    { label: 'In Progress', value: assignedTickets.filter(t => t.status === 'in-progress').length, icon: Clock, color: 'text-yellow-400' },
    { label: 'Resolved', value: assignedTickets.filter(t => t.status === 'resolved').length, icon: CheckCircle, color: 'text-green-400' },
    { label: 'Total', value: assignedTickets.length, icon: MessageSquare, color: 'text-blue-400' },
  ];

  // Check authentication and subscribe to Firestore tickets
  useEffect(() => {
    const supportMemberJson = localStorage.getItem('supportMember');
    if (!supportMemberJson) {
      router.push('/portal/support-login');
    } else {
      try {
        const supportMember = JSON.parse(supportMemberJson);
        setMember(supportMember);
        setIsAuthorized(true);

        // Subscribe to tickets assigned to this member from Firestore
        const unsubscribe = subscribeToTicketsByAssignee(supportMember.id, (firebaseTickets: any[]) => {
          const mapped = firebaseTickets.map((t: any) => ({
            ...t,
            createdAt: t.createdAt?.toDate?.()?.toLocaleString() || t.createdAt || '',
            resolvedAt: t.resolvedAt?.toDate?.()?.toLocaleString() || t.resolvedAt,
          }));
          setTickets(mapped);
        });

        return () => {
          unsubscribe?.();
        };
      } catch {
        router.push('/portal/support-login');
      }
    }
  }, [router]);

  // Show loading state while checking auth
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-reset-green/30 border-t-reset-green rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Verifying access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Support Portal</h1>
            <p className="text-gray-400">Welcome, {member?.name}</p>
          </div>
        </motion.div>


        {/* Filter Tabs */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {(['all', 'open', 'in-progress', 'resolved'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-bold transition-all capitalize ${
                filter === status
                  ? 'bg-reset-green text-black'
                  : 'bg-reset-green/20 text-reset-green hover:bg-reset-green/30'
              }`}
            >
              {status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="p-6 rounded-xl glass border border-reset-green/20"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Tickets List and Detail View */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tickets List */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="p-6 rounded-xl glass border border-reset-green/20"
            >
              <h2 className="text-xl font-bold text-white mb-6">My Assigned Tickets</h2>
              <div className="space-y-3">
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => (
                    <motion.button
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      whileHover={{ x: 4 }}
                      className={`w-full p-4 rounded-lg border transition-all text-left ${
                        selectedTicket?.id === ticket.id
                          ? 'bg-reset-green/20 border-reset-green/60'
                          : 'bg-white/5 border-reset-green/20 hover:border-reset-green/40'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-bold text-white text-sm">{ticket.ticketNumber}</p>
                          <p className="text-xs text-gray-400 mt-1">{ticket.subject}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-bold ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <span className={`text-xs px-2 py-1 rounded-full border font-bold ${getStatusColor(ticket.status)}`}>
                          {ticket.status === 'in-progress' ? 'In Progress' : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                        </span>
                        <span className="text-xs text-gray-500">{ticket.userType}</span>
                      </div>
                    </motion.button>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-8">No tickets assigned to you</p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Ticket Details */}
          <div className="lg:col-span-2">
            {selectedTicket ? (
              <motion.div
                key={selectedTicket.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="p-6 rounded-xl glass border border-reset-green/20 h-full flex flex-col"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6 pb-6 border-b border-reset-green/20">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-bold text-white">{selectedTicket.ticketNumber}</h3>
                      <span className={`text-sm px-3 py-1 rounded-full border font-bold ${getStatusColor(selectedTicket.status)}`}>
                        {selectedTicket.status === 'in-progress' ? 'In Progress' : selectedTicket.status.charAt(0).toUpperCase() + selectedTicket.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-gray-400 mt-2">{selectedTicket.subject}</p>
                  </div>
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* User Info */}
                <div className="mb-6 pb-6 border-b border-reset-green/20">
                  <h4 className="font-bold text-white mb-3 text-sm">USER INFORMATION</h4>
                  <div className="space-y-2 text-sm text-gray-300">
                    <p><span className="text-gray-500">Name:</span> {selectedTicket.userName}</p>
                    <p><span className="text-gray-500">Email:</span> {selectedTicket.userEmail}</p>
                    <p><span className="text-gray-500">Type:</span> {selectedTicket.userType === 'client' ? 'Business Owner' : 'Service Provider'}</p>
                    <p><span className="text-gray-500">Category:</span> {selectedTicket.category}</p>
                    <p><span className="text-gray-500">Created:</span> {selectedTicket.createdAt}</p>
                    <p><span className={`text-sm px-2 py-1 rounded font-bold ${getPriorityColor(selectedTicket.priority)}`}>
                      {selectedTicket.priority.toUpperCase()} Priority
                    </span></p>
                  </div>
                </div>

                {/* Issue Description */}
                <div className="mb-6 pb-6 border-b border-reset-green/20">
                  <h4 className="font-bold text-white mb-3 text-sm">ISSUE DESCRIPTION</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">{selectedTicket.message}</p>
                </div>

                {/* Response */}
                {selectedTicket.response && (
                  <div className="mb-6 pb-6 border-b border-reset-green/20">
                    <h4 className="font-bold text-white mb-3 text-sm">RESPONSE</h4>
                    <div className="bg-reset-green/10 border border-reset-green/30 rounded p-4 space-y-4">
                      <p className="text-gray-300 text-sm leading-relaxed">{selectedTicket.response}</p>

                      {/* Attachments */}
                      {selectedTicket.attachments && selectedTicket.attachments.length > 0 && (
                        <div className="space-y-3 pt-3 border-t border-reset-green/20">
                          <p className="text-xs font-bold text-gray-400">ATTACHMENTS ({selectedTicket.attachments.length})</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {selectedTicket.attachments.map((attachment) => (
                              <div key={attachment.id} className="bg-black/30 border border-reset-green/20 rounded p-3 space-y-2">
                                <p className="text-xs text-gray-400 truncate">📎 {attachment.name}</p>
                                {attachment.type.startsWith('image/') && (
                                  <img
                                    src={attachment.url}
                                    alt={attachment.name}
                                    className="w-full max-h-48 object-cover rounded border border-reset-green/20"
                                  />
                                )}
                                <div className="flex justify-between items-center text-xs text-gray-500">
                                  <span>{(attachment.size / 1024).toFixed(1)} KB</span>
                                  <a
                                    href={attachment.url}
                                    download={attachment.name}
                                    className="text-reset-green hover:text-reset-green/80 transition-colors"
                                  >
                                    ⬇️ Download
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 mt-auto pt-6 border-t border-reset-green/20 flex-wrap">
                  {selectedTicket.status !== 'resolved' && (
                    <>
                      {/* Status Change Button */}
                      {getNextStatus(selectedTicket.status) && (
                        <button
                          onClick={() => handleStatusChange(selectedTicket)}
                          className="flex-1 py-2 bg-reset-green text-black rounded hover:bg-reset-green/80 transition-colors font-bold flex items-center justify-center gap-2 text-sm"
                        >
                          <CheckCircle2 size={16} />
                          Change to {getNextStatus(selectedTicket.status)?.replace('-', ' ')}
                        </button>
                      )}

                      {!showResponseForm ? (
                        <button
                          onClick={() => setShowResponseForm(true)}
                          className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-600/80 transition-colors font-bold flex items-center justify-center gap-2 text-sm"
                        >
                          <MessageSquare size={16} />
                          Add Response
                        </button>
                      ) : null}

                      <button
                        onClick={() => setShowMoreInfoModal(true)}
                        className="flex-1 py-2 bg-purple-600 text-white rounded hover:bg-purple-600/80 transition-colors font-bold flex items-center justify-center gap-2 text-sm"
                      >
                        <HelpCircle size={16} />
                        Request More Info
                      </button>
                    </>
                  )}

                  {selectedTicket.status === 'resolved' && selectedTicket.resolvedAt && (
                    <p className="text-reset-green font-bold text-sm">✓ Ticket Resolved on {selectedTicket.resolvedAt}</p>
                  )}
                </div>

                {/* Response Form */}
                {showResponseForm && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 pt-6 border-t border-reset-green/20 space-y-4"
                  >
                    <textarea
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      placeholder="Type your response here..."
                      rows={4}
                      className="w-full px-4 py-3 rounded bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none text-sm resize-none"
                    />

                    {/* File Upload */}
                    <div className="space-y-3">
                      <label className="block text-sm font-bold text-gray-300">Attach Files (Photos, Documents)</label>
                      <div className="flex items-center gap-2">
                        <input
                          key={fileInputKey}
                          type="file"
                          multiple
                          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                          onChange={handleFileUpload}
                          className="flex-1 px-4 py-2 rounded bg-white/5 border border-reset-green/30 text-gray-400 text-sm file:bg-reset-green file:text-black file:font-bold file:border-0 file:rounded file:cursor-pointer file:px-3 file:py-1"
                        />
                      </div>

                      {/* Uploaded Files List */}
                      {uploadedFiles.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs text-gray-400">Attached Files ({uploadedFiles.length})</p>
                          {uploadedFiles.map((file) => (
                            <div key={file.id} className="flex items-center justify-between p-2 bg-white/5 border border-reset-green/20 rounded text-sm">
                              <span className="text-gray-300 truncate flex-1">
                                📎 {file.name}
                                <span className="text-xs text-gray-500 ml-2">({(file.size / 1024).toFixed(1)} KB)</span>
                              </span>
                              <button
                                onClick={() => removeFile(file.id)}
                                className="ml-2 p-1 hover:bg-red-600/20 rounded text-red-400 transition-colors"
                                title="Remove"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setShowResponseForm(false);
                          setUploadedFiles([]);
                        }}
                        className="flex-1 py-2 border border-reset-green text-reset-green rounded hover:bg-reset-green/10 transition-colors font-bold text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmitResponse}
                        className="flex-1 py-2 bg-reset-green text-black rounded hover:bg-reset-green/80 transition-colors font-bold text-sm"
                      >
                        Send Response
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <div className="p-6 rounded-xl glass border border-reset-green/20 h-full flex items-center justify-center">
                <p className="text-gray-400 text-center">Select a ticket to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Request More Info Modal */}
      {showMoreInfoModal && selectedTicket && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black border border-reset-green/30 rounded-xl max-w-md w-full overflow-hidden"
          >
            <div className="p-6 border-b border-reset-green/20 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Request More Information</h3>
              <button
                onClick={() => setShowMoreInfoModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-gray-400 text-sm">
                Let the superuser know what additional information you need to resolve this ticket.
              </p>

              <textarea
                value={moreInfoText}
                onChange={(e) => setMoreInfoText(e.target.value)}
                placeholder="Describe what information you need..."
                rows={4}
                className="w-full px-4 py-3 rounded bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none text-sm resize-none"
              />

              <div className="flex gap-2">
                <button
                  onClick={() => setShowMoreInfoModal(false)}
                  className="flex-1 py-2 border border-reset-green text-reset-green rounded hover:bg-reset-green/10 transition-colors font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRequestMoreInfo}
                  className="flex-1 py-2 bg-reset-green text-black rounded hover:bg-reset-green/80 transition-colors font-bold text-sm flex items-center justify-center gap-2"
                >
                  <Send size={14} />
                  Send Request
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2"
        >
          <CheckCircle size={20} />
          <span className="font-bold">{successMessage}</span>
        </motion.div>
      )}
    </div>
  );
}
