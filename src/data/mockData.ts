import {
  UniversityConfig,
  User,
  Expense,
  Income,
  SavingsGoal,
  CampusItem,
  PossibleMatch,
  Conversation,
  ChatMessage,
  NotificationItem,
  PlatformAnnouncement,
} from '../types';

export const UNIVERSITIES: UniversityConfig[] = [
  {
    id: 'unilag',
    name: 'University of Lagos',
    shortName: 'UNILAG',
    state: 'Lagos',
    faculties: [
      {
        name: 'Faculty of Science',
        departments: [
          'Computer Science',
          'Mathematics',
          'Physics',
          'Chemistry',
          'Microbiology',
          'Biochemistry',
        ],
      },
      {
        name: 'Faculty of Engineering',
        departments: [
          'Civil Engineering',
          'Mechanical Engineering',
          'Electrical/Electronics',
          'Chemical Engineering',
          'Systems Engineering',
        ],
      },
      {
        name: 'Faculty of Social Sciences',
        departments: ['Economics', 'Mass Communication', 'Political Science', 'Sociology', 'Psychology'],
      },
      {
        name: 'Faculty of Arts',
        departments: ['English', 'Philosophy', 'History and Strategic Studies', 'Creative Arts'],
      },
      {
        name: 'Faculty of Management Sciences',
        departments: ['Accounting', 'Finance', 'Business Administration', 'Industrial Relations'],
      },
    ],
  },
  {
    id: 'ui',
    name: 'University of Ibadan',
    shortName: 'UI',
    state: 'Oyo',
    faculties: [
      {
        name: 'Faculty of Technology',
        departments: ['Agricultural & Environmental', 'Civil Engineering', 'Electrical Engineering', 'Mechanical Engineering'],
      },
      {
        name: 'Faculty of Science',
        departments: ['Computer Science', 'Statistics', 'Chemistry', 'Physics', 'Geology'],
      },
      {
        name: 'Faculty of Pharmacy',
        departments: ['Pharmaceutics', 'Clinical Pharmacy', 'Pharmaceutical Chemistry'],
      },
      {
        name: 'Faculty of Arts',
        departments: ['Communication and Language Arts', 'English', 'Linguistics', 'Theatre Arts'],
      },
    ],
  },
  {
    id: 'oau',
    name: 'Obafemi Awolowo University',
    shortName: 'OAU',
    state: 'Osun',
    faculties: [
      {
        name: 'Faculty of Technology',
        departments: ['Computer Science and Engineering', 'Electronic and Electrical', 'Mechanical', 'Materials Science'],
      },
      {
        name: 'Faculty of Administration',
        departments: ['Management and Accounting', 'Public Administration', 'International Relations'],
      },
      {
        name: 'Faculty of Environmental Design',
        departments: ['Architecture', 'Building', 'Urban and Regional Planning'],
      },
    ],
  },
  {
    id: 'covenant',
    name: 'Covenant University',
    shortName: 'CU',
    state: 'Ogun',
    faculties: [
      {
        name: 'College of Science and Technology',
        departments: ['Computer Science', 'Management Information Systems', 'Civil Engineering', 'Electrical and Information'],
      },
      {
        name: 'College of Management and Social Sciences',
        departments: ['Economics', 'Accounting', 'Banking & Finance', 'Mass Communication'],
      },
    ],
  },
  {
    id: 'futa',
    name: 'Federal University of Technology Akure',
    shortName: 'FUTA',
    state: 'Ondo',
    faculties: [
      {
        name: 'School of Computing',
        departments: ['Computer Science', 'Software Engineering', 'Information Technology', 'Cybersecurity'],
      },
      {
        name: 'School of Engineering and Engineering Technology',
        departments: ['Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering', 'Metallurgical Engineering'],
      },
    ],
  },
];

export const CAMPUS_LOCATIONS: string[] = [
  'University Library',
  'Main Campus Security Gate',
  'Faculty of Science Complex',
  'Faculty of Engineering Workshop',
  'Faculty of Arts Quadrangle',
  'Student Affairs Division',
  'Senate Building Plaza',
  'Main Auditorium / Hall',
  'Sports Center / Gym',
  'New Hall / Hostel Cafeteria',
  'Medical Center / Clinic',
  'Campus Bank / ATM Gallery',
];

