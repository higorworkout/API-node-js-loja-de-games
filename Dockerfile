FROM node:22-alpine
WORKDIR /app
COPY package.json .
COPY . .
#RUN apk add --no-cache python2 g++ make
#ENV put sua variables here
CMD [ "node", "index.js" ]

EXPOSE 8080
