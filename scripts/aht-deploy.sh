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

docker compose -f docker-compose.aht.dev.yml up -d --build
