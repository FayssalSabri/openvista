FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

# Default command for dev (can be overridden by docker-compose)
CMD ["npm", "run", "dev"]
