FROM node:20-alpine AS build

WORKDIR /app
COPY package.json package-lock.json ./
COPY packages/client/package.json packages/client/
COPY packages/server/package.json packages/server/
RUN npm ci

COPY . .
RUN npm run build -w client

FROM node:20-alpine

WORKDIR /app
COPY package.json package-lock.json ./
COPY packages/server/package.json packages/server/
RUN npm ci -w server --omit=dev

COPY packages/server/ packages/server/
COPY --from=build /app/packages/client/dist packages/client/dist

EXPOSE 3001
CMD ["node", "--import", "tsx", "packages/server/src/index.ts"]
