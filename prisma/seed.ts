import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  console.log('🌱 Starting to seed the database with rich content...');

  // Clear existing data
  await db.article.deleteMany({});
  await db.gameCode.deleteMany({});
  await db.tierList.deleteMany({});
  await db.game.deleteMany({});
  await db.user.deleteMany({});

  // Create a test user
  const testUser = await db.user.create({
    data: {
      email: 'demo@gamehub.local',
      username: 'demo_user',
      membership: 'pro',
      creator_level: 'creator',
    },
  });
  console.log('✅ Created test user:', testUser.email);

  // Create comprehensive game data - 15 games with rich content
  const games = await Promise.all([
    db.game.create({
      data: {
        slug: 'genshin-impact',
        name: 'Genshin Impact',
        igdb_id: 105416,
        cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co4k5r.jpg',
        screenshots: [
          'https://picsum.photos/seed/genshin1/1200/675',
          'https://picsum.photos/seed/genshin2/1200/675',
          'https://picsum.photos/seed/genshin3/1200/675'
        ],
        platforms: ['PC', 'PlayStation 5', 'PlayStation 4', 'Nintendo Switch', 'Mobile'],
        genres: ['RPG', 'Action', 'Adventure'],
        tags: ['open-world', 'anime', 'fantasy', 'gacha'],
        developer: 'miHoYo',
        publisher: 'miHoYo',
        release_date: new Date('2020-09-28'),
        score_opencritic: 84,
        score_community: 86,
        score_review_count: 2341,
        description: 'Genshin Impact is an open-world action RPG featuring a vast world, elemental combat, and a rich story.',
        guide_count: 156,
        code_count: 23,
        has_tier_list: true,
      },
    }),
    db.game.create({
      data: {
        slug: 'the-legend-of-zelda-breath-of-the-wild',
        name: 'The Legend of Zelda: Breath of the Wild',
        igdb_id: 7346,
        cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.jpg',
        screenshots: [
          'https://picsum.photos/seed/zelda1/1200/675',
          'https://picsum.photos/seed/zelda2/1200/675'
        ],
        platforms: ['Nintendo Switch', 'Wii U'],
        genres: ['Adventure', 'RPG'],
        tags: ['open-world', 'action', 'exploration'],
        developer: 'Nintendo',
        publisher: 'Nintendo',
        release_date: new Date('2017-03-03'),
        score_opencritic: 97,
        score_community: 95,
        score_review_count: 1234,
        description: 'Step into a world of discovery, exploration, and adventure in The Legend of Zelda: Breath of the Wild.',
        guide_count: 89,
        code_count: 5,
        has_tier_list: true,
      },
    }),
    db.game.create({
      data: {
        slug: 'elden-ring',
        name: 'Elden Ring',
        igdb_id: 133347,
        steam_appid: 1245620,
        cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2l4k.jpg',
        screenshots: [
          'https://picsum.photos/seed/elden1/1200/675',
          'https://picsum.photos/seed/elden2/1200/675'
        ],
        platforms: ['PC', 'PlayStation 5', 'Xbox Series X', 'PlayStation 4', 'Xbox One'],
        genres: ['Action', 'RPG'],
        tags: ['soulsborne', 'open-world', 'fantasy'],
        developer: 'FromSoftware',
        publisher: 'Bandai Namco',
        release_date: new Date('2022-02-25'),
        score_opencritic: 96,
        score_steam_pct: 92,
        score_community: 94,
        score_review_count: 876,
        description: 'THE NEW FANTASY ACTION RPG. Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring.',
        guide_count: 167,
        code_count: 8,
        has_tier_list: true,
      },
    }),
    db.game.create({
      data: {
        slug: 'cyberpunk-2077',
        name: 'Cyberpunk 2077',
        igdb_id: 10798,
        steam_appid: 1091500,
        cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2m3y.jpg',
        screenshots: [
          'https://picsum.photos/seed/cyber1/1200/675'
        ],
        platforms: ['PC', 'PlayStation 5', 'Xbox Series X', 'PlayStation 4', 'Xbox One'],
        genres: ['Action', 'RPG', 'Shooter'],
        tags: ['cyberpunk', 'open-world', 'first-person', 'future'],
        developer: 'CD Projekt Red',
        publisher: 'CD Projekt Red',
        release_date: new Date('2020-12-10'),
        score_opencritic: 86,
        score_steam_pct: 78,
        score_community: 82,
        score_review_count: 1567,
        description: 'Cyberpunk 2077 is an open-world, action-adventure story set in Night City, a megalopolis obsessed with power and glamour.',
        guide_count: 98,
        code_count: 12,
        has_tier_list: true,
      },
    }),
    db.game.create({
      data: {
        slug: 'valorant',
        name: 'Valorant',
        igdb_id: 111801,
        cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co3f8k.jpg',
        screenshots: [
          'https://picsum.photos/seed/valorant1/1200/675',
          'https://picsum.photos/seed/valorant2/1200/675'
        ],
        platforms: ['PC'],
        genres: ['FPS', 'Strategy', 'Tactical'],
        tags: ['competitive', 'esports', 'tactical'],
        developer: 'Riot Games',
        publisher: 'Riot Games',
        release_date: new Date('2020-06-02'),
        score_opencritic: 80,
        score_community: 76,
        score_review_count: 634,
        description: 'Valorant is a free-to-play tactical shooter featuring unique agents with special abilities.',
        guide_count: 189,
        code_count: 15,
        has_tier_list: true,
      },
    }),
    db.game.create({
      data: {
        slug: 'league-of-legends',
        name: 'League of Legends',
        igdb_id: 20232,
        cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co3j2e.jpg',
        screenshots: [
          'https://picsum.photos/seed/lol1/1200/675'
        ],
        platforms: ['PC', 'Mac'],
        genres: ['MOBA', 'Strategy', 'Action'],
        tags: ['competitive', 'esports', 'multiplayer'],
        developer: 'Riot Games',
        publisher: 'Riot Games',
        release_date: new Date('2009-10-27'),
        score_opencritic: 78,
        score_community: 75,
        score_review_count: 892,
        description: 'The world\'s most popular MOBA with over 160 champions to master.',
        guide_count: 245,
        code_count: 18,
        has_tier_list: true,
      },
    }),
    db.game.create({
      data: {
        slug: 'fortnite',
        name: 'Fortnite',
        igdb_id: 108343,
        cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co3f9v.jpg',
        screenshots: [
          'https://picsum.photos/seed/fortnite1/1200/675'
        ],
        platforms: ['PC', 'PlayStation 5', 'Xbox Series X', 'Nintendo Switch', 'PlayStation 4', 'Xbox One', 'Mobile'],
        genres: ['Battle Royale', 'FPS', 'Survival'],
        tags: ['battle royale', 'building', 'competitive'],
        developer: 'Epic Games',
        publisher: 'Epic Games',
        release_date: new Date('2017-07-25'),
        score_opencritic: 81,
        score_community: 74,
        score_review_count: 756,
        description: 'Fortnite is a battle royale with unique building mechanics and ever-changing gameplay.',
        guide_count: 134,
        code_count: 28,
        has_tier_list: true,
      },
    }),
    db.game.create({
      data: {
        slug: 'minecraft',
        name: 'Minecraft',
        igdb_id: 1428,
        cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co4k5s.jpg',
        screenshots: [
          'https://picsum.photos/seed/minecraft1/1200/675'
        ],
        platforms: ['PC', 'PlayStation 5', 'Xbox Series X', 'Nintendo Switch', 'PlayStation 4', 'Xbox One', 'Mobile'],
        genres: ['Sandbox', 'Adventure', 'Survival'],
        tags: ['building', 'sandbox', 'multiplayer', 'creative'],
        developer: 'Mojang Studios',
        publisher: 'Mojang Studios',
        release_date: new Date('2011-11-18'),
        score_opencritic: 93,
        score_community: 91,
        score_review_count: 1892,
        description: 'Minecraft is a sandbox game where you can build anything you can imagine.',
        guide_count: 289,
        code_count: 12,
        has_tier_list: false,
      },
    }),
    db.game.create({
      data: {
        slug: 'stardew-valley',
        name: 'Stardew Valley',
        igdb_id: 4553,
        cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co383v.jpg',
        screenshots: [
          'https://picsum.photos/seed/stardew1/1200/675'
        ],
        platforms: ['PC', 'PlayStation 5', 'Xbox Series X', 'Nintendo Switch', 'Mobile'],
        genres: ['Simulation', 'Farming', 'Indie'],
        tags: ['cozy', 'farming', 'relaxing', 'indie'],
        developer: 'ConcernedApe',
        publisher: 'ConcernedApe',
        release_date: new Date('2016-02-26'),
        score_opencritic: 89,
        score_community: 92,
        score_review_count: 1234,
        description: 'Stardew Valley is a peaceful farming simulation game where you rebuild your grandfather\'s farm.',
        guide_count: 176,
        code_count: 6,
        has_tier_list: false,
      },
    }),
    db.game.create({
      data: {
        slug: 'god-of-war-ragnarok',
        name: 'God of War Ragnarök',
        igdb_id: 152385,
        cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co3m69.jpg',
        screenshots: [
          'https://picsum.photos/seed/gow1/1200/675'
        ],
        platforms: ['PlayStation 5', 'PlayStation 4'],
        genres: ['Action', 'Adventure'],
        tags: ['action-adventure', 'norse', 'story-rich'],
        developer: 'Santa Monica Studio',
        publisher: 'Sony Interactive Entertainment',
        release_date: new Date('2022-11-09'),
        score_opencritic: 94,
        score_community: 91,
        score_review_count: 876,
        description: 'Join Kratos and Atreus on a journey through the Nine Realms.',
        guide_count: 112,
        code_count: 0,
        has_tier_list: true,
      },
    }),
    db.game.create({
      data: {
        slug: 'dark-souls-3',
        name: 'Dark Souls III',
        igdb_id: 24172,
        cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2j1k.jpg',
        screenshots: [
          'https://picsum.photos/seed/ds3/1200/675'
        ],
        platforms: ['PC', 'PlayStation 4', 'Xbox One'],
        genres: ['Action', 'RPG'],
        tags: ['soulsborne', 'difficult', 'dark-fantasy'],
        developer: 'FromSoftware',
        publisher: 'Bandai Namco',
        release_date: new Date('2016-04-12'),
        score_opencritic: 89,
        score_community: 88,
        score_review_count: 1123,
        description: 'An action RPG known for its challenging gameplay and deep lore.',
        guide_count: 134,
        code_count: 3,
        has_tier_list: true,
      },
    }),
    db.game.create({
      data: {
        slug: 'hogwarts-legacy',
        name: 'Hogwarts Legacy',
        igdb_id: 149836,
        cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co4g5m.jpg',
        screenshots: [
          'https://picsum.photos/seed/hogwarts1/1200/675'
        ],
        platforms: ['PC', 'PlayStation 5', 'Xbox Series X', 'PlayStation 4', 'Xbox One', 'Nintendo Switch'],
        genres: ['RPG', 'Action', 'Adventure'],
        tags: ['harry-potter', 'magic', 'open-world'],
        developer: 'Portkey Games',
        publisher: 'Warner Bros.',
        release_date: new Date('2023-02-10'),
        score_opencritic: 83,
        score_community: 81,
        score_review_count: 789,
        description: 'Hogwarts Legacy is an immersive open-world action RPG set in the 1800s wizarding world.',
        guide_count: 87,
        code_count: 5,
        has_tier_list: true,
      },
    }),
    db.game.create({
      data: {
        slug: 'baldurs-gate-3',
        name: 'Baldur\'s Gate 3',
        igdb_id: 144741,
        cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co319m.jpg',
        screenshots: [
          'https://picsum.photos/seed/bg3/1200/675'
        ],
        platforms: ['PC', 'PlayStation 5', 'Xbox Series X'],
        genres: ['RPG', 'Turn-Based', 'Strategy'],
        tags: ['d&d', 'story-rich', 'party-based'],
        developer: 'Larian Studios',
        publisher: 'Larian Studios',
        release_date: new Date('2023-08-03'),
        score_opencritic: 96,
        score_steam_pct: 94,
        score_community: 93,
        score_review_count: 1345,
        description: 'Baldur\'s Gate 3 is a definitive edition of the genre-defining D&D RPG experience.',
        guide_count: 156,
        code_count: 7,
        has_tier_list: true,
      },
    }),
    db.game.create({
      data: {
        slug: 'hollow-knight',
        name: 'Hollow Knight',
        igdb_id: 60951,
        cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co383w.jpg',
        screenshots: [
          'https://picsum.photos/seed/hollow1/1200/675'
        ],
        platforms: ['PC', 'PlayStation 4', 'Xbox One', 'Nintendo Switch'],
        genres: ['Metroidvania', 'Action', 'Indie'],
        tags: ['metroidvania', 'indie', 'atmospheric'],
        developer: 'Team Cherry',
        publisher: 'Team Cherry',
        release_date: new Date('2017-02-24'),
        score_opencritic: 90,
        score_community: 91,
        score_review_count: 987,
        description: 'Descend into the world of Hollow Knight, the award-winning action-adventure through a ruined insect kingdom.',
        guide_count: 67,
        code_count: 0,
        has_tier_list: true,
      },
    }),
    db.game.create({
      data: {
        slug: 'persona-5-royal',
        name: 'Persona 5 Royal',
        igdb_id: 103869,
        cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2m3z.jpg',
        screenshots: [
          'https://picsum.photos/seed/p5r/1200/675'
        ],
        platforms: ['PlayStation 4', 'PlayStation 5', 'PC', 'Nintendo Switch', 'Xbox Series X', 'Xbox One'],
        genres: ['JRPG', 'Turn-Based', 'Life Simulation'],
        tags: ['jrpg', 'anime', 'persona'],
        developer: 'P-Studio',
        publisher: 'Atlus',
        release_date: new Date('2020-03-31'),
        score_opencritic: 95,
        score_community: 94,
        score_review_count: 1456,
        description: 'Persona 5 Royal is an expanded version of Persona 5, adding new content and features.',
        guide_count: 145,
        code_count: 4,
        has_tier_list: true,
      },
    }),
  ]);
  console.log('✅ Created', games.length, 'games with rich content');

  // Create comprehensive articles - 15 high-quality guides
  const articles = await Promise.all([
    db.article.create({
      data: {
        slug: 'genshin-impact-complete-beginner-guide',
        title: 'Genshin Impact: Complete Beginner\'s Guide 2024',
        article_type: 'guide',
        status: 'published',
        source_type: 'ai',
        source_urls: [],
        game_id: games[0].id,
        author_id: testUser.id,
        cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co4k5r.jpg',
        cover_alt: 'Genshin Impact Guide',
        excerpt: 'Everything you need to know to start your adventure in Teyvat with confidence.',
        content: `# Genshin Impact: Complete Beginner's Guide

Welcome to Teyvat! This guide will help you start your adventure strong.

## Getting Started

### Choosing Your First Character
- **Traveler**: Free, versatile protagonist
- **Amber**: Great for exploration with her gliding boost
- **Kaeya**: Freezes enemies, perfect for puzzles
- **Lisa**: Powerful AoE Electro attacks

### Core Mechanics Explained
1. **Elemental Combos**: Mix elements for powerful reactions
2. **Resin**: Your daily resource for farming
3. **Adventure Rank**: Unlocks more content as you progress
4. **Weapons & Artifacts**: Gear your characters properly

## Tips for New Players

- Don't skip the main story!
- Explore everything - hidden chests everywhere
- Resin refreshes daily, don't let it cap
- Build a balanced team with different elements
- Save your Primogems for limited banners

Happy travels, Traveler!`,
        read_time: 15,
        seo_title: 'Genshin Impact Beginner Guide 2024 - GameHub',
        seo_description: 'Complete guide for new players to Genshin Impact with tips and tricks',
        seo_keywords: ['Genshin Impact', 'guide', 'beginners', 'tips'],
        view_count: 15420,
        share_count: 867,
        published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    }),
    db.article.create({
      data: {
        slug: 'elden-ring-beginners-guide',
        title: 'Elden Ring: Complete Beginner\'s Guide',
        article_type: 'guide',
        status: 'published',
        source_type: 'ai',
        source_urls: [],
        game_id: games[2].id,
        author_id: testUser.id,
        cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2l4k.jpg',
        cover_alt: 'Elden Ring Guide',
        excerpt: 'Everything you need to know to survive the Lands Between.',
        content: `# Elden Ring Beginner's Guide

Welcome to the Lands Between! This guide will help you get started.

## Getting Started

### Choosing Your Class
- **Vagabond**: Balanced starter with good melee
- **Samurai**: Fast katana attacks
- **Astrologer**: Strong sorcery build
- **Prophet**: Faith-based incantations
- **Wretch**: No preset build - for veterans

### Core Survival Tips
1. Level up VIGOR first - health is crucial
2. Don't be afraid to run away
3. Use Torrent for quick escapes
4. Find maps early in each region
5. Upgrade your weapons immediately

## Beginner's Checklist

- Get the Spirit Calling Bell from Renna
- Visit Roundtable Hold early
- Collect Map Fragments first in each region
- Don't miss the Golden Seeds for more flasks

Good luck, Tarnished!`,
        read_time: 12,
        seo_title: 'Elden Ring Beginner\'s Guide - GameHub',
        seo_description: 'Complete guide for new players to Elden Ring',
        seo_keywords: ['Elden Ring', 'guide', 'beginners', 'tips'],
        view_count: 18760,
        share_count: 1234,
        published_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      },
    }),
    db.article.create({
      data: {
        slug: 'valorant-agent-tier-list-2024',
        title: 'Valorant Agent Tier List 2024 (Meta Updated)',
        article_type: 'tierlist',
        status: 'published',
        source_type: 'ai',
        source_urls: [],
        game_id: games[4].id,
        author_id: testUser.id,
        cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co3f8k.jpg',
        cover_alt: 'Valorant Tier List',
        excerpt: 'Best agents to main in current meta for ranked play.',
        content: `# Valorant Agent Tier List 2024

Current meta tier list for competitive play.

## S-Tier (Must Play)
- **Jett**: Most flexible duelist, great for any map
- **Chamber**: Op king with powerful utility
- **Sova**: Best initiator with recon arrows
- **Sage**: Essential healer with great wall utility
- **Killjoy**: Best sentinel for holding sites

## A-Tier (Strong Picks)
- **Reyna**: Great on pistol rounds
- **Phoenix**: Aggressive playstyle
- **Skye**: Versatile initiator
- **Cypher**: Great for information
- **Breach**: Strong site takes

## B-Tier (Situational)
- **Raze**: Map-specific explosives
- **Yoru**: Undercover plays
- **Fade**: Good for recon
- **Neon**: High speed gameplay

Best of luck in your ranked games!`,
        read_time: 8,
        seo_title: 'Valorant Agent Tier List 2024 - GameHub',
        seo_description: 'Best agents for ranked play in current meta',
        seo_keywords: ['Valorant', 'tier list', 'agents', 'meta'],
        view_count: 22340,
        share_count: 2567,
        published_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
    }),
    db.article.create({
      data: {
        slug: 'zelda-botw-secrets',
        title: '15 Hidden Secrets in Breath of the Wild',
        article_type: 'guide',
        status: 'published',
        source_type: 'ai',
        source_urls: [],
        game_id: games[1].id,
        author_id: testUser.id,
        cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.jpg',
        cover_alt: 'Zelda BotW Secrets',
        excerpt: 'Discover hidden locations and secrets you might have missed in Hyrule.',
        content: `# 15 Hidden Secrets in Breath of the Wild

Hyrule is full of mysteries! Here are secrets you might have missed.

## The Lord of the Mountain
Satori Mountain is home to the mystical Lord of the Mountain. Visit on nights with a blood moon!

## The Secret Chest
On the Great Plateau, there's a hidden chest under a rock near the Shrine of Resurrection.

## Ancient Horse Armor
You can find ancient horse armor in the Akkala region that makes your horse look futuristic!

## The Forgotten Temple
Deep in the Hebra region lies a massive forgotten temple with a powerful shrine inside.

## Kilton the Monster Vendor
Find Kilton around Hyrule's forests - he sells monster masks and special gear!

## And Many More
There are 10 more secrets waiting for you to discover in Hyrule!

Happy adventuring!`,
        read_time: 9,
        seo_title: 'Breath of the Wild Secrets - GameHub',
        seo_description: '15 hidden secrets in Zelda: Breath of the Wild',
        seo_keywords: ['Zelda', 'Breath of the Wild', 'secrets', 'guide'],
        view_count: 12876,
        share_count: 945,
        published_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
      },
    }),
    db.article.create({
      data: {
        slug: 'cyberpunk-2077-phantom-liberty-guide',
        title: 'Cyberpunk 2077: Phantom Liberty Complete Guide',
        article_type: 'guide',
        status: 'published',
        source_type: 'ai',
        source_urls: [],
        game_id: games[3].id,
        author_id: testUser.id,
        cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2m3y.jpg',
        cover_alt: 'Cyberpunk 2077 Guide',
        excerpt: 'Complete walkthrough of the Phantom Liberty expansion.',
        content: `# Cyberpunk 2077: Phantom Liberty Complete Guide

Everything you need to know about the new expansion.

## What's New in Phantom Liberty

- **New District**: Dogtown - a lawless area inside Night City
- **New Story**: Espionage thriller with Idris Elba as Solomon Reed
- **New Relic Skills**: Overpowered cyberware upgrades
- **New Ending**: Alternate conclusion to Cyberpunk's story

## Key Tips for Dogtown

- Don't go there early - enemies are tough!
- Get the new Militech weapons
- Complete all gigs for exclusive rewards
- The new Relic tree changes gameplay drastically

## Best New Builds

- **Netrunner 2.0**: Enhanced quickhacks
- **Solo Berserker**: Melee focused build
- **Solo Netrunner**: Mix of quickhacks and weapons

Welcome to Dogtown, choom!`,
        read_time: 11,
        seo_title: 'Cyberpunk 2077 Phantom Liberty Guide - GameHub',
        seo_description: 'Complete guide to Phantom Liberty expansion',
        seo_keywords: ['Cyberpunk 2077', 'Phantom Liberty', 'guide', 'tips'],
        view_count: 8765,
        share_count: 567,
        published_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
    }),
    db.article.create({
      data: {
        slug: 'league-of-legends-jungle-guide',
        title: 'League of Legends: Complete Jungle Clear Guide',
        article_type: 'guide',
        status: 'published',
        source_type: 'ai',
        source_urls: [],
        game_id: games[5].id,
        author_id: testUser.id,
        cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co3j2e.jpg',
        cover_alt: 'League of Legends Guide',
        excerpt: 'Master jungle pathing and ganking mechanics.',
        content: `# League of Legends: Complete Jungle Guide

Learn how to jungle like a pro!

## What Junglers Do
- Clear camps efficiently
- Gank lanes for advantages
- Control objectives (Dragon, Baron, Herald)
- Provide vision control

## Optimal Clear Paths

### Full Clear (Blue Side)
1. Blue → Gromp → Wolves → Raptors → Red → Krugs → Scuttle

### Full Clear (Red Side)
1. Red → Krugs → Raptors → Wolves → Blue → Gromp → Scuttle

## Best Junglers 2024
- **Lee Sin**: Most flexible pick
- **Elise**: Fast clears and strong ganks
- **Viego**: Snowballs off kills
- **Jarvan IV**: Great CC and gap closure
- **Evelynn**: Invisible late-game terror

Time to hit the jungle!`,
        read_time: 14,
        seo_title: 'League of Legends Jungle Guide - GameHub',
        seo_description: 'Master jungling in LoL',
        seo_keywords: ['League of Legends', 'jungle', 'guide', 'pathing'],
        view_count: 11234,
        share_count: 789,
        published_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
    }),
    db.article.create({
      data: {
        slug: 'stardew-valley-farming-guide',
        title: 'Stardew Valley: Ultimate Farming Guide',
        article_type: 'guide',
        status: 'published',
        source_type: 'ai',
        source_urls: [],
        game_id: games[8].id,
        author_id: testUser.id,
        cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co383v.jpg',
        cover_alt: 'Stardew Valley Guide',
        excerpt: 'Maximize profits on your farm with these tips.',
        content: `# Stardew Valley: Ultimate Farming Guide

Build the most profitable farm possible!

## Best Crops by Season

### Spring
- **Strawberries**: Best profit in Spring
- **Cauliflower**: Great for early game
- **Rhubarb**: Good if you started in Year 2

### Summer
- **Blueberries**: Multiple harvests
- **Starfruit**: Highest value per crop
- **Corn**: Good for fall transition

### Fall
- **Pumpkins**: Most valuable
- **Cranberries**: Consistent income
- **Eggplant**: Good for artisan goods

## Tips for Success

- Focus on quality over quantity
- Build sprinklers ASAP
- Don't ignore the greenhouse
- Check the Traveling Cart weekly

Happy farming!`,
        read_time: 10,
        seo_title: 'Stardew Valley Farming Guide - GameHub',
        seo_description: 'Maximize farm profits',
        seo_keywords: ['Stardew Valley', 'farming', 'guide', 'crops'],
        view_count: 9432,
        share_count: 678,
        published_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
      },
    }),
    db.article.create({
      data: {
        slug: 'fortnite-chapter-5-tips',
        title: 'Fortnite Chapter 5: Pro Tips and Tricks',
        article_type: 'guide',
        status: 'published',
        source_type: 'ai',
        source_urls: [],
        game_id: games[6].id,
        author_id: testUser.id,
        cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co3f9v.jpg',
        cover_alt: 'Fortnite Guide',
        excerpt: 'Win more games with these pro strategies.',
        content: `# Fortnite Chapter 5: Pro Tips and Tricks

Dominate the new chapter!

## What's New in Chapter 5

- **New Map**: Completely redesigned island
- **Movement Changes**: Smoother mechanics
- **New Weapons**: Fresh meta picks
- **New Modes**: Fresh ways to play

## Pro Strategies

### Build Fighting
- Build upwards first for high ground
- Edit quickly to outmaneuver
- Practice 90s and edits in Creative

### Weapons Meta
- **Assault Rifle**: Most versatile
- **SMG**: Close quarters
- **Sniper**: Long-range eliminations
- **Shotgun**: Still essential for builds

## Quick Tips

- Learn the new map quickly
- Use vehicles for rotation
- Don't forget to heal in fights
- Always carry building materials

Let's go get that Victory Royale!`,
        read_time: 7,
        seo_title: 'Fortnite Chapter 5 Guide - GameHub',
        seo_description: 'Pro tips and tricks for Chapter 5',
        seo_keywords: ['Fortnite', 'tips', 'guide', 'Chapter 5'],
        view_count: 14567,
        share_count: 1345,
        published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    }),
    db.article.create({
      data: {
        slug: 'dark-souls-3-beginner-tips',
        title: 'Dark Souls 3: 20 Tips for New Players',
        article_type: 'guide',
        status: 'published',
        source_type: 'ai',
        source_urls: [],
        game_id: games[10].id,
        author_id: testUser.id,
        cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2j1k.jpg',
        cover_alt: 'Dark Souls 3 Guide',
        excerpt: 'Make your first playthrough smoother.',
        content: `# Dark Souls 3: 20 Tips for New Players

Don't die... well, at least less!

## 20 Essential Tips

1. Level Vitality first - health saves lives
2. Master dodging (i-frames!)
3. Keep your shield up when unsure
4. Use a simple weapon first like a Longsword
5. Spend souls frequently
6. Light a bonfire at every opportunity
7. Don't skip NPC quests
8. Pay attention to enemy attack patterns
9. Try different weapon types
10. NPC summons can help
11. Use estus flasks wisely
12. Explore off the beaten path
13. Learn your weapon moveset
14. Upgrade weapons, not armor early
15. Pay attention to your stamina bar
16. Some enemies can be parried
17. Backstabs deal massive damage
18. Don't rage quit - take breaks
19. Listen to NPC dialogue for clues
20. Git gud!

You got this, Ashen One!`,
        read_time: 8,
        seo_title: 'Dark Souls 3 Beginner Tips - GameHub',
        seo_description: 'Tips for new players to DS3',
        seo_keywords: ['Dark Souls 3', 'tips', 'guide', 'beginners'],
        view_count: 7890,
        share_count: 456,
        published_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      },
    }),
    db.article.create({
      data: {
        slug: 'baldurs-gate-3-builds',
        title: 'Baldur\'s Gate 3: Best Builds for Every Class',
        article_type: 'guide',
        status: 'published',
        source_type: 'ai',
        source_urls: [],
        game_id: games[12].id,
        author_id: testUser.id,
        cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co319m.jpg',
        cover_alt: 'Baldur\'s Gate 3 Guide',
        excerpt: 'Optimal builds for every class in BG3.',
        content: `# Baldur's Gate 3: Best Builds for Every Class

Create overpowered characters!

## Best Builds

### Fighter - Battle Master
- **Battlemaster subclass for maneuvers**
- **Great Weapon Fighting style**
- **Polearm Master feats**
- **Alert for initiative advantage**

### Wizard - Evocation
- **Evocation subclass**
- **Scorching Ray and Fireball spells**
- **Spell Sniper feat**
- **War Caster for concentration**

### Rogue - Arcane Trickster
- **Arcane Trickster subclass**
- **Expertise in Stealth and Sleight of Hand**
- **Magic initiate for more cantrips**
- **Alert feat**

### Cleric - Life Domain
- **Life for healing focus**
- **Warcaster**
- **Healer feat**
- **Tough for more HP**

Go forth and adventure!`,
        read_time: 13,
        seo_title: 'Baldur\'s Gate 3 Best Builds - GameHub',
        seo_description: 'Optimal class builds for BG3',
        seo_keywords: ['Baldur\'s Gate 3', 'builds', 'guide', 'classes'],
        view_count: 16789,
        share_count: 987,
        published_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      },
    }),
    db.article.create({
      data: {
        slug: 'hogwarts-legacy-all-spells',
        title: 'Hogwarts Legacy: All Spells and How to Unlock Them',
        article_type: 'guide',
        status: 'published',
        source_type: 'ai',
        source_urls: [],
        game_id: games[11].id,
        author_id: testUser.id,
        cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co4g5m.jpg',
        cover_alt: 'Hogwarts Legacy Guide',
        excerpt: 'Complete spell list and unlock requirements.',
        content: `# Hogwarts Legacy: All Spells Guide

Master every spell in the wizarding world!

## Essential Combat Spells
- **Expelliarmus**: Disarm opponents
- **Confringo**: Fire damage
- **Stupefy**: Stun enemies
- **Avada Kedavra**: Instant kill (unlocked later)
- **Imperio**: Control enemies

## Utility Spells
- **Wingardium Leviosa**: Levitate objects
- **Reparo**: Repair broken items
- **Revelio**: Reveal hidden things
- **Accio**: Pull things to you
- **Depulso**: Push things away

## Unlock Conditions
- Complete main story assignments
- Learn from Professors
- Do side quests
- Some spells are story-locked

Get ready to cast some magic!`,
        read_time: 9,
        seo_title: 'Hogwarts Legacy Spells Guide - GameHub',
        seo_description: 'All spells and how to unlock them',
        seo_keywords: ['Hogwarts Legacy', 'spells', 'guide', 'list'],
        view_count: 13456,
        share_count: 876,
        published_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      },
    }),
    db.article.create({
      data: {
        slug: 'minecraft-redstone-basics',
        title: 'Minecraft: Redstone Basics for Beginners',
        article_type: 'guide',
        status: 'published',
        source_type: 'ai',
        source_urls: [],
        game_id: games[7].id,
        author_id: testUser.id,
        cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co4k5s.jpg',
        cover_alt: 'Minecraft Guide',
        excerpt: 'Learn the basics of redstone contraptions.',
        content: `# Minecraft: Redstone Basics for Beginners

Build amazing contraptions!

## What is Redstone?
Redstone is Minecraft's version of electricity that can power contraptions, doors, and more!

## Essential Components
- **Redstone Dust**: Wires
- **Redstone Torch**: Power source
- **Repeaters**: Extend signal and delay
- **Pistons**: Push blocks
- **Observers**: Detect changes
- **Hoppers**: Transport items

## Simple Starter Ideas
1. **Automatic Door**: Open when you approach
2. **Lights**: Light up your base
3. **Farms**: Auto-harvest your crops
4. **Storage Sorting**: Organize items

## Pro Tips
- Practice in Creative mode first
- Watch tutorials for inspiration
- Keep circuits simple initially
- Debug one part at a time

Time to create something amazing!`,
        read_time: 10,
        seo_title: 'Minecraft Redstone Guide - GameHub',
        seo_description: 'Redstone basics for beginners',
        seo_keywords: ['Minecraft', 'redstone', 'guide', 'contraptions'],
        view_count: 15678,
        share_count: 1098,
        published_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
    }),
    db.article.create({
      data: {
        slug: 'hollow-knight-map-guide',
        title: 'Hollow Knight: Complete Map and Collectibles',
        article_type: 'guide',
        status: 'published',
        source_type: 'ai',
        source_urls: [],
        game_id: games[13].id,
        author_id: testUser.id,
        cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co383w.jpg',
        cover_alt: 'Hollow Knight Guide',
        excerpt: 'Find every collectible in Hallownest.',
        content: `# Hollow Knight: Complete Map Guide

Find every secret in Hallownest!

## Key Areas to Explore
1. **Forgotten Crossroads**: Starting area
2. **Greenpath**: Lush and relaxing
3. **Fungal Wastes**: Mushroom-filled lands
4. **City of Tears**: Beautiful ruined city
5. **Deepnest**: Spooky and dangerous
6. **Crystal Peak**: Beautiful crystals

## Collectibles Checklist
- **Charm Notches**: 11 total
- **Pale Ore**: 6 pieces for upgrades
- **Geo Caches**: Hidden around the map
- **Grubs**: Rescue all 46!
- **Bosses**: 30+ to defeat

## Exploration Tips
- Buy maps from Cornifer as early as possible
- Use the Dreamnail for secret areas
- Don't forget about the Howling Cliffs
- The Abyss has some powerful upgrades

Descend into the depths!`,
        read_time: 11,
        seo_title: 'Hollow Knight Map Guide - GameHub',
        seo_description: 'Complete map and collectibles',
        seo_keywords: ['Hollow Knight', 'guide', 'map', 'collectibles'],
        view_count: 6543,
        share_count: 432,
        published_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    }),
    db.article.create({
      data: {
        slug: 'persona-5-royal-confidants',
        title: 'Persona 5 Royal: Best Confidant Guide',
        article_type: 'guide',
        status: 'published',
        source_type: 'ai',
        source_urls: [],
        game_id: games[14].id,
        author_id: testUser.id,
        cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2m3z.jpg',
        cover_alt: 'Persona 5 Royal Guide',
        excerpt: 'Optimal confidant ranking order.',
        content: `# Persona 5 Royal: Best Confidant Guide

Max out your social links perfectly!

## Confidants to Prioritize

### High Priority
- **Futaba (Hermit)**: Unlocks third-eye skills
- **Makoto (Priestess)**: Great bonuses in battle
- **Kawakami (Temperance)**: Time management
- **Yoshida (Sun)**: Money and negotiation

### Medium Priority
- **Chihaya (Fortune)**: Luck and bonuses
- **Iwai (Hanged Man)**: Gun customization
- **Takemi (Death)**: Medical supplies

## Time Management Tips
- Use Kawakami's services to save time
- Prioritize confidants that unlock abilities
- Read books in free time
- Do certain activities on specific days

Take your heart!`,
        read_time: 12,
        seo_title: 'Persona 5 Royal Confidant Guide - GameHub',
        seo_description: 'Best confidant ranking order',
        seo_keywords: ['Persona 5 Royal', 'confidants', 'guide', 'links'],
        view_count: 10234,
        share_count: 765,
        published_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      },
    }),
    db.article.create({
      data: {
        slug: 'god-of-war-ragnarok-complete-story',
        title: 'God of War Ragnarök: Complete Story Analysis',
        article_type: 'news',
        status: 'published',
        source_type: 'ai',
        source_urls: [],
        game_id: games[9].id,
        author_id: testUser.id,
        cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co3m69.jpg',
        cover_alt: 'God of War Ragnarok Analysis',
        excerpt: 'Complete breakdown of the entire story (Spoiler Warning!).',
        content: `# God of War Ragnarök: Complete Story Analysis

SPOILER WARNING! This article contains major spoilers for God of War Ragnarök.

## The Beginning
Ragnarök begins right where the previous game ended. Atreus is older and seeking answers about his true identity.

## Key Plot Points
1. **Visit to Asgard**: The family goes to Asgard despite warnings
2. **Brok's Fate**: Heartbreaking developments early on
3. **Ragnarök Begins**: The battle of all battles commences
4. **Character Growth**: Both Kratos and Atreus mature emotionally
5. **The Finale**: Satisfying conclusion to the Norse saga

## Themes Explored
- **Fatherhood**: Kratos' journey from anger to love
- **Fate vs. Choice**: Characters fight their predestined futures
- **Growth**: From monster to hero
- **Family**: The power of bonds

This is truly a masterpiece of storytelling in gaming.`,
        read_time: 16,
        seo_title: 'God of War Ragnarök Story Analysis - GameHub',
        seo_description: 'Complete breakdown of the story',
        seo_keywords: ['God of War Ragnarök', 'story', 'analysis', 'spoilers'],
        view_count: 18901,
        share_count: 1456,
        published_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    }),
  ]);
  console.log('✅ Created', articles.length, 'high-quality guides');

  // Create extensive game codes - 35 codes across games
  const codes = await Promise.all([
    // Genshin Impact Codes
    db.gameCode.create({
      data: { code: 'GENSHINGIFT', game_id: games[0].id, reward_desc: '50 Primogems + 3 Heros Wit', status: 'active', source: 'official', verified_at: new Date() }
    }),
    db.gameCode.create({
      data: { code: 'V320GENSHINGIFT', game_id: games[0].id, reward_desc: '60 Primogems', status: 'active', source: 'twitter', verified_at: new Date() }
    }),
    db.gameCode.create({
      data: { code: 'PRIMOGEMS2024', game_id: games[0].id, reward_desc: '100 Primogems', status: 'active', source: 'official', verified_at: new Date() }
    }),
    db.gameCode.create({
      data: { code: 'GENSHIN2024', game_id: games[0].id, reward_desc: '30 Primogems + 50000 Mora', status: 'active', source: 'reddit', verified_at: new Date() }
    }),
    db.gameCode.create({
      data: { code: 'BIRTHDAY', game_id: games[0].id, reward_desc: 'Special Birthday Rewards', status: 'active', source: 'official', verified_at: new Date() }
    }),

    // Elden Ring Codes
    db.gameCode.create({
      data: { code: 'ELDENRING2024', game_id: games[2].id, reward_desc: 'Digital Artbook', status: 'active', source: 'official', verified_at: new Date() }
    }),
    db.gameCode.create({
      data: { code: 'TARNISHED', game_id: games[2].id, reward_desc: 'Starting Items Pack', status: 'active', source: 'reddit', verified_at: new Date() }
    }),
    db.gameCode.create({
      data: { code: 'LANDSBETWEEN', game_id: games[2].id, reward_desc: 'Rune Bundle', status: 'active', source: 'twitter', verified_at: new Date() }
    }),

    // Valorant Codes
    db.gameCode.create({
      data: { code: 'VALORANT2024', game_id: games[4].id, reward_desc: 'Free Player Card', status: 'active', source: 'official', verified_at: new Date() }
    }),
    db.gameCode.create({
      data: { code: 'PLAYVALORANT', game_id: games[4].id, reward_desc: 'Free Spray', status: 'active', source: 'twitter', verified_at: new Date() }
    }),
    db.gameCode.create({
      data: { code: 'BESTAGENTS', game_id: games[4].id, reward_desc: 'Battle Pass Points', status: 'active', source: 'twitter', verified_at: new Date() }
    }),
    db.gameCode.create({
      data: { code: 'RIOTGAMES', game_id: games[4].id, reward_desc: 'Exclusive Gun Buddy', status: 'active', source: 'official', verified_at: new Date() }
    }),

    // League of Legends Codes
    db.gameCode.create({
      data: { code: 'LEAGUE2024', game_id: games[5].id, reward_desc: 'Free Champion', status: 'active', source: 'official', verified_at: new Date() }
    }),
    db.gameCode.create({
      data: { code: 'RIOTGAMES', game_id: games[5].id, reward_desc: 'Rune Page', status: 'active', source: 'reddit', verified_at: new Date() }
    }),
    db.gameCode.create({
      data: { code: 'SUMMONER', game_id: games[5].id, reward_desc: 'Blue Essence', status: 'active', source: 'twitter', verified_at: new Date() }
    }),
    db.gameCode.create({
      data: { code: 'WORLDS2024', game_id: games[5].id, reward_desc: 'Exclusive Emote', status: 'active', source: 'official', verified_at: new Date() }
    }),

    // Fortnite Codes
    db.gameCode.create({
      data: { code: 'FORTNITE2024', game_id: games[6].id, reward_desc: 'Free Skin', status: 'active', source: 'official', verified_at: new Date() }
    }),
    db.gameCode.create({
      data: { code: 'EPICGAMES', game_id: games[6].id, reward_desc: 'V-Bucks', status: 'active', source: 'twitter', verified_at: new Date() }
    }),
    db.gameCode.create({
      data: { code: 'BATTLEPASS', game_id: games[6].id, reward_desc: 'Battle Pass Discount', status: 'active', source: 'twitter', verified_at: new Date() }
    }),
    db.gameCode.create({
      data: { code: 'CHAPTER5', game_id: games[6].id, reward_desc: 'Seasonal Rewards', status: 'active', source: 'official', verified_at: new Date() }
    }),
    db.gameCode.create({
      data: { code: 'VICTORYROYALE', game_id: games[6].id, reward_desc: 'Free Wrap', status: 'active', source: 'reddit', verified_at: new Date() }
    }),

    // Minecraft Codes
    db.gameCode.create({
      data: { code: 'MINECRAFT', game_id: games[7].id, reward_desc: 'Free Skin Pack', status: 'active', source: 'official', verified_at: new Date() }
    }),
    db.gameCode.create({
      data: { code: 'CREEPER', game_id: games[7].id, reward_desc: 'Exclusive Texture Pack', status: 'active', source: 'reddit', verified_at: new Date() }
    }),

    // Stardew Valley Codes
    db.gameCode.create({
      data: { code: 'STARDEW', game_id: games[8].id, reward_desc: 'Free Mod Pack', status: 'active', source: 'reddit', verified_at: new Date() }
    }),
    db.gameCode.create({
      data: { code: 'FAIRY', game_id: games[8].id, reward_desc: 'Secret Items', status: 'active', source: 'twitter', verified_at: new Date() }
    }),

    // Cyberpunk Codes
    db.gameCode.create({
      data: { code: 'NIGHTCITY', game_id: games[3].id, reward_desc: 'Exclusive Vehicle', status: 'active', source: 'official', verified_at: new Date() }
    }),
    db.gameCode.create({
      data: { code: 'PHANTOM', game_id: games[3].id, reward_desc: 'Dogtown Rewards', status: 'active', source: 'reddit', verified_at: new Date() }
    }),
    db.gameCode.create({
      data: { code: 'CHOOM', game_id: games[3].id, reward_desc: 'Cyberware Pack', status: 'active', source: 'twitter', verified_at: new Date() }
    }),

    // Zelda Codes
    db.gameCode.create({
      data: { code: 'HYRULE', game_id: games[1].id, reward_desc: 'Exclusive Amiibo', status: 'active', source: 'official', verified_at: new Date() }
    }),

    // Dark Souls Codes
    db.gameCode.create({
      data: { code: 'PRAISETHE', game_id: games[10].id, reward_desc: 'Starting Weapons Pack', status: 'active', source: 'reddit', verified_at: new Date() }
    }),

    // Baldur's Gate Codes
    db.gameCode.create({
      data: { code: 'DICE', game_id: games[12].id, reward_desc: 'Digital Soundtrack', status: 'active', source: 'official', verified_at: new Date() }
    }),
    db.gameCode.create({
      data: { code: 'ADVENTURE', game_id: games[12].id, reward_desc: 'Exclusive Equipment', status: 'active', source: 'twitter', verified_at: new Date() }
    }),

    // Hogwarts Legacy Codes
    db.gameCode.create({
      data: { code: 'MAGIC', game_id: games[11].id, reward_desc: 'Exclusive Wand', status: 'active', source: 'official', verified_at: new Date() }
    }),
    db.gameCode.create({
      data: { code: 'WIZARD', game_id: games[11].id, reward_desc: 'House Colors Pack', status: 'active', source: 'twitter', verified_at: new Date() }
    }),

    // Persona Codes
    db.gameCode.create({
      data: { code: 'PERSONA', game_id: games[14].id, reward_desc: 'Costume Pack', status: 'active', source: 'reddit', verified_at: new Date() }
    }),
    db.gameCode.create({
      data: { code: 'JOKER', game_id: games[14].id, reward_desc: 'Exclusive Persona', status: 'active', source: 'official', verified_at: new Date() }
    }),
  ]);
  console.log('✅ Created', codes.length, 'redeem codes');

  console.log('\n🎉 Database seeded successfully with rich content!');
  console.log('\n📊 Complete Summary:');
  console.log('- Users:', 1);
  console.log('- Games:', games.length);
  console.log('- Articles:', articles.length);
  console.log('- Codes:', codes.length);
  console.log('\n🚀 GameHub now has content-rich pages ready for users!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
