FROM mhart/alpine-node:8.9.4

WORKDIR /app

COPY package.json package.json
COPY yarn.lock yarn.lock

RUN yarn install --production

COPY . .

EXPOSE 3000

ENTRYPOINT [ "npm", "start" ]
