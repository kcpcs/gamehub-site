# Vercel Deployment

## Quick Deploy

### Option 1: Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Link to project
cd f:/国外游戏站/site
vercel link

# Pull environment variables
vercel env pull .env.local

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Option 2: GitHub Integration

1. Push code to GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Configure project settings:
   - Framework: Next.js
   - Root Directory: `./` or `site`
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. Add environment variables in Vercel dashboard
7. Click "Deploy"

## Environment Variables (Vercel Dashboard)

Add these in Vercel → Project → Settings → Environment Variables:

```
DATABASE_URL (production)
REDIS_URL (production)
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET (generate with: openssl rand -base64 32)
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
ANTHROPIC_API_KEY
ALGOLIA_ADMIN_KEY
ALGOLIA_APP_ID
NEXT_PUBLIC_ALGOLIA_APP_ID
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_MONTHLY_PRICE_ID
STRIPE_YEARLY_PRICE_ID
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
INTERNAL_API_SECRET
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Domain Configuration

1. Go to Vercel → Project → Settings → Domains
2. Add your domain (e.g., `gamehub.com`)
3. Update DNS records as instructed by Vercel:
   ```
   Type    Name    Value
   A       @       76.76.21.21
   CNAME   www     cname.vercel-dns.com
   ```

## Post-Deployment

### 1. Run Database Migration

```bash
# In Vercel dashboard, add a deployment hook or run via CLI
vercel run npx prisma migrate deploy
```

### 2. Initialize Algolia Index

```bash
vercel run npm run algolia:reindex
```

### 3. Verify Deployment

- Check Vercel Analytics
- Test all API endpoints
- Verify custom domain SSL certificate

## Monitoring

- Vercel Analytics: https://vercel.com/dashboard
- Vercel Logs: Project → Deployments → [Select Deployment] → Runtime Logs
- Vercel Speed Insights: Project → Speed Insights

## Troubleshooting

### Build Failures

```bash
# Local build test
npm run build

# Check for errors
npm run lint
npx tsc --noEmit
```

### Environment Variables Not Loading

1. Go to Project → Settings → Environment Variables
2. Ensure variables are set for "Production" environment
3. Redeploy after adding new variables

### Database Connection Issues

1. Verify DATABASE_URL is correctly set
2. Check if database allows connections from Vercel IPs
3. Consider using Prisma Accelerate for serverless connection pooling

## Stripe Webhook (Local Testing)

Use Stripe CLI for local webhook testing:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Start webhook listener
stripe listen --forward-to localhost:3001/api/stripe/webhook

# Get webhook signing secret and add to .env.local
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```
