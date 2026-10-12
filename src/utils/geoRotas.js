export function temCoordenadasParada(parada) {
  if (!parada || typeof parada !== 'object') {
    return false;
  }

  const latitudeRaw = parada.latitude;
  const longitudeRaw = parada.longitude;

  if (
    latitudeRaw === null || latitudeRaw === undefined || latitudeRaw === ''
    || longitudeRaw === null || longitudeRaw === undefined || longitudeRaw === ''
  ) {
    return false;
  }

  const latitude = Number(latitudeRaw);
  const longitude = Number(longitudeRaw);

  return (
    Number.isFinite(latitude)
    && latitude >= -90
    && latitude <= 90
    && Number.isFinite(longitude)
    && longitude >= -180
    && longitude <= 180
  );
}

export function filtrarParadasComCoordenadas(paradas = []) {
  return paradas.filter((parada) => temCoordenadasParada(parada));
}

export function extrairGeometriaPontos(paradas = []) {
  return filtrarParadasComCoordenadas(paradas).map((parada) => [
    Number(parada.latitude),
    Number(parada.longitude),
  ]);
}

export function filtrarGeometriaValida(geometria = []) {
  return geometria.filter((ponto) => {
    if (!Array.isArray(ponto) || ponto.length < 2) {
      return false;
    }

    const latitudeRaw = ponto[0];
    const longitudeRaw = ponto[1];

    if (
      latitudeRaw === null || latitudeRaw === undefined || latitudeRaw === ''
      || longitudeRaw === null || longitudeRaw === undefined || longitudeRaw === ''
    ) {
      return false;
    }

    const latitude = Number(latitudeRaw);
    const longitude = Number(longitudeRaw);

    return (
      Number.isFinite(latitude)
      && latitude >= -90
      && latitude <= 90
      && Number.isFinite(longitude)
      && longitude >= -180
      && longitude <= 180
    );
  });
}
