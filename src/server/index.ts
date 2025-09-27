import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { weatherToolSchema, getWeatherTool } from "../tools/weather-tool.js";

export class WeatherMcpServer {
  private server: McpServer;

  constructor() {
    console.error("[WeatherMcpServer] Initializing MCP Weather Server...");

    this.server = new McpServer({
      name: "MCP Weather Server",
      version: "1.0.0",
      description: "A simple weather server for MCP",
    });

    console.error("[WeatherMcpServer] MCP Server instance created");
    this.setupTools();
  }

  private setupTools(): void {
    console.error("[WeatherMcpServer] Setting up tools...");

    this.server.tool(
      "get-weather",
      "Tool to get the current weather for a given city",
      weatherToolSchema,
      getWeatherTool
    );

    console.error("[WeatherMcpServer] Registered tool: get-weather");
    console.error("[WeatherMcpServer] Tool setup completed");
  }

  public async start(): Promise<void> {
    console.error("[WeatherMcpServer] Starting server connection...");

    const transport = new StdioServerTransport();
    console.error("[WeatherMcpServer] Created StdioServerTransport");

    await this.server.connect(transport);
    console.error(
      "[WeatherMcpServer] ========================================"
    );
    console.error(
      "[WeatherMcpServer] MCP Weather Server is running and ready!"
    );
    console.error("[WeatherMcpServer] Available tools: get-weather");
    console.error(
      "[WeatherMcpServer] Listening for MCP connections via stdio..."
    );
    console.error(
      "[WeatherMcpServer] ========================================"
    );
  }
}
