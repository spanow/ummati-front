import { Organization, Event, Volunteer, Admin, Notification } from '../types';

export const mockAdmins: Admin[] = [
  {
    id: "admin1",
    firstName: "Philippe",
    lastName: "Leblanc",
    email: "admin@admin.com", // Admin login email
    password: "admin", // Admin password
    phone: "+33756781234",
    role: "Super Admin",
    organizationId: "1",
    lastLogin: "2025-01-02T08:45:12"
  }
];

export const mockVolunteers: Volunteer[] = [
  {
    id: "vol1",
    firstName: "Jean",
    lastName: "Dupont",
    email: "user@user.com", // Regular user login email
    password: "user", // Regular user password
    phone: "+33612345678",
    profilePicture: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80",
    skills: ["Logistique", "Premiers secours", "Communication"],
    availability: {
      monday: { morning: true, afternoon: false, evening: true },
      tuesday: { morning: false, afternoon: false, evening: true },
      wednesday: { morning: true, afternoon: true, evening: true },
      thursday: { morning: false, afternoon: false, evening: false },
      friday: { morning: false, afternoon: true, evening: true },
      saturday: { morning: true, afternoon: true, evening: false },
      sunday: { morning: true, afternoon: false, evening: false }
    },
    joinedOrganizations: ["1"],
    participatedEvents: ["event1"],
    preferredLanguage: "fr",
    registrationDate: "2023-05-20T14:23:45"
  }
];

export const mockOrganizations: Organization[] = [
  {
    id: "1",
    name: "Aide Humanitaire Internationale",
    description: "Organisation d'aide humanitaire opérant dans 15 pays",
    missionStatement: "Apporter de l'aide aux populations défavorisées",
    contactInfo: {
      email: "contact@ahi.org",
      phone: "+33123456789",
      address: "123 Rue de la Paix, Paris"
    },
    logo: "https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80",
    website: "https://www.ahi.org",
    foundedDate: "2005-03-15",
    adminIds: ["admin1", "admin2"],
    volunteerIds: ["vol1", "vol2", "vol3"],
    eventIds: ["event1", "event2"],
    documents: [
      { id: "doc1", name: "Statuts", url: "https://example.com/documents/statuts.pdf" },
      { id: "doc2", name: "Rapport annuel 2023", url: "https://example.com/documents/rapport-2023.pdf" }
    ]
  },
  {
    id: "2",
    name: "Éducation Pour Tous",
    description: "Favoriser l'accès à l'éducation dans les zones défavorisées",
    missionStatement: "Garantir l'accès à l'éducation pour tous les enfants",
    contactInfo: {
      email: "contact@ept.org",
      phone: "+33987654321",
      address: "45 Avenue des Écoles, Lyon"
    },
    logo: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80",
    website: "https://www.ept.org",
    foundedDate: "2010-09-01",
    adminIds: ["admin3"],
    volunteerIds: ["vol4", "vol5", "vol6", "vol7"],
    eventIds: ["event3", "event4", "event5"],
    documents: [
      { id: "doc3", name: "Statuts", url: "https://example.com/documents/statuts-ept.pdf" },
      { id: "doc4", name: "Rapport d'activité", url: "https://example.com/documents/rapport-activite-ept.pdf" }
    ]
  }
];

export const mockEvents: Event[] = [
  {
    id: "event1",
    title: "Distribution de repas - Janvier 2025",
    description: "Distribution de repas chauds aux sans-abris",
    organizationId: "1",
    location: {
      address: "Place de la République, Paris",
      latitude: 48.8673,
      longitude: 2.3632
    },
    startDate: "2025-01-15T18:00:00",
    endDate: "2025-01-15T22:00:00",
    capacity: 20,
    registeredVolunteers: ["vol1", "vol2", "vol3"],
    status: "upcoming",
    requirements: "Vêtements chauds, gants",
    createdBy: "admin1",
    createdAt: "2024-12-01T10:23:45",
    updatedAt: "2024-12-10T14:30:22"
  },
  {
    id: "event2",
    title: "Collecte de vêtements - Février 2025",
    description: "Collecte de vêtements pour les réfugiés",
    organizationId: "1",
    location: {
      address: "Centre commercial Les Halles, Paris",
      latitude: 48.8621,
      longitude: 2.3448
    },
    startDate: "2025-02-10T09:00:00",
    endDate: "2025-02-10T19:00:00",
    capacity: 15,
    registeredVolunteers: ["vol1", "vol4"],
    status: "upcoming",
    requirements: "Manutention possible",
    createdBy: "admin2",
    createdAt: "2024-12-15T08:45:30",
    updatedAt: "2024-12-16T16:12:08"
  },
  {
    id: "event3",
    title: "Atelier lecture pour enfants",
    description: "Animation d'ateliers de lecture pour enfants de 6 à 10 ans",
    organizationId: "2",
    location: {
      address: "Bibliothèque municipale, Lyon",
      latitude: 45.7640,
      longitude: 4.8357
    },
    startDate: "2025-01-20T14:00:00",
    endDate: "2025-01-20T17:00:00",
    capacity: 8,
    registeredVolunteers: ["vol5", "vol6"],
    status: "upcoming",
    requirements: "Expérience avec les enfants souhaitée",
    createdBy: "admin3",
    createdAt: "2024-12-05T11:20:15",
    updatedAt: "2024-12-20T09:34:27"
  }
];

export const mockNotifications: Notification[] = [
  {
    id: "notif1",
    userId: "vol1",
    title: "Rappel d'événement",
    message: "L'événement 'Distribution de repas' aura lieu demain à 18h00",
    type: "event_reminder",
    relatedId: "event1",
    read: false,
    createdAt: "2025-01-14T10:00:00"
  }
];