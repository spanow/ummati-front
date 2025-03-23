import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { RootState } from '../../store';
import { MapPin, Mail, Phone, Globe, FileText, Calendar, Users, ChevronLeft, Plus, Heart } from 'lucide-react';
import { format } from 'date-fns';
import { addNotification } from '../../store/slices/notificationsSlice';

function OrganizationDetails() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { userId } = useSelector((state: RootState) => state.auth);
  const organization = useSelector((state: RootState) => 
    state.organizations.organizations.find(org => org.id === id)
  );
  const volunteers = useSelector((state: RootState) => 
    state.volunteers.volunteers.filter(v => organization?.volunteerIds.includes(v.id))
  );
  const currentVolunteer = useSelector((state: RootState) => 
    state.volunteers.volunteers.find(v => v.id === userId)
  );
  const isAdmin = organization?.adminIds.includes(userId || '');
  const isMember = organization?.volunteerIds.includes(userId || '');

  if (!organization) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Users className="h-12 w-12 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900">Organization not found</h2>
        <p className="text-gray-500 mt-2">The organization you're looking for doesn't exist or has been removed.</p>
        <Link
          to="/organizations"
          className="mt-4 text-primary-600 hover:text-primary-700 font-medium flex items-center"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Organizations
        </Link>
      </div>
    );
  }

  const handleApply = () => {
    if (!userId || !currentVolunteer) return;

    // Create application notification for admins
    organization.adminIds.forEach(adminId => {
      dispatch(addNotification({
        id: `notif-${Date.now()}-${adminId}`,
        userId: adminId,
        title: 'New Volunteer Application',
        message: `${currentVolunteer.firstName} ${currentVolunteer.lastName} wants to join ${organization.name}`,
        type: 'volunteer_application',
        relatedId: organization.id,
        read: false,
        createdAt: new Date().toISOString()
      }));
    });

    // Confirmation notification for the volunteer
    dispatch(addNotification({
      id: `notif-${Date.now()}-${userId}`,
      userId,
      title: 'Application Submitted',
      message: `Your application to join ${organization.name} has been submitted. We'll notify you once it's reviewed.`,
      type: 'application_confirmation',
      relatedId: organization.id,
      read: false,
      createdAt: new Date().toISOString()
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/organizations"
          className="text-gray-600 hover:text-gray-900 flex items-center"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to Organizations
        </Link>
        <div className="flex items-center space-x-4">
          {!isMember && userId && (
            <button
              onClick={handleApply}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center space-x-2"
            >
              <Heart className="h-5 w-5" />
              <span>Apply to Join</span>
            </button>
          )}
          {isAdmin && (
            <>
              <Link
                to={`/organizations/${id}/invite`}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center space-x-2"
              >
                <Users className="h-5 w-5" />
                <span>Invite Volunteers</span>
              </Link>
              <Link
                to={`/organizations/${id}/events/create`}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Create Event</span>
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="relative h-64 bg-gray-100 rounded-xl overflow-hidden">
        <img
          src={organization.logo}
          alt={organization.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
          <h1 className="text-4xl font-bold text-white mb-2">{organization.name}</h1>
          <p className="text-white/90">{organization.missionStatement}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
            <p className="text-gray-600">{organization.description}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Volunteers</h2>
              {isAdmin && (
                <Link
                  to={`/organizations/${id}/invite`}
                  className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Invite Volunteers</span>
                </Link>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {volunteers.map(volunteer => (
                <div key={volunteer.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={volunteer.profilePicture}
                    alt={`${volunteer.firstName} ${volunteer.lastName}`}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {volunteer.firstName} {volunteer.lastName}
                      {organization.adminIds.includes(volunteer.id) && (
                        <span className="ml-2 text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                          Admin
                        </span>
                      )}
                    </h3>
                    <div className="text-sm text-gray-500 space-y-1">
                      <p>{volunteer.email}</p>
                      <div className="flex flex-wrap gap-2">
                        {volunteer.skills.slice(0, 2).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                        {volunteer.skills.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                            +{volunteer.skills.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Documents</h2>
            <div className="space-y-3">
              {organization.documents.map(doc => (
                <a
                  key={doc.id}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <FileText className="h-5 w-5 text-primary-500" />
                  <span className="text-gray-900">{doc.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-gray-600">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span>{organization.contactInfo.address}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <Mail className="h-5 w-5 text-gray-400" />
                <a href={`mailto:${organization.contactInfo.email}`} className="hover:text-primary-600">
                  {organization.contactInfo.email}
                </a>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <Phone className="h-5 w-5 text-gray-400" />
                <a href={`tel:${organization.contactInfo.phone}`} className="hover:text-primary-600">
                  {organization.contactInfo.phone}
                </a>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <Globe className="h-5 w-5 text-gray-400" />
                <a href={organization.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary-600">
                  {organization.website}
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Statistics</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-primary-500" />
                  <span className="text-gray-600">Volunteers</span>
                </div>
                <span className="font-semibold text-gray-900">{organization.volunteerIds.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-primary-500" />
                  <span className="text-gray-600">Events</span>
                </div>
                <span className="font-semibold text-gray-900">{organization.eventIds.length}</span>
              </div>
            </div>
          </div>

          {isAdmin && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Admin Actions</h2>
              <div className="space-y-3">
                <Link
                  to={`/organizations/${id}/settings`}
                  className="w-full px-4 py-2 text-left bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-between"
                >
                  <span>Organization Settings</span>
                  <ChevronLeft className="h-5 w-5 rotate-180" />
                </Link>
                <Link
                  to={`/organizations/${id}/invite`}
                  className="w-full px-4 py-2 text-left bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-between"
                >
                  <span>Manage Volunteers</span>
                  <ChevronLeft className="h-5 w-5 rotate-180" />
                </Link>
                <Link
                  to={`/organizations/${id}/events`}
                  className="w-full px-4 py-2 text-left bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-between"
                >
                  <span>Event Management</span>
                  <ChevronLeft className="h-5 w-5 rotate-180" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrganizationDetails;