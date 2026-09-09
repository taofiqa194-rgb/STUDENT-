import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateAuthProfile,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  uploadFileToStorage,
  getFriendlyFirebaseErrorMessage,
  FirebaseUser,
} from '../lib/firebase';
import { User, UserRole, VerificationStatus, InstitutionType } from '../types';

export interface CompleteProfileData {
  fullName: string;
  photoURL?: string;
  institution: string;
  institutionType: InstitutionType;
  course: string;
  department: string;
  level: string;
  phone?: string;
  matricNumber?: string;
}

export interface RegisterStudentData {
  fullName: string;
  email: string;
  password?: string;
  phone?: string;
  university?: string;
  institution?: string;
  institutionType?: InstitutionType;
  course?: string;
  faculty?: string;
  department?: string;
  level?: string;
  matricNumber?: string;
  avatarUrl?: string;
}

/**
 * Format Firestore document data into strongly-typed User object
 */
export function formatUserFromDoc(uid: string, data: Record<string, any>, fbUser?: FirebaseUser | null): User {
  const isTaofiqAdmin = (data.email || fbUser?.email || '').toLowerCase() === 'taofiqa194@gmail.com';
  const role: UserRole = isTaofiqAdmin ? 'admin' : (data.role === 'admin' ? 'admin' : 'student');
  const institution = data.institution || data.university || '';
  const fullName = data.fullName || fbUser?.displayName || 'Student';
  const email = data.email || fbUser?.email || '';
  const photo = data.photoURL || data.avatarUrl || fbUser?.photoURL || '';
  const phone = data.phone || data.phoneNumber || fbUser?.phoneNumber || '';

  const isProfileComplete = Boolean(
    data.isProfileComplete ||
    (institution && data.department && data.level)
  );

  return {
    id: uid,
    uid,
    fullName,
    name: fullName,
    email,
    phoneNumber: phone,
    phone,
    university: institution || 'Tertiary Institution',
    institution: institution || 'Tertiary Institution',
    shortUni: institution.slice(0, 16),
    institutionType: data.institutionType || 'University',
    course: data.course || '',
    faculty: data.faculty || '',
    department: data.department || '',
    level: data.level || '100 Level',
    matricNumber: data.matricNumber || '',
    avatarUrl: photo,
    photoURL: photo,
    avatar: photo,
    role,
    verificationStatus: (data.verificationStatus as VerificationStatus) || 'pending',
    studentIdCardUrl: data.studentIdCardUrl,
    isSuspended: Boolean(data.isSuspended),
    isProfileComplete,
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString(),
  };
}

/**
 * Fetch a student's profile from Firestore
 */
export async function getStudentProfile(uid: string): Promise<User | null> {
  try {
    const userDocRef = doc(db, 'users', uid);
    const snap = await getDoc(userDocRef);
    if (!snap.exists()) return null;
    return formatUserFromDoc(uid, snap.data());
  } catch (error) {
    console.error('Error fetching student profile:', error);
    return null;
  }
}

/**
 * Sign up with Email & Password
 * Does NOT require school email (personal email accepted).
 */
export async function registerWithEmail(
  fullName: string,
  email: string,
  password: string
): Promise<{ user: User; firebaseUser: FirebaseUser; isNewUser: boolean }> {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );
    const fbUser = userCredential.user;

    // Update display name in Firebase Auth
    await updateAuthProfile(fbUser, {
      displayName: fullName.trim(),
    });

    const nowIso = new Date().toISOString();
    const isTaofiq = email.trim().toLowerCase() === 'taofiqa194@gmail.com';
    const role: UserRole = isTaofiq ? 'admin' : 'student';

    const profileData = {
      uid: fbUser.uid,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      photoURL: '',
      phone: '',
      institution: '',
      institutionType: 'University',
      course: '',
      department: '',
      level: '',
      role,
      verificationStatus: 'pending',
      isProfileComplete: false,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    await setDoc(doc(db, 'users', fbUser.uid), profileData);

    const userObj = formatUserFromDoc(fbUser.uid, profileData, fbUser);
    return { user: userObj, firebaseUser: fbUser, isNewUser: true };
  } catch (error) {
    console.error('Email registration failed:', error);
    throw new Error(getFriendlyFirebaseErrorMessage(error));
  }
}

/**
 * Compatibility wrapper for registerStudentWithFirebase
 */
