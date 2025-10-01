# Estágio de build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Estágio de produção
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY package.json .

# Garante que o cliente Prisma seja gerado para o ambiente de produção
RUN npx prisma generate

EXPOSE 3000
CMD ["node", "dist/server.js"]