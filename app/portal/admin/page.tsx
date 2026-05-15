'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Bell, MessageSquare, CheckCircle, Clock, AlertCircle, X, Eye, CheckCircle2, RotateCcw, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, logout, isSuperuser } from '@/lib/auth';

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
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  response?: string;
  resolvedAt?: string;
}

export default function AdminPortal() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [filter, setFilter] = useState<'all' | 'open' | 'in-progress' | 'resolved'>('all');

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

  const handleLogout = () => {
    logout();
    router.push('/portal/superuser-login');
  };

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

  // Mock support tickets
  const [tickets, setTickets] = useState<SupportTicket[]>([
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
      status: 'open',
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
      status: 'closed',
      priority: 'urgent',
      response: 'Password has been reset. You should receive a new temporary password via email.',
      resolvedAt: 'Mar 10, 2025, 5:00 PM',
    },
  ]);

  const filteredTickets = tickets.filter(t =>
    filter === 'all' ? true : t.status === filter
  );

  const handleSubmitResponse = () => {
    if (!responseText.trim() || !selectedTicket) return;

    setTickets(tickets.map(t =>
      t.id === selectedTicket.id
        ? { ...t, response: responseText, status: 'in-progress' as const }
        : t
    ));

    setResponseText('');
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'in-progress': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'resolved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'closed': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
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

  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <h1 className="text-5xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Support Ticket Management System</p>
            {user && (
              <p className="text-sm text-reset-green mt-2">
                Logged in as: <strong>{user.name}</strong> ({user.email})
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <Link
              href="/"
              className="px-6 py-3 bg-reset-green/20 text-reset-green rounded-lg hover:bg-reset-green/30 transition-colors font-bold"
            >
              Back to Home
            </Link>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors font-bold flex items-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </motion.div>

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
                    <div className="bg-reset-green/10 border border-reset-green/30 rounded p-4">
                      <p className="text-gray-300 text-sm leading-relaxed">{selectedTicket.response}</p>
                    </div>
                  </div>
                )}

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
                    className="mt-6 pt-6 border-t border-reset-green/20 space-y-3"
                  >
                    <textarea
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      placeholder="Type your response here..."
                      rows={4}
                      className="w-full px-4 py-3 rounded bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none text-sm resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowResponseForm(false)}
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
    </div>
  );
}
