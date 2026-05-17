'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Copy, RefreshCw, X, Users, UserCheck, UserX } from 'lucide-react';
import {
  updateUser as updateLocalUser,
  resetPassword,
  getUserActivity,
  UserProfile,
  UserActivity,
  deactivateUser,
  activateUser,
} from '@/lib/userManagement';
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from '@/lib/db/users';
import { getActivityByMember } from '@/lib/db/activity';
import { collection, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type ViewMode = 'list' | 'add' | 'edit' | 'activity';

interface Modal {
  type: 'alert' | 'confirm' | 'success' | null;
  title: string;
  message: string;
  actionLabel?: string;
  onConfirm?: () => void;
}

export default function UserManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [userRole, setUserRole] = useState<'client' | 'subcontractor'>('client');
  const [showPassword, setShowPassword] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState('');
  const [activityLog, setActivityLog] = useState<UserActivity[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'pending'>('all');
  const [modal, setModal] = useState<Modal>({ type: null, title: '', message: '' });

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    industry: '',
    squareFeet: '',
    experience: '',
    availability: '',
    certifications: '',
  });

  useEffect(() => {
    // Set up real-time listener for users
    const usersCollection = collection(db, 'users');
    const unsubscribe = onSnapshot(usersCollection, (snapshot) => {
      const userList = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toLocaleString() || data.createdAt || '',
          passwordChangedAt: data.passwordChangedAt?.toDate?.()?.toLocaleString() || data.passwordChangedAt,
        } as UserProfile;
      });
      setUsers(userList);
    });

    return () => unsubscribe();
  }, []);

  const calculateStats = () => {
    return {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.status === 'active').length,
      inactiveUsers: users.filter(u => u.status === 'inactive').length,
      pendingUsers: users.filter(u => u.status === 'pending').length,
      businessOwners: users.filter(u => u.role === 'client').length,
      serviceProviders: users.filter(u => u.role === 'subcontractor').length,
    };
  };

  const stats = calculateStats();

  // Filtered users
  const filteredUsers = users.filter(u =>
    filterStatus === 'all' ? true : u.status === filterStatus
  );

  const handleAddUser = async () => {
    if (!formData.firstName || !formData.email) {
      setModal({
        type: 'alert',
        title: 'Missing Fields',
        message: 'Please fill in required fields (First Name and Email)',
      });
      return;
    }

    try {
      const userId = `user-${Date.now()}`;
      const tempPassword = Math.random().toString(36).slice(-12);
      const firstName = formData.firstName;
      const lastName = formData.lastName;

      await createUser(userId, {
        firstName,
        lastName,
        email: formData.email,
        phone: formData.phone || undefined,
        role: userRole,
        status: 'active',
        isVerified: true,
        tempPassword,
        password: tempPassword,
        requiresPasswordChange: true,
        company: formData.company || undefined,
        address: formData.address || undefined,
        industry: formData.industry || undefined,
        squareFeet: formData.squareFeet || undefined,
        experience: formData.experience || undefined,
        availability: formData.availability || undefined,
        certifications: formData.certifications || undefined,
      });

      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        address: '',
        industry: '',
        squareFeet: '',
        experience: '',
        availability: '',
        certifications: '',
      });
      setViewMode('list');
      setModal({
        type: 'success',
        title: 'User Created Successfully',
        message: `${firstName} ${lastName} has been created.\n\nTemporary Password:\n${tempPassword}\n\nClick "Copy to Clipboard" to copy the password.`,
        actionLabel: 'Copy to Clipboard',
        onConfirm: () => {
          navigator.clipboard.writeText(tempPassword);
          setModal({ type: null, title: '', message: '' });
        },
      });
    } catch (error: any) {
      console.error('❌ Failed to create user:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      setModal({
        type: 'alert',
        title: 'Error',
        message: `Failed to create user: ${error.message || error.code || 'Unknown error'}`,
      });
    }
  };

  const handleDeleteUser = (id: string) => {
    const userToDelete = users.find(u => u.id === id);
    setModal({
      type: 'confirm',
      title: 'Delete User',
      message: `Are you sure you want to delete ${userToDelete?.firstName} ${userToDelete?.lastName}? This action cannot be undone.`,
      actionLabel: 'Delete',
      onConfirm: async () => {
        try {
          await deleteUser(id);
          if (selectedUser?.id === id) setSelectedUser(null);
          setModal({ type: null, title: '', message: '' });
        } catch (error: any) {
          console.error('❌ Failed to delete user:', error);
          console.error('Error code:', error.code);
          console.error('Error message:', error.message);
          setModal({
            type: 'alert',
            title: 'Error',
            message: `Failed to delete user: ${error.message || error.code || 'Unknown error'}`,
          });
        }
      },
    });
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await updateUser(id, { status: newStatus as 'active' | 'inactive' | 'pending' });
      if (selectedUser?.id === id) {
        const updatedUser = users.find(u => u.id === id);
        if (updatedUser) setSelectedUser({ ...updatedUser, status: newStatus as 'active' | 'inactive' | 'pending' });
      }
    } catch (error: any) {
      console.error('❌ Failed to toggle user status:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      setModal({
        type: 'alert',
        title: 'Error',
        message: `Failed to update user status: ${error.message || error.code || 'Unknown error'}`,
      });
    }
  };

  const handleResetPassword = async (id: string) => {
    try {
      const newPassword = resetPassword(id);
      if (newPassword) {
        await updateUser(id, { tempPassword: newPassword });
        setModal({
          type: 'success',
          title: 'Password Reset',
          message: `New temporary password:\n\n${newPassword}\n\nClick "Copy to Clipboard" to copy the password.`,
          actionLabel: 'Copy to Clipboard',
          onConfirm: () => {
            navigator.clipboard.writeText(newPassword);
            setModal({ type: null, title: '', message: '' });
          },
        });
      }
    } catch (error: any) {
      console.error('❌ Failed to reset password:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      setModal({
        type: 'alert',
        title: 'Error',
        message: `Failed to reset password: ${error.message || error.code || 'Unknown error'}`,
      });
    }
  };

  const handleViewActivity = async (userId: string) => {
    try {
      const activity = await getActivityByMember(userId);
      setActivityLog(activity as unknown as UserActivity[]);
      setSelectedUser(users.find(u => u.id === userId) || null);
      setViewMode('activity');
    } catch (error) {
      console.error('Failed to load activity:', error);
      setModal({
        type: 'alert',
        title: 'Error',
        message: 'Failed to load activity log',
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPassword(text);
    setTimeout(() => setCopiedPassword(''), 2000);
  };

  return (
    <div className="space-y-6">
      {/* View Selector */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => setViewMode('list')}
          className={`px-4 py-2 rounded-lg font-bold transition-all ${
            viewMode === 'list'
              ? 'bg-reset-green text-black'
              : 'bg-reset-green/20 text-reset-green hover:bg-reset-green/30'
          }`}
        >
          👥 User List
        </button>
        <button
          onClick={() => {
            setViewMode('add');
            setFormData({
              firstName: '',
              lastName: '',
              email: '',
              phone: '',
              company: '',
              address: '',
              industry: '',
              squareFeet: '',
              experience: '',
              availability: '',
              certifications: '',
            });
          }}
          className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${
            viewMode === 'add'
              ? 'bg-reset-green text-black'
              : 'bg-reset-green/20 text-reset-green hover:bg-reset-green/30'
          }`}
        >
          <Plus size={18} />
          Add User
        </button>
      </div>

      {/* Stats */}
      {viewMode === 'list' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Total', value: stats.totalUsers, icon: Users, color: 'text-blue-400' },
            { label: 'Active', value: stats.activeUsers, icon: UserCheck, color: 'text-green-400' },
            { label: 'Inactive', value: stats.inactiveUsers, icon: UserX, color: 'text-red-400' },
            { label: 'Pending', value: stats.pendingUsers, icon: Users, color: 'text-yellow-400' },
            { label: 'Clients', value: stats.businessOwners, icon: Users, color: 'text-purple-400' },
            { label: 'Providers', value: stats.serviceProviders, icon: Users, color: 'text-cyan-400' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-3 rounded-lg bg-white/5 border border-reset-green/20 text-center"
              >
                <Icon className={`w-5 h-5 ${stat.color} mx-auto mb-2`} />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-400">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {/* Filter */}
          <div className="flex gap-2 flex-wrap">
            {(['all', 'active', 'inactive', 'pending'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded text-sm font-bold transition-all capitalize ${
                  filterStatus === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto rounded-lg border border-reset-green/20">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-reset-green/20 border-b border-reset-green/20">
                  <th className="p-3 text-left font-bold">Name</th>
                  <th className="p-3 text-left font-bold">Email</th>
                  <th className="p-3 text-left font-bold">Role</th>
                  <th className="p-3 text-center font-bold">Status</th>
                  <th className="p-3 text-center font-bold">Created</th>
                  <th className="p-3 text-center font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, i) => (
                  <tr
                    key={user.id}
                    className={`border-b border-reset-green/10 ${i % 2 === 0 ? 'bg-white/2' : ''} hover:bg-white/5 transition-colors`}
                  >
                    <td className="p-3 font-bold text-white">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="p-3 text-gray-400">{user.email}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        user.role === 'client' ? 'bg-purple-600/30 text-purple-300' : 'bg-cyan-600/30 text-cyan-300'
                      }`}>
                        {user.role === 'client' ? 'Business Owner' : 'Service Provider'}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        user.status === 'active' ? 'bg-green-600/30 text-green-300' :
                        user.status === 'inactive' ? 'bg-red-600/30 text-red-300' :
                        'bg-yellow-600/30 text-yellow-300'
                      }`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-3 text-center text-gray-400 text-xs">{user.createdAt}</td>
                    <td className="p-3 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setUserRole(user.role);
                            setFormData({
                              firstName: user.firstName,
                              lastName: user.lastName,
                              email: user.email,
                              phone: user.phone,
                              company: user.company || '',
                              address: user.address || '',
                              industry: user.industry || '',
                              squareFeet: user.squareFeet || '',
                              experience: user.experience || '',
                              availability: user.availability || '',
                              certifications: user.certifications || '',
                            });
                            setViewMode('edit');
                          }}
                          className="p-1 hover:bg-green-600/20 rounded transition-colors text-green-400"
                          title="Edit User"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleViewActivity(user.id)}
                          className="p-1 hover:bg-blue-600/20 rounded transition-colors text-blue-400"
                          title="View Activity"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(user.id, user.status)}
                          className={`p-1 rounded transition-colors ${
                            user.status === 'active'
                              ? 'hover:bg-red-600/20 text-red-400'
                              : 'hover:bg-green-600/20 text-green-400'
                          }`}
                          title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          {user.status === 'active' ? <UserX size={16} /> : <UserCheck size={16} />}
                        </button>
                        <button
                          onClick={() => handleResetPassword(user.id)}
                          className="p-1 hover:bg-yellow-600/20 rounded transition-colors text-yellow-400"
                          title="Reset Password"
                        >
                          <RefreshCw size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1 hover:bg-red-600/20 rounded transition-colors text-red-400"
                          title="Delete User"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* ADD USER VIEW */}
      {viewMode === 'add' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-xl glass border border-reset-green/20 space-y-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">Add New User</h3>
            <button
              onClick={() => setViewMode('list')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block font-bold text-white mb-2">Account Type</label>
            <div className="flex gap-4">
              {(['client', 'subcontractor'] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setUserRole(role)}
                  className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                    userRole === role
                      ? 'border-reset-green bg-reset-green/20'
                      : 'border-reset-green/30 bg-white/5 hover:border-reset-green/50'
                  }`}
                >
                  <p className="font-bold text-white">
                    {role === 'client' ? '🏢 Business Owner' : '👨‍💼 Service Provider'}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Common Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-300 mb-2">First Name *</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="John"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none text-sm"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-300 mb-2">Last Name *</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Smith"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none text-sm"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-300 mb-2">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none text-sm"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-300 mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+61 2 XXXX XXXX"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none text-sm"
              />
            </div>
          </div>

          {/* Business Owner Fields */}
          {userRole === 'client' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-purple-500/5 border border-purple-500/20 rounded-lg">
              <div>
                <label className="block font-bold text-gray-300 mb-2">Company Name</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="ABC Corporation"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-300 mb-2">Industry</label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  placeholder="Technology"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-300 mb-2">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Business Street"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-300 mb-2">Square Footage</label>
                <input
                  type="text"
                  value={formData.squareFeet}
                  onChange={(e) => setFormData({ ...formData, squareFeet: e.target.value })}
                  placeholder="5,000 sqft"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none text-sm"
                />
              </div>
            </div>
          )}

          {/* Service Provider Fields */}
          {userRole === 'subcontractor' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-lg">
              <div>
                <label className="block font-bold text-gray-300 mb-2">Experience</label>
                <select
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-reset-green/30 text-white focus:border-reset-green focus:outline-none text-sm"
                >
                  <option value="">Select experience</option>
                  <option value="0-1 years">0-1 years</option>
                  <option value="1-3 years">1-3 years</option>
                  <option value="3-5 years">3-5 years</option>
                  <option value="5+ years">5+ years</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-gray-300 mb-2">Availability</label>
                <select
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-reset-green/30 text-white focus:border-reset-green focus:outline-none text-sm"
                >
                  <option value="">Select availability</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Weekends Only">Weekends Only</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block font-bold text-gray-300 mb-2">Certifications</label>
                <input
                  type="text"
                  value={formData.certifications}
                  onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                  placeholder="IICRC Certified, CPR Certified..."
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none text-sm"
                />
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-6 border-t border-reset-green/20">
            <button
              onClick={() => setViewMode('list')}
              className="flex-1 py-2 border border-reset-green text-reset-green rounded hover:bg-reset-green/10 transition-colors font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleAddUser}
              className="flex-1 py-2 bg-reset-green text-black rounded hover:bg-reset-green/80 transition-colors font-bold"
            >
              Create Account
            </button>
          </div>
        </motion.div>
      )}

      {/* EDIT USER VIEW */}
      {viewMode === 'edit' && selectedUser && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-xl glass border border-reset-green/20 space-y-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">Edit User Profile</h3>
            <button
              onClick={() => setViewMode('list')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Common Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-300 mb-2">First Name *</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-reset-green/30 text-white focus:border-reset-green focus:outline-none text-sm"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-300 mb-2">Last Name *</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-reset-green/30 text-white focus:border-reset-green focus:outline-none text-sm"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-300 mb-2">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-reset-green/30 text-white focus:border-reset-green focus:outline-none text-sm"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-300 mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-reset-green/30 text-white focus:border-reset-green focus:outline-none text-sm"
              />
            </div>
          </div>

          {/* Business Owner Fields */}
          {selectedUser.role === 'client' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-300 mb-2">Company Name</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-reset-green/30 text-white focus:border-reset-green focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-300 mb-2">Industry</label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-reset-green/30 text-white focus:border-reset-green focus:outline-none text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block font-bold text-gray-300 mb-2">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-reset-green/30 text-white focus:border-reset-green focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-300 mb-2">Square Feet</label>
                <input
                  type="text"
                  value={formData.squareFeet}
                  onChange={(e) => setFormData({ ...formData, squareFeet: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-reset-green/30 text-white focus:border-reset-green focus:outline-none text-sm"
                />
              </div>
            </div>
          )}

          {/* Service Provider Fields */}
          {selectedUser.role === 'subcontractor' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-300 mb-2">Experience</label>
                <select
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-reset-green/30 text-white focus:border-reset-green focus:outline-none text-sm"
                >
                  <option value="">Select experience level</option>
                  <option value="1-2 years">1-2 years</option>
                  <option value="3-5 years">3-5 years</option>
                  <option value="5+ years">5+ years</option>
                  <option value="10+ years">10+ years</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-gray-300 mb-2">Availability</label>
                <select
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-reset-green/30 text-white focus:border-reset-green focus:outline-none text-sm"
                >
                  <option value="">Select availability</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Weekends Only">Weekends Only</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block font-bold text-gray-300 mb-2">Certifications</label>
                <input
                  type="text"
                  value={formData.certifications}
                  onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-reset-green/30 text-white focus:border-reset-green focus:outline-none text-sm"
                />
              </div>
            </div>
          )}

          {/* Save Buttons */}
          <div className="flex gap-3 pt-6 border-t border-reset-green/20">
            <button
              onClick={() => setViewMode('list')}
              className="flex-1 py-2 border border-reset-green text-reset-green rounded hover:bg-reset-green/10 transition-colors font-bold"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                if (!formData.firstName || !formData.email) {
                  setModal({
                    type: 'alert',
                    title: 'Missing Fields',
                    message: 'Please fill in required fields (First Name and Email)',
                  });
                  return;
                }

                try {
                  await updateUser(selectedUser.id, {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    company: formData.company || undefined,
                    address: formData.address || undefined,
                    industry: formData.industry || undefined,
                    squareFeet: formData.squareFeet || undefined,
                    experience: formData.experience || undefined,
                    availability: formData.availability || undefined,
                    certifications: formData.certifications || undefined,
                  });

                  setModal({
                    type: 'success',
                    title: 'User Updated',
                    message: `${formData.firstName} ${formData.lastName}'s profile has been updated successfully.`,
                  });
                  setViewMode('list');
                } catch (error) {
                  console.error('Failed to update user:', error);
                  setModal({
                    type: 'alert',
                    title: 'Error',
                    message: 'Failed to update user',
                  });
                }
              }}
              className="flex-1 py-2 bg-reset-green text-black rounded hover:bg-reset-green/80 transition-colors font-bold"
            >
              Save Changes
            </button>
          </div>
        </motion.div>
      )}

      {/* ACTIVITY VIEW */}
      {viewMode === 'activity' && selectedUser && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-xl glass border border-reset-green/20 space-y-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">
              Activity Log - {selectedUser.firstName} {selectedUser.lastName}
            </h3>
            <button
              onClick={() => setViewMode('list')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Activity Timeline */}
          <div className="space-y-3">
            {activityLog.length > 0 ? (
              activityLog.map((activity) => (
                <div key={activity.id} className="p-4 bg-white/5 border border-reset-green/20 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-white">{activity.action}</p>
                      <p className="text-sm text-gray-400 mt-1">{activity.details}</p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {typeof activity.timestamp === 'string' ? activity.timestamp : typeof activity.timestamp === 'object' && 'toDate' in activity.timestamp ? (activity.timestamp as any).toDate().toLocaleString() : new Date(activity.timestamp as any).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-8">No activity recorded</p>
            )}
          </div>

          <button
            onClick={() => setViewMode('list')}
            className="w-full py-2 border border-reset-green text-reset-green rounded hover:bg-reset-green/10 transition-colors font-bold mt-6"
          >
            Back to Users
          </button>
        </motion.div>
      )}

      {/* Modal */}
      {modal.type && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-black border border-reset-green/30 rounded-xl p-8 max-w-md w-full"
          >
            <h3 className="text-2xl font-bold text-white mb-4">{modal.title}</h3>
            <p className="text-gray-300 whitespace-pre-line mb-6 leading-relaxed">
              {modal.message}
            </p>

            <div className="flex gap-3">
              {modal.type === 'confirm' ? (
                <>
                  <button
                    onClick={() => setModal({ type: null, title: '', message: '' })}
                    className="flex-1 py-2 border border-reset-green text-reset-green rounded-lg hover:bg-reset-green/10 transition-colors font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={modal.onConfirm}
                    className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-bold"
                  >
                    {modal.actionLabel || 'Confirm'}
                  </button>
                </>
              ) : (
                <>
                  {modal.actionLabel && (
                    <button
                      onClick={modal.onConfirm}
                      className="flex-1 py-2 bg-reset-green text-black rounded-lg hover:bg-reset-green/90 transition-colors font-bold"
                    >
                      {modal.actionLabel}
                    </button>
                  )}
                  <button
                    onClick={() => setModal({ type: null, title: '', message: '' })}
                    className={`${modal.actionLabel ? 'flex-1' : 'w-full'} py-2 border border-reset-green text-reset-green rounded-lg hover:bg-reset-green/10 transition-colors font-bold`}
                  >
                    {modal.actionLabel ? 'Close' : 'OK'}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
