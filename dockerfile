FROM node:20-alpine

WORKDIR /nasiya-project

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install --frozen-lockfile --prod

COPY . .

EXPOSE 3000

CMD [ "node","dist","main.js" ]