// Logout.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');

    // Redirect to login
    navigate('/login');
  }, [navigate]);

  return <p>Logging out...</p>;
}
