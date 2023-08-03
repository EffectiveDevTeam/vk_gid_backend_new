FROM node:16-alpine
WORKDIR /app
COPY package.json yarn.lock ./
COPY tsconfig.json ./
COPY . .
COPY prisma ./prisma/
RUN yarn install --immutable
RUN npx prisma generate
# RUN npx prisma migrate deploy
RUN yarn build
EXPOSE 4000
CMD ["yarn", "start:prod"]
