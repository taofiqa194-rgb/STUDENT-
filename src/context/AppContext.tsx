import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  User,
  Expense,
  Income,
  SavingsGoal,
  CampusItem,
  PossibleMatch,
  Conversation,
  ChatMessage,
  ChatSession,
  NotificationItem,
  PlatformAnnouncement,
  ExpenseCategory,
  IncomeSource,
  ItemType,
  ItemCategory,
  VerificationStatus,
} from '../types';
import {
  INITIAL_STUDENT_USER,
  INITIAL_ADMIN_USER,
  INITIAL_OTHER_STUDENTS,
  INITIAL_EXPENSES,
  INITIAL_INCOMES,
  INITIAL_SAVINGS_GOALS,
  INITIAL_CAMPUS_ITEMS,
  INITIAL_MATCHES,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_NOTIFICATIONS,
  INITIAL_ANNOUNCEMENTS,
} from '../data/mockData';
import {
  auth,
  onAuthStateChanged,
  FirebaseUser,
} from '../lib/firebase';
import {
  registerStudentWithFirebase,
  loginStudentWithFirebase,
  loginWithGoogle,
  sendStudentPasswordReset,
  logoutStudent,
  updateStudentProfile,
  submitVerificationToFirestore,
  RegisterStudentData,
} from '../services/authService';
import {
  addExpenseToFirestore,
  deleteExpenseFromFirestore,
  addIncomeToFirestore,
  deleteIncomeFromFirestore,
  addSavingsGoalToFirestore,
  addFundsToSavingsGoal,
  updateSavingsGoalInFirestore,
  deleteSavingsGoalFromFirestore,
  subscribeToUserExpenses,
  subscribeToUserIncome,
  subscribeToUserSavingsGoals,
} from '../services/financeService';
import {
  reportCampusItemToFirestore,
  updateItemStatusInFirestore,
  deleteCampusItemFromFirestore,
  subscribeToCampusItems,
  subscribeToMatches,
  sendMessageToFirestore,
  subscribeToMessages,
} from '../services/lostFoundService';
import {
  adminVerifyStudentInFirestore,
  adminToggleSuspendUserInFirestore,
  adminDeleteListingFromFirestore,
  subscribeToAllUsers,
} from '../services/adminService';
import {
  addNotificationToFirestore,
  markNotificationAsReadInFirestore,
  markAllNotificationsAsReadInFirestore,
  subscribeToUserNotifications,
} from '../services/notificationService';

export type AppTab =
  | 'home'
  | 'money'
  | 'lost-found'
  | 'chat'
  | 'profile'
  | 'admin'
  | 'notifications'
  | 'analytics'
  | 'verify'
  | 'lostfound'
  | 'verification';

interface AppContextType {
  currentUser: User;
  firebaseUser: FirebaseUser | null;
  allUsers: User[];
  setCurrentUser: (user: User) => void;
  switchRole: (role: 'student' | 'admin') => void;
  loginUser: (email: string, password?: string) => Promise<boolean> | boolean;
  loginWithGoogleAuth: () => Promise<boolean>;
  registerUser: (newUser: Partial<User> & { password?: string }) => Promise<boolean> | void;
  logoutUser: () => Promise<void> | void;
  sendPasswordReset: (email: string) => Promise<boolean>;
  updateProfile: (updates: Partial<User>) => Promise<void> | void;
  submitStudentVerification: (details: {
    faculty: string;
    department: string;
    level: string;
    matricNumber: string;
    idCardFileOrUrl?: File | string;
  }) => Promise<void> | void;
  adminVerifyStudent: (userId: string, status: VerificationStatus) => Promise<void> | void;
  verifyStudentAdmin: (userId: string, status: VerificationStatus) => Promise<void> | void;
  adminToggleSuspendUser: (userId: string) => Promise<void> | void;

  // Tabs & Navigation
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;

  // Onboarding & Splash
  splashDone: boolean;
  setSplashDone: (val: boolean) => void;
  hasSeenOnboarding: boolean;
  hasCompletedOnboarding: boolean;
  finishOnboarding: () => void;
  restartOnboarding: () => void;

  // Money Manager
  expenses: Expense[];
  incomes: Income[];
  savingsGoals: SavingsGoal[];
  addExpense: (data: {
    amount: number;
    category: ExpenseCategory;
    date: string;
    note: string;
    receiptFileOrUrl?: File | string;
    receiptUrl?: string;
  }) => Promise<void> | void;
  deleteExpense: (id: string) => Promise<void> | void;
  addIncome: (data: {
    amount: number;
    source: IncomeSource;
    date: string;
    note: string;
  }) => Promise<void> | void;
  deleteIncome: (id: string) => Promise<void> | void;
  addSavingsGoal: (data: {
    title: string;
    targetAmount: number;
    savedAmount?: number;
    category: string;
    targetDate?: string;
  }) => Promise<void> | void;
  addMoneyToGoal: (goalId: string, amount: number) => Promise<void> | void;
  updateSavingsGoal: (goalId: string, updates: Partial<SavingsGoal>) => Promise<void> | void;
  deleteSavingsGoal: (goalId: string) => Promise<void> | void;

