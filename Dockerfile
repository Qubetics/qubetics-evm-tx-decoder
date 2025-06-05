# Build Stage
FROM node:20.11-alpine AS build
WORKDIR /usr/src/app

COPY . .

RUN npm install typescript
RUN npm run build:prod

# Final Stage
FROM node:20.11-alpine AS final

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/build .
COPY --from=build /usr/src/app/prisma .
COPY package*.json ./

# install clean deps omit the dev deps and also ignore the
# scripts from running while installing deps
RUN npm ci --omit=dev --ignore-scripts
RUN npm run generate:prisma

EXPOSE 7900

CMD ["npm", "run", "start:prod"]
