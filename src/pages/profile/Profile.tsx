import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Calendar, Mail, Phone, Heart, Clock, MapPin, Star, Award, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import Badge from '../../components/shared/Badge';
import ImpactChart from '../../components/charts/ImpactChart';
import ProgressBar from '../../components/shared/ProgressBar';
import FadeIn from '../../components/animations/FadeIn';

function Profile() {
  const { userId } = useSelector((state: RootState) => state.auth);
  const volunteer = useSelector((state: RootState) => 
    state.volunteers.volunteers.find(v => v.id === userId)
  );
  const { organizations } = useSelector((state: RootState) => state.organizations);
  const { events } = useSelector((state: RootState) => state.events);
  const { badges } = useSelector((state: RootState) => state.badges);

  if (!volunteer) {
    return <div>Profile not found</div>;
  }

  const joinedOrgs = organizations.filter(org => 
    volunteer.joinedOrganizations.includes(org.id)
  );

  const participatedEvents = events.filter(event => 
    volunteer.participatedEvents.includes(event.id)
  );

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const timeSlots = ['morning', 'afternoon', 'evening'];

  // Mock impact data - in a real app, this would come from the backend
  const impactData = [
    { date: '2025-01-01', hours: 4, events: 1 },
    { date: '2025-01-08', hours: 8, events: 2 },
    { date: '2025-01-15', hours: 6, events: 1 },
    { date: '2025-01-22', hours: 12, events: 3 },
    { date: '2025-01-29', hours: 10, events: 2 },
    { date: '2025-02-05', hours: 15, events: 4 },
  ];

  return (
    <div className="space-y-6">
      <FadeIn>
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-primary-500 to-secondary-500" />
          <div className="px-6 pb-6">
            <div className="flex items-start -mt-12 space-x-6">
              <img
                src={volunteer.profilePicture}
                alt={`${volunteer.firstName} ${volunteer.lastName}`}
                className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div className="pt-12">
                <h1 className="text-3xl font-bold text-gray-900">
                  {volunteer.firstName} {volunteer.lastName}
                </h1>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{volunteer.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{volunteer.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {format(new Date(volunteer.registrationDate), 'MMMM d, yyyy')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Impact Chart */}
          <FadeIn delay={0.1}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Impact Overview</h2>
              <ImpactChart data={impactData} />
            </div>
          </FadeIn>

          {/* Skills */}
          <FadeIn delay={0.2}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Add Skills
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {volunteer.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium flex items-center space-x-1"
                  >
                    <span>{skill}</span>
                    <ProgressBar progress={75} size="sm" showLabel={false} />
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Organizations */}
          <FadeIn delay={0.3}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Organizations</h2>
              <div className="space-y-4">
                {joinedOrgs.map(org => (
                  <div key={org.id} className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <img
                      src={org.logo}
                      alt={org.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{org.name}</p>
                      <p className="text-sm text-gray-500">{org.description}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Recent Events */}
          <FadeIn delay={0.4}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Events</h2>
              <div className="space-y-4">
                {participatedEvents.map(event => (
                  <div key={event.id} className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <Calendar className="h-6 w-6 text-primary-500 mt-1" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{event.title}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(event.startDate), 'MMMM d, yyyy')}
                      </p>
                      <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location.address}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>

        <div className="space-y-6">
          {/* Badges */}
          <FadeIn delay={0.2}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Badges</h2>
              <div className="grid grid-cols-3 gap-4">
                {badges.map(badge => (
                  <Badge
                    key={badge.id}
                    icon={<Star className="h-5 w-5" />}
                    label={badge.name}
                    description={badge.description}
                    earned={Math.random() > 0.5}
                    progress={Math.floor(Math.random() * 100)}
                  />
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Availability */}
          <FadeIn delay={0.3}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Availability</h2>
              <div className="space-y-4">
                {daysOfWeek.map(day => (
                  <div key={day} className="space-y-2">
                    <p className="font-medium text-gray-900 capitalize">{day}</p>
                    <div className="flex space-x-2">
                      {timeSlots.map(slot => (
                        <div
                          key={slot}
                          className={`flex-1 p-2 rounded-lg text-center text-sm ${
                            volunteer.availability[day][slot]
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {slot.charAt(0).toUpperCase() + slot.slice(1)}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Impact Stats */}
          <FadeIn delay={0.4}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Impact</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-primary-500" />
                    <span className="text-gray-600">Organizations Joined</span>
                  </div>
                  <span className="font-semibold text-gray-900">{joinedOrgs.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-primary-500" />
                    <span className="text-gray-600">Events Participated</span>
                  </div>
                  <span className="font-semibold text-gray-900">{participatedEvents.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-primary-500" />
                    <span className="text-gray-600">Volunteer Hours</span>
                  </div>
                  <span className="font-semibold text-gray-900">24</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-primary-500" />
                    <span className="text-gray-600">Impact Score</span>
                  </div>
                  <span className="font-semibold text-gray-900">850</span>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}

export default Profile;