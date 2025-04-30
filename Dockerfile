# Use Node.js as the base image
FROM node:20 AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Ensure node_modules/.bin is in PATH
ENV PATH="/app/node_modules/.bin:$PATH"

# Copy the rest of the app's code
COPY . .

# Build
RUN npm run build

# Serve step
FROM nginx:alpine

# Remove default nginx config and add our own
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built frontend files
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
