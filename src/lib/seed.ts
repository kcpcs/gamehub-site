import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const adapter = new PrismaLibSql({
  url: 'file:./dev.db',
})

const prisma = new PrismaClient({
  adapter,
})

const gamesData = [
  {
    slug: 'genshin-impact',
    name: 'Genshin Impact',
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1xhc.jpg',
    platforms: ['PC', 'PS5', 'Mobile', 'Switch'],
    genres: ['RPG', 'Action', 'Adventure'],
    tags: ['open world', 'anime', 'gacha'],
    developer: 'miHoYo',
    publisher: 'miHoYo',
    score_opencritic: 81,
    guide_count: 5,
    code_count: 8,
    has_tier_list: true,
    description: 'Explore the vast open world of Teyvat in this popular action RPG.',
  },
  {
    slug: 'valorant',
    name: 'Valorant',
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2v9z.jpg',
    platforms: ['PC'],
    genres: ['Shooter', 'Action', 'Strategy'],
    tags: ['competitive', '5v5', 'tactical'],
    developer: 'Riot Games',
    publisher: 'Riot Games',
    score_opencritic: 83,
    guide_count: 4,
    code_count: 3,
    has_tier_list: true,
    description: 'A 5v5 tactical shooter with unique agent abilities.',
  },
  {
    slug: 'elden-ring',
    name: 'Elden Ring',
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co3xus.jpg',
    platforms: ['PC', 'PS5', 'Xbox Series X'],
    genres: ['RPG', 'Action', 'Open World'],
    tags: ['souls-like', 'difficult', 'fantasy'],
    developer: 'FromSoftware',
    publisher: 'Bandai Namco',
    score_opencritic: 96,
    guide_count: 6,
    code_count: 0,
    has_tier_list: true,
    description: 'An epic open-world RPG from the creators of Dark Souls.',
  },
  {
    slug: 'cyberpunk-2077',
    name: 'Cyberpunk 2077',
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1tww.jpg',
    platforms: ['PC', 'PS5', 'Xbox Series X'],
    genres: ['RPG', 'Action', 'Open World'],
    tags: ['cyberpunk', 'futuristic', 'story-driven'],
    developer: 'CD Projekt Red',
    publisher: 'CD Projekt',
    score_opencritic: 86,
    guide_count: 4,
    code_count: 5,
    has_tier_list: false,
    description: 'Immerse yourself in Night City, a megalopolis obsessed with power.',
  },
  {
    slug: 'zelda-tears-of-the-kingdom',
    name: "The Legend of Zelda: Tears of the Kingdom",
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co5h22.jpg',
    platforms: ['Switch'],
    genres: ['Adventure', 'Action', 'RPG'],
    tags: ['open world', 'nintendo', 'fantasy'],
    developer: 'Nintendo',
    publisher: 'Nintendo',
    score_opencritic: 96,
    guide_count: 5,
    code_count: 0,
    has_tier_list: false,
    description: 'Return to Hyrule in this sequel to Breath of the Wild.',
  },
]

const articlesData = [
  {
    slug: 'genshin-impact-beginner-guide',
    title: 'Complete Beginner Guide to Genshin Impact',
    article_type: 'guide' as const,
    status: 'published' as const,
    source_type: 'ai' as const,
    cover_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=genshin%20impact%20guide%20cover%20dark%20theme&image_size=landscape_16_9',
    cover_alt: 'Genshin Impact Guide',
    content: `# Genshin Impact Beginner Guide

Welcome to Teyvat! This guide will help you get started in Genshin Impact.

## Getting Started

1. **Choose your starting character**
2. **Complete the tutorial**
3. **Explore Mondstadt**

## Tips for New Players

- Always pick up everything you see
- Don't forget to level up your characters
- Join other players for co-op

## Resources

- Resin is your most valuable resource
- Primogems are used for wishes
- Mora is the main currency`,
    excerpt: 'Master the basics of Genshin Impact with this comprehensive beginner guide.',
    read_time: 10,
    seo_title: 'Genshin Impact Beginner Guide | GameHub',
    seo_description: 'Complete beginner guide for Genshin Impact - tips, tricks, and strategies.',
  },
  {
    slug: 'valorant-agent-guide',
    title: 'Best Agents for Beginners in Valorant',
    article_type: 'guide' as const,
    status: 'published' as const,
    source_type: 'ai' as const,
    cover_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=valorant%20guide%20cover%20dark%20theme&image_size=landscape_16_9',
    cover_alt: 'Valorant Agents',
    content: `# Valorant Agent Guide

Choosing the right agent is crucial for success in Valorant.

## Beginner-Friendly Agents

### Sova
Great for scouting and gathering information.

### Sage
Excellent healer and area controller.

### Phoenix
Self-sufficient duelist with self-healing.

## Agent Roles

- **Duelists**: Initiate fights
- **Controllers**: Control areas
- **Sentinels**: Protect teammates
- **Initiators**: Gather information`,
    excerpt: 'Learn which agents are best suited for new players in Valorant.',
    read_time: 8,
    seo_title: 'Valorant Agent Guide for Beginners | GameHub',
    seo_description: 'Choose the best agent to start your Valorant journey.',
  },
  {
    slug: 'elden-ring-boss-guide',
    title: 'Elden Ring Boss Guide: How to Beat Every Major Boss',
    article_type: 'guide' as const,
    status: 'published' as const,
    source_type: 'ai' as const,
    cover_url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elden%20ring%20boss%20guide%20dark%20theme&image_size=landscape_16_9',
    cover_alt: 'Elden Ring Boss',
    content: `# Elden Ring Boss Guide

Conquer every major boss in Elden Ring with these strategies.

## Margit, the Fell Omen
- Learn his attack patterns
- Use shield for blocking
- Attack during recovery

## Godrick the Grafted
- Watch for his big attacks
- Target his weak points
- Stay mobile`,
    excerpt: 'Defeat every major boss in Elden Ring with our comprehensive guide.',
    read_time: 15,
    seo_title: 'Elden Ring Boss Guide | GameHub',
    seo_description: 'Strategies to defeat all major bosses in Elden Ring.',
  },
]

