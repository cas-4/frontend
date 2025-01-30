import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { NavigationBar } from '../components/NavigationBar';
import { gql, useQuery } from '@apollo/client';

const USER_NAME_QUERY = gql`
  query getUserName($userId: Int!) {
    user(id: $userId) {
      name
    }
  }
`;

interface User {
  name: string;
}

export const MainLayout = () => {
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();
  const location = useLocation();

  const { data: userData } = useQuery<{ user: User }>(USER_NAME_QUERY, {
    variables: { userId: parseInt(userId || "0") },
  });

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', current: location.pathname === '/dashboard' },
    { name: 'New Alert', href: '/newalert', current: location.pathname === '/newalert' },
    { name: 'Alerts', href: '/alerts', current: location.pathname === '/alerts' },
    { name: 'Geofence', href: '/geofence', current: location.pathname === '/geofence' }
  ];

  const handleNavigationClick = (href: string) => {
    navigate(href);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <NavigationBar
        userName={userData?.user.name || 'User'}
        navigation={navigation}
        onNavigationClick={handleNavigationClick}
      />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};