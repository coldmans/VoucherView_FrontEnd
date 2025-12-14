# Build stage
FROM --platform=linux/amd64 node:lts-alpine AS build

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 설치를 위해 package.json 및 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# 앱 빌드
RUN npm run build

# Production stage
FROM --platform=linux/amd64 nginx:alpine

# nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/nginx.conf

# 빌드된 파일을 nginx html 디렉토리로 복사
COPY --from=build /app/build /usr/share/nginx/html

# 포트 노출
EXPOSE 80

# nginx 실행
CMD ["nginx", "-g", "daemon off;"]
