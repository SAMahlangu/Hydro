import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const WorldMap = () => {
  const countries = [
    { name: 'Argentina', lat: -38.4161, lng: -63.6167, stress: 'Moderate' },
    { name: 'Australia', lat: -25.2744, lng: 133.7751, stress: 'High' },
    { name: 'Brazil', lat: -14.2350, lng: -51.9253, stress: 'Low' },
    { name: 'Canada', lat: 56.1304, lng: -106.3468, stress: 'Low' },
    { name: 'China', lat: 35.8617, lng: 104.1954, stress: 'High' },
    { name: 'France', lat: 46.2276, lng: 2.2137, stress: 'Low' },
    { name: 'Germany', lat: 51.1657, lng: 10.4515, stress: 'Low' },
    { name: 'India', lat: 20.5937, lng: 78.9629, stress: 'High' },
    { name: 'Indonesia', lat: -0.7893, lng: 113.9213, stress: 'Moderate' },
    { name: 'Italy', lat: 41.8719, lng: 12.5674, stress: 'Moderate' },
    { name: 'Japan', lat: 36.2048, lng: 138.2529, stress: 'Moderate' },
    { name: 'Mexico', lat: 23.6345, lng: -102.5528, stress: 'High' },
    { name: 'Russia', lat: 61.5240, lng: 105.3188, stress: 'Low' },
    { name: 'Saudi Arabia', lat: 23.8859, lng: 45.0792, stress: 'High' },
    { name: 'South Africa', lat: -30.5595, lng: 22.9375, stress: 'High' },
    { name: 'South Korea', lat: 35.9078, lng: 127.7669, stress: 'Moderate' },
    { name: 'Spain', lat: 40.4637, lng: -3.7492, stress: 'Moderate' },
    { name: 'Turkey', lat: 38.9637, lng: 35.2433, stress: 'High' },
    { name: 'UK', lat: 55.3781, lng: -3.4360, stress: 'Low' },
    { name: 'USA', lat: 39.8283, lng: -98.5795, stress: 'Moderate' }
  ];

  const getStressColor = (stress) => {
    switch (stress) {
      case 'Low': return '#10B981'; // Green
      case 'Moderate': return '#F59E0B'; // Yellow
      case 'High': return '#EF4444'; // Red
      default: return '#6B7280'; // Gray
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-water-pale">
      <h2 className="text-3xl font-bold text-water-blue text-center mb-8">
        🌍 Supported Countries Map
      </h2>
      
      <div className="bg-water-neutral bg-opacity-30 rounded-lg p-6 mb-6">
        <p className="text-water-blue text-center text-lg font-medium">
          Click on markers to see water stress levels for each supported country
        </p>
      </div>

      <div className="h-96 rounded-lg overflow-hidden border border-water-pale">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {countries.map((country, index) => (
            <Marker
              key={index}
              position={[country.lat, country.lng]}
            >
              <Popup>
                <div className="text-center">
                  <h3 className="font-bold text-lg text-water-blue">{country.name}</h3>
                  <div className="mt-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-white font-semibold`}
                          style={{ backgroundColor: getStressColor(country.stress) }}>
                      {country.stress} Water Stress
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Click "🌍 Water Stress" tab to predict for this country
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="mt-6 flex justify-center space-x-6">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: '#10B981' }}></div>
          <span className="text-sm text-water-blue">Low Stress</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: '#F59E0B' }}></div>
          <span className="text-sm text-water-blue">Moderate Stress</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: '#EF4444' }}></div>
          <span className="text-sm text-water-blue">High Stress</span>
        </div>
      </div>
    </div>
  );
};

export default WorldMap;

