# backend/Dockerfile
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install


# Copy the rest of the backend code
COPY . .

# Build the project if needed (e.g., if using TypeScript, you might run: npm run build)
RUN npm run build


# Expose the backend port (adjust if your backend uses a different port)
EXPOSE 5000

# Run the backend server (adjust the command as per your package.json scripts)
CMD ["npm", "run", "start"]
