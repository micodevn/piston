#!/bin/bash
echo "🔄 Building Piston from source (no cache)..."

docker-compose down -v

# Build lại không dùng cache
docker-compose build --no-cache api

# Chạy lại container
docker-compose up -d api

echo "🔄 Following logs ..."
docker logs -f piston_api
