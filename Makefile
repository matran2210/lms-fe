.PHONY: help build build-no-cache run stop clean logs shell test

# Default target
help:
	@echo "Available commands:"
	@echo "  build        - Build Docker image"
	@echo "  build-no-cache - Build Docker image without cache"
	@echo "  run          - Run application with docker-compose"
	@echo "  stop         - Stop application"
	@echo "  clean        - Remove containers and images"
	@echo "  logs         - Show application logs"
	@echo "  shell        - Access container shell"
	@echo "  test         - Run tests in container"

# Build Docker image
build:
	docker-compose build

# Build Docker image without cache
build-no-cache:
	docker-compose build --no-cache

# Run application
run:
	docker-compose up -d

# Stop application
stop:
	docker-compose down

# Clean up containers and images
clean:
	docker-compose down --rmi all --volumes --remove-orphans
	docker system prune -f

# Show logs
logs:
	docker-compose logs -f zoom-fe

# Access container shell
shell:
	docker-compose exec zoom-fe sh

# Run tests
test:
	docker-compose exec zoom-fe yarn test

# Production build
prod-build:
	docker build --target runner -t zoom-fe:latest .

# Production run
prod-run:
	docker run -d -p 3000:3000 --name zoom-fe-prod zoom-fe:latest

# Production stop
prod-stop:
	docker stop zoom-fe-prod && docker rm zoom-fe-prod 