import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { 
  Home,
  Users,
  Calendar,
  Building2,
  Settings,
  BarChart,
  Heart
} from 'lucide-react';

function Sidebar() {
  const location = useLocation();
  const { role } = useSelector((state: RootState) => state.auth);

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/organizations', icon: Building2, label: 'Organizations' },
    { path: '/events', icon: Calendar, label: 'Events' },
    ...(role === 'admin' ? [
      { path: '/volunteers', icon: Users, label: 'Volunteers' },
      { path: '/reports', icon: BarChart, label: 'Reports' },
    ] : []),
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-100 h-screen">
      <div className="flex flex-col h-full">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <Heart className="h-8 w-8 text-primary-600" />
            <span className="text-lg font-semibold text-gray-900">Volunteer</span>
          </div>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;