export async function registerStudentWithFirebase(
  data: RegisterStudentData
): Promise<{ user: User; firebaseUser: FirebaseUser }> {
  if (data.password) {
    const res = await registerWithEmail(data.fullName, data.email, data.password);
    if (data.university || data.department || data.phone) {
      await completeStudentProfile(res.firebaseUser.uid, {
        fullName: data.fullName,
        institution: data.university || data.institution || 'Tertiary Institution',
        institutionType: data.institutionType || 'University',
        course: data.course || '',
        department: data.department || '',
        level: data.level || '100 Level',
        phone: data.phone,
        matricNumber: data.matricNumber,
      });
      const updated = await getStudentProfile(res.firebaseUser.uid);
      if (updated) return { user: updated, firebaseUser: res.firebaseUser };
    }
    return { user: res.user, firebaseUser: res.firebaseUser };
  }
  throw new Error('Password is required for registration.');
}

/**
 * Log in student with email & password
 */
export async function loginStudentWithFirebase(
  email: string,
  password: string
): Promise<{ user: User; firebaseUser: FirebaseUser }> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
    const fbUser = cred.user;

    const userDocRef = doc(db, 'users', fbUser.uid);
    const userSnap = await getDoc(userDocRef);

    let userProfile: User;
    if (userSnap.exists()) {
      userProfile = formatUserFromDoc(fbUser.uid, userSnap.data(), fbUser);
    } else {
      // Create initial document
      const nowIso = new Date().toISOString();
      const isTaofiq = (fbUser.email || '').toLowerCase() === 'taofiqa194@gmail.com';
      const initialDoc = {
        uid: fbUser.uid,
        fullName: fbUser.displayName || 'Student',
        email: fbUser.email || '',
        photoURL: fbUser.photoURL || '',
        phone: fbUser.phoneNumber || '',
        institution: '',
        institutionType: 'University',
        course: '',
        department: '',
        level: '',
        role: isTaofiq ? 'admin' : 'student',
        verificationStatus: 'pending',
        isProfileComplete: false,
        createdAt: nowIso,
        updatedAt: nowIso,
      };
      await setDoc(userDocRef, initialDoc);
      userProfile = formatUserFromDoc(fbUser.uid, initialDoc, fbUser);
    }

    return { user: userProfile, firebaseUser: fbUser };
  } catch (error) {
    console.error('Login failed:', error);
    throw new Error(getFriendlyFirebaseErrorMessage(error));
  }
}

/**
 * Sign in with Google (Requirement 1: Continue with Google)
 * Authenticates, creates profile if new, or loads profile if existing.
 */
export async function loginWithGoogle(): Promise<{ user: User; firebaseUser: FirebaseUser; isNewUser: boolean }> {
  try {
    const cred = await signInWithPopup(auth, googleProvider);
    const fbUser = cred.user;

    const userDocRef = doc(db, 'users', fbUser.uid);
    const userSnap = await getDoc(userDocRef);

    let userProfile: User;
    let isNewUser = false;

    if (userSnap.exists()) {
      const data = userSnap.data();
      userProfile = formatUserFromDoc(fbUser.uid, data, fbUser);
      // Profile is considered complete only if required academic fields are filled
      isNewUser = !userProfile.isProfileComplete;
    } else {
      isNewUser = true;
      const nowIso = new Date().toISOString();
      const isTaofiq = (fbUser.email || '').toLowerCase() === 'taofiqa194@gmail.com';
      const newDoc = {
        uid: fbUser.uid,
        fullName: fbUser.displayName || 'Student',
        email: fbUser.email || '',
        photoURL: fbUser.photoURL || '',
        phone: fbUser.phoneNumber || '',
        institution: '',
        institutionType: 'University',
        course: '',
        department: '',
        level: '',
        role: isTaofiq ? 'admin' : 'student',
        verificationStatus: 'pending',
        isProfileComplete: false,
        createdAt: nowIso,
        updatedAt: nowIso,
      };

      await setDoc(userDocRef, newDoc);
      userProfile = formatUserFromDoc(fbUser.uid, newDoc, fbUser);
    }

    return { user: userProfile, firebaseUser: fbUser, isNewUser };
  } catch (error) {
    console.error('Google Sign In failed:', error);
    throw new Error(getFriendlyFirebaseErrorMessage(error));
  }
}

/**
 * Complete or save student profile in Firestore
 * (Requirement 2: Complete Your Student Profile)
 */
