import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Event } from '../../types';
import { mockEvents } from '../../mocks/data';

interface EventsState {
  events: Event[];
  loading: boolean;
  error: string | null;
  userFavorites: string[];
}

const initialState: EventsState = {
  events: mockEvents,
  loading: false,
  error: null,
  userFavorites: [],
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<Event[]>) => {
      state.events = action.payload;
    },
    addEvent: (state, action: PayloadAction<Event>) => {
      state.events.push(action.payload);
    },
    updateEvent: (state, action: PayloadAction<Event>) => {
      const index = state.events.findIndex(event => event.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = action.payload;
      }
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const eventId = action.payload;
      if (state.userFavorites.includes(eventId)) {
        state.userFavorites = state.userFavorites.filter(id => id !== eventId);
      } else {
        state.userFavorites.push(eventId);
      }
    },
    cancelEvent: (state, action: PayloadAction<string>) => {
      const event = state.events.find(e => e.id === action.payload);
      if (event) {
        event.status = 'cancelled';
      }
    },
    startEvent: (state, action: PayloadAction<string>) => {
      const event = state.events.find(e => e.id === action.payload);
      if (event) {
        event.status = 'ongoing';
      }
    },
    completeEvent: (state, action: PayloadAction<string>) => {
      const event = state.events.find(e => e.id === action.payload);
      if (event) {
        event.status = 'completed';
      }
    },
  },
});

export const {
  setEvents,
  addEvent,
  updateEvent,
  toggleFavorite,
  cancelEvent,
  startEvent,
  completeEvent,
} = eventsSlice.actions;
export default eventsSlice.reducer;