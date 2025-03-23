import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Badge } from '../../types';

interface BadgesState {
  badges: Badge[];
  loading: boolean;
  error: string | null;
}

const initialState: BadgesState = {
  badges: [
    {
      id: 'first-event',
      name: 'First Steps',
      description: 'Participated in your first volunteer event',
      criteria: { type: 'events', value: 1 },
      icon: 'footprints'
    },
    {
      id: 'super-volunteer',
      name: 'Super Volunteer',
      description: 'Participated in 10 events',
      criteria: { type: 'events', value: 10 },
      icon: 'star'
    },
    {
      id: 'community-builder',
      name: 'Community Builder',
      description: 'Joined 3 different organizations',
      criteria: { type: 'organizations', value: 3 },
      icon: 'users'
    },
    {
      id: 'impact-maker',
      name: 'Impact Maker',
      description: 'Contributed over 50 hours',
      criteria: { type: 'hours', value: 50 },
      icon: 'heart'
    }
  ],
  loading: false,
  error: null,
};

const badgesSlice = createSlice({
  name: 'badges',
  initialState,
  reducers: {
    addBadge: (state, action: PayloadAction<Badge>) => {
      state.badges.push(action.payload);
    },
    updateBadge: (state, action: PayloadAction<Badge>) => {
      const index = state.badges.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.badges[index] = action.payload;
      }
    },
  },
});

export const { addBadge, updateBadge } = badgesSlice.actions;
export default badgesSlice.reducer;