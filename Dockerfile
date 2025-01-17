# Build stage
FROM node:21-alpine AS build-stage

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN npm install -g pnpm

WORKDIR /app

# Copy only the necessary package files first to utilize Docker caching
COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile

# Copy the rest of the application files
COPY . .

# Build the frontend application
RUN pnpm run build

# Production stage
FROM nginx:stable-alpine AS production-stage

LABEL org.opencontainers.image.source=https://github.com/cas-4/frontend
LABEL version="0.1.7"

# Copy the Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built frontend app from the build stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Set environment variable for Nginx, this can be used to replace values in the static files.
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

# Use entrypoint script to replace environment variables in static files before starting Nginx
CMD ["/entrypoint.sh"]
