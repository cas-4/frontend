import { useState, useEffect, useRef } from 'react';
import { gql, useMutation } from '@apollo/client';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import L, { LatLngExpression, LayerEvent } from 'leaflet';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';

const NEW_ALERT_MUTATION = gql`
  mutation NewAlert($input: AlertInput!) {
    newAlert(input: $input) {
      id
      createdAt
    }
  }
`;

type Point = { latitude: number; longitude: number };

interface EditLayersEvent extends L.LeafletEvent {
  layers: L.LayerGroup;
}

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

const LOCAL_STORAGE_KEY = 'alertData';

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
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'success' | 'error' | 'info' | 'loading' | ''>('');
  const [showModal, setShowModal] = useState(false);

  const position: LatLngExpression = [44.49381, 11.33875]; // Bologna
  const drawnItemsRef = useRef<L.FeatureGroup>(new L.FeatureGroup());

  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setAlertTexts(parsedData.alertTexts || { text1: '', text2: '', text3: '' });
        setCoordinates(parsedData.coordinates || []);
        setIsPolygonComplete(parsedData.isPolygonComplete || false);
      } catch (error) {
        console.error('Error parsing localStorage data:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({ alertTexts, coordinates, isPolygonComplete })
    );
  }, [alertTexts, coordinates, isPolygonComplete]);

  useEffect(() => {
    const restorePolygon = () => {
      if (coordinates.length > 0 && drawnItemsRef.current) {
        drawnItemsRef.current.clearLayers();

        const latLngs = coordinates.map((point) => [point.latitude, point.longitude] as [number, number]);
        const polygon = L.polygon(latLngs, {
          color: '#ff0000',
        });

        drawnItemsRef.current.addLayer(polygon);
      }
    };

    restorePolygon();
  }, [coordinates]);

  const onTextChange = (field: keyof typeof alertTexts, value: string) => {
    setAlertTexts((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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
  
    // Show loading modal
    setModalMessage('Creating alert... Please wait.');
    setModalType('loading');
    setShowModal(true);
  
    try {
      const { data, errors } = await executeMutation({
        variables: {
          input: {
            points: coordinates,
            text1: alertTexts.text1,
            text2: alertTexts.text2,
            text3: alertTexts.text3,
          },
        },
      });
  
      if (errors || !data?.newAlert?.id) {
        console.error('GraphQL errors:', errors);
        throw new Error('Error creating the alert. Please try again.');
      }
  
      setModalMessage('Alert created successfully!');
      setModalType('success');
  
      // Clear the drawn polygon from the map
      drawnItemsRef.current.clearLayers();
  
      // Reset the state
      setAlertTexts({ text1: '', text2: '', text3: '' });
      setCoordinates([]);
      setIsPolygonComplete(false);
  
    } catch (error) {
      console.error('Mutation error:', error);
      setModalMessage('Error creating the alert. Please try again.');
      setModalType('error');
    }
  };
    
  const handleEdited = (e: EditLayersEvent) => {
    const updatedCoordinates: Point[] = [];

    e.layers.eachLayer((layer) => {
      const latLngs = (layer as L.Polygon).getLatLngs()[0] as L.LatLng[];
      latLngs.forEach((latLng) => {
        updatedCoordinates.push({ latitude: latLng.lat, longitude: latLng.lng });
      });
    });

    const closedCoordinates = closePolygon(updatedCoordinates);

    setCoordinates(closedCoordinates);

    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({
        alertTexts,
        coordinates: closedCoordinates,
        isPolygonComplete: true,
      })
    );
  };

  const clearAll = () => {
    // Clear the layers on the map
    if (drawnItemsRef.current) {
      drawnItemsRef.current.clearLayers();
    }
  
    // Reset the state
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
      alertTexts: { text1: '', text2: '', text3: '' },
      coordinates: [],
      isPolygonComplete: false,
    }));
  
    setAlertTexts({ text1: '', text2: '', text3: '' });
    setCoordinates([]);
    setIsPolygonComplete(false);
  
    setModalMessage('Alert data cleared!');
    setModalType('info');
    setShowModal(true);
  };
  

  return (
    <div className="relative flex flex-col h-full w-full mx-auto overflow-hidden">
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          <div className={`bg-white p-6 rounded-lg overflow-hidden shadow-lg shadow-xl transform transition-all ${
            modalType === 'success' ? 'border-green-500' : 
            modalType === 'error' ? 'border-red-500' : 
            modalType === 'loading' ? 'border-blue-500' :
            'border-blue-500'
          } border-2`}>
            <div className="flex items-center justify-between">
              <h2 className={`text-lg font-bold ${
                modalType === 'success' ? 'text-green-500' : 
                modalType === 'error' ? 'text-red-500' : 
                modalType === 'loading' ? 'text-blue-500' :
                'text-blue-500'
              }`}>
                {modalType === 'success' ? 'Success' : 
                 modalType === 'error' ? 'Error' : 
                 modalType === 'loading' ? 'Processing' :
                 'Info'}
              </h2>
              {modalType !== 'loading' && (
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-700 focus:outline-none ml-2 w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full"
                  aria-label="Close modal"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              )}
            </div>
            <div className="mt-4">
              {modalType === 'loading' ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
                  <p className="text-gray-700">{modalMessage}</p>
                </div>
              ) : (
                <p className="text-gray-700">{modalMessage}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="h-full flex flex-col md:flex-row">
        <div className="md:hidden z-20 bg-white shadow-md">
          <div className="p-4 flex justify-between items-center">
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
        </div>

        <div
          className={`z-1 bg-white md:bg-gray-100 md:w-96 flex-shrink-0 ${
            isMenuOpen ? 'block' : 'hidden'
          } md:block md:h-full flex flex-col`}
        >
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <div className="hidden md:block">
                <h2 className="text-xl font-semibold mb-4">Alert Information</h2>
              </div>

              {(['text1', 'text2', 'text3'] as (keyof typeof alertTexts)[]).map((field, index) => (
                <div className="mb-4" key={field}>
                  <label className="block mb-2">Alert Level {index + 1}</label>
                  <textarea
                    value={alertTexts[field]}
                    onChange={(e) => onTextChange(field, e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder={`Enter level ${index + 1} alert text`}
                  />
                </div>
              ))}

              <button
                onClick={handleSubmit}
                disabled={!isPolygonComplete || isInEditMode || !alertTexts.text1 || !alertTexts.text2 || !alertTexts.text3}
                className={`w-full p-2 rounded ${
                  isPolygonComplete && !isInEditMode && alertTexts.text1 && alertTexts.text2 && alertTexts.text3
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Create Alert
              </button>

              <button
                onClick={clearAll}
                className="mt-4 w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        <div className="z-0 flex-grow relative h-[calc(100vh-64px)] md:h-full">
          <MapContainer 
            center={position} 
            zoom={14} 
            className="w-full h-full"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <FeatureGroup ref={drawnItemsRef}>
            <EditControl
              position="topright"
              onCreated={handleGeometryCreated}
              onDeleted={handleDeleted}
              onEdited={handleEdited}
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
    </div>
  );
}