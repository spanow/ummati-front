import { Button } from '@/components/ui/button';
import { Search, Users, Calendar } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  type?: 'search' | 'events' | 'ongs' | 'default';
}

export function EmptyState({ title, description, action, type = 'default' }: EmptyStateProps) {
  const getIcon = () => {
    switch (type) {
      case 'search':
        return <Search className="h-16 w-16 text-gray-300" />;
      case 'events':
        return <Calendar className="h-16 w-16 text-gray-300" />;
      case 'ongs':
        return <Users className="h-16 w-16 text-gray-300" />;
      default:
        return <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-2xl text-gray-400">?</span>
        </div>;
    }
  };

  return (
    <div className="text-center py-12 px-4">
      <div className="flex justify-center mb-4">
        {getIcon()}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}