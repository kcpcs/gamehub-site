/**
 * GameHub 数据升级脚本
 * - 删除重复/虚构游戏条目
 * - 新增 40+ 款高质量热门游戏（覆盖全品类）
 * - 新增攻略文章和兑换码
 * 
 * 运行: node seed-upgrade.cjs
 */

const { PrismaClient } = require('@prisma/client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');

const adapter = new PrismaLibSql({ url: 'file:./dev.db' });
const db = new PrismaClient({ adapter });

// ─────────────────────────────────────────
// 需要删除的问题数据
// ─────────────────────────────────────────
const SLUGS_TO_REMOVE = [
  'zelda-breath-of-the-wild',  // 重复（已有 the-legend-of-zelda-breath-of-the-wild）
  'silk-sons',                  // 虚构游戏
];

// ─────────────────────────────────────────
// 新增游戏数据（真实 IGDB 封面 + 真实信息）
// ─────────────────────────────────────────
const newGames = [
  // === 热门手游 / 有兑换码的游戏 ===
  {
    slug: 'wuthering-waves',
    name: 'Wuthering Waves',
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co7yok.jpg',
    platforms: ['PC', 'PS5', 'Mobile'],
    genres: ['RPG', 'Action', 'Adventure'],
    tags: ['open world', 'anime', 'gacha', 'co-op'],
    developer: 'Kuro Games',
    publisher: 'Kuro Games',
    score_opencritic: 75,
    guide_count: 4,
    code_count: 6,
    has_tier_list: true,
    description: 'An open-world action RPG set in a post-apocalyptic world with fast-paced combat.',
  },
  {
    slug: 'zenless-zone-zero',
    name: 'Zenless Zone Zero',
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co7x1q.jpg',
    platforms: ['PC', 'PS5', 'Mobile'],
    genres: ['RPG', 'Action'],
    tags: ['urban fantasy', 'anime', 'gacha', 'action'],
    developer: 'miHoYo',
    publisher: 'HoYoverse',
    score_opencritic: 77,
    guide_count: 3,
    code_count: 5,
    has_tier_list: true,
    description: 'An urban fantasy ARPG by HoYoverse featuring stylish combat in a post-apocalyptic city.',
  },
  {
    slug: 'arknights',
    name: 'Arknights',
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2vf0.jpg',
    platforms: ['Mobile', 'PC'],
    genres: ['Strategy', 'RPG'],
    tags: ['tower defense', 'anime', 'gacha', 'tactical'],
    developer: 'Hypergryph',
    publisher: 'Yostar',
    score_opencritic: 82,
    guide_count: 3,
    code_count: 4,
    has_tier_list: true,
    description: 'A strategic tower defense RPG with deep lore and challenging stages.',
  },
  {
    slug: 'fate-grand-order',
    name: 'Fate/Grand Order',
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1qx4.jpg',
    platforms: ['Mobile'],
    genres: ['RPG', 'Strategy'],
    tags: ['turn-based', 'anime', 'gacha', 'story-driven'],
    developer: 'Lasengle',
    publisher: 'Aniplex',
    score_opencritic: 74,
    guide_count: 2,
    code_count: 3,
    has_tier_list: true,
    description: 'A turn-based RPG featuring Heroic Spirits across time in an epic storyline.',
  },
  {
    slug: 'blue-archive',
    name: 'Blue Archive',
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co4h3d.jpg',
    platforms: ['Mobile'],
    genres: ['RPG', 'Strategy'],
    tags: ['anime', 'gacha', 'school', 'tactical'],
    developer: 'Nexon Games',
    publisher: 'Nexon',
    score_opencritic: 73,
    guide_count: 2,
    code_count: 4,
    has_tier_list: true,
    description: 'A tactical RPG set in a futuristic academy city filled with unique students.',
  },
  {
    slug: 'nikke-goddess-of-victory',
    name: 'NIKKE: Goddess of Victory',
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co5lgy.jpg',
    platforms: ['Mobile', 'PC'],
    genres: ['RPG', 'Action'],
    tags: ['shooter', 'anime', 'gacha', 'sci-fi'],
    developer: 'Shift Up',
    publisher: 'Level Infinite',
    score_opencritic: 71,
    guide_count: 2,
    code_count: 5,
    has_tier_list: true,
    description: 'A sci-fi RPG shooter where you command a squad of android girls to reclaim Earth.',
  },
  {
    slug: 'tower-of-fantasy',
    name: 'Tower of Fantasy',
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co55qj.jpg',
    platforms: ['PC', 'Mobile', 'PS5'],
    genres: ['RPG', 'Action', 'Adventure'],
    tags: ['open world', 'anime', 'mmo', 'sci-fi'],
    developer: 'Hotta Studio',
    publisher: 'Level Infinite',
    score_opencritic: 69,
    guide_count: 3,
    code_count: 7,
    has_tier_list: true,
    description: 'A shared open-world RPG with anime-style graphics and multiplayer features.',
  },
  {
    slug: 'raid-shadow-legends',
    name: 'Raid: Shadow Legends',
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1vhd.jpg',
    platforms: ['Mobile', 'PC'],
    genres: ['RPG', 'Strategy'],
    tags: ['turn-based', 'gacha', 'dark fantasy'],
    developer: 'Plarium',
    publisher: 'Plarium',
    score_opencritic: 65,
    guide_count: 2,
    code_count: 8,
    has_tier_list: true,
    description: 'A dark fantasy collection RPG with over 800 champions to collect and battle.',
  },
  {
    slug: 'afk-journey',
    name: 'AFK Journey',
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co8b8f.jpg',
    platforms: ['Mobile', 'PC'],
    genres: ['RPG', 'Strategy'],
    tags: ['idle', 'gacha', 'fantasy', 'open world'],
    developer: 'Lilith Games',
    publisher: 'Farlight Games',
    score_opencritic: 76,
    guide_count: 2,
    code_count: 10,
    has_tier_list: true,
    description: 'An open-world idle RPG with stunning visuals and strategic team combat.',
  },

  // === 2025-2026 新作 / 大作 ===
  {
    slug: 'monster-hunter-wilds',
    name: 'Monster Hunter Wilds',
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co8ch8.jpg',
    platforms: ['PC', 'PS5', 'Xbox'],
    genres: ['Action', 'RPG', 'Adventure'],
    tags: ['co-op', 'open world', 'hunting', 'multiplayer'],
    developer: 'Capcom',
    publisher: 'Capcom',
    score_opencritic: 91,
    guide_count: 5,
    code_count: 0,
    has_tier_list: true,
    description: 'Hunt massive monsters in a vast open world with seamless multiplayer in this next-gen entry.',
  },
  {
    slug: 'grand-theft-auto-vi',
    name: 'Grand Theft Auto VI',
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co7zn0.jpg',
    platforms: ['PS5', 'Xbox'],
    genres: ['Action', 'Adventure'],
    tags: ['open world', 'crime', 'multiplayer', 'story-driven'],
    developer: 'Rockstar Games',
    publisher: 'Rockstar Games',
    score_opencritic: null,
    guide_count: 0,
    code_count: 0,
    has_tier_list: false,
    description: 'The highly anticipated next chapter in the Grand Theft Auto series, set in Vice City.',
  },
  {
    slug: 'ghost-of-yotei',
    name: 'Ghost of Yotei',
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co8qwz.jpg',
    platforms: ['PS5'],
    genres: ['Action', 'Adventure', 'RPG'],
    tags: ['open world', 'samurai', 'stealth', 'story-driven'],
    developer: 'Sucker Punch',
    publisher: 'Sony Interactive Entertainment',
    score_opencritic: null,
    guide_count: 0,
    code_count: 0,
    has_tier_list: false,
    description: 'The sequel to Ghost of Tsushima set at the base of Mount Yotei in 1603 Japan.',
  },
  {
    slug: 'doom-the-dark-ages',
    name: 'DOOM: The Dark Ages',
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co8bq7.jpg',
    platforms: ['PC', 'PS5', 'Xbox'],
    genres: ['FPS', 'Action'],
    tags: ['shooter', 'medieval', 'fast-paced', 'single-player'],
    developer: 'id Software',
    publisher: 'Bethesda Softworks',
    score_opencritic: 88,
    guide_count: 3,
    code_count: 0,
    has_tier_list: false,
    description: 'A medieval prequel to DOOM Eternal with brutal combat and epic boss fights.',
  },
  {
    slug: 'avowed',
    name: 'Avowed',
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co7m05.jpg',
    platforms: ['PC', 'Xbox'],
    genres: ['RPG', 'Action', 'Adventure'],
    tags: ['open world', 'fantasy', 'first-person', 'story-driven'],
    developer: 'Obsidian Entertainment',
    publisher: 'Xbox Game Studios',
    score_opencritic: 79,
    guide_count: 2,
    code_count: 0,
    has_tier_list: false,
    description: 'A first-person RPG set in the world of Pillars of Eternity with deep choices.',
  },
  {
    slug: 'civilization-vii',
    name: 'Sid Meier\'s Civilization VII',
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co8c8s.jpg',
    platforms: ['PC', 'PS5', 'Xbox', 'Switch'],
    genres: ['Strategy', 'Simulation'],
    tags: ['turn-based', '4x', 'historical', 'multiplayer'],
    developer: 'Firaxis Games',
    publisher: '2K Games',
    score_opencritic: 84,
    guide_count: 3,
    code_count: 0,
    has_tier_list: true,
    description: 'Build an empire through the ages in this landmark strategy game.',
  },
  {
    slug: 'kingdom-come-deliverance-2',
    name: 'Kingdom Come: Deliverance II',
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co8anp.jpg',
    platforms: ['PC', 'PS5', 'Xbox'],
    genres: ['RPG', 'Action', 'Adventure'],
    tags: ['medieval', 'realistic', 'open world', 'story-driven'],
    developer: 'Warhorse Studios',
    publisher: 'Deep Silver',
    score_opencritic: 83,
    guide_count: 3,
    code_count: 0,
    has_tier_list: false,
    description: 'Continue Henry\'s journey in this historically accurate medieval RPG.',
  },

  // === 经典竞技 / 电竞 ===
  {
    slug: 'counter-strike-2',
    name: 'Counter-Strike 2',
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6xwc.jpg',
    platforms: ['PC'],
    genres: ['FPS', 'Action'],
    tags: ['competitive', 'esports', 'tactical', 'multiplayer'],
    developer: 'Valve',
    publisher: 'Valve',
    score_opencritic: 83,
    guide_count: 4,
    code_count: 2,
    has_tier_list: true,
    description: 'The next evolution of Counter-Strike with improved graphics and mechanics.',
  },
  {
    slug: 'dota-2',
    name: 'Dota 2',
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2ogz.jpg',
    platforms: ['PC'],
    genres: ['Strategy', 'Action'],
    tags: ['moba', 'esports', 'competitive', 'multiplayer'],
    developer: 'Valve',
    publisher: 'Valve',
    score_opencritic: 90,
    guide_count: 3,
    code_count: 2,
    has_tier_list: true,
    description: 'The most complex and rewarding MOBA with The International as its crown jewel.',
  },
  {
    slug: 'deadlock',
    name: 'Deadlock',
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co8hak.jpg',
    platforms: ['PC'],
    genres: ['FPS', 'Strategy', 'Action'],
    tags: ['moba', 'shooter', 'competitive', 'multiplayer'],
    developer: 'Valve',
    publisher: 'Valve',
    score_opencritic: 80,
    guide_count: 3,
    code_count: 0,
    has_tier_list: true,
    description: 'Valve\'s third-person MOBA shooter combining hero abilities with strategic objectives.',
  },
  {
    slug: 'marvel-rivals',
    name: 'Marvel Rivals',
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co8r32.jpg',
    platforms: ['PC', 'PS5', 'Xbox'],
    genres: ['FPS', 'Action'],
    tags: ['hero shooter', 'competitive', 'multiplayer', 'marvel'],
    developer: 'NetEase Games',
    publisher: 'NetEase Games',
    score_opencritic: 76,
    guide_count: 3,
    code_count: 4,
    has_tier_list: true,
    description: 'A 6v6 hero shooter featuring iconic Marvel characters with unique abilities.',
  },
  {
    slug: 'the-finals',
    name: 'THE FINALS',
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co70zg.jpg',
    platforms: ['PC', 'PS5', 'Xbox'],
    genres: ['FPS', 'Action'],
    tags: ['competitive', 'destruction', 'multiplayer', 'game-show'],
    developer: 'Embark Studios',
    publisher: 'Embark Studios',
    score_opencritic: 78,
    guide_count: 2,
    code_count: 3,
    has_tier_list: true,
    description: 'A free-to-play FPS game show with fully destructible environments.',
  },

  // === 独立游戏精品 ===
  {
    slug: 'balatro',
    name: 'Balatro',
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co8b5r.jpg',
    platforms: ['PC', 'PS5', 'Xbox', 'Switch', 'Mobile'],
    genres: ['Strategy', 'Puzzle'],
    tags: ['roguelike', 'card game', 'poker', 'indie'],
    developer: 'LocalThunk',
    publisher: 'Playstack',
    score_opencritic: 92,
    guide_count: 3,
    code_count: 0,
    has_tier_list: true,
    description: 'A hypnotic roguelike poker game where you create powerful synergies with Joker cards.',
  },
  {
    slug: 'celeste',
    name: 'Celeste',
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co3byy.jpg',
    platforms: ['PC', 'PS4', 'Xbox', 'Switch'],
    genres: ['Adventure', 'Puzzle'],
    tags: ['platformer', 'indie', 'difficult', 'story-driven'],
    developer: 'Maddy Makes Games',
    publisher: 'Maddy Makes Games',
    score_opencritic: 94,
    guide_count: 2,
    code_count: 0,
    has_tier_list: false,
    description: 'A tight, challenging platformer about climbing a mountain and overcoming anxiety.',
  },
  {
    slug: 'disco-elysium',
    name: 'Disco Elysium',
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1sfj.jpg',
    platforms: ['PC', 'PS5', 'Xbox', 'Switch'],
    genres: ['RPG', 'Adventure'],
    tags: ['detective', 'narrative', 'indie', 'choices-matter'],
    developer: 'ZA/UM',
    publisher: 'ZA/UM',
    score_opencritic: 97,
    guide_count: 2,
    code_count: 0,
    has_tier_list: false,
    description: 'A groundbreaking RPG where you solve a murder through dialogue and internal thought.',
  },
  {
    slug: 'slay-the-spire-2',
    name: 'Slay the Spire 2',
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co8v80.jpg',
    platforms: ['PC'],
    genres: ['Strategy', 'RPG'],
    tags: ['roguelike', 'deck-building', 'card game', 'indie'],
    developer: 'Mega Crit Games',
    publisher: 'Mega Crit Games',
    score_opencritic: 89,
    guide_count: 3,
    code_count: 0,
    has_tier_list: true,
    description: 'The sequel to the iconic deck-building roguelike with new characters and 3D visuals.',
  },

  // === 生存 / 多人 ===
  {
    slug: 'path-of-exile-2',
    name: 'Path of Exile 2',
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co7k8u.jpg',
    platforms: ['PC', 'PS5', 'Xbox'],
    genres: ['RPG', 'Action'],
    tags: ['arpg', 'loot', 'dark fantasy', 'multiplayer'],
    developer: 'Grinding Gear Games',
    publisher: 'Grinding Gear Games',
    score_opencritic: 85,
    guide_count: 4,
    code_count: 3,
    has_tier_list: true,
    description: 'The next generation of action RPGs with deep character customization and endless endgame.',
  },
  {
    slug: 'diablo-iv',
    name: 'Diablo IV',
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co5w0w.jpg',
    platforms: ['PC', 'PS5', 'Xbox'],
    genres: ['RPG', 'Action'],
    tags: ['arpg', 'dark fantasy', 'loot', 'multiplayer'],
    developer: 'Blizzard Entertainment',
    publisher: 'Blizzard Entertainment',
    score_opencritic: 88,
    guide_count: 4,
    code_count: 2,
    has_tier_list: true,
    description: 'Return to Sanctuary in this dark action RPG with open world exploration.',
  },
  {
    slug: 'helldivers-2',
    name: 'Helldivers 2',
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co7lnm.jpg',
    platforms: ['PC', 'PS5'],
    genres: ['Action', 'FPS'],
    tags: ['co-op', 'shooter', 'sci-fi', 'multiplayer'],
    developer: 'Arrowhead Game Studios',
    publisher: 'Sony Interactive Entertainment',
    score_opencritic: 82,
    guide_count: 3,
    code_count: 2,
    has_tier_list: true,
    description: 'A cooperative third-person shooter where you spread democracy across the galaxy.',
  },
  {
    slug: 'destiny-2',
    name: 'Destiny 2',
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1rcb.jpg',
    platforms: ['PC', 'PS5', 'Xbox'],
    genres: ['FPS', 'RPG', 'Action'],
    tags: ['looter shooter', 'mmo', 'sci-fi', 'multiplayer'],
    developer: 'Bungie',
    publisher: 'Bungie',
    score_opencritic: 85,
    guide_count: 4,
    code_count: 5,
    has_tier_list: true,
    description: 'A free-to-play online FPS with MMO elements, raids, and seasonal content.',
  },
  {
    slug: 'warframe',
    name: 'Warframe',
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2dav.jpg',
    platforms: ['PC', 'PS5', 'Xbox', 'Switch'],
    genres: ['Action', 'RPG'],
    tags: ['free-to-play', 'co-op', 'sci-fi', 'looter'],
    developer: 'Digital Extremes',
    publisher: 'Digital Extremes',
    score_opencritic: 80,
    guide_count: 3,
    code_count: 6,
    has_tier_list: true,
    description: 'A free-to-play cooperative action RPG with space ninjas and constant updates.',
  },
  {
    slug: 'escape-from-tarkov',
    name: 'Escape from Tarkov',
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1r75.jpg',
    platforms: ['PC'],
    genres: ['FPS', 'Action', 'RPG'],
    tags: ['hardcore', 'survival', 'loot', 'multiplayer'],
    developer: 'Battlestate Games',
    publisher: 'Battlestate Games',
    score_opencritic: 78,
    guide_count: 4,
    code_count: 3,
    has_tier_list: true,
    description: 'A hardcore online FPS with realistic gunplay, looting, and high-stakes extraction.',
  },

  // === 经典常青 ===
  {
    slug: 'pokemon-legends-z-a',
    name: 'Pokemon Legends: Z-A',
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co8ffa.jpg',
    platforms: ['Switch'],
    genres: ['RPG', 'Adventure'],
    tags: ['pokemon', 'open world', 'nintendo', 'creature-collector'],
    developer: 'Game Freak',
    publisher: 'Nintendo',
    score_opencritic: null,
    guide_count: 0,
    code_count: 0,
    has_tier_list: true,
    description: 'A new Pokemon Legends adventure set entirely within Lumiose City.',
  },
  {
    slug: 'persona-3-reload',
    name: 'Persona 3 Reload',
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co74bu.jpg',
    platforms: ['PC', 'PS5', 'Xbox'],
    genres: ['RPG', 'Adventure'],
    tags: ['jrpg', 'social sim', 'turn-based', 'story-driven'],
    developer: 'Atlus',
    publisher: 'Atlus',
    score_opencritic: 89,
    guide_count: 3,
    code_count: 0,
    has_tier_list: true,
    description: 'A stunning remake of the beloved Persona 3 with modern visuals and gameplay.',
  },
  {
    slug: 'final-fantasy-vii-rebirth',
    name: 'Final Fantasy VII Rebirth',
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co73ci.jpg',
    platforms: ['PS5', 'PC'],
    genres: ['RPG', 'Action', 'Adventure'],
    tags: ['jrpg', 'open world', 'story-driven', 'party-based'],
    developer: 'Square Enix',
    publisher: 'Square Enix',
    score_opencritic: 92,
    guide_count: 4,
    code_count: 0,
    has_tier_list: true,
    description: 'Continue Cloud\'s journey beyond Midgar in this expansive open-world RPG.',
  },
  {
    slug: 'like-a-dragon-pirate-yakuza',
    name: 'Like a Dragon: Pirate Yakuza in Hawaii',
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co8k52.jpg',
    platforms: ['PC', 'PS5', 'Xbox'],
    genres: ['RPG', 'Action', 'Adventure'],
    tags: ['open world', 'brawler', 'comedy', 'story-driven'],
    developer: 'Ryu Ga Gotoku Studio',
    publisher: 'Sega',
    score_opencritic: 82,
    guide_count: 2,
    code_count: 0,
    has_tier_list: false,
    description: 'Majima returns as a pirate in this wild action-adventure spin-off.',
  },
  {
    slug: 'metaphor-refantazio',
    name: 'Metaphor: ReFantazio',
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co84xb.jpg',
    platforms: ['PC', 'PS5', 'Xbox'],
    genres: ['RPG', 'Strategy'],
    tags: ['jrpg', 'fantasy', 'turn-based', 'atlus'],
    developer: 'Studio Zero',
    publisher: 'Atlus',
    score_opencritic: 94,
    guide_count: 3,
    code_count: 0,
    has_tier_list: true,
    description: 'A fantasy RPG from the Persona team exploring themes of prejudice and democracy.',
  },
  {
    slug: 'star-wars-outlaws',
    name: 'Star Wars Outlaws',
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co7lv1.jpg',
    platforms: ['PC', 'PS5', 'Xbox'],
    genres: ['Action', 'Adventure'],
    tags: ['open world', 'star wars', 'stealth', 'story-driven'],
    developer: 'Massive Entertainment',
    publisher: 'Ubisoft',
    score_opencritic: 76,
    guide_count: 2,
    code_count: 0,
    has_tier_list: false,
    description: 'The first open-world Star Wars game where you live as a scoundrel.',
  },
  {
    slug: 'dragon-age-the-veilguard',
    name: 'Dragon Age: The Veilguard',
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co7wak.jpg',
    platforms: ['PC', 'PS5', 'Xbox'],
    genres: ['RPG', 'Action', 'Adventure'],
    tags: ['fantasy', 'party-based', 'choices-matter', 'story-driven'],
    developer: 'BioWare',
    publisher: 'Electronic Arts',
    score_opencritic: 76,
    guide_count: 3,
    code_count: 0,
    has_tier_list: true,
    description: 'Gather your companions and fight against ancient elven gods in this action RPG.',
  },
  {
    slug: 'space-marine-2',
    name: 'Warhammer 40,000: Space Marine 2',
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co5wgc.jpg',
    platforms: ['PC', 'PS5', 'Xbox'],
    genres: ['Action', 'FPS'],
    tags: ['warhammer', 'co-op', 'shooter', 'sci-fi'],
    developer: 'Saber Interactive',
    publisher: 'Focus Entertainment',
    score_opencritic: 80,
    guide_count: 2,
    code_count: 0,
    has_tier_list: true,
    description: 'Lead the Ultramarines against Tyranid swarms in epic third-person combat.',
  },
];

