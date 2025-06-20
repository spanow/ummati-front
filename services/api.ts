import { User, ONG, Event, Filters } from '@/types';
import usersData from '@/data/users.json';
import ongsData from '@/data/ongs.json';
import eventsData from '@/data/events.json';

// Simulate network delay for realistic API behavior
const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

// Type-safe mock database initialization
const users: User[] = usersData.map(user => ({
  ...user,
  createdAt: new Date(user.createdAt),
  updatedAt: new Date(user.updatedAt),
})) as User[];

const ongs: ONG[] = ongsData.map(ong => ({
  ...ong,
  createdAt: new Date(ong.createdAt),
})) as ONG[];

const events: Event[] = eventsData.map(event => ({
  ...event,
  startDate: new Date(event.startDate),
  endDate: new Date(event.endDate),
  createdAt: new Date(event.createdAt),
})) as Event[];

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface AuthResponse {
  token: string;
  user: User;
}

export const api = {
  auth: {
    async login(email: string, password: string): Promise<AuthResponse> {
      await delay(800);
      
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) {
        throw new Error('Email ou mot de passe incorrect');
      }
      
      const { password: _, ...userWithoutPassword } = user;
      return {
        token: `mock-jwt-token-${user.id}`,
        user: userWithoutPassword as User,
      };
    },

    async register(data: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      role: string;
    }): Promise<AuthResponse> {
      await delay(1000);
      
      const existingUser = users.find(u => u.email === data.email);
      if (existingUser) {
        throw new Error('Cet email est déjà utilisé');
      }

      const newUser: User = {
        id: (users.length + 1).toString(),
        ...data,
        role: data.role as 'volunteer' | 'ong_admin' | 'super_admin',
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      users.push(newUser);
      
      const { password: _, ...userWithoutPassword } = newUser;
      return {
        token: `mock-jwt-token-${newUser.id}`,
        user: userWithoutPassword as User,
      };
    },

    async updateProfile(userId: string, data: Partial<User>): Promise<User> {
      await delay(600);
      
      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        throw new Error('Utilisateur non trouvé');
      }

      users[userIndex] = {
        ...users[userIndex],
        ...data,
        updatedAt: new Date(),
      };

      const { password: _, ...userWithoutPassword } = users[userIndex];
      return userWithoutPassword as User;
    },
  },

  ongs: {
    async getAll(filters?: Filters): Promise<PaginatedResponse<ONG>> {
      await delay(400);
      
      let filteredOngs = [...ongs];

      if (filters?.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredOngs = filteredOngs.filter(ong =>
          ong.name.toLowerCase().includes(searchTerm) ||
          ong.description.toLowerCase().includes(searchTerm)
        );
      }

      if (filters?.category) {
        filteredOngs = filteredOngs.filter(ong => ong.category === filters.category);
      }

      if (filters?.city) {
        const cityTerm = filters.city.toLowerCase();
        filteredOngs = filteredOngs.filter(ong =>
          ong.city.toLowerCase().includes(cityTerm)
        );
      }

      const page = filters?.page || 1;
      const limit = filters?.limit || 12;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      return {
        data: filteredOngs.slice(startIndex, endIndex),
        total: filteredOngs.length,
        page,
        limit,
        totalPages: Math.ceil(filteredOngs.length / limit),
      };
    },

    async getById(id: string): Promise<ONG> {
      await delay(300);
      
      const ong = ongs.find(o => o.id === id);
      if (!ong) {
        throw new Error('ONG non trouvée');
      }
      
      return ong;
    },

    async join(ongId: string, userId: string): Promise<ONG> {
      await delay(500);
      
      const ongIndex = ongs.findIndex(o => o.id === ongId);
      if (ongIndex === -1) {
        throw new Error('ONG non trouvée');
      }

      if (!ongs[ongIndex].volunteerIds.includes(userId)) {
        ongs[ongIndex].volunteerIds.push(userId);
        ongs[ongIndex].stats.totalVolunteers += 1;
      }

      return ongs[ongIndex];
    },
  },

  events: {
    async getAll(filters?: Filters): Promise<PaginatedResponse<Event>> {
      await delay(400);
      
      let filteredEvents = [...events];

      if (filters?.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredEvents = filteredEvents.filter(event =>
          event.title.toLowerCase().includes(searchTerm) ||
          event.description.toLowerCase().includes(searchTerm)
        );
      }

      if (filters?.category) {
        filteredEvents = filteredEvents.filter(event => event.category === filters.category);
      }

      if (filters?.city) {
        const cityTerm = filters.city.toLowerCase();
        filteredEvents = filteredEvents.filter(event =>
          event.city.toLowerCase().includes(cityTerm)
        );
      }

      // Sort by start date
      filteredEvents.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

      const page = filters?.page || 1;
      const limit = filters?.limit || 12;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      return {
        data: filteredEvents.slice(startIndex, endIndex),
        total: filteredEvents.length,
        page,
        limit,
        totalPages: Math.ceil(filteredEvents.length / limit),
      };
    },

    async getById(id: string): Promise<Event> {
      await delay(300);
      
      const event = events.find(e => e.id === id);
      if (!event) {
        throw new Error('Événement non trouvé');
      }
      
      return event;
    },

    async register(eventId: string, userId: string): Promise<Event> {
      await delay(600);
      
      const eventIndex = events.findIndex(e => e.id === eventId);
      if (eventIndex === -1) {
        throw new Error('Événement non trouvé');
      }

      const event = events[eventIndex];
      if (event.currentParticipants >= event.maxParticipants) {
        throw new Error('Événement complet');
      }

      if (!event.participantIds.includes(userId)) {
        event.participantIds.push(userId);
        event.currentParticipants += 1;
      }

      return event;
    },

    async create(data: Omit<Event, 'id' | 'createdAt' | 'currentParticipants' | 'participantIds'>): Promise<Event> {
      await delay(800);
      
      const newEvent: Event = {
        ...data,
        id: (events.length + 1).toString(),
        currentParticipants: 0,
        participantIds: [],
        createdAt: new Date(),
      };

      events.push(newEvent);
      return newEvent;
    },

    async update(id: string, data: Partial<Event>): Promise<Event> {
      await delay(600);
      
      const eventIndex = events.findIndex(e => e.id === id);
      if (eventIndex === -1) {
        throw new Error('Événement non trouvé');
      }

      events[eventIndex] = {
        ...events[eventIndex],
        ...data,
      };

      return events[eventIndex];
    },

    async delete(id: string): Promise<boolean> {
      await delay(400);
      
      const eventIndex = events.findIndex(e => e.id === id);
      if (eventIndex === -1) {
        throw new Error('Événement non trouvé');
      }

      events.splice(eventIndex, 1);
      return true;
    },
  },
};