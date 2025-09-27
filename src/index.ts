import { WeatherMcpServer } from "./server/index.js";

async function main() {
  const server = new WeatherMcpServer();
  await server.start();
}

main().catch((error) => {
  console.error("Failed to start MCP Weather Server:", error);
  process.exit(1);
});