  // Financial Computations (calculated safely from transactions)
  currentBalance: number;
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  recommendedDailySpending: number;
  todaySpending: number;
  spendingByCategory: Record<ExpenseCategory, number>;

  // Lost & Found
  campusItems: CampusItem[];
  addCampusItem: (data: {
    type: ItemType;
    title: string;
    category: ItemCategory;
    description: string;
    location: string;
    dateTime: string;
    imageFileOrUrl?: File | string;
    imageUrl?: string;
    additionalDetails?: string;
    reward?: number;
    safeHandoverPoint?: string;
    verificationQuestion?: string;
    contactPreference?: 'chat' | 'whatsapp';
  }) => Promise<CampusItem> | CampusItem;
  updateItemStatus: (
    itemId: string,
    status: 'active' | 'resolved' | 'matched' | 'lost' | 'found' | 'verifying'
  ) => Promise<void> | void;
  markItemStatus: (
    itemId: string,
    status: 'active' | 'resolved' | 'matched' | 'lost' | 'found' | 'verifying'
  ) => Promise<void> | void;
  deleteCampusItem: (itemId: string) => Promise<void> | void;
  deleteCampusItemAdmin: (itemId: string) => Promise<void> | void;

  // Matches
  matches: PossibleMatch[];
  getMatchesForItem: (item: CampusItem) => PossibleMatch[];
  matchedItemsNotice: { message: string; matchedItemId: string } | null;
  clearMatchedNotice: () => void;
  dismissMatch: (matchId: string) => void;
  confirmMatch: (matchId: string) => void;

  // Chat & Messaging
  conversations: Conversation[];
  messages: Record<string, ChatMessage[]>;
  activeConversationId: string | null;
  currentChatSession: ChatSession | null;
  closeChat: () => void;
  setActiveConversationId: (id: string | null) => void;
  startOrOpenChat: (itemOrUserId: CampusItem | string, itemId?: string) => string;
  sendMessage: (conversationId: string, text: string) => Promise<void> | void;
  blockConversation: (conversationId: string) => void;
  reportConversation: (conversationId: string) => void;

  // Notifications
  notifications: NotificationItem[];
  unreadNotifsCount: number;
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => Promise<void> | void;
  markAllNotificationsAsRead: () => Promise<void> | void;
  clearNotifications?: () => void;
  addNotification: (
    notif: Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'>
  ) => Promise<void> | void;

  // Announcements & Admin
  announcements: PlatformAnnouncement[];
  addAnnouncement: (data: {
    title: string;
    content: string;
    priority: 'normal' | 'urgent';
    targetUniversity?: string;
  }) => void;
  adminVerificationRequests?: User[];
  verifyStudentRequest?: (userId: string, status: VerificationStatus) => Promise<void> | void;
  reportCampusItem?: (data: any) => Promise<CampusItem> | CampusItem;
  changeUniversity?: (name: string) => void;

  // App Theme & Connectivity
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  isOnline: boolean;
  authError: string | null;
  setAuthError: (err: string | null) => void;

