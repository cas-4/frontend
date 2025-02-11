import React, { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polygon, Popup, useMapEvents } from 'react-leaflet';
import { LatLngExpression, Icon } from 'leaflet';
import { 
  kMeansClustering, 
  Point, 
  determineMovingActivity, 
  generateMovement 
} from '../utils/clustering-utils';
import Legend from '../components/Legend';
import markerIconSvg from '../assets/marker.svg';
import runningSvg from '../assets/running.svg';
import walkingSvg from '../assets/walking.svg';
import carSvg from '../assets/car.svg';


// Custom icons for different activities
const activityIcons: Record<Exclude<Point['movingActivity'], undefined>, Icon> = {
  'STILL': new Icon({
    iconUrl: markerIconSvg,
    iconSize: [32, 32]
  }),
  'WALKING': new Icon({
    iconUrl: walkingSvg,
    iconSize: [32, 32]
  }),
  'RUNNING': new Icon({
    iconUrl: runningSvg,
    iconSize: [32, 32]
  }),
  'IN_VEHICLE': new Icon({
    iconUrl: carSvg,
    iconSize: [32, 32]
  })
};

const BOLOGNA_CENTER: [number, number] = [44.49381, 11.33875];
const RADIUS = 5000;
const ZOOM_THRESHOLD = 12;

// Generate random markers with speed and activity
const generateRandomMarkers = (count: number): Point[] => {
  const markers: Point[] = [];
  for (let i = 0; i < count; i++) {
    const radiusInDeg = RADIUS / 111300;
    const angle = Math.random() * 2 * Math.PI;
    const r = Math.sqrt(Math.random()) * radiusInDeg;
    
    const speed = Math.random() * 10; // Random speed up to 10 km/h
    
    markers.push({
      latitude: BOLOGNA_CENTER[0] + r * Math.cos(angle),
      longitude: BOLOGNA_CENTER[1] + r * Math.sin(angle),
      speed,
      movingActivity: determineMovingActivity(speed)
    });
  }
  return markers;
};

// Convex hull calculation
function computeConvexHull(points: Point[]): Point[] {
  if (points.length < 3) return points;

  // Find the point with the lowest y-coordinate (and leftmost if tied)
  let bottomPoint = points.reduce((lowest, current) => {
    if (current.latitude < lowest.latitude || 
       (current.latitude === lowest.latitude && current.longitude < lowest.longitude)) {
      return current;
    }
    return lowest;
  }, points[0]);

  // Sort points by polar angle with respect to bottom point
  let sortedPoints = points
    .filter(p => p !== bottomPoint)
    .sort((a, b) => {
      let angleA = Math.atan2(a.latitude - bottomPoint.latitude, a.longitude - bottomPoint.longitude);
      let angleB = Math.atan2(b.latitude - bottomPoint.latitude, b.longitude - bottomPoint.longitude);
      return angleA - angleB;
    });

  // Graham's scan algorithm
  let hull: Point[] = [bottomPoint];
  sortedPoints.forEach(point => {
    while (
      hull.length >= 2 &&
      !isLeftTurn(
        hull[hull.length - 2],
        hull[hull.length - 1],
        point
      )
    ) {
      hull.pop();
    }
    hull.push(point);
  });

  return hull;
}

// Helper function to determine left turn
function isLeftTurn(p1: Point, p2: Point, p3: Point): boolean {
  return (
    (p2.longitude - p1.longitude) * (p3.latitude - p1.latitude) -
    (p2.latitude - p1.latitude) * (p3.longitude - p1.longitude)
  ) > 0;
}

// Color utility
const getColor = (count: number, maxCount: number): string => {
  const colors = [
    '#b22222', // Dark Red
    '#ff8c00', // Dark Orange
    '#3cb371', // Dark Green
    '#008080', // Teal
    '#4b0082'  // Indigo
  ];  
  
  const index = Math.min(
    Math.floor((count / maxCount) * colors.length),
    colors.length - 1
  );
  return colors[index];
};

const ZoomHandler: React.FC<{ onZoomChange: (zoom: number) => void }> = ({ onZoomChange }) => {
  const map = useMapEvents({
    zoomend: () => {
      onZoomChange(map.getZoom());
    }
  });
  return null;
};

