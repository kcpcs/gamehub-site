const { PrismaClient } = require('@prisma/client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');
const { ensureAchievements } = require('./achievements.cjs');
require('dotenv').config();

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});
const db = new PrismaClient({ adapter });

const gamesData = [
  {
    slug: 'genshin-impact',
    name: 'Genshin Impact',
    igdb_id: 105416,
    steam_appid: 1446780,
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co4k5r.jpg',
    screenshots: [
      'https://picsum.photos/seed/genshin1/1200/675',
      'https://picsum.photos/seed/genshin2/1200/675'
    ],
    platforms: ['PC', 'PS5', 'PS4', 'Switch', 'Mobile'],
    genres: ['RPG', 'Action', 'Adventure'],
    tags: ['open-world', 'anime', 'fantasy', 'gacha', 'elemental'],
    developer: 'miHoYo',
    publisher: 'miHoYo',
    release_date: new Date('2020-09-28'),
    score_opencritic: 84,
    score_community: 86,
    score_review_count: 2341,
    description: 'Genshin Impact is an open-world action RPG featuring a vast world, elemental combat, and a rich story. Explore the land of Teyvat, meet diverse characters, and uncover the secrets of this mysterious world.',
  },
  {
    slug: 'honkai-star-rail',
    name: 'Honkai: Star Rail',
    igdb_id: 142412,
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6j6l.jpg',
    screenshots: [
      'https://picsum.photos/seed/hsr1/1200/675',
      'https://picsum.photos/seed/hsr2/1200/675'
    ],
    platforms: ['PC', 'PS5', 'Mobile'],
    genres: ['RPG', 'Turn-Based', 'Strategy'],
    tags: ['anime', 'space', 'gacha', 'honkai'],
    developer: 'miHoYo',
    publisher: 'miHoYo',
    release_date: new Date('2023-04-26'),
    score_opencritic: 80,
    score_community: 83,
    score_review_count: 1892,
    description: 'Honkai: Star Rail is a turn-based space fantasy RPG. Ride the Astral Express and explore the vast universe.',
  },
  {
    slug: 'valorant',
    name: 'Valorant',
    igdb_id: 111801,
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co3f8k.jpg',
    screenshots: [
      'https://picsum.photos/seed/valorant1/1200/675',
      'https://picsum.photos/seed/valorant2/1200/675'
    ],
    platforms: ['PC'],
    genres: ['Shooter', 'Tactical', 'FPS'],
    tags: ['fps', 'tactical', 'competitive', 'esports', '5v5'],
    developer: 'Riot Games',
    publisher: 'Riot Games',
    release_date: new Date('2020-06-02'),
    score_opencritic: 83,
    score_community: 88,
    score_review_count: 2341,
    description: 'A 5v5 character-based tactical shooter set in a near-future earth.',
  },
  {
    slug: 'elden-ring',
    name: 'Elden Ring',
    igdb_id: 133347,
    steam_appid: 1245620,
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2l4k.jpg',
    screenshots: [
      'https://picsum.photos/seed/elden1/1200/675',
      'https://picsum.photos/seed/elden2/1200/675'
    ],
    platforms: ['PC', 'PS5', 'Xbox Series', 'PS4', 'Xbox One'],
    genres: ['Action', 'RPG'],
    tags: ['soulsborne', 'open-world', 'fantasy', 'challenging'],
    developer: 'FromSoftware',
    publisher: 'Bandai Namco',
    release_date: new Date('2022-02-25'),
    score_opencritic: 96,
    score_community: 94,
    score_review_count: 876,
    description: 'THE NEW FANTASY ACTION RPG. Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring.',
  },
  {
    slug: 'minecraft',
    name: 'Minecraft',
    igdb_id: 40223,
    steam_appid: 1358090,
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2a5v.jpg',
    screenshots: ['https://picsum.photos/seed/minecraft1/1200/675'],
    platforms: ['PC', 'PS5', 'Xbox Series', 'Switch', 'PS4', 'Xbox One', 'Mobile'],
    genres: ['Sandbox', 'Survival', 'Adventure'],
    tags: ['sandbox', 'creative', 'survival', 'multiplayer', 'blocky'],
    developer: 'Mojang Studios',
    publisher: 'Microsoft',
    release_date: new Date('2011-11-18'),
    score_opencritic: 90,
    score_community: 93,
    score_review_count: 5678,
    description: 'Build anything you can imagine in a blocky, procedurally generated world.',
  },
  {
    slug: 'zelda-tears-of-the-kingdom',
    name: 'The Legend of Zelda: Tears of the Kingdom',
    igdb_id: 229378,
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co485p.jpg',
    screenshots: ['https://picsum.photos/seed/totk1/1200/675'],
    platforms: ['Switch'],
    genres: ['Action', 'Adventure', 'Puzzle'],
    tags: ['nintendo', 'zelda', 'open-world', 'hyrule'],
    developer: 'Nintendo',
    publisher: 'Nintendo',
    release_date: new Date('2023-05-12'),
    score_opencritic: 96,
    score_community: 95,
    score_review_count: 2134,
    description: 'The Legend of Zelda: Tears of the Kingdom is an epic adventure in Hyrule with unprecedented freedom.',
  },
  {
    slug: 'baldurs-gate-3',
    name: 'Baldur\'s Gate 3',
    igdb_id: 144741,
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co319m.jpg',
    screenshots: ['https://picsum.photos/seed/bg3/1200/675'],
    platforms: ['PC', 'PS5', 'Xbox Series'],
    genres: ['RPG', 'Strategy', 'Turn-Based'],
    tags: ['d&d', 'story-rich', 'party-based', 'larian'],
    developer: 'Larian Studios',
    publisher: 'Larian Studios',
    release_date: new Date('2023-08-03'),
    score_opencritic: 97,
    score_community: 96,
    score_review_count: 1234,
    description: 'A story-rich RPG with strategic turn-based combat set in the Dungeons & Dragons universe.',
  },
  {
    slug: 'hades',
    name: 'Hades',
    igdb_id: 38055,
    steam_appid: 1145360,
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1xq8.jpg',
    screenshots: ['https://picsum.photos/seed/hades1/1200/675'],
    platforms: ['PC', 'Switch', 'PS5', 'Xbox Series'],
    genres: ['Roguelike', 'Action', 'Indie'],
    tags: ['roguelike', 'indie', 'mythology', 'greek'],
    developer: 'Supergiant Games',
    publisher: 'Supergiant Games',
    release_date: new Date('2020-09-17'),
    score_opencritic: 90,
    score_community: 94,
    score_review_count: 890,
    description: 'Defy the god of the dead and hack and slash your way out of the Underworld.',
  },
  {
    slug: 'apex-legends',
    name: 'Apex Legends',
    igdb_id: 108909,
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co3g7o.jpg',
    screenshots: ['https://picsum.photos/seed/apex1/1200/675'],
    platforms: ['PC', 'PS5', 'Xbox Series', 'Switch', 'PS4', 'Xbox One'],
    genres: ['Battle Royale', 'Shooter', 'FPS'],
    tags: ['battle royale', 'sci-fi', 'team-based', 'legends'],
    developer: 'Respawn Entertainment',
    publisher: 'EA',
    release_date: new Date('2019-02-04'),
    score_opencritic: 89,
    score_community: 82,
    score_review_count: 1543,
    description: 'Apex Legends is a free-to-play battle royale where legendary characters with powerful abilities team up.',
  },
  {
    slug: 'fortnite',
    name: 'Fortnite',
    igdb_id: 108943,
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co3f9v.jpg',
    screenshots: ['https://picsum.photos/seed/fortnite1/1200/675'],
    platforms: ['PC', 'PS5', 'Xbox Series', 'Switch', 'PS4', 'Xbox One', 'Mobile'],
    genres: ['Battle Royale', 'Shooter', 'Survival'],
    tags: ['battle royale', 'building', 'competitive', 'cartoon'],
    developer: 'Epic Games',
    publisher: 'Epic Games',
    release_date: new Date('2017-07-25'),
    score_opencritic: 81,
    score_community: 74,
    score_review_count: 756,
    description: 'Fortnite is a battle royale with unique building mechanics and ever-changing gameplay. Be the last one standing.',
  },
];

