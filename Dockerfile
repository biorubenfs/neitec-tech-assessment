# Base image
FROM node:22

# Create app directory
WORKDIR /usr/src/app

# A dependency layer to cache npm install
COPY package.json ./
COPY pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install app dependencies
RUN pnpm install --frozen-lockfile

# Bundle app source
COPY . .

# Copy the .env and .env.development files
# COPY .env

# Creates a "dist" folder with the production build
RUN pnpm run build

# Expose the port on which the app will run
EXPOSE 4000

# Start the server using the production build
CMD ["pnpm", "run", "start:prod"]