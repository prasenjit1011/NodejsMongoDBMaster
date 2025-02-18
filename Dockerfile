# Use the official Node.js image from Docker Hub
FROM node:16

# Create and set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your Node.js app will run on
EXPOSE 3080

# Start the application
CMD ["node", "app.js"]
