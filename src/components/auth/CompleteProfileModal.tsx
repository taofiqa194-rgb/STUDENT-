import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  School,
  User as UserIcon,
  BookOpen,
  Layers,
  Phone,
  Camera,
  Search,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Building2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  INSTITUTIONS,
  INSTITUTION_TYPES,
  ACADEMIC_LEVELS,
  InstitutionType,
} from '../../data/institutions';
import { uploadFileToStorage } from '../../lib/firebase';
import { compressImage } from '../../lib/imageCompressor';

interface CompleteProfileModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const CompleteProfileModal: React.FC<CompleteProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentUser, saveProfile } = useApp();

  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [phone, setPhone] = useState(currentUser?.phoneNumber || '');
  const [institutionType, setInstitutionType] = useState<InstitutionType>(
    currentUser?.institutionType || 'University'
  );
  const [institutionSearch, setInstitutionSearch] = useState(
    currentUser?.institution || currentUser?.university || ''
  );
  const [customInstitution, setCustomInstitution] = useState('');
  const [isSchoolNotListed, setIsSchoolNotListed] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const [course, setCourse] = useState(currentUser?.course || '');
  const [department, setDepartment] = useState(currentUser?.department || '');
  const [level, setLevel] = useState(currentUser?.level || '100 Level');

  const [photoPreview, setPhotoPreview] = useState<string>(
    currentUser?.avatarUrl || currentUser?.photoURL || ''
  );
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  // Filtered institution list
  const filteredInstitutions = useMemo(() => {
    const q = institutionSearch.trim().toLowerCase();
    if (!q) return INSTITUTIONS.slice(0, 8);
    return INSTITUTIONS.filter(
      (inst) =>
        inst.name.toLowerCase().includes(q) ||
        inst.shortName.toLowerCase().includes(q) ||
        (inst.state && inst.state.toLowerCase().includes(q))
    ).slice(0, 10);
  }, [institutionSearch]);

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setPhotoFile(file);
        const compressed = await compressImage(file, 600, 0.85);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotoPreview(reader.result as string);
        };
        reader.readAsDataURL(compressed);
      } catch (err) {
        console.warn('Photo processing error:', err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const finalInstitution = isSchoolNotListed
      ? customInstitution.trim()
      : institutionSearch.trim();

    if (!fullName.trim()) {
      setErrorMsg('Please provide your full name.');
      return;
    }
    if (!finalInstitution) {
      setErrorMsg('Please select or enter your school/institution name.');
      return;
    }
    if (!course.trim()) {
      setErrorMsg('Please enter your course or programme of study.');
      return;
    }
    if (!department.trim()) {
      setErrorMsg('Please enter your department.');
      return;
    }
    if (!level) {
      setErrorMsg('Please select your current academic level.');
      return;
    }

    setIsSubmitting(true);
    try {
      let finalPhotoUrl = photoPreview;

      // If user uploaded a new photo file, upload to Firebase Storage
      if (photoFile && currentUser?.id) {
        try {
          const path = `profiles/${currentUser.id}/avatar_${Date.now()}.jpg`;
          const compressedBlob = await compressImage(photoFile, 600, 0.85);
          finalPhotoUrl = await uploadFileToStorage(path, compressedBlob);
        } catch (uploadErr) {
          console.warn('Avatar upload fallback to data url:', uploadErr);
        }
      }

      await saveProfile({
        fullName: fullName.trim(),
        institution: finalInstitution,
        university: finalInstitution,
        institutionType,
        course: course.trim(),
        department: department.trim(),
        level,
        phone: phone.trim(),
        phoneNumber: phone.trim(),
        photoURL: finalPhotoUrl,
        avatarUrl: finalPhotoUrl,
        isProfileComplete: true,
      });

      setSuccessMsg(true);
      setTimeout(() => {
        setSuccessMsg(false);
        if (onClose) onClose();
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save student profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="complete-profile-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        id="complete-profile-modal"
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6 text-slate-900 dark:text-slate-100"
      >
        {/* Header */}
        <div className="p-6 md:p-8 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-xs">
              Welcome to StudentMate
            </span>
          </div>
          <h2 className="text-2xl font-extrabold font-display">
            Complete Your Student Profile
          </h2>
          <p className="text-xs text-emerald-100 mt-1 max-w-md">
            StudentMate connects students across all universities, polytechnics, and colleges. Tell us a bit about your studies.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Profile setup complete! Welcome aboard.</span>
            </div>
          )}

          {/* Profile Photo */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
            <div className="relative w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-xl overflow-hidden shadow-inner shrink-0">
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                fullName.charAt(0).toUpperCase() || '🎓'
              )}
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-900 dark:text-white">Profile Photo</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Upload a clear photo for student recognition
              </p>
              <label className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 cursor-pointer transition shadow-xs">
                <Camera className="w-3.5 h-3.5 text-emerald-500" />
                <span>Upload Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Taofiq Abdul"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>
          </div>

          {/* Institution Type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Institution Type *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {INSTITUTION_TYPES.map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setInstitutionType(type)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition text-center ${
                    institutionType === type
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* School / Institution Name */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                School / Institution Name *
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsSchoolNotListed(!isSchoolNotListed);
                  setShowDropdown(false);
                }}
                className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 transition"
              >
                {isSchoolNotListed ? '← Select from list' : "My school isn't listed"}
              </button>
            </div>

            {!isSchoolNotListed ? (
              <div className="relative">
                <School className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required={!isSchoolNotListed}
                  value={institutionSearch}
                  onFocus={() => setShowDropdown(true)}
                  onChange={(e) => {
                    setInstitutionSearch(e.target.value);
                    setShowDropdown(true);
                  }}
                  placeholder="Search your university, polytechnic or college..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />

                {showDropdown && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 z-30 max-h-52 overflow-y-auto rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl p-1.5 space-y-1">
                    {filteredInstitutions.length > 0 ? (
                      filteredInstitutions.map((inst) => (
                        <button
                          key={inst.id}
                          type="button"
                          onClick={() => {
                            setInstitutionSearch(inst.name);
                            setInstitutionType(inst.type);
                            setShowDropdown(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-emerald-50 dark:hover:bg-emerald-950/50 flex items-center justify-between transition"
                        >
                          <div>
                            <p className="font-bold text-slate-800 dark:text-slate-200">
                              {inst.name}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {inst.shortName} • {inst.type} {inst.state ? `(${inst.state})` : ''}
                            </p>
                          </div>
                          {institutionSearch === inst.name && (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="p-3 text-center text-xs text-slate-500">
                        <p>No matching school found.</p>
                        <button
                          type="button"
                          onClick={() => {
                            setIsSchoolNotListed(true);
                            setCustomInstitution(institutionSearch);
                            setShowDropdown(false);
                          }}
                          className="mt-1 text-emerald-600 font-bold hover:underline text-[11px]"
                        >
                          Click here to enter "{institutionSearch}" manually
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                  <input
                    type="text"
                    required
                    value={customInstitution}
                    onChange={(e) => setCustomInstitution(e.target.value)}
                    placeholder="Type your institution name manually..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                  />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Any school, college, polytechnic, or institute worldwide is welcome on StudentMate.
                </p>
              </div>
            )}
          </div>

          {/* Course / Programme */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Course / Programme *
            </label>
            <div className="relative">
              <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="e.g. Computer Science, Accounting, Law, Mechanical Eng."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>
          </div>

          {/* Department & Level Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Department *
              </label>
              <div className="relative">
                <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Dept of Computer Science"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Current Level *
              </label>
              <select
                required
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              >
                {ACADEMIC_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Optional Phone Number */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Phone Number (Optional)
              </label>
              <span className="text-[10px] text-slate-400">Never shared publicly</span>
            </div>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +234 812 345 6789"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              id="submit-student-profile-btn"
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/20 disabled:opacity-50 transition flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving Profile...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>Complete Profile & Enter StudentMate</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
