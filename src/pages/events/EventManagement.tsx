import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { RootState } from '../../store';
import { Calendar, MapPin, Users, Clock, Search, Filter, Plus, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

function EventManagement() {
  const { organizationId } = useParams<{ organizationId: string }>();
  const organization = useSelector((state: RootState) => 
    state.organizations.organizations.find(org => org.id === organizationId)
  );
  const allEvents = useSelector((state: RootState) => state.events.events);
  const organizationEvents = allEvents.filter(event => event.organizationId === organizationId);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredEvents = organizationEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const eventsByStatus = {
    upcoming: organizationEvents.filter(e => e.status === 'upcoming').length,
    ongoing: organizationEvents.filter(e => e.status === 'ongoing').length,
    completed: organizationEvents.filter(e => e.status === 'completed').length,
    cancelled: organizationEvents.filter(e => e.status === 'cancelled').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
        <Link
          to={`/organizations/${organizationId}/events/create`}
          className="px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Create Event</span>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <Calendar className="h-8 w-8 text-primary-500" />
            <div>
              <p className="text-sm text-gray-500">Upcoming Events</p>
              <p className="text-2xl font-bold text-gray-900">{eventsByStatus.upcoming}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <Clock className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Ongoing Events</p>
              <p className="text-2xl font-bold text-gray-900">{eventsByStatus.ongoing}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-500">Completed Events</p>
              <p className="text-2xl font-bold text-gray-900">{eventsByStatus.completed}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <Calendar className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-sm text-gray-500">Cancelled Events</p>
              <p className="text-2xl font-bold text-gray-900">{eventsByStatus.cancelled}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full rounded-lg border-gray-200 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border-gray-200 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Statuses</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Events List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {filteredEvents.map(event => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="block p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <Calendar className="h-10 w-10 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                      <span>{format(new Date(event.startDate), 'MMM d, yyyy')}</span>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{event.registeredVolunteers.length} / {event.capacity}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location.address}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    event.status === 'upcoming'
                      ? 'bg-green-100 text-green-800'
                      : event.status === 'ongoing'
                      ? 'bg-blue-100 text-blue-800'
                      : event.status === 'completed'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </span>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EventManagement;