const articlesData = [
  {
    slug: 'how-to-get-primogems-genshin-impact',
    title: 'How to Get Primogems Fast in Genshin Impact',
    article_type: 'guide',
    status: 'published',
    source_type: 'ai',
    excerpt: 'Complete guide to farming Primogems in Genshin Impact - including daily, weekly, and event sources.',
    content: `# How to Get Primogems Fast in Genshin Impact

Primogems are the most valuable currency in Genshin Impact. This guide covers every way to get them!

## Q: How many Primogems can I get for free each month?
A: Free-to-play players can expect around 5,000-6,000 Primogems per month from all sources combined.

## Q: What's the fastest way to farm Primogems?
A: Daily Commissions and Spiral Abyss are the most consistent sources. Don't miss your daily 60 Primogems!

## Daily Sources
- **Daily Commissions**: 60 Primogems per day
- **Daily Check-in**: 10-20 Primogems
- **Resin Usage**: Farm Ley Lines for 20 Primogems per 20 Resin

## Weekly Sources
- **Spiral Abyss**: Up to 600 Primogems per reset
- **Weekly Bosses**: 30-60 Primogems per boss
- **Battle Pass**: 680 Primogems (free track)

## Pro Tips
- Always claim your daily commissions
- Complete Spiral Abyss even if you can't finish all floors
- Don't waste Resin - use it daily
- Save Primogems for limited banners you really want

Happy farming, Traveler!`,
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co4k5r.jpg',
    cover_alt: 'Genshin Impact',
    read_time: 12,
    seo_title: 'How to Get Primogems Fast in Genshin Impact',
    seo_description: 'Complete guide to farming Primogems in Genshin Impact',
    seo_keywords: ['Genshin Impact', 'Primogems', 'guide', 'farming', 'how-to'],
    view_count: 45632,
    share_count: 2345,
    published_at: new Date('2024-05-01T10:00:00Z'),
  },
  {
    slug: 'genshin-impact-character-tier-list',
    title: 'Genshin Impact: Complete Character Tier List 4.5',
    article_type: 'tierlist',
    status: 'published',
    source_type: 'ai',
    excerpt: 'Updated tier list for all Genshin Impact characters in Patch 4.5 - includes ratings and explanations.',
    content: `# Genshin Impact Character Tier List 4.5

Here's our comprehensive tier list for Genshin Impact! Updated for Patch 4.5.

## Q: Who is the best DPS in Genshin Impact?
A: Currently, Neuvillette and Furina are considered top-tier DPS with incredible damage output.

## S Tier - Meta Defining

### Nahida
The Dendro Archon enables every Dendro reaction and provides insane damage buffs. Must-have for any account.

### Furina
Hydro Archon with unmatched AoE damage, team buffs, and healing. The most versatile unit in the game.

## A Tier - Strong Picks

### Raiden Shogun
Consistent Electro damage and energy battery for the team. Still amazing after all these patches.

### Kazuha
Versatile Anemo support with grouping and elemental damage buffs.

Remember - play characters you enjoy! Meta shifts, but fun is forever.`,
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co4k5r.jpg',
    cover_alt: 'Genshin Impact Characters',
    read_time: 10,
    seo_title: 'Genshin Impact Character Tier List 4.5',
    seo_description: 'Updated tier list for all Genshin Impact characters in Patch 4.5',
    seo_keywords: ['Genshin Impact', 'characters', 'tier list', 'guide', '4.5'],
    view_count: 38923,
    share_count: 2134,
    published_at: new Date('2024-05-02T10:00:00Z'),
  },
  {
    slug: 'how-to-start-elden-ring-beginners',
    title: 'How to Start Elden Ring: Complete Beginner Guide',
    article_type: 'guide',
    status: 'published',
    source_type: 'ai',
    excerpt: 'Everything new players need to know to get started in Elden Ring - from class selection to first boss.',
    content: `# How to Start Elden Ring: Complete Beginner Guide

Welcome to the Lands Between! This guide will help you get started on the right foot.

## Q: What class should I pick for my first playthrough?
A: Vagabond is the easiest for beginners - high Vigor and strength, simple to play effectively.

## Q: Is Elden Ring really that hard?
A: It's challenging but fair. Take your time, learn enemy patterns, and don't be afraid to run away!

## Choosing Your Class
- **Vagabond**: High Vigor and Strength - great for beginners
- **Samurai**: Fast katana attacks with high Dexterity
- **Astrologer**: Best for magic builds

## First Steps
1. **Get the crafting kit** from the Church of Elleh
2. **Meet Ranni the Witch** at night for Spirit Ashes
3. **Upgrade your weapon** at the Roundtable Hold
4. **Don't fight Margit yet** - explore first!

## Essential Tips
- Explore every corner - you'll find useful items
- Level Vigor to at least 40 before late game
- Use Spirit Ashes for extra help with bosses
- Don't be afraid to run away and come back later

The Lands Between is dangerous but rewarding. Take your time and enjoy the journey!`,
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2l4k.jpg',
    cover_alt: 'Elden Ring',
    read_time: 12,
    seo_title: 'How to Start Elden Ring: Complete Beginner Guide',
    seo_description: 'Everything new players need to know to get started in Elden Ring',
    seo_keywords: ['Elden Ring', 'guide', 'beginners', 'how-to', 'class'],
    view_count: 41234,
    share_count: 2654,
    published_at: new Date('2024-05-03T10:00:00Z'),
  },
  {
    slug: 'valorant-agent-tier-list-2024',
    title: 'Valorant: Complete Agent Tier List 2024',
    article_type: 'tierlist',
    status: 'published',
    source_type: 'ai',
    excerpt: 'Updated agent tier list for Valorant in 2024 - best picks for ranked play.',
    content: `# Valorant Agent Tier List 2024

The Valorant meta is constantly evolving. Here's our current tier list ranking every agent!

## Q: Who is the best Duelist in Valorant?
A: Jett remains the premier duelist with unmatched mobility and playmaking potential.

## Q: Which Sentinel should I main?
A: Killjoy is the best sentinel for site defense with her turret and alarm bots.

## S Tier - Must Pick

### Jett
The best duelist with unmatched mobility and great pick potential.

### Killjoy
Ultimate sentinel for site defense with turret and alarm bots.

## A Tier - Strong Picks

### Raze
Explosive damage dealer with best area denial in the game.

### Sova
Information is power, and Sova provides plenty with drones and recon bolts.

Remember - agent tier lists are guidelines! Pick what you're comfortable with.`,
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co3f8k.jpg',
    cover_alt: 'Valorant Agents',
    read_time: 10,
    seo_title: 'Valorant Agent Tier List 2024',
    seo_description: 'Updated agent tier list for Valorant in 2024',
    seo_keywords: ['Valorant', 'agents', 'tier list', '2024', 'ranked'],
    view_count: 52341,
    share_count: 3123,
    published_at: new Date('2024-05-04T10:00:00Z'),
  },
  {
    slug: 'minecraft-survival-guide-2024',
    title: 'Minecraft: Complete Survival Guide 2024',
    article_type: 'guide',
    status: 'published',
    source_type: 'ai',
    excerpt: 'Master survival mode from your first night to defeating the Ender Dragon.',
    content: `# Minecraft: Complete Survival Guide 2024

From your first night to defeating the Ender Dragon! Here's everything you need to know.

## Q: What's the first thing I should do in Minecraft?
A: Punch trees to get wood, then craft a crafting table and wooden pickaxe immediately.

## Day One Priorities
1. **Collect wood**: Punch trees to get logs
2. **Craft a workbench**: You'll need it for better tools
3. **Make tools**: Pickaxe first, then axe and sword
4. **Find shelter**: Before nightfall
5. **Get coal**: For torches - critical!

## Essential Crafting Recipes
- **Wooden Pickaxe**: 3 wood + 2 stick
- **Furnace**: 8 cobblestone
- **Torches**: 1 coal + 1 stick

## Important Tips
- Always carry a bucket of water - saves you from falls and lava!
- Torches stop mob spawning - light up your base
- Always sleep if you can - resetting the spawn is crucial

Have fun and stay alive!`,
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2a5v.jpg',
    cover_alt: 'Minecraft',
    read_time: 13,
    seo_title: 'Minecraft: Complete Survival Guide 2024',
    seo_description: 'Master survival mode from your first night to defeating the Ender Dragon',
    seo_keywords: ['Minecraft', 'survival', 'guide', 'beginner', '2024'],
    view_count: 52341,
    share_count: 3123,
    published_at: new Date('2024-05-05T10:00:00Z'),
  },
  {
    slug: 'baldurs-gate-3-best-classes',
    title: 'Baldur\'s Gate 3: Best Classes Ranked - Complete Tier List',
    article_type: 'tierlist',
    status: 'published',
    source_type: 'ai',
    excerpt: 'Discover the most powerful classes in BG3 for your first playthrough.',
    content: `# Baldur's Gate 3: Best Classes Ranked - Complete Tier List

Baldur's Gate 3 features 12 unique classes. Here's how they stack up!

## Q: What's the easiest class for beginners?
A: Paladin is the easiest - great survivability and simple to play effectively.

## Q: What class has the best story?
A: Warlock has an incredible story with your patron, plus amazing dialogue options.

## S Tier - Overpowered

### Paladin
The ultimate tank and damage dealer. Smites deal massive damage while Aura of Protection keeps everyone alive.

### Warlock
Eldritch Blast is ridiculously powerful. Invocations make them versatile and fun to play. Great story too!

## A Tier - Strong Picks

### Cleric
Divine domain powers make Clerics essential for any party. Healing and damage.

Remember - play what you find fun! BG3 is all about roleplaying.`,
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co319m.jpg',
    cover_alt: 'Baldur\'s Gate 3',
    read_time: 10,
    seo_title: 'Baldur\'s Gate 3: Best Classes Ranked',
    seo_description: 'Discover the most powerful classes in BG3 for your first playthrough',
    seo_keywords: ['Baldur\'s Gate 3', 'classes', 'tier list', 'guide'],
    view_count: 37654,
    share_count: 2134,
    published_at: new Date('2024-05-06T10:00:00Z'),
  },
];

