FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:stable-alpine

RUN apk add --no-cache gettext

COPY nginx.conf /etc/nginx/templates/nginx.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE ${PORT}

CMD ["sh", "-c", "envsubst '${PORT}' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/nginx.conf && nginx -g 'daemon off;'"]
