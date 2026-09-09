import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShieldAlert,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Flag,
  Search,
  Package,
  ArrowLeft,
  Filter,
  Check,
  Ban,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VerificationStatus } from '../../types';

export const AdminPanel: React.FC = () => {
  const {
    adminVerificationRequests,
    verifyStudentRequest,
    campusItems,
    deleteCampusItem,
    switchRole,
    setActiveTab,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'verifications' | 'items'>('verifications');
  const [filterStatus, setFilterStatus] = useState<VerificationStatus | 'all'>('all');
  const [bannedUsers, setBannedUsers] = useState<string[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  // Stats calculation
  const totalStudents = 1420;
  const verifiedStudents = 980;
  const totalItems = campusItems.length;
  const returnedItems = campusItems.filter((i) => i.status === 'resolved').length;

  const filteredVerifications = adminVerificationRequests.filter((req) => {
    if (filterStatus === 'all') return true;
    return req.verificationStatus === filterStatus;
  });

  const handleApprove = (userId: string) => {
    verifyStudentRequest(userId, 'verified');
    showToast('Student verified successfully!');
  };

  const handleReject = (userId: string) => {
    verifyStudentRequest(userId, 'rejected');
    showToast('Student verification rejected.');
  };

  const handleBanUser = (userId: string, name: string) => {
    setBannedUsers((prev) => [...prev, userId]);
    showToast(`Account for ${name} flagged and suspended.`);
  };

  const handleDeleteItem = (itemId: string, title: string) => {
    deleteCampusItem(itemId);
    showToast(`Removed listing "${title}".`);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6 pb-28">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('home')}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white font-display">
                Campus Admin Console
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                Authorized
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Student verification desk, moderation, and campus community safety
            </p>
          </div>
        </div>

        <button
          onClick={() => switchRole('student')}
          className="py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          Exit Admin Mode
        </button>
      </div>

      {/* Overview Stats Bento */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Total Registered
          </p>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-display mt-0.5">
            {totalStudents}
          </h3>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
            +18 this week
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Verified Students
          </p>
          <h3 className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-display mt-0.5">
            {verifiedStudents}
          </h3>
          <span className="text-[10px] text-slate-400">
            {Math.round((verifiedStudents / totalStudents) * 100)}% verified
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Reported Items
          </p>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-display mt-0.5">
            {totalItems}
          </h3>
          <span className="text-[10px] text-slate-400">Active listings</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Items Returned
          </p>
          <h3 className="text-xl font-extrabold text-purple-600 dark:text-purple-400 font-display mt-0.5">
            {returnedItems}
          </h3>
          <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">
            High recovery rate
          </span>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl w-fit">
        <button
          onClick={() => setActiveAdminTab('verifications')}
          className={`py-2 px-4 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 ${
            activeAdminTab === 'verifications'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Student Verifications ({adminVerificationRequests.filter((r) => r.verificationStatus === 'pending').length} pending)</span>
        </button>
        <button
          onClick={() => setActiveAdminTab('items')}
          className={`py-2 px-4 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 ${
            activeAdminTab === 'items'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Moderation &amp; Items ({campusItems.length})</span>
        </button>
      </div>

      {/* Tab Content 1: Verifications */}
      {activeAdminTab === 'verifications' && (
        <div className="p-5 md:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-bold text-base text-slate-900 dark:text-white font-display">
              Matriculation ID Verification Queue
            </h3>

            {/* Filter buttons */}
            <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
              {(['all', 'pending', 'verified', 'rejected'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`py-1 px-2.5 rounded-lg capitalize font-medium transition ${
                    filterStatus === st
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredVerifications.map((req) => {
              const isBanned = bannedUsers.includes(req.id) || req.isSuspended;

              return (
                <div
                  key={req.id}
                  className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {req.fullName}
                      </h4>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          req.verificationStatus === 'verified'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : req.verificationStatus === 'rejected'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {req.verificationStatus}
                      </span>
                      {isBanned && (
                        <span className="text-[10px] font-bold uppercase bg-rose-600 text-white px-2 py-0.5 rounded-full">
                          Suspended
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {req.university} • <strong>{req.department}</strong> ({req.level})
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                      <span>Matric: <strong>{req.matricNumber}</strong></span>
                      <span>Email: {req.email}</span>
                      <span>Submitted: {req.verificationSubmittedAt || req.createdAt}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {req.verificationStatus !== 'verified' && (
                      <button
                        onClick={() => handleApprove(req.id)}
                        className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1 shadow-xs transition"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    )}

                    {req.verificationStatus !== 'rejected' && (
                      <button
                        onClick={() => handleReject(req.id)}
                        className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl flex items-center gap-1 transition"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    )}

                    {!isBanned && (
                      <button
                        onClick={() => handleBanUser(req.id, req.fullName)}
                        className="py-1.5 px-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl text-xs transition"
                        title="Flag / Ban user"
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab Content 2: Reported Items Moderation */}
      {activeAdminTab === 'items' && (
        <div className="p-5 md:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white font-display">
              Campus Item Listings Moderation
            </h3>
            <span className="text-xs text-slate-400">
              Remove spam, inappropriate listings, or resolved posts
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {campusItems.map((item) => (
              <div
                key={item.id}
                className="py-3 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg">
                        📦
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {item.title}
                      </h4>
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                          item.type === 'lost'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950'
                        }`}
                      >
                        {item.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Reported by {item.reporterName} • {item.location} • {item.date}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteItem(item.id, item.title)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition"
                  title="Remove listing"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
