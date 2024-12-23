import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';

import { MapComponent } from '../components/MapMarkersComponent';
import { FilterMenu } from '../components/FilterMenu';

// Define the Position type
interface Position {
  id: string;
  userId: string;
  createdAt: string;
  latitude: number;
  longitude: number;
  movingActivity: string;
}

// Define the query response type
interface PositionsQueryResponse {
  positions: Position[];
}

// Updated query with proper field selections
const LAST_POSITION_QUERY = gql`
  query GetPositions {
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

export default function Dashboard() {
  const navigate = useNavigate();

  // Add fetchPolicy and better error handling
  const { error, data, loading } = useQuery<PositionsQueryResponse>(LAST_POSITION_QUERY, {
    fetchPolicy: 'network-only', // Don't use cache
    onError: (error) => {
      console.error('GraphQL Error:', error);
      // Check for specific error types
      if (error.networkError) {
        console.error('Network Error:', error.networkError);
      }
      if (error.graphQLErrors) {
        error.graphQLErrors.forEach((graphQLError) => {
          console.error('GraphQL Error:', graphQLError);
        });
      }
    }
  });

  const activityTypes = [
    { name: 'STILL', show: useState(true) },
    { name: 'WALKING', show: useState(true) },
    { name: 'RUNNING', show: useState(true) },
    { name: 'IN_VEHICLE', show: useState(true) }
  ];

  const [showStaticMarkers, setShowStaticMarkers] = useState(true);

  // Handle loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Handle error state with more detail
  if (error) {
    // Log detailed error information
    console.error('Detailed Error Information:', {
      message: error.message,
      networkError: error.networkError,
      graphQLErrors: error.graphQLErrors,
      extraInfo: error.extraInfo,
    });

    // Only navigate to error page for certain types of errors
    if (error.networkError || (error.graphQLErrors && error.graphQLErrors.length > 0)) {
      navigate('/error', { 
        state: { 
          errorMessage: error.message,
          errorType: error.networkError ? 'Network Error' : 'GraphQL Error'
        }
      });
      return null;
    }

    // For minor errors, show error message in the dashboard
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="text-red-600">
          Error loading data. Please try refreshing the page.
        </div>
      </div>
    );
  }

  // Validate data before rendering
  if (!data?.positions) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="text-lg">No position data available.</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-green-100">
      <div className="w-full h-full relative">
        <MapComponent
          positions={data.positions}
          activityTypes={activityTypes}
          showStaticMarkers={showStaticMarkers}
        />
      </div>
      <div>
        <FilterMenu
          activityTypes={activityTypes}
          showStaticMarkers={showStaticMarkers}
          setShowStaticMarkers={setShowStaticMarkers}
        />
      </div>
    </div>
  );
}