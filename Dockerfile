# Use node image as base
FROM node:14 as build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Angular app
RUN npm run build  --prod

# Use NGINX image as base for serving the Angular app
FROM nginx:alpine

# Copy the built Angular app from the build stage to NGINX html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 4200

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

