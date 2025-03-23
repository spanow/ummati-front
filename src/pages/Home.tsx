import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Calendar, Users, Building2, Heart, ArrowRight } from 'lucide-react';

function Home() {
  const { organizations } = useSelector((state: RootState) => state.organizations);
  const { events } = useSelector((state: RootState) => state.events);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 opacity-90" />
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="h-16 w-16 text-white mx-auto mb-8 animate-fade-in" />
          <h1 className="text-5xl font-bold text-white mb-6 animate-fade-in">
            Welcome to Ummati
          </h1>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto animate-fade-in">
            Join our platform to connect with organizations and participate in meaningful volunteer work that creates lasting positive change.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center px-8 py-4 rounded-full bg-white text-primary-600 font-semibold hover:bg-gray-50 transition-all transform hover:-translate-y-1 hover:shadow-xl animate-fade-in"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto -mt-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-xl animate-fade-in">
            <Building2 className="h-12 w-12 text-primary-500 mb-4" />
            <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-transparent bg-clip-text">
              {organizations.length}
            </h3>
            <p className="text-gray-600 text-lg">Active Organizations</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Calendar className="h-12 w-12 text-primary-500 mb-4" />
            <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-transparent bg-clip-text">
              {events.length}
            </h3>
            <p className="text-gray-600 text-lg">Upcoming Events</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-xl animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Users className="h-12 w-12 text-primary-500 mb-4" />
            <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-transparent bg-clip-text">
              1,000+
            </h3>
            <p className="text-gray-600 text-lg">Active Volunteers</p>
          </div>
        </div>
      </div>

      {/* Featured Organizations */}
      <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-primary-600 to-secondary-600 text-transparent bg-clip-text">
          Featured Organizations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {organizations.slice(0, 3).map((org, index) => (
            <div 
              key={org.id} 
              className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:-translate-y-2 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="p-8">
                <h3 className="text-2xl font-semibold mb-4">{org.name}</h3>
                <p className="text-gray-600 mb-6">{org.description}</p>
                <Link
                  to={`/organizations/${org.id}`}
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                >
                  Learn More
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;