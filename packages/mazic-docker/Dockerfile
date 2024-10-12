FROM golang:1.22-alpine AS builder

WORKDIR /app

COPY go.work go.work.sum ./
COPY packages/mazic-server/go.* ./packages/mazic-server/
COPY packages/mazic-shared/go.* ./packages/mazic-shared/
RUN go work sync

WORKDIR /app/packages/mazic-server
RUN go mod download
COPY packages/mazic-server/ ./

# RUN ls -la /app/packages/mazic-server

WORKDIR /app/packages/mazic-shared
RUN go mod download
COPY packages/mazic-shared/ ./

RUN ls -la /app/packages/mazic-server

WORKDIR /app/packages/mazic-server
RUN go build -o server .

FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/packages/mazic-server/server ./packages/mazic-server/
COPY --from=builder /app/packages/mazic-shared/ ./packages/mazic-shared/

EXPOSE 8090

WORKDIR /app/packages/mazic-server
CMD ["./server", "serve", "--http=0.0.0.0:8090", "--dir=./mz_data"]