export const INITIAL_STUDENT_USER: User = {
  id: 'user_student_1',
  fullName: 'Taofiq Adeleke',
  email: 'taofiq.adeleke@student.unilag.edu.ng',
  phoneNumber: '+234 812 345 6789',
  university: 'University of Lagos',
  faculty: 'Faculty of Science',
  department: 'Computer Science',
  level: '300 Level',
  matricNumber: '190408042',
  role: 'student',
  verificationStatus: 'verified',
  verificationSubmittedAt: '2026-02-10T10:30:00Z',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  createdAt: '2026-01-15T08:00:00Z',
};

export const INITIAL_ADMIN_USER: User = {
  id: 'user_admin_1',
  fullName: 'Dr. Kelechi Okafor',
  email: 'admin.dsa@unilag.edu.ng',
  phoneNumber: '+234 803 123 4567',
  university: 'University of Lagos',
  faculty: 'Dean of Student Affairs',
  department: 'Student Affairs Division',
  level: 'Staff',
  matricNumber: 'ADMIN-DSA-001',
  role: 'admin',
  verificationStatus: 'verified',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  createdAt: '2025-10-01T00:00:00Z',
};

export const INITIAL_OTHER_STUDENTS: User[] = [
  {
    id: 'user_student_2',
    fullName: 'Chioma Okonkwo',
    email: 'chioma.okonkwo@student.unilag.edu.ng',
    phoneNumber: '+234 809 876 5432',
    university: 'University of Lagos',
    faculty: 'Faculty of Management Sciences',
    department: 'Accounting',
    level: '200 Level',
    matricNumber: '210502011',
    role: 'student',
    verificationStatus: 'pending',
    verificationSubmittedAt: '2026-09-08T14:15:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    createdAt: '2026-09-08T14:00:00Z',
  },
  {
    id: 'user_student_3',
    fullName: 'Babajide Fashola',
    email: 'b.fashola@student.unilag.edu.ng',
    phoneNumber: '+234 701 234 5678',
    university: 'University of Lagos',
    faculty: 'Faculty of Engineering',
    department: 'Electrical/Electronics',
    level: '400 Level',
    matricNumber: '180203055',
    role: 'student',
    verificationStatus: 'verified',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    createdAt: '2026-02-20T09:00:00Z',
  },
  {
    id: 'user_student_4',
    fullName: 'Zainab Danjuma',
    email: 'zainab.d@student.unilag.edu.ng',
    phoneNumber: '+234 814 555 1212',
    university: 'University of Lagos',
    faculty: 'Faculty of Arts',
    department: 'Creative Arts',
    level: '100 Level',
    matricNumber: '230101089',
    role: 'student',
    verificationStatus: 'rejected',
    verificationSubmittedAt: '2026-09-06T11:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    createdAt: '2026-09-05T12:00:00Z',
  },
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp_1',
    userId: 'user_student_1',
    amount: 1500,
    category: 'Food',
    date: '2026-09-08',
    note: 'Jollof rice and chicken at New Hall Cafeteria',
    createdAt: '2026-09-08T13:45:00Z',
  },
  {
    id: 'exp_2',
    userId: 'user_student_1',
    amount: 800,
    category: 'Transport',
    date: '2026-09-08',
    note: 'Campus shuttle bus back and forth from Gate to Science',
    createdAt: '2026-09-08T09:10:00Z',
  },
  {
    id: 'exp_3',
    userId: 'user_student_1',
    amount: 1000,
    category: 'Data/Airtime',
    date: '2026-09-07',
    note: 'MTN 1.5GB study data bundle',
    createdAt: '2026-09-07T18:20:00Z',
  },
  {
    id: 'exp_4',
    userId: 'user_student_1',
    amount: 3500,
    category: 'Education',
    date: '2026-09-05',
    note: 'CSC 301 course textbook and lab handout printing',
    createdAt: '2026-09-05T11:30:00Z',
  },
  {
    id: 'exp_5',
    userId: 'user_student_1',
    amount: 2200,
    category: 'Food',
    date: '2026-09-04',
    note: 'Groceries: indomie carton slices, milk, beverages',
    createdAt: '2026-09-04T16:00:00Z',
  },
  {
    id: 'exp_6',
    userId: 'user_student_1',
    amount: 1200,
    category: 'Entertainment',
    date: '2026-09-03',
    note: 'Cinema ticket at Ozone Yaba with course mates',
    createdAt: '2026-09-03T20:15:00Z',
  },
];

