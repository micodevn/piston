#!/bin/bash
echo "🔄 Rebuilding Piston from source..."

docker-compose down -v
docker-compose up -d --build api