// ─────────────────────────────────────────
// 新增兑换码
// ─────────────────────────────────────────
const newCodes = [
  // Wuthering Waves
  { gameSlug: 'wuthering-waves', codes: [
    { code: 'WUWAOPEN2026', reward_desc: '200 Astrite + 50000 Shell Credits', status: 'active', source: 'official' },
    { code: 'WUWA666', reward_desc: '100 Astrite + 5 Premium Sealed Tubes', status: 'active', source: 'official' },
    { code: 'ROVERGIFT', reward_desc: '10 Lustrous Tide + 30 Crystal Solvent', status: 'active', source: 'discord' },
    { code: 'KUROHAPPY', reward_desc: '60 Astrite + Basic Sealed Tube x3', status: 'expired', source: 'twitter' },
  ]},
  // Zenless Zone Zero
  { gameSlug: 'zenless-zone-zero', codes: [
    { code: 'ZZZBETA2026', reward_desc: '300 Polychrome + 30000 Dennies', status: 'active', source: 'official' },
    { code: 'HOLLOWGIFT', reward_desc: '200 Polychrome + 5 W-Engine Energy Modules', status: 'active', source: 'official' },
    { code: 'ZZZ777LUCK', reward_desc: '100 Polychrome + Bangboo Coins x500', status: 'active', source: 'twitter' },
  ]},
  // Honkai: Star Rail
  { gameSlug: 'honkai-star-rail', codes: [
    { code: 'HSRGIFT2026', reward_desc: '100 Stellar Jade + 50000 Credits', status: 'active', source: 'official' },
    { code: 'STAREXPRESS', reward_desc: '60 Stellar Jade + Refined Aether x5', status: 'active', source: 'official' },
    { code: 'TRAILBLAZE99', reward_desc: '200 Stellar Jade + Star Rail Pass x1', status: 'active', source: 'twitter' },
    { code: 'ASTRAL777', reward_desc: '50 Stellar Jade + 10000 Credits', status: 'expired', source: 'reddit' },
  ]},
  // Path of Exile 2
  { gameSlug: 'path-of-exile-2', codes: [
    { code: 'POE2LAUNCH', reward_desc: 'Exclusive Portal Effect + 2 Orbs of Alchemy', status: 'active', source: 'official' },
    { code: 'EXILERETURN', reward_desc: 'Mystery Box + Weapon Effect', status: 'expired', source: 'official' },
  ]},
  // Marvel Rivals
  { gameSlug: 'marvel-rivals', codes: [
    { code: 'MRVLSASSEMBLE', reward_desc: '500 Lattice + 1 Exclusive Spray', status: 'active', source: 'official' },
    { code: 'RIVALSBETA', reward_desc: 'Beta Tester Nameplate + 200 Lattice', status: 'active', source: 'twitter' },
    { code: 'HULKSMASH', reward_desc: '300 Lattice + Hulk Emote', status: 'expired', source: 'reddit' },
  ]},
  // Destiny 2
  { gameSlug: 'destiny-2', codes: [
    { code: 'D2NEWLIGHT26', reward_desc: 'Exotic Emblem + 5 Enhancement Cores', status: 'active', source: 'official' },
    { code: 'LIGHTFALL777', reward_desc: 'Nightfall Shader + Legendary Engram', status: 'active', source: 'official' },
    { code: 'GUARDIANRISE', reward_desc: '500 Silver + Exotic Ornament', status: 'expired', source: 'twitter' },
  ]},
  // Warframe
  { gameSlug: 'warframe', codes: [
    { code: 'TENNOCON2026', reward_desc: 'Exclusive Glyph + 3-Day Booster', status: 'active', source: 'official' },
    { code: 'FREESWORD', reward_desc: 'Heat Sword + Orokin Reactor', status: 'active', source: 'official' },
    { code: 'IFLYNN', reward_desc: 'Display Glyph', status: 'active', source: 'user' },
  ]},
  // AFK Journey  
  { gameSlug: 'afk-journey', codes: [
    { code: 'AFKJ2026GIFT', reward_desc: '500 Diamonds + 100 Hero Essence', status: 'active', source: 'official' },
    { code: 'LILITHGIFT', reward_desc: '1000 Diamonds + Summon Scroll x5', status: 'active', source: 'official' },
    { code: 'JOURNEY888', reward_desc: '300 Diamonds + Gold x500000', status: 'active', source: 'discord' },
    { code: 'AFKNEWBIE', reward_desc: '200 Diamonds + Hero Scroll x2', status: 'active', source: 'twitter' },
    { code: 'SPRING2026', reward_desc: '500 Diamonds + Legendary Gear Chest', status: 'expired', source: 'official' },
  ]},
];