const codesData = [
  { code: 'GENSHINGIFT', reward_desc: '50 Primogems + 3 Hero Wit', source: 'official', status: 'active' },
  { code: 'VAULT7X', reward_desc: '100 Primogems + 50,000 Mora', source: 'official', status: 'active' },
  { code: 'NA88ANANTL9Y', reward_desc: '30 Primogems + 5 Adventurer Experience', source: 'reddit', status: 'active' },
  { code: 'STARRAILGIFT', reward_desc: '50 Stellar Jade + 10,000 Credits', source: 'official', status: 'active' },
  { code: 'HSRVER20', reward_desc: '60 Stellar Jade + 3 Traveler Guides', source: 'twitter', status: 'active' },
  { code: 'VALORANT2024', reward_desc: 'Free Player Card: Sunset', source: 'official', status: 'active' },
  { code: 'PLAYVALORANT', reward_desc: 'Free Spray: V CT', source: 'twitter', status: 'active' },
  { code: 'FORTNITE24', reward_desc: 'Free Skin: Spectra Knight', source: 'official', status: 'active' },
  { code: 'MINECRAFT', reward_desc: 'Free Skin Pack: Legends', source: 'official', status: 'active' },
  { code: 'ELDEN-RING-2024', reward_desc: 'Free Rune Pack', source: 'official', status: 'active' },
];

