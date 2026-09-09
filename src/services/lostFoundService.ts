import {
  db,
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  uploadFileToStorage,
  getFriendlyFirebaseErrorMessage,
} from '../lib/firebase';
import {
  CampusItem,
  ItemType,
  ItemCategory,
  PossibleMatch,
  ChatMessage,
} from '../types';

/**
 * Report a lost or found item to Firestore with Firebase Storage image upload
 */
export async function reportCampusItemToFirestore(
  userId: string,
  userUniversity: string,
  data: {
    type: ItemType;
    title: string;
    category: ItemCategory;
    description: string;
    location: string;
    dateTime: string;
    imageFileOrUrl?: File | string;
    additionalDetails?: string;
    reward?: number;
    safeHandoverPoint?: string;
    verificationQuestion?: string;
    contactPreference?: 'chat' | 'whatsapp';
  }
): Promise<CampusItem> {
  try {
    const targetCollection = data.type === 'lost' ? 'lostItems' : 'foundItems';
    const itemDocRef = doc(collection(db, targetCollection));
    const nowIso = new Date().toISOString();

    let uploadedImageUrl = '';
    if (data.imageFileOrUrl) {
      const storagePath = `${data.type === 'lost' ? 'lost_items' : 'found_items'}/${itemDocRef.id}_${Date.now()}`;
      uploadedImageUrl = await uploadFileToStorage(storagePath, data.imageFileOrUrl);
    } else {
      // Clean fallback image based on category
      uploadedImageUrl =
        data.category === 'Electronics' || data.category === 'Laptop' || data.category === 'Phone'
          ? 'https://images.unsplash.com/photo-1611117775350-ac3950990985?w=500&auto=format&fit=crop&q=80'
          : data.category === 'Backpack' || data.category === 'Bags'
          ? 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80'
          : data.category === 'Keys'
          ? 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=500&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500&auto=format&fit=crop&q=80';
    }

    const newItem: CampusItem = {
      id: itemDocRef.id,
      userId,
      type: data.type,
      title: data.title.trim(),
      category: data.category,
      description: data.description.trim(),
      location: data.location.trim(),
      dateTime: data.dateTime || 'Recently',
      imageUrl: uploadedImageUrl,
      additionalDetails: data.additionalDetails,
      university: userUniversity,
      status: 'active',
      reward: data.reward ? Number(data.reward) : undefined,
      safeHandoverPoint: data.safeHandoverPoint || 'Campus Security Gate',
      verificationQuestion: data.verificationQuestion || '',
      contactPreference: data.contactPreference || 'chat',
      createdAt: nowIso,
    };

    await setDoc(itemDocRef, newItem);

    // Also run match check against opposite collection
    try {
      await runSmartMatchingForNewItem(newItem);
    } catch (matchErr) {
      console.warn('Smart matching evaluation warning:', matchErr);
    }

    return newItem;
  } catch (error) {
    console.error('Failed to report item to Firestore:', error);
    throw new Error(getFriendlyFirebaseErrorMessage(error));
  }
}

/**
 * Run smart match algorithm and write matches to Firestore
 */
async function runSmartMatchingForNewItem(newItem: CampusItem): Promise<void> {
  const oppositeCollection = newItem.type === 'lost' ? 'foundItems' : 'lostItems';
  const q = query(
    collection(db, oppositeCollection),
    where('status', '==', 'active'),
    limit(30)
  );
  const snap = await getDocs(q);

  const titleWords = newItem.title.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
  const locLower = newItem.location.toLowerCase();

  for (const docSnap of snap.docs) {
    const oppItem = docSnap.data() as CampusItem;
    const oppTitle = oppItem.title.toLowerCase();
    const oppLoc = oppItem.location.toLowerCase();

    const categoryMatch = oppItem.category === newItem.category;
    const titleMatch = titleWords.some((w) => oppTitle.includes(w));
    const locMatch = oppLoc.includes(locLower) || locLower.includes(oppLoc);

    if (categoryMatch || titleMatch) {
      const score = (categoryMatch ? 50 : 0) + (titleMatch ? 30 : 0) + (locMatch ? 20 : 0);
      if (score >= 60) {
        const lostId = newItem.type === 'lost' ? newItem.id : oppItem.id;
        const foundId = newItem.type === 'found' ? newItem.id : oppItem.id;

        const matchDocRef = doc(collection(db, 'matches'));
        const matchData: PossibleMatch = {
          id: matchDocRef.id,
          lostItemId: lostId,
          foundItemId: foundId,
          score,
          reason: `${categoryMatch ? 'Category matches (' + newItem.category + ')' : ''} ${locMatch ? '• Similar location (' + newItem.location + ')' : ''}`.trim(),
          status: 'pending',
          createdAt: new Date().toISOString(),
        };

        await setDoc(matchDocRef, matchData);

        // Add in-app notification for the seeker
        const seekerId = newItem.type === 'lost' ? newItem.userId : oppItem.userId;
        const notifDocRef = doc(collection(db, 'notifications'));
        await setDoc(notifDocRef, {
          id: notifDocRef.id,
          userId: seekerId,
          type: 'match',
          title: '🔍 Possible Lost & Found Match!',
          message: `A report for "${newItem.title}" closely matches an item in ${newItem.location}.`,
          isRead: false,
          timestamp: new Date().toISOString(),
          relatedId: matchDocRef.id,
          linkTab: 'lost-found',
          createdAt: new Date().toISOString(),
        });
      }
    }
  }
}

/**
 * Update item status in Firestore
 */
