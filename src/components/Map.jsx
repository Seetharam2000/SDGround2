import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { WARDS } from '../data/wards';
import WardSidebar from './WardSidebar';

function getColor(score) {
  if (score >= 75) return '#22c55e';   // green
  if (score >= 50) return '#f59e0b';   // yellow
  if (score >= 30) return '#f97316';   // orange
  return '#ef4444';                     // red
}

function getRadius(score) {
  if (score < 30) return 28;
  if (score < 50) return 22;
  if (score < 75) return 18;
  return 15;
}

export default function Map() {
  const [selectedWard, setSelectedWard] = useState(null);

  return (
    <div style={{ display: 'flex', height: '100vh', paddingTop: '56px' }}>

      {/* MAP AREA */}
      <div style={{ flex: 1 }}>
        <MapContainer
          center={[17.385, 78.4867]}
          zoom={12}
          style={{ height: '100%', width: '100%', background: '#0f172a' }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />

          {WARDS.map((ward) => (
            <CircleMarker
              key={ward.id}
              center={[ward.lat, ward.lng]}
              radius={getRadius(ward.sdgScore)}
              pathOptions={{
                color: getColor(ward.sdgScore),
                fillColor: getColor(ward.sdgScore),
                fillOpacity: 0.6,
                weight: 2,
              }}
              eventHandlers={{
                click: () => setSelectedWard(ward),
              }}
            >
              <Popup>
                <div style={{ fontWeight: 'bold' }}>{ward.name}</div>
                <div>SDG Score: {ward.sdgScore}/100</div>
                <div>Priority: {ward.priority}</div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* SIDEBAR — shows when a ward is clicked */}
      {selectedWard && (
        <WardSidebar
          ward={selectedWard}
          onClose={() => setSelectedWard(null)}
        />
      )}
    </div>
  );
}
