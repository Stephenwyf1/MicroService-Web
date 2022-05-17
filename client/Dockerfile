FROM node:16-alpine

#change
ENV CI = true
ENV WDS_SOCKET_PORT=0
#change end

WORKDIR /app
COPY package.json ./
RUN npm install
COPY ./ ./

CMD ["npm", "start"]