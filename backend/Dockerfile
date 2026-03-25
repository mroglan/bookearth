FROM golang:1.22-alpine AS build

WORKDIR /app

COPY go.mod .

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 go build -o /bin/bookearth-api ./cmd/server

FROM alpine:3.20

RUN adduser -D appuser
USER appuser

COPY --from=build /bin/bookearth-api /usr/local/bin/bookearth-api

EXPOSE 4000

ENTRYPOINT ["/usr/local/bin/bookearth-api"]
