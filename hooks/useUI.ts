import { useContext } from 'react';
import { UIContext } from '@/stores/uiStore';

/**
 * Custom hook to use UI context
 */
export function useUI() {
  const context = useContext(UIContext);
  
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  
  return context;
}