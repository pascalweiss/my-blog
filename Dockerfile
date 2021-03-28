FROM nginx:1.17.1-alpine
COPY /nginx/nginx.conf /etc/nginx/nginx.conf
COPY /dist/my-blog /usr/share/nginx/html