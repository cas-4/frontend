import { gql, useQuery } from '@apollo/client';
import { MapContainer, TileLayer, Polygon, useMap} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

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
    <div className="h-full w-full">
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
      <div className="flex items-center justify-center w-full h-full min-h-[400px]">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-[400px]">
        <div className="text-red-600">
          Error loading alerts. Please try refreshing the page.
        </div>
      </div>
    );
  }

  if (!data?.alerts || data.alerts.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="p-4 lg:p-8 max-w-5xl mx-auto">
          <div className="bg-gray-700 text-white rounded-lg shadow-md p-8 text-center">
            <svg 
              className="w-16 h-16 mx-auto mb-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <h2 className="text-xl font-semibold mb-2">No Alerts Found</h2>
            <p className="text-gray-300 mb-4">There are currently no alerts in the system.</p>
            <p className="text-gray-400 text-sm">
              New alerts will appear here when they are created.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="p-4 lg:p-8 space-y-6 max-w-5xl mx-auto">
        <div className="space-y-6">
          {data.alerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-gray-700 text-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-4">
                <div className="p-6">
                  <div className="font-semibold text-xl lg:mb-4">Alert #{alert.id}</div>
                  <div className="text-gray-300">
                    User ID: {alert.userId}
                  </div>
                  <div className="text-gray-300">
                    Date: {new Date(alert.createdAt * 1000).toLocaleString()}
                  </div>
                  <div className="text-gray-300">
                    Reached Users: {alert.reachedUsers}
                  </div>
                  <div className="lg:mt-4 lg:space-y-2">
                    <div>Level 1: {alert.text1}</div>
                    <div>Level 2: {alert.text2}</div>
                    <div>Level 3: {alert.text3}</div>
                  </div>
                </div>
                <div className="h-[400px]">
                  <AlertMap alert={alert} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}