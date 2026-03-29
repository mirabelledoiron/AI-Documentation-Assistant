# Root Makefile
.PHONY: help build run test clean deploy

help:
	@echo "📦 AI-Powered Documentation Assistant"
	@echo "============================="
	@echo ""
	@echo "Commands:"
	@echo "  make install    - Install all dependencies"
	@echo "  make build      - Build backend and frontend"
	@echo "  make run        - Run everything locally"
	@echo "  make test       - Run all tests"
	@echo "  make clean      - Clean build artifacts"
	@echo "  make docker-up  - Start with Docker"
	@echo "  make docker-down - Stop Docker containers"
	@echo "  make deploy     - Deploy to production"

install:
	cd backend && go mod download
	cd frontend && npm install

build:
	cd backend && make build
	cd frontend && make build

run:
	docker-compose -f docker/docker-compose.yml up -d

test:
	cd backend && go test ./...
	cd frontend && npm test

clean:
	cd backend && make clean
	cd frontend && make clean

docker-up:
	docker-compose -f docker/docker-compose.yml up -d

docker-down:
	docker-compose -f docker/docker-compose.yml down

deploy:
	bash scripts/deploy.sh
