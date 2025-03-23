import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { RootState } from '../../store';
import { Calendar, MapPin, Users, Clock, AlertCircle, Building2, ChevronLeft, Share2, Heart, MessageCircle, Download, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { updateEvent } from '../../store/slices/eventsSlice';
import { addNotification } from '../../store/slices/notificationsSlice';
import { useState } from 'react';

function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { userId } = useSelector((state: RootState) => state.auth);
  const event = useSelector((state: RootState) => 
    state.events.events.find(e => e.id === id)
  );
  const organization = useSelector((state: RootState) => 
    state.organizations.organizations.find(org => org.id === event?.organizationId)
  );
  const currentVolunteer = useSelector((state: RootState) => 
    state.volunteers.volunteers.find(v => v.id === userId)
  );
  const registeredVolunteers = useSelector((state: RootState) => 
    state.volunteers.volunteers.filter(v => event?.registeredVolunteers.includes(v.id))
  );
  const isRegistered = event?.registeredVolunteers.includes(userId || '');
  const isAdmin = organization?.adminIds.includes(userId || '');
  const isFull = event ? event.registeredVolunteers.length >= event.capacity : false;

  const [showVolunteers, setShowVolunteers] = useState(false);
  const [comment, setComment] = useState('');

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Calendar className="h-12 w-12 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900">Event not found</h2>
        <p className="text-gray-500 mt-2">The event you're looking for doesn't exist or has been removed.</p>
        <Link
          to="/events"
          className="mt-4 text-primary-600 hover:text-primary-700 font-medium flex items-center"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Events
        </Link>
      </div>
    );
  }

  const handleRegister = () => {
    if (!userId || !currentVolunteer || !event) return;

    const updatedEvent = {
      ...event,
      registeredVolunteers: [...event.registeredVolunteers, userId]
    };

    dispatch(updateEvent(updatedEvent));

    // Notification for the volunteer
    dispatch(addNotification({
      id: `notif-${Date.now()}-${userId}`,
      userId,
      title: 'Event Registration Confirmed',
      message: `You've successfully registered for ${event.title}`,
      type: 'event_registration',
      relatedId: event.id,
      read: false,
      createdAt: new Date().toISOString()
    }));

    // Notification for the organization admins
    organization?.adminIds.forEach(adminId => {
      dispatch(addNotification({
        id: `notif-${Date.now()}-${adminId}`,
        userId: adminId,
        title: 'New Event Registration',
        message: `${currentVolunteer.firstName} ${currentVolunteer.lastName} has registered for ${event.title}`,
        type: 'new_registration',
        relatedId: event.id,
        read: false,
        createdAt: new Date().toISOString()
      }));
    });
  };

  const handleCancelRegistration = () => {
    if (!userId || !event) return;

    const updatedEvent = {
      ...event,
      registeredVolunteers: event.registeredVolunteers.filter(id => id !== userId)
    };

    dispatch(updateEvent(updatedEvent));

    dispatch(addNotification({
      id: `notif-${Date.now()}-${userId}`,
      userId,
      title: 'Registration Cancelled',
      message: `You've cancelled your registration for ${event.title}`,
      type: 'registration_cancelled',
      relatedId: event.id,
      read: false,
      createdAt: new Date().toISOString()
    }));
  };

  const handleAddComment = () => {
    if (!comment.trim()) return;

    // In a real app, this would be handled by a comments slice
    console.log('Adding comment:', comment);
    setComment('');
  };

  const handleExportVolunteers = () => {
    // In a real app, this would generate a CSV file
    const csvContent = registeredVolunteers
      .map(v => `${v.firstName},${v.lastName},${v.email},${v.phone}`)
      .join('\n');
    console.log('Exporting volunteers:', csvContent);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/events"
          className="text-gray-600 hover:text-gray-900 flex items-center"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to Events
        </Link>
        {isAdmin && (
          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportVolunteers}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
            >
              <Download className="h-5 w-5" />
              <span>Export Volunteers</span>
            </button>
            <Link
              to={`/events/${event.id}/edit`}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
            >
              <Edit className="h-5 w-5" />
              <span>Edit Event</span>
            </Link>
            <button className="px-4 py-2 text-red-600 hover:text-red-700 border border-red-200 rounded-lg hover:bg-red-50 flex items-center space-x-2">
              <Trash2 className="h-5 w-5" />
              <span>Cancel Event</span>
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center space-x-3 mb-2">
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
                <span className="text-sm text-gray-500">
                  {format(new Date(event.startDate), 'MMMM d, yyyy')}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100">
                <Share2 className="h-5 w-5" />
              </button>
              {userId && !isAdmin && (
                isRegistered ? (
                  <button
                    onClick={handleCancelRegistration}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all transform hover:-translate-y-0.5"
                  >
                    Cancel Registration
                  </button>
                ) : (
                  <button
                    onClick={handleRegister}
                    disabled={isFull}
                    className="px-6 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isFull ? 'Event Full' : 'Register Now'}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About this event</h2>
                <p className="text-gray-600 whitespace-pre-line">{event.description}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600">{event.requirements}</p>
                </div>
              </div>

              {organization && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Organized by</h2>
                  <Link
                    to={`/organizations/${organization.id}`}
                    className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <img
                      src={organization.logo}
                      alt={organization.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{organization.name}</p>
                      <p className="text-sm text-gray-500">{organization.description}</p>
                    </div>
                  </Link>
                </div>
              )}

              {/* Comments Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Discussion</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex space-x-4">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 rounded-lg border-gray-200 focus:ring-primary-500 focus:border-primary-500"
                      rows={3}
                    />
                    <button
                      onClick={handleAddComment}
                      className="self-end px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center space-x-2"
                    >
                      <MessageCircle className="h-5 w-5" />
                      <span>Comment</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Date & Time</p>
                      <p className="text-sm">
                        {format(new Date(event.startDate), 'MMMM d, yyyy')}
                        <br />
                        {format(new Date(event.startDate), 'h:mm a')} - {format(new Date(event.endDate), 'h:mm a')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-gray-600">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-sm">{event.location.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-gray-600">
                    <Users className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Capacity</p>
                      <p className="text-sm">
                        {event.registeredVolunteers.length} / {event.capacity} volunteers registered
                      </p>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{
                            width: `${(event.registeredVolunteers.length / event.capacity) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Registered Volunteers */}
              <div className="bg-white p-6 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Registered Volunteers</h2>
                  <button
                    onClick={() => setShowVolunteers(!showVolunteers)}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    {showVolunteers ? 'Hide' : 'Show All'}
                  </button>
                </div>
                {showVolunteers && (
                  <div className="space-y-3">
                    {registeredVolunteers.map(volunteer => (
                      <div key={volunteer.id} className="flex items-center space-x-3 p-2">
                        <img
                          src={volunteer.profilePicture}
                          alt={`${volunteer.firstName} ${volunteer.lastName}`}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            {volunteer.firstName} {volunteer.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{volunteer.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {event.requirements && (
                <div className="bg-yellow-50 p-4 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-800">Requirements</p>
                      <p className="text-sm text-yellow-700 mt-1">{event.requirements}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-primary-50 p-4 rounded-xl">
                <div className="flex items-start space-x-3">
                  <Building2 className="h-5 w-5 text-primary-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-primary-800">Organization Contact</p>
                    <p className="text-sm text-primary-700 mt-1">
                      {organization?.contactInfo.email}<br />
                      {organization?.contactInfo.phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;