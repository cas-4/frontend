import { gql, useQuery } from '@apollo/client';
import { MapContainer, TileLayer, Polygon, useMap} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useRef } from 'react';

interface Alert {
  id: number;
  userId: number;
  createdAt: number;
  area: string;
  areaLevel2: string;
  areaLevel3: string;
  text1: string;
  text2: string;
  text3: string;
  reachedUsers: number;
}

interface AlertsQueryResponse {
  alerts: Alert[];
}

const ALERTS_QUERY = gql`
  query GetAlerts {
    alerts {
      id
      userId
      createdAt
      area
      areaLevel2
      areaLevel3
      text1
      text2
      text3
      reachedUsers
    }
  }
`;

const parsePolygon = (polygonStr: string): [number, number][] => {
  const coordinates = polygonStr
    .replace('POLYGON((', '')
    .replace('))', '')
    .split(',')
    .map(coord => {
      const [lng, lat] = coord.trim().split(' ');
      return [parseFloat(lat), parseFloat(lng)];
    });
  return coordinates.filter(coord => coord.length === 2) as [number, number][];
};

const BoundsHandler = ({ bounds }: { bounds: L.LatLngBounds }) => {
  const map = useMap();
  
  useEffect(() => {
    map.fitBounds(bounds, {
      padding: [25, 25], // Reduced padding for closer zoom
      maxZoom: 18,      // Increased maxZoom to allow closer zoom
      animate: true
    });
  }, [map, bounds]);
  
  return null;
};

const AlertMap = ({ alert }: { alert: Alert }) => {
  const polygon = parsePolygon(alert.area);
  const bounds = L.latLngBounds(polygon);
  const center = bounds.getCenter();

  return (
    <div className="h-[300px] w-full">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={12}
        className="h-full w-full"
        zoomControl={true}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polygon
          positions={polygon}
          pathOptions={{ color: 'red', weight: 2 }}
        />
        <BoundsHandler bounds={bounds} />
      </MapContainer>
    </div>
  );
};

export default function AlertsListPage() {
  const { loading, error, data } = useQuery<AlertsQueryResponse>(ALERTS_QUERY, {
    fetchPolicy: 'network-only',
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="text-red-600">
          Error loading alerts. Please try refreshing the page.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-4 space-y-6">
        <h2 className="text-xl font-bold mb-4 text-white">Alerts</h2>
        <div className="space-y-6">
          {data?.alerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-gray-700 text-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4">
                  <div className="font-semibold">Alert #{alert.id}</div>
                  <div className="text-sm text-gray-300">
                    User ID: {alert.userId}
                  </div>
                  <div className="text-sm text-gray-300">
                    Date: {new Date(alert.createdAt * 1000).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-300">
                    Reached Users: {alert.reachedUsers}
                  </div>
                  <div className="mt-2">
                    <div>Level 1: {alert.text1}</div>
                    <div>Level 2: {alert.text2}</div>
                    <div>Level 3: {alert.text3}</div>
                  </div>
                </div>
                <AlertMap alert={alert} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}