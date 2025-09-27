import { getWeatherTool } from "../src/tools/weather-tool";
import { WeatherAPI } from "../src/utils/api";
import { WeatherResponse } from "../src/types/weather";

// Mock the WeatherAPI class
jest.mock("../src/utils/api");
const mockedWeatherAPI = WeatherAPI as jest.Mocked<typeof WeatherAPI>;

describe("getWeatherTool", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear console.error mock calls
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Successful weather requests", () => {
    it("should return weather data for a valid city", async () => {
      // Arrange
      const city = "London";
      const mockCoordinates = { latitude: 51.5074, longitude: -0.1278 };
      const mockWeatherData = {
        current_weather: {
          temperature: 15.5,
          windspeed: 12.3,
          winddirection: 180,
          weathercode: 0,
          is_day: 1,
          time: "2023-01-01T12:00",
        },
      };

      mockedWeatherAPI.getCoordinates.mockResolvedValue(mockCoordinates);
      mockedWeatherAPI.getCurrentWeather.mockResolvedValue(mockWeatherData);

      // Act
      const result = await getWeatherTool({ city });

      // Assert
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "The current temperature in London is 15.5°C with a wind speed of 12.3 km/h.",
          },
        ],
      });
      expect(mockedWeatherAPI.getCoordinates).toHaveBeenCalledWith("London");
      expect(mockedWeatherAPI.getCurrentWeather).toHaveBeenCalledWith(
        51.5074,
        -0.1278
      );
    });

    it("should handle cities with special characters", async () => {
      // Arrange
      const city = "São Paulo";
      const mockCoordinates = { latitude: -23.5505, longitude: -46.6333 };
      const mockWeatherData = {
        current_weather: {
          temperature: 22.0,
          windspeed: 8.5,
          winddirection: 90,
          weathercode: 1,
          is_day: 1,
          time: "2023-01-01T15:00",
        },
      };

      mockedWeatherAPI.getCoordinates.mockResolvedValue(mockCoordinates);
      mockedWeatherAPI.getCurrentWeather.mockResolvedValue(mockWeatherData);

      // Act
      const result = await getWeatherTool({ city });

      // Assert
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "The current temperature in São Paulo is 22°C with a wind speed of 8.5 km/h.",
          },
        ],
      });
    });

    it("should handle cities with spaces and multiple words", async () => {
      // Arrange
      const city = "New York City";
      const mockCoordinates = { latitude: 40.7128, longitude: -74.006 };
      const mockWeatherData = {
        current_weather: {
          temperature: 18.7,
          windspeed: 15.2,
          winddirection: 270,
          weathercode: 2,
          is_day: 0,
          time: "2023-01-01T20:00",
        },
      };

      mockedWeatherAPI.getCoordinates.mockResolvedValue(mockCoordinates);
      mockedWeatherAPI.getCurrentWeather.mockResolvedValue(mockWeatherData);

      // Act
      const result = await getWeatherTool({ city });

      // Assert
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "The current temperature in New York City is 18.7°C with a wind speed of 15.2 km/h.",
          },
        ],
      });
    });

    it("should handle negative temperatures", async () => {
      // Arrange
      const city = "Moscow";
      const mockCoordinates = { latitude: 55.7558, longitude: 37.6176 };
      const mockWeatherData = {
        current_weather: {
          temperature: -10.5,
          windspeed: 20.1,
          winddirection: 45,
          weathercode: 71,
          is_day: 1,
          time: "2023-01-01T10:00",
        },
      };

      mockedWeatherAPI.getCoordinates.mockResolvedValue(mockCoordinates);
      mockedWeatherAPI.getCurrentWeather.mockResolvedValue(mockWeatherData);

      // Act
      const result = await getWeatherTool({ city });

      // Assert
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "The current temperature in Moscow is -10.5°C with a wind speed of 20.1 km/h.",
          },
        ],
      });
    });

    it("should handle zero temperature and wind speed", async () => {
      // Arrange
      const city = "Reykjavik";
      const mockCoordinates = { latitude: 64.1466, longitude: -21.9426 };
      const mockWeatherData = {
        current_weather: {
          temperature: 0,
          windspeed: 0,
          winddirection: 0,
          weathercode: 0,
          is_day: 1,
          time: "2023-01-01T12:00",
        },
      };

      mockedWeatherAPI.getCoordinates.mockResolvedValue(mockCoordinates);
      mockedWeatherAPI.getCurrentWeather.mockResolvedValue(mockWeatherData);

      // Act
      const result = await getWeatherTool({ city });

      // Assert
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "The current temperature in Reykjavik is 0°C with a wind speed of 0 km/h.",
          },
        ],
      });
    });
  });

  describe("Error handling - Geocoding failures", () => {
    it("should handle city not found (null coordinates)", async () => {
      // Arrange
      const city = "NonExistentCity";
      mockedWeatherAPI.getCoordinates.mockResolvedValue(null);

      // Act
      const result = await getWeatherTool({ city });

      // Assert
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Could not find location for city: NonExistentCity",
          },
        ],
      });
      expect(mockedWeatherAPI.getCoordinates).toHaveBeenCalledWith(
        "NonExistentCity"
      );
      expect(mockedWeatherAPI.getCurrentWeather).not.toHaveBeenCalled();
    });

    it("should handle empty city name", async () => {
      // Arrange
      const city = "";
      mockedWeatherAPI.getCoordinates.mockResolvedValue(null);

      // Act
      const result = await getWeatherTool({ city });

      // Assert
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Could not find location for city: ",
          },
        ],
      });
    });

    it("should handle city with only whitespace", async () => {
      // Arrange
      const city = "   ";
      mockedWeatherAPI.getCoordinates.mockResolvedValue(null);

      // Act
      const result = await getWeatherTool({ city });

      // Assert
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Could not find location for city:    ",
          },
        ],
      });
    });

    it("should handle very long city names", async () => {
      // Arrange
      const city = "A".repeat(1000);
      mockedWeatherAPI.getCoordinates.mockResolvedValue(null);

      // Act
      const result = await getWeatherTool({ city });

      // Assert
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: `Could not find location for city: ${city}`,
          },
        ],
      });
    });
  });

  describe("Error handling - Weather API failures", () => {
    it("should handle weather API returning null", async () => {
      // Arrange
      const city = "London";
      const mockCoordinates = { latitude: 51.5074, longitude: -0.1278 };

      mockedWeatherAPI.getCoordinates.mockResolvedValue(mockCoordinates);
      mockedWeatherAPI.getCurrentWeather.mockResolvedValue(null);

      // Act
      const result = await getWeatherTool({ city });

      // Assert
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Could not retrieve weather data for city: London",
          },
        ],
      });
      expect(mockedWeatherAPI.getCoordinates).toHaveBeenCalledWith("London");
      expect(mockedWeatherAPI.getCurrentWeather).toHaveBeenCalledWith(
        51.5074,
        -0.1278
      );
    });

    it("should handle extreme coordinates", async () => {
      // Arrange
      const city = "North Pole";
      const mockCoordinates = { latitude: 90, longitude: 0 };

      mockedWeatherAPI.getCoordinates.mockResolvedValue(mockCoordinates);
      mockedWeatherAPI.getCurrentWeather.mockResolvedValue(null);

      // Act
      const result = await getWeatherTool({ city });

      // Assert
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Could not retrieve weather data for city: North Pole",
          },
        ],
      });
      expect(mockedWeatherAPI.getCurrentWeather).toHaveBeenCalledWith(90, 0);
    });
  });

  describe("Error handling - Exception scenarios", () => {
    it("should handle geocoding API throwing an error", async () => {
      // Arrange
      const city = "London";
      const error = new Error("Network error");
      mockedWeatherAPI.getCoordinates.mockRejectedValue(error);

      // Act
      const result = await getWeatherTool({ city });

      // Assert
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Could not retrieve weather data for city: London",
          },
        ],
      });
    });

    it("should handle weather API throwing an error", async () => {
      // Arrange
      const city = "London";
      const mockCoordinates = { latitude: 51.5074, longitude: -0.1278 };
      const error = new Error("Weather API error");

      mockedWeatherAPI.getCoordinates.mockResolvedValue(mockCoordinates);
      mockedWeatherAPI.getCurrentWeather.mockRejectedValue(error);

      // Act
      const result = await getWeatherTool({ city });

      // Assert
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Could not retrieve weather data for city: London",
          },
        ],
      });
    });

    it("should handle timeout errors", async () => {
      // Arrange
      const city = "Tokyo";
      const timeoutError = new Error("Request timeout");
      mockedWeatherAPI.getCoordinates.mockRejectedValue(timeoutError);

      // Act
      const result = await getWeatherTool({ city });

      // Assert
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "Could not retrieve weather data for city: Tokyo",
          },
        ],
      });
    });
  });

  describe("Edge cases and boundary conditions", () => {
    it("should handle very high temperatures", async () => {
      // Arrange
      const city = "Death Valley";
      const mockCoordinates = { latitude: 36.5323, longitude: -116.9325 };
      const mockWeatherData = {
        current_weather: {
          temperature: 54.4,
          windspeed: 5.0,
          winddirection: 180,
          weathercode: 0,
          is_day: 1,
          time: "2023-07-01T14:00",
        },
      };

      mockedWeatherAPI.getCoordinates.mockResolvedValue(mockCoordinates);
      mockedWeatherAPI.getCurrentWeather.mockResolvedValue(mockWeatherData);

      // Act
      const result = await getWeatherTool({ city });

      // Assert
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "The current temperature in Death Valley is 54.4°C with a wind speed of 5 km/h.",
          },
        ],
      });
    });

    it("should handle very low temperatures", async () => {
      // Arrange
      const city = "Antarctica";
      const mockCoordinates = { latitude: -82.8628, longitude: 135.0 };
      const mockWeatherData = {
        current_weather: {
          temperature: -89.2,
          windspeed: 100.5,
          winddirection: 270,
          weathercode: 71,
          is_day: 0,
          time: "2023-07-01T02:00",
        },
      };

      mockedWeatherAPI.getCoordinates.mockResolvedValue(mockCoordinates);
      mockedWeatherAPI.getCurrentWeather.mockResolvedValue(mockWeatherData);

      // Act
      const result = await getWeatherTool({ city });

      // Assert
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "The current temperature in Antarctica is -89.2°C with a wind speed of 100.5 km/h.",
          },
        ],
      });
    });

    it("should handle very high wind speeds", async () => {
      // Arrange
      const city = "Hurricane Zone";
      const mockCoordinates = { latitude: 25.7617, longitude: -80.1918 };
      const mockWeatherData = {
        current_weather: {
          temperature: 25.0,
          windspeed: 250.7,
          winddirection: 45,
          weathercode: 95,
          is_day: 1,
          time: "2023-09-01T12:00",
        },
      };

      mockedWeatherAPI.getCoordinates.mockResolvedValue(mockCoordinates);
      mockedWeatherAPI.getCurrentWeather.mockResolvedValue(mockWeatherData);

      // Act
      const result = await getWeatherTool({ city });

      // Assert
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "The current temperature in Hurricane Zone is 25°C with a wind speed of 250.7 km/h.",
          },
        ],
      });
    });

    it("should handle decimal precision in temperature and wind speed", async () => {
      // Arrange
      const city = "Precision City";
      const mockCoordinates = { latitude: 40.0, longitude: -74.0 };
      const mockWeatherData = {
        current_weather: {
          temperature: 15.123456789,
          windspeed: 12.987654321,
          winddirection: 180,
          weathercode: 0,
          is_day: 1,
          time: "2023-01-01T12:00",
        },
      };

      mockedWeatherAPI.getCoordinates.mockResolvedValue(mockCoordinates);
      mockedWeatherAPI.getCurrentWeather.mockResolvedValue(mockWeatherData);

      // Act
      const result = await getWeatherTool({ city });

      // Assert
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "The current temperature in Precision City is 15.123456789°C with a wind speed of 12.987654321 km/h.",
          },
        ],
      });
    });
  });

  describe("Input validation and sanitization", () => {
    it("should handle cities with numbers", async () => {
      // Arrange
      const city = "City123";
      const mockCoordinates = { latitude: 40.0, longitude: -74.0 };
      const mockWeatherData = {
        current_weather: {
          temperature: 20.0,
          windspeed: 10.0,
          winddirection: 180,
          weathercode: 0,
          is_day: 1,
          time: "2023-01-01T12:00",
        },
      };

      mockedWeatherAPI.getCoordinates.mockResolvedValue(mockCoordinates);
      mockedWeatherAPI.getCurrentWeather.mockResolvedValue(mockWeatherData);

      // Act
      const result = await getWeatherTool({ city });

      // Assert
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "The current temperature in City123 is 20°C with a wind speed of 10 km/h.",
          },
        ],
      });
    });

    it("should handle cities with hyphens and apostrophes", async () => {
      // Arrange
      const city = "St. John's-on-the-Lake";
      const mockCoordinates = { latitude: 45.0, longitude: -75.0 };
      const mockWeatherData = {
        current_weather: {
          temperature: 12.5,
          windspeed: 8.3,
          winddirection: 90,
          weathercode: 1,
          is_day: 1,
          time: "2023-01-01T12:00",
        },
      };

      mockedWeatherAPI.getCoordinates.mockResolvedValue(mockCoordinates);
      mockedWeatherAPI.getCurrentWeather.mockResolvedValue(mockWeatherData);

      // Act
      const result = await getWeatherTool({ city });

      // Assert
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: "The current temperature in St. John's-on-the-Lake is 12.5°C with a wind speed of 8.3 km/h.",
          },
        ],
      });
    });
  });

  describe("Response format validation", () => {
    it("should return response in correct WeatherResponse format", async () => {
      // Arrange
      const city = "London";
      const mockCoordinates = { latitude: 51.5074, longitude: -0.1278 };
      const mockWeatherData = {
        current_weather: {
          temperature: 15.5,
          windspeed: 12.3,
          winddirection: 180,
          weathercode: 0,
          is_day: 1,
          time: "2023-01-01T12:00",
        },
      };

      mockedWeatherAPI.getCoordinates.mockResolvedValue(mockCoordinates);
      mockedWeatherAPI.getCurrentWeather.mockResolvedValue(mockWeatherData);

      // Act
      const result = await getWeatherTool({ city });

      // Assert
      expect(result).toHaveProperty("content");
      expect(Array.isArray(result.content)).toBe(true);
      expect(result.content).toHaveLength(1);
      expect(result.content[0]).toHaveProperty("type", "text");
      expect(result.content[0]).toHaveProperty("text");
      expect(typeof result.content[0].text).toBe("string");
    });

    it("should return error response in correct WeatherResponse format", async () => {
      // Arrange
      const city = "NonExistentCity";
      mockedWeatherAPI.getCoordinates.mockResolvedValue(null);

      // Act
      const result = await getWeatherTool({ city });

      // Assert
      expect(result).toHaveProperty("content");
      expect(Array.isArray(result.content)).toBe(true);
      expect(result.content).toHaveLength(1);
      expect(result.content[0]).toHaveProperty("type", "text");
      expect(result.content[0]).toHaveProperty("text");
      expect(typeof result.content[0].text).toBe("string");
      expect(result.content[0].text).toContain(
        "Could not find location for city"
      );
    });
  });
});
