# Use Node.js as the base image
FROM node:17

# Set the working directory
WORKDIR /app

# Copy the package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the React app for production
# RUN npm run build

# Expose the frontend port (e.g., 3000)
EXPOSE 3000

# Start the frontend server
CMD ["npm", "start"]
