FROM node:16.15.1
WORKDIR /app
COPY package*.json .

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
        then yarn install; \
        else yarn install --prod; \
        fi

COPY . .
ENV PORT 3000
EXPOSE $ENV
CMD [ "node", "index.js" ]