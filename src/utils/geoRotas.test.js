import test from 'node:test';
import assert from 'node:assert/strict';

import {
  filtrarParadasComCoordenadas,
  extrairGeometriaPontos,
} from './geoRotas.js';

test('filtra apenas paradas com coordenadas válidas', () => {
  const paradas = [
    { id: 'a', latitude: -23.55, longitude: -46.63 },
    { id: 'b', latitude: null, longitude: -46.63 },
    { id: 'c', latitude: -90.1, longitude: 0 },
    { id: 'd', latitude: 0, longitude: -181 },
    { id: 'e', latitude: 10, longitude: 20 },
  ];

  assert.deepEqual(
    filtrarParadasComCoordenadas(paradas).map((parada) => parada.id),
    ['a', 'e']
  );
});

test('gera geometria apenas com pontos válidos', () => {
  const paradas = [
    { id: 'x', latitude: 1, longitude: 2 },
    { id: 'y', latitude: 3, longitude: 'invalid' },
    { id: 'z', latitude: 4, longitude: 5 },
  ];

  assert.deepEqual(extrairGeometriaPontos(paradas), [
    [1, 2],
    [4, 5],
  ]);
});