const codesData = [
  { code: 'GENSHINGIFT', reward_desc: '60 Primogems + 5 Hero Wit', status: 'active' as const, source: 'official' as const },
  { code: 'FREEMORAX', reward_desc: '100 Primogems + 10 Mystic Enhancement Ore', status: 'active' as const, source: 'official' as const },
  { code: '3VUN37C7VUNM', reward_desc: '60 Primogems + 5 Adventurer Experience', status: 'active' as const, source: 'official' as const },
  { code: '9BPCJCQXQKRT', reward_desc: '100 Primogems + 5 Hero Wit', status: 'active' as const, source: 'twitter' as const },
  { code: 'GENSHIN100', reward_desc: '100 Primogems', status: 'expired' as const, source: 'official' as const },
  { code: 'VALORANT2024', reward_desc: '500 VP', status: 'unverified' as const, source: 'user' as const },
  { code: 'CYBERPUNKREDEEM', reward_desc: 'Free DLC Content', status: 'active' as const, source: 'official' as const },
]

async function main() {
  console.log('🌱 Starting seed data creation...')

  // Create or update games
  for (const gameData of gamesData) {
    console.log(`Creating/Updating game: ${gameData.name}`)
    await prisma.game.upsert({
      where: { slug: gameData.slug },
      update: gameData,
      create: gameData,
    })
  }

  // Create or update articles
  for (const articleData of articlesData) {
    console.log(`Creating/Updating article: ${articleData.title}`)
    const game = await prisma.game.findFirst({ 
      where: { slug: articleData.slug.split('-').slice(0, 2).join('-') } 
    })
    await prisma.article.upsert({
      where: { slug: articleData.slug },
      update: {
        ...articleData,
        game_id: game?.id,
      },
      create: {
        ...articleData,
        game_id: game?.id,
      }
    })
  }

  // Create or update codes for Genshin Impact
  const genshin = await prisma.game.findUnique({ where: { slug: 'genshin-impact' } })
  if (genshin) {
    for (const codeData of codesData.slice(0, 5)) {
      console.log(`Creating/Updating code: ${codeData.code}`)
      await prisma.gameCode.upsert({
        where: { code_game_id: { code: codeData.code, game_id: genshin.id } },
        update: codeData,
        create: {
          ...codeData,
          game_id: genshin.id,
        }
      })
    }
  }

  // Create or update codes for Valorant
  const valorant = await prisma.game.findUnique({ where: { slug: 'valorant' } })
  if (valorant) {
    await prisma.gameCode.upsert({
      where: { code_game_id: { code: codesData[5].code, game_id: valorant.id } },
      update: codesData[5],
      create: {
        ...codesData[5],
        game_id: valorant.id,
      }
    })
  }

  // Create or update codes for Cyberpunk
  const cyberpunk = await prisma.game.findUnique({ where: { slug: 'cyberpunk-2077' } })
  if (cyberpunk) {
    await prisma.gameCode.upsert({
      where: { code_game_id: { code: codesData[6].code, game_id: cyberpunk.id } },
      update: codesData[6],
      create: {
        ...codesData[6],
        game_id: cyberpunk.id,
      }
    })
  }

  console.log('✅ Seed data creation completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error creating seed data:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })