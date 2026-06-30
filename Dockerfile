# ---------- Build Stage ----------
FROM node:20-alpine AS builder
WORKDIR /app
 
COPY package*.json ./
RUN npm ci
 
COPY . .
 
ENV VITE_API_URL=/api
RUN npm run build
 
# Remove dev dependencies (IMPORTANT)
RUN npm prune --omit=dev
 
 
# ---------- Production Stage ----------
FROM node:20-alpine
 
WORKDIR /app
 
ENV NODE_ENV=production
 
# Copy ONLY production-ready node_modules from builder
COPY --from=builder /app/node_modules ./node_modules
 
# Copy ONLY required runtime files
COPY index.js ./
COPY --from=builder /app/dist ./dist
 
# Clean npm cache leftovers (extra savings)
RUN rm -rf /root/.npm
 
EXPOSE 5000
 
CMD ["node", "index.js"] 