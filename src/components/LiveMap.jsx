import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix default leaflet icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/* Custom colored markers */
function makeIcon(color) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:28px;height:28px;border-radius:50% 50% 50% 0;
      background:${color};border:3px solid white;
      box-shadow:0 2px 8px rgba(0,0,0,.3);
      transform:rotate(-45deg);
    "></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -30],
  });
}

const statusColors = {
  available: '#22c55e',
  requested: '#f59e0b',
  completed: '#94a3b8',
};

function getUrgency(expiryTime) {
  const diff = new Date(expiryTime) - new Date();
  const hrs = diff / 36e5;
  if (hrs < 0) return 'expired';
  if (hrs < 2) return 'critical';
  if (hrs < 6) return 'soon';
  return 'ok';
}

const urgencyLabels = {
  expired: { text: 'Expired', cls: 'bg-gray-100 text-gray-500' },
  critical: { text: '⚠️ Critical — < 2 hrs', cls: 'bg-red-100 text-red-600' },
  soon: { text: '🕒 Expiring soon', cls: 'bg-amber-100 text-amber-700' },
  ok: { text: '✓ Fresh', cls: 'bg-emerald-100 text-emerald-700' },
};

/* Geocode from location string using Nominatim (free) */
async function geocode(address) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const data = await res.json();
    if (data.length > 0) return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
  } catch (_) {}
  return null;
}

import { useState } from 'react';
import { useMap } from 'react-leaflet';

function MapUpdater({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && zoom) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

export default function LiveMap({ donations }) {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function buildMarkers() {
      const results = [];
      for (const d of donations) {
        if (!d.location) continue;
        const coords = await geocode(d.location);
        if (cancelled) return;
        if (coords) results.push({ ...d, coords });
      }
      if (!cancelled) setMarkers(results);
    }
    buildMarkers();
    return () => { cancelled = true; };
  }, [donations]);

  const center = markers.length > 0 ? markers[0].coords : [20.5937, 78.9629];
  const zoom = markers.length > 0 ? 15 : 5;

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-lg relative" style={{ height: '420px' }}>
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
        <MapUpdater center={center} zoom={zoom} />
        <TileLayer
          url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          attribution="&copy; Google Maps"
        />
        {markers.map(d => {
          const urgency = getUrgency(d.expiryTime);
          const u = urgencyLabels[urgency];
          return (
            <Marker key={d.id} position={d.coords} icon={makeIcon(statusColors[d.status] || '#e53935')}>
              <Popup maxWidth={220}>
                <div className="text-sm font-sans">
                  <p className="font-bold text-gray-900 mb-1">{d.foodType}</p>
                  <p className="text-gray-500 text-xs mb-1">{d.quantity} · {d.location}</p>
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-semibold ${u.cls}`}>{u.text}</span>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {markers.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur text-sm text-gray-400 rounded-2xl">
          Geocoding donation locations…
        </div>
      )}
    </div>
  );
}
