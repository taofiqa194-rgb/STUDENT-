import {
  db,
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
  limit,
  onSnapshot,
  uploadFileToStorage,
  getFriendlyFirebaseErrorMessage,
} from '../lib/firebase';
import {
  CampusItem,
  ItemType,
  ItemCategory,
  ItemStatus,
  PossibleMatch,
  ChatMessage,
} from '../types';
import { compressImage } from '../lib/imageCompressor';

export interface ReportLostItemPayload {
  itemName: string;
  category: ItemCategory;
  description: string;
  location: string;
  dateLost: string;
  timeLost?: string;
  imageFiles?: File[];
  imageUrls?: string[];
  identifyingDetails?: string;
  institution?: string;
  reward?: number;
  contactPreference?: 'chat' | 'whatsapp';
}

export interface ReportFoundItemPayload {
  itemName: string;
  category: ItemCategory;
  description: string;
  location: string;
  dateFound: string;
  timeFound?: string;
  imageFiles?: File[];
  imageUrls?: string[];
  identifyingDetails?: string;
  institution?: string;
  safeHandoverPoint?: string;
  contactPreference?: 'chat' | 'whatsapp';
}

/**
 * Upload multiple images with compression to Firebase Storage
 * Path: lost-found/{userId}/{itemId}/
 */
async function uploadItemImages(
  userId: string,
  itemId: string,
  imageFiles: File[] = []
): Promise<string[]> {
  const uploadedUrls: string[] = [];

  for (let i = 0; i < imageFiles.length; i++) {
    const file = imageFiles[i];
    try {
      const compressedBlob = await compressImage(file);
      const fileName = `${Date.now()}_img_${i + 1}.jpg`;
      const storagePath = `lost-found/${userId}/${itemId}/${fileName}`;
      const url = await uploadFileToStorage(storagePath, compressedBlob);
      if (url) {
        uploadedUrls.push(url);
      }
    } catch (err) {
      console.warn(`Failed to upload image ${i}:`, err);
    }
  }

  return uploadedUrls;
}

/**
 * Report Lost Item to Firestore
 * Collection: lostItems
 * Fields specified in Requirement 5
 */
