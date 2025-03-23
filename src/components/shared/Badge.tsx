import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import Tooltip from './Tooltip';

interface BadgeProps {
  type?: 'achievement' | 'level' | 'skill';
  color?: string;
  icon?: React.ReactNode;
  label: string;
  description?: string;
  earned?: boolean;
  progress?: number;
}

function Badge({
  type = 'achievement',
  color = 'primary',
  icon = <Star className="h-5 w-5" />,
  label,
  description,
  earned = false,
  progress
}: BadgeProps) {
  const colors = {
    primary: 'from-primary-500 to-primary-600',
    secondary: 'from-secondary-500 to-secondary-600',
    success: 'from-green-500 to-green-600',
    warning: 'from-yellow-500 to-yellow-600',
    danger: 'from-red-500 to-red-600',
    info: 'from-blue-500 to-blue-600'
  };

  return (
    <Tooltip content={description || label}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative inline-flex items-center justify-center ${
          earned
            ? `bg-gradient-to-br ${colors[color as keyof typeof colors]} text-white`
            : 'bg-gray-100 text-gray-400'
        } rounded-full p-3 transition-all duration-200`}
      >
        {progress !== undefined && (
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              className="text-gray-200"
              strokeWidth="2"
              stroke="currentColor"
              fill="transparent"
              r="48%"
              cx="50%"
              cy="50%"
            />
            <circle
              className={`text-${color}-500`}
              strokeWidth="2"
              strokeDasharray={`${progress * 301.59} 301.59`}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="48%"
              cx="50%"
              cy="50%"
            />
          </svg>
        )}
        {icon}
      </motion.div>
    </Tooltip>
  );
}

export default Badge;