export const INITIAL_INCOMES: Income[] = [
  {
    id: 'inc_1',
    userId: 'user_student_1',
    amount: 30000,
    source: 'Allowance',
    date: '2026-09-01',
    note: 'Monthly pocket allowance from Dad',
    createdAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'inc_2',
    userId: 'user_student_1',
    amount: 15000,
    source: 'Freelance',
    date: '2026-09-04',
    note: 'Built landing page for campus boutique',
    createdAt: '2026-09-04T15:00:00Z',
  },
];

export const INITIAL_SAVINGS_GOALS: SavingsGoal[] = [
  {
    id: 'goal_1',
    userId: 'user_student_1',
    title: 'New Laptop',
    targetAmount: 350000,
    savedAmount: 120000,
    category: 'Education & Tech',
    targetDate: '2026-12-15',
    createdAt: '2026-08-01T00:00:00Z',
  },
  {
    id: 'goal_2',
    userId: 'user_student_1',
    title: 'Final Year Project Fund',
    targetAmount: 60000,
    savedAmount: 28000,
    category: 'Academic',
    targetDate: '2026-11-30',
    createdAt: '2026-08-15T00:00:00Z',
  },
];

export const INITIAL_CAMPUS_ITEMS: CampusItem[] = [
  {
    id: 'item_lost_1',
    userId: 'user_student_1',
    type: 'lost',
    title: 'Black HP Laptop Backpack',
    category: 'Bags',
    description: 'Black water-resistant backpack containing CSC 301 notebooks, blue water bottle, and calculator in the side pouch.',
    location: 'University Library (First Floor Reading Room)',
    dateTime: 'Yesterday, 4:30 PM',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80',
    additionalDetails: 'Has a small green keychain clip attached to front zipper.',
    university: 'University of Lagos',
    status: 'active',
    createdAt: '2026-09-08T17:00:00Z',
  },
  {
    id: 'item_found_1',
    userId: 'user_student_3',
    type: 'found',
    title: 'Black Backpack with Notebooks',
    category: 'Bags',
    description: 'Found a dark black backpack resting on chair near corner aisle in main library. Handed safely to library security desk.',
    location: 'University Library (Ground Floor Desk)',
    dateTime: 'Yesterday, 5:15 PM',
    imageUrl: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=500&auto=format&fit=crop&q=80',
    additionalDetails: 'Checked inside for ID card but only saw science lecture notes.',
    university: 'University of Lagos',
    status: 'active',
    createdAt: '2026-09-08T18:00:00Z',
  },
  {
    id: 'item_found_2',
    userId: 'user_student_2',
    type: 'found',
    title: 'Casio FX-991EX Scientific Calculator',
    category: 'Electronics',
    description: 'Found on the 3rd row desk in Large Lecture Theatre (LT2) after MTH 101 class.',
    location: 'Faculty of Science (LT2)',
    dateTime: 'Today, 11:30 AM',
    imageUrl: 'https://images.unsplash.com/photo-1611117775350-ac3950990985?w=500&auto=format&fit=crop&q=80',
    university: 'University of Lagos',
    status: 'active',
    createdAt: '2026-09-09T11:45:00Z',
  },
  {
    id: 'item_lost_2',
    userId: 'user_student_4',
    type: 'lost',
    title: 'Student ID Card & Access Badge',
    category: 'Cards/IDs',
    description: 'Plastic UNILAG student identity card bearing matric number ending in 089. Lost around Faculty of Arts pavilion.',
    location: 'Faculty of Arts Quadrangle',
    dateTime: 'Two days ago, 2:00 PM',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500&auto=format&fit=crop&q=80',
    university: 'University of Lagos',
    status: 'active',
    createdAt: '2026-09-07T15:00:00Z',
  },
  {
    id: 'item_found_3',
    userId: 'user_student_1',
    type: 'found',
    title: 'Set of Dorm Keys with Toyota Lanyard',
    category: 'Keys',
    description: 'Three bronze door keys on a black & red woven lanyard found on the bench outside sports center.',
    location: 'Jaja Sports Complex Pavilion',
    dateTime: 'Today, 8:45 AM',
    imageUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=500&auto=format&fit=crop&q=80',
    university: 'University of Lagos',
    status: 'active',
    createdAt: '2026-09-09T09:00:00Z',
  },
];

export const INITIAL_MATCHES: PossibleMatch[] = [
  {
    id: 'match_1',
    lostItemId: 'item_lost_1',
    foundItemId: 'item_found_1',
    score: 92,
    reason: 'Both reports describe a black backpack with notebooks located at the University Library within 45 minutes of each other.',
    status: 'pending',
    createdAt: '2026-09-08T18:15:00Z',
  },
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_1',
    itemId: 'item_lost_1',
    itemTitle: 'Black HP Laptop Backpack',
    itemType: 'lost',
    itemImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80',
    otherParticipantId: 'user_student_3',
    otherParticipantName: 'Babajide (Finder)',
    lastMessage: 'Hi! I saw your lost backpack post. I dropped it with the head librarian on ground floor.',
    lastMessageTime: 'Yesterday, 6:05 PM',
    unreadCount: 1,
  },
];

export const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  conv_1: [
    {
      id: 'msg_1',
      senderId: 'user_student_3',
      receiverId: 'user_student_1',
      text: 'Hi Taofiq! Saw your post about the black backpack at the library.',
      timestamp: 'Yesterday, 5:55 PM',
      isRead: true,
    },
    {
      id: 'msg_2',
      senderId: 'user_student_1',
      receiverId: 'user_student_3',
      text: 'Hello Babajide! Yes please, does it have a CSC 301 book inside?',
      timestamp: 'Yesterday, 6:00 PM',
      isRead: true,
    },
    {
      id: 'msg_3',
      senderId: 'user_student_3',
      receiverId: 'user_student_1',
      text: 'Yes exactly! I handed it over to the librarian at the front security desk so you can pick it up safely anytime with your matric card.',
      timestamp: 'Yesterday, 6:05 PM',
      isRead: false,
    },
  ],
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    userId: 'user_student_1',
    type: 'match',
    title: '🔔 Possible Match Found',
    message: 'Babajide reported a found "Black Backpack with Notebooks" at University Library matching your report.',
    isRead: false,
    timestamp: 'Yesterday, 6:05 PM',
    relatedId: 'match_1',
    linkTab: 'lost-found',
  },
  {
    id: 'notif_2',
    userId: 'user_student_1',
    type: 'expense',
    title: '💰 Daily Spending Update',
    message: 'You spent ₦2,300 today. You have ₦1,250 remaining for your recommended daily target.',
    isRead: false,
    timestamp: 'Today, 2:00 PM',
    linkTab: 'money',
  },
  {
    id: 'notif_3',
    userId: 'user_student_1',
    type: 'verification',
    title: '🔐 Student Account Verified',
    message: 'Congratulations! Your UNILAG student status has been officially verified by campus administration.',
    isRead: true,
    timestamp: '2026-02-10T10:30:00Z',
    linkTab: 'profile',
  },
  {
    id: 'notif_4',
    userId: 'user_student_1',
    type: 'new_item',
    title: '📦 New Item Reported Nearby',
    message: 'A Casio Calculator was reported found near Faculty of Science.',
    isRead: true,
    timestamp: 'Today, 11:50 AM',
    linkTab: 'lost-found',
  },
];

export const INITIAL_ANNOUNCEMENTS: PlatformAnnouncement[] = [
  {
    id: 'ann_1',
    title: 'First Semester Examination Schedule Released',
    content: 'All faculty exam timetables are now pinned at department bulletin boards and student portals. Prepare early!',
    targetUniversity: 'University of Lagos',
    priority: 'urgent',
    createdAt: '2026-09-07T08:00:00Z',
  },
  {
    id: 'ann_2',
    title: 'Campus Lost & Found Safety Protocol',
    content: 'When meeting someone to recover a found item, always meet in daylight at public locations like the Library Entrance or Security Post.',
    priority: 'normal',
    createdAt: '2026-09-01T09:00:00Z',
  },
];

export function formatNaira(amount: number): string {
  return '₦' + amount.toLocaleString('en-NG');
}
