# 베이스 이미지 설정
FROM node:20-alpine AS base
WORKDIR /app

# 의존성 파일 복사 후 설치
COPY package.json package-lock.json* ./
RUN npm ci

# 소스 코드 복사
COPY . .

# 빌드 스테이지
FROM base AS builder
RUN npm run build

# 러너 스테이지
FROM base AS runner
WORKDIR /app

# 환경 변수 설정
ENV NODE_ENV production
ENV PORT 3000

# 애플리케이션 사용자 설정
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# 빌드 결과물 복사
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

# 소유권 설정
RUN chown nextjs:nodejs .next

# 사용자 변경
USER nextjs

# 포트 노출
EXPOSE 3000

# 실행 명령
CMD ["node", "server.js"]