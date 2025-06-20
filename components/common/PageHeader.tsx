import { ReactNode } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, children, className }: PageHeaderProps) {
  const { isRTL } = useLanguage();

  return (
    <div className={cn(
      'flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8',
      isRTL && 'lg:flex-row-reverse',
      className
    )}>
      <div className="mb-4 lg:mb-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {title}
        </h1>
        {description && (
          <p className="text-gray-600">
            {description}
          </p>
        )}
      </div>
      
      {children && (
        <div className={cn(
          'flex items-center space-x-4',
          isRTL && 'space-x-reverse'
        )}>
          {children}
        </div>
      )}
    </div>
  );
}