const tierListsData = [
  {
    category: 'character',
    patch_version: '8.11',
    is_community: false,
    entries: [
      { name: 'Jett', image_url: 'https://picsum.photos/seed/jett/100/100', grade: 'S', avg_score: 4.8, vote_count: 1542, description: 'Best duelist with unmatched mobility' },
      { name: 'Killjoy', image_url: 'https://picsum.photos/seed/kj/100/100', grade: 'S', avg_score: 4.7, vote_count: 1432, description: 'Ultimate sentinel for site defense' },
      { name: 'Omen', image_url: 'https://picsum.photos/seed/omen/100/100', grade: 'S', avg_score: 4.6, vote_count: 1321, description: 'Best controller with great smokes' },
      { name: 'Raze', image_url: 'https://picsum.photos/seed/raze/100/100', grade: 'A', avg_score: 4.3, vote_count: 1211, description: 'Explosive damage dealer' },
      { name: 'Sova', image_url: 'https://picsum.photos/seed/sova/100/100', grade: 'A', avg_score: 4.2, vote_count: 1105, description: 'Information gatherer with recon' },
    ],
  },
  {
    category: 'character',
    patch_version: '4.5',
    is_community: false,
    entries: [
      { name: 'Furina', image_url: 'https://picsum.photos/seed/furina/100/100', grade: 'S', avg_score: 4.9, vote_count: 3421, description: 'Hydro Archon - the most versatile unit' },
      { name: 'Nahida', image_url: 'https://picsum.photos/seed/nahida/100/100', grade: 'S', avg_score: 4.8, vote_count: 3211, description: 'Dendro Archon - enables all reactions' },
      { name: 'Neuvillette', image_url: 'https://picsum.photos/seed/neuvillette/100/100', grade: 'S', avg_score: 4.7, vote_count: 2987, description: 'Top tier DPS with incredible damage' },
      { name: 'Raiden Shogun', image_url: 'https://picsum.photos/seed/raiden/100/100', grade: 'A', avg_score: 4.5, vote_count: 2765, description: 'Consistent Electro damage and battery' },
    ],
  },
];

