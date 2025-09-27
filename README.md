# MCP Weather Server

A Model Context Protocol (MCP) server that provides weather information for any city using the Open-Meteo API.

## Overview

This MCP server implements a simple weather tool that allows you to get current weather conditions for any city worldwide. It uses the Open-Meteo geocoding API to resolve city names to coordinates and then fetches current weather data including temperature and wind speed.

## Features

- **City Weather Lookup**: Get current weather for any city by name
- **Geocoding Integration**: Automatically resolves city names to coordinates
- **Current Conditions**: Returns temperature and wind speed information
- **Error Handling**: Graceful handling of invalid cities or API failures
- **MCP Compatible**: Built using the official MCP SDK

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

## Installation

1. Clone this repository:

```bash
git clone <repository-url>
cd mcp-weather-server
```

2. Install dependencies:

```bash
npm install
```

## Usage

### Local Development

#### Building and Running the Server

1. Build the TypeScript code:

```bash
npm run build
```

2. Start the MCP Weather Server:

```bash
npm start
```

Or for development (builds and runs in one command):

```bash
npm run dev
```

The server will start and listen for MCP connections via stdio transport.

### Docker Deployment

#### Quick Start with Docker

1. **Build the Docker images:**

```bash
./scripts/docker-build.sh
```

2. **Run in production mode:**

```bash
./scripts/docker-run.sh production
```

3. **Run in development mode (with hot reload):**

```bash
./scripts/docker-run.sh development
```

#### Manual Docker Commands

**Build production image:**

```bash
docker build -t mcp-weather-server:latest .
```

**Build development image:**

```bash
docker build -f Dockerfile.dev -t mcp-weather-server:dev .
```

**Run with Docker Compose (production):**

```bash
docker-compose up mcp-weather-server
```

**Run with Docker Compose (development):**

```bash
docker-compose --profile dev up mcp-weather-server-dev
```

**Run standalone container:**

```bash
docker run -it --rm --name mcp-weather-server mcp-weather-server:latest
```

#### Docker Features

- **Multi-stage builds** for optimized production images
- **Non-root user** for enhanced security
- **Health checks** for container monitoring
- **Resource limits** for controlled resource usage
- **Development mode** with hot reload and volume mounting
- **Persistent logging** with volume mounts

### Available Tools

#### `get-weather`

Retrieves current weather information for a specified city.

**Parameters:**

- `city` (string): The name of the city to get weather for

**Example Response:**

```
The current temperature in London is 15°C with a wind speed of 12 km/h.
```

### Integration with MCP Clients

This server can be integrated with any MCP-compatible client. The server exposes the `get-weather` tool that can be called with a city name parameter.

## API Dependencies

This server relies on the following free APIs:

- **Open-Meteo Geocoding API**: For converting city names to coordinates
- **Open-Meteo Weather API**: For fetching current weather data

No API keys are required as Open-Meteo provides free access to their weather data.

## Project Structure

```
mcp-weather-server/
├── src/                    # Source code
│   ├── index.ts           # Main entry point
│   ├── server/            # Server implementation
│   │   └── index.ts       # MCP server setup
│   ├── tools/             # Tool implementations
│   │   └── weather-tool.ts # Weather tool logic
│   ├── types/             # TypeScript type definitions
│   │   └── weather.ts     # Weather-related types
│   └── utils/             # Utility functions
│       └── api.ts         # API client utilities
├── dist/                  # Compiled JavaScript output
├── examples/              # Example configurations
│   └── mcp-config.json   # MCP client configuration example
├── docs/                  # Documentation
├── tests/                 # Test files
├── tsconfig.json         # TypeScript configuration
├── package.json          # Project dependencies and metadata
├── package-lock.json     # Locked dependency versions
├── .gitignore           # Git ignore rules
└── README.md            # This file
```

## Dependencies

- `@modelcontextprotocol/sdk`: Official MCP SDK for building servers
- `zod`: Schema validation library for input validation

## Error Handling

The server includes robust error handling for common scenarios:

- **Invalid City Names**: Returns a helpful message when a city cannot be found
- **API Failures**: Gracefully handles network errors or API unavailability
- **Malformed Requests**: Input validation ensures proper request format

## Development

### Building

This project uses ES modules. Make sure your Node.js version supports ES modules or use a transpiler if needed.

### Testing

Currently, no automated tests are included. To test the server:

1. Start the server
2. Connect with an MCP client
3. Call the `get-weather` tool with various city names

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC License

## Changelog

### Version 1.0.0

- Initial release
- Basic weather lookup functionality
- MCP SDK integration
- Open-Meteo API integration

## Support

For issues or questions, please open an issue in the repository.
