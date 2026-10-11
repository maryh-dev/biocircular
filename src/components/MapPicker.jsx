import React, { useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';

const iconeMarcador = L.divIcon({
  className: '',
  html: '<span style="display:block;width:22px;height:22px;border:4px solid white;border-radius:50% 50% 50% 0;background:#c58a32;transform:rotate(-45deg);box-shadow:0 2px 8px #0006"></span>',
  iconSize: [22, 22],
  iconAnchor: [11, 22],
});

function EventosMapa({ onSelecionar }) {
  useMapEvents({
    click(event) {
      onSelecionar([event.latlng.lat, event.latlng.lng]);
    },
  });
  return null;
}

function CentralizarMapa({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

export default function MapPicker({
  center,
  position,
  onPositionChange,
  className = 'h-72',
}) {
  return (
    <div className={`${className} overflow-hidden rounded-xl border border-bioclube-border`}>
      <MapContainer center={center} zoom={14} className="h-full w-full">
        <CentralizarMapa center={center} />
        <EventosMapa onSelecionar={onPositionChange} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {position && (
          <Marker
            position={position}
            icon={iconeMarcador}
            draggable
            eventHandlers={{
              dragend(event) {
                const { lat, lng } = event.target.getLatLng();
                onPositionChange([lat, lng]);
              },
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
