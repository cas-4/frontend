import React from 'react';
import { LatLngExpression } from 'leaflet'; 
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css'; // Important: add leaflet-draw CSS

interface MapComponentProps {
  onGeometryCreated: (coordinates: number[][]) => void;
}

export const MapDrawerComponent: React.FC<MapComponentProps> = ({ onGeometryCreated }) => {
  const position: LatLngExpression = [44.49381, 11.33875]; // Bologna

  const handleGeometryCreated = (e: any) => {
    try {
      // Handle both polygon and other geometry types
      const layer = e.layer;
      let coords;
      
      if (layer.getLatLngs) {
        // For polygons and other multi-point shapes
        coords = layer.getLatLngs()[0].map((latlng: any) => [latlng.lng, latlng.lat]);
      } else if (layer.getLatLng) {
        // For markers (if needed)
        const latlng = layer.getLatLng();
        coords = [[latlng.lng, latlng.lat]];
      }

      if (coords) {
        onGeometryCreated(coords);
      }
    } catch (error) {
      console.error('Error processing geometry:', error);
    }
  };

  return (
    <MapContainer
      ref={mapRef}
      center={position}
      zoom={14}
      className="h-full w-full"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <FeatureGroup ref={drawnItemsRef}>
        <EditControl
          position="topright"
          onCreated={handleGeometryCreated}
          onEdited={handleEnableEdit}
          onEditStop={handleEditStop}
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
  );
};