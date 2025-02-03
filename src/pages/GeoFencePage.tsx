import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup, useMapEvents } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { kMeansClustering } from '../utils/clustering-utils';
import Legend from '../components/Legend';

// Previous constants remain the same
const BOLOGNA_CENTER: [number, number] = [44.49381, 11.33875];
const RADIUS = 5000;
const ZOOM_THRESHOLD = 13;

interface Position {
  latitude: number;
  longitude: number;
}

// Function to generate random markers within radius of Bologna
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

// Color scale based on cluster size
const getColor = (count: number, maxCount: number): string => {
  const colors = [
    '#fee5d9', // smallest
    '#fcae91',
    '#fb6a4a',
    '#de2d26',
    '#a50f15'  // largest
  ];
  
  const index = Math.min(
    Math.floor((count / maxCount) * colors.length),
    colors.length - 1
  );
  return colors[index];
};

// Component to handle zoom level state
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

  const clusters = useMemo(() => {
    if (!clusteringEnabled) return [];
    return kMeansClustering(markers, manualClustering ? numberOfClusters : 5);
  }, [markers, clusteringEnabled, manualClustering, numberOfClusters]);

  const maxClusterSize = useMemo(() => {
    if (clusters.length === 0) return 0;
    return Math.max(...clusters.map(cluster => cluster.points.length));
  }, [clusters]);

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

        {clusteringEnabled && clusters.map((cluster, idx) => {
          const color = getColor(cluster.points.length, maxClusterSize);
          return (
            <Circle
              key={idx}
              center={[cluster.centroid.latitude, cluster.centroid.longitude] as LatLngExpression}
              radius={500}
              pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: 0.4
              }}
            >
              <Popup>
                <div>
                  <strong>Cluster {idx + 1}</strong>
                  <p>{cluster.points.length} points</p>
                </div>
              </Popup>
            </Circle>
          );
        })}
      </MapContainer>

      {/* Clustering Controls */}
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

      {/* Legend */}
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