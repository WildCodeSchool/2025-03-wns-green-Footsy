FROM node:lts-alpine
WORKDIR /app

RUN apk --no-cache add curl

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install --include=dev

# On ne copie plus `src`, car on le monte en volume
CMD ["npm", "run", "dev"]