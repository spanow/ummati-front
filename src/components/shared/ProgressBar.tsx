import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animate?: boolean;
}

function ProgressBar({
  progress,
  color = 'primary',
  size = 'md',
  showLabel = true,
  animate = true
}: ProgressBarProps) {
  const heights = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  return (
    <div className="w-full">
      <div className={`w-full bg-gray-100 rounded-full overflow-hidden ${heights[size]}`}>
        <motion.div
          className={`bg-${color}-500 h-full rounded-full`}
          initial={animate ? { width: 0 } : { width: `${progress}%` }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1">
          <span className="text-sm text-gray-500">{progress}% Complete</span>
          <span className="text-sm text-gray-500">{100 - progress}% Remaining</span>
        </div>
      )}
    </div>
  );
}

export default ProgressBar;