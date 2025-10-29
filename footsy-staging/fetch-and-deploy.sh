#!/bin/sh
# fetch-and-deploy.sh
docker compose -f compose.prod.yaml down && \
    docker compose -f compose.prod.yaml pull && \
    GATEWAY_PORT=8003 docker compose -f compose.prod.yaml up -d;
