FROM node:20-alpine AS web-builder
WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml tsconfig.json tsconfig.base.json nx.json .eslintrc.json /app/
COPY .yarn/ /app/.yarn/
COPY packages/mazic /app/packages/mazic
COPY packages/mazic-ui /app/packages/mazic-ui
COPY packages/mazic-shared /app/packages/mazic-shared

RUN yarn

RUN --mount=type=secret,id=VITE_DEV \
      VITE_DEV="$(cat /run/secrets/VITE_DEV)" && \
      echo "VITE_DEV=\"${VITE_DEV}\"" >> /app/packages/mazic/.env.production
RUN --mount=type=secret,id=VITE_DOMAIN \
      VITE_DOMAIN="$(cat /run/secrets/VITE_DOMAIN)" && \
      echo "VITE_DOMAIN=\"${VITE_DOMAIN}\"" >> /app/packages/mazic/.env.production
RUN --mount=type=secret,id=VITE_API_URL \
      VITE_API_URL="$(cat /run/secrets/VITE_API_URL)" && \
      echo "VITE_API_URL=\"${VITE_API_URL}\"" >> /app/packages/mazic/.env.production


RUN cat /app/packages/mazic/.env.production
RUN yarn nx run mazic:build --verbose

FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY packages/mazic-server/go.mod ./packages/mazic-server/
COPY packages/mazic-server/go.sum ./packages/mazic-server/

RUN cd packages/mazic-server && go mod download

COPY ./packages/mazic-server/ /app/packages/mazic-server/
COPY --from=web-builder /app/dist/packages/mazic/ /app/packages/mazic-server/web/dist/

WORKDIR /app/packages/mazic-server
RUN go build -o server .

FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/packages/mazic-server/server ./packages/mazic-server/
COPY --from=builder /app/packages/mazic-server/internal/mods/rbac/auth/*.html ./packages/mazic-server/internal/mods/rbac/auth/

RUN --mount=type=secret,id=APP_ENV \
      APP_ENV="$(cat /run/secrets/APP_ENV)" && \
      echo "APP_ENV=\"${APP_ENV}\"" >> /app/packages/mazic-server/.env.production
RUN --mount=type=secret,id=APP_DOMAIN \
      APP_DOMAIN="$(cat /run/secrets/APP_DOMAIN)" && \
      echo "APP_DOMAIN=\"${APP_DOMAIN}\"" >> /app/packages/mazic-server/.env.production
RUN --mount=type=secret,id=APP_NAME \
      APP_NAME="$(cat /run/secrets/APP_NAME)" && \
      echo "APP_NAME=\"${APP_NAME}\"" >> /app/packages/mazic-server/.env.production
RUN --mount=type=secret,id=BCRYPT_COST \
      BCRYPT_COST="$(cat /run/secrets/BCRYPT_COST)" && \
      echo "BCRYPT_COST=\"${BCRYPT_COST}\"" >> /app/packages/mazic-server/.env.production

RUN --mount=type=secret,id=JWT_PRIVATE_KEY \
      JWT_PRIVATE_KEY="$(cat /run/secrets/JWT_PRIVATE_KEY)" && \
      echo "JWT_PRIVATE_KEY=\"${JWT_PRIVATE_KEY}\"" >> /app/packages/mazic-server/.env.production
RUN --mount=type=secret,id=JWT_PUBLIC_KEY \
      JWT_PUBLIC_KEY="$(cat /run/secrets/JWT_PUBLIC_KEY)" && \
      echo "JWT_PUBLIC_KEY=\"${JWT_PUBLIC_KEY}\"" >> /app/packages/mazic-server/.env.production
RUN --mount=type=secret,id=ACCESS_TOKEN_EXPIRED_IN \
      ACCESS_TOKEN_EXPIRED_IN="$(cat /run/secrets/ACCESS_TOKEN_EXPIRED_IN)" && \
      echo "ACCESS_TOKEN_EXPIRED_IN=\"${ACCESS_TOKEN_EXPIRED_IN}\"" >> /app/packages/mazic-server/.env.production
RUN --mount=type=secret,id=REFRESH_TOKEN_EXPIRED_IN \
      REFRESH_TOKEN_EXPIRED_IN="$(cat /run/secrets/REFRESH_TOKEN_EXPIRED_IN)" && \
      echo "REFRESH_TOKEN_EXPIRED_IN=\"${REFRESH_TOKEN_EXPIRED_IN}\"" >> /app/packages/mazic-server/.env.production

RUN --mount=type=secret,id=SUPABASE_URL \
      SUPABASE_URL="$(cat /run/secrets/SUPABASE_URL)" && \
      echo "SUPABASE_URL=\"${SUPABASE_URL}\"" >> /app/packages/mazic-server/.env.production
RUN --mount=type=secret,id=SUPABASE_BUCKET \
      SUPABASE_BUCKET="$(cat /run/secrets/SUPABASE_BUCKET)" && \
      echo "SUPABASE_BUCKET=\"${SUPABASE_BUCKET}\"" >> /app/packages/mazic-server/.env.production
RUN --mount=type=secret,id=SUPABASE_SERVICE_ROLE \
      SUPABASE_SERVICE_ROLE="$(cat /run/secrets/SUPABASE_SERVICE_ROLE)" && \
      echo "SUPABASE_SERVICE_ROLE=\"${SUPABASE_SERVICE_ROLE}\"" >> /app/packages/mazic-server/.env.production

RUN --mount=type=secret,id=SMTP_HOST \
      SMTP_HOST="$(cat /run/secrets/SMTP_HOST)" && \
      echo "SMTP_HOST=\"${SMTP_HOST}\"" >> /app/packages/mazic-server/.env.production
RUN --mount=type=secret,id=SMTP_PORT \
      SMTP_PORT="$(cat /run/secrets/SMTP_PORT)" && \
      echo "SMTP_PORT=\"${SMTP_PORT}\"" >> /app/packages/mazic-server/.env.production
RUN --mount=type=secret,id=SMTP_USERNAME \
      SMTP_USERNAME="$(cat /run/secrets/SMTP_USERNAME)" && \
      echo "SMTP_USERNAME=\"${SMTP_USERNAME}\"" >> /app/packages/mazic-server/.env.production
RUN --mount=type=secret,id=SMTP_PASSWORD \
      SMTP_PASSWORD="$(cat /run/secrets/SMTP_PASSWORD)" && \
      echo "SMTP_PASSWORD=\"${SMTP_PASSWORD}\"" >> /app/packages/mazic-server/.env.production
RUN --mount=type=secret,id=SMTP_TLS \
      SMTP_TLS="$(cat /run/secrets/SMTP_TLS)" && \
      echo "SMTP_TLS=\"${SMTP_TLS}\"" >> /app/packages/mazic-server/.env.production
RUN --mount=type=secret,id=SMTP_SENDER_NAME \
      SMTP_SENDER_NAME="$(cat /run/secrets/SMTP_SENDER_NAME)" && \
      echo "SMTP_SENDER_NAME=\"${SMTP_SENDER_NAME}\"" >> /app/packages/mazic-server/.env.production
RUN --mount=type=secret,id=SMTP_SENDER_ADDR \
      SMTP_SENDER_ADDR="$(cat /run/secrets/SMTP_SENDER_ADDR)" && \
      echo "SMTP_SENDER_ADDR=\"${SMTP_SENDER_ADDR}\"" >> /app/packages/mazic-server/.env.production

RUN --mount=type=secret,id=S3_ACCESS \
      S3_ACCESS="$(cat /run/secrets/S3_ACCESS)" && \
      echo "S3_ACCESS=\"${S3_ACCESS}\"" >> /app/packages/mazic-server/.env.production
RUN --mount=type=secret,id=S3_SECRET \
      S3_SECRET="$(cat /run/secrets/S3_SECRET)" && \
      echo "S3_SECRET=\"${S3_SECRET}\"" >> /app/packages/mazic-server/.env.production
RUN --mount=type=secret,id=S3_BUCKET \
      S3_BUCKET="$(cat /run/secrets/S3_BUCKET)" && \
      echo "S3_BUCKET=\"${S3_BUCKET}\"" >> /app/packages/mazic-server/.env.production
RUN --mount=type=secret,id=S3_REGION \
      S3_REGION="$(cat /run/secrets/S3_REGION)" && \
      echo "S3_REGION=\"${S3_REGION}\"" >> /app/packages/mazic-server/.env.production
RUN --mount=type=secret,id=S3_ENDPOINT \
      S3_ENDPOINT="$(cat /run/secrets/S3_ENDPOINT)" && \
      echo "S3_ENDPOINT=\"${S3_ENDPOINT}\"" >> /app/packages/mazic-server/.env.production

RUN cat /app/packages/mazic-server/.env.production

EXPOSE 4000

WORKDIR /app/packages/mazic-server
CMD ["./server", "serve", "--http=0.0.0.0:4000", "--dir=./mz_data"]
