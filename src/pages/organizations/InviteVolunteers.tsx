import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from '../../store';
import { addNotification } from '../../store/slices/notificationsSlice';
import { Users, Search, Mail, Plus, X } from 'lucide-react';

function InviteVolunteers() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const organization = useSelector((state: RootState) => 
    state.organizations.organizations.find(org => org.id === id)
  );
  const allVolunteers = useSelector((state: RootState) => state.volunteers.volunteers);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVolunteers, setSelectedVolunteers] = useState<string[]>([]);
  const [inviteByEmail, setInviteByEmail] = useState('');
  const [emailList, setEmailList] = useState<string[]>([]);

  // Filter out volunteers who are already members
  const availableVolunteers = allVolunteers.filter(
    volunteer => !organization?.volunteerIds.includes(volunteer.id)
  );

  const filteredVolunteers = availableVolunteers.filter(volunteer =>
    `${volunteer.firstName} ${volunteer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    volunteer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectVolunteer = (volunteerId: string) => {
    setSelectedVolunteers(prev => 
      prev.includes(volunteerId)
        ? prev.filter(id => id !== volunteerId)
        : [...prev, volunteerId]
    );
  };

  const handleAddEmail = () => {
    if (inviteByEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteByEmail)) {
      setEmailList(prev => [...prev, inviteByEmail]);
      setInviteByEmail('');
    }
  };

  const handleRemoveEmail = (email: string) => {
    setEmailList(prev => prev.filter(e => e !== email));
  };

  const handleSendInvites = () => {
    // Send invites to selected volunteers
    selectedVolunteers.forEach(volunteerId => {
      const volunteer = allVolunteers.find(v => v.id === volunteerId);
      if (volunteer && organization) {
        dispatch(addNotification({
          id: `notif-${Date.now()}-${volunteerId}`,
          userId: volunteerId,
          title: 'Organization Invitation',
          message: `You've been invited to join ${organization.name}`,
          type: 'organization_invite',
          relatedId: organization.id,
          read: false,
          createdAt: new Date().toISOString()
        }));
      }
    });

    // Handle email invites
    emailList.forEach(email => {
      // In a real app, this would send actual emails
      console.log(`Sending invitation email to ${email}`);
    });

    // Clear selections
    setSelectedVolunteers([]);
    setEmailList([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Invite Volunteers</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Existing Volunteers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Invite Platform Volunteers</h2>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search volunteers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full rounded-lg border-gray-200 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredVolunteers.map(volunteer => (
              <div
                key={volunteer.id}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedVolunteers.includes(volunteer.id)
                    ? 'bg-primary-50 border-primary-200'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleSelectVolunteer(volunteer.id)}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={volunteer.profilePicture}
                    alt={`${volunteer.firstName} ${volunteer.lastName}`}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      {volunteer.firstName} {volunteer.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{volunteer.email}</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={selectedVolunteers.includes(volunteer.id)}
                  onChange={() => {}}
                  className="h-5 w-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Email Invites */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Invite by Email</h2>
          
          <div className="flex space-x-2 mb-4">
            <input
              type="email"
              placeholder="Enter email address"
              value={inviteByEmail}
              onChange={(e) => setInviteByEmail(e.target.value)}
              className="flex-1 rounded-lg border-gray-200 focus:ring-primary-500 focus:border-primary-500"
            />
            <button
              onClick={handleAddEmail}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add</span>
            </button>
          </div>

          <div className="space-y-2">
            {emailList.map(email => (
              <div
                key={email}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">{email}</span>
                </div>
                <button
                  onClick={() => handleRemoveEmail(email)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          onClick={handleSendInvites}
          disabled={selectedVolunteers.length === 0 && emailList.length === 0}
          className="px-6 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <Mail className="h-5 w-5" />
          <span>Send Invitations</span>
        </button>
      </div>
    </div>
  );
}

export default InviteVolunteers;