import { Icon, LatLngExpression } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import markerIconSvg from '../assets/marker.svg';
import nodeSvg from '../assets/node.svg';
import carSvg from '../assets/car.svg';

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

export const MapComponent = ({
  positions,
  activityTypes,
  showStaticMarkers,
  isRefreshing,
  clustering,
}: MapComponentProps) => {
  const position: LatLngExpression = [44.49381, 11.33875]; // Bologna

  const markerIcon = new Icon({
    iconUrl: markerIconSvg,
    iconSize: [30, 30],
    className: `marker-icon ${isRefreshing ? 'opacity-50' : ''}`
  });

  const nodeIcon = new Icon({
    iconUrl: nodeSvg,
    iconSize: [30, 30],
    className: `node-icon ${isRefreshing ? 'opacity-50' : ''}`
  });

  const carIcon = new Icon({
    iconUrl: carSvg,
    iconSize: [30, 30],
    className: `car-icon ${isRefreshing ? 'opacity-50' : ''}`
  });

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

  const getIconForActivity = (activity: string) => {
    if (activity === 'IN_VEHICLE') {
      return carIcon;
    }
    return markerIcon;
  };

  const renderMarkers = () => {
    if (!clustering.enabled) {
      return (positions as Position[]).filter(({ movingActivity }) =>
        activityTypes.find(({ name }) => name === movingActivity)?.show[0]
      ).map(({ userId, latitude, longitude, movingActivity, createdAt }) => (
        <Marker
          key={userId}
          position={[latitude, longitude]}
          icon={getIconForActivity(movingActivity)}
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
    return (positions as ClusterData[]).map((cluster, index) => (
      <CircleMarker
        key={`cluster-${index}`}
        center={[cluster.centroid.latitude, cluster.centroid.longitude]}
        radius={Math.max(15, Math.min(30, cluster.points.length * 2))}
        fillColor="#3388ff"
        color="#3388ff"
        weight={2}
        opacity={0.6}
        fillOpacity={0.4}
      >
        <Popup>
          <div>
            <strong>Cluster {index + 1}</strong><br />
            Points in cluster: {cluster.points.length}<br />
            Activities: {Array.from(new Set(cluster.points.map(p => p.movingActivity))).join(', ')}
          </div>
        </Popup>
      </CircleMarker>
    ));
  };

  return (
    <MapContainer
      center={position}
      zoom={14}
      className="w-full h-full absolute top-0 left-0 right-0 bottom-0"
      style={{ zIndex: 1 }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
      />
      {renderMarkers()}
      {showStaticMarkers && staticMarkers.map(({ geocode, popUp }) => (
        <Marker key={popUp} position={geocode} icon={nodeIcon}>
          <Popup>
            {`IP: ${popUp}`}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};