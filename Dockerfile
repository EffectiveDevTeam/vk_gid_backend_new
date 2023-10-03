FROM node:18-alpine
WORKDIR /app
COPY package.json yarn.lock ./
COPY tsconfig.json ./
COPY . .
RUN yarn install --immutable
RUN yarn build
EXPOSE 4000
CMD ["yarn", "start:prod"]
