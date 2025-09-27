import { WeatherAPI } from "../src/utils/api";
import { GeocodingResult, WeatherData } from "../src/types/weather";

// Mock fetch globally
global.fetch = jest.fn();
const mockedFetch = fetch as jest.MockedFunction<typeof fetch>;

describe("WeatherAPI", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear console.error mock calls
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getCoordinates", () => {
    it("should return coordinates for a valid city", async () => {
      // Arrange
      const city = "London";
      const mockGeocodingResponse: GeocodingResult = {
        results: [
          {
            latitude: 51.5074,
            longitude: -0.1278,
            name: "London",
            country: "United Kingdom",
            admin1: "England",
          },
        ],
      };

      mockedFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockGeocodingResponse,
      } as Response);

      // Act
      const result = await WeatherAPI.getCoordinates(city);

      // Assert
      expect(result).toEqual({ latitude: 51.5074, longitude: -0.1278 });
      expect(mockedFetch).toHaveBeenCalledWith(
        "https://geocoding-api.open-meteo.com/v1/search?name=London&count=1&language=en&format=json"
      );
    });

    it("should handle cities with special characters", async () => {
      // Arrange
      const city = "São Paulo";
      const mockGeocodingResponse: GeocodingResult = {
        results: [
          {
            latitude: -23.5505,
            longitude: -46.6333,
            name: "São Paulo",
            country: "Brazil",
          },
        ],
      };

      mockedFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockGeocodingResponse,
      } as Response);

      // Act
      const result = await WeatherAPI.getCoordinates(city);

      // Assert
      expect(result).toEqual({ latitude: -23.5505, longitude: -46.6333 });
      expect(mockedFetch).toHaveBeenCalledWith(
        "https://geocoding-api.open-meteo.com/v1/search?name=S%C3%A3o%20Paulo&count=1&language=en&format=json"
      );
    });

    it("should handle cities with spaces", async () => {
      // Arrange
      const city = "New York City";
      const mockGeocodingResponse: GeocodingResult = {
        results: [
          {
            latitude: 40.7128,
            longitude: -74.006,
            name: "New York City",
            country: "United States",
            admin1: "New York",
          },
        ],
      };

      mockedFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockGeocodingResponse,
      } as Response);

      // Act
      const result = await WeatherAPI.getCoordinates(city);

      // Assert
      expect(result).toEqual({ latitude: 40.7128, longitude: -74.006 });
      expect(mockedFetch).toHaveBeenCalledWith(
        "https://geocoding-api.open-meteo.com/v1/search?name=New%20York%20City&count=1&language=en&format=json"
      );
    });

    it("should return null when no results are found", async () => {
      // Arrange
      const city = "NonExistentCity";
      const mockGeocodingResponse: GeocodingResult = {
        results: [],
      };

      mockedFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockGeocodingResponse,
      } as Response);

      // Act
      const result = await WeatherAPI.getCoordinates(city);

      // Assert
      expect(result).toBeNull();
    });

    it("should return null when results property is undefined", async () => {
      // Arrange
      const city = "TestCity";
      const mockGeocodingResponse: GeocodingResult = {};

      mockedFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockGeocodingResponse,
      } as Response);

      // Act
      const result = await WeatherAPI.getCoordinates(city);

      // Assert
      expect(result).toBeNull();
    });

    it("should handle HTTP error responses", async () => {
      // Arrange
      const city = "London";

      mockedFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
      } as Response);

      // Act
      const result = await WeatherAPI.getCoordinates(city);

      // Assert
      expect(result).toBeNull();
    });

    it("should handle network errors", async () => {
      // Arrange
      const city = "London";

      mockedFetch.mockRejectedValueOnce(new Error("Network error"));

      // Act
      const result = await WeatherAPI.getCoordinates(city);

      // Assert
      expect(result).toBeNull();
    });

    it("should handle JSON parsing errors", async () => {
      // Arrange
      const city = "London";

      mockedFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => {
          throw new Error("Invalid JSON");
        },
      } as unknown as Response);

      // Act
      const result = await WeatherAPI.getCoordinates(city);

      // Assert
      expect(result).toBeNull();
    });

    it("should handle empty city name", async () => {
      // Arrange
      const city = "";
      const mockGeocodingResponse: GeocodingResult = {
        results: [],
      };

      mockedFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockGeocodingResponse,
      } as Response);

      // Act
      const result = await WeatherAPI.getCoordinates(city);

      // Assert
      expect(result).toBeNull();
      expect(mockedFetch).toHaveBeenCalledWith(
        "https://geocoding-api.open-meteo.com/v1/search?name=&count=1&language=en&format=json"
      );
    });
  });

  describe("getCurrentWeather", () => {
    it("should return weather data for valid coordinates", async () => {
      // Arrange
      const latitude = 51.5074;
      const longitude = -0.1278;
      const mockWeatherResponse: WeatherData = {
        current_weather: {
          temperature: 15.5,
          windspeed: 12.3,
          winddirection: 180,
          weathercode: 0,
          is_day: 1,
          time: "2023-01-01T12:00",
        },
      };

      mockedFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockWeatherResponse,
      } as Response);

      // Act
      const result = await WeatherAPI.getCurrentWeather(latitude, longitude);

      // Assert
      expect(result).toEqual(mockWeatherResponse);
      expect(mockedFetch).toHaveBeenCalledWith(
        "https://api.open-meteo.com/v1/forecast?latitude=51.5074&longitude=-0.1278&current_weather=true"
      );
    });

    it("should handle negative coordinates", async () => {
      // Arrange
      const latitude = -23.5505;
      const longitude = -46.6333;
      const mockWeatherResponse: WeatherData = {
        current_weather: {
          temperature: 22.0,
          windspeed: 8.5,
          winddirection: 90,
          weathercode: 1,
          is_day: 1,
          time: "2023-01-01T15:00",
        },
      };

      mockedFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockWeatherResponse,
      } as Response);

      // Act
      const result = await WeatherAPI.getCurrentWeather(latitude, longitude);

      // Assert
      expect(result).toEqual(mockWeatherResponse);
      expect(mockedFetch).toHaveBeenCalledWith(
        "https://api.open-meteo.com/v1/forecast?latitude=-23.5505&longitude=-46.6333&current_weather=true"
      );
    });

    it("should handle extreme coordinates", async () => {
      // Arrange
      const latitude = 90; // North Pole
      const longitude = 0;
      const mockWeatherResponse: WeatherData = {
        current_weather: {
          temperature: -40.0,
          windspeed: 50.0,
          winddirection: 270,
          weathercode: 71,
          is_day: 0,
          time: "2023-01-01T00:00",
        },
      };

      mockedFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockWeatherResponse,
      } as Response);

      // Act
      const result = await WeatherAPI.getCurrentWeather(latitude, longitude);

      // Assert
      expect(result).toEqual(mockWeatherResponse);
      expect(mockedFetch).toHaveBeenCalledWith(
        "https://api.open-meteo.com/v1/forecast?latitude=90&longitude=0&current_weather=true"
      );
    });

    it("should handle decimal coordinates", async () => {
      // Arrange
      const latitude = 40.123456789;
      const longitude = -74.987654321;
      const mockWeatherResponse: WeatherData = {
        current_weather: {
          temperature: 18.7,
          windspeed: 15.2,
          winddirection: 270,
          weathercode: 2,
          is_day: 0,
          time: "2023-01-01T20:00",
        },
      };

      mockedFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockWeatherResponse,
      } as Response);

      // Act
      const result = await WeatherAPI.getCurrentWeather(latitude, longitude);

      // Assert
      expect(result).toEqual(mockWeatherResponse);
      expect(mockedFetch).toHaveBeenCalledWith(
        "https://api.open-meteo.com/v1/forecast?latitude=40.123456789&longitude=-74.987654321&current_weather=true"
      );
    });

    it("should handle HTTP error responses", async () => {
      // Arrange
      const latitude = 51.5074;
      const longitude = -0.1278;

      mockedFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      } as Response);

      // Act
      const result = await WeatherAPI.getCurrentWeather(latitude, longitude);

      // Assert
      expect(result).toBeNull();
    });

    it("should handle network errors", async () => {
      // Arrange
      const latitude = 51.5074;
      const longitude = -0.1278;

      mockedFetch.mockRejectedValueOnce(new Error("Network timeout"));

      // Act
      const result = await WeatherAPI.getCurrentWeather(latitude, longitude);

      // Assert
      expect(result).toBeNull();
    });

    it("should handle JSON parsing errors", async () => {
      // Arrange
      const latitude = 51.5074;
      const longitude = -0.1278;

      mockedFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => {
          throw new Error("Malformed JSON");
        },
      } as unknown as Response);

      // Act
      const result = await WeatherAPI.getCurrentWeather(latitude, longitude);

      // Assert
      expect(result).toBeNull();
    });

    it("should handle zero coordinates", async () => {
      // Arrange
      const latitude = 0;
      const longitude = 0;
      const mockWeatherResponse: WeatherData = {
        current_weather: {
          temperature: 26.5,
          windspeed: 3.2,
          winddirection: 45,
          weathercode: 0,
          is_day: 1,
          time: "2023-01-01T12:00",
        },
      };

      mockedFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockWeatherResponse,
      } as Response);

      // Act
      const result = await WeatherAPI.getCurrentWeather(latitude, longitude);

      // Assert
      expect(result).toEqual(mockWeatherResponse);
      expect(mockedFetch).toHaveBeenCalledWith(
        "https://api.open-meteo.com/v1/forecast?latitude=0&longitude=0&current_weather=true"
      );
    });

    it("should handle weather data with all possible weather codes", async () => {
      // Arrange
      const latitude = 51.5074;
      const longitude = -0.1278;
      const mockWeatherResponse: WeatherData = {
        current_weather: {
          temperature: 15.5,
          windspeed: 12.3,
          winddirection: 180,
          weathercode: 95, // Thunderstorm
          is_day: 1,
          time: "2023-01-01T12:00",
        },
      };

      mockedFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockWeatherResponse,
      } as Response);

      // Act
      const result = await WeatherAPI.getCurrentWeather(latitude, longitude);

      // Assert
      expect(result).toEqual(mockWeatherResponse);
      expect(result?.current_weather.weathercode).toBe(95);
    });

    it("should handle night time weather (is_day = 0)", async () => {
      // Arrange
      const latitude = 51.5074;
      const longitude = -0.1278;
      const mockWeatherResponse: WeatherData = {
        current_weather: {
          temperature: 10.2,
          windspeed: 8.7,
          winddirection: 225,
          weathercode: 3,
          is_day: 0,
          time: "2023-01-01T22:00",
        },
      };

      mockedFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockWeatherResponse,
      } as Response);

      // Act
      const result = await WeatherAPI.getCurrentWeather(latitude, longitude);

      // Assert
      expect(result).toEqual(mockWeatherResponse);
      expect(result?.current_weather.is_day).toBe(0);
    });
  });
});
