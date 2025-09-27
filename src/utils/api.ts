import { GeocodingResult, WeatherData } from "../types/weather.js";

export class WeatherAPI {
  private static readonly GEOCODING_BASE_URL =
    "https://geocoding-api.open-meteo.com/v1";
  private static readonly WEATHER_BASE_URL = "https://api.open-meteo.com/v1";

  static async getCoordinates(
    city: string
  ): Promise<{ latitude: number; longitude: number } | null> {
    try {
      const response = await fetch(
        `${this.GEOCODING_BASE_URL}/search?name=${encodeURIComponent(
          city
        )}&count=1&language=en&format=json`
      );

      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
      }

      const data: GeocodingResult = await response.json();

      if (!data.results || data.results.length === 0) {
        return null;
      }

      const { latitude, longitude } = data.results[0];
      return { latitude, longitude };
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null;
    }
  }

  static async getCurrentWeather(
    latitude: number,
    longitude: number
  ): Promise<WeatherData | null> {
    try {
      const response = await fetch(
        `${this.WEATHER_BASE_URL}/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data: WeatherData = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching weather data:", error);
      return null;
    }
  }
}
