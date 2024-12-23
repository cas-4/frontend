import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const accessToken = localStorage.getItem('accessToken');
  const userId = localStorage.getItem('userId');

  return accessToken && userId ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;