export async function updateItemStatusInFirestore(
  itemId: string,
  type: ItemType,
  status: 'active' | 'resolved' | 'matched' | 'lost' | 'found' | 'verifying'
): Promise<void> {
  try {
    const targetColl = type === 'lost' ? 'lostItems' : 'foundItems';
    await updateDoc(doc(db, targetColl, itemId), {
      status,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to update item status:', error);
    throw new Error(getFriendlyFirebaseErrorMessage(error));
  }
}

/**
 * Delete campus item from Firestore
 */
export async function deleteCampusItemFromFirestore(
  itemId: string,
  type: ItemType
): Promise<void> {
  try {
    const targetColl = type === 'lost' ? 'lostItems' : 'foundItems';
    await deleteDoc(doc(db, targetColl, itemId));
  } catch (error) {
    console.error('Failed to delete item:', error);
    throw new Error(getFriendlyFirebaseErrorMessage(error));
  }
}

/**
 * Subscribe to all lost and found items from Firestore
 */
export function subscribeToCampusItems(
  callback: (items: CampusItem[]) => void
) {
  let lostItemsList: CampusItem[] = [];
  let foundItemsList: CampusItem[] = [];

  const updateCombined = () => {
    const combined = [...lostItemsList, ...foundItemsList];
    combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    callback(combined);
  };

  const unsubLost = onSnapshot(
    query(collection(db, 'lostItems'), limit(100)),
    (snapshot) => {
      lostItemsList = [];
      snapshot.forEach((docSnap) => {
        lostItemsList.push({ ...docSnap.data(), id: docSnap.id, type: 'lost' } as CampusItem);
      });
      updateCombined();
    },
    (err) => console.warn('Lost items sync notice:', err)
  );

  const unsubFound = onSnapshot(
    query(collection(db, 'foundItems'), limit(100)),
    (snapshot) => {
      foundItemsList = [];
      snapshot.forEach((docSnap) => {
        foundItemsList.push({ ...docSnap.data(), id: docSnap.id, type: 'found' } as CampusItem);
      });
      updateCombined();
    },
    (err) => console.warn('Found items sync notice:', err)
  );

  return () => {
    unsubLost();
    unsubFound();
  };
}

/**
 * Subscribe to matches
 */
export function subscribeToMatches(
  callback: (matches: PossibleMatch[]) => void
) {
  const q = query(collection(db, 'matches'), limit(50));
  return onSnapshot(
    q,
    (snap) => {
      const list: PossibleMatch[] = [];
      snap.forEach((docSnap) => {
        list.push({ ...docSnap.data(), id: docSnap.id } as PossibleMatch);
      });
      callback(list);
    },
    (err) => console.warn('Matches sync notice:', err)
  );
}

/**
 * Send safe in-app message
 */
export async function sendMessageToFirestore(
  senderId: string,
  receiverId: string,
  conversationId: string,
  text: string,
  itemId?: string
): Promise<ChatMessage> {
  try {
    const msgDocRef = doc(collection(db, 'messages'));
    const nowIso = new Date().toISOString();
    const newMsg: ChatMessage = {
      id: msgDocRef.id,
      senderId,
      receiverId,
      text: text.trim(),
      timestamp: nowIso,
      isRead: false,
    };

    await setDoc(msgDocRef, {
      ...newMsg,
      conversationId,
      itemId: itemId || '',
      createdAt: nowIso,
    });

    // Notify receiver
    const notifDocRef = doc(collection(db, 'notifications'));
    await setDoc(notifDocRef, {
      id: notifDocRef.id,
      userId: receiverId,
      type: 'match',
      title: '💬 New Campus Message',
      message: text.slice(0, 80),
      isRead: false,
      timestamp: nowIso,
      linkTab: 'chat',
      createdAt: nowIso,
    });

    return newMsg;
  } catch (error) {
    console.error('Failed to send message:', error);
    throw new Error(getFriendlyFirebaseErrorMessage(error));
  }
}

/**
 * Subscribe to messages for a conversation
 */
export function subscribeToMessages(
  userId: string,
  callback: (messages: Record<string, ChatMessage[]>) => void
) {
  // Listen to messages where user is sender or receiver
  const q1 = query(
    collection(db, 'messages'),
    where('senderId', '==', userId),
    limit(100)
  );
  const q2 = query(
    collection(db, 'messages'),
    where('receiverId', '==', userId),
    limit(100)
  );

  let sentMsgs: (ChatMessage & { conversationId?: string })[] = [];
  let recvMsgs: (ChatMessage & { conversationId?: string })[] = [];

  const mergeAndGroup = () => {
    const all = [...sentMsgs, ...recvMsgs];
    const grouped: Record<string, ChatMessage[]> = {};

    for (const m of all) {
      const convId = m.conversationId || (m.senderId === userId ? m.receiverId : m.senderId);
      if (!grouped[convId]) grouped[convId] = [];
      if (!grouped[convId].some((item) => item.id === m.id)) {
        grouped[convId].push(m);
      }
    }

    for (const key in grouped) {
      grouped[key].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }

    callback(grouped);
  };

  const unsub1 = onSnapshot(q1, (snap) => {
    sentMsgs = [];
    snap.forEach((d) => sentMsgs.push({ ...d.data(), id: d.id } as any));
    mergeAndGroup();
  });

  const unsub2 = onSnapshot(q2, (snap) => {
    recvMsgs = [];
    snap.forEach((d) => recvMsgs.push({ ...d.data(), id: d.id } as any));
    mergeAndGroup();
  });

  return () => {
    unsub1();
    unsub2();
  };
}
