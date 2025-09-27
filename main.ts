import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "MCP Weather Server",
  version: "0.0.1",
  description: "A simple weather server for MCP",
});

server.tool(
  "get-weather",
  "Tool to get the current weather for a given city",
  {
    city: z.string().describe("The city to get the weather for"),
  },
  async ({ city }) => {
    try {
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          city
        )}&count=1&language=en&format=json`
      );
      const geoData = await geoResponse.json();
      if (!geoData.results || geoData.results.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `Could not find location for city: ${city}`,
            },
          ],
        };
      }
      const { latitude, longitude } = geoData.results[0];

      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const weatherData = await weatherResponse.json();

      return {
        content: [
          {
            type: "text",
            text: `The current temperature in ${city} is ${weatherData.current_weather.temperature}°C with a wind speed of ${weatherData.current_weather.windspeed} km/h.`,
          },
        ],
      };
    } catch (error) {
      console.error(error);
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
);

const transport = new StdioServerTransport();
server.connect(transport);
console.log("MCP Weather Server is running...");
