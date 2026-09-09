import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Users,
  Search,
  School,
  Trash2,
  Clock,
  Filter,
  ArrowLeft,
  FileCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminDashboard: React.FC = () => {
  const {
    allUsers,
    verifyStudentAdmin,
    campusItems,
    deleteCampusItemAdmin,
    setActiveTab,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'verifications' | 'moderation'>('verifications');
  const [filterQuery, setFilterQuery] = useState('');

  const pendingStudents = allUsers.filter(
    (u) => u.verificationStatus === 'pending' || u.role !== 'admin'
  );

  const filteredStudents = pendingStudents.filter((u) => {
    if (!filterQuery) return true;
    const q = filterQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.matricNumber && u.matricNumber.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6 pb-28">
      {/* Admin Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('home')}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                Staff &amp; Dean Portal
              </span>
              <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white font-display">
                Campus Admin Dashboard
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manual matriculation student verification &amp; campus lost and found moderation
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
          <button
            onClick={() => setActiveAdminTab('verifications')}
            className={`py-1.5 px-3 text-xs font-semibold rounded-xl transition ${
              activeAdminTab === 'verifications'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            🎓 Student Verification ({pendingStudents.filter((u) => u.verificationStatus === 'pending').length} pending)
          </button>
          <button
            onClick={() => setActiveAdminTab('moderation')}
            className={`py-1.5 px-3 text-xs font-semibold rounded-xl transition ${
              activeAdminTab === 'moderation'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            🛡️ Content Moderation ({campusItems.length} items)
          </button>
        </div>
      </div>

      {/* Admin Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-xs text-slate-400 font-medium">Pending Verifications</p>
          <h3 className="text-2xl font-bold text-amber-600 mt-1 font-display">
            {allUsers.filter((u) => u.verificationStatus === 'pending').length}
          </h3>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-xs text-slate-400 font-medium">Verified Campus Students</p>
          <h3 className="text-2xl font-bold text-emerald-600 mt-1 font-display">
            {allUsers.filter((u) => u.verificationStatus === 'verified').length}
          </h3>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-xs text-slate-400 font-medium">Active Campus Reports</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 font-display">
            {campusItems.length}
          </h3>
        </div>
      </div>

      {activeAdminTab === 'verifications' ? (
        <div className="p-5 md:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="font-bold text-base text-slate-900 dark:text-white font-display">
              Student Accounts Review Queue
            </h3>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Search name or matric number..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-hidden"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredStudents.map((stu) => (
              <div
                key={stu.id}
                className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={stu.avatar}
                    alt={stu.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/20"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {stu.name}
                      </h4>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          stu.verificationStatus === 'verified'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                            : stu.verificationStatus === 'rejected'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                        }`}
                      >
                        {stu.verificationStatus}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {stu.email} • {stu.university}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-1.5 text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                      <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                        Matric: <strong>{stu.matricNumber || 'Not provided'}</strong>
                      </span>
                      {stu.department && (
                        <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                          Dept: {stu.department}
                        </span>
                      )}
                      {stu.level && (
                        <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                          {stu.level}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => verifyStudentAdmin(stu.id, 'verified')}
                    className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verify Account</span>
                  </button>
                  <button
                    onClick={() => verifyStudentAdmin(stu.id, 'rejected')}
                    className="py-1.5 px-3 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-5 md:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white font-display">
            Campus Lost &amp; Found Moderation
          </h3>
          <p className="text-xs text-slate-400">
            Ensure no prohibited items or spam posts are published to students.
          </p>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {campusItems.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm">
                        {item.type === 'lost' ? '🔴' : '🟢'}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Reported by {item.reporterName || item.reportedBy || 'Student'} • {item.location} • {item.dateTime || item.date || 'Recent'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => deleteCampusItemAdmin(item.id)}
                  className="py-1.5 px-2.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg flex items-center gap-1 transition"
                  title="Remove item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Post</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
