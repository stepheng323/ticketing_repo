FROM node:alpine

WORKDIR /app

COPY package.json .

RUN npm install --save --legacy-peer-deps --only=prod

COPY . .

CMD ["npm", "start"]