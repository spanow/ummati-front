import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../../store';
import { Calendar, Users, Building2, BarChart, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

function Dashboard() {
  const { organizations } = useSelector((state: RootState) => state.organizations);
  const { events } = useSelector((state: RootState) => state.events);
  const { role, userId } = useSelector((state: RootState) => state.auth);
  const volunteer = useSelector((state: RootState) => 
    state.volunteers.volunteers.find(v => v.id === userId)
  );

  const upcomingEvents = events.filter(event => 
    event.status === 'upcoming' && 
    (!volunteer || event.registeredVolunteers.includes(volunteer.id))
  );

  const joinedOrganizations = organizations.filter(org => 
    volunteer?.joinedOrganizations.includes(org.id)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center space-x-3">
            <Building2 className="h-8 w-8 opacity-80" />
            <div>
              <p className="text-sm text-white/80">Organizations</p>
              <p className="text-2xl font-bold">{joinedOrganizations.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center space-x-3">
            <Calendar className="h-8 w-8 opacity-80" />
            <div>
              <p className="text-sm text-white/80">Upcoming Events</p>
              <p className="text-2xl font-bold">{upcomingEvents.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 opacity-80" />
            <div>
              <p className="text-sm text-white/80">Volunteer Hours</p>
              <p className="text-2xl font-bold">24</p>
            </div>
          </div>
        </div>

        {role === 'admin' && (
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center space-x-3">
              <BarChart className="h-8 w-8 opacity-80" />
              <div>
                <p className="text-sm text-white/80">Total Impact</p>
                <p className="text-2xl font-bold">5,280 hrs</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
              <Link 
                to="/events" 
                className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
              >
                View all
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="space-y-4">
              {upcomingEvents.slice(0, 3).map(event => (
                <Link
                  key={event.id}
                  to={`/events/${event.id}`}
                  className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <Calendar className="h-6 w-6 text-primary-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">{event.title}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(event.startDate), 'MMMM d, yyyy • h:mm a')}
                    </p>
                    <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500">
                      <Users className="h-4 w-4" />
                      <span>{event.registeredVolunteers.length} / {event.capacity} volunteers</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Your Organizations</h2>
              <Link 
                to="/organizations" 
                className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
              >
                View all
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="space-y-4">
              {joinedOrganizations.slice(0, 3).map(org => (
                <Link
                  key={org.id}
                  to={`/organizations/${org.id}`}
                  className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <img
                    src={org.logo}
                    alt={org.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{org.name}</p>
                    <p className="text-sm text-gray-500 line-clamp-1">{org.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {role === 'admin' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {/* Add recent activity items here */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;