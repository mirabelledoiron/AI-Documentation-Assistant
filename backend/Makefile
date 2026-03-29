# backend/Makefile
.PHONY: build run test clean migrate

build:
	go build -o bin/server ./cmd/server

run:
	go run cmd/server/main.go

test:
	go test ./... -v

clean:
	rm -rf bin/
	rm -rf coverage.out

migrate:
	go run cmd/migrate/main.go

docker-build:
	docker build -t docs-backend:latest .

docker-run:
	docker run -p 8080:8080 --env-file .env docs-backend:latest
