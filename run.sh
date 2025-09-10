#!/bin/bash
echo "🔄 Building Piston from source..."

docker-compose down -v
docker-compose up -d --build api
echo "🔄 Following logs ..."
docker logs -f piston_api