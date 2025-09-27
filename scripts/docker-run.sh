#!/bin/bash

# Docker run script for MCP Weather Server
set -e

# Default to production mode
MODE=${1:-production}

echo "🚀 Starting MCP Weather Server in $MODE mode..."

if [ "$MODE" = "development" ] || [ "$MODE" = "dev" ]; then
    echo "🔧 Running in development mode with hot reload..."
    docker-compose --profile dev up mcp-weather-server-dev
elif [ "$MODE" = "production" ] || [ "$MODE" = "prod" ]; then
    echo "📦 Running in production mode..."
    docker-compose up mcp-weather-server
else
    echo "❌ Invalid mode: $MODE"
    echo "Usage: $0 [production|development]"
    exit 1
fi
