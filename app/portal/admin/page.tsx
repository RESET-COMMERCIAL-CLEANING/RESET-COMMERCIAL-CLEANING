'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Bell, MessageSquare, CheckCircle, Clock, AlertCircle, X, Eye, CheckCircle2, RotateCcw, Users, User, Plus, Send } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import UserManagement from '@/components/UserManagement';
import SupportTeamManagement from '@/components/SupportTeamManagement';

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
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
  status: 'assigned' | 'open' | 'in-progress' | 'response-given' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  response?: string;
  resolvedAt?: string;
  attachments?: Attachment[];
  assignedTo?: string;
  assignedToName?: string;
}

export default function AdminPortal() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [filter, setFilter] = useState<'all' | 'open' | 'in-progress' | 'resolved'>('all');
  const [activeTab, setActiveTab] = useState<'tickets' | 'users' | 'superusers' | 'support-team'>('tickets');
  const [uploadedFiles, setUploadedFiles] = useState<Attachment[]>([]);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [assignToName, setAssignToName] = useState('');

  // Initialize tickets from localStorage or use mock data
  const initializeTickets = (): SupportTicket[] => {
    if (typeof window === 'undefined') return [];
    const savedTickets = localStorage.getItem('supportTickets');
    if (savedTickets) {
      return JSON.parse(savedTickets);
    }
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
      message: 'I noticed an extra charge on my monthly invoice that I do not recognize. Please review my March invoice.',
      createdAt: 'Mar 13, 2025, 2:30 PM',
      status: 'assigned',
      priority: 'medium',
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
      message: 'I did not receive the job assignment for the deep cleaning on March 15th. Please check the system.',
      createdAt: 'Mar 12, 2025, 10:15 AM',
      status: 'in-progress',
      priority: 'high',
      response: 'We are investigating this issue. Please check your email for job details.',
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
      message: 'The cleaning on March 10th did not meet our standards. Some areas were not properly cleaned.',
      createdAt: 'Mar 11, 2025, 9:00 AM',
      status: 'resolved',
      priority: 'high',
      response: 'We have reviewed the issue and assigned a new team for your next cleaning. Apologies for the inconvenience.',
      resolvedAt: 'Mar 12, 2025, 11:30 AM',
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
      message: 'I cannot log into the portal. Getting an error message saying "Invalid credentials".',
      createdAt: 'Mar 10, 2025, 3:45 PM',
      status: 'resolved',
      priority: 'urgent',
      response: 'Password has been reset. You should receive a new temporary password via email.',
      resolvedAt: 'Mar 10, 2025, 5:00 PM',
    },
    ];
  };

  const [tickets, setTickets] = useState<SupportTicket[]>(() => initializeTickets());

  const filteredTickets = tickets.filter(t =>
    filter === 'all' ? true : t.status === filter
  );

  const handleSubmitResponse = () => {
    if (!responseText.trim() || !selectedTicket) return;

    const updatedTicket = {
      ...selectedTicket,
      response: responseText,
      status: 'in-progress' as const,
      attachments: uploadedFiles.length > 0 ? uploadedFiles : undefined,
    };

    setTickets(tickets.map(t =>
      t.id === selectedTicket.id ? updatedTicket : t
    ));

    setSelectedTicket(updatedTicket);
    setResponseText('');
    setUploadedFiles([]);
    setShowResponseForm(false);
  };

  const handleResolve = () => {
    if (!selectedTicket) return;

    setTickets(tickets.map(t =>
      t.id === selectedTicket.id
        ? { ...t, status: 'resolved' as const, resolvedAt: new Date().toLocaleString() }
        : t
    ));

    setSelectedTicket(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newAttachment: Attachment = {
          id: Date.now().toString(),
          name: file.name,
          type: file.type,
          size: file.size,
          url: e.target?.result as string,
          uploadedAt: new Date().toLocaleString(),
        };
        setUploadedFiles([...uploadedFiles, newAttachment]);
      };
      reader.readAsDataURL(file);
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
    { label: 'Open', value: tickets.filter(t => t.status === 'open').length, icon: AlertCircle, color: 'text-red-400' },
    { label: 'In Progress', value: tickets.filter(t => t.status === 'in-progress').length, icon: Clock, color: 'text-yellow-400' },
    { label: 'Resolved', value: tickets.filter(t => t.status === 'resolved').length, icon: CheckCircle, color: 'text-green-400' },
    { label: 'Total', value: tickets.length, icon: MessageSquare, color: 'text-blue-400' },
  ];

  // Save tickets to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined' && tickets.length > 0) {
      localStorage.setItem('supportTickets', JSON.stringify(tickets));
    }
  }, [tickets]);

  // Check authentication on mount
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.isSuperuser) {
      router.push('/portal/superuser-login');
    } else {
      setUser(currentUser);
      setIsAuthorized(true);
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
                      onChange={(e) => {
                        const selected = e.target.value;
                        if (selected) {
                          const memberNames: { [key: string]: string } = {
                            'support-1': 'John Support',
                            'support-2': 'Maria Support',
                            'support-3': 'Alex Chen',
                            'support-4': 'Sarah Williams',
                            'support-5': 'David Lee',
                          };
                          setTickets(
                            tickets.map(t =>
                              t.id === selectedTicket.id
                                ? { ...t, assignedTo: selected, assignedToName: memberNames[selected] || '' }
                                : t
                            )
                          );
                          setSelectedTicket({
                            ...selectedTicket,
                            assignedTo: selected,
                            assignedToName: memberNames[selected] || ''
                          });
                        }
                      }}
                      className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-reset-green/30 text-white focus:border-reset-green focus:outline-none text-sm"
                    >
                      <option value="">Select team member...</option>
                      <option value="support-1">John Support (Support)</option>
                      <option value="support-2">Maria Support (Support)</option>
                      <option value="support-3">Alex Chen (Senior Support)</option>
                      <option value="support-4">Sarah Williams (Support)</option>
                      <option value="support-5">David Lee (Support Lead)</option>
                    </select>
                  </div>
                  {selectedTicket.assignedTo && (
                    <p className="text-xs text-gray-400 mt-2">Assigned to: <span className="text-reset-green font-bold">{selectedTicket.assignedToName}</span></p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-auto pt-6 border-t border-reset-green/20">
                  {selectedTicket.status !== 'resolved' && (
                    <>
                      {!showResponseForm ? (
                        <button
                          onClick={() => setShowResponseForm(true)}
                          className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-600/80 transition-colors font-bold flex items-center justify-center gap-2 text-sm"
                        >
                          <MessageSquare size={16} />
                          Add Response
                        </button>
                      ) : null}

                      {selectedTicket.status === 'in-progress' && (
                        <button
                          onClick={handleResolve}
                          className="flex-1 py-2 bg-green-600 text-white rounded hover:bg-green-600/80 transition-colors font-bold flex items-center justify-center gap-2 text-sm"
                        >
                          <CheckCircle2 size={16} />
                          Mark Resolved
                        </button>
                      )}
                    </>
                  )}

                  {selectedTicket.status === 'resolved' && !selectedTicket.resolvedAt && (
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
              </motion.div>
            ) : (
              <div className="p-6 rounded-xl glass border border-reset-green/20 h-full flex items-center justify-center">
                <p className="text-gray-400 text-center">Select a ticket to view details</p>
              </div>
            )}
          </div>
            </div>
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
      </div>
    </div>
  );
}
