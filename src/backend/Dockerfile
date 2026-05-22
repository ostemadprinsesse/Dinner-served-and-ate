FROM node:22-alpine

WORKDIR /app

# Copy ONLY backend's package files
COPY package*.json ./

RUN npm install

# Copy backend code
COPY . .

EXPOSE 5000

CMD ["node", "index.js"]