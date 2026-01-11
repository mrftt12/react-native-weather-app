import { fetchWeatherApi } from "openmeteo";
import type {
  WeatherResponse,
  DailyWeather,
  HourlyWeather,
} from "../types/weather";

const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

const mphToMs = (mph: number) => mph * 0.44704;
const fahrenheitToKelvin = (f: number) => ((f - 32) * 5) / 9 + 273.15;
const kelvinToCelsius = (k: number) => k - 273.15;
const celsiusToKelvin = (c: number) => c + 273.15;
const kelvinToFahrenheit = (k: number) => (kelvinToCelsius(k) * 9) / 5 + 32;

const scaleWindSpeed = (va10: number, height = 1.2) => {
  // Bröde et al. (2012) logarithmic wind profile
  const c = 1 / Math.log10(10 / 0.01); // ≈ 0.3333
  return va10 * Math.log10(height / 0.01) * c;
};

const calculateEffectiveTemperature = (
  tempF: number,
  windMph: number,
  humidity: number
) => {
  const t2k = fahrenheitToKelvin(tempF);
  const vaMs = mphToMs(windMph);
  const v = scaleWindSpeed(vaMs, 1.2);
  const ditermeq = 1 / (1.76 + 1.4 * Math.pow(v, 0.75));
  const t2c = kelvinToCelsius(t2k);
  const netC =
    37 -
    (37 - t2c) / (0.68 - 0.0014 * humidity + ditermeq) -
    0.29 * t2c * (1 - 0.01 * humidity);
  const netK = celsiusToKelvin(netC);
  return kelvinToFahrenheit(netK);
};

const toDateArray = (start: number, end: number, interval: number) =>
  Array.from({ length: (Number(end) - Number(start)) / interval }, (_, i) =>
    new Date((Number(start) + i * interval) * 1000)
  );

export const fetchWeather = async (
  lat: number,
  lon: number
): Promise<WeatherResponse> => {
  const params = {
    latitude: lat,
    longitude: lon,
    hourly: [
      "temperature_2m",
      "relative_humidity_2m",
      "wind_speed_10m",
      "apparent_temperature",
      "weather_code",
      "precipitation",
    ],
    daily: [
      "temperature_2m_max",
      "temperature_2m_min",
      "apparent_temperature_max",
      "apparent_temperature_min",
      "precipitation_sum",
      "weather_code",
      "wind_speed_10m_max",
    ],
    timezone: "auto",
    wind_speed_unit: "mph",
    temperature_unit: "fahrenheit",
    precipitation_unit: "inch",
  } as const;

  const responses = await fetchWeatherApi(WEATHER_URL, params);
  const response = responses[0];
  const timezone = response.timezone();
  const hourly = response.hourly();
  const daily = response.daily();

  const currentIndex =
    hourly &&
    Math.max(
      0,
      Math.floor(
        (Date.now() / 1000 - Number(hourly.time())) / hourly.interval()
      )
    );

  const current =
    hourly && hourly.variables(0)
      ? {
          temp: hourly.variables(0)!.valuesArray()[currentIndex],
          effective_temp: calculateEffectiveTemperature(
            hourly.variables(0)!.valuesArray()[currentIndex],
            hourly.variables(2)!.valuesArray()[currentIndex],
            hourly.variables(1)!.valuesArray()[currentIndex]
          ),
          humidity: hourly.variables(1)!.valuesArray()[currentIndex],
          wind_speed: hourly.variables(2)!.valuesArray()[currentIndex],
          feels_like: hourly.variables(3)!.valuesArray()[currentIndex],
          weather_code: hourly.variables(4)!.valuesArray()[currentIndex],
        }
      : undefined;

  const hourlyList: HourlyWeather[] =
    hourly && hourly.variables(0)
      ? toDateArray(hourly.time(), hourly.timeEnd(), hourly.interval()).map(
          (date, i) => ({
            date,
            temp: hourly.variables(0)!.valuesArray()[i],
            humidity: hourly.variables(1)!.valuesArray()[i],
            wind_speed: hourly.variables(2)!.valuesArray()[i],
            precipitation: hourly.variables(5)!.valuesArray()[i],
            weather_code: hourly.variables(4)!.valuesArray()[i],
          })
        )
      : [];

  const hourlyEffectiveByDay = hourlyList.reduce<
    Record<string, { sum: number; count: number }>
  >((acc, item) => {
    const key = item.date.toISOString().slice(0, 10);
    const et = calculateEffectiveTemperature(
      item.temp,
      item.wind_speed,
      item.humidity
    );
    const current = acc[key] ?? { sum: 0, count: 0 };
    acc[key] = { sum: current.sum + et, count: current.count + 1 };
    return acc;
  }, {});

  const dailyList: DailyWeather[] =
    daily && daily.variables(0)
      ? toDateArray(daily.time(), daily.timeEnd(), daily.interval()).map(
          (date, i) => ({
            date,
            temp_max: daily.variables(0)!.valuesArray()[i],
            temp_min: daily.variables(1)!.valuesArray()[i],
            apparent_temp_day: daily.variables(2)!.valuesArray()[i],
            effective_temp_day: (() => {
              const key = date.toISOString().slice(0, 10);
              const aggregate = hourlyEffectiveByDay[key];
              if (!aggregate) return daily.variables(2)!.valuesArray()[i];
              return aggregate.sum / aggregate.count;
            })(),
            precipitation_sum: daily.variables(4)!.valuesArray()[i],
            weather_code: daily.variables(5)!.valuesArray()[i],
          })
        )
      : [];

  return {
    timezone,
    current,
    daily: dailyList,
    hourly: hourlyList,
  };
};
