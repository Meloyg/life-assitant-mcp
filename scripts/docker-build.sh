#!/bin/bash

# Docker build script for MCP Weather Server
set -e

echo "🐳 Building MCP Weather Server Docker image..."

# Build production image
docker build -t mcp-weather-server:latest .

# Build development image
docker build -f Dockerfile.dev -t mcp-weather-server:dev .

echo "✅ Docker images built successfully!"
echo "📦 Production image: mcp-weather-server:latest"
echo "🔧 Development image: mcp-weather-server:dev"

# Show image sizes
echo ""
echo "📊 Image sizes:"
docker images | grep mcp-weather-server
