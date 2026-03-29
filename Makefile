.PHONY: help setup build test clean docker-up docker-down deploy

help:
	@echo "Available targets:"
	@echo "  setup       - Initial setup of the project"
	@echo "  build       - Build both backend and frontend"
	@echo "  test        - Run tests for both backend and frontend"
	@echo "  clean       - Clean build artifacts"
	@echo "  docker-up   - Start Docker services"
	@echo "  docker-down - Stop Docker services"
	@echo "  deploy      - Deploy the application"

setup:
	@echo "Setting up project..."
	@bash scripts/setup.sh

build:
	@echo "Building backend..."
	@cd backend && make build
	@echo "Building frontend..."
	@cd frontend && make build

test:
	@echo "Running backend tests..."
	@cd backend && make test
	@echo "Running frontend tests..."
	@cd frontend && make test

clean:
	@echo "Cleaning backend..."
	@cd backend && make clean
	@echo "Cleaning frontend..."
	@cd frontend && make clean

docker-up:
	@echo "Starting Docker services..."
	@cd docker && docker-compose up -d

docker-down:
	@echo "Stopping Docker services..."
	@cd docker && docker-compose down

deploy:
	@echo "Deploying application..."
	@bash scripts/deploy.sh
