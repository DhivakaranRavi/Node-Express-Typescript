FROM node:10.16
WORKDIR /usr/src/app
RUN mkdir /usr/src/app/node_modules
COPY package*.json ./

RUN npm install
COPY . .
EXPOSE 5000
RUN npm run build