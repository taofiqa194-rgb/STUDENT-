import {
  db,
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  limit,
  onSnapshot,
  getFriendlyFirebaseErrorMessage,
  writeBatch,
} from '../lib/firebase';
import { NotificationItem } from '../types';

/**
 * Add a notification to Firestore
 */
export async function addNotificationToFirestore(
  data: Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'>
): Promise<NotificationItem> {
  try {
    const notifDocRef = doc(collection(db, 'notifications'));
    const nowIso = new Date().toISOString();
    const newNotif: NotificationItem = {
      id: notifDocRef.id,
      userId: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      isRead: false,
      timestamp: nowIso,
      relatedId: data.relatedId,
      linkTab: data.linkTab,
    };

    await setDoc(notifDocRef, {
      ...newNotif,
      createdAt: nowIso,
    });

    return newNotif;
  } catch (error) {
    console.error('Failed to add notification:', error);
    throw new Error(getFriendlyFirebaseErrorMessage(error));
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationAsReadInFirestore(
  notifId: string
): Promise<void> {
  try {
    await updateDoc(doc(db, 'notifications', notifId), {
      isRead: true,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('Failed to mark notification read:', error);
  }
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsAsReadInFirestore(
  notifications: NotificationItem[]
): Promise<void> {
  try {
    const unread = notifications.filter((n) => !n.isRead);
    if (unread.length === 0) return;

    const batch = writeBatch(db);
    unread.slice(0, 50).forEach((n) => {
      const ref = doc(db, 'notifications', n.id);
      batch.update(ref, { isRead: true });
    });
    await batch.commit();
  } catch (error) {
    console.warn('Failed to mark all notifications read:', error);
  }
}

/**
 * Subscribe to user notifications in Firestore
 */
export function subscribeToUserNotifications(
  userId: string,
  callback: (notifications: NotificationItem[]) => void
) {
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    limit(50)
  );

  return onSnapshot(
    q,
    (snap) => {
      const list: NotificationItem[] = [];
      snap.forEach((d) => {
        list.push({ ...d.data(), id: d.id } as NotificationItem);
      });
      list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      callback(list);
    },
    (err) => console.warn('Notifications sync notice:', err)
  );
}
