import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import organizationsReducer from './slices/organizationsSlice';
import eventsReducer from './slices/eventsSlice';
import notificationsReducer from './slices/notificationsSlice';
import volunteersReducer from './slices/volunteersSlice';
import chatReducer from './slices/chatSlice';
import commentsReducer from './slices/commentsSlice';
import badgesReducer from './slices/badgesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    organizations: organizationsReducer,
    events: eventsReducer,
    notifications: notificationsReducer,
    volunteers: volunteersReducer,
    chat: chatReducer,
    comments: commentsReducer,
    badges: badgesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;