export async function reportLostItem(
  userId: string,
  payload: ReportLostItemPayload
): Promise<CampusItem> {
  try {
    const itemDocRef = doc(collection(db, 'lostItems'));
    const itemId = itemDocRef.id;
    const nowIso = new Date().toISOString();

    // 1. Upload images to Firebase Storage
    let finalImageUrls: string[] = payload.imageUrls || [];
    if (payload.imageFiles && payload.imageFiles.length > 0) {
      const uploaded = await uploadItemImages(userId, itemId, payload.imageFiles);
      finalImageUrls = [...finalImageUrls, ...uploaded];
    }

    const primaryImageUrl = finalImageUrls[0] || '';

    // 2. Create document in Firestore under lostItems
    const lostItemDoc: Record<string, any> = {
      itemId,
      id: itemId,
      userId,
      reporterId: userId,
      itemName: payload.itemName.trim(),
      title: payload.itemName.trim(), // sync alias
      category: payload.category,
      description: payload.description.trim(),
      location: payload.location.trim(),
      dateLost: payload.dateLost,
      timeLost: payload.timeLost || '',
      date: payload.dateLost,
      dateTime: payload.timeLost ? `${payload.dateLost} ${payload.timeLost}` : payload.dateLost,
      imageUrls: finalImageUrls,
      imageUrl: primaryImageUrl,
      identifyingDetails: payload.identifyingDetails || '',
      institution: payload.institution || 'Tertiary Institution',
      university: payload.institution || 'Tertiary Institution',
      reward: payload.reward ? Number(payload.reward) : undefined,
      contactPreference: payload.contactPreference || 'chat',
      status: 'lost' as ItemStatus,
      type: 'lost' as ItemType,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    await setDoc(itemDocRef, lostItemDoc);

    const createdItem = formatItemDoc(itemId, 'lost', lostItemDoc);

    // Run matching asynchronously
    runSmartMatchingForNewItem(createdItem).catch((err) =>
      console.warn('Smart matching error:', err)
    );

    return createdItem;
  } catch (error) {
    console.error('Failed to submit lost item:', error);
    throw new Error(getFriendlyFirebaseErrorMessage(error));
  }
}

/**
 * Report Found Item to Firestore
 * Collection: foundItems
 * Fields specified in Requirement 6
 */
export async function reportFoundItem(
  userId: string,
  payload: ReportFoundItemPayload
): Promise<CampusItem> {
  try {
    const itemDocRef = doc(collection(db, 'foundItems'));
    const itemId = itemDocRef.id;
    const nowIso = new Date().toISOString();

    // 1. Upload images to Firebase Storage
    let finalImageUrls: string[] = payload.imageUrls || [];
    if (payload.imageFiles && payload.imageFiles.length > 0) {
      const uploaded = await uploadItemImages(userId, itemId, payload.imageFiles);
      finalImageUrls = [...finalImageUrls, ...uploaded];
    }

    const primaryImageUrl = finalImageUrls[0] || '';

    // 2. Create document in Firestore under foundItems
    const foundItemDoc: Record<string, any> = {
      itemId,
      id: itemId,
      userId,
      reporterId: userId,
      itemName: payload.itemName.trim(),
      title: payload.itemName.trim(), // sync alias
      category: payload.category,
      description: payload.description.trim(),
      location: payload.location.trim(),
      dateFound: payload.dateFound,
      timeFound: payload.timeFound || '',
      date: payload.dateFound,
      dateTime: payload.timeFound ? `${payload.dateFound} ${payload.timeFound}` : payload.dateFound,
      imageUrls: finalImageUrls,
      imageUrl: primaryImageUrl,
      identifyingDetails: payload.identifyingDetails || '',
      institution: payload.institution || 'Tertiary Institution',
      university: payload.institution || 'Tertiary Institution',
      safeHandoverPoint: payload.safeHandoverPoint || '',
      contactPreference: payload.contactPreference || 'chat',
      status: 'found' as ItemStatus,
      type: 'found' as ItemType,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    await setDoc(itemDocRef, foundItemDoc);

    const createdItem = formatItemDoc(itemId, 'found', foundItemDoc);

    // Run matching asynchronously
    runSmartMatchingForNewItem(createdItem).catch((err) =>
      console.warn('Smart matching error:', err)
    );

    return createdItem;
  } catch (error) {
    console.error('Failed to submit found item:', error);
    throw new Error(getFriendlyFirebaseErrorMessage(error));
  }
}

/**
 * Legacy wrapper for reporting items
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
    imageFiles?: File[];
    additionalDetails?: string;
    reward?: number;
    safeHandoverPoint?: string;
    verificationQuestion?: string;
    contactPreference?: 'chat' | 'whatsapp';
  }
): Promise<CampusItem> {
  const imageFiles: File[] = [];
  let imageUrls: string[] = [];
  if (data.imageFileOrUrl) {
    if (typeof data.imageFileOrUrl === 'string') {
      imageUrls.push(data.imageFileOrUrl);
    } else {
      imageFiles.push(data.imageFileOrUrl);
    }
  }
  if (data.imageFiles) {
    imageFiles.push(...data.imageFiles);
  }

  if (data.type === 'lost') {
    return await reportLostItem(userId, {
      itemName: data.title,
      category: data.category,
      description: data.description,
      location: data.location,
      dateLost: data.dateTime || new Date().toISOString().split('T')[0],
      timeLost: '',
      imageFiles,
      imageUrls,
      identifyingDetails: data.additionalDetails || data.verificationQuestion,
      institution: userUniversity,
      reward: data.reward,
      contactPreference: data.contactPreference,
    });
  } else {
    return await reportFoundItem(userId, {
      itemName: data.title,
      category: data.category,
      description: data.description,
      location: data.location,
      dateFound: data.dateTime || new Date().toISOString().split('T')[0],
      timeFound: '',
      imageFiles,
      imageUrls,
      identifyingDetails: data.additionalDetails || data.verificationQuestion,
      institution: userUniversity,
      safeHandoverPoint: data.safeHandoverPoint,
      contactPreference: data.contactPreference,
    });
  }
}

/**
 * Helper to normalize item from Firestore doc
 */
function formatItemDoc(docId: string, itemType: ItemType, data: Record<string, any>): CampusItem {
  const itemName = data.itemName || data.title || 'Untitled Item';
  const imageUrls: string[] = Array.isArray(data.imageUrls)
    ? data.imageUrls
    : data.imageUrl
    ? [data.imageUrl]
    : [];

  const rawStatus = (data.status || (itemType === 'lost' ? 'lost' : 'found')).toLowerCase();
  let status: ItemStatus = 'active';
  if (rawStatus === 'recovered') status = 'recovered';
  else if (rawStatus === 'closed') status = 'closed';
  else if (rawStatus === 'possible match') status = 'possible match';
  else if (rawStatus === 'lost') status = 'lost';
  else if (rawStatus === 'found') status = 'found';
  else status = 'active';

  return {
    id: docId,
    itemId: docId,
    userId: data.userId || data.reporterId || '',
    reporterId: data.userId || data.reporterId || '',
    type: itemType,
    itemName,
    title: itemName,
    category: (data.category as ItemCategory) || 'Other',
    description: data.description || '',
    location: data.location || '',
    dateLost: data.dateLost || data.date,
    timeLost: data.timeLost || '',
    dateFound: data.dateFound || data.date,
    timeFound: data.timeFound || '',
    dateTime: data.dateTime || data.dateLost || data.dateFound || data.date || '',
    date: data.date || data.dateLost || data.dateFound || '',
    imageUrls,
    imageUrl: imageUrls[0] || data.imageUrl || '',
    identifyingDetails: data.identifyingDetails || data.additionalDetails || '',
    additionalDetails: data.identifyingDetails || data.additionalDetails || '',
    institution: data.institution || data.university || '',
    university: data.institution || data.university || '',
    status,
    reporterName: data.reporterName || 'Campus Student',
    reward: data.reward,
    safeHandoverPoint: data.safeHandoverPoint,
    verificationQuestion: data.verificationQuestion || data.identifyingDetails,
    contactPreference: data.contactPreference || 'chat',
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString(),
  };
}

/**
 * Update item status in Firestore (e.g. 'recovered', 'closed')
 * Requirement 11: When an owner marks a lost item as recovered,
 * update the Firestore document so it no longer appears as active.
 */
export async function updateItemStatusInFirestore(
  itemId: string,
  type: ItemType,
  status: ItemStatus
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
 * Edit an existing report in Firestore (owner only)
 */
export async function editItemInFirestore(
  itemId: string,
  type: ItemType,
  updates: Partial<CampusItem>
): Promise<void> {
  try {
    const targetColl = type === 'lost' ? 'lostItems' : 'foundItems';
    const cleanUpdates: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };

    if (updates.itemName) {
      cleanUpdates.itemName = updates.itemName.trim();
      cleanUpdates.title = updates.itemName.trim();
    } else if (updates.title) {
      cleanUpdates.itemName = updates.title.trim();
      cleanUpdates.title = updates.title.trim();
    }

    if (updates.category) cleanUpdates.category = updates.category;
    if (updates.description) cleanUpdates.description = updates.description.trim();
    if (updates.location) cleanUpdates.location = updates.location.trim();
    if (updates.identifyingDetails !== undefined) cleanUpdates.identifyingDetails = updates.identifyingDetails;
    if (updates.status) cleanUpdates.status = updates.status;
    if (updates.reward !== undefined) cleanUpdates.reward = updates.reward;

    await updateDoc(doc(db, targetColl, itemId), cleanUpdates);
  } catch (error) {
    console.error('Failed to edit item:', error);
    throw new Error(getFriendlyFirebaseErrorMessage(error));
  }
}

/**
 * Delete campus item from Firestore (owner or admin only)
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
 * Real-time subscription to Lost & Found items
 * Uses limit to avoid reading the entire collection every time (Requirement 7)
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
    query(collection(db, 'lostItems'), limit(50)),
    (snapshot) => {
      lostItemsList = [];
      snapshot.forEach((docSnap) => {
        lostItemsList.push(formatItemDoc(docSnap.id, 'lost', docSnap.data()));
      });
      updateCombined();
    },
    (err) => console.warn('Lost items sync notice:', err)
  );

  const unsubFound = onSnapshot(
    query(collection(db, 'foundItems'), limit(50)),
    (snapshot) => {
      foundItemsList = [];
      snapshot.forEach((docSnap) => {
        foundItemsList.push(formatItemDoc(docSnap.id, 'found', docSnap.data()));
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
 * Run smart match detection between lost and found items
 * Requirement 12: Prepare the architecture for matching lost and found items.
 * Does NOT automatically claim the item.
 */
async function runSmartMatchingForNewItem(newItem: CampusItem): Promise<void> {
  const oppositeCollection = newItem.type === 'lost' ? 'foundItems' : 'lostItems';
  const q = query(
    collection(db, oppositeCollection),
    where('status', 'in', ['active', 'lost', 'found']),
    limit(25)
  );
  const snap = await getDocs(q);

  const titleWords = (newItem.itemName || newItem.title || '')
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 3);
  const locLower = (newItem.location || '').toLowerCase();

  for (const docSnap of snap.docs) {
    const oppItem = formatItemDoc(docSnap.id, newItem.type === 'lost' ? 'found' : 'lost', docSnap.data());
    const oppTitle = (oppItem.itemName || oppItem.title || '').toLowerCase();
    const oppLoc = (oppItem.location || '').toLowerCase();

    const categoryMatch = oppItem.category === newItem.category;
    const titleMatch = titleWords.some((w) => oppTitle.includes(w));
    const locMatch = oppLoc.length > 3 && (oppLoc.includes(locLower) || locLower.includes(oppLoc));

    if (categoryMatch || titleMatch) {
      const score = (categoryMatch ? 50 : 0) + (titleMatch ? 30 : 0) + (locMatch ? 20 : 0);
      if (score >= 50) {
        const lostId = newItem.type === 'lost' ? newItem.id : oppItem.id;
        const foundId = newItem.type === 'found' ? newItem.id : oppItem.id;

        const matchDocRef = doc(collection(db, 'matches'));
        const matchData: PossibleMatch = {
          id: matchDocRef.id,
          lostItemId: lostId,
          foundItemId: foundId,
          score,
          reason: `${categoryMatch ? 'Category matches (' + newItem.category + ')' : ''} ${
            locMatch ? '• Similar location (' + newItem.location + ')' : ''
          }`.trim(),
          status: 'pending',
          createdAt: new Date().toISOString(),
        };

        await setDoc(matchDocRef, matchData);

        // Notify the seeker in-app
        const seekerId = newItem.type === 'lost' ? newItem.userId : oppItem.userId;
        if (seekerId) {
          const notifDocRef = doc(collection(db, 'notifications'));
          await setDoc(notifDocRef, {
            id: notifDocRef.id,
            userId: seekerId,
            type: 'match',
            title: '🔍 Possible Match Detected',
            message: `A report for "${newItem.itemName || newItem.title}" matches your item details.`,
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
 * In-app messaging for contacting reporters safely
 * Requirement 9: Contact Reporter opens an in-app conversation or secure contact mechanism.
 * Do NOT expose reporter's email or phone number.
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
    if (receiverId) {
      const notifDocRef = doc(collection(db, 'notifications'));
      await setDoc(notifDocRef, {
        id: notifDocRef.id,
        userId: receiverId,
        type: 'match',
        title: '💬 New In-App Message',
        message: text.slice(0, 60),
        isRead: false,
        timestamp: nowIso,
        linkTab: 'chat',
        createdAt: nowIso,
      });
    }

    return newMsg;
  } catch (error) {
    console.error('Failed to send message:', error);
    throw new Error(getFriendlyFirebaseErrorMessage(error));
  }
}

/**
 * Subscribe to messages for a user
 */
export function subscribeToMessages(
  userId: string,
  callback: (messages: Record<string, ChatMessage[]>) => void
) {
  if (!userId) return () => {};

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

  const unsub1 = onSnapshot(
    q1,
    (snap) => {
      sentMsgs = [];
      snap.forEach((d) => sentMsgs.push({ ...d.data(), id: d.id } as any));
      mergeAndGroup();
    },
    (err) => console.warn('Sent messages sync notice:', err)
  );

  const unsub2 = onSnapshot(
    q2,
    (snap) => {
      recvMsgs = [];
      snap.forEach((d) => recvMsgs.push({ ...d.data(), id: d.id } as any));
      mergeAndGroup();
    },
    (err) => console.warn('Received messages sync notice:', err)
  );

  return () => {
    unsub1();
    unsub2();
  };
}
