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
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_1080p/co1xhc.jpg',
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
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_1080p/co2v9z.jpg',
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
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_1080p/co3xus.jpg',
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
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_1080p/co1tww.jpg',
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
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_1080p/co5h22.jpg',
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
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_1080p/co1xhc.jpg',
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
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_1080p/co2v9z.jpg',
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
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_1080p/co3xus.jpg',
    cover_alt: 'Elden Ring Boss Guide',
    content: `# Elden Ring Boss Guide

Conquer every major boss in Elden Ring with these strategies.

## Margit, the Fell Omen
The first major boss you'll encounter. Learn his attack patterns.

## Godrick the Grafted
Master his phase transitions and avoid his powerful attacks.

## Rennala, Queen of the Full Moon
Use summon ashes to distract this powerful sorceress.

## Radagon/Elden Beast
The final challenge. Be prepared for a long battle.`,
    excerpt: 'Defeat every major boss in Elden Ring with our comprehensive guide.',
    read_time: 15,
    seo_title: 'Elden Ring Boss Guide | GameHub',
    seo_description: 'Complete strategy guide for defeating all Elden Ring bosses.',
  },
]

async function main() {
  console.log('🔄 Updating games with high-quality images...')
  for (const gameData of gamesData) {
    await prisma.game.upsert({
      where: { slug: gameData.slug },
      update: gameData,
      create: gameData,
    })
    console.log(`✅ Updated: ${gameData.name}`)
  }

  console.log('\n🔄 Updating articles with game-matching images...')
  for (const articleData of articlesData) {
    const game = await prisma.game.findUnique({
      where: { slug: articleData.slug.split('-').slice(0, 2).join('-') },
    })

    if (game && !articleData.cover_url.includes('picsum')) {
      articleData.cover_url = game.cover_url
    }

    await prisma.article.upsert({
      where: { slug: articleData.slug },
      update: articleData,
      create: {
        ...articleData,
        game_id: game?.id,
      },
    })
    console.log(`✅ Updated: ${articleData.title}`)
  }

  console.log('\n✅ All data updated with high-quality images!')
  await prisma.$disconnect()
}

main()