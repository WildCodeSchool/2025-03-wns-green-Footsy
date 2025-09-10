FROM node:lts-alpine
WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

COPY src src
COPY index.html ./
COPY *.config.ts ./
COPY *.config.js ./
COPY tsconfig.app.json ./
COPY tsconfig.node.json ./

CMD ["npm", "run", "dev"]