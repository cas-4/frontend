import { useState, useRef } from 'react';
import { gql, useMutation } from '@apollo/client';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import L, { LatLngExpression, LayerEvent } from 'leaflet';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';

// GraphQL mutation
const NEW_ALERT_MUTATION = gql`
  mutation NewAlert($input: AlertInput!) {
    newAlert(input: $input) {
      id
      createdAt
    }
  }
`;

type Point = { latitude: number; longitude: number };

const closePolygon = (points: Point[]): Point[] => {
  if (points.length === 0) return [];
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];

  if (
    firstPoint.latitude !== lastPoint.latitude ||
    firstPoint.longitude !== lastPoint.longitude
  ) {
    return [...points, firstPoint];
  }

  return points;
};

export default function Alert() {
  const [executeMutation] = useMutation(NEW_ALERT_MUTATION);

  const [alertTexts, setAlertTexts] = useState({
    text1: '',
    text2: '',
    text3: '',
  });
  const [coordinates, setCoordinates] = useState<Point[]>([]);
  const [isPolygonComplete, setIsPolygonComplete] = useState(false);
  const [isInEditMode, setIsInEditMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const position: LatLngExpression = [44.49381, 11.33875]; // Bologna
  const drawnItemsRef = useRef<L.FeatureGroup>(new L.FeatureGroup());

  const handleGeometryCreated = (e: LayerEvent) => {
    drawnItemsRef.current.clearLayers();
    const layer = e.layer as L.Polygon;
    drawnItemsRef.current.addLayer(layer);

    const coords = (layer.getLatLngs()[0] as L.LatLng[]).map((latlng: L.LatLng) => ({
      latitude: latlng.lat,
      longitude: latlng.lng,
    }));

    setCoordinates(closePolygon(coords));
    setIsPolygonComplete(true);
    setIsInEditMode(false);
  };

  const handleDeleted = () => {
    setCoordinates([]);
    setIsPolygonComplete(false);
    setIsInEditMode(false);
  };

  const handleSubmit = async () => {
    if (!isPolygonComplete || isInEditMode) return;

    try {
      await executeMutation({
        variables: {
          input: {
            points: coordinates,
            text1: alertTexts.text1,
            text2: alertTexts.text2,
            text3: alertTexts.text3,
          },
        },
      });
    } catch (error) {
      console.error('Error submitting the alert:', error);
    }
  };

  const onTextChange = (field: keyof typeof alertTexts, value: string) => {
    setAlertTexts({ ...alertTexts, [field]: value });
  };

  return (
    <div className="relative flex flex-col md:flex-row w-full h-full">
      {/* Header and Toggle for small screens */}
      <div className="flex justify-between items-center md:hidden p-4 bg-gray-100 w-full">
        <h2 className="text-xl font-semibold">Alert Information</h2>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="focus:outline-none ml-2"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <ChevronUpIcon className="w-6 h-6 text-gray-700" />
          ) : (
            <ChevronDownIcon className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </div>

      {/* Sidebar for all screen sizes */}
      <div
        className={`z-50 bg-gray-100 overflow-y-auto transition-all ${
          isMenuOpen || window.innerWidth >= 768 ? 'block' : 'hidden'
        } md:block md:w-100 lg:w-100`}
      >
        <div className="p-4">
          {/* Heading only visible on md and above */}
          <div className="hidden md:block">
            <h2 className="text-xl font-semibold mb-4">Alert Information</h2>
          </div>
          <div>
            <div className="mb-4">
              <label className="block mb-2">Alert Level 1</label>
              <textarea
                value={alertTexts.text1}
                onChange={(e) => onTextChange('text1', e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter first level alert text"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Alert Level 2</label>
              <textarea
                value={alertTexts.text2}
                onChange={(e) => onTextChange('text2', e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter second level alert text"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Alert Level 3</label>
              <textarea
                value={alertTexts.text3}
                onChange={(e) => onTextChange('text3', e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter third level alert text"
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={
                !isPolygonComplete ||
                isInEditMode ||
                !alertTexts.text1 ||
                !alertTexts.text2 ||
                !alertTexts.text3
              }
              className={`w-full p-2 rounded ${
                isPolygonComplete &&
                !isInEditMode &&
                alertTexts.text1 &&
                alertTexts.text2 &&
                alertTexts.text3
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Create Alert
            </button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-grow sm:ml-0">
        <MapContainer center={position} zoom={14} className="h-full w-full">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <FeatureGroup ref={drawnItemsRef}>
            <EditControl
              position="topright"
              onCreated={handleGeometryCreated}
              onDeleted={handleDeleted}
              draw={{
                polygon: {
                  allowIntersection: false,
                  drawError: {
                    color: '#e1e100',
                    timeout: 1000,
                  },
                  shapeOptions: {
                    color: '#ff0000',
                  },
                },
                polyline: false,
                rectangle: false,
                circle: false,
                marker: false,
                circlemarker: false,
              }}
            />
          </FeatureGroup>
        </MapContainer>
      </div>
    </div>
  );
}