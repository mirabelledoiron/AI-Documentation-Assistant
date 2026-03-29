# backend/Dockerfile
FROM golang:1.21-alpine AS build

WORKDIR /app

RUN apk add --no-cache ca-certificates git

COPY go.mod go.sum ./
# Make dependency download failures easier to diagnose in Render logs
ENV GOPROXY=https://proxy.golang.org,direct
ENV GOSUMDB=sum.golang.org
RUN go version
RUN go env
RUN go mod download -x

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o main ./cmd/server

FROM alpine:latest

RUN apk --no-cache add ca-certificates && adduser -D -g '' nonroot

WORKDIR /root/

COPY --from=build /app/main ./main
COPY --from=build /app/.env.example ./.env

RUN chown root:root main

EXPOSE 8080

USER nonroot

CMD ["./main"]
