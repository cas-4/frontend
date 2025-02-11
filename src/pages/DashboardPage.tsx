import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { MapComponent } from '../components/MapMarkersComponent';
import { FilterMenu } from '../components/FilterMenu';
import { ClusteringControls } from '../components/ClusteringControlsComponent';
import { kMeansClustering, findOptimalClusters, calculateDistance } from '../utils/clustering-utils';

// Define the Position type
interface Position {
  id: string;
  userId: string;
  createdAt: string;
  latitude: number;
  longitude: number;
  movingActivity: string;
}

// Add new interface for clusters with radius
interface ClusterWithRadius {
  centroid: {
    latitude: number;
    longitude: number;
  };
  points: Position[];
  radius: number;
}

// Define the query response type
interface PositionsQueryResponse {
  positions: Position[];
}

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
  const [clusteringEnabled, setClusteringEnabled] = useState(false);
  const [manualClustering, setManualClustering] = useState(false);
  const [numberOfClusters, setNumberOfClusters] = useState(3);

  const { error, data, loading, refetch } = useQuery<PositionsQueryResponse>(LAST_POSITION_QUERY, {
    fetchPolicy: 'network-only',
    onError: (error) => {
      console.error('GraphQL Error:', error);
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

  const clusteredPositions = useMemo(() => {
    if (!data?.positions || !clusteringEnabled) {
      return data?.positions || [];
    }
  
    // Create a clean array of points with just lat/long
    const points = data.positions.map(pos => ({
      latitude: pos.latitude,
      longitude: pos.longitude,
      originalData: pos
    }));
    
    const k = manualClustering 
      ? numberOfClusters 
      : findOptimalClusters(points);
      
    const clusters = kMeansClustering(points, k);
    
    // Transform clusters to include radius
    const clustersWithRadius: ClusterWithRadius[] = clusters.map(cluster => {
      // Calculate the maximum distance from centroid to any point in the cluster
      const maxDistance = Math.max(
        ...cluster.points.map(point => 
          calculateDistance(
            cluster.centroid,
            { latitude: (point as any).originalData.latitude, longitude: (point as any).originalData.longitude }
          )
        )
      );

      // Add 10% buffer to ensure all points are visibly within the circle
      const radius = maxDistance * 1.1;

      return {
        centroid: cluster.centroid,
        points: cluster.points.map(p => (p as any).originalData),
        radius: radius
      };
    });

    return clustersWithRadius;
  }, [data?.positions, clusteringEnabled, manualClustering, numberOfClusters]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    console.error('Detailed Error Information:', {
      message: error.message,
      networkError: error.networkError,
      graphQLErrors: error.graphQLErrors,
      extraInfo: error.extraInfo,
    });

    if (error.networkError || (error.graphQLErrors && error.graphQLErrors.length > 0)) {
      navigate('/error', { 
        state: { 
          errorMessage: error.message,
          errorType: error.networkError ? 'Network Error' : 'GraphQL Error'
        }
      });
      return null;
    }

    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="text-red-600">
          Error loading data. Please try refreshing the page.
        </div>
      </div>
    );
  }

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
          positions={clusteredPositions}
          activityTypes={activityTypes}
          showStaticMarkers={showStaticMarkers}
          isRefreshing={isRefreshing}
          clustering={{
            enabled: clusteringEnabled,
            automatic: !manualClustering,
            clusterCount: numberOfClusters
          }}
        />
      </div>

      <div>
        <FilterMenu
          activityTypes={activityTypes}
          showStaticMarkers={showStaticMarkers}
          setShowStaticMarkers={setShowStaticMarkers}
        />
      </div>

      <ClusteringControls
        clusteringEnabled={clusteringEnabled}
        setClusteringEnabled={setClusteringEnabled}
        manualClustering={manualClustering}
        setManualClustering={setManualClustering}
        numberOfClusters={numberOfClusters}
        setNumberOfClusters={setNumberOfClusters}
      />

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
    </div>
  );
}