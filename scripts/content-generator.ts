import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { generateArticle, generateTierList, generateGameDescription } from './jiekou-api'

dotenv.config({ path: '.env.local' })

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./dev.db',
})

const db = new PrismaClient({
  adapter,
})

interface Game {
  id: string
  slug: string
  name: string
  developer?: string | null
  release_date?: Date | null
}

const ARTICLE_TOPICS = [
  "Complete Beginner's Guide",
  'Best Characters and How to Get Them',
  'Tips and Tricks for Advanced Players',
  'How to Farm Resources Efficiently',
  'Secret Areas and Hidden Content',
  'Best Builds and Loadouts',
  'How to Complete All Achievements',
  'Tier List and Meta Analysis'
]

const TIER_CATEGORIES = [
  'character',
  'weapon',
  'build',
  'team_comp'
]

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function generateContentForGame(game: Game) {
  console.log(`\n🎮 Processing: ${game.name}`)

  try {
    const articleTopic = ARTICLE_TOPICS[Math.floor(Math.random() * ARTICLE_TOPICS.length)]
    console.log(`📝 Generating article: ${articleTopic}`)

    const articleContent = await generateArticle(game.name, articleTopic)

    if (articleContent) {
      const slug = `${game.slug}-${articleTopic.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`

      try {
        await db.article.upsert({
          where: { slug },
          create: {
            slug,
            title: articleContent.title,
            article_type: 'guide',
            status: 'draft',
            source_type: 'ai',
            game_id: game.id,
            cover_url: 'https://picsum.photos/seed/' + game.slug + '/800/450',
            cover_alt: game.name,
            content: articleContent.content,
            excerpt: articleContent.excerpt,
            read_time: Math.ceil(articleContent.content.split(' ').length / 200),
            seo_title: articleContent.title,
            seo_description: articleContent.excerpt,
            seo_keywords: JSON.stringify(articleContent.seoKeywords),
          },
          update: {
            title: articleContent.title,
            content: articleContent.content,
            excerpt: articleContent.excerpt,
            seo_title: articleContent.title,
            seo_description: articleContent.excerpt,
            seo_keywords: JSON.stringify(articleContent.seoKeywords),
          }
        })

        await db.game.update({
          where: { id: game.id },
          data: { guide_count: { increment: 1 } }
        })

        console.log(`✅ Article created: ${articleContent.title}`)
      } catch (dbError) {
        console.error(`❌ Failed to save article:`, dbError)
      }
    }

    await sleep(2000)

    const tierCategory = TIER_CATEGORIES[Math.floor(Math.random() * TIER_CATEGORIES.length)]
    console.log(`📊 Generating tier list: ${tierCategory}`)

    const tierListContent = await generateTierList(game.name, tierCategory)

    if (tierListContent) {
      try {
        const existingTierList = await db.tierList.findUnique({
          where: {
            game_id_category: {
              game_id: game.id,
              category: tierCategory as any
            }
          }
        })

        if (existingTierList) {
          await db.tierEntry.deleteMany({
            where: { tier_list_id: existingTierList.id }
          })
          await db.tierList.delete({
            where: { id: existingTierList.id }
          })
        }

        await db.tierList.create({
          data: {
            category: tierCategory as any,
            patch_version: tierListContent.patchVersion,
            is_community: false,
            game_id: game.id,
            total_votes: 0,
            entries: {
              create: tierListContent.entries.map(entry => ({
                name: entry.name,
                image_url: `https://picsum.photos/seed/${entry.name.replace(/\s+/g, '-').toLowerCase()}/200/200`,
                grade: entry.grade as any,
                avg_score: entry.grade === 'S' ? 4.8 : entry.grade === 'A' ? 4.2 : entry.grade === 'B' ? 3.5 : entry.grade === 'C' ? 2.8 : 2.0,
                vote_count: 0,
                description: entry.description
              }))
            }
          }
        })

        await db.game.update({
          where: { id: game.id },
          data: { has_tier_list: true }
        })

        console.log(`✅ Tier list created: ${game.name} ${tierCategory}`)
      } catch (dbError) {
        console.error(`❌ Failed to save tier list:`, dbError)
      }
    }

    await sleep(2000)

    if (!game.developer || !game.release_date) {
      console.log(`⏭️ Skipping game description for ${game.name} (missing data)`)
      return
    }

    console.log(`📖 Generating game description`)

    const description = await generateGameDescription(
      game.name,
      game.developer,
      game.release_date.getFullYear()
    )

    if (description) {
      try {
        await db.game.update({
          where: { id: game.id },
          data: { description }
        })

        console.log(`✅ Description updated for ${game.name}`)
      } catch (dbError) {
        console.error(`❌ Failed to update description:`, dbError)
      }
    }

  } catch (error) {
    console.error(`❌ Error processing ${game.name}:`, error)
  }
}

async function runContentGeneration() {
  console.log('🚀 Starting GameHub Content Generation Pipeline')
  console.log('=' .repeat(50))

  try {
    const games = await db.game.findMany({
      where: {
        OR: [
          { guide_count: { lt: 3 } },
          { has_tier_list: false }
        ]
      },
      take: 5
    })

    if (games.length === 0) {
      console.log('📭 No games need content generation')
      return
    }

    console.log(`\n📦 Found ${games.length} games to process\n`)

    for (const game of games) {
      await generateContentForGame(game)
      await sleep(3000)
    }

    console.log('\n' + '=' .repeat(50))
    console.log('✅ Content generation pipeline completed!')

    const stats = await Promise.all([
      db.game.count(),
      db.article.count(),
      db.tierList.count()
    ])

    console.log(`\n📊 Current Stats:`)
    console.log(`   Games: ${stats[0]}`)
    console.log(`   Articles: ${stats[1]}`)
    console.log(`   Tier Lists: ${stats[2]}`)

  } catch (error) {
    console.error('❌ Pipeline error:', error)
  } finally {
    await db.$disconnect()
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runContentGeneration()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Fatal error:', error)
      process.exit(1)
    })
}

export { runContentGeneration, generateContentForGame }
