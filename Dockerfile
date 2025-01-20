# Build stage
FROM node:21-alpine AS build-stage

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile

COPY . .

RUN pnpm run build

# Production stage
FROM nginx:stable-alpine AS production-stage

LABEL org.opencontainers.image.source=https://github.com/cas-4/frontend
LABEL version="0.2.0"

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
