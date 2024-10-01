import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const accessToken = localStorage.getItem('accessToken');
  const userId = localStorage.getItem('userId');

  return accessToken && userId ? children : <Navigate to="/login" />;
}