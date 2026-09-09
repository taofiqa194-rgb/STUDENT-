export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  fullName: string;
  name?: string; // compatibility alias for fullName
  email: string;
  phoneNumber: string;
  university: string;
  shortUni?: string; // compatibility alias for short university name
  faculty: string;
  department: string;
  level: string; // e.g. '100 Level', '200 Level', '300 Level', '400 Level', '500 Level'
  matricNumber: string;
  avatarUrl?: string;
  avatar?: string; // compatibility alias for avatarUrl
  role: UserRole;
  verificationStatus: VerificationStatus;
  verificationSubmittedAt?: string;
  studentIdCardUrl?: string;
  isSuspended?: boolean;
  createdAt: string;
}

export type ExpenseCategory =
  | 'Food'
  | 'Transport'
  | 'Data/Airtime'
  | 'Education'
  | 'Accommodation'
  | 'Entertainment'
  | 'Shopping'
  | 'Other';

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  note: string;
  receiptUrl?: string;
  createdAt: string;
}

export type IncomeSource =
  | 'Allowance'
  | 'Salary'
  | 'Business'
  | 'Freelance'
  | 'Gift'
  | 'Other';

export interface Income {
  id: string;
  userId: string;
  amount: number;
  source: IncomeSource;
  date: string;
  note: string;
  createdAt: string;
}

export interface SavingsGoal {
  id: string;
  userId: string;
  title: string;
  targetAmount: number;
  savedAmount: number;
  category: string;
  targetDate?: string;
  createdAt: string;
}

export type CampusLocation = string;

export type ItemType = 'lost' | 'found';

export type ItemCategory =
  | 'Student ID Card'
  | 'Phone'
  | 'Laptop'
  | 'Keys'
  | 'Backpack'
  | 'ATM Card'
  | 'Earbuds'
  | 'Notebook'
  | 'Electronics'
  | 'Bags'
  | 'Books'
  | 'Cards/IDs'
  | 'Clothing'
  | 'Accessories'
  | 'Other';

export interface CampusItem {
  id: string;
  userId: string;
  type: ItemType;
  title: string;
  category: ItemCategory;
  description: string;
  location: string;
  dateTime: string;
  date?: string; // compatibility alias
  imageUrl?: string;
  additionalDetails?: string;
  university: string;
  status: 'active' | 'resolved' | 'matched' | 'lost' | 'found' | 'verifying';
  isReported?: boolean;
  reportedBy?: string; // compatibility alias
  reporterName?: string; // compatibility alias
  reward?: number;
  safeHandoverPoint?: string;
  verificationQuestion?: string;
  contactPreference?: 'chat' | 'whatsapp';
  createdAt: string;
}


export interface PossibleMatch {
  id: string;
  lostItemId: string;
  foundItemId: string;
  score: number; // 0 to 100 percentage
  reason: string;
  status: 'pending' | 'viewed' | 'dismissed' | 'matched';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface ChatSession {
  id: string;
  itemId?: string;
  participants: string[];
  messages: {
    id: string;
    senderId: string;
    text: string;
    timestamp: string;
  }[];
}


export interface Conversation {
  id: string;
  itemId?: string;
  itemTitle?: string;
  itemType?: ItemType;
  itemImage?: string;
  otherParticipantId: string;
  otherParticipantName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isBlocked?: boolean;
  isReported?: boolean;
}

export type NotificationType =
  | 'expense'
  | 'budget_alert'
  | 'match'
  | 'new_item'
  | 'verification'
  | 'announcement'
  | 'item'
  | 'money';

export interface NotificationItem {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  read?: boolean; // compatibility alias
  timestamp: string;
  relatedId?: string;
  linkTab?: string;
}

export interface UniversityConfig {
  id: string;
  name: string;
  shortName: string;
  state: string;
  faculties: {
    name: string;
    departments: string[];
  }[];
}

export interface PlatformAnnouncement {
  id: string;
  title: string;
  content: string;
  targetUniversity?: string;
  priority: 'normal' | 'urgent';
  createdAt: string;
}

export interface PlatformStats {
  totalStudents: number;
  verifiedStudents: number;
  lostReports: number;
  foundReports: number;
  possibleMatches: number;
  reportedUsers: number;
  activeUsers: number;
}
