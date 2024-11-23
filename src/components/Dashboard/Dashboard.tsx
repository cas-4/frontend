import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { NavigationBar } from './NavigationBar';
import { FilterMenu } from './FilterMenu';
import { MapComponent } from './MapComponent';

const USER_NAME_QUERY = gql`
  query getUserName($userId: ID!) {
    user(id: $userId) {
      name
    }
  }
`;

const LAST_POSITION_QUERY = gql`
  query positions {
    positions {
      id
      userId
      createdAt
      latitude
      longitude
      movingActivity
    }
  }
`;

interface User {
  name: string;
}

interface LastPosition {
  id: string;
  userId: string;
  createdAt: string;
  latitude: number;
  longitude: number;
  movingActivity: string;
}

export default function Dashboard() {
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const { data: userData } = useQuery<{ user: User }>(USER_NAME_QUERY, {
    variables: { userId: parseInt(userId || "0") },
  });

  const { error, data } = useQuery<{ positions: LastPosition[] }>(LAST_POSITION_QUERY);

  const activityTypes = [
    { name: 'STILL', show: useState(true) },
    { name: 'WALKING', show: useState(true) },
    { name: 'RUNNING', show: useState(true) },
    { name: 'IN_VEHICLE', show: useState(true) }
  ];

  const [showStaticMarkers, setShowStaticMarkers] = useState(true);

  if (error) {
    navigate('/error');
    return null;
  }

  const userName = userData?.user.name || 'User';

  return (
    <div className="flex flex-col h-screen">
      <NavigationBar userName={userName} />
      <div className="relative flex flex-col justify-center items-center flex-grow bg-gray-100">
        <MapComponent 
          positions={data?.positions || []}
          activityTypes={activityTypes}
          showStaticMarkers={showStaticMarkers}
        />
        <FilterMenu
          activityTypes={activityTypes}
          showStaticMarkers={showStaticMarkers}
          setShowStaticMarkers={setShowStaticMarkers}
        />
      </div>
    </div>
  );
}