FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY server.js ./
COPY public ./public

RUN mkdir -p /app/uploads

EXPOSE 5050

CMD ["node", "server.js"]
