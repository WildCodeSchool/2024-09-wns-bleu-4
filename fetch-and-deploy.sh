#!/bin/bash
echo "Starting deployment at $(date)"
cd /home/ubuntu/app

# Pull toutes les images depuis Docker Hub
docker compose -f docker-compose.prod.yml pull

# Redémarrer tous les services
docker compose -f docker-compose.prod.yml up -d

echo "Deployment completed at $(date)"
