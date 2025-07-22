# Base image
FROM node:20

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Optional: Install Angular CLI globally
RUN npm install -g @angular/cli

# Copy all source files
COPY . .

# Expose the port Angular dev server runs on (default is 4200)
EXPOSE 4200

# Start Angular dev server
CMD sh -c "npm run build && npm run start"
