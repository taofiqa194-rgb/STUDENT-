import {
  auth,
  db,
  storage,
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
import { User, UserRole, VerificationStatus } from '../types';

export interface RegisterStudentData {
  fullName: string;
  email: string;
  password?: string;
  phone: string;
  university: string;
  faculty: string;
  department: string;
  level: string;
  matricNumber: string;
  avatarUrl?: string;
}

/**
 * Register student with Firebase Auth & create Firestore profile document
 */
export async function registerStudentWithFirebase(
  data: RegisterStudentData
): Promise<{ user: User; firebaseUser: FirebaseUser }> {
  try {
    const passwordToUse = data.password || 'Student@12345';
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email.trim(),
      passwordToUse
    );
    const fbUser = userCredential.user;

    // Update display name
    await updateAuthProfile(fbUser, {
      displayName: data.fullName,
      photoURL: data.avatarUrl || '',
    });

    const nowIso = new Date().toISOString();
    const newUserDoc: User = {
      id: fbUser.uid,
      fullName: data.fullName,
      email: data.email.trim().toLowerCase(),
      phoneNumber: data.phone,
      university: data.university,
      faculty: data.faculty,
      department: data.department,
      level: data.level,
      matricNumber: data.matricNumber,
      avatarUrl: data.avatarUrl || '',
      role: 'student',
      verificationStatus: 'pending',
      createdAt: nowIso,
    };

    // Save to Firestore users collection
    await setDoc(doc(db, 'users', fbUser.uid), {
      uid: fbUser.uid,
      fullName: newUserDoc.fullName,
      email: newUserDoc.email,
      phone: newUserDoc.phoneNumber,
      university: newUserDoc.university,
      matricNumber: newUserDoc.matricNumber,
      faculty: newUserDoc.faculty,
      department: newUserDoc.department,
      level: newUserDoc.level,
      verificationStatus: 'pending',
      role: 'student',
      avatarUrl: newUserDoc.avatarUrl,
      createdAt: nowIso,
    });

    return { user: newUserDoc, firebaseUser: fbUser };
  } catch (error) {
    console.error('Registration failed:', error);
    throw new Error(getFriendlyFirebaseErrorMessage(error));
  }
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

    // Fetch user profile from Firestore
    const userDocRef = doc(db, 'users', fbUser.uid);
    const userSnap = await getDoc(userDocRef);

    let userProfile: User;
    if (userSnap.exists()) {
      const d = userSnap.data();
      userProfile = {
        id: fbUser.uid,
        fullName: d.fullName || fbUser.displayName || 'Student',
        email: d.email || fbUser.email || '',
        phoneNumber: d.phone || d.phoneNumber || '',
        university: d.university || 'University of Lagos',
        faculty: d.faculty || 'Faculty of Science',
        department: d.department || 'Computer Science',
        level: d.level || '100 Level',
        matricNumber: d.matricNumber || '',
        avatarUrl: d.avatarUrl || fbUser.photoURL || '',
        role: (d.role as UserRole) || 'student',
        verificationStatus: (d.verificationStatus as VerificationStatus) || 'pending',
        studentIdCardUrl: d.studentIdCardUrl,
        createdAt: d.createdAt || new Date().toISOString(),
      };
    } else {
      // Create fallback profile
      userProfile = {
        id: fbUser.uid,
        fullName: fbUser.displayName || 'Student',
        email: fbUser.email || '',
        phoneNumber: fbUser.phoneNumber || '',
        university: 'University of Lagos',
        faculty: 'Faculty of Science',
        department: 'Computer Science',
        level: '100 Level',
        matricNumber: '',
        role: 'student',
        verificationStatus: 'pending',
        createdAt: new Date().toISOString(),
      };
      await setDoc(userDocRef, {
        uid: fbUser.uid,
        fullName: userProfile.fullName,
        email: userProfile.email,
        phone: userProfile.phoneNumber,
        university: userProfile.university,
        matricNumber: userProfile.matricNumber,
        faculty: userProfile.faculty,
        department: userProfile.department,
        level: userProfile.level,
        verificationStatus: 'pending',
        role: 'student',
        createdAt: userProfile.createdAt,
      });
    }

    return { user: userProfile, firebaseUser: fbUser };
  } catch (error) {
    console.error('Login failed:', error);
    throw new Error(getFriendlyFirebaseErrorMessage(error));
  }
}

/**
 * Sign in with Google
 */
export async function loginWithGoogle(): Promise<{ user: User; firebaseUser: FirebaseUser }> {
  try {
    const cred = await signInWithPopup(auth, googleProvider);
    const fbUser = cred.user;

    const userDocRef = doc(db, 'users', fbUser.uid);
    const userSnap = await getDoc(userDocRef);

    let userProfile: User;
    if (userSnap.exists()) {
      const d = userSnap.data();
      userProfile = {
        id: fbUser.uid,
        fullName: d.fullName || fbUser.displayName || 'Student',
        email: d.email || fbUser.email || '',
        phoneNumber: d.phone || d.phoneNumber || '',
        university: d.university || 'University of Lagos',
        faculty: d.faculty || 'Faculty of Science',
        department: d.department || 'Computer Science',
        level: d.level || '100 Level',
        matricNumber: d.matricNumber || '',
        avatarUrl: d.avatarUrl || fbUser.photoURL || '',
        role: (d.role as UserRole) || 'student',
        verificationStatus: (d.verificationStatus as VerificationStatus) || 'pending',
        studentIdCardUrl: d.studentIdCardUrl,
        createdAt: d.createdAt || new Date().toISOString(),
      };
    } else {
      userProfile = {
        id: fbUser.uid,
        fullName: fbUser.displayName || 'Student',
        email: fbUser.email || '',
        phoneNumber: fbUser.phoneNumber || '',
        university: 'University of Lagos',
        faculty: 'Faculty of Science',
        department: 'Computer Science',
        level: '100 Level',
        matricNumber: '',
        avatarUrl: fbUser.photoURL || '',
        role: 'student',
        verificationStatus: 'pending',
        createdAt: new Date().toISOString(),
      };
      await setDoc(userDocRef, {
        uid: fbUser.uid,
        fullName: userProfile.fullName,
        email: userProfile.email,
        phone: userProfile.phoneNumber,
        university: userProfile.university,
        matricNumber: userProfile.matricNumber,
        faculty: userProfile.faculty,
        department: userProfile.department,
        level: userProfile.level,
        verificationStatus: 'pending',
        role: 'student',
        avatarUrl: userProfile.avatarUrl,
        createdAt: userProfile.createdAt,
      });
    }

    return { user: userProfile, firebaseUser: fbUser };
  } catch (error) {
    console.error('Google Sign In failed:', error);
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
 * Sign out
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
    const firestoreUpdates: Record<string, unknown> = {};

    if (updates.fullName !== undefined) firestoreUpdates.fullName = updates.fullName;
    if (updates.phoneNumber !== undefined) firestoreUpdates.phone = updates.phoneNumber;
    if (updates.university !== undefined) firestoreUpdates.university = updates.university;
    if (updates.faculty !== undefined) firestoreUpdates.faculty = updates.faculty;
    if (updates.department !== undefined) firestoreUpdates.department = updates.department;
    if (updates.level !== undefined) firestoreUpdates.level = updates.level;
    if (updates.matricNumber !== undefined) firestoreUpdates.matricNumber = updates.matricNumber;
    if (updates.avatarUrl !== undefined) firestoreUpdates.avatarUrl = updates.avatarUrl;
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
