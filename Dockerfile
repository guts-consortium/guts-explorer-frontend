# Use Node.js as the base image
FROM node:20 AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app's code
COPY . .

# Build
CMD ["npm", "run", "build"]

# Serve using Nginx
FROM nginx:alpine

# Copy build directory to location to be served
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom Nginx config
COPY nginx.conf /etc/nginx/nginx.conf