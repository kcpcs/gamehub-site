#!/bin/bash
set -e

echo "=============================================="
echo "GameHub Production Deployment Script"
echo "=============================================="

if [ -z "$VERCEL_PROJECT_ID" ]; then
    echo "ERROR: VERCEL_PROJECT_ID environment variable is not set"
    echo "Please set it with: export VERCEL_PROJECT_ID=your-project-id"
    exit 1
fi

echo ""
echo "Step 1: Running Prisma migrations..."
npx prisma migrate deploy

if [ $? -ne 0 ]; then
    echo "ERROR: Prisma migrations failed"
    exit 1
fi

echo ""
echo "Step 2: Deploying to Vercel..."
npx vercel --prod --confirm --project $VERCEL_PROJECT_ID

if [ $? -ne 0 ]; then
    echo "ERROR: Vercel deployment failed"
    exit 1
fi

echo ""
echo "=============================================="
echo "Deployment completed successfully!"
echo "=============================================="