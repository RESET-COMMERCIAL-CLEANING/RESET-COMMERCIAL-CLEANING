'use client';

import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye, Activity, User, Mail, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
  generateTempPassword,
} from '@/lib/supportTeamManagement';
import {
  createSupportMember,
  updateSupportMember,
  deleteSupportMember,
  SupportTeamMember,
} from '@/lib/db/supportTeam';
import { getActivityByMember, Activity as ActivityLog } from '@/lib/db/activity';
import { collection, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type ViewMode = 'list' | 'add' | 'edit' | 'activity';

interface ModalState {
  type: 'alert' | 'confirm' | 'success';
  title: string;
  message: string;
  actionLabel?: string;
  onConfirm?: () => void;
}

export default function SupportTeamManagement() {
  const [supportTeam, setSupportTeam] = useState<SupportTeamMember[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedMember, setSelectedMember] = useState<SupportTeamMember | null>(null);
  const [activity, setActivity] = useState<ActivityLog[]>([]);
  const [modal, setModal] = useState<ModalState | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'support' as 'support' | 'senior-support' | 'support-lead',
    phone: '',
    bio: '',
  });

  useEffect(() => {
    // Set up real-time listener for support team
    const supportTeamCollection = collection(db, 'supportTeam');
    const unsubscribe = onSnapshot(supportTeamCollection, (snapshot) => {
      const team = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as SupportTeamMember[];
      setSupportTeam(team);
    });

    return () => unsubscribe();
  }, []);

  const calculateStats = () => {
    return {
      total: supportTeam.length,
      active: supportTeam.filter(m => m.status === 'active').length,
      inactive: supportTeam.filter(m => m.status === 'inactive').length,
      pending: supportTeam.filter(m => m.status === 'pending').length,
      byRole: {
        support: supportTeam.filter(m => m.role === 'support').length,
        seniorSupport: supportTeam.filter(m => m.role === 'senior-support').length,
        supportLead: supportTeam.filter(m => m.role === 'support-lead').length,
      },
    };
  };

  const stats = calculateStats();

  const handleAdd = async () => {
    if (!formData.name || !formData.username || !formData.email || !formData.password) {
      setModal({
        type: 'alert',
        title: 'Error',
        message: 'Please fill in all required fields',
      });
      return;
    }

    try {
      const newId = `support-${Date.now()}`;
      const memberName = formData.name;
      await createSupportMember(newId, {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        status: 'active',
        phone: formData.phone || undefined,
        bio: formData.bio || undefined,
      });

      setFormData({
        name: '',
        username: '',
        email: '',
        password: '',
        role: 'support',
        phone: '',
        bio: '',
      });
      setViewMode('list');

      setModal({
        type: 'success',
        title: 'Success',
        message: `Support team member "${memberName}" has been added successfully.`,
      });
    } catch (error: any) {
      console.error('❌ Failed to add support member:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      setModal({
        type: 'alert',
        title: 'Error',
        message: `Failed to add support team member: ${error.message || error.code || 'Unknown error'}`,
      });
    }
  };

  const handleEdit = async () => {
    if (!selectedMember) return;

    try {
      await updateSupportMember(selectedMember.id, {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone || undefined,
        bio: formData.bio || undefined,
      } as Partial<SupportTeamMember>);

      setViewMode('list');
      setSelectedMember(null);
      setFormData({
        name: '',
        username: '',
        email: '',
        password: '',
        role: 'support',
        phone: '',
        bio: '',
      });

      setModal({
        type: 'success',
        title: 'Success',
        message: 'Support team member has been updated successfully.',
      });
    } catch (error: any) {
      console.error('❌ Failed to update support member:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      setModal({
        type: 'alert',
        title: 'Error',
        message: `Failed to update support team member: ${error.message || error.code || 'Unknown error'}`,
      });
    }
  };

  const handleDelete = (member: SupportTeamMember) => {
    setModal({
      type: 'confirm',
      title: 'Delete Support Team Member',
      message: `Are you sure you want to delete ${member.name}? This action cannot be undone.`,
      actionLabel: 'Delete',
      onConfirm: async () => {
        try {
          await deleteSupportMember(member.id);
          setModal({
            type: 'success',
            title: 'Deleted',
            message: `${member.name} has been removed from the support team.`,
          });
        } catch (error: any) {
          console.error('❌ Failed to delete support member:', error);
          console.error('Error code:', error.code);
          console.error('Error message:', error.message);
          setModal({
            type: 'alert',
            title: 'Error',
            message: `Failed to delete support team member: ${error.message || error.code || 'Unknown error'}`,
          });
        }
      },
    });
  };

  const handleViewActivity = async (member: SupportTeamMember) => {
    try {
      const memberActivity = await getActivityByMember(member.id);
      setSelectedMember(member);
      setActivity(memberActivity);
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

  const handleGeneratePassword = () => {
    const newPassword = generateTempPassword();
    setFormData({ ...formData, password: newPassword });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Members', value: stats.total, color: 'text-blue-400' },
          { label: 'Active', value: stats.active, color: 'text-green-400' },
          { label: 'Inactive', value: stats.inactive, color: 'text-red-400' },
          { label: 'Pending', value: stats.pending, color: 'text-yellow-400' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-xl glass border border-reset-green/20"
          >
            <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* View Modes */}
      {viewMode === 'list' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Support Team Members</h2>
            <button
              onClick={() => {
                setViewMode('add');
                setFormData({
                  name: '',
                  username: '',
                  email: '',
                  password: generateTempPassword(),
                  role: 'support',
                  phone: '',
                  bio: '',
                });
              }}
              className="px-4 py-2 bg-reset-green text-black rounded-lg hover:bg-reset-green/80 transition-colors font-bold flex items-center gap-2 text-sm"
            >
              <Plus size={16} />
              Add Member
            </button>
          </div>

          {/* Team Table */}
          <div className="rounded-xl glass border border-reset-green/20 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-reset-green/20 border-b border-reset-green/20">
                  <th className="p-4 text-left font-bold">Name</th>
                  <th className="p-4 text-left font-bold">Username</th>
                  <th className="p-4 text-left font-bold">Email</th>
                  <th className="p-4 text-left font-bold">Role</th>
                  <th className="p-4 text-left font-bold">Status</th>
                  <th className="p-4 text-center font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {supportTeam.map((member, i) => (
                  <tr key={member.id} className={`border-b border-reset-green/10 ${i % 2 === 0 ? 'bg-white/2' : ''} hover:bg-white/5 transition-colors`}>
                    <td className="p-4 font-bold text-white">{member.name}</td>
                    <td className="p-4 text-gray-400">{member.username}</td>
                    <td className="p-4 text-gray-400">{member.email}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded text-xs font-bold bg-reset-green/30 text-reset-green capitalize">
                        {member.role.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold capitalize ${
                          member.status === 'active'
                            ? 'bg-green-500/20 text-green-400'
                            : member.status === 'inactive'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => {
                            setSelectedMember(member);
                            setFormData({
                              name: member.name,
                              username: member.username,
                              email: member.email,
                              password: member.password,
                              role: member.role,
                              phone: member.phone || '',
                              bio: member.bio || '',
                            });
                            setViewMode('edit');
                          }}
                          className="p-1 hover:bg-blue-600/20 rounded transition-colors text-blue-400 text-xs"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleViewActivity(member)}
                          className="p-1 hover:bg-purple-600/20 rounded transition-colors text-purple-400 text-xs"
                          title="Activity"
                        >
                          <Activity size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(member)}
                          className="p-1 hover:bg-red-600/20 rounded transition-colors text-red-400 text-xs"
                          title="Delete"
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
        </div>
      )}

      {/* Add/Edit Form */}
      {(viewMode === 'add' || viewMode === 'edit') && (
        <div className="p-6 rounded-xl glass border border-reset-green/20 space-y-6">
          <h2 className="text-2xl font-bold text-white">{viewMode === 'add' ? 'Add Support Team Member' : 'Edit Support Team Member'}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Full Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-reset-green/30 text-white focus:border-reset-green focus:outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Username *</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-reset-green/30 text-white focus:border-reset-green focus:outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-reset-green/30 text-white focus:border-reset-green focus:outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-reset-green/30 text-white focus:border-reset-green focus:outline-none text-sm"
              >
                <option value="support">Support</option>
                <option value="senior-support">Senior Support</option>
                <option value="support-lead">Support Lead</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-reset-green/30 text-white focus:border-reset-green focus:outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Password *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-reset-green/30 text-white focus:border-reset-green focus:outline-none text-sm"
                />
                <button
                  onClick={handleGeneratePassword}
                  className="px-3 py-2 bg-reset-green/20 text-reset-green rounded-lg hover:bg-reset-green/30 transition-colors text-xs font-bold"
                >
                  Generate
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-reset-green/30 text-white focus:border-reset-green focus:outline-none text-sm resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setViewMode('list');
                setSelectedMember(null);
              }}
              className="flex-1 py-2 border border-reset-green text-reset-green rounded hover:bg-reset-green/10 transition-colors font-bold text-sm"
            >
              Cancel
            </button>
            <button
              onClick={viewMode === 'add' ? handleAdd : handleEdit}
              className="flex-1 py-2 bg-reset-green text-black rounded hover:bg-reset-green/80 transition-colors font-bold text-sm"
            >
              {viewMode === 'add' ? 'Add Member' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* Activity View */}
      {viewMode === 'activity' && selectedMember && (
        <div className="space-y-6">
          <button
            onClick={() => {
              setViewMode('list');
              setSelectedMember(null);
              setActivity([]);
            }}
            className="px-4 py-2 border border-reset-green text-reset-green rounded hover:bg-reset-green/10 transition-colors font-bold text-sm"
          >
            ← Back to List
          </button>

          <div className="p-6 rounded-xl glass border border-reset-green/20">
            <h2 className="text-2xl font-bold text-white mb-2">{selectedMember.name}</h2>
            <p className="text-gray-400 text-sm mb-4">{selectedMember.bio || 'No bio available'}</p>

            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white">Activity Log</h3>
              {activity.length > 0 ? (
                <div className="space-y-3">
                  {activity.map((act) => (
                    <div key={act.id} className="p-4 bg-white/5 border border-reset-green/20 rounded">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-white">{act.action}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {act.timestamp instanceof Timestamp
                              ? act.timestamp.toDate().toLocaleString()
                              : new Date(act.timestamp).toLocaleString()}
                          </p>
                          {act.details && <p className="text-sm text-gray-300 mt-2">{act.details}</p>}
                        </div>
                        {act.ticketId && <span className="text-xs text-reset-green font-bold">{act.ticketId}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No activity yet</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black border border-reset-green/30 rounded-xl max-w-md w-full p-6 space-y-4"
          >
            <h3 className="text-xl font-bold text-white">{modal.title}</h3>
            <p className="text-gray-400">{modal.message}</p>

            <div className="flex gap-3">
              {modal.type === 'confirm' ? (
                <>
                  <button
                    onClick={() => setModal(null)}
                    className="flex-1 py-2 border border-reset-green text-reset-green rounded hover:bg-reset-green/10 transition-colors font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      modal.onConfirm?.();
                      setModal(null);
                    }}
                    className="flex-1 py-2 bg-red-600 text-white rounded hover:bg-red-600/80 transition-colors font-bold"
                  >
                    {modal.actionLabel}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setModal(null)}
                  className="w-full py-2 bg-reset-green text-black rounded hover:bg-reset-green/80 transition-colors font-bold"
                >
                  OK
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
