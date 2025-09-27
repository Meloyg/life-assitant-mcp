import { GeocodingResult, WeatherData } from "../types/weather.js";

export class WeatherAPI {
  private static readonly GEOCODING_BASE_URL =
    "https://geocoding-api.open-meteo.com/v1";
  private static readonly WEATHER_BASE_URL = "https://api.open-meteo.com/v1";

  static async getCoordinates(
    city: string
  ): Promise<{ latitude: number; longitude: number } | null> {
    console.error(`[WeatherAPI] Starting geocoding lookup for city: "${city}"`);

    try {
      const url = `${this.GEOCODING_BASE_URL}/search?name=${encodeURIComponent(
        city
      )}&count=1&language=en&format=json`;

      console.error(`[WeatherAPI] Geocoding API URL: ${url}`);

      const response = await fetch(url);
      console.error(
        `[WeatherAPI] Geocoding API response status: ${response.status}`
      );

      if (!response.ok) {
        const errorMsg = `Geocoding API error: ${response.status} ${response.statusText}`;
        console.error(`[WeatherAPI] ${errorMsg}`);
        throw new Error(errorMsg);
      }

      const data: GeocodingResult = await response.json();
      console.error(
        `[WeatherAPI] Geocoding API response:`,
        JSON.stringify(data, null, 2)
      );

      if (!data.results || data.results.length === 0) {
        console.error(
          `[WeatherAPI] No geocoding results found for city: "${city}"`
        );
        return null;
      }

      const { latitude, longitude, name, country } = data.results[0];
      console.error(
        `[WeatherAPI] Found coordinates for "${name}, ${country}": lat=${latitude}, lon=${longitude}`
      );

      return { latitude, longitude };
    } catch (error) {
      console.error(
        `[WeatherAPI] Error fetching coordinates for "${city}":`,
        error
      );
      return null;
    }
  }

  static async getCurrentWeather(
    latitude: number,
    longitude: number
  ): Promise<WeatherData | null> {
    console.error(
      `[WeatherAPI] Starting weather lookup for coordinates: lat=${latitude}, lon=${longitude}`
    );

    try {
      const url = `${this.WEATHER_BASE_URL}/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
      console.error(`[WeatherAPI] Weather API URL: ${url}`);

      const response = await fetch(url);
      console.error(
        `[WeatherAPI] Weather API response status: ${response.status}`
      );

      if (!response.ok) {
        const errorMsg = `Weather API error: ${response.status} ${response.statusText}`;
        console.error(`[WeatherAPI] ${errorMsg}`);
        throw new Error(errorMsg);
      }

      const data: WeatherData = await response.json();
      console.error(
        `[WeatherAPI] Weather API response:`,
        JSON.stringify(data, null, 2)
      );

      const { temperature, windspeed, weathercode, is_day } =
        data.current_weather;
      console.error(
        `[WeatherAPI] Current weather: ${temperature}°C, wind: ${windspeed} km/h, code: ${weathercode}, day: ${
          is_day ? "yes" : "no"
        }`
      );

      return data;
    } catch (error) {
      console.error(
        `[WeatherAPI] Error fetching weather data for lat=${latitude}, lon=${longitude}:`,
        error
      );
      return null;
    }
  }
}
