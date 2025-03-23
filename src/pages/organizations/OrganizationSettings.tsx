import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import { updateOrganization } from '../../store/slices/organizationsSlice';
import { Building2, Users, Shield, Bell, Globe, Trash2 } from 'lucide-react';

function OrganizationSettings() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const organization = useSelector((state: RootState) => 
    state.organizations.organizations.find(org => org.id === id)
  );

  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    name: organization?.name || '',
    description: organization?.description || '',
    missionStatement: organization?.missionStatement || '',
    contactInfo: {
      email: organization?.contactInfo.email || '',
      phone: organization?.contactInfo.phone || '',
      address: organization?.contactInfo.address || '',
    },
    website: organization?.website || '',
    logo: organization?.logo || '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    eventReminders: true,
    newVolunteers: true,
    volunteerUpdates: true,
    organizationAnnouncements: true,
  });

  const [privacySettings, setPrivacySettings] = useState({
    publicProfile: true,
    showVolunteers: true,
    showEvents: true,
    allowVolunteerRegistration: true,
  });

  if (!organization) {
    return <div>Organization not found</div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateOrganization({
      ...organization,
      ...formData,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('contactInfo.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Organization Settings</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-6 py-4 flex items-center space-x-2 border-b-2 font-medium ${
              activeTab === 'general'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Building2 className="h-5 w-5" />
            <span>General</span>
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`px-6 py-4 flex items-center space-x-2 border-b-2 font-medium ${
              activeTab === 'members'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users className="h-5 w-5" />
            <span>Members</span>
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-6 py-4 flex items-center space-x-2 border-b-2 font-medium ${
              activeTab === 'privacy'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Shield className="h-5 w-5" />
            <span>Privacy</span>
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-6 py-4 flex items-center space-x-2 border-b-2 font-medium ${
              activeTab === 'notifications'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Bell className="h-5 w-5" />
            <span>Notifications</span>
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Logo
                </label>
                <div className="flex items-center space-x-4">
                  <img
                    src={formData.logo}
                    alt="Organization logo"
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                  >
                    Change Logo
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-200 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-lg border-gray-200 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label htmlFor="missionStatement" className="block text-sm font-medium text-gray-700 mb-2">
                  Mission Statement
                </label>
                <textarea
                  id="missionStatement"
                  name="missionStatement"
                  value={formData.missionStatement}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-lg border-gray-200 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contactInfo.email" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    id="contactInfo.email"
                    name="contactInfo.email"
                    value={formData.contactInfo.email}
                    onChange={handleChange}
                    className="w-full rounded-lg border-gray-200 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="contactInfo.phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    id="contactInfo.phone"
                    name="contactInfo.phone"
                    value={formData.contactInfo.phone}
                    onChange={handleChange}
                    className="w-full rounded-lg border-gray-200 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contactInfo.address" className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  id="contactInfo.address"
                  name="contactInfo.address"
                  value={formData.contactInfo.address}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-200 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-200 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-6 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                >
                  Delete Organization
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {activeTab === 'members' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Organization Members</h2>
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  Invite Members
                </button>
              </div>

              <div className="space-y-4">
                {organization.adminIds.map(adminId => (
                  <div key={adminId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Users className="h-6 w-6 text-primary-500" />
                      <div>
                        <p className="font-medium text-gray-900">Admin Name</p>
                        <p className="text-sm text-gray-500">admin@example.com</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                      Admin
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div className="space-y-4">
                {Object.entries(privacySettings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {key.split(/(?=[A-Z])/).join(' ')}
                      </p>
                      <p className="text-sm text-gray-500">
                        Control who can see your organization's information
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={() => {
                          setPrivacySettings(prev => ({
                            ...prev,
                            [key]: !prev[key as keyof typeof privacySettings]
                          }));
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="space-y-4">
                {Object.entries(notificationSettings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {key.split(/(?=[A-Z])/).join(' ')}
                      </p>
                      <p className="text-sm text-gray-500">
                        Receive notifications about organization activities
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={() => {
                          setNotificationSettings(prev => ({
                            ...prev,
                            [key]: !prev[key as keyof typeof notificationSettings]
                          }));
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrganizationSettings;