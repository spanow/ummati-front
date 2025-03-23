import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../../store';
import { Search, Filter, Mail, Download, Upload, Users } from 'lucide-react';
import { format } from 'date-fns';

function VolunteerList() {
  const { volunteers } = useSelector((state: RootState) => state.volunteers);
  const { organizations } = useSelector((state: RootState) => state.organizations);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedOrganization, setSelectedOrganization] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('');

  // Get unique skills from all volunteers
  const allSkills = Array.from(
    new Set(volunteers.flatMap(volunteer => volunteer.skills))
  ).sort();

  // Filter volunteers based on search and filters
  const filteredVolunteers = volunteers.filter(volunteer => {
    const matchesSearch = 
      `${volunteer.firstName} ${volunteer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSkill = !selectedSkill || volunteer.skills.includes(selectedSkill);
    
    const matchesOrganization = !selectedOrganization || 
      volunteer.joinedOrganizations.includes(selectedOrganization);

    const matchesAvailability = !selectedAvailability || 
      Object.entries(volunteer.availability).some(([day, slots]) => 
        Object.entries(slots).some(([time, available]) => 
          available && `${day}-${time}` === selectedAvailability
        )
      );

    return matchesSearch && matchesSkill && matchesOrganization && matchesAvailability;
  });

  const availabilityOptions = [
    { value: 'monday-morning', label: 'Monday Morning' },
    { value: 'monday-afternoon', label: 'Monday Afternoon' },
    { value: 'monday-evening', label: 'Monday Evening' },
    // Add more time slots as needed
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Volunteers</h1>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
            <Upload className="h-5 w-5" />
            <span>Import</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
            <Download className="h-5 w-5" />
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            <Mail className="h-5 w-5" />
            <span>Send Email</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search volunteers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full rounded-lg border-gray-200 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full rounded-lg border-gray-200 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Skills</option>
              {allSkills.map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
          </div>

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

          <div>
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="w-full rounded-lg border-gray-200 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Availabilities</option>
              {availabilityOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Volunteers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVolunteers.map(volunteer => {
          const volunteerOrgs = organizations.filter(org => 
            volunteer.joinedOrganizations.includes(org.id)
          );

          return (
            <Link
              key={volunteer.id}
              to={`/volunteers/${volunteer.id}`}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={volunteer.profilePicture}
                    alt={`${volunteer.firstName} ${volunteer.lastName}`}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {volunteer.firstName} {volunteer.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{volunteer.email}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {volunteer.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Organizations:</span>{' '}
                      {volunteerOrgs.map(org => org.name).join(', ')}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Joined:</span>{' '}
                      {format(new Date(volunteer.registrationDate), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {filteredVolunteers.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No volunteers found</h3>
          <p className="text-gray-500">Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  );
}

export default VolunteerList;