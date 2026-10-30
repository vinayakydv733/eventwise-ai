export type WorkspaceRole = 'OWNER' | 'ADMIN' | 'EDITOR' | 'VIEWER';

export type EventType =
  | 'WEDDING'
  | 'BIRTHDAY'
  | 'COMMUNITY'
  | 'CORPORATE'
  | 'WORKSHOP'
  | 'CUSTOM';

export type EventStatus = 'PLANNING' | 'CONFIRMED' | 'COMPLETED' | 'ARCHIVED';

export type ExpenseStatus = 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'BLOCKED' | 'COMPLETED';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type VendorBookingStatus =
  | 'TO_RESEARCH'
  | 'CONTACTED'
  | 'QUOTE_RECEIVED'
  | 'SHORTLISTED'
  | 'BOOKED'
  | 'CANCELLED';

export type VendorPaymentStatus =
  | 'NOT_DUE'
  | 'DEPOSIT_DUE'
  | 'PARTIALLY_PAID'
  | 'PAID'
  | 'REFUNDED';

export type RSVPStatus = 'ATTENDING' | 'DECLINED' | 'TENTATIVE' | 'NO_REPLY';

export type GuestGroup = 'FAMILY' | 'FRIENDS' | 'VIP' | 'GENERAL' | 'COLLEAGUES';

export type IdeaStatus = 'PROPOSED' | 'ACCEPTED' | 'REJECTED' | 'IMPLEMENTED';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  systemRole: string;
}

export interface WorkspaceSummary {
  id: string;
  name: string;
  slug: string;
  currency: string;
  locale: string;
  timezone: string;
  role: WorkspaceRole;
}

export interface EventDetail {
  id: string;
  workspaceId: string;
  creatorId: string;
  title: string;
  slug: string;
  type: EventType;
  status: EventStatus;
  startDate: string;
  endDate?: string | null;
  location: string;
  guestCount: number;
  budgetCeiling: number;
  currency: string;
  theme?: string | null;
  formality?: string | null;
  dietaryNotes?: string | null;
  accessibilityNotes?: string | null;
  notes?: string | null;
  coverImage?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetCategoryItem {
  id: string;
  eventId: string;
  name: string;
  allocatedAmount: number;
  color: string;
  icon?: string | null;
  note?: string | null;
  spentAmount?: number;
  remainingAmount?: number;
}

export interface ExpenseItem {
  id: string;
  eventId: string;
  categoryId: string;
  categoryName?: string;
  title: string;
  amount: number;
  status: ExpenseStatus;
  paymentDate?: string | null;
  receiptUrl?: string | null;
  vendorId?: string | null;
  vendorName?: string | null;
  notes?: string | null;
  isEstimated: boolean;
  createdAt: string;
}

export interface TaskItem {
  id: string;
  eventId: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | null;
  category?: string | null;
  assignedToId?: string | null;
  assignedToName?: string | null;
  estimatedHours?: number | null;
  order: number;
  dependencies?: string[];
}

export interface VendorItem {
  id: string;
  eventId: string;
  workspaceId: string;
  name: string;
  category: string;
  contactName?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  address?: string | null;
  quotedAmount?: number | null;
  bookingStatus: VendorBookingStatus;
  paymentStatus: VendorPaymentStatus;
  notes?: string | null;
  quoteCount?: number;
}

export interface GuestItem {
  id: string;
  eventId: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  group: GuestGroup;
  rsvpStatus: RSVPStatus;
  plusOnes: number;
  dietaryNeeds?: string | null;
  notes?: string | null;
  invitationSent: boolean;
}

export interface IdeaItem {
  id: string;
  eventId: string;
  title: string;
  description: string;
  category: string;
  impact: string;
  status: IdeaStatus;
  resources?: string | null;
}

export interface DashboardStats {
  totalBudget: number;
  totalEstimated: number;
  totalActual: number;
  remainingBudget: number;
  guestCount: number;
  rsvpCount: {
    attending: number;
    declined: number;
    tentative: number;
    noReply: number;
  };
  taskStats: {
    total: number;
    completed: number;
    inProgress: number;
    todo: number;
    overdue: number;
    percentComplete: number;
  };
  vendorStats: {
    total: number;
    booked: number;
    shortlisted: number;
    pending: number;
  };
  daysRemaining: number;
}

// Multi-Agent Structured AI Proposal Output
export interface AIPlanProposal {
  summary: string;
  theme: {
    name: string;
    description: string;
    colorPalette: string[];
    decorVibe: string;
  };
  budgetAllocations: Array<{
    category: string;
    amount: number;
    percentage: number;
    note: string;
    suggestedVendors?: string;
  }>;
  contingencyReserve: number;
  timeline: Array<{
    phase: string;
    timeframe: string;
    task: string;
    priority: TaskPriority;
    suggestedLeadDays: number;
    category: string;
  }>;
  vendorsNeeded: Array<{
    category: string;
    description: string;
    estimatedCost: number;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    keyQuestionsToAsk: string[];
  }>;
  creativeIdeas: Array<{
    title: string;
    category: string;
    description: string;
    estimatedCostImpact: 'Low' | 'Medium' | 'High';
  }>;
  risksAndMitigations: Array<{
    risk: string;
    severity: 'High' | 'Medium' | 'Low';
    mitigation: string;
  }>;
  isFallback: boolean;
}
