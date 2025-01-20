import { Icon, LatLngExpression } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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

interface MapComponentProps {
  positions: Position[];
  activityTypes: Array<{
    name: string;
    show: [boolean, (value: boolean) => void];
  }>;
  showStaticMarkers: boolean;
  isRefreshing: boolean;
}

export const MapComponent = ({ 
  positions, 
  activityTypes, 
  showStaticMarkers,
  isRefreshing 
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
      geocode: [44.4970183, 11.3562014] as LatLngExpression,
      popUp: 'Dipartimento di Informatica - Scienze e Ingegneria',
    },
    {
      geocode: [44.4943, 11.3465] as LatLngExpression,
      popUp: 'Towers of Bologna',
    },
  ];

  const getIconForActivity = (activity: string) => {
    if (activity === 'IN_VEHICLE') {
      return carIcon;
    }
    return markerIcon;
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
      {positions.map(({ userId, latitude, longitude, movingActivity, createdAt }) => {
        const timestamp = parseInt(createdAt) * 1000;
        return (
          activityTypes.find(({ name }) => name === movingActivity)?.show[0] ? (
            <Marker 
              key={userId} 
              position={[latitude, longitude]} 
              icon={getIconForActivity(movingActivity)}
            >
              <Popup>
                {`User ID: ${userId}`}<br />
                {`Activity: ${movingActivity}`}<br />
                {`Time: ${timestamp ? new Date(timestamp).toLocaleString() : 'N/A'}`}
              </Popup>
            </Marker>
          ) : null
        );
      })}
      {showStaticMarkers && staticMarkers.map(({ geocode, popUp }) => (
        <Marker key={popUp} position={geocode} icon={nodeIcon}>
          <Popup>{popUp}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};