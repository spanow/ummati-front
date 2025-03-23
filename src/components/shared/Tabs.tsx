import { useState } from 'react';
import { motion } from 'framer-motion';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'pills' | 'underline';
}

function Tabs({ tabs, activeTab, onChange, variant = 'pills' }: TabsProps) {
  return (
    <div className={`flex space-x-2 ${variant === 'underline' ? 'border-b border-gray-200' : ''}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`
            relative px-4 py-2 rounded-lg transition-colors
            ${variant === 'pills'
              ? activeTab === tab.id
                ? 'text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              : activeTab === tab.id
              ? 'text-primary-600 border-b-2 border-primary-500'
              : 'text-gray-600 hover:text-gray-900'
            }
          `}
        >
          <div className="flex items-center space-x-2">
            {tab.icon}
            <span>{tab.label}</span>
          </div>
          {variant === 'pills' && activeTab === tab.id && (
            <motion.div
              layoutId="active-tab"
              className="absolute inset-0 bg-primary-500 rounded-lg -z-10"
              transition={{ type: 'spring', duration: 0.5 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}

export default Tabs;