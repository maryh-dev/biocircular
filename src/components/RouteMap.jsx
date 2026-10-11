import React, { useEffect, useMemo } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Polyline, TileLayer, useMap } from 'react-leaflet';

const iconeParada = (ordem) => L.divIcon({
  className: '',
  html: `<span style="display:flex;align-items:center;justify-content:center;width:28px;height:28px;border:2px solid white;border-radius:50%;background:#0b1726;color:white;font-weight:700;box-shadow:0 2px 8px #0006">${ordem}</span>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

function AjustarEnquadramento({ pontos }) {
  const mapa = useMap();

  useEffect(() => {
    if (pontos.length === 1) {
      mapa.setView(pontos[0], 15);
    } else if (pontos.length > 1) {
      mapa.fitBounds(L.latLngBounds(pontos), { padding: [32, 32] });
    }
  }, [mapa, pontos]);

  return null;
}

export default function RouteMap({ paradas, geometria = [], className = 'h-80' }) {
  const pontos = useMemo(
    () => paradas.map((parada) => [parada.latitude, parada.longitude]),
    [paradas]
  );
  const centro = pontos[0] || [-23.5505, -46.6333];

  return (
    <div className={`${className} overflow-hidden rounded-xl border border-bioclube-border`}>
      <MapContainer center={centro} zoom={12} className="h-full w-full">
        <AjustarEnquadramento pontos={pontos} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geometria.length > 1 && <Polyline positions={geometria} color="#0b1726" weight={4} />}
        {paradas.map((parada, index) => (
          <Marker
            key={parada.id}
            position={[parada.latitude, parada.longitude]}
            icon={iconeParada(index + 1)}
          />
        ))}
      </MapContainer>
    </div>
  );
}
