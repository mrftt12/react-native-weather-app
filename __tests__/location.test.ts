import { fetchLatLongByCity, fetchLatLongByPostal } from "../services/location";

const mockFetch = (payload: any) =>
  jest.fn().mockResolvedValue({
    json: jest.fn().mockResolvedValue(payload),
  } as any);

describe("location helpers", () => {
  it("returns lat/long for city lookup", async () => {
    const fakeFetch = mockFetch({
      results: [{ latitude: 43.7, longitude: -79.4 }],
    });

    const result = await fetchLatLongByCity("Toronto", "unused", fakeFetch);

    expect(fakeFetch).toHaveBeenCalledWith(
      "https://geocoding-api.open-meteo.com/v1/search?name=Toronto&count=1&language=en&format=json&countryCode=US"
    );
    expect(result).toEqual({ lat: 43.7, lon: -79.4 });
  });

  it("returns lat/long for postal lookup", async () => {
    const fakeFetch = mockFetch({
      results: [{ latitude: 40.71, longitude: -74.0 }],
    });

    const result = await fetchLatLongByPostal("10001", "unused", fakeFetch);

    expect(fakeFetch).toHaveBeenCalledWith(
      "https://geocoding-api.open-meteo.com/v1/search?name=10001&count=1&language=en&format=json&countryCode=US"
    );
    expect(result).toEqual({ lat: 40.71, lon: -74.0 });
  });
});
