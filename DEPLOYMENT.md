# GameHub Deployment Guide
============================

## Quick Start

### 1. Local Development

```bash
# Install dependencies
npm install

# Set up database
npm run db:push
npm run db:seed

# Start development server
npm run dev
```

### 2. Production Build

```bash
# Build for production
npm run build

# Preview production build
npm start
```

## Production Deployment

### Environment Variables

Create a `.env.production` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database_name"

# NextAuth
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secret-key-here"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Redis (Upstash)
UPSTASH_REDIS_REST_URL="https://your-upstash-url"
UPSTASH_REDIS_REST_TOKEN="your-upstash-token"

# Algolia (Search)
NEXT_PUBLIC_ALGOLIA_APP_ID="your-algolia-app-id"
ALGOLIA_ADMIN_API_KEY="your-algolia-admin-key"
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY="your-algolia-search-key"

# Anthropic (AI Content Generation)
ANTHROPIC_API_KEY="your-anthropic-api-key"

# Internal API
INTERNAL_API_SECRET="your-internal-api-secret"
```

### Platform-Specific Deployment

#### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy directly from main branch

#### Railway Deployment

1. Create a new Railway project
2. Add a PostgreSQL database service
3. Add environment variables
4. Deploy your repository

#### Self-Hosted with Docker

```bash
# Build Docker image
docker build -t gamehub .

# Run container
docker run -p 3000:3000 --env-file .env.production gamehub
```

## Database Migration

When deploying to production:

```bash
# Apply database migrations
npm run db:push

# Seed database (first time only)
npm run db:seed
```

## Post-Deployment Checks

- [ ] All pages load correctly
- [ ] Database is connected and responsive
- [ ] API endpoints are working
- [ ] Authentication is functional
- [ ] Search is indexed
- [ ] Media is loading
- [ ] SEO meta tags are present
- [ ] Sitemap and robots.txt are accessible
- [ ] Analytics are tracking

## Rollback

If you need to rollback a deployment:

1. Checkout the previous working commit
2. Verify with a local build
3. Deploy the working commit
4. Rollback any database changes if needed
