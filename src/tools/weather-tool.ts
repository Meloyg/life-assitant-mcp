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
  console.error(
    `[WeatherTool] ========== Starting weather request for: "${city}" ==========`
  );

  try {
    // Get coordinates for the city
    console.error(
      `[WeatherTool] Step 1: Getting coordinates for city "${city}"`
    );
    const coordinates = await WeatherAPI.getCoordinates(city);

    if (!coordinates) {
      console.error(
        `[WeatherTool] Failed to get coordinates for city: "${city}"`
      );
      const errorResponse: WeatherResponse = {
        content: [
          {
            type: "text" as const,
            text: `Could not find location for city: ${city}`,
          },
        ],
      };
      console.error(
        `[WeatherTool] Returning error response:`,
        JSON.stringify(errorResponse, null, 2)
      );
      return errorResponse;
    }

    console.error(
      `[WeatherTool] Step 2: Successfully got coordinates, now fetching weather data`
    );

    // Get weather data
    const weatherData = await WeatherAPI.getCurrentWeather(
      coordinates.latitude,
      coordinates.longitude
    );

    if (!weatherData) {
      console.error(
        `[WeatherTool] Failed to get weather data for coordinates: lat=${coordinates.latitude}, lon=${coordinates.longitude}`
      );
      const errorResponse: WeatherResponse = {
        content: [
          {
            type: "text" as const,
            text: `Could not retrieve weather data for city: ${city}`,
          },
        ],
      };
      console.error(
        `[WeatherTool] Returning error response:`,
        JSON.stringify(errorResponse, null, 2)
      );
      return errorResponse;
    }

    console.error(
      `[WeatherTool] Step 3: Successfully got weather data, preparing response`
    );

    const responseText = `The current temperature in ${city} is ${weatherData.current_weather.temperature}°C with a wind speed of ${weatherData.current_weather.windspeed} km/h.`;
    console.error(`[WeatherTool] Generated response text: "${responseText}"`);

    const successResponse: WeatherResponse = {
      content: [
        {
          type: "text" as const,
          text: responseText,
        },
      ],
    };

    console.error(
      `[WeatherTool] ========== Weather request completed successfully for: "${city}" ==========`
    );
    return successResponse;
  } catch (error) {
    console.error(
      `[WeatherTool] Unexpected error during weather request for "${city}":`,
      error
    );
    const errorResponse: WeatherResponse = {
      content: [
        {
          type: "text" as const,
          text: `Could not retrieve weather data for city: ${city}`,
        },
      ],
    };
    console.error(
      `[WeatherTool] Returning error response due to exception:`,
      JSON.stringify(errorResponse, null, 2)
    );
    return errorResponse;
  }
}