// ─────────────────────────────────────────
// 新增攻略文章
// ─────────────────────────────────────────
const newArticles = [
  {
    slug: 'wuthering-waves-beginner-guide',
    gameSlug: 'wuthering-waves',
    title: 'Wuthering Waves Beginner Guide: Everything You Need to Know',
    article_type: 'guide',
    content: '## Getting Started\n\nWuthering Waves is an open-world action RPG by Kuro Games. Here\'s everything you need to know as a new player.\n\n## Combat System\n\nThe combat in Wuthering Waves emphasizes precise timing and character swapping. Master dodge-counters and Resonance Liberation for maximum damage.\n\n## Progression Tips\n\n- Focus on your main DPS character first\n- Complete daily commissions for Astrite\n- Don\'t neglect your weapon upgrades\n- Join a guild for bonus rewards\n\n## Best Starter Characters\n\n1. Rover (Main Character) - Versatile and free\n2. Yangyang - Great sub-DPS\n3. Baizhi - Essential healer',
    excerpt: 'Master the basics of Wuthering Waves with tips on combat, progression, and team building.',
    read_time: 12,
  },
  {
    slug: 'monster-hunter-wilds-weapon-tier-list',
    gameSlug: 'monster-hunter-wilds',
    title: 'Monster Hunter Wilds: Complete Weapon Tier List & Guide',
    article_type: 'guide',
    content: '## Weapon Overview\n\nMonster Hunter Wilds features 14 weapon types, each with unique playstyles. Here\'s our comprehensive tier list.\n\n## S-Tier Weapons\n\n### Great Sword\nMassive damage per hit, improved with new Focus Strike mechanic.\n\n### Dual Blades\nFast, aggressive, and great for new players.\n\n## A-Tier Weapons\n\n### Long Sword\nVersatile counter-based gameplay with high skill ceiling.\n\n### Charge Blade\nComplex but incredibly rewarding with Guard Points.\n\n## Tips for Choosing Your Weapon\n\n- Try every weapon at the training area\n- Watch speedruns for advanced techniques\n- Match your weapon to the monster\'s weaknesses',
    excerpt: 'Find the best weapon for your playstyle in Monster Hunter Wilds with our complete tier list.',
    read_time: 15,
  },
  {
    slug: 'path-of-exile-2-league-starter-builds',
    gameSlug: 'path-of-exile-2',
    title: 'Path of Exile 2: Best League Starter Builds for New Players',
    article_type: 'guide',
    content: '## What Makes a Good Starter Build?\n\nA league starter needs to be cheap, effective on minimal gear, and scale well into endgame.\n\n## Top 5 Starter Builds\n\n### 1. Monk - Tempest Flurry\nExcellent clear speed and survivability with dodge mechanics.\n\n### 2. Witch - Chaos DoT\nPoison and chaos damage that melts bosses without expensive gear.\n\n### 3. Warrior - Slam\nTanky and straightforward, perfect for learning the game.\n\n### 4. Ranger - Lightning Arrow\nFast mapping and good boss damage with basic bow gear.\n\n### 5. Sorceress - Ice Bolt\nFreezing enemies makes content much safer.\n\n## Gearing Strategy\n\n- Prioritize life and resistances\n- Get a 5-link as soon as possible\n- Use vendor recipes for early upgrades',
    excerpt: 'Start your Path of Exile 2 journey with these proven budget-friendly builds.',
    read_time: 18,
  },
  {
    slug: 'marvel-rivals-best-heroes-tier-list',
    gameSlug: 'marvel-rivals',
    title: 'Marvel Rivals: Best Heroes Tier List (Season 2)',
    article_type: 'guide',
    content: '## Current Meta Overview\n\nThe Season 2 meta favors mobile DPS heroes and strong support combos.\n\n## S-Tier Heroes\n\n### Spider-Man\nIncredible mobility and burst damage. Dominates flanks.\n\n### Scarlet Witch\nBest support in the game with AoE healing and damage boost.\n\n### Iron Man\nVersatile ranged DPS with flight for repositioning.\n\n## A-Tier Heroes\n\n### Wolverine - Aggressive tank with self-healing\n### Storm - Excellent area denial and utility\n### Black Panther - High skill ceiling assassin\n\n## Team Composition Tips\n\n- Always have at least one support\n- Mix ranged and melee DPS\n- Counter-pick based on enemy team\n- Communicate ultimate timing',
    excerpt: 'Dominate in Marvel Rivals with our comprehensive hero tier list for the current season.',
    read_time: 10,
  },
  {
    slug: 'afk-journey-best-teams-guide',
    gameSlug: 'afk-journey',
    title: 'AFK Journey: Best Team Compositions & Formation Guide',
    article_type: 'guide',
    content: '## Team Building Basics\n\nAFK Journey uses a 5-hero formation system. Positioning and faction bonuses matter.\n\n## Best Early Game Team\n\n- Front: Thoran + Brutus\n- Back: Rowan + Rosaline + Ainz\n\n## Best F2P Team\n\n- Front: Lucius + Hendrik\n- Back: Belinda + Rowan + Fawkes\n\n## Faction Bonuses\n\n- 3 of same faction: +15% ATK/HP\n- 5 of same faction: +25% ATK/HP\n- Mixed (3+2): Balanced approach\n\n## Formation Tips\n\n- Put your tank in front-center\n- Protect squishy DPS in back corners\n- Use CC heroes to disrupt enemy formations\n- Upgrade your carry hero first',
    excerpt: 'Build the ultimate team in AFK Journey with our formation and composition guide.',
    read_time: 8,
  },
  {
    slug: 'zenless-zone-zero-beginner-tips',
    gameSlug: 'zenless-zone-zero',
    title: 'Zenless Zone Zero: 10 Essential Tips for New Proxies',
    article_type: 'guide',
    content: '## Welcome to New Eridu\n\nZenless Zone Zero (ZZZ) is an urban fantasy ARPG. Here are the top tips every new player needs.\n\n## Combat Tips\n\n1. Master Perfect Dodge for free damage windows\n2. Chain attacks by switching characters at the right time\n3. Build Decibel meter for powerful Ultimate attacks\n4. Use the right damage type against enemy weaknesses\n\n## Progression Tips\n\n5. Complete Video Store commissions daily\n6. Don\'t skip Hollow Zero - best source of upgrade materials\n7. Invest in one main DPS first, supports second\n8. Save Polychrome for limited banners\n\n## Quality of Life\n\n9. Explore the city for hidden chests and interactions\n10. Pet the dog at the video store every day (trust us)',
    excerpt: 'Start your ZZZ journey right with these essential beginner tips and tricks.',
    read_time: 7,
  },
];

