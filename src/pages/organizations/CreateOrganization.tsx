import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addOrganization } from '../../store/slices/organizationsSlice';
import { RootState } from '../../store';
import { Building2, Upload } from 'lucide-react';

function CreateOrganization() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    missionStatement: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    logo: 'https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80' // Default logo
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newOrganization = {
      id: `org-${Date.now()}`,
      ...formData,
      contactInfo: {
        email: formData.email,
        phone: formData.phone,
        address: formData.address
      },
      foundedDate: new Date().toISOString(),
      adminIds: [userId!],
      volunteerIds: [userId!],
      eventIds: [],
      documents: []
    };

    dispatch(addOrganization(newOrganization));
    navigate(`/organizations/${newOrganization.id}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Organization</h1>
        <p className="mt-2 text-gray-600">Start making a difference in your community by creating your organization.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="space-y-6">
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
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  <Upload className="h-5 w-5" />
                  <span>Upload Logo</span>
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
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-lg border-gray-200 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter organization name"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-lg border-gray-200 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Describe your organization"
              />
            </div>

            <div>
              <label htmlFor="missionStatement" className="block text-sm font-medium text-gray-700 mb-2">
                Mission Statement
              </label>
              <textarea
                id="missionStatement"
                name="missionStatement"
                required
                value={formData.missionStatement}
                onChange={handleChange}
                rows={2}
                className="w-full rounded-lg border-gray-200 focus:ring-primary-500 focus:border-primary-500"
                placeholder="What is your organization's mission?"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-200 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="contact@organization.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-200 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                className="w-full rounded-lg border-gray-200 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Organization address"
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
                placeholder="https://www.organization.com"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/organizations')}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all transform hover:-translate-y-0.5"
          >
            Create Organization
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateOrganization;