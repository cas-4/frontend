import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import NotFound from './pages/NotFound';
import Logout from './pages/Logout';
import ErrorPage from './pages/ErrorPage';
import Alert from './pages/AlertPage';
import Alerts from './pages/AlertsListPage';
import Dashboard from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
//import GeoFencePage from './pages/GeoFencePage';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/" element={<Login />} />
        <Route path="*" element={<NotFound />} />

        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/newalert" element={<Alert />} />
            <Route path="/alerts" element={<Alerts />} />
            {/* <Route path="/geofence" element={<GeoFencePage />} /> */}
            <Route path="/settings" element={<SettingsPage/> } />
          </Route>
        </Route>

      </Routes>
    </Router>
  );
};