async function seed() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data (in correct order to avoid foreign key errors)
  console.log('🗑️  Clearing existing data...');
  // Start with tables that have no dependencies
  try { await db.tierEntry.deleteMany(); } catch(e) {}
  try { await db.tierVote.deleteMany(); } catch(e) {}
  try { await db.tierList.deleteMany(); } catch(e) {}
  try { await db.gameCode.deleteMany(); } catch(e) {}
  try { await db.comment.deleteMany(); } catch(e) {}
  try { await db.like.deleteMany(); } catch(e) {}
  try { await db.favorite.deleteMany(); } catch(e) {}
  try { await db.article.deleteMany(); } catch(e) {}
  try { await db.game.deleteMany(); } catch(e) {}
  try { await db.user.deleteMany(); } catch(e) {}
  try { await db.auditLog.deleteMany(); } catch(e) {}
  try { await db.adminUser.deleteMany(); } catch(e) {}
  try { await db.adminRole.deleteMany(); } catch(e) {}
  try { await db.aIActivityLog.deleteMany(); } catch(e) {}
  try { await db.aIStats.deleteMany(); } catch(e) {}
  try { await db.aIBehaviorConfig.deleteMany(); } catch(e) {}
  try { await db.aIPlayer.deleteMany(); } catch(e) {}
  try { await db.subscriber.deleteMany(); } catch(e) {}
  try { await db.systemSetting.deleteMany(); } catch(e) {}
  try { await db.affiliateClick.deleteMany(); } catch(e) {}
  try { await db.pointTransaction.deleteMany(); } catch(e) {}
  console.log('✅ Data cleared!');

  // Create games
  const createdGames = [];
  for (const game of gamesData) {
    const createdGame = await db.game.create({ 
      data: {
        ...game,
        screenshots: JSON.stringify(game.screenshots || []),
        platforms: JSON.stringify(game.platforms || []),
        genres: JSON.stringify(game.genres || []),
        tags: JSON.stringify(game.tags || []),
        guide_count: 0,
        code_count: 0,
        has_tier_list: false,
      } 
    });
    createdGames.push(createdGame);
    console.log(`✅ Created game: ${createdGame.name}`);
  }

  // Create a map from slug to game
  const gameMap = new Map(createdGames.map(g => [g.slug, g]));
  
  // Articles and which games they belong to
  const articleGameSlugs = ['genshin-impact', 'genshin-impact', 'elden-ring', 'valorant', 'minecraft', 'baldurs-gate-3'];
  
  // Create articles
  const createdArticles = [];
  for (let i = 0; i < articlesData.length; i++) {
    const article = articlesData[i];
    const gameSlug = articleGameSlugs[i];
    const game = gameMap.get(gameSlug);
    
    const createdArticle = await db.article.create({
      data: {
        ...article,
        game_id: game.id,
        seo_keywords: JSON.stringify(article.seo_keywords),
        source_urls: JSON.stringify([]),
        affiliate_links: JSON.stringify([]),
      }
    });
    createdArticles.push(createdArticle);
    
    // Update game guide count
    await db.game.update({
      where: { id: game.id },
      data: { guide_count: { increment: 1 } }
    });
    
    console.log(`✅ Created article: ${createdArticle.title}`);
  }

  // Create codes for games
  const codeGameSlugs = ['genshin-impact', 'genshin-impact', 'genshin-impact', 'honkai-star-rail', 'honkai-star-rail', 'valorant', 'valorant', 'fortnite', 'minecraft', 'elden-ring'];
  
  for (let i = 0; i < codesData.length; i++) {
    const code = codesData[i];
    const gameSlug = codeGameSlugs[i];
    const game = gameMap.get(gameSlug);
    
    const createdCode = await db.gameCode.create({
      data: {
        ...code,
        game_id: game.id,
      }
    });
    
    // Update game code count
    await db.game.update({
      where: { id: game.id },
      data: { code_count: { increment: 1 } }
    });
    
    console.log(`✅ Created code: ${createdCode.code} for ${game.name}`);
  }

  // Create tier lists for games
  const tierListGameSlugs = ['valorant', 'genshin-impact'];
  
  for (let i = 0; i < tierListsData.length; i++) {
    const tierListData = tierListsData[i];
    const gameSlug = tierListGameSlugs[i];
    const game = gameMap.get(gameSlug);
    
    // Create tier list and its entries
    const createdTierList = await db.tierList.create({
      data: {
        category: tierListData.category,
        patch_version: tierListData.patch_version,
        is_community: tierListData.is_community,
        game_id: game.id,
        total_votes: tierListData.entries.reduce((sum, entry) => sum + entry.vote_count, 0),
        entries: {
          create: tierListData.entries
        }
      },
      include: { entries: true }
    });
    
    // Update game has_tier_list flag
    await db.game.update({
      where: { id: game.id },
      data: { has_tier_list: true }
    });
    
    console.log(`✅ Created tier list for ${game.name} with ${createdTierList.entries.length} entries`);
  }

  console.log('🎉 Seeding complete!');
  
  console.log('\n🌱 Seeding achievements...');
  const achievementResult = await ensureAchievements();
  console.log(`✅ Achievement seeding complete! Created: ${achievementResult.created}, Existed: ${achievementResult.existed}`);
}

seed()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
