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
  const [isRefreshing, setIsRefreshing] = useState(false);

// Add fetchPolicy and better error handling
  const { error, data, loading, refetch } = useQuery<PositionsQueryResponse>(LAST_POSITION_QUERY, {
    fetchPolicy: 'network-only',
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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

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
      <div className="absolute bottom-4 right-4 z-50">
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center px-4 py-2 text-white font-bold bg-blue-600 rounded-md shadow-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <svg
            className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh Markers'}</span>
        </button>
      </div>
      <div className="w-full h-full relative">
        <MapComponent
          positions={data.positions}
          activityTypes={activityTypes}
          showStaticMarkers={showStaticMarkers}
          isRefreshing={isRefreshing}
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