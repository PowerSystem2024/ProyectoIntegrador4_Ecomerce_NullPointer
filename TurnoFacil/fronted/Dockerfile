# Use official nginx image
FROM nginx:alpine

# Install curl for healthcheck
RUN apk add --no-cache curl

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy frontend files
COPY . /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create a simple healthcheck page
RUN echo '<!DOCTYPE html><html><head><title>Health Check</title></head><body><h1>Frontend is healthy</h1></body></html>' > /usr/share/nginx/html/health.html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]