import { z } from "zod";
import { WeatherAPI } from "../utils/api.js";
import { WeatherResponse } from "../types/weather.js";

export const weatherToolSchema = {
  city: z.string().describe("The city to get the weather for"),
};

export async function getWeatherTool({
  city,
}: {
  city: string;
}): Promise<WeatherResponse> {
  try {
    // Get coordinates for the city
    const coordinates = await WeatherAPI.getCoordinates(city);
    if (!coordinates) {
      return {
        content: [
          {
            type: "text",
            text: `Could not find location for city: ${city}`,
          },
        ],
      };
    }

    // Get weather data
    const weatherData = await WeatherAPI.getCurrentWeather(
      coordinates.latitude,
      coordinates.longitude
    );

    if (!weatherData) {
      return {
        content: [
          {
            type: "text",
            text: `Could not retrieve weather data for city: ${city}`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `The current temperature in ${city} is ${weatherData.current_weather.temperature}°C with a wind speed of ${weatherData.current_weather.windspeed} km/h.`,
        },
      ],
    };
  } catch (error) {
    console.error("Weather tool error:", error);
    return {
      content: [
        {
          type: "text",
          text: `Could not retrieve weather data for city: ${city}`,
        },
      ],
    };
  }
}
