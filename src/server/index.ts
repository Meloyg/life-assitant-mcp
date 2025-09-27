import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { weatherToolSchema, getWeatherTool } from "../tools/weather-tool.js";

export class WeatherMcpServer {
  private server: McpServer;

  constructor() {
    this.server = new McpServer({
      name: "MCP Weather Server",
      version: "1.0.0",
      description: "A simple weather server for MCP",
    });

    this.setupTools();
  }

  private setupTools(): void {
    this.server.tool(
      "get-weather",
      "Tool to get the current weather for a given city",
      weatherToolSchema,
      getWeatherTool
    );
  }

  public async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.log("MCP Weather Server is running...");
  }
}