export async function completeStudentProfile(
  uid: string,
  data: CompleteProfileData
): Promise<User> {
  try {
    const userDocRef = doc(db, 'users', uid);
    const nowIso = new Date().toISOString();

    const updates: Record<string, any> = {
      fullName: data.fullName.trim(),
      institution: data.institution.trim(),
      university: data.institution.trim(), // sync alias
      institutionType: data.institutionType,
      course: data.course.trim(),
      department: data.department.trim(),
      level: data.level,
      isProfileComplete: true,
      updatedAt: nowIso,
    };

    if (data.phone) {
      updates.phone = data.phone.trim();
      updates.phoneNumber = data.phone.trim();
    }

    if (data.matricNumber) {
      updates.matricNumber = data.matricNumber.trim();
    }

    if (data.photoURL) {
      updates.photoURL = data.photoURL;
      updates.avatarUrl = data.photoURL;
    }

    await setDoc(userDocRef, updates, { merge: true });

    const snap = await getDoc(userDocRef);
    return formatUserFromDoc(uid, snap.data() || updates);
  } catch (error) {
    console.error('Complete profile failed:', error);
    throw new Error(getFriendlyFirebaseErrorMessage(error));
  }
}

/**
 * Send password reset email
 */
export async function sendStudentPasswordReset(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email.trim());
  } catch (error) {
    console.error('Password reset failed:', error);
    throw new Error(getFriendlyFirebaseErrorMessage(error));
  }
}

/**
 * Sign out from Firebase
 */
export async function logoutStudent(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout failed:', error);
    throw new Error(getFriendlyFirebaseErrorMessage(error));
  }
}

/**
 * Update student profile in Firestore
 */
export async function updateStudentProfile(
  uid: string,
  updates: Partial<User>
): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid);
    const firestoreUpdates: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    if (updates.fullName !== undefined) firestoreUpdates.fullName = updates.fullName;
    if (updates.phoneNumber !== undefined) {
      firestoreUpdates.phone = updates.phoneNumber;
      firestoreUpdates.phoneNumber = updates.phoneNumber;
    }
    if (updates.institution !== undefined) {
      firestoreUpdates.institution = updates.institution;
      firestoreUpdates.university = updates.institution;
    } else if (updates.university !== undefined) {
      firestoreUpdates.institution = updates.university;
      firestoreUpdates.university = updates.university;
    }
    if (updates.institutionType !== undefined) firestoreUpdates.institutionType = updates.institutionType;
    if (updates.course !== undefined) firestoreUpdates.course = updates.course;
    if (updates.faculty !== undefined) firestoreUpdates.faculty = updates.faculty;
    if (updates.department !== undefined) firestoreUpdates.department = updates.department;
    if (updates.level !== undefined) firestoreUpdates.level = updates.level;
    if (updates.matricNumber !== undefined) firestoreUpdates.matricNumber = updates.matricNumber;
    if (updates.avatarUrl !== undefined) {
      firestoreUpdates.avatarUrl = updates.avatarUrl;
      firestoreUpdates.photoURL = updates.avatarUrl;
    }
    if (updates.isProfileComplete !== undefined) firestoreUpdates.isProfileComplete = updates.isProfileComplete;
    if (updates.studentIdCardUrl !== undefined) firestoreUpdates.studentIdCardUrl = updates.studentIdCardUrl;

    await updateDoc(userRef, firestoreUpdates);
  } catch (error) {
    console.error('Profile update failed:', error);
    throw new Error(getFriendlyFirebaseErrorMessage(error));
  }
}

/**
 * Submit verification request
 */
export async function submitVerificationToFirestore(
  uid: string,
  details: {
    faculty: string;
    department: string;
    level: string;
    matricNumber: string;
    idCardFileOrUrl?: File | string;
  }
): Promise<string | undefined> {
  try {
    let idCardUrl = '';
    if (details.idCardFileOrUrl) {
      idCardUrl = await uploadFileToStorage(
        `id_cards/${uid}/${Date.now()}_idcard`,
        details.idCardFileOrUrl
      );
    }

    const userRef = doc(db, 'users', uid);
    const updatePayload: Record<string, unknown> = {
      faculty: details.faculty,
      department: details.department,
      level: details.level,
      matricNumber: details.matricNumber,
      verificationStatus: 'pending',
      verificationSubmittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (idCardUrl) {
      updatePayload.studentIdCardUrl = idCardUrl;
    }

    await updateDoc(userRef, updatePayload);
    return idCardUrl;
  } catch (error) {
    console.error('Verification submission failed:', error);
    throw new Error(getFriendlyFirebaseErrorMessage(error));
  }
}
