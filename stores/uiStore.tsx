'use client';

import { createContext, useReducer, ReactNode } from 'react';
import { Notification } from '@/types';
import { NOTIFICATION_TYPES } from '@/lib/constants';

interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  notifications: Notification[];
}

interface UIContextType extends UIState {
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  removeNotification: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  toggleTheme: () => void;
}

export const UIContext = createContext<UIContextType | undefined>(undefined);

type UIAction =
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR_OPEN'; payload: boolean }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' }
  | { type: 'TOGGLE_THEME' };

const uiReducer = (state: UIState, action: UIAction): UIState => {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'SET_SIDEBAR_OPEN':
      return { ...state, sidebarOpen: action.payload };
    case 'ADD_NOTIFICATION':
      return { 
        ...state, 
        notifications: [action.payload, ...state.notifications.slice(0, 49)] // Keep max 50 notifications
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] };
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    default:
      return state;
  }
};

const initialState: UIState = {
  theme: 'light',
  sidebarOpen: false,
  notifications: [],
};

export function UIProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(uiReducer, initialState);

  const toggleSidebar = () => dispatch({ type: 'TOGGLE_SIDEBAR' });
  
  const setSidebarOpen = (open: boolean) => 
    dispatch({ type: 'SET_SIDEBAR_OPEN', payload: open });
  
  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });
  };

  const removeNotification = (id: string) => 
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  
  const markNotificationAsRead = (id: string) => 
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  
  const clearAllNotifications = () => 
    dispatch({ type: 'CLEAR_NOTIFICATIONS' });
  
  const toggleTheme = () => dispatch({ type: 'TOGGLE_THEME' });

  const contextValue: UIContextType = {
    ...state,
    toggleSidebar,
    setSidebarOpen,
    addNotification,
    removeNotification,
    markNotificationAsRead,
    clearAllNotifications,
    toggleTheme,
  };

  return (
    <UIContext.Provider value={contextValue}>
      {children}
    </UIContext.Provider>
  );
}