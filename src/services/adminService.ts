import {
  db,
  collection,
  doc,
  updateDoc,
  deleteDoc,
  query,
  limit,
  onSnapshot,
  getFriendlyFirebaseErrorMessage,
} from '../lib/firebase';
import { User, VerificationStatus, CampusItem } from '../types';

/**
 * Admin action: verify or reject student verification request
 */
export async function adminVerifyStudentInFirestore(
  userId: string,
  status: VerificationStatus
): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      verificationStatus: status,
      verifiedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to update student verification:', error);
    throw new Error(getFriendlyFirebaseErrorMessage(error));
  }
}

/**
 * Admin action: toggle user suspension
 */
export async function adminToggleSuspendUserInFirestore(
  userId: string,
  isSuspended: boolean
): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      isSuspended: !isSuspended,
      suspendedAt: !isSuspended ? new Date().toISOString() : null,
    });
  } catch (error) {
    console.error('Failed to toggle user suspension:', error);
    throw new Error(getFriendlyFirebaseErrorMessage(error));
  }
}

/**
 * Admin action: delete inappropriate listing from Firestore
 */
export async function adminDeleteListingFromFirestore(
  itemId: string,
  type: 'lost' | 'found'
): Promise<void> {
  try {
    const targetColl = type === 'lost' ? 'lostItems' : 'foundItems';
    await deleteDoc(doc(db, targetColl, itemId));
  } catch (error) {
    console.error('Failed to remove listing as admin:', error);
    throw new Error(getFriendlyFirebaseErrorMessage(error));
  }
}

/**
 * Subscribe to all users (for admin panel)
 */
export function subscribeToAllUsers(
  callback: (users: User[]) => void
) {
  const q = query(collection(db, 'users'), limit(100));
  return onSnapshot(
    q,
    (snap) => {
      const list: User[] = [];
      snap.forEach((d) => {
        const data = d.data();
        list.push({
          id: d.id,
          fullName: data.fullName || 'Student',
          email: data.email || '',
          phoneNumber: data.phone || data.phoneNumber || '',
          university: data.university || 'University of Lagos',
          faculty: data.faculty || 'Faculty of Science',
          department: data.department || 'Computer Science',
          level: data.level || '100 Level',
          matricNumber: data.matricNumber || '',
          role: data.role || 'student',
          verificationStatus: data.verificationStatus || 'pending',
          studentIdCardUrl: data.studentIdCardUrl,
          isSuspended: data.isSuspended,
          createdAt: data.createdAt || new Date().toISOString(),
        });
      });
      callback(list);
    },
    (err) => console.warn('Users sync notice for admin:', err)
  );
}
