export enum ProjectStage {
  CONCEPT = 'Site Analysis & Concept Inception',
  LAYOUTS = '2D Spatial Layouts & Planning',
  RENDERS = '3D High-Fidelity Modeling & 4K Renders',
  SPECIFICATIONS = 'FF&E Schedules, Material Sourcing & Specifications',
  CONSTRUCTION = 'Construction Documents, MEP & Site Supervision',
  HANDOVER = 'Final Handover, Furniture Staging & Lighting Fine-Tuning'
}

export enum StageStatus {
  COMPLETED = 'COMPLETED',
  IN_PROGRESS = 'IN_PROGRESS',
  UPCOMING = 'UPCOMING'
}

export interface Milestone {
  id: string;
  stage: ProjectStage;
  status: StageStatus;
  progress: number;
  date?: string;
  weight: number; // Percentage weight of this stage towards total completion
  attachment?: { name: string; url: string };
}

export interface UserProfile {
  id: string;
  name: string;
  tier: string;
  project: string;
  area: string;
  avatar: string;
  completion: number;
  style: string;
  location: string;
  status: 'Active' | 'Archived';
  freeConsultations: number; // Number of free consultations remaining
}

export interface ArchitectProfile {
  name: string;
  title: string;
  avatar: string;
}

export interface MaterialItem {
  id: string;
  title: string;
  type: string;
  status: 'Pending' | 'Approved' | 'Revision';
  img: string;
}

export interface InvoiceItem {
  id: string;
  desc: string;
  amount: number;
}

export interface InvoiceData {
  id: string;
  date: string;
  items: InvoiceItem[];
  status: 'Pending' | 'Paid';
}

export interface ChatMessage {
  id: string;
  sender: 'ARCHITECT' | 'CLIENT' | 'SUPPORT';
  text: string;
  attachment?: { name: string; size: string; url?: string };
  timestamp: string;
}

export interface ContractData {
  isSignedByClient: boolean;
  isSealedByArchitect: boolean;
}

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: 'Under Review' | 'In Progress' | 'Resolved';
  date: string;
  architectNotes?: string;
}

export interface Booking {
  id: string;
  date: number;
  time: string; // e.g., "09:00"
  durationHours: number; // e.g., 2
  type: 'In-Studio' | 'Virtual' | 'Site Visit';
  status: 'Pending' | 'Confirmed' | 'Rescheduled';
  initiatedBy: 'CLIENT' | 'ARCHITECT';
  cost?: number;
}

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low';
}

export interface ClientProjectData {
  profile: UserProfile;
  milestones: Milestone[];
  materials: MaterialItem[];
  invoice: InvoiceData;
  chatHistory: ChatMessage[];
  contract: ContractData;
  tickets: Ticket[];
  bookings: Booking[];
  tasks: Task[];
  hasUnreadMessages: boolean;
  hasPendingApprovals: boolean;
  hasNewTickets: boolean;
}

export interface BlockedSlot {
  id: string;
  date: number;
  time: string | 'ALL_DAY'; // e.g., "09:00" or "ALL_DAY"
  durationHours: number; // How many hours to block
  reason: string;
}

export enum ViewModule {
  DASHBOARD = 'DASHBOARD',
  PACKAGES = 'PACKAGES',
  VISION_BUILDER = 'VISION_BUILDER',
  PORTFOLIO_VR = 'PORTFOLIO_VR',
  BOOKING = 'BOOKING',
  CHAT = 'CHAT',
  APPROVALS = 'APPROVALS',
  CONTRACTS = 'CONTRACTS',
  INVOICE = 'INVOICE',
  SUPPORT = 'SUPPORT',
  PROFILE = 'PROFILE',
  // Admin Modules
  ADMIN_DIRECTORY = 'ADMIN_DIRECTORY',
  ADMIN_ARCHIVE = 'ADMIN_ARCHIVE',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  ADMIN_APPROVALS = 'ADMIN_APPROVALS',
  ADMIN_FINANCE = 'ADMIN_FINANCE',
  ADMIN_CHAT = 'ADMIN_CHAT',
  ADMIN_CONTRACTS = 'ADMIN_CONTRACTS',
  ADMIN_BOOKINGS = 'ADMIN_BOOKINGS',
  ADMIN_PROFILE = 'ADMIN_PROFILE',
  ADMIN_TASKS = 'ADMIN_TASKS',
  ADMIN_CALENDAR = 'ADMIN_CALENDAR',
  // Support Modules
  SUPPORT_DASHBOARD = 'SUPPORT_DASHBOARD',
  SUPPORT_TICKETS = 'SUPPORT_TICKETS',
  SUPPORT_FINANCE = 'SUPPORT_FINANCE',
  SUPPORT_CHAT = 'SUPPORT_CHAT'
}

export type Role = 'GUEST' | 'CLIENT' | 'ARCHITECT' | 'SUPPORT';

export interface GlobalState {
  architectProfile: ArchitectProfile;
  clients: Record<string, ClientProjectData>;
  activeClientId: string;
  blockedSlots: BlockedSlot[];
}
