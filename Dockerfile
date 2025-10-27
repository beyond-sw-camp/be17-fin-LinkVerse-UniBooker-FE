# 1단계: 빌드
FROM node:20 AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

# 2단계: 실행 (정적 파일 서빙)
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]