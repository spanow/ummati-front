import { useSelector } from 'react-redux';
import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { RootState } from '../../store';
import { MapPin, Users, Calendar, Search, Filter, Building2, Clock } from 'lucide-react';
import { format } from 'date-fns';

function Events() {
  const { organizationId } = useParams<{ organizationId: string }>();
  const { events } = useSelector((state: RootState) => state.events);
  const { organizations } = useSelector((state: RootState) => state.organizations);
  const { userId } = useSelector((state: RootState) => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrganization, setSelectedOrganization] = useState(organizationId || '');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedZone, setSelectedZone] = useState('');

  const currentOrganization = organizations.find(org => org.id === organizationId);
  const isOrgAdmin = currentOrganization?.adminIds.includes(userId || '');

  // Get unique zones from events
  const zones = useMemo(() => {
    const uniqueZones = new Set(events.map(event => event.location.address.split(',').pop()?.trim()));
    return Array.from(uniqueZones).filter(Boolean);
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesOrg = !selectedOrganization || event.organizationId === selectedOrganization;
      const matchesStatus = !selectedStatus || event.status === selectedStatus;
      const matchesZone = !selectedZone || event.location.address.includes(selectedZone);
      
      return matchesSearch && matchesOrg && matchesStatus && matchesZone;
    });
  }, [events, searchTerm, selectedOrganization, selectedStatus, selectedZone]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          {currentOrganization ? `${currentOrganization.name} Events` : 'Events'}
        </h1>
        {currentOrganization && isOrgAdmin && (
          <Link
            to={`/organizations/${organizationId}/events/create`}
            className="px-6 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all transform hover:-translate-y-0.5"
          >
            Create Event
          </Link>
        )}
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full rounded-lg border-gray-200 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {!organizationId && (
            <div>
              <select
                value={selectedOrganization}
                onChange={(e) => setSelectedOrganization(e.target.value)}
                className="w-full rounded-lg border-gray-200 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Organizations</option>
                {organizations.map(org => (
                  <option key={org.id} value={org.id}>{org.name}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-lg border-gray-200 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Statuses</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="w-full rounded-lg border-gray-200 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Zones</option>
              {zones.map(zone => (
                <option key={zone} value={zone}>{zone}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map(event => {
          const organization = organizations.find(org => org.id === event.organizationId);
          return (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all transform hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Calendar className="h-6 w-6 text-primary-500" />
                  <span className="text-sm font-medium text-primary-600">
                    {format(new Date(event.startDate), 'MMM d, yyyy')}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
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
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {event.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span className="line-clamp-1">{event.location.address}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{format(new Date(event.startDate), 'h:mm a')} - {format(new Date(event.endDate), 'h:mm a')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>{event.registeredVolunteers.length} / {event.capacity} volunteers</span>
                  </div>
                </div>

                {organization && !organizationId && (
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center space-x-3">
                    <img
                      src={organization.logo}
                      alt={organization.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium text-gray-900">{organization.name}</span>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No events found</h3>
          <p className="text-gray-500">Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  );
}

export default Events;