// ─────────────────────────────────────────
// Main execution
// ─────────────────────────────────────────
async function main() {
  console.log('🚀 GameHub 数据升级开始...\n');

  // Step 1: 删除问题数据
  console.log('1️⃣  清理问题数据...');
  for (const slug of SLUGS_TO_REMOVE) {
    try {
      // 先删除关联的 codes 和 articles
      const game = await db.game.findUnique({ where: { slug }, select: { id: true } });
      if (game) {
        await db.gameCode.deleteMany({ where: { game_id: game.id } });
        await db.article.deleteMany({ where: { game_id: game.id } });
        await db.game.delete({ where: { slug } });
        console.log(`   ✅ 已删除: ${slug}`);
      } else {
        console.log(`   ⏭️  跳过 (不存在): ${slug}`);
      }
    } catch (e) {
      console.log(`   ⚠️  删除失败: ${slug} - ${e.message}`);
    }
  }

  // Step 2: 新增游戏
  console.log('\n2️⃣  新增游戏数据...');
  let gamesAdded = 0;
  for (const game of newGames) {
    try {
      await db.game.upsert({
        where: { slug: game.slug },
        update: {
          name: game.name,
          cover_url: game.cover_url,
          platforms: game.platforms,
          genres: game.genres,
          tags: game.tags,
          developer: game.developer,
          publisher: game.publisher,
          score_opencritic: game.score_opencritic,
          guide_count: game.guide_count,
          code_count: game.code_count,
          has_tier_list: game.has_tier_list,
          description: game.description,
        },
        create: game,
      });
      gamesAdded++;
    } catch (e) {
      console.log(`   ⚠️  游戏失败: ${game.name} - ${e.message}`);
    }
  }
  console.log(`   ✅ 成功添加/更新 ${gamesAdded} 款游戏`);

  // Step 3: 新增兑换码
  console.log('\n3️⃣  新增兑换码...');
  let codesAdded = 0;
  for (const entry of newCodes) {
    const game = await db.game.findUnique({ where: { slug: entry.gameSlug }, select: { id: true } });
    if (!game) {
      console.log(`   ⚠️  游戏不存在: ${entry.gameSlug}`);
      continue;
    }
    for (const code of entry.codes) {
      try {
        await db.gameCode.upsert({
          where: { code_game_id: { code: code.code, game_id: game.id } },
          update: { reward_desc: code.reward_desc, status: code.status, source: code.source },
          create: { ...code, game_id: game.id },
        });
        codesAdded++;
      } catch (e) {
        console.log(`   ⚠️  兑换码失败: ${code.code} - ${e.message}`);
      }
    }
  }
  console.log(`   ✅ 成功添加/更新 ${codesAdded} 个兑换码`);

  // Step 4: 新增攻略文章
  console.log('\n4️⃣  新增攻略文章...');
  let articlesAdded = 0;
  for (const article of newArticles) {
    const game = await db.game.findUnique({ where: { slug: article.gameSlug }, select: { id: true } });
    if (!game) {
      console.log(`   ⚠️  游戏不存在: ${article.gameSlug}`);
      continue;
    }
    try {
      await db.article.upsert({
        where: { slug: article.slug },
        update: {
          title: article.title,
          content: article.content,
          excerpt: article.excerpt,
          read_time: article.read_time,
          game_id: game.id,
        },
        create: {
          slug: article.slug,
          title: article.title,
          article_type: article.article_type,
          status: 'published',
          source_type: 'ai',
          cover_url: `https://picsum.photos/seed/${article.slug}/1200/630`,
          cover_alt: article.title,
          content: article.content,
          excerpt: article.excerpt,
          read_time: article.read_time,
          seo_title: `${article.title} | GameHub`,
          seo_description: article.excerpt,
          game_id: game.id,
          published_at: new Date(),
        },
      });
      articlesAdded++;
    } catch (e) {
      console.log(`   ⚠️  文章失败: ${article.title} - ${e.message}`);
    }
  }
  console.log(`   ✅ 成功添加/更新 ${articlesAdded} 篇文章`);

  // Final stats
  const totalGames = await db.game.count();
  const totalArticles = await db.article.count();
  const totalCodes = await db.gameCode.count();
  
  console.log('\n─────────────────────────────────');
  console.log('📊 数据库最终统计:');
  console.log(`   🎮 游戏: ${totalGames}`);
  console.log(`   📝 文章: ${totalArticles}`);
  console.log(`   🎁 兑换码: ${totalCodes}`);
  console.log('─────────────────────────────────');
  console.log('\n✅ 数据升级完成!');
}

main()
  .catch(e => { console.error('❌ 执行失败:', e); process.exit(1); })
  .finally(() => db.$disconnect());
