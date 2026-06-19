# ── deps ──────────────────────────────────────────────────────────────
FROM --platform=linux/amd64 node:22-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package*.json ./
RUN npm ci

# ── builder ───────────────────────────────────────────────────────────
FROM --platform=linux/amd64 node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1

# Scarab SEO content layer — fetched at build time only. These build args are
# consumed during `next build` and are NOT carried into the runner stage, so the
# read token never ships in the final image. If unset, the content layer is
# disabled and the site builds without the SEO pages.
ARG CONTENT_API_BASE_URL
ARG CONTENT_API_READ_TOKEN
ARG CONTENT_API_PRODUCT_KEY
ARG NEXT_PUBLIC_SITE_URL
ENV CONTENT_API_BASE_URL=$CONTENT_API_BASE_URL \
    CONTENT_API_READ_TOKEN=$CONTENT_API_READ_TOKEN \
    CONTENT_API_PRODUCT_KEY=$CONTENT_API_PRODUCT_KEY \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

RUN node node_modules/next/dist/bin/next build

# ── runner ────────────────────────────────────────────────────────────
FROM --platform=linux/amd64 node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Static assets
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# MDX content lives on the filesystem at runtime — must be in the image
COPY --from=builder --chown=nextjs:nodejs /app/content ./content

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]
