export type LatLong = { lat: number; lon: number };

type FetchLike = typeof fetch;

const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";

const ensureOkJson = async (response: Response) => {
  const json = await response.json();
  return json;
};

const buildGeocodeUrl = (name: string) =>
  `${GEOCODE_URL}?name=${encodeURIComponent(
    name
  )}&count=1&language=en&format=json&countryCode=US`;

const pickFirstCoords = (data: any) => {
  const first = data?.results?.[0];
  if (!first) throw new Error("No location results");
  return { lat: first.latitude, lon: first.longitude };
};

export const fetchLatLongByCity = async (
  city: string,
  _apiKey: string,
  fetchImpl: FetchLike = fetch
): Promise<LatLong> => {
  const res = await fetchImpl(buildGeocodeUrl(city));
  const data = await ensureOkJson(res);
  return pickFirstCoords(data);
};

export const fetchLatLongByPostal = async (
  postalCode: string,
  _googleKey: string,
  fetchImpl: FetchLike = fetch
): Promise<LatLong> => {
  const res = await fetchImpl(buildGeocodeUrl(postalCode));
  const data = await ensureOkJson(res);
  return pickFirstCoords(data);
};