const GeoFencePage: React.FC = () => {
  const [markers, setMarkers] = useState<Point[]>(generateRandomMarkers(50));
  const [clusteringEnabled, setClusteringEnabled] = useState(false);
  const [manualClustering, setManualClustering] = useState(false);
  const [numberOfClusters, setNumberOfClusters] = useState(3);
  const [currentZoom, setCurrentZoom] = useState(13);
  const [showLegend, setShowLegend] = useState(true);
  const [isAutoUpdateRunning, setIsAutoUpdateRunning] = useState(false);

  // Update marker positions periodically
  useEffect(() => {
    if (!isAutoUpdateRunning) return;

    const interval = setInterval(() => {
      setMarkers(prevMarkers => 
        prevMarkers.map(marker => {
          const { dx, dy } = generateMovement(marker.movingActivity);
          return {
            ...marker,
            latitude: marker.latitude + dy,
            longitude: marker.longitude + dx
          };
        })
      );
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [isAutoUpdateRunning]);

  // Clustering logic
  const clustersWithHulls = useMemo(() => {
    if (!clusteringEnabled) return [];
    const clusters = kMeansClustering(markers, manualClustering ? numberOfClusters : 5);
    
    return clusters.map(cluster => ({
      ...cluster,
      hull: computeConvexHull(cluster.points)
    }));
  }, [markers, clusteringEnabled, manualClustering, numberOfClusters]);

  const maxClusterSize = useMemo(() => {
    if (clustersWithHulls.length === 0) return 0;
    return Math.max(...clustersWithHulls.map(cluster => cluster.points.length));
  }, [clustersWithHulls]);

  const showIndividualMarkers = currentZoom > ZOOM_THRESHOLD;

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={BOLOGNA_CENTER as LatLngExpression}
        zoom={13}
        style={{ height: "100vh", width: "100%" }}
        className='z-0'
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <ZoomHandler onZoomChange={setCurrentZoom} />

        {(!clusteringEnabled || showIndividualMarkers) && markers.map((marker, idx) => {
          // Use pre-defined icon, fallback to default if no activity determined
          const icon = marker.movingActivity 
            ? activityIcons[marker.movingActivity] 
            : activityIcons['STILL'];

          return (
            <Marker
              key={idx}
              icon={icon}
              position={[marker.latitude, marker.longitude] as LatLngExpression}
            >
              <Popup>
                Marker {idx + 1}
                <br />
                Activity: {marker.movingActivity}
                <br />
                Speed: {marker.speed?.toFixed(2)} km/h
              </Popup>
            </Marker>
          );
        })}

        {clusteringEnabled && clustersWithHulls.map((cluster, idx) => {
          const color = getColor(cluster.points.length, maxClusterSize);
          const positions = cluster.hull.map(point => 
            [point.latitude, point.longitude] as LatLngExpression
          );
          
          return (
            <Polygon
              key={idx}
              positions={positions}
              pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: 0.4,
                weight: 2
              }}
            >
              <Popup>
                <div>
                  <strong>Cluster {idx + 1}</strong>
                  <p>{cluster.points.length} points</p>
                </div>
              </Popup>
            </Polygon>
          );
        })}
      </MapContainer>

      {/* Control Panel */}
      <div className="z-50 absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-md w-64">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Enable Clustering</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={clusteringEnabled}
                onChange={(e) => setClusteringEnabled(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          {clusteringEnabled && (
            <>
              <div className="flex items-center justify-between">
                <span className="font-medium">Manual Clustering</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={manualClustering}
                    onChange={(e) => setManualClustering(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {manualClustering && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Number of Clusters:</span>
                    <span className="font-medium">{numberOfClusters}</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="10"
                    step="1"
                    value={numberOfClusters}
                    onChange={(e) => setNumberOfClusters(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              )}

            </>
          )}
            <div className="flex items-center justify-between">
              <span className="font-medium">Auto Update</span>
              <button 
                onClick={() => setIsAutoUpdateRunning(!isAutoUpdateRunning)}
                className={`px-3 py-1 rounded ${
                  isAutoUpdateRunning 
                    ? 'bg-red-500 text-white' 
                    : 'bg-green-500 text-white'
                }`}
              >
                {isAutoUpdateRunning ? 'Stop' : 'Start'}
              </button>
            </div>
        </div>
      </div>

      {clusteringEnabled && (
        <Legend 
          visible={showLegend} 
          onToggle={() => setShowLegend(!showLegend)}
          showZoomInfo={true}
          zoom={13}
        />
      )}
    </div>
  );
};

export default GeoFencePage;