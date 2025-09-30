import { useState } from 'react';
import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function MapEvents({ onLocationSelect }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng);
    },
  });
  return null;
}

function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [hazardData, setHazardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLocationSelect = async (lat, lng) => {
    setSelectedLocation({ lat, lng });
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:8000/hazards', {
        latitude: lat,
        longitude: lng
      });
      setHazardData(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch hazard data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Hazard Analysis Map</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: '600px' }}>
            <MapContainer
              center={[12.8797, 121.7740]}
              zoom={6}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <MapEvents onLocationSelect={handleLocationSelect} />
              {selectedLocation && (
                <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
                  <Popup>
                    Selected Location<br />
                    Lat: {selectedLocation.lat.toFixed(4)}<br />
                    Lng: {selectedLocation.lng.toFixed(4)}
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Hazard Information</h2>
            {loading && (
              <div className="text-gray-600">Loading hazard data...</div>
            )}
            {error && (
              <div className="text-red-600">{error}</div>
            )}
            {hazardData && !loading && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700">Location</h3>
                  <p className="text-gray-600">Lat: {hazardData.location.latitude}</p>
                  <p className="text-gray-600">Lng: {hazardData.location.longitude}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Hazards</h3>
                  <div className="space-y-2">
                    {Object.entries(hazardData.hazards).map(([type, risk]) => (
                      <div
                        key={type}
                        className={`p-2 rounded ${
                          risk === 'high' ? 'bg-red-100 text-red-800' :
                          risk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}
                      >
                        {type}: {risk}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {!hazardData && !loading && !error && (
              <div className="text-gray-600">
                Click anywhere on the map to analyze hazards for that location.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