  // Reset
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'studentmate_state_v2';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  // All users cache (students & admins)
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_users`);
      return saved
        ? JSON.parse(saved)
        : [INITIAL_STUDENT_USER, INITIAL_ADMIN_USER, ...INITIAL_OTHER_STUDENTS];
    } catch {
      return [INITIAL_STUDENT_USER, INITIAL_ADMIN_USER, ...INITIAL_OTHER_STUDENTS];
    }
  });

  // Current active user
  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_cur_uid`);
      return saved || INITIAL_STUDENT_USER.id;
    } catch {
      return INITIAL_STUDENT_USER.id;
    }
  });

  const currentUser = useMemo(() => {
    return allUsers.find((u) => u.id === currentUserId) || allUsers[0] || INITIAL_STUDENT_USER;
  }, [allUsers, currentUserId]);

  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [splashDone, setSplashDone] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean>(() => {
    try {
      return localStorage.getItem(`${STORAGE_KEY}_onboarded`) === 'true';
    } catch {
      return false;
    }
  });

  // Finances
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_expenses`);
      return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
    } catch {
      return INITIAL_EXPENSES;
    }
  });

  const [incomes, setIncomes] = useState<Income[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_incomes`);
      return saved ? JSON.parse(saved) : INITIAL_INCOMES;
    } catch {
      return INITIAL_INCOMES;
    }
  });

  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_goals`);
      return saved ? JSON.parse(saved) : INITIAL_SAVINGS_GOALS;
    } catch {
      return INITIAL_SAVINGS_GOALS;
    }
  });

  // Lost & Found
  const [campusItems, setCampusItems] = useState<CampusItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_items`);
      return saved ? JSON.parse(saved) : INITIAL_CAMPUS_ITEMS;
    } catch {
      return INITIAL_CAMPUS_ITEMS;
    }
  });

  const [matches, setMatches] = useState<PossibleMatch[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_matches`);
      return saved ? JSON.parse(saved) : INITIAL_MATCHES;
    } catch {
      return INITIAL_MATCHES;
    }
  });

  // Chat
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_convs`);
      return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
    } catch {
      return INITIAL_CONVERSATIONS;
    }
  });

  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_msgs`);
      return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });

  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_notifs`);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  // Announcements
  const [announcements, setAnnouncements] = useState<PlatformAnnouncement[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_announcements`);
      return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
    } catch {
      return INITIAL_ANNOUNCEMENTS;
    }
  });

  // Theme
  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_theme`);
      return (saved as 'light' | 'dark' | 'system') || 'light';
    } catch {
      return 'light';
    }
  });

  // Online status
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync theme with document element
  useEffect(() => {
    const root = document.documentElement;
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(`${STORAGE_KEY}_theme`, theme);
  }, [theme]);

  // Persist cache locally
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(allUsers));
      localStorage.setItem(`${STORAGE_KEY}_cur_uid`, currentUserId);
      localStorage.setItem(`${STORAGE_KEY}_expenses`, JSON.stringify(expenses));
      localStorage.setItem(`${STORAGE_KEY}_incomes`, JSON.stringify(incomes));
      localStorage.setItem(`${STORAGE_KEY}_goals`, JSON.stringify(savingsGoals));
      localStorage.setItem(`${STORAGE_KEY}_items`, JSON.stringify(campusItems));
      localStorage.setItem(`${STORAGE_KEY}_matches`, JSON.stringify(matches));
      localStorage.setItem(`${STORAGE_KEY}_convs`, JSON.stringify(conversations));
      localStorage.setItem(`${STORAGE_KEY}_msgs`, JSON.stringify(messages));
      localStorage.setItem(`${STORAGE_KEY}_notifs`, JSON.stringify(notifications));
      localStorage.setItem(`${STORAGE_KEY}_announcements`, JSON.stringify(announcements));
    } catch (e) {
      console.warn('LocalStorage save notice:', e);
    }
  }, [
    isLoaded,
    allUsers,
    currentUserId,
    expenses,
    incomes,
    savingsGoals,
    campusItems,
    matches,
    conversations,
    messages,
    notifications,
    announcements,
  ]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // -------------------------------------------------------------
  // FIREBASE REAL-TIME LISTENERS
  // -------------------------------------------------------------

  // 1. Firebase Auth listener (persistent session)
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user) {
        // Look for corresponding profile in allUsers or update
        setCurrentUserId(user.uid);
        setAllUsers((prev) => {
          const exists = prev.find((u) => u.id === user.uid);
          if (exists) {
            return prev;
          }
          const newU: User = {
            id: user.uid,
            fullName: user.displayName || 'Student',
            email: user.email || '',
            phoneNumber: user.phoneNumber || '',
            university: 'University of Lagos',
            faculty: 'Faculty of Science',
            department: 'Computer Science',
            level: '100 Level',
            matricNumber: '',
            avatarUrl: user.photoURL || '',
            role: 'student',
            verificationStatus: 'pending',
            createdAt: new Date().toISOString(),
          };
          return [newU, ...prev];
        });
      }
    });

    return () => unsubAuth();
  }, []);

  // 2. Real-time Firestore sync for current user finances & notifications
  useEffect(() => {
    if (!currentUser?.id) return;

    // Listen to expenses
    const unsubExpenses = subscribeToUserExpenses(currentUser.id, (fbExpenses) => {
      if (fbExpenses.length > 0) {
        setExpenses(fbExpenses);
      }
    });

    // Listen to income
    const unsubIncome = subscribeToUserIncome(currentUser.id, (fbIncomes) => {
      if (fbIncomes.length > 0) {
        setIncomes(fbIncomes);
      }
    });

    // Listen to savings goals
    const unsubGoals = subscribeToUserSavingsGoals(currentUser.id, (fbGoals) => {
      if (fbGoals.length > 0) {
        setSavingsGoals(fbGoals);
      }
    });

    // Listen to notifications
    const unsubNotifs = subscribeToUserNotifications(currentUser.id, (fbNotifs) => {
      if (fbNotifs.length > 0) {
        setNotifications(fbNotifs);
      }
    });

    // Listen to user messages
    const unsubMessages = subscribeToMessages(currentUser.id, (fbMsgs) => {
      setMessages(fbMsgs);
    });

    return () => {
      unsubExpenses();
      unsubIncome();
      unsubGoals();
      unsubNotifs();
      unsubMessages();
    };
  }, [currentUser?.id]);

  // 3. Real-time Firestore sync for public items, matches, and all users
  useEffect(() => {
    const unsubItems = subscribeToCampusItems((fbItems) => {
      if (fbItems.length > 0) {
        setCampusItems(fbItems);
      }
    });

    const unsubMatches = subscribeToMatches((fbMatches) => {
      if (fbMatches.length > 0) {
        setMatches(fbMatches);
      }
    });

    const unsubUsers = subscribeToAllUsers((fbUsers) => {
      if (fbUsers.length > 0) {
        setAllUsers((prev) => {
          // Merge while keeping local additions
          const map = new Map<string, User>();
          prev.forEach((u) => map.set(u.id, u));
          fbUsers.forEach((u) => map.set(u.id, u));
          return Array.from(map.values());
        });
      }
    });

    return () => {
      unsubItems();
      unsubMatches();
      unsubUsers();
    };
  }, []);

  // -------------------------------------------------------------
  // CALCULATED FINANCIAL VALUES (SAFELY DERIVED FROM TRANSACTIONS)
  // -------------------------------------------------------------
  const totalIncome = useMemo(() => {
    return incomes.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  }, [incomes]);

  const totalExpenses = useMemo(() => {
    return expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  }, [expenses]);

  // Current balance: totalIncome - totalExpenses
  const currentBalance = useMemo(() => {
    return Math.max(0, totalIncome - totalExpenses);
  }, [totalIncome, totalExpenses]);

  const totalSavings = useMemo(() => {
    return savingsGoals.reduce((sum, item) => sum + Number(item.savedAmount || 0), 0);
  }, [savingsGoals]);

  const todaySpending = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return expenses
      .filter((e) => e.date === todayStr)
      .reduce((sum, e) => sum + Number(e.amount || 0), 0);
  }, [expenses]);

  const recommendedDailySpending = useMemo(() => {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const remainingDays = Math.max(1, daysInMonth - now.getDate() + 1);
    const calculatedDaily = Math.floor(currentBalance / remainingDays);
    return Math.max(0, calculatedDaily);
  }, [currentBalance]);

  const spendingByCategory = useMemo(() => {
    const map: Record<ExpenseCategory, number> = {
      Food: 0,
      Transport: 0,
      'Data/Airtime': 0,
      Education: 0,
      Accommodation: 0,
      Entertainment: 0,
      Shopping: 0,
      Other: 0,
    };
    expenses.forEach((e) => {
      if (map[e.category] !== undefined) {
        map[e.category] += Number(e.amount || 0);
      } else {
        map.Other += Number(e.amount || 0);
      }
    });
    return map;
  }, [expenses]);

  // -------------------------------------------------------------
  // AUTHENTICATION HANDLERS
  // -------------------------------------------------------------

  const loginUser = async (email: string, password?: string): Promise<boolean> => {
    setAuthError(null);
    try {
      if (password) {
        // Real Firebase Email/Password login
        const { user } = await loginStudentWithFirebase(email, password);
        setAllUsers((prev) => [user, ...prev.filter((u) => u.id !== user.id)]);
        setCurrentUserId(user.id);
        return true;
      }

      // Quick shortcut login for demo testing
      const found = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (found) {
        setCurrentUserId(found.id);
        return true;
      }
      return false;
    } catch (err: any) {
      setAuthError(err.message || 'Login failed.');
      return false;
    }
  };

  const loginWithGoogleAuth = async (): Promise<boolean> => {
    setAuthError(null);
    try {
      const { user } = await loginWithGoogle();
      setAllUsers((prev) => [user, ...prev.filter((u) => u.id !== user.id)]);
      setCurrentUserId(user.id);
      return true;
    } catch (err: any) {
      setAuthError(err.message || 'Google sign-in failed.');
      return false;
    }
  };

  const registerUser = async (
    newUser: Partial<User> & { password?: string }
  ): Promise<boolean> => {
    setAuthError(null);
    try {
      const regData: RegisterStudentData = {
        fullName: newUser.fullName || 'Student',
        email: newUser.email || `student_${Date.now()}@uni.edu.ng`,
        password: newUser.password || 'Student@123',
        phone: newUser.phoneNumber || '+234 800 000 0000',
        university: newUser.university || 'University of Lagos',
        faculty: newUser.faculty || 'Faculty of Science',
        department: newUser.department || 'Computer Science',
        level: newUser.level || '100 Level',
        matricNumber: newUser.matricNumber || '',
        avatarUrl: newUser.avatarUrl,
      };

      const { user } = await registerStudentWithFirebase(regData);
      setAllUsers((prev) => [user, ...prev]);
      setCurrentUserId(user.id);
      return true;
    } catch (err: any) {
      setAuthError(err.message || 'Registration failed.');
      // Local fallback for offline preview
      const localUser: User = {
        id: `user_${Date.now()}`,
        fullName: newUser.fullName || 'Student',
        email: newUser.email || 'student@uni.edu.ng',
        phoneNumber: newUser.phoneNumber || '',
        university: newUser.university || 'University of Lagos',
        faculty: newUser.faculty || 'Faculty of Science',
        department: newUser.department || 'Computer Science',
        level: newUser.level || '100 Level',
        matricNumber: newUser.matricNumber || '',
        avatarUrl: newUser.avatarUrl,
        role: 'student',
        verificationStatus: 'pending',
        createdAt: new Date().toISOString(),
      };
      setAllUsers((prev) => [localUser, ...prev]);
      setCurrentUserId(localUser.id);
      return true;
    }
  };

  const logoutUser = async (): Promise<void> => {
    try {
      await logoutStudent();
    } catch (err) {
      console.warn('Logout notice:', err);
    }
    // Switch to guest/initial student
    setCurrentUserId(INITIAL_STUDENT_USER.id);
  };

  const sendPasswordReset = async (email: string): Promise<boolean> => {
    try {
      await sendStudentPasswordReset(email);
      return true;
    } catch (err: any) {
      setAuthError(err.message || 'Password reset failed.');
      return false;
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      if (currentUser?.id) {
        await updateStudentProfile(currentUser.id, updates);
      }
    } catch (err) {
      console.warn('Firestore profile update notice:', err);
    }
    setAllUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, ...updates } : u))
    );
  };

  const submitStudentVerification = async (details: {
    faculty: string;
    department: string;
    level: string;
    matricNumber: string;
    idCardFileOrUrl?: File | string;
  }) => {
    try {
      if (currentUser?.id) {
        await submitVerificationToFirestore(currentUser.id, details);
      }
    } catch (err) {
      console.warn('Firestore verification submission notice:', err);
    }

    setAllUsers((prev) =>
      prev.map((u) =>
        u.id === currentUser.id
          ? {
              ...u,
              ...details,
              verificationStatus: 'pending',
              verificationSubmittedAt: new Date().toISOString(),
            }
          : u
      )
    );

    await addNotification({
      userId: currentUser.id,
      type: 'verification',
      title: '🛡️ Verification Submitted',
      message: 'Your student credentials are queued for campus admin confirmation.',
      linkTab: 'verification',
    });
  };

  // Role switching
  const switchRole = (role: 'student' | 'admin') => {
    if (role === 'admin') {
      const admin = allUsers.find((u) => u.role === 'admin') || INITIAL_ADMIN_USER;
      setCurrentUserId(admin.id);
      setActiveTab('admin');
    } else {
      const student = allUsers.find((u) => u.role === 'student') || INITIAL_STUDENT_USER;
      setCurrentUserId(student.id);
      setActiveTab('home');
    }
  };

  const adminVerifyStudent = async (userId: string, status: VerificationStatus) => {
    try {
      await adminVerifyStudentInFirestore(userId, status);
    } catch (err) {
      console.warn('Admin verify notice:', err);
    }

    setAllUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, verificationStatus: status } : u))
    );

    await addNotification({
      userId,
      type: 'verification',
      title: status === 'verified' ? '🟢 Verification Approved!' : '🔴 Verification Needs Update',
      message:
        status === 'verified'
          ? 'Congratulations! Your student badge is now active across campus.'
          : 'Please review your matric number and re-submit your student verification.',
      linkTab: 'verification',
    });
  };

  const verifyStudentAdmin = adminVerifyStudent;

  const adminToggleSuspendUser = async (userId: string) => {
    const target = allUsers.find((u) => u.id === userId);
    const nextSuspended = !(target?.isSuspended);

    try {
      await adminToggleSuspendUserInFirestore(userId, !nextSuspended);
    } catch (err) {
      console.warn('Admin toggle suspension notice:', err);
    }

    setAllUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isSuspended: nextSuspended } : u))
    );
  };

  // -------------------------------------------------------------
  // MONEY MANAGER HANDLERS
  // -------------------------------------------------------------

  const addExpense = async (data: {
    amount: number;
    category: ExpenseCategory;
    date: string;
    note: string;
    receiptFileOrUrl?: File | string;
    receiptUrl?: string;
  }) => {
    const receiptSource = data.receiptFileOrUrl || data.receiptUrl;
    try {
      const newExp = await addExpenseToFirestore(currentUser.id, {
        amount: data.amount,
        category: data.category,
        date: data.date,
        note: data.note,
        receiptFileOrUrl: receiptSource,
      });
      setExpenses((prev) => [newExp, ...prev]);
    } catch (err) {
      console.warn('Expense Firestore fallback to local state:', err);
      const fallbackExp: Expense = {
        id: `exp_${Date.now()}`,
        userId: currentUser.id,
        amount: Number(data.amount),
        category: data.category,
        date: data.date || new Date().toISOString().split('T')[0],
        note: data.note || '',
        receiptUrl: typeof receiptSource === 'string' ? receiptSource : undefined,
        createdAt: new Date().toISOString(),
      };
      setExpenses((prev) => [fallbackExp, ...prev]);
    }

    // Daily warning check
    if (recommendedDailySpending > 0 && data.amount > recommendedDailySpending * 1.5) {
      await addNotification({
        userId: currentUser.id,
        type: 'budget_alert',
        title: '⚠️ High Expense Logged',
        message: `You spent ₦${data.amount.toLocaleString()} on ${data.category}. That is above your daily target of ₦${recommendedDailySpending.toLocaleString()}.`,
        linkTab: 'money',
      });
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await deleteExpenseFromFirestore(id);
    } catch (err) {
      console.warn('Delete expense notice:', err);
    }
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const addIncome = async (data: {
    amount: number;
    source: IncomeSource;
    date: string;
    note: string;
  }) => {
    try {
      const newInc = await addIncomeToFirestore(currentUser.id, data);
      setIncomes((prev) => [newInc, ...prev]);
    } catch (err) {
      console.warn('Income Firestore fallback to local state:', err);
      const fallbackInc: Income = {
        id: `inc_${Date.now()}`,
        userId: currentUser.id,
        amount: Number(data.amount),
        source: data.source,
        date: data.date || new Date().toISOString().split('T')[0],
        note: data.note || '',
        createdAt: new Date().toISOString(),
      };
      setIncomes((prev) => [fallbackInc, ...prev]);
    }

    await addNotification({
      userId: currentUser.id,
      type: 'expense',
      title: '💵 Income Logged',
      message: `₦${data.amount.toLocaleString()} from ${data.source} added to your balance.`,
      linkTab: 'money',
    });
  };

  const deleteIncome = async (id: string) => {
    try {
      await deleteIncomeFromFirestore(id);
    } catch (err) {
      console.warn('Delete income notice:', err);
    }
    setIncomes((prev) => prev.filter((i) => i.id !== id));
  };

  const addSavingsGoal = async (data: {
    title: string;
    targetAmount: number;
    savedAmount?: number;
    category: string;
    targetDate?: string;
  }) => {
    try {
      const newGoal = await addSavingsGoalToFirestore(currentUser.id, data);
      setSavingsGoals((prev) => [newGoal, ...prev]);
    } catch (err) {
      console.warn('Savings goal fallback to local state:', err);
      const fallbackGoal: SavingsGoal = {
        id: `goal_${Date.now()}`,
        userId: currentUser.id,
        title: data.title,
        targetAmount: Number(data.targetAmount),
        savedAmount: Number(data.savedAmount || 0),
        category: data.category,
        targetDate: data.targetDate,
        createdAt: new Date().toISOString(),
      };
      setSavingsGoals((prev) => [fallbackGoal, ...prev]);
    }
  };

  const addMoneyToGoal = async (goalId: string, amount: number) => {
    const goal = savingsGoals.find((g) => g.id === goalId);
    if (!goal) return;

    try {
      await addFundsToSavingsGoal(goalId, goal.savedAmount, amount);
    } catch (err) {
      console.warn('Savings top-up notice:', err);
    }

    setSavingsGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, savedAmount: g.savedAmount + amount } : g))
    );
  };

  const updateSavingsGoal = async (goalId: string, updates: Partial<SavingsGoal>) => {
    try {
      await updateSavingsGoalInFirestore(goalId, updates);
    } catch (err) {
      console.warn('Savings update notice:', err);
    }

    setSavingsGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, ...updates } : g))
    );
  };

  const deleteSavingsGoal = async (goalId: string) => {
    try {
      await deleteSavingsGoalFromFirestore(goalId);
    } catch (err) {
      console.warn('Savings delete notice:', err);
    }

    setSavingsGoals((prev) => prev.filter((g) => g.id !== goalId));
  };

  // -------------------------------------------------------------
  // LOST & FOUND HANDLERS
  // -------------------------------------------------------------

  const [matchedItemsNotice, setMatchedItemsNotice] = useState<{
    message: string;
    matchedItemId: string;
  } | null>(null);

  const clearMatchedNotice = () => setMatchedItemsNotice(null);

  const addCampusItem = async (data: {
    type: ItemType;
    title: string;
    category: ItemCategory;
    description: string;
    location: string;
    dateTime: string;
    imageFileOrUrl?: File | string;
    imageUrl?: string;
    additionalDetails?: string;
    reward?: number;
    safeHandoverPoint?: string;
    verificationQuestion?: string;
    contactPreference?: 'chat' | 'whatsapp';
  }): Promise<CampusItem> => {
    const imageToUse = data.imageFileOrUrl || data.imageUrl;
    let newItem: CampusItem;

    try {
      newItem = await reportCampusItemToFirestore(currentUser.id, currentUser.university, {
        ...data,
        imageFileOrUrl: imageToUse,
      });
      setCampusItems((prev) => [newItem, ...prev]);
    } catch (err) {
      console.warn('Campus item fallback to local state:', err);
      newItem = {
        id: `item_${data.type}_${Date.now()}`,
        userId: currentUser.id,
        type: data.type,
        title: data.title,
        category: data.category,
        description: data.description,
        location: data.location,
        dateTime: data.dateTime || 'Just now',
        imageUrl: typeof imageToUse === 'string' ? imageToUse : undefined,
        additionalDetails: data.additionalDetails,
        university: currentUser.university,
        status: 'active',
        reward: data.reward,
        safeHandoverPoint: data.safeHandoverPoint,
        verificationQuestion: data.verificationQuestion,
        contactPreference: data.contactPreference,
        createdAt: new Date().toISOString(),
      };
      setCampusItems((prev) => [newItem, ...prev]);
    }

    return newItem;
  };

  const updateItemStatus = async (
    itemId: string,
    status: 'active' | 'resolved' | 'matched' | 'lost' | 'found' | 'verifying'
  ) => {
    const target = campusItems.find((i) => i.id === itemId);
    if (target) {
      try {
        await updateItemStatusInFirestore(itemId, target.type, status);
      } catch (err) {
        console.warn('Update item status notice:', err);
      }
    }

    setCampusItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, status } : it))
    );
  };

  const markItemStatus = updateItemStatus;

  const deleteCampusItem = async (itemId: string) => {
    const target = campusItems.find((i) => i.id === itemId);
    if (target) {
      try {
        await deleteCampusItemFromFirestore(itemId, target.type);
      } catch (err) {
        console.warn('Delete item notice:', err);
      }
    }

    setCampusItems((prev) => prev.filter((it) => it.id !== itemId));
  };

  const deleteCampusItemAdmin = async (itemId: string) => {
    const target = campusItems.find((i) => i.id === itemId);
    if (target) {
      try {
        await adminDeleteListingFromFirestore(itemId, target.type);
      } catch (err) {
        console.warn('Admin delete notice:', err);
      }
    }

    setCampusItems((prev) => prev.filter((it) => it.id !== itemId));
  };

  // Matches
  const getMatchesForItem = (item: CampusItem): PossibleMatch[] => {
    return matches.filter(
      (m) => m.lostItemId === item.id || m.foundItemId === item.id
    );
  };

  const dismissMatch = (matchId: string) => {
    setMatches((prev) => prev.map((m) => (m.id === matchId ? { ...m, status: 'dismissed' } : m)));
  };

  const confirmMatch = (matchId: string) => {
    const match = matches.find((m) => m.id === matchId);
    if (!match) return;

    setMatches((prev) => prev.map((m) => (m.id === matchId ? { ...m, status: 'matched' } : m)));
    updateItemStatus(match.lostItemId, 'resolved');
    updateItemStatus(match.foundItemId, 'resolved');
  };

  // -------------------------------------------------------------
  // CHAT & MESSAGING
  // -------------------------------------------------------------

  const startOrOpenChat = (itemOrUserId: CampusItem | string, itemId?: string): string => {
    let otherUser: User | undefined;
    let item: CampusItem | undefined;

    if (typeof itemOrUserId === 'string') {
      otherUser = allUsers.find((u) => u.id === itemOrUserId);
      if (itemId) item = campusItems.find((i) => i.id === itemId);
    } else {
      item = itemOrUserId;
      otherUser = allUsers.find((u) => u.id === item.userId);
    }

    const otherId = otherUser?.id || (typeof itemOrUserId === 'string' ? itemOrUserId : 'user_other');
    const existing = conversations.find((c) => c.otherParticipantId === otherId);

    if (existing) {
      setActiveConversationId(existing.id);
      setActiveTab('chat');
      return existing.id;
    }

    const newConvId = `conv_${Date.now()}`;
    const newConv: Conversation = {
      id: newConvId,
      itemId: item?.id,
      itemTitle: item?.title || 'Campus Item',
      itemType: item?.type,
      itemImage: item?.imageUrl,
      otherParticipantId: otherId,
      otherParticipantName: otherUser?.fullName || 'Campus Peer',
      lastMessage: 'Started conversation',
      lastMessageTime: 'Just now',
      unreadCount: 0,
    };

    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newConvId);
    setActiveTab('chat');
    return newConvId;
  };

  const currentChatSession = useMemo<ChatSession | null>(() => {
    if (!activeConversationId) return null;
    const conv = conversations.find((c) => c.id === activeConversationId);
    if (!conv) return null;

    const list = messages[activeConversationId] || [];
    return {
      id: conv.id,
      itemId: conv.itemId,
      participants: [currentUser.id, conv.otherParticipantId],
      messages: list.map((m) => ({
        id: m.id,
        senderId: m.senderId,
        text: m.text,
        timestamp: m.timestamp,
      })),
    };
  }, [activeConversationId, conversations, messages, currentUser.id]);

  const sendMessage = async (conversationId: string, text: string) => {
    const conv = conversations.find((c) => c.id === conversationId);
    const receiverId = conv ? conv.otherParticipantId : 'user_other';

    try {
      await sendMessageToFirestore(currentUser.id, receiverId, conversationId, text, conv?.itemId);
    } catch (err) {
      console.warn('Message fallback to local state:', err);
      const newMsg: ChatMessage = {
        id: `msg_${Date.now()}`,
        senderId: currentUser.id,
        receiverId,
        text: text.trim(),
        timestamp: new Date().toISOString(),
        isRead: false,
      };

      setMessages((prev) => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), newMsg],
      }));
    }

    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              lastMessage: text,
              lastMessageTime: 'Just now',
            }
          : c
      )
    );
  };

  const closeChat = () => setActiveConversationId(null);

  const blockConversation = (conversationId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, isBlocked: true } : c))
    );
  };

  const reportConversation = (conversationId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, isReported: true } : c))
    );
  };

  // -------------------------------------------------------------
  // NOTIFICATIONS
  // -------------------------------------------------------------

  const unreadNotifsCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  const unreadNotificationsCount = unreadNotifsCount;

  const markNotificationAsRead = async (id: string) => {
    try {
      await markNotificationAsReadInFirestore(id);
    } catch (err) {
      console.warn('Mark notif notice:', err);
    }
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await markAllNotificationsAsReadInFirestore(notifications);
    } catch (err) {
      console.warn('Mark all notifs notice:', err);
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const addNotification = async (
    notif: Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'>
  ) => {
    try {
      const created = await addNotificationToFirestore(notif);
      setNotifications((prev) => [created, ...prev]);
    } catch (err) {
      console.warn('Notif fallback to local state:', err);
      const fallbackNotif: NotificationItem = {
        id: `notif_${Date.now()}`,
        userId: notif.userId,
        type: notif.type,
        title: notif.title,
        message: notif.message,
        isRead: false,
        timestamp: new Date().toISOString(),
        relatedId: notif.relatedId,
        linkTab: notif.linkTab,
      };
      setNotifications((prev) => [fallbackNotif, ...prev]);
    }
  };

  // Announcements
  const addAnnouncement = (data: {
    title: string;
    content: string;
    priority: 'normal' | 'urgent';
    targetUniversity?: string;
  }) => {
    const newAnn: PlatformAnnouncement = {
      id: `ann_${Date.now()}`,
      title: data.title,
      content: data.content,
      priority: data.priority,
      targetUniversity: data.targetUniversity,
      createdAt: new Date().toISOString(),
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
  };

  // Onboarding helpers
  const finishOnboarding = () => {
    setHasSeenOnboarding(true);
    try {
      localStorage.setItem(`${STORAGE_KEY}_onboarded`, 'true');
    } catch {}
  };

  const restartOnboarding = () => {
    setHasSeenOnboarding(false);
    try {
      localStorage.removeItem(`${STORAGE_KEY}_onboarded`);
    } catch {}
    setActiveTab('home');
  };

  // Theme
  const setTheme = (t: 'light' | 'dark' | 'system') => {
    setThemeState(t);
  };

  const darkMode = useMemo(() => {
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }, [theme]);

  const setDarkMode = (val: boolean) => {
    setThemeState(val ? 'dark' : 'light');
  };

  // Reset
  const resetAllData = () => {
    localStorage.clear();
    setAllUsers([INITIAL_STUDENT_USER, INITIAL_ADMIN_USER, ...INITIAL_OTHER_STUDENTS]);
    setCurrentUserId(INITIAL_STUDENT_USER.id);
    setExpenses(INITIAL_EXPENSES);
    setIncomes(INITIAL_INCOMES);
    setSavingsGoals(INITIAL_SAVINGS_GOALS);
    setCampusItems(INITIAL_CAMPUS_ITEMS);
    setMatches(INITIAL_MATCHES);
    setConversations(INITIAL_CONVERSATIONS);
    setMessages(INITIAL_MESSAGES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setActiveTab('home');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        firebaseUser,
        allUsers,
        setCurrentUser: (u) => {
          setCurrentUserId(u.id);
          setAllUsers((prev) => {
            const found = prev.find((p) => p.id === u.id);
            return found ? prev.map((p) => (p.id === u.id ? u : p)) : [u, ...prev];
          });
        },
        switchRole,
        loginUser,
        loginWithGoogleAuth,
        registerUser,
        logoutUser,
        sendPasswordReset,
        updateProfile,
        submitStudentVerification,
        adminVerifyStudent,
        verifyStudentAdmin,
        adminToggleSuspendUser,

        activeTab,
        setActiveTab,
        splashDone,
        setSplashDone,
        hasSeenOnboarding,
        hasCompletedOnboarding: hasSeenOnboarding,
        finishOnboarding,
        restartOnboarding,

        expenses,
        incomes,
        savingsGoals,
        addExpense,
        deleteExpense,
        addIncome,
        deleteIncome,
        addSavingsGoal,
        addMoneyToGoal,
        updateSavingsGoal,
        deleteSavingsGoal,

        currentBalance,
        totalIncome,
        totalExpenses,
        totalSavings,
        recommendedDailySpending,
        todaySpending,
        spendingByCategory,

        campusItems,
        addCampusItem,
        updateItemStatus,
        markItemStatus,
        deleteCampusItem,
        deleteCampusItemAdmin,

        matches,
        getMatchesForItem,
        matchedItemsNotice,
        clearMatchedNotice,
        dismissMatch,
        confirmMatch,

        conversations,
        messages,
        activeConversationId,
        currentChatSession,
        closeChat,
        setActiveConversationId,
        startOrOpenChat,
        sendMessage,
        blockConversation,
        reportConversation,

        notifications,
        unreadNotifsCount,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotifications: () => setNotifications([]),
        addNotification,

        announcements,
        addAnnouncement,

        adminVerificationRequests: allUsers.filter((u) => u.verificationStatus === 'pending'),
        verifyStudentRequest: adminVerifyStudent,
        reportCampusItem: addCampusItem,
        changeUniversity: (name: string) => updateProfile({ university: name }),

        theme,
        setTheme,
        darkMode,
        setDarkMode,
        isOnline,
        authError,
        setAuthError,

        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
