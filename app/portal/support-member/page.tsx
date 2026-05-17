'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, CheckCircle, Clock, AlertCircle, X, CheckCircle2, HelpCircle, Send } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Timestamp } from 'firebase/firestore';
import { logSupportActivity } from '@/lib/supportTeamManagement';
import { subscribeToTicketsByAssignee, updateTicket, addTicketComment, type Attachment } from '@/lib/db/tickets';
import { uploadTicketAttachment } from '@/lib/storage';
import { logActivity } from '@/lib/db/activity';
import { formatTicketResponseEmail, sendEmail } from '@/lib/email';
import { logTicketResponse, logEmailSent } from '@/lib/db/activity-log';

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
  status: 'unassigned' | 'assigned' | 'test-phase' | 'more-info-needed' | 'response-given' | 'resolved';
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
  const [filter, setFilter] = useState<'all' | 'test-phase' | 'more-info-needed' | 'resolved'>('all');
  const [uploadedFiles, setUploadedFiles] = useState<Attachment[]>([]);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [showMoreInfoModal, setShowMoreInfoModal] = useState(false);
  const [moreInfoText, setMoreInfoText] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [tickets, setTickets] = useState<SupportTicket[]>([]);

  // Filter tickets assigned to this member
  const assignedTickets = tickets.filter(t => t.assignedTo === member?.id);
  const filteredTickets = assignedTickets.filter(t =>
    filter === 'all' ? true : t.status === filter
  );

  const handleSubmitResponse = async () => {
    if (!responseText.trim() || !selectedTicket) return;

    try {
      console.log('📝 Submitting response for ticket:', selectedTicket.ticketNumber);

      await updateTicket(selectedTicket.id, {
        response: responseText,
        status: 'response-given' as const,
        attachments: uploadedFiles.length > 0 ? uploadedFiles : undefined,
      });

      // Log activity in the old system for backward compatibility
      if (member?.id) {
        await logActivity({
          memberId: member.id,
          memberName: member.name,
          action: 'Added response to ticket',
          ticketId: selectedTicket.id,
          details: `Response: ${responseText.substring(0, 100)}...`,
        });
      }

      // Log response in new activity system
      await logTicketResponse({
        ticketId: selectedTicket.id,
        ticketNumber: selectedTicket.ticketNumber,
        respondentId: member?.id || 'support',
        respondentName: member?.name || 'Support Team',
        responseLength: responseText.length,
        hasAttachments: uploadedFiles.length > 0,
      });

      // Send email to ticket raiser
      const emailTemplate = formatTicketResponseEmail({
        ticketNumber: selectedTicket.ticketNumber,
        subject: selectedTicket.subject,
        message: selectedTicket.message,
        userName: selectedTicket.userName,
        userEmail: selectedTicket.userEmail,
        userType: selectedTicket.userType,
        category: selectedTicket.category,
        priority: selectedTicket.priority,
        response: responseText,
        assignedToName: member?.name || 'Support Team',
      });

      const emailSent = await sendEmail(emailTemplate);

      // Log email activity
      await logEmailSent({
        ticketId: selectedTicket.id,
        ticketNumber: selectedTicket.ticketNumber,
        recipientEmail: selectedTicket.userEmail,
        emailType: 'ticket_response',
        success: emailSent,
      });

      console.log('✅ Response submitted and email sent to:', selectedTicket.userEmail);

      setSuccessMessage('Response submitted successfully!');
      setShowSuccessModal(true);
      setResponseText('');
      setUploadedFiles([]);
      setShowResponseForm(false);
      setTimeout(() => setShowSuccessModal(false), 2000);
    } catch (error) {
      console.error('❌ Failed to submit response:', error);
      console.error('Submit response failed - check browser console');
    }
  };

  const handleRequestMoreInfo = async () => {
    if (!moreInfoText.trim() || !selectedTicket) return;

    try {
      // Update ticket status to 'more-info-needed'
      await updateTicket(selectedTicket.id, {
        status: 'more-info-needed' as const,
      });

      // Add internal comment for superuser
      if (member?.id) {
        await addTicketComment(
          selectedTicket.id,
          member.id,
          member.name,
          'support-member',
          moreInfoText
        );
      }

      // Log activity for requesting more info
      if (member?.id) {
        logSupportActivity(
          member.id,
          'Requested more information',
          selectedTicket.ticketNumber,
          moreInfoText
        );
      }

      setSuccessMessage('Marked ticket as needing more information. Superuser will respond in comments.');
      setShowSuccessModal(true);
      setMoreInfoText('');
      setShowMoreInfoModal(false);

      setTimeout(() => setShowSuccessModal(false), 3000);
    } catch (error) {
      console.error('Failed to request more info:', error);
      console.error('Request more info failed - check browser console');
    }
  };

  const handleResolve = async () => {
    if (!selectedTicket) return;

    try {
      // Update ticket status to 'resolved' in Firestore
      await updateTicket(selectedTicket.id, {
        status: 'resolved' as const,
        resolvedAt: Timestamp.now(),
      });

      // Log activity
      if (member?.id) {
        await logActivity({
          memberId: member.id,
          memberName: member.name,
          action: 'Marked ticket as resolved',
          ticketId: selectedTicket.id,
          details: 'Issue resolved successfully',
        });
      }

      setSuccessMessage('Ticket marked as resolved!');
      setShowSuccessModal(true);
      setSelectedTicket(null);

      setTimeout(() => setShowSuccessModal(false), 2000);
    } catch (error) {
      console.error('Failed to resolve ticket:', error);
      console.error('Resolve ticket failed - check browser console');
    }
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
      case 'unassigned': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'assigned': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'test-phase': return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
      case 'more-info-needed': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'response-given': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'resolved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getNextStatus = (currentStatus: string): string | null => {
    // Support members can only move tickets to: test-phase, more-info-needed, or resolved
    // From assigned state, they can move to test-phase or more-info-needed
    // From test-phase or more-info-needed, they can move to resolved
    const statusFlow: { [key: string]: string[] } = {
      'assigned': ['test-phase', 'more-info-needed'],
      'test-phase': ['more-info-needed', 'resolved'],
      'more-info-needed': ['test-phase', 'resolved'],
      'resolved': [],
    };
    const nextStatuses = statusFlow[currentStatus];
    return nextStatuses && nextStatuses.length > 0 ? nextStatuses[0] : null;
  };

  const getAllowedNextStatuses = (currentStatus: string): string[] => {
    const statusFlow: { [key: string]: string[] } = {
      'assigned': ['test-phase', 'more-info-needed'],
      'test-phase': ['more-info-needed', 'resolved'],
      'more-info-needed': ['test-phase', 'resolved'],
      'resolved': [],
    };
    return statusFlow[currentStatus] || [];
  };

  const handleStatusChange = async (ticket: SupportTicket, newStatus: string) => {
    const allowedStatuses = getAllowedNextStatuses(ticket.status);
    if (!allowedStatuses.includes(newStatus)) return;

    try {
      await updateTicket(ticket.id, {
        status: newStatus as any,
        resolvedAt: newStatus === 'resolved' ? Timestamp.now() : undefined,
      });

      if (member?.id) {
        await logActivity({
          memberId: member.id,
          memberName: member.name,
          action: `Changed ticket status to ${newStatus}`,
          ticketId: ticket.id,
          details: `Status updated from ${ticket.status} to ${newStatus}`,
        });
      }

      setSuccessMessage(`Ticket status updated to ${newStatus.replace('-', ' ')}!`);
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
    { label: 'In Progress', value: assignedTickets.filter(t => ['assigned', 'test-phase', 'more-info-needed'].includes(t.status)).length, icon: Clock, color: 'text-yellow-400' },
    { label: 'Resolved', value: assignedTickets.filter(t => t.status === 'resolved').length, icon: CheckCircle, color: 'text-green-400' },
    { label: 'Test Phase', value: assignedTickets.filter(t => t.status === 'test-phase').length, icon: HelpCircle, color: 'text-indigo-400' },
    { label: 'Total', value: assignedTickets.length, icon: MessageSquare, color: 'text-reset-green' },
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
          {(['all', 'test-phase', 'more-info-needed', 'resolved'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-bold transition-all capitalize ${
                filter === status
                  ? 'bg-reset-green text-black'
                  : 'bg-reset-green/20 text-reset-green hover:bg-reset-green/30'
              }`}
            >
              {status.replace('-', ' ').charAt(0).toUpperCase() + status.replace('-', ' ').slice(1)}
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
                          {ticket.status.replace('-', ' ').charAt(0).toUpperCase() + ticket.status.replace('-', ' ').slice(1)}
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
                        {selectedTicket.status.replace('-', ' ').charAt(0).toUpperCase() + selectedTicket.status.replace('-', ' ').slice(1)}
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
                      {/* Status Change Dropdown */}
                      {getAllowedNextStatuses(selectedTicket.status).length > 0 && (
                        <select
                          value=""
                          onChange={(e) => {
                            if (e.target.value) {
                              handleStatusChange(selectedTicket, e.target.value);
                            }
                          }}
                          className="flex-1 py-2 bg-reset-green text-black rounded hover:bg-reset-green/80 transition-colors font-bold text-sm px-3"
                        >
                          <option value="">Change Status...</option>
                          {getAllowedNextStatuses(selectedTicket.status).map(status => (
                            <option key={status} value={status}>
                              {status.replace('-', ' ').charAt(0).toUpperCase() + status.replace('-', ' ').slice(1)}
                            </option>
                          ))}
                        </select>
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
                        Need Info
                      </button>
                    </>
                  )}

                  {selectedTicket.status === 'resolved' && selectedTicket.resolvedAt && (
                    <p className="text-reset-green font-bold text-sm">✓ Resolved on {selectedTicket.resolvedAt}</p>
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
