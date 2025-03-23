import { Badge } from '../../types';
import { Star, Users, Heart, Footprints } from 'lucide-react';

interface BadgeCardProps {
  badge: Badge;
  earned?: boolean;
  earnedAt?: string;
}

function BadgeCard({ badge, earned, earnedAt }: BadgeCardProps) {
  const getIcon = () => {
    switch (badge.icon) {
      case 'star':
        return <Star className="h-6 w-6" />;
      case 'users':
        return <Users className="h-6 w-6" />;
      case 'heart':
        return <Heart className="h-6 w-6" />;
      case 'footprints':
        return <Footprints className="h-6 w-6" />;
      default:
        return <Star className="h-6 w-6" />;
    }
  };

  return (
    <div className={`p-4 rounded-xl border ${
      earned
        ? 'bg-gradient-to-br from-primary-50 to-secondary-50 border-primary-200'
        : 'bg-gray-50 border-gray-200'
    }`}>
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-lg ${
          earned
            ? 'bg-gradient-to-br from-primary-500 to-secondary-500 text-white'
            : 'bg-gray-200 text-gray-500'
        }`}>
          {getIcon()}
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{badge.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{badge.description}</p>
          {earned && earnedAt && (
            <p className="text-sm text-primary-600 mt-2">
              Earned on {new Date(earnedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default BadgeCard;