FROM node:22-alpine

WORKDIR /app

# Copy ONLY app's package files (not parent's)
COPY package*.json ./

RUN npm install

# Copy frontend code
COPY . .

# Copy API schema from parent directory
COPY ../api-schema.yaml ./

EXPOSE 3005

CMD ["npm", "run", "dev"]