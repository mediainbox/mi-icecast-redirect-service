#Dockerfile MI-redirect
FROM node:11.3.0
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 7979
CMD [ "node", "index.js" ]
