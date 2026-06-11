'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, AlertCircle, Camera, Edit2, X, Save } from 'lucide-react';
import { useState } from 'react';
import { Timestamp } from 'firebase/firestore';
import { updateJobChecklist, CleaningJob } from '@/lib/db/jobs';
import { uploadBeforeAfterPhoto } from '@/lib/storage';
import { Toast, useToast } from '@/components/Toast';

interface ChecklistItem {
  id: string;
  task: string;
  completed: boolean;
  requiresPhotos: boolean;
  beforePhoto?: string;
  afterPhoto?: string;
  comments?: string;
}

interface SubcontractorChecklistProps {
  job: CleaningJob;
  onUpdate: () => void;
}

export default function SubcontractorChecklist({ job, onUpdate }: SubcontractorChecklistProps) {
  const { toasts, addToast, removeToast } = useToast();
  const [checklist, setChecklist] = useState<ChecklistItem[]>(job.checklist || []);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editComments, setEditComments] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [photoUploadingFor, setPhotoUploadingFor] = useState<{ itemId: string; type: 'before' | 'after' } | null>(null);

  const completedCount = checklist.filter((item) => item.completed).length;
  const totalCount = checklist.length;
  const progressPercentage = Math.round((completedCount / totalCount) * 100);

  const handleToggleItem = async (itemId: string) => {
    const updatedChecklist = checklist.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    setChecklist(updatedChecklist);

    try {
      await updateJobChecklist(job.id, updatedChecklist);
      onUpdate();
      addToast(`Task ${updatedChecklist.find((i) => i.id === itemId)?.completed ? 'completed' : 'uncompleted'}`, 'success');
    } catch (error) {
      console.error('Error updating checklist:', error);
      addToast('Failed to update task', 'error');
      setChecklist(checklist);
    }
  };

  const handleUploadPhoto = async (
    itemId: string,
    type: 'before' | 'after',
    file: File
  ) => {
    setPhotoUploadingFor({ itemId, type });
    setIsLoading(true);

    try {
      const photoUrl = await uploadBeforeAfterPhoto(job.id, itemId, type, file);

      const updatedChecklist = checklist.map((item) =>
        item.id === itemId
          ? {
              ...item,
              [type === 'before' ? 'beforePhoto' : 'afterPhoto']: photoUrl,
            }
          : item
      );

      setChecklist(updatedChecklist);
      await updateJobChecklist(job.id, updatedChecklist);
      addToast(`${type === 'before' ? 'Before' : 'After'} photo uploaded!`, 'success');
      onUpdate();
    } catch (error) {
      console.error('Error uploading photo:', error);
      addToast('Failed to upload photo', 'error');
    } finally {
      setIsLoading(false);
      setPhotoUploadingFor(null);
    }
  };

  const handleSaveComments = async (itemId: string) => {
    const updatedChecklist = checklist.map((item) =>
      item.id === itemId ? { ...item, comments: editComments } : item
    );
    setChecklist(updatedChecklist);

    try {
      await updateJobChecklist(job.id, updatedChecklist);
      addToast('Comments saved!', 'success');
      setEditingItem(null);
      onUpdate();
    } catch (error) {
      console.error('Error saving comments:', error);
      addToast('Failed to save comments', 'error');
      setChecklist(checklist);
    }
  };

  const toggleExpand = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  return (
    <>
      <Toast toasts={toasts} onRemove={removeToast} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Progress Section */}
        <div className="bg-gradient-to-r from-reset-green/20 to-reset-green/10 border border-reset-green/30 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Checklist Progress</h3>
            <span className="text-2xl font-bold text-reset-green">{progressPercentage}%</span>
          </div>

          <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden mb-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-reset-green to-reset-green/80"
            />
          </div>

          <p className="text-sm text-gray-300">
            {completedCount} of {totalCount} tasks completed
          </p>
        </div>

        {/* Checklist Items */}
        <div className="space-y-3">
          {checklist.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No checklist items yet. Contact your supervisor.</p>
            </div>
          ) : (
            checklist.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border border-gray-700/50 rounded-lg overflow-hidden hover:border-reset-green/30 transition-colors"
              >
                {/* Item Header */}
                <button
                  onClick={() => toggleExpand(item.id)}
                  className="w-full p-4 flex items-start gap-3 bg-gray-900/30 hover:bg-gray-900/50 transition-colors text-left"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleItem(item.id);
                    }}
                    className="mt-0.5 flex-shrink-0"
                  >
                    {item.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-reset-green" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-500 hover:text-reset-green transition-colors" />
                    )}
                  </button>

                  <div className="flex-1">
                    <h4 className={`font-semibold transition-colors ${item.completed ? 'text-gray-400 line-through' : 'text-white'}`}>
                      {item.task}
                    </h4>
                    {item.comments && (
                      <p className="text-sm text-gray-400 mt-1">💬 {item.comments}</p>
                    )}
                  </div>

                  <div className="flex-shrink-0 text-gray-400" title={item.requiresPhotos ? "Requires photos" : undefined}>
                    {item.requiresPhotos && <Camera size={18} className="text-orange-400" />}
                  </div>
                </button>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedItems.includes(item.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="bg-gray-900/50 border-t border-gray-700/30 p-4 space-y-4"
                    >
                      {/* Photo Section */}
                      {item.requiresPhotos && (
                        <div className="grid grid-cols-2 gap-4">
                          {/* Before Photo */}
                          <div>
                            <label className="block text-sm font-bold text-gray-300 mb-2">Before Photo</label>
                            {item.beforePhoto ? (
                              <div className="relative group">
                                <img
                                  src={item.beforePhoto}
                                  alt="Before"
                                  className="w-full h-32 object-cover rounded border border-gray-600"
                                />
                                <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer rounded">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) handleUploadPhoto(item.id, 'before', file);
                                    }}
                                    disabled={photoUploadingFor?.itemId === item.id && isLoading}
                                    className="hidden"
                                  />
                                  <span className="text-white text-xs font-bold">Change</span>
                                </label>
                              </div>
                            ) : (
                              <label className="w-full h-32 border-2 border-dashed border-reset-green/30 rounded flex items-center justify-center cursor-pointer hover:border-reset-green/50 transition-colors bg-reset-green/5">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleUploadPhoto(item.id, 'before', file);
                                  }}
                                  disabled={photoUploadingFor?.itemId === item.id && isLoading}
                                  className="hidden"
                                />
                                <div className="text-center">
                                  <Camera size={24} className="text-reset-green/50 mx-auto mb-1" />
                                  <span className="text-xs text-reset-green font-bold">Upload Photo</span>
                                </div>
                              </label>
                            )}
                          </div>

                          {/* After Photo */}
                          <div>
                            <label className="block text-sm font-bold text-gray-300 mb-2">After Photo</label>
                            {item.afterPhoto ? (
                              <div className="relative group">
                                <img
                                  src={item.afterPhoto}
                                  alt="After"
                                  className="w-full h-32 object-cover rounded border border-gray-600"
                                />
                                <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer rounded">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) handleUploadPhoto(item.id, 'after', file);
                                    }}
                                    disabled={photoUploadingFor?.itemId === item.id && isLoading}
                                    className="hidden"
                                  />
                                  <span className="text-white text-xs font-bold">Change</span>
                                </label>
                              </div>
                            ) : (
                              <label className="w-full h-32 border-2 border-dashed border-reset-green/30 rounded flex items-center justify-center cursor-pointer hover:border-reset-green/50 transition-colors bg-reset-green/5">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleUploadPhoto(item.id, 'after', file);
                                  }}
                                  disabled={photoUploadingFor?.itemId === item.id && isLoading}
                                  className="hidden"
                                />
                                <div className="text-center">
                                  <Camera size={24} className="text-reset-green/50 mx-auto mb-1" />
                                  <span className="text-xs text-reset-green font-bold">Upload Photo</span>
                                </div>
                              </label>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Comments Section */}
                      <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2">Comments</label>
                        {editingItem === item.id ? (
                          <div className="space-y-2">
                            <textarea
                              value={editComments}
                              onChange={(e) => setEditComments(e.target.value)}
                              placeholder="Add your comments about this task..."
                              className="w-full px-3 py-2 bg-gray-800 border border-reset-green/30 rounded text-white placeholder-gray-500 focus:border-reset-green focus:outline-none resize-none h-20"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSaveComments(item.id)}
                                disabled={isLoading}
                                className="flex-1 px-3 py-2 bg-reset-green text-black rounded font-bold hover:bg-reset-green/80 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                              >
                                <Save size={16} />
                                Save
                              </button>
                              <button
                                onClick={() => setEditingItem(null)}
                                className="flex-1 px-3 py-2 bg-gray-800 text-gray-300 rounded font-bold hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                              >
                                <X size={16} />
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingItem(item.id);
                              setEditComments(item.comments || '');
                            }}
                            className="w-full text-left p-3 bg-gray-800/50 border border-gray-700/50 rounded hover:border-reset-green/30 transition-colors text-gray-300 hover:text-white flex items-center gap-2"
                          >
                            <Edit2 size={16} />
                            {item.comments ? 'Edit comments' : 'Add comments'}
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </div>

        {/* Summary */}
        {completedCount === totalCount && totalCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-reset-green/20 border border-reset-green/50 rounded-lg text-center"
          >
            <p className="text-reset-green font-bold">✓ All tasks completed!</p>
            <p className="text-sm text-gray-300 mt-1">Great work! Submit this job for review.</p>
          </motion.div>
        )}
      </motion.div>
    </>
  );
}
