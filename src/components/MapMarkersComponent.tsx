import { Icon, LatLngExpression } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { useState, useMemo } from 'react';
import 'leaflet/dist/leaflet.css';

import markerIconSvg from '../assets/marker.svg';
import nodeSvg from '../assets/node.svg';
import carSvg from '../assets/car.svg';
import walkingSvg from '../assets/walking.svg';
import runningSvg from '../assets/running.svg';


interface Position {
  userId: string;
  latitude: number;
  longitude: number;
  movingActivity: string;
  createdAt: string;
}

interface ClusterData {
  centroid: {
    latitude: number;
    longitude: number;
  };
  points: Position[];
  radius: number;
}

interface MapComponentProps {
  positions: Position[] | ClusterData[];
  activityTypes: Array<{
    name: string;
    show: [boolean, (value: boolean) => void];
  }>;
  showStaticMarkers: boolean;
  isRefreshing: boolean;
  clustering: {
    enabled: boolean;
    automatic: boolean;
    clusterCount: number;
  };
}

// Color scale from light to dark red (5 colors)
const colorScale = [
  '#b22222', // Dark Red
  '#ff8c00', // Dark Orange
  '#3cb371', // Dark Green
  '#008080', // Teal
  '#4b0082'  // Indigo
];

// Define activity icons mapping
const activityIcons: Record<string, Icon> = {
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

const getClusterColor = (pointCount: number, maxPoints: number): string => {
  if (maxPoints === 1) return colorScale[0];
  
  // Calculate the index in the color scale based on the number of points
  const index = Math.floor((pointCount - 1) / (maxPoints - 1) * (colorScale.length - 1));
  return colorScale[Math.min(colorScale.length - 1, index)];
};

// MapInfo component to get current zoom level
const MapInfo = ({ onZoomChange }: { onZoomChange: (zoom: number) => void }) => {
  const map = useMap();
  
  map.on('zoomend', () => {
    onZoomChange(map.getZoom());
  });
  
  return null;
};

export const MapComponent = ({
  positions,
  activityTypes,
  showStaticMarkers,
  isRefreshing,
  clustering,
}: MapComponentProps) => {
  const position: LatLngExpression = [44.49381, 11.33875]; // Bologna
  const [currentZoom, setCurrentZoom] = useState(14);

  // Keep only the node icon for static markers
  const nodeIcon = new Icon({
    iconUrl: nodeSvg,
    iconSize: [30, 30],
    className: `node-icon ${isRefreshing ? 'opacity-50' : ''}`
  });

  const getIconForActivity = (activity: string) => {
    const icon = activityIcons[activity];
    if (!icon) return activityIcons['STILL']; // fallback to default marker
    
    // Clone the icon to add the refreshing class if needed
    return new Icon({
      ...icon.options,
      className: `${icon.options.className || ''} ${isRefreshing ? 'opacity-50' : ''}`
    });
  };

  const staticMarkers = [
    {
      geocode: [44.49709500295995, 11.355904805995294] as LatLngExpression,
      popUp: '130.136.3.151',
    },
    {
      geocode: [44.49710473084329, 11.356054825388128] as LatLngExpression,
      popUp: '130.136.3.152',
    },
    {
      geocode: [44.49703015035982, 11.355977542669905] as LatLngExpression,
      popUp: '130.136.3.153',
    },
  ];

  const maxClusterSize = useMemo(() => {
    if (!clustering.enabled || !Array.isArray(positions)) return 1;
    return Math.max(...(positions as ClusterData[]).map(cluster => cluster.points.length));
  }, [positions, clustering.enabled]);

  const renderMarkers = () => {
    if (!clustering.enabled) {
      return (positions as Position[]).filter(({ movingActivity }) =>
        activityTypes.find(({ name }) => name === movingActivity)?.show[0]
      ).map(({ userId, latitude, longitude, movingActivity, createdAt }) => (
        <Marker
          key={userId}
          position={[latitude, longitude]}
          icon={getIconForActivity(movingActivity)}
          zIndexOffset={1000}
        >
          <Popup>
            {`User ID: ${userId}`}<br />
            {`Activity: ${movingActivity}`}<br />
            {`Time: ${new Date(parseInt(createdAt) * 1000).toLocaleString()}`}
          </Popup>
        </Marker>
      ));
    }

    // Handle clusters
    return (positions as ClusterData[]).map((cluster, index) => {
      const { centroid, points, radius } = cluster;
      const clusterColor = getClusterColor(points.length, maxClusterSize);
      
      return (
        <div key={`cluster-${index}`}>
          <Circle
            center={[centroid.latitude, centroid.longitude]}
            radius={Math.max(radius * 1000, 100)}
            fillColor={clusterColor}
            color={clusterColor}
            weight={2}
            opacity={0.6}
            fillOpacity={0.2}
          >
            <Popup>
              <div>
                <strong>Cluster {index + 1}</strong><br />
                Points in cluster: {points.length}<br />
                Activities: {Array.from(new Set(points.map(p => p.movingActivity))).join(', ')}<br />
                Radius: {radius.toFixed(2)} km
              </div>
            </Popup>
          </Circle>

          {points.map((point, pointIndex) => (
            <Marker
              key={`${index}-${pointIndex}`}
              position={[point.latitude, point.longitude]}
              icon={getIconForActivity(point.movingActivity)}
              zIndexOffset={1000}
            >
              <Popup>
                {`User ID: ${point.userId}`}<br />
                {`Activity: ${point.movingActivity}`}<br />
                {`Time: ${new Date(parseInt(point.createdAt) * 1000).toLocaleString()}`}
              </Popup>
            </Marker>
          ))}
        </div>
      );
    });
  };

  return (
    <>
      <MapContainer
        center={position}
        zoom={14}
        className="w-full h-full absolute top-0 left-0 right-0 bottom-0"
        style={{ zIndex: 1 }}
      >
        <MapInfo onZoomChange={setCurrentZoom} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />
        {renderMarkers()}
        {showStaticMarkers && staticMarkers.map(({ geocode, popUp }) => (
          <Marker 
            key={popUp} 
            position={geocode} 
            icon={nodeIcon}
            zIndexOffset={1000}
          >
            <Popup>
              {`IP: ${popUp}`}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
    </>
  );
};