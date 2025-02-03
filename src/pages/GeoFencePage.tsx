import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Polygon, Popup, useMapEvents } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { kMeansClustering } from '../utils/clustering-utils';
import Legend from '../components/Legend';

const BOLOGNA_CENTER: [number, number] = [44.49381, 11.33875];
const RADIUS = 5000;
const ZOOM_THRESHOLD = 12;

interface Position {
  latitude: number;
  longitude: number;
}

// Function to compute the convex hull using Graham Scan algorithm
function computeConvexHull(points: Position[]): Position[] {
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
      if (angleA < angleB) return -1;
      if (angleA > angleB) return 1;
      return 0;
    });

  // Initialize stack with first three points
  let hull: Position[] = [bottomPoint];
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

  // Add the first point again to close the polygon
  hull.push(bottomPoint);
  return hull;
}

// Helper function to determine if three points make a left turn
function isLeftTurn(p1: Position, p2: Position, p3: Position): boolean {
  return (
    (p2.longitude - p1.longitude) * (p3.latitude - p1.latitude) -
    (p2.latitude - p1.latitude) * (p3.longitude - p1.longitude)
  ) > 0;
}

// Rest of the utility functions remain the same
const generateRandomMarkers = (count: number): Position[] => {
  const markers: Position[] = [];
  for (let i = 0; i < count; i++) {
    const radiusInDeg = RADIUS / 111300;
    const angle = Math.random() * 2 * Math.PI;
    const r = Math.sqrt(Math.random()) * radiusInDeg;
    
    markers.push({
      latitude: BOLOGNA_CENTER[0] + r * Math.cos(angle),
      longitude: BOLOGNA_CENTER[1] + r * Math.sin(angle)
    });
  }
  return markers;
};

const getColor = (count: number, maxCount: number): string => {
  const colors = [
    '#fee5d9',
    '#fcae91',
    '#fb6a4a',
    '#de2d26',
    '#a50f15'
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
  const [markers] = useState<Position[]>(generateRandomMarkers(50));
  const [clusteringEnabled, setClusteringEnabled] = useState(false);
  const [manualClustering, setManualClustering] = useState(false);
  const [numberOfClusters, setNumberOfClusters] = useState(3);
  const [currentZoom, setCurrentZoom] = useState(13);
  const [showLegend, setShowLegend] = useState(true);

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

        {(!clusteringEnabled || showIndividualMarkers) && markers.map((marker, idx) => (
          <Marker
            key={idx}
            position={[marker.latitude, marker.longitude] as LatLngExpression}
          >
            <Popup>Marker {idx + 1}</Popup>
          </Marker>
        ))}

        {clusteringEnabled && clustersWithHulls.map((cluster, idx) => {
          const color = getColor(cluster.points.length, maxClusterSize);
          const positions = cluster.hull.map(point => [point.latitude, point.longitude]) as LatLngExpression[];
          
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

      {/* Controls remain the same */}
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