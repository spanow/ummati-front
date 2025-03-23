export interface Organization {
  id: string;
  name: string;
  description: string;
  missionStatement: string;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  logo: string;
  website: string;
  foundedDate: string;
  adminIds: string[];
  volunteerIds: string[];
  eventIds: string[];
  documents: {
    id: string;
    name: string;
    url: string;
  }[];
  stats?: {
    totalVolunteers: number;
    totalEvents: number;
    totalHours: number;
    impactScore: number;
  };
}

export interface Event {
  id: string;
  title: string;
  description: string;
  organizationId: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  startDate: string;
  endDate: string;
  capacity: number;
  registeredVolunteers: string[];
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  requirements: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  comments?: Comment[];
  tags?: string[];
  skills?: string[];
  impact?: {
    hoursContributed: number;
    peopleHelped: number;
    feedback: string[];
  };
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  likes: string[];
  replies?: Comment[];
}

export interface Volunteer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profilePicture: string;
  skills: string[];
  availability: {
    [key: string]: {
      morning: boolean;
      afternoon: boolean;
      evening: boolean;
    };
  };
  joinedOrganizations: string[];
  participatedEvents: string[];
  preferredLanguage: string;
  registrationDate: string;
  stats?: {
    totalHours: number;
    eventsAttended: number;
    skillsEndorsed: number;
    impactScore: number;
  };
  badges?: {
    id: string;
    name: string;
    description: string;
    earnedAt: string;
  }[];
}

export interface Admin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  organizationId: string;
  lastLogin: string;
  permissions?: string[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  relatedId: string;
  read: boolean;
  createdAt: string;
  action?: {
    type: string;
    label: string;
    url: string;
  };
}

export type NotificationType =
  | 'event_reminder'
  | 'event_registration'
  | 'event_cancelled'
  | 'event_updated'
  | 'organization_invite'
  | 'organization_update'
  | 'volunteer_application'
  | 'application_accepted'
  | 'application_rejected'
  | 'new_badge_earned'
  | 'skill_endorsed'
  | 'impact_milestone';

export type UserRole = 'guest' | 'volunteer' | 'admin' | 'super_admin';

export interface Badge {
  id: string;
  name: string;
  description: string;
  criteria: {
    type: string;
    value: number;
  };
  icon: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  endorsements: number;
}

export interface ImpactMetric {
  id: string;
  type: string;
  value: number;
  date: string;
  eventId?: string;
  organizationId?: string;
}