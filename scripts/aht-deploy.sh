#!/bin/bash

# Check if the branch name is provided
if [ -z "$1" ]; then
	echo "Usage: $0 <branch-name>"
	exit 1
fi

BRANCH_NAME=$1

# pull code
git fetch --prune origin
git reset --hard origin/$BRANCH_NAME

# docker-compose -f docker-compose.prod.yml up -d --build
COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker-compose -f docker-compose.prod.yml build --parallel && docker-compose -f docker-compose.prod.yml up -d

