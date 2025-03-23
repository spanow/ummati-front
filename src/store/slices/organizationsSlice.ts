import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Organization } from '../../types';
import { mockOrganizations } from '../../mocks/data';

interface OrganizationsState {
  organizations: Organization[];
  loading: boolean;
  error: string | null;
}

const initialState: OrganizationsState = {
  organizations: mockOrganizations,
  loading: false,
  error: null,
};

const organizationsSlice = createSlice({
  name: 'organizations',
  initialState,
  reducers: {
    setOrganizations: (state, action: PayloadAction<Organization[]>) => {
      state.organizations = action.payload;
    },
    addOrganization: (state, action: PayloadAction<Organization>) => {
      state.organizations.push(action.payload);
    },
    updateOrganization: (state, action: PayloadAction<Organization>) => {
      const index = state.organizations.findIndex(org => org.id === action.payload.id);
      if (index !== -1) {
        state.organizations[index] = action.payload;
      }
    },
  },
});

export const { setOrganizations, addOrganization, updateOrganization } = organizationsSlice.actions;
export default organizationsSlice.reducer;