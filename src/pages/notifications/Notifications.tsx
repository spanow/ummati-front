import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { markAsRead } from '../../store/slices/notificationsSlice';
import { Bell, Calendar, Building2, Users, Check } from 'lucide-react';
import { format } from 'date-fns';

function Notifications() {
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.notifications.notifications);
  const { events } = useSelector((state: RootState) => state.events);
  const { organizations } = useSelector((state: RootState) => state.organizations);

  const handleMarkAsRead = (notificationId: string) => {
    dispatch(markAsRead(notificationId));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'event_reminder':
        return <Calendar className="h-6 w-6 text-primary-500" />;
      case 'organization_update':
        return <Building2 className="h-6 w-6 text-primary-500" />;
      case 'volunteer_request':
        return <Users className="h-6 w-6 text-primary-500" />;
      default:
        return <Bell className="h-6 w-6 text-primary-500" />;
    }
  };

  const getRelatedContent = (notification: any) => {
    if (notification.type === 'event_reminder') {
      const event = events.find(e => e.id === notification.relatedId);
      if (event) {
        return (
          <div className="mt-2 p-3 bg-gray-50 rounded-lg">
            <p className="font-medium text-gray-900">{event.title}</p>
            <p className="text-sm text-gray-500">
              {format(new Date(event.startDate), 'MMMM d, yyyy h:mm a')}
            </p>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
        {notifications.length === 0 ? (
          <div className="p-6 text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
            <p className="text-gray-500">You're all caught up!</p>
          </div>
        ) : (
          notifications.map(notification => (
            <div
              key={notification.id}
              className={`p-6 transition-colors ${
                notification.read ? 'bg-white' : 'bg-primary-50'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-medium ${
                      notification.read ? 'text-gray-900' : 'text-primary-900'
                    }`}>
                      {notification.title}
                    </p>
                    <span className="text-sm text-gray-500">
                      {format(new Date(notification.createdAt), 'MMM d, h:mm a')}
                    </span>
                  </div>
                  <p className={`mt-1 text-sm ${
                    notification.read ? 'text-gray-500' : 'text-primary-800'
                  }`}>
                    {notification.message}
                  </p>
                  {getRelatedContent(notification)}
                </div>
                {!notification.read && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="flex-shrink-0 p-2 text-primary-600 hover:bg-primary-100 rounded-full transition-colors"
                    title="Mark as read"
                  >
                    <Check className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notifications;