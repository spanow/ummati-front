'use client';

import { createContext, useReducer, useEffect, ReactNode } from 'react';
import { Language, LanguageState } from '@/types';
import { STORAGE_KEYS } from '@/lib/constants';
import { getTranslation } from '@/lib/translations';

interface LanguageContextType extends LanguageState {
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

type LanguageAction = { type: 'SET_LANGUAGE'; payload: Language };

const languageReducer = (state: LanguageState, action: LanguageAction): LanguageState => {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return {
        ...state,
        currentLanguage: action.payload,
        isRTL: action.payload === 'ar',
      };
    default:
      return state;
  }
};

const initialState: LanguageState = {
  currentLanguage: 'fr',
  isRTL: false,
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(languageReducer, initialState);

  useEffect(() => {
    const savedLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE) as Language;
    if (savedLanguage && ['fr', 'en', 'ar'].includes(savedLanguage)) {
      dispatch({ type: 'SET_LANGUAGE', payload: savedLanguage });
    }
  }, []);

  useEffect(() => {
    // Update document attributes
    document.documentElement.dir = state.isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = state.currentLanguage;
    
    // Update body class for RTL styling
    if (state.isRTL) {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }, [state.isRTL, state.currentLanguage]);

  const setLanguage = (language: Language) => {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
    dispatch({ type: 'SET_LANGUAGE', payload: language });
  };

  const t = (key: string): string => {
    return getTranslation(state.currentLanguage, key);
  };

  const contextValue: LanguageContextType = {
    ...state,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}