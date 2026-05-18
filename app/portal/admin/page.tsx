'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Bell, MessageSquare, CheckCircle, Clock, AlertCircle, X, Eye, CheckCircle2, RotateCcw, Users, User, Plus, Send, Search, Calendar, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Timestamp } from 'firebase/firestore';
import { getCurrentUser } from '@/lib/auth';
import { Toast, useToast } from '@/components/Toast';
import { subscribeToTickets, updateTicket, createTicket, unassignTicket, archiveTicket, deleteTicketById, addTicketComment, type Attachment } from '@/lib/db/tickets';
import { uploadTicketAttachment } from '@/lib/storage';
import { subscribeToAllSupportTeam } from '@/lib/db/supportTeam';
import { formatTicketResponseEmail, formatTicketAssignmentEmail, sendEmail } from '@/lib/email';
import { logTicketResponse, logTicketAssignment, logEmailSent, logTicketResolution } from '@/lib/db/activity-log';
import UserManagement from '@/components/UserManagement';
import SupportTeamManagement from '@/components/SupportTeamManagement';
import ContractManagement from '@/components/ContractManagement';
import Schedule from '@/components/Schedule';
import ProfitAnalysis from '@/components/ProfitAnalysis';

interface TicketComment {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: 'superuser' | 'support-member';
  message: string;
  createdAt: any;
}

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
  status: 'unassigned' | 'assigned' | 'open' | 'in-progress' | 'response-given' | 'test-phase' | 'more-info-needed' | 'resolved' | 'archived' | 'deleted';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  response?: string;
  resolvedAt?: string;
  attachments?: Attachment[];
  assignedTo?: string;
  assignedToName?: string;
  comments?: TicketComment[];
  source: 'quote' | 'contact-support' | 'business-owner-portal' | 'subcontractor-portal' | 'admin-created' | 'reschedule-request';
  sourceLocation?: string;
  jobId?: string;
  contractId?: string;
  requestedDate?: string;
  rescheduleReason?: string;
  rescheduleUrgency?: 'same-day' | 'next-day' | 'this-week' | 'flexible';
}

export default function AdminPortal() {
  const router = useRouter();
  const { toasts, addToast, removeToast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [filter, setFilter] = useState<'all' | 'unassigned' | 'assigned' | 'resolved' | 'archived' | 'deleted'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'tickets' | 'users' | 'superusers' | 'support-team' | 'contracts' | 'schedule' | 'profit-analysis'>('tickets');
  const [uploadedFiles, setUploadedFiles] = useState<Attachment[]>([]);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [assignToName, setAssignToName] = useState('');
  const [supportTeamMembers, setSupportTeamMembers] = useState<any[]>([]);
  const [isLoadingTickets, setIsLoadingTickets] = useState(true);
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [confirmAction, setConfirmAction] = useState<'archive' | 'delete' | null>(null);
  const [newTicketForm, setNewTicketForm] = useState({
    userName: '',
    userEmail: '',
    userType: 'client' as 'client' | 'subcontractor',
    subject: '',
    message: '',
    category: 'general',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    source: 'admin-created' as 'quote' | 'contact-support' | 'business-owner-portal' | 'subcontractor-portal' | 'admin-created',
    sourceLocation: '',
  });

  const [tickets, setTickets] = useState<SupportTicket[]>([]);

  const filteredTickets = tickets.filter(t => {
    // Filter by status
    const statusMatch = filter === 'all' ? true : t.status === filter;

    // Filter by search query
    if (!searchQuery.trim()) {
      return statusMatch;
    }

    const query = searchQuery.toLowerCase();
    return statusMatch && (
      t.ticketNumber?.toLowerCase().includes(query) ||
      t.subject?.toLowerCase().includes(query) ||
      t.message?.toLowerCase().includes(query) ||
      t.userName?.toLowerCase().includes(query) ||
      t.userEmail?.toLowerCase().includes(query) ||
      t.category?.toLowerCase().includes(query)
    );
  });

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTicketForm.userName.trim() || !newTicketForm.userEmail.trim() || !newTicketForm.subject.trim() || !newTicketForm.message.trim()) {
      addToast('Please fill in all required fields', 'error', 3000);
      return;
    }

    try {
      console.log('🎫 Creating new ticket...');

      const ticketData: any = {
        ticketNumber: `TKT-${Date.now()}`,
        userId: `client-${Date.now()}`,
        userName: newTicketForm.userName,
        userEmail: newTicketForm.userEmail,
        userType: newTicketForm.userType,
        category: newTicketForm.category,
        subject: newTicketForm.subject,
        message: newTicketForm.message,
        status: 'unassigned',
        priority: newTicketForm.priority,
        source: newTicketForm.source,
      };

      // Only include sourceLocation if it has a value
      if (newTicketForm.sourceLocation?.trim()) {
        ticketData.sourceLocation = newTicketForm.sourceLocation;
      }

      const ticket = await createTicket(ticketData);

      console.log('✅ Ticket created:', ticket.ticketNumber);

      // Reset form
      setNewTicketForm({
        userName: '',
        userEmail: '',
        userType: 'client',
        subject: '',
        message: '',
        category: 'general',
        priority: 'medium',
        source: 'admin-created',
        sourceLocation: '',
      });
      setShowCreateTicket(false);
      addToast(`Ticket created successfully: ${ticket.ticketNumber}`, 'success', 3000);
    } catch (error) {
      console.error('❌ Failed to create ticket:', error);
      addToast('Failed to create ticket. Please try again.', 'error', 5000);
    }
  };

  const handleSubmitResponse = async () => {
    if (!responseText.trim() || !selectedTicket) return;

    try {
      console.log('📝 Submitting response for ticket:', selectedTicket.ticketNumber);

      // Update ticket with response
      await updateTicket(selectedTicket.id, {
        response: responseText,
        status: 'response-given' as const,
        attachments: uploadedFiles.length > 0 ? uploadedFiles : undefined,
      });

      console.log('✅ Ticket updated with response');

      // Log the response activity
      await logTicketResponse({
        ticketId: selectedTicket.id,
        ticketNumber: selectedTicket.ticketNumber,
        respondentId: user?.id || 'admin',
        respondentName: user?.name || 'Admin',
        responseLength: responseText.length,
        hasAttachments: uploadedFiles.length > 0,
      });

      // Send email to the ticket raiser
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
        assignedToName: selectedTicket.assignedToName || 'Support Team',
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

      console.log('📧 Response email sent to:', selectedTicket.userEmail);

      setResponseText('');
      setUploadedFiles([]);
      setShowResponseForm(false);
    } catch (error) {
      console.error('❌ Failed to submit response:', error);
      addToast('Failed to submit response. Please try again.', 'error', 5000);
    }
  };

  const handleResolve = async () => {
    if (!selectedTicket) return;

    try {
      console.log('✅ Resolving ticket:', selectedTicket.ticketNumber);

      await updateTicket(selectedTicket.id, {
        status: 'resolved' as const,
        resolvedAt: Timestamp.now(),
      });

      // Log ticket resolution
      await logTicketResolution({
        ticketId: selectedTicket.id,
        ticketNumber: selectedTicket.ticketNumber,
        resolvedById: user?.id || 'admin',
        resolvedByName: user?.name || 'Admin',
      });

      console.log('✅ Ticket resolved and logged');
      setSelectedTicket(null);
      addToast('Ticket marked as resolved', 'success', 3000);
    } catch (error) {
      console.error('❌ Failed to resolve ticket:', error);
      addToast('Failed to resolve ticket. Please try again.', 'error', 5000);
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

  const handleSubmitComment = async () => {
    if (!selectedTicket || !commentText.trim() || !user?.id) return;

    try {
      console.log('💬 Adding comment to ticket:', selectedTicket.id);

      await addTicketComment(
        selectedTicket.id,
        user.id,
        user.name || 'Superuser',
        'superuser',
        commentText.trim()
      );

      console.log('✅ Comment added successfully');
      setCommentText('');
      addToast('Comment added', 'success', 3000);

      // The comment will appear automatically via the real-time subscription
    } catch (error) {
      console.error('❌ Failed to add comment:', error);
      addToast('Failed to add comment. Please try again.', 'error', 5000);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unassigned': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'assigned': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'open': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'in-progress': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'test-phase': return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
      case 'more-info-needed': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'response-given': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'resolved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'archived': return 'bg-slate-600/20 text-slate-300 border-slate-600/30';
      case 'deleted': return 'bg-red-900/20 text-red-300 border-red-900/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
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
    { label: 'Unassigned', value: tickets.filter(t => t.status === 'unassigned').length, icon: AlertCircle, color: 'text-gray-400' },
    { label: 'Assigned', value: tickets.filter(t => t.status === 'assigned').length, icon: Clock, color: 'text-blue-400' },
    { label: 'Resolved', value: tickets.filter(t => t.status === 'resolved').length, icon: CheckCircle, color: 'text-green-400' },
    { label: 'Total', value: tickets.length, icon: MessageSquare, color: 'text-reset-green' },
  ];

  // Subscribe to Firestore tickets and support team members in real-time
  useEffect(() => {
    // Check authentication first
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.isSuperuser) {
      router.push('/portal/superuser-login');
      return;
    }
    setUser(currentUser);
    setIsAuthorized(true);

    // Subscribe to tickets from Firestore
    try {
      const unsubscribeTickets = subscribeToTickets((firebaseTickets: any[]) => {
        const mapped = firebaseTickets.map((t: any) => ({
          ...t,
          createdAt: t.createdAt?.toDate?.()?.toLocaleString() || t.createdAt || '',
          resolvedAt: t.resolvedAt?.toDate?.()?.toLocaleString() || t.resolvedAt,
        }));
        setTickets(mapped);
        setIsLoadingTickets(false);
      });

      // Subscribe to support team members in real-time
      const unsubscribeSupportTeam = subscribeToAllSupportTeam((members: any[]) => {
        setSupportTeamMembers(members);
      });

      return () => {
        unsubscribeTickets?.();
        unsubscribeSupportTeam?.();
      };
    } catch (error) {
      setIsLoadingTickets(false);
      console.error('Failed to subscribe to tickets or support team:', error);
    }
  }, [router]);

  // Update selectedTicket in real-time when tickets change (for real-time comments)
  useEffect(() => {
    if (selectedTicket && tickets.length > 0) {
      const updatedTicket = tickets.find(t => t.id === selectedTicket.id);
      if (updatedTicket) {
        setSelectedTicket(updatedTicket);
      }
    }
  }, [tickets]);

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
    <>
      <Toast toasts={toasts} onRemove={removeToast} />
      <div className="min-h-screen bg-black pt-32 pb-20">
        <div className="container">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h2>
            <p className="text-gray-400">Manage Support Tickets & Users</p>
          </motion.div>

        {/* Navigation Tabs */}
        <div className="flex gap-3 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 ${
              activeTab === 'tickets'
                ? 'bg-reset-green text-black'
                : 'bg-reset-green/20 text-reset-green hover:bg-reset-green/30'
            }`}
          >
            <MessageSquare size={18} />
            Support Tickets
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 ${
              activeTab === 'users'
                ? 'bg-reset-green text-black'
                : 'bg-reset-green/20 text-reset-green hover:bg-reset-green/30'
            }`}
          >
            <Users size={18} />
            User Management
          </button>
          <button
            onClick={() => setActiveTab('support-team')}
            className={`px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 ${
              activeTab === 'support-team'
                ? 'bg-reset-green text-black'
                : 'bg-reset-green/20 text-reset-green hover:bg-reset-green/30'
            }`}
          >
            <User size={18} />
            Support Team
          </button>
          <button
            onClick={() => setActiveTab('superusers')}
            className={`px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 ${
              activeTab === 'superusers'
                ? 'bg-reset-green text-black'
                : 'bg-reset-green/20 text-reset-green hover:bg-reset-green/30'
            }`}
          >
            <User size={18} />
            Superuser Management
          </button>
          <button
            onClick={() => setActiveTab('contracts')}
            className={`px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 ${
              activeTab === 'contracts'
                ? 'bg-reset-green text-black'
                : 'bg-reset-green/20 text-reset-green hover:bg-reset-green/30'
            }`}
          >
            <Calendar size={18} />
            Contracts
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 ${
              activeTab === 'schedule'
                ? 'bg-reset-green text-black'
                : 'bg-reset-green/20 text-reset-green hover:bg-reset-green/30'
            }`}
          >
            <Calendar size={18} />
            Schedule
          </button>
          <button
            onClick={() => setActiveTab('profit-analysis')}
            className={`px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 ${
              activeTab === 'profit-analysis'
                ? 'bg-reset-green text-black'
                : 'bg-reset-green/20 text-reset-green hover:bg-reset-green/30'
            }`}
          >
            <TrendingUp size={18} />
            P&L Analysis
          </button>
        </div>

        {/* Support Tickets Section */}
        {activeTab === 'tickets' && (
          <>
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

            {/* Create Ticket Button */}
            <div className="mb-8 flex gap-3">
              <button
                onClick={() => setShowCreateTicket(!showCreateTicket)}
                className="px-6 py-3 bg-reset-green text-black rounded-lg font-bold hover:bg-reset-green/80 transition-colors flex items-center gap-2"
              >
                <Plus size={18} />
                Create Ticket
              </button>
            </div>

            {/* Create Ticket Form */}
            {showCreateTicket && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-6 rounded-xl glass border border-reset-green/20"
              >
                <h3 className="text-xl font-bold text-white mb-6">Create New Support Ticket</h3>
                <form onSubmit={handleCreateTicket} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Name</label>
                      <input
                        type="text"
                        value={newTicketForm.userName}
                        onChange={(e) => setNewTicketForm({ ...newTicketForm, userName: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none"
                        placeholder="Customer name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Email</label>
                      <input
                        type="email"
                        value={newTicketForm.userEmail}
                        onChange={(e) => setNewTicketForm({ ...newTicketForm, userEmail: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none"
                        placeholder="Customer email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Type</label>
                      <select
                        value={newTicketForm.userType}
                        onChange={(e) => setNewTicketForm({ ...newTicketForm, userType: e.target.value as 'client' | 'subcontractor' })}
                        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-reset-green/30 text-white focus:border-reset-green focus:outline-none"
                      >
                        <option value="client" className="bg-black">Business Owner</option>
                        <option value="subcontractor" className="bg-black">Subcontractor</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Priority</label>
                      <select
                        value={newTicketForm.priority}
                        onChange={(e) => setNewTicketForm({ ...newTicketForm, priority: e.target.value as 'low' | 'medium' | 'high' | 'urgent' })}
                        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-reset-green/30 text-white focus:border-reset-green focus:outline-none"
                      >
                        <option value="low" className="bg-black">Low</option>
                        <option value="medium" className="bg-black">Medium</option>
                        <option value="high" className="bg-black">High</option>
                        <option value="urgent" className="bg-black">Urgent</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Source</label>
                      <select
                        value={newTicketForm.source}
                        onChange={(e) => setNewTicketForm({ ...newTicketForm, source: e.target.value as 'quote' | 'contact-support' | 'business-owner-portal' | 'subcontractor-portal' | 'admin-created' })}
                        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-reset-green/30 text-white focus:border-reset-green focus:outline-none"
                      >
                        <option value="admin-created" className="bg-black">Admin Created</option>
                        <option value="quote" className="bg-black">Quote Request</option>
                        <option value="contact-support" className="bg-black">Contact Support</option>
                        <option value="business-owner-portal" className="bg-black">Business Owner Portal</option>
                        <option value="subcontractor-portal" className="bg-black">Subcontractor Portal</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-2">Source Location (Optional)</label>
                      <input
                        type="text"
                        value={newTicketForm.sourceLocation}
                        onChange={(e) => setNewTicketForm({ ...newTicketForm, sourceLocation: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none"
                        placeholder="e.g., page name or form name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Category</label>
                    <input
                      type="text"
                      value={newTicketForm.category}
                      onChange={(e) => setNewTicketForm({ ...newTicketForm, category: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none"
                      placeholder="e.g., billing, technical, quality"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Subject</label>
                    <input
                      type="text"
                      value={newTicketForm.subject}
                      onChange={(e) => setNewTicketForm({ ...newTicketForm, subject: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none"
                      placeholder="Ticket subject"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Message</label>
                    <textarea
                      value={newTicketForm.message}
                      onChange={(e) => setNewTicketForm({ ...newTicketForm, message: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none resize-none"
                      rows={4}
                      placeholder="Ticket message/description"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-reset-green text-black rounded font-bold hover:bg-reset-green/80 transition-colors"
                    >
                      Create Ticket
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateTicket(false)}
                      className="flex-1 py-2 bg-reset-green/20 text-reset-green rounded font-bold hover:bg-reset-green/30 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Search Box */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search tickets by number, subject, customer name, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-3 mb-8 flex-wrap">
              {(['all', 'unassigned', 'assigned', 'resolved', 'archived', 'deleted'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-bold transition-all capitalize ${
                    filter === status
                      ? 'bg-reset-green text-black'
                      : 'bg-reset-green/20 text-reset-green hover:bg-reset-green/30'
                  }`}
                >
                  {status === 'archived' ? '📦 Archived' : status === 'deleted' ? '🗑️ Deleted' : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
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
              <h2 className="text-xl font-bold text-white mb-6">Support Tickets</h2>
              <div className="space-y-3">
                {filteredTickets.map((ticket) => (
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
                ))}
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

                {/* Reschedule Request Details */}
                {(selectedTicket.source === 'reschedule-request' || selectedTicket.category === 'reschedule') && (
                  <div className="mb-6 pb-6 border-b border-green-500/30 bg-green-500/10 rounded-lg p-4">
                    <h4 className="font-bold text-green-400 mb-4 text-sm flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      RESCHEDULE REQUEST DETAILS
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {selectedTicket.requestedDate && (
                        <div>
                          <span className="text-gray-400">Requested Date:</span>
                          <p className="text-green-400 font-semibold">{selectedTicket.requestedDate}</p>
                        </div>
                      )}
                      {selectedTicket.rescheduleUrgency && (
                        <div>
                          <span className="text-gray-400">Urgency:</span>
                          <p className={`font-semibold ${
                            selectedTicket.rescheduleUrgency === 'same-day' ? 'text-red-400' :
                            selectedTicket.rescheduleUrgency === 'next-day' ? 'text-orange-400' :
                            selectedTicket.rescheduleUrgency === 'this-week' ? 'text-yellow-400' :
                            'text-green-400'
                          }`}>
                            {selectedTicket.rescheduleUrgency.replace('-', ' ').toUpperCase()}
                          </p>
                        </div>
                      )}
                      {selectedTicket.jobId && (
                        <div>
                          <span className="text-gray-400">Job ID:</span>
                          <p className="text-green-400 font-semibold">{selectedTicket.jobId}</p>
                        </div>
                      )}
                      {selectedTicket.contractId && (
                        <div>
                          <span className="text-gray-400">Contract ID:</span>
                          <p className="text-green-400 font-semibold">{selectedTicket.contractId}</p>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => setActiveTab('contracts')}
                      className="mt-4 px-3 py-1 text-xs bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors font-semibold"
                    >
                      View in Contracts & Schedules
                    </button>
                  </div>
                )}

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

                {/* Assign Ticket */}
                <div className="mb-6 pb-6 border-b border-reset-green/20">
                  <h4 className="font-bold text-white mb-3 text-sm">ASSIGN TO TEAM MEMBER</h4>
                  <div className="flex gap-2">
                    <select
                      value={selectedTicket.assignedTo || ''}
                      onChange={async (e) => {
                        const selected = e.target.value;
                        if (!selected || !selectedTicket?.id) {
                          console.error('❌ Missing ticket ID or selected member');
                          return;
                        }

                        const member = supportTeamMembers.find(m => m.id === selected);
                        if (!member) {
                          console.error('❌ Support member not found');
                          return;
                        }

                        try {
                          console.log('🎯 Assigning ticket to:', member?.name);

                          // Update ticket assignment
                          await updateTicket(selectedTicket.id, {
                            assignedTo: selected,
                            assignedToName: member.name,
                            status: 'assigned' as const,
                          });

                          // Log the assignment activity
                          if (user?.id) {
                            await logTicketAssignment({
                              ticketId: selectedTicket.id,
                              ticketNumber: selectedTicket.ticketNumber,
                              assignedById: user.id,
                              assignedByName: user.name || 'Admin',
                              assignedToId: selected,
                              assignedToName: member.name,
                            });
                          }

                            // Send assignment notification email
                            const assignmentEmail = formatTicketAssignmentEmail({
                              ticketNumber: selectedTicket.ticketNumber,
                              subject: selectedTicket.subject,
                              priority: selectedTicket.priority,
                              category: selectedTicket.category,
                              assignedToName: member?.name || '',
                              assignedToEmail: member?.email || '',
                            });

                            const emailSent = await sendEmail(assignmentEmail);

                            // Log email activity
                            await logEmailSent({
                              ticketId: selectedTicket.id,
                              ticketNumber: selectedTicket.ticketNumber,
                              recipientEmail: member?.email || '',
                              emailType: 'ticket_assignment',
                              success: emailSent,
                            });

                            console.log('✅ Ticket assigned and notification sent');

                            setSelectedTicket({
                              ...selectedTicket,
                              assignedTo: selected,
                              assignedToName: member?.name || '',
                              status: 'assigned',
                            });
                          } catch (error) {
                            console.error('❌ Failed to assign ticket:', error);
                            addToast('Failed to assign ticket. Please try again.', 'error', 5000);
                          }
                      }}
                      className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-reset-green/30 text-white focus:border-reset-green focus:outline-none text-sm"
                    >
                      <option value="">Select team member...</option>
                      {supportTeamMembers.map(member => (
                        <option key={member.id} value={member.id}>
                          {member.name} ({member.role})
                        </option>
                      ))}
                    </select>
                    {selectedTicket.assignedTo && (
                      <button
                        onClick={async () => {
                          if (!selectedTicket?.id) return;
                          try {
                            console.log('🔄 Unassigning ticket from:', selectedTicket.assignedToName);
                            await unassignTicket(selectedTicket.id);
                            setSelectedTicket({
                              ...selectedTicket,
                              assignedTo: undefined,
                              assignedToName: undefined,
                              status: 'unassigned',
                            });
                            console.log('✅ Ticket unassigned');
                          } catch (error) {
                            console.error('❌ Failed to unassign ticket:', error);
                            addToast('Failed to unassign ticket. Please try again.', 'error', 5000);
                          }
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-600/80 transition-colors font-bold text-sm"
                      >
                        Unassign
                      </button>
                    )}
                  </div>
                  {selectedTicket.assignedTo && (
                    <p className="text-xs text-gray-400 mt-2">Assigned to: <span className="text-reset-green font-bold">{selectedTicket.assignedToName}</span></p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-auto pt-6 border-t border-reset-green/20 flex-wrap">
                  {selectedTicket.status !== 'resolved' && !showResponseForm && (
                    <button
                      onClick={() => setShowResponseForm(true)}
                      className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-600/80 transition-colors font-bold flex items-center justify-center gap-2 text-sm"
                    >
                      <MessageSquare size={16} />
                      Add Response
                    </button>
                  )}

                  {selectedTicket.status === 'in-progress' && (
                    <button
                      onClick={handleResolve}
                      className="flex-1 py-2 bg-green-600 text-white rounded hover:bg-green-600/80 transition-colors font-bold flex items-center justify-center gap-2 text-sm"
                    >
                      <CheckCircle2 size={16} />
                      Mark Resolved
                    </button>
                  )}

                  {/* Status Change Dropdown */}
                  <select
                    value={selectedTicket.status}
                    onChange={async (e) => {
                      const newStatus = e.target.value;
                      try {
                        await updateTicket(selectedTicket.id, {
                          status: newStatus as any,
                        });
                        setSelectedTicket({
                          ...selectedTicket,
                          status: newStatus as any,
                        });
                        addToast(`Ticket status changed to ${newStatus}`, 'success', 3000);
                      } catch (error) {
                        addToast('Failed to change ticket status', 'error', 5000);
                      }
                    }}
                    className="flex-1 py-2 px-3 bg-white/5 border border-reset-green/30 text-white rounded hover:border-reset-green focus:border-reset-green focus:outline-none text-sm"
                  >
                    <option value="unassigned">Unassigned</option>
                    <option value="assigned">Assigned</option>
                    <option value="test-phase">Test Phase</option>
                    <option value="more-info-needed">More Info Needed</option>
                    <option value="resolved">Resolved</option>
                    <option value="archived">Archive</option>
                    <option value="deleted">Delete (Soft Delete)</option>
                  </select>

                  {/* Archive Button */}
                  {selectedTicket.status !== 'archived' && (
                    <button
                      onClick={() => setConfirmAction('archive')}
                      className="py-2 px-3 bg-gray-600 text-white rounded hover:bg-gray-600/80 transition-colors font-bold text-sm"
                    >
                      Archive
                    </button>
                  )}

                  {/* Delete Button */}
                  <button
                    onClick={() => setConfirmAction('delete')}
                    className="py-2 px-3 bg-red-600 text-white rounded hover:bg-red-600/80 transition-colors font-bold text-sm"
                  >
                    Delete
                  </button>

                  {selectedTicket.status === 'resolved' && selectedTicket.resolvedAt && (
                    <p className="text-gray-400 text-sm">Resolved on {selectedTicket.resolvedAt}</p>
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

                {/* Comments Section */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 pt-6 border-t border-reset-green/20 space-y-4"
                >
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <MessageSquare size={18} />
                    Internal Comments
                  </h3>

                  {/* Existing Comments */}
                  {selectedTicket.comments && selectedTicket.comments.length > 0 && (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {selectedTicket.comments.map((comment: any) => (
                        <div key={comment.id} className={`p-3 rounded-lg border space-y-2 ${
                          comment.authorRole === 'superuser'
                            ? 'bg-yellow-500/10 border-yellow-500/30'
                            : 'bg-blue-500/10 border-blue-500/30'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-white">{comment.authorName}</span>
                              <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                comment.authorRole === 'superuser'
                                  ? 'bg-yellow-500/20 text-yellow-400'
                                  : 'bg-blue-500/20 text-blue-400'
                              }`}>
                                {comment.authorRole === 'superuser' ? '🔑 Admin' : '👤 Support'}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {comment.createdAt?.toDate?.()?.toLocaleString() || comment.createdAt || 'Just now'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300">{comment.message}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {!selectedTicket.comments || selectedTicket.comments.length === 0 && (
                    <p className="text-xs text-gray-500 italic">No comments yet</p>
                  )}

                  {/* Add Comment Form */}
                  <div className="space-y-3">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add an internal comment to respond to the support member..."
                      rows={3}
                      className="w-full px-4 py-3 rounded bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none text-sm resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCommentText('')}
                        className="flex-1 py-2 border border-reset-green text-reset-green rounded hover:bg-reset-green/10 transition-colors font-bold text-sm"
                      >
                        Clear
                      </button>
                      <button
                        onClick={handleSubmitComment}
                        disabled={!commentText.trim()}
                        className="flex-1 py-2 bg-reset-green text-black rounded hover:bg-reset-green/80 transition-colors font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <Send size={16} />
                        Post Comment
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <div className="p-6 rounded-xl glass border border-reset-green/20 h-full flex items-center justify-center">
                <p className="text-gray-400 text-center">Select a ticket to view details</p>
              </div>
            )}
          </div>
            </div>

            {/* Confirmation Modal */}
            <AnimatePresence>
              {confirmAction && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                  onClick={() => setConfirmAction(null)}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-slate-900 border border-reset-green/30 rounded-xl p-6 max-w-sm mx-4 space-y-4"
                  >
                    <h3 className="font-bold text-lg text-white">
                      {confirmAction === 'archive' ? 'Archive Ticket?' : 'Delete Ticket?'}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {confirmAction === 'archive'
                        ? 'Are you sure you want to archive this ticket? You can still access it later.'
                        : 'Are you sure you want to delete this ticket? This action cannot be undone.'}
                    </p>
                    <div className="flex gap-2 pt-4">
                      <button
                        onClick={() => setConfirmAction(null)}
                        className="flex-1 py-2 border border-reset-green text-reset-green rounded hover:bg-reset-green/10 transition-colors font-bold text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            if (confirmAction === 'archive') {
                              await archiveTicket(selectedTicket!.id);
                              setSelectedTicket({
                                ...selectedTicket!,
                                status: 'archived',
                              });
                              addToast('Ticket archived', 'success', 3000);
                            } else if (confirmAction === 'delete') {
                              await deleteTicketById(selectedTicket!.id);
                              setSelectedTicket(null);
                              addToast('Ticket deleted', 'success', 3000);
                            }
                            setConfirmAction(null);
                          } catch (error) {
                            addToast(
                              confirmAction === 'archive' ? 'Failed to archive ticket' : 'Failed to delete ticket',
                              'error',
                              5000
                            );
                          }
                        }}
                        className={`flex-1 py-2 rounded font-bold text-sm text-white transition-colors ${
                          confirmAction === 'archive'
                            ? 'bg-gray-600 hover:bg-gray-600/80'
                            : 'bg-red-600 hover:bg-red-600/80'
                        }`}
                      >
                        {confirmAction === 'archive' ? 'Archive' : 'Delete'}
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* User Management Section */}
        {activeTab === 'users' && (
          <UserManagement />
        )}

        {/* Support Team Management Section */}
        {activeTab === 'support-team' && (
          <SupportTeamManagement />
        )}

        {/* Superuser Management Section */}
        {activeTab === 'superusers' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Superuser Management</h2>
              <button className="px-4 py-2 bg-reset-green text-black rounded-lg hover:bg-reset-green/80 transition-colors font-bold flex items-center gap-2 text-sm">
                <Plus size={16} />
                Add Superuser
              </button>
            </div>

            {/* Superusers List */}
            <div className="rounded-xl glass border border-reset-green/20 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-reset-green/20 border-b border-reset-green/20">
                    <th className="p-4 text-left font-bold">Name</th>
                    <th className="p-4 text-left font-bold">Email</th>
                    <th className="p-4 text-left font-bold">Role</th>
                    <th className="p-4 text-center font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 'super-1', name: 'Admin Manager', email: 'admin@reset.com.au', role: 'SUPERUSER' },
                    { id: 'super-2', name: 'Support Lead', email: 'support-lead@reset.com.au', role: 'ADMIN' },
                  ].map((su, i) => (
                    <tr key={su.id} className={`border-b border-reset-green/10 ${i % 2 === 0 ? 'bg-white/2' : ''} hover:bg-white/5 transition-colors`}>
                      <td className="p-4 font-bold text-white">{su.name}</td>
                      <td className="p-4 text-gray-400">{su.email}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded text-xs font-bold bg-reset-green/30 text-reset-green">
                          {su.role}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button className="p-1 hover:bg-red-600/20 rounded transition-colors text-red-400 text-xs" title="Remove">
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Contracts & Schedules Section */}
        {activeTab === 'contracts' && (
          <ContractManagement />
        )}

        {activeTab === 'schedule' && (
          <Schedule />
        )}

        {activeTab === 'profit-analysis' && (
          <ProfitAnalysis />
        )}
      </div>
      </div>
    </>
  );
}
