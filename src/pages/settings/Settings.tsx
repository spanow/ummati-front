import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { updateVolunteer } from '../../store/slices/volunteersSlice';
import { Bell, Globe, Lock, User, Shield } from 'lucide-react';

function Settings() {
  const dispatch = useDispatch();
  const { userId } = useSelector((state: RootState) => state.auth);
  const volunteer = useSelector((state: RootState) => 
    state.volunteers.volunteers.find(v => v.id === userId)
  );

  const [activeTab, setActiveTab] = useState('profile');
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    eventReminders: true,
    organizationUpdates: true,
    volunteerOpportunities: true
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showEmail: true,
    showPhone: false,
    showAvailability: true
  });

  const [language, setLanguage] = useState(volunteer?.preferredLanguage || 'en');

  if (!volunteer) {
    return <div>Loading...</div>;
  }

  const handleNotificationChange = (setting: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };

  const handlePrivacyChange = (setting: string, value: string | boolean) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    dispatch(updateVolunteer({
      ...volunteer,
      preferredLanguage: newLanguage
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-4 flex items-center space-x-2 border-b-2 font-medium ${
              activeTab === 'profile'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <User className="h-5 w-5" />
            <span>Profile</span>
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
            onClick={() => setActiveTab('language')}
            className={`px-6 py-4 flex items-center space-x-2 border-b-2 font-medium ${
              activeTab === 'language'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Globe className="h-5 w-5" />
            <span>Language</span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-6 py-4 flex items-center space-x-2 border-b-2 font-medium ${
              activeTab === 'security'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Lock className="h-5 w-5" />
            <span>Security</span>
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
              <div className="space-y-4">
                {Object.entries(notificationSettings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-gray-700">
                      {key.split(/(?=[A-Z])/).join(' ')}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={() => handleNotificationChange(key)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Privacy Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Profile Visibility</label>
                  <select
                    value={privacySettings.profileVisibility}
                    onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="public">Public</option>
                    <option value="organizations">Organizations Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                {Object.entries(privacySettings)
                  .filter(([key]) => key !== 'profileVisibility')
                  .map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-gray-700">
                        {key.split(/(?=[A-Z])/).join(' ')}
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value as boolean}
                          onChange={() => handlePrivacyChange(key, !(value as boolean))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {activeTab === 'language' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Language Preferences</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700">Preferred Language</label>
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                  <option value="es">Español</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>
              <div className="space-y-4">
                <button className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg text-left hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900">Change Password</p>
                    <p className="text-sm text-gray-500">Update your password regularly to keep your account secure</p>
                  </div>
                  <Lock className="h-5 w-5 text-gray-400" />
                </button>

                <button className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg text-left hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                  <Shield className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;