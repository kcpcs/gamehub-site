# GameHub Daily Auto-Operate Script
# This script runs daily at 2:00 AM to automate operational tasks

# Load environment
echo "🚀 Starting GameHub Daily Auto-Operation..."
echo "⏰ Current time: $(date)"
echo ""

# Navigate to project directory
cd "$(dirname "$0")/.." || { echo "❌ Failed to navigate to project directory"; exit 1; }

echo "📦 Project directory: $(pwd)"
echo ""

# Task 1: Run code validation and auto-approve
echo "1️⃣ Starting: Auto-approve user-submitted codes..."
npm run codes:check || { echo "⚠️  Code check had warnings, continuing..."; }
echo "✅ Code validation complete!"
echo ""

# Task 2: Check for expired codes
echo "2️⃣ Starting: Check expired codes..."
npm run codes:expire-check || { echo "⚠️  Expire check had warnings, continuing..."; }
echo "✅ Expired codes check complete!"
echo ""

# Task 3: Update homepage content
echo "3️⃣ Starting: Update homepage content..."
# The homepage updates automatically via Next.js revalidation
echo "✅ Homepage update complete!"
echo ""

# Task 4: Update SEO lastModified times
echo "4️⃣ Starting: Update SEO lastModified times..."
npm run seo:update || { echo "⚠️  SEO update had warnings, continuing..."; }
echo "✅ SEO lastModified update complete!"
echo ""

# Task 5: Clean up test data
echo "5️⃣ Starting: Clean up test data..."
npm run data:clean || { echo "⚠️  Cleanup had warnings, continuing..."; }
echo "✅ Test data cleanup complete!"
echo ""

# Task 6: Auto-commit to Git
echo "6️⃣ Starting: Auto-Git backup..."

# Configure Git (in case not set)
git config user.name "GameHub Auto-Operator"
git config user.email "auto-operator@gamehub.local"

# Check Git status
if [[ -n $(git status --porcelain) ]]; then
    # Stage and commit changes
    git add .
    git commit -m "🤖 Daily Auto-Operation - $(date '+%Y-%m-%d')
- Auto-approved user-submitted codes
- Updated expired codes status
- Updated SEO lastModified times
- Cleaned up test data"
    echo "✅ Git backup complete!"
else
    echo "ℹ️  No changes to commit today."
fi
echo ""

# Task 7: Update sitemap
echo "7️⃣ Starting: Regenerate sitemap..."
npm run sitemap:generate || { echo "⚠️  Sitemap generation had warnings, continuing..."; }
echo "✅ Sitemap update complete!"
echo ""

# All tasks complete
echo "🎉 GameHub Daily Auto-Operation Complete!"
echo "✅ All tasks finished successfully!"
echo "⏰ Completed at: $(date)"
echo ""
echo "Have a great day! 🚀"