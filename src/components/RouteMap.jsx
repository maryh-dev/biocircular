import React, { useEffect, useMemo } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Polyline, TileLayer, useMap } from 'react-leaflet';
import { extrairGeometriaPontos, filtrarGeometriaValida, filtrarParadasComCoordenadas } from '../utils/geoRotas.js';

const CORES_STATUS = {
  solicitada: '#64748b',
  agendada: '#f59e0b',
  em_rota: '#3b82f6',
  coletada: '#10b981',
  concluida: '#16a34a',
  cancelada: '#ef4444',
};

function iconeParada(parada, indice, selecionada) {
  const status = parada?.status || 'agendada';
  const cor = CORES_STATUS[status] || '#0b1726';
  const tamanho = selecionada ? 34 : 28;

  return L.divIcon({
    className: '',
    html: `
      <div style="
        display:flex;
        align-items:center;
        justify-content:center;
        width:${tamanho}px;
        height:${tamanho}px;
        border-radius:9999px;
        border:3px solid #ffffff;
        background:${cor};
        box-shadow:0 8px 18px rgba(15, 23, 42, 0.18);
        color:#fff;
        font-weight:700;
        font-size:12px;
        line-height:1;
        position:relative;
      ">
        ${indice}
      </div>
    `,
    iconSize: [tamanho, tamanho],
    iconAnchor: [tamanho / 2, tamanho / 2],
  });
}

function AjustarEnquadramento({ pontos }) {
  const mapa = useMap();

  useEffect(() => {
    if (!pontos.length) return;

    if (pontos.length === 1) {
      mapa.setView(pontos[0], 15);
      return;
    }

    mapa.fitBounds(L.latLngBounds(pontos), { padding: [32, 32] });
  }, [mapa, pontos]);

  return null;
}

export default function RouteMap({
  paradas,
  geometria = [],
  className = 'h-80',
  selectedParadaId = null,
  onSelectParada,
}) {
  const paradasValidas = useMemo(
    () => filtrarParadasComCoordenadas(paradas),
    [paradas]
  );
  const pontos = useMemo(
    () => extrairGeometriaPontos(paradasValidas),
    [paradasValidas]
  );
  const geometriaValida = useMemo(
    () => filtrarGeometriaValida(geometria),
    [geometria]
  );
  const centro = pontos[0] || [-23.5505, -46.6333];

  return (
    <div className={`${className} relative z-0 overflow-hidden rounded-xl border border-bioclube-border bg-slate-50`}>
      <MapContainer center={centro} zoom={12} className="relative z-0 h-full w-full">
        <AjustarEnquadramento pontos={pontos} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geometriaValida.length > 1 && <Polyline positions={geometriaValida} color="#0b1726" weight={4} opacity={0.8} />}
        {paradasValidas.map((parada, index) => {
          const selecionada = selectedParadaId === parada.id;
          const posicao = [parada.latitude, parada.longitude];

          return (
            <Marker
              key={parada.id}
              position={posicao}
              icon={iconeParada(parada, index + 1, selecionada)}
              eventHandlers={{
                click: () => onSelectParada?.(parada.id),
              }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
}
