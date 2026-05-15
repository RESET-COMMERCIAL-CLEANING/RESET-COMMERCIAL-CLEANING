'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Bell, Download, MessageSquare, LogOut, User, Phone, Mail, TrendingUp, CheckCircle, X, Star, MapPin, Clock, Camera } from 'lucide-react';
import { useState } from 'react';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface Photo {
  id: string;
  date: string;
  subcontractor: string;
  image: string;
  rating?: number;
}

interface OngoingJob {
  id: string;
  type: string;
  location: string;
  startDate: string;
  estimatedHours: number;
  progress: number;
  subcontractor: string;
  photos: Photo[];
}

interface Profile {
  company: string;
  email: string;
  phone: string;
  address: string;
  industry: string;
  squareFeet: string;
}

interface BeforeAfterEntry {
  id: string;
  date: string;
  location: string;
  daysRemaining: number;
  before: string;
  after: string;
}

export default function ClientPortal() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    company: 'Tech Startup HQ',
    email: 'admin@techstartuphq.com',
    phone: '+61 2 9234 5678',
    address: '123 Tech Street, Sydney NSW 2000',
    industry: 'Technology',
    squareFeet: '5,000 sqft',
  });

  const [editProfile, setEditProfile] = useState<Profile>(profile);
  const [selectedPhotoDate, setSelectedPhotoDate] = useState<string | null>(null);

  const addNotification = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  // Mock ongoing jobs with comprehensive data
  const ongoingJobs: OngoingJob[] = [
    {
      id: '1',
      type: 'Deep Cleaning',
      location: 'Level 2 - Office Area',
      startDate: 'Mar 12, 2025',
      estimatedHours: 4,
      progress: 65,
      subcontractor: 'Elite Cleaning Crew',
      photos: [
        { id: 'p1', date: 'Mar 12, 2025, 10:00 AM', subcontractor: 'Elite Cleaning Crew', image: '📸', rating: 5 },
        { id: 'p2', date: 'Mar 12, 2025, 1:30 PM', subcontractor: 'Elite Cleaning Crew', image: '📸', rating: 5 },
      ],
    },
    {
      id: '2',
      type: 'Floor Polish',
      location: 'Reception Area',
      startDate: 'Mar 11, 2025',
      estimatedHours: 3,
      progress: 92,
      subcontractor: 'Pro Services Team',
      photos: [
        { id: 'p3', date: 'Mar 11, 2025, 9:00 AM', subcontractor: 'Pro Services Team', image: '📸' },
        { id: 'p4', date: 'Mar 11, 2025, 11:30 AM', subcontractor: 'Pro Services Team', image: '📸' },
        { id: 'p5', date: 'Mar 11, 2025, 2:00 PM', subcontractor: 'Pro Services Team', image: '📸' },
      ],
    },
  ];

  // Mock completed jobs with ratings
  const completedJobs = [
    { id: 'c1', date: 'Mar 5, 2025', type: 'Standard Cleaning', location: 'Level 3', rating: 4.8, ratingCount: 1 },
    { id: 'c2', date: 'Mar 1, 2025', type: 'Deep Cleaning', location: 'Lobby', rating: 5, ratingCount: 1 },
    { id: 'c3', date: 'Feb 24, 2025', type: 'Carpet Cleaning', location: 'Conference Room', rating: 4.5, ratingCount: 1 },
  ];

  // Mock monthly reports
  const monthlyReports = [
    {
      month: 'March 2025',
      filename: 'RESET-Report-Mar-2025.pdf',
      jobsCompleted: 8,
      totalSpent: '$2,100',
      averageRating: 4.8,
      cleaningEfficiency: '94%',
      highlights: '3 deep cleanings, 5 standard cleanings',
      costPerSqFt: '$0.42',
    },
    {
      month: 'February 2025',
      filename: 'RESET-Report-Feb-2025.pdf',
      jobsCompleted: 9,
      totalSpent: '$2,250',
      averageRating: 4.7,
      cleaningEfficiency: '91%',
      highlights: '2 floor polishes, 7 standard cleanings',
      costPerSqFt: '$0.45',
    },
    {
      month: 'January 2025',
      filename: 'RESET-Report-Jan-2025.pdf',
      jobsCompleted: 7,
      totalSpent: '$1,900',
      averageRating: 4.6,
      cleaningEfficiency: '89%',
      highlights: '1 deep cleaning, 6 standard cleanings',
      costPerSqFt: '$0.38',
    },
  ];

  const stats = [
    { label: 'Total Spent', value: '$6,250', icon: TrendingUp },
    { label: 'Jobs Completed', value: '24', icon: CheckCircle },
    { label: 'Avg Rating', value: '4.8/5', icon: Star },
    { label: 'Member Since', value: 'Jan 2025', icon: Calendar },
  ];

  // Before & After Gallery - 30 day retention
  const beforeAfterGallery: BeforeAfterEntry[] = [
    { id: 'ba1', date: 'Mar 5, 2025', location: 'Level 3 - Open Office', daysRemaining: 25, before: '📸', after: '📸' },
    { id: 'ba2', date: 'Mar 1, 2025', location: 'Lobby Area', daysRemaining: 29, before: '📸', after: '📸' },
    { id: 'ba3', date: 'Feb 24, 2025', location: 'Conference Room', daysRemaining: 30, before: '📸', after: '📸' },
    { id: 'ba4', date: 'Feb 18, 2025', location: 'Executive Office', daysRemaining: 26, before: '📸', after: '📸' },
    { id: 'ba5', date: 'Feb 12, 2025', location: 'Break Room', daysRemaining: 20, before: '📸', after: '📸' },
  ];

  const handleSaveProfile = () => {
    setProfile(editProfile);
    setShowProfileEdit(false);
    addNotification('Profile updated successfully!', 'success');
  };

  const handleRateJob = (jobId: string, rating: number, subcontractor: string) => {
    addNotification(`You rated this job ${rating}/5 stars. Thank you for your feedback!`, 'success');
    if (rating < 3.5) {
      addNotification(`Low rating detected. RESET team will review and assign a new team for future jobs.`, 'info');
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
          className="flex items-center justify-between mb-12"
        >
          <div>
            <h1 className="text-5xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400">{profile.company} - Member since January 2025</p>
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative w-12 h-12 rounded-full glass flex items-center justify-center cursor-pointer"
          >
            <Bell className="w-6 h-6 text-reset-green" />
            {notifications.length > 0 && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-reset-green text-black rounded-full flex items-center justify-center text-xs font-bold">
                {notifications.length}
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Stats - Navigation Shortcuts */}
        <div className="mb-8 flex flex-wrap gap-2 justify-center lg:justify-start">
          <button onClick={() => document.getElementById('jobs-section')?.scrollIntoView({ behavior: 'smooth' })} className="px-4 py-2 text-sm bg-reset-green/20 text-reset-green rounded-lg hover:bg-reset-green/30 transition-colors font-semibold">
            Jobs in Progress
          </button>
          <button onClick={() => document.getElementById('completed-section')?.scrollIntoView({ behavior: 'smooth' })} className="px-4 py-2 text-sm bg-reset-green/20 text-reset-green rounded-lg hover:bg-reset-green/30 transition-colors font-semibold">
            Completed Jobs
          </button>
          <button onClick={() => document.getElementById('gallery-section')?.scrollIntoView({ behavior: 'smooth' })} className="px-4 py-2 text-sm bg-reset-green/20 text-reset-green rounded-lg hover:bg-reset-green/30 transition-colors font-semibold">
            Gallery
          </button>
          <button onClick={() => document.getElementById('reports-section')?.scrollIntoView({ behavior: 'smooth' })} className="px-4 py-2 text-sm bg-reset-green/20 text-reset-green rounded-lg hover:bg-reset-green/30 transition-colors font-semibold">
            Reports
          </button>
        </div>

        {/* Stats - KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="p-4 rounded-xl glass"
              >
                <div className="flex flex-col items-center lg:items-start gap-2 lg:justify-between lg:flex-row">
                  <div>
                    <p className="text-gray-400 text-xs lg:text-sm mb-1 text-center lg:text-left">{stat.label}</p>
                    <p className="text-lg lg:text-2xl font-bold text-white text-center lg:text-left">{stat.value}</p>
                  </div>
                  <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-reset-green flex-shrink-0" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Ongoing Jobs */}
            <motion.div
              id="jobs-section"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="p-6 lg:p-8 rounded-xl glass"
            >
              <h2 className="text-xl lg:text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-reset-green" />
                Jobs in Progress
              </h2>
              <div className="space-y-4 lg:space-y-6">
                {ongoingJobs.map((job) => (
                  <div key={job.id} className="p-4 lg:p-6 border border-reset-green/20 rounded-lg">
                    <div className="mb-4">
                      <h3 className="font-bold text-white text-base lg:text-lg mb-2">{job.type}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-400 mb-2">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-reset-green flex-shrink-0" />
                          <span>{job.location}</span>
                        </div>
                        <span className="hidden sm:inline text-gray-500">•</span>
                        <span className="text-xs text-gray-500">Est. {job.estimatedHours}h</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-gray-400">Progress</p>
                        <p className="text-xs font-bold text-reset-green">{job.progress}%</p>
                      </div>
                      <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-reset-green transition-all duration-500"
                          style={{ width: `${job.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Assigned Team - More Visible on Mobile */}
                    <div className="mb-4 p-3 bg-reset-green/10 rounded">
                      <p className="text-xs text-gray-400 mb-1">Assigned Team</p>
                      <p className="font-bold text-reset-green text-sm">{job.subcontractor}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Completed Jobs with Ratings */}
            <motion.div
              id="completed-section"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="p-6 lg:p-8 rounded-xl glass"
            >
              <h2 className="text-xl lg:text-2xl font-bold text-white mb-6">Completed Jobs</h2>
              <div className="space-y-4">
                {completedJobs.map((job) => (
                  <div key={job.id} className="p-4 border border-reset-green/20 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-white mb-1">{job.type}</h3>
                        <p className="text-sm text-gray-400">{job.location} • {job.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-reset-green mb-1">Avg Rating</p>
                        <p className="text-lg text-reset-green">⭐ {job.rating}</p>
                      </div>
                    </div>
                    {/* Rating Stars - Allow re-rating */}
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-gray-400">Rate this job:</p>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleRateJob(job.id, star, 'Pro Services Team')}
                            className="text-lg hover:text-reset-green transition-colors cursor-pointer"
                          >
                            ⭐
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Before & After Gallery - 30 Day Archive */}
            <motion.div
              id="gallery-section"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="p-6 lg:p-8 rounded-xl glass"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-3">
                <h2 className="text-xl lg:text-2xl font-bold text-white flex items-center gap-2">
                  <Camera className="w-5 h-5 lg:w-6 lg:h-6 text-reset-green" />
                  Before & After Gallery
                </h2>
                <div className="text-xs bg-reset-green/20 text-reset-green px-3 py-1 rounded-full w-fit">
                  30 Day Archive
                </div>
              </div>
              <div className="space-y-4">
                {beforeAfterGallery.map((entry) => (
                  <motion.div
                    key={entry.id}
                    whileHover={{ backgroundColor: 'rgba(58, 158, 104, 0.05)' }}
                    className="p-4 border border-reset-green/20 rounded-lg transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-white mb-1">{entry.location}</h3>
                        <p className="text-sm text-gray-400">{entry.date}</p>
                      </div>
                      <div className={`text-xs px-3 py-1 rounded-full ${
                        entry.daysRemaining > 7
                          ? 'bg-reset-green/20 text-reset-green'
                          : 'bg-orange-500/20 text-orange-400'
                      }`}>
                        {entry.daysRemaining} days remaining
                      </div>
                    </div>

                    {/* Before & After Images */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-bold text-gray-400 mb-2">BEFORE</p>
                        <div className="aspect-square bg-gradient-to-br from-red-500/20 to-red-600/10 rounded-lg flex items-center justify-center cursor-pointer hover:from-red-500/30 transition-colors group relative">
                          <span className="text-4xl">{entry.before}</span>
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/50 rounded-lg flex items-center justify-center transition-opacity text-xs text-gray-300 font-bold">
                            View Full Size
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 mb-2">AFTER</p>
                        <div className="aspect-square bg-gradient-to-br from-reset-green/20 to-reset-green/10 rounded-lg flex items-center justify-center cursor-pointer hover:from-reset-green/30 transition-colors group relative">
                          <span className="text-4xl">{entry.after}</span>
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/50 rounded-lg flex items-center justify-center transition-opacity text-xs text-gray-300 font-bold">
                            View Full Size
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-xs text-blue-300">
                  ℹ️ Before & After photos are archived for 30 days. After this period, they will be automatically removed to protect your privacy and storage space.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="p-6 rounded-xl glass"
            >
              <div className="w-16 h-16 bg-reset-green/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-reset-green" />
              </div>
              <h3 className="text-lg font-bold text-white text-center mb-2">{profile.company}</h3>
              <p className="text-xs text-gray-400 text-center mb-4">{profile.industry} • {profile.squareFeet}</p>
              <button
                onClick={() => {
                  setEditProfile(profile);
                  setShowProfileEdit(true);
                }}
                className="w-full py-2 text-sm text-white bg-reset-green/10 border border-reset-green rounded hover:bg-reset-green/20 transition-colors font-bold"
              >
                Edit Profile
              </button>
            </motion.div>

            {/* Monthly Reports */}
            <motion.div
              id="reports-section"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="p-6 rounded-xl glass"
            >
              <h3 className="text-base lg:text-lg font-bold text-white mb-4">Monthly Reports</h3>
              <div className="space-y-3">
                {monthlyReports.map((report, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ backgroundColor: 'rgba(58, 158, 104, 0.1)' }}
                    className="p-4 rounded border border-reset-green/20 hover:border-reset-green/50 transition-colors cursor-pointer"
                  >
                    <div className="mb-3">
                      <p className="font-bold text-white text-sm mb-2">{report.month}</p>
                      <div className="space-y-1 text-xs text-gray-400">
                        <div className="flex justify-between">
                          <span>Jobs Completed:</span>
                          <span className="text-reset-green font-bold">{report.jobsCompleted}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Spent:</span>
                          <span className="text-reset-green font-bold">{report.totalSpent}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg Rating:</span>
                          <span className="text-reset-green font-bold">⭐ {report.averageRating}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Efficiency:</span>
                          <span className="text-reset-green font-bold">{report.cleaningEfficiency}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => addNotification(`Downloading ${report.filename}...`, 'info')}
                      className="w-full py-2 text-xs bg-reset-green/20 text-reset-green rounded hover:bg-reset-green/30 transition-colors font-bold flex items-center justify-center gap-2"
                    >
                      <Download size={14} />
                      Download Report
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="p-6 rounded-xl glass"
            >
              <button
                onClick={() => addNotification('Support request sent! Our team will respond within 1 hour.', 'success')}
                className="w-full flex items-center justify-center gap-2 py-3 bg-reset-green text-black rounded-lg hover:bg-reset-green/80 transition-colors font-bold mb-3"
              >
                <MessageSquare size={18} />
                Contact Support
              </button>
              <Link
                href="/"
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-reset-green text-reset-green rounded-lg hover:bg-reset-green/10 transition-colors font-bold"
              >
                <LogOut size={18} />
                Logout
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Profile Edit Modal */}
      <AnimatePresence>
        {showProfileEdit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 pt-20"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-black border border-reset-green/20 rounded-xl p-8 max-w-md w-full mx-4"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Edit Profile</h2>
              <div className="space-y-4">
                {Object.entries(editProfile).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-bold text-gray-400 mb-2 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <input
                      type="text"
                      value={value as string}
                      onChange={(e) => setEditProfile({ ...editProfile, [key]: e.target.value })}
                      className="w-full px-4 py-2 rounded bg-white/5 border border-reset-green/30 text-white placeholder-gray-500 focus:border-reset-green focus:outline-none"
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setShowProfileEdit(false)}
                  className="flex-1 py-2 border border-reset-green text-reset-green rounded hover:bg-reset-green/10 transition-colors font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 py-2 bg-reset-green text-black rounded hover:bg-reset-green/80 transition-colors font-bold"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
