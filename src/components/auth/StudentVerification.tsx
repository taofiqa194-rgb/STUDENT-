import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Clock, CheckCircle2, XCircle, Upload, School, AlertCircle, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UNIVERSITIES } from '../../data/mockData';

export const StudentVerification: React.FC = () => {
  const { currentUser, submitStudentVerification, setActiveTab } = useApp();

  const [faculty, setFaculty] = useState(currentUser.faculty || 'Faculty of Science');
  const [department, setDepartment] = useState(currentUser.department || 'Computer Science');
  const [level, setLevel] = useState(currentUser.level || '300 Level');
  const [matricNumber, setMatricNumber] = useState(currentUser.matricNumber || '');
  const [idCardFile, setIdCardFile] = useState<File | null>(null);
  const [idCardPreview, setIdCardPreview] = useState<string>(currentUser.studentIdCardUrl || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedToast, setSubmittedToast] = useState(false);

  const currentUniObj =
    UNIVERSITIES.find((u) => u.name === currentUser.university) || UNIVERSITIES[0];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIdCardFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdCardPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitStudentVerification({
        faculty,
        department,
        level,
        matricNumber,
        idCardFileOrUrl: idCardFile || undefined,
      });
      setSubmittedToast(true);
      setTimeout(() => setSubmittedToast(false), 3000);
    } catch (err) {
      console.warn('Verification submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = () => {
    switch (currentUser.verificationStatus) {
      case 'verified':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 text-xs font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>🟢 Verified Student Account</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 text-xs font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>🔴 Verification Rejected</span>
          </div>
        );
      case 'pending':
      default:
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 text-xs font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span>🟡 Verification Pending Admin Review</span>
          </div>
        );
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 md:p-6 pb-28">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setActiveTab('home')}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
            Verify Your Student Account
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Official identity check for campus security and safe community exchanges.
          </p>
        </div>
      </div>

      {/* Status Card */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm mb-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Current Verification Status
              </p>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
                {currentUser.fullName}
              </h3>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        {currentUser.verificationStatus === 'pending' && (
          <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
            <p className="font-semibold mb-0.5">Under Review by Campus Administrators</p>
            Your matriculation credentials are queued for verification by the Dean of Student Affairs / Student Services desk. You can still use the app in standard mode.
          </div>
        )}

        {currentUser.verificationStatus === 'verified' && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
            <p className="font-semibold mb-0.5">Verified Campus Member</p>
            Your account is confirmed for {currentUser.university}. You have full badges on all lost &amp; found reports.
          </div>
        )}

        {currentUser.verificationStatus === 'rejected' && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40 text-xs text-rose-800 dark:text-rose-300 leading-relaxed">
            <p className="font-semibold mb-0.5">Verification Rejected</p>
            The matriculation number provided did not match the faculty database. Please update your details below and re-submit.
          </div>
        )}
      </div>

      {/* Form */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
          Student Information &amp; Matric Record
        </h3>

        {submittedToast && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Verification submission updated! Administrators notified.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              University
            </label>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium">
              <School className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{currentUser.university}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Faculty
              </label>
              <select
                id="verify-faculty"
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs focus:ring-2 focus:ring-emerald-500 outline-hidden"
              >
                {currentUniObj.faculties.map((f) => (
                  <option key={f.name} value={f.name}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Department
              </label>
              <input
                id="verify-dept"
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Computer Science"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs focus:ring-2 focus:ring-emerald-500 outline-hidden"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Academic Level
              </label>
              <select
                id="verify-level"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs focus:ring-2 focus:ring-emerald-500 outline-hidden"
              >
                <option value="100 Level">100 Level</option>
                <option value="200 Level">200 Level</option>
                <option value="300 Level">300 Level</option>
                <option value="400 Level">400 Level</option>
                <option value="500 Level">500 Level</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Matric Number
              </label>
              <input
                id="verify-matric"
                type="text"
                value={matricNumber}
                onChange={(e) => setMatricNumber(e.target.value)}
                placeholder="e.g. 190408042"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs focus:ring-2 focus:ring-emerald-500 outline-hidden font-mono"
                required
              />
            </div>
          </div>

          {/* ID Card Upload with Real Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Student ID Card or Admission Letter (Optional Photo Proof)
            </label>
            <label className="relative block border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {idCardPreview ? (
                <div className="flex flex-col items-center gap-2">
                  <img
                    src={idCardPreview}
                    alt="ID Preview"
                    className="max-h-32 rounded-lg object-contain border border-slate-200 dark:border-slate-700"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    Click to change selected photo
                  </span>
                </div>
              ) : (
                <>
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Click or drag your Student ID card image
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG up to 5MB</p>
                </>
              )}
            </label>
          </div>

          <button
            id="verify-submit-btn"
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-99 text-white font-semibold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Submitting Verification...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Submit for Verification</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
