export interface GeocodingResult {
  results?: Array<{
    latitude: number;
    longitude: number;
    name: string;
    country: string;
    admin1?: string;
  }>;
}

export interface WeatherData {
  current_weather: {
    temperature: number;
    windspeed: number;
    winddirection: number;
    weathercode: number;
    is_day: number;
    time: string;
  };
}

export interface WeatherResponse {
  [x: string]: unknown;
  content: Array<{
    [x: string]: unknown;
    type: "text";
    text: string;
    _meta?: { [x: string]: unknown } | undefined;
  }>;
  _meta?: { [x: string]: unknown } | undefined;
  structuredContent?: { [x: string]: unknown } | undefined;
  isError?: boolean | undefined;
}
