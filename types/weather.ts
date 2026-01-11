export type CurrentWeather = {
  temp: number;
  effective_temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  weather_code: number;
};

export type DailyWeather = {
  date: Date;
  temp_max: number;
  temp_min: number;
  apparent_temp_day: number;
  effective_temp_day: number;
  weather_code: number;
  precipitation_sum: number;
};

export type HourlyWeather = {
  date: Date;
  temp: number;
  humidity: number;
  wind_speed: number;
  precipitation: number;
  weather_code: number;
};

export type WeatherResponse = {
  timezone?: string;
  current?: CurrentWeather;
  daily?: DailyWeather[];
  hourly?: HourlyWeather[];
};

export const weatherCodeDescription: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Freezing drizzle",
  57: "Freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Freezing rain",
  67: "Freezing rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
};

export const codeToEmoji: Record<number, string> = {
  0: "☀️",
  1: "🌤",
  2: "⛅️",
  3: "☁️",
  45: "🌫",
  48: "🌫",
  51: "🌧",
  53: "🌧",
  55: "🌧",
  61: "🌦",
  63: "🌧",
  65: "🌧",
  71: "🌨",
  73: "🌨",
  75: "❄️",
  80: "🌦",
  81: "🌧",
  82: "⛈",
  95: "⛈",
  96: "⛈",
  99: "⛈",
};
