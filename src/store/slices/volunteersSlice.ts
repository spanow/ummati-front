import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Volunteer } from '../../types';
import { mockVolunteers } from '../../mocks/data';

interface VolunteersState {
  volunteers: Volunteer[];
  loading: boolean;
  error: string | null;
}

const initialState: VolunteersState = {
  volunteers: mockVolunteers,
  loading: false,
  error: null,
};

const volunteersSlice = createSlice({
  name: 'volunteers',
  initialState,
  reducers: {
    setVolunteers: (state, action: PayloadAction<Volunteer[]>) => {
      state.volunteers = action.payload;
    },
    addVolunteer: (state, action: PayloadAction<Volunteer>) => {
      state.volunteers.push(action.payload);
    },
    updateVolunteer: (state, action: PayloadAction<Volunteer>) => {
      const index = state.volunteers.findIndex(vol => vol.id === action.payload.id);
      if (index !== -1) {
        state.volunteers[index] = action.payload;
      }
    },
  },
});

export const { setVolunteers, addVolunteer, updateVolunteer } = volunteersSlice.actions;
export default volunteersSlice.reducer;