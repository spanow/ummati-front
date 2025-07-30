export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'volunteer' | 'ong_admin' | 'super_admin';
  emailVerified: boolean;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Volunteer extends User {
  skills: string[];
  availability: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  bio?: string;
  location: string;
}

export interface ONG {
  id: string;
  name: string;
  acronym?: string;
  description: string;
  mission: string;
  logo?: string;
  website?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  category: 'humanitaire' | 'environnement' | 'education' | 'sante' | 'culture' | 'sport' | 'social';
  status: 'pending' | 'active' | 'suspended';
  documentsVerified: boolean;
  createdAt: Date;
  adminIds: string[];
  volunteerIds: string[];
  stats: {
    totalVolunteers: number;
    totalEvents: number;
    totalHours: number;
  };
}

export interface Event {
  id: string;
  ongId: string;
  title: string;
  description: string;
  category: 'mission' | 'collecte' | 'formation' | 'sensibilisation' | 'autre';
  startDate: Date;
  endDate: Date;
  location: string;
  address: string;
  city: string;
  maxParticipants: number;
  currentParticipants: number;
  requirements?: string[];
  image?: string;
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
  createdBy: string;
  createdAt: Date;
  participantIds: string[];
}

export interface Participation {
  id: string;
  userId: string;
  eventId: string;
  status: 'registered' | 'attended' | 'cancelled' | 'no_show';
  registeredAt: Date;
  attendedAt?: Date;
  hoursContributed: number;
  participantRating?: number;
  participantFeedback?: string;
  organizerRating?: number;
  organizerFeedback?: string;
  skills?: string[];
  notes?: string;
}

export interface EventEvaluation {
  id: string;
  eventId: string;
  participantId: string;
  rating: number;
  comment: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  dislikes: number;
  reactions: {
    userId: string;
    type: 'like' | 'dislike';
    createdAt: Date;
  }[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Filters {
  search?: string;
  category?: string;
  city?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export type Language = 'fr' | 'en' | 'ar';

export interface LanguageState {
  currentLanguage: Language;
  isRTL: boolean;
}