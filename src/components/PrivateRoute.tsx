import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const accessToken = localStorage.getItem('accessToken');
  const userId = localStorage.getItem('userId');

  return accessToken && userId ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
