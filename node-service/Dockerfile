# Node.js Service Dockerfile
FROM node:20-alpine

WORKDIR /app

# Dependencies install karo
COPY package*.json ./
RUN npm install --production

COPY . .

# Uploads folder create karo
RUN mkdir -p uploads

EXPOSE 3000

CMD ["node", "server.js"]
