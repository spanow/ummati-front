import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/dashboard/Dashboard';
import Organizations from '../pages/organizations/Organizations';
import OrganizationDetails from '../pages/organizations/OrganizationDetails';
import OrganizationSettings from '../pages/organizations/OrganizationSettings';
import CreateOrganization from '../pages/organizations/CreateOrganization';
import InviteVolunteers from '../pages/organizations/InviteVolunteers';
import Events from '../pages/events/Events';
import EventDetails from '../pages/events/EventDetails';
import CreateEvent from '../pages/events/CreateEvent';
import EventManagement from '../pages/events/EventManagement';
import Profile from '../pages/profile/Profile';
import Settings from '../pages/settings/Settings';
import Notifications from '../pages/notifications/Notifications';
import ProtectedRoute from './ProtectedRoute';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

function AppRoutes() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/organizations" element={<Organizations />} />
      <Route path="/organizations/:id" element={<OrganizationDetails />} />
      <Route path="/events" element={<Events />} />
      <Route path="/organizations/:organizationId/events" element={<Events />} />
      <Route path="/events/:id" element={<EventDetails />} />
      
      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/organizations/create"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <CreateOrganization />
          </ProtectedRoute>
        }
      />
      <Route
        path="/organizations/:id/settings"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <OrganizationSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/organizations/:id/invite"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <InviteVolunteers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/organizations/:organizationId/events/create"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <CreateEvent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Notifications />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;