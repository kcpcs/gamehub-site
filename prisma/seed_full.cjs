const { PrismaClient } = require('@prisma/client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');
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
    screenshots: ['https://picsum.photos/seed/genshin1/1200/675', 'https://picsum.photos/seed/genshin2/1200/675'],
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
    screenshots: ['https://picsum.photos/seed/hsr1/1200/675', 'https://picsum.photos/seed/hsr2/1200/675'],
    platforms: ['PC', 'PS5', 'Mobile'],
    genres: ['RPG', 'Turn-Based', 'Strategy'],
    tags: ['anime', 'space', 'gacha', 'honkai'],
    developer: 'miHoYo',
    publisher: 'miHoYo',
    release_date: new Date('2023-04-26'),
    score_opencritic: 80,
    score_community: 83,
    score_review_count: 1892,
    description: 'Honkai: Star Rail is a turn-based space fantasy RPG. Ride the Astral Express and explore the vast universe with unique characters.',
  },
  {
    slug: 'valorant',
    name: 'Valorant',
    igdb_id: 111801,
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co3f8k.jpg',
    screenshots: ['https://picsum.photos/seed/valorant1/1200/675', 'https://picsum.photos/seed/valorant2/1200/675'],
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
    screenshots: ['https://picsum.photos/seed/elden1/1200/675', 'https://picsum.photos/seed/elden2/1200/675'],
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
    name: "Baldur's Gate 3",
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
  {
    slug: 'league-of-legends',
    name: 'League of Legends',
    igdb_id: 12632,
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2b8r.jpg',
    screenshots: ['https://picsum.photos/seed/lol1/1200/675'],
    platforms: ['PC'],
    genres: ['MOBA', 'Strategy', 'Action'],
    tags: ['moba', 'competitive', 'esports', 'multiplayer'],
    developer: 'Riot Games',
    publisher: 'Riot Games',
    release_date: new Date('2009-10-27'),
    score_opencritic: 78,
    score_community: 85,
    score_review_count: 3456,
    description: 'League of Legends is a competitive MOBA that blends real-time strategy with fast-paced combat.',
  },
  {
    slug: 'roblox',
    name: 'Roblox',
    igdb_id: 138446,
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co4h5e.jpg',
    screenshots: ['https://picsum.photos/seed/roblox1/1200/675'],
    platforms: ['PC', 'Mobile', 'Xbox'],
    genres: ['Sandbox', 'Adventure', 'Social'],
    tags: ['sandbox', 'multiplayer', 'user-generated', 'creative'],
    developer: 'Roblox Corporation',
    publisher: 'Roblox Corporation',
    release_date: new Date('2006-09-01'),
    score_opencritic: 82,
    score_community: 88,
    score_review_count: 4567,
    description: 'Roblox is an online platform where users can create and play millions of user-generated games.',
  },
  {
    slug: 'cyberpunk-2077',
    name: 'Cyberpunk 2077',
    igdb_id: 11177,
    steam_appid: 1091500,
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1b6v.jpg',
    screenshots: ['https://picsum.photos/seed/cyberpunk1/1200/675'],
    platforms: ['PC', 'PS5', 'Xbox Series', 'PS4'],
    genres: ['RPG', 'Action', 'Open World'],
    tags: ['cyberpunk', 'sci-fi', 'open-world', 'story-rich'],
    developer: 'CD Projekt Red',
    publisher: 'CD Projekt',
    release_date: new Date('2020-12-10'),
    score_opencritic: 91,
    score_community: 85,
    score_review_count: 2345,
    description: 'Cyberpunk 2077 is an open-world action-adventure story set in Night City, a megalopolis obsessed with power and glamour.',
  },
  {
    slug: 'grand-theft-auto-v',
    name: 'Grand Theft Auto V',
    igdb_id: 3254,
    steam_appid: 271590,
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1x7h.jpg',
    screenshots: ['https://picsum.photos/seed/gta5/1200/675'],
    platforms: ['PC', 'PS5', 'PS4', 'Xbox Series', 'Xbox One'],
    genres: ['Action', 'Adventure', 'Open World'],
    tags: ['open-world', 'crime', 'multiplayer', 'sandbox'],
    developer: 'Rockstar North',
    publisher: 'Rockstar Games',
    release_date: new Date('2013-09-17'),
    score_opencritic: 92,
    score_community: 90,
    score_review_count: 5678,
    description: 'Grand Theft Auto V is an open world action-adventure game developed by Rockstar North.',
  },
  {
    slug: 'red-dead-redemption-2',
    name: 'Red Dead Redemption 2',
    igdb_id: 2714,
    steam_appid: 1174180,
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1r24.jpg',
    screenshots: ['https://picsum.photos/seed/rdr2/1200/675'],
    platforms: ['PC', 'PS4', 'Xbox One'],
    genres: ['Action', 'Adventure', 'Open World'],
    tags: ['western', 'open-world', 'story-rich', 'singleplayer'],
    developer: 'Rockstar Studios',
    publisher: 'Rockstar Games',
    release_date: new Date('2018-10-26'),
    score_opencritic: 96,
    score_community: 94,
    score_review_count: 3456,
    description: 'Red Dead Redemption 2 is a Western-themed action-adventure game set in an open world.',
  },
  {
    slug: 'hogwarts-legacy',
    name: 'Hogwarts Legacy',
    igdb_id: 16233,
    steam_appid: 990080,
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co5f4c.jpg',
    screenshots: ['https://picsum.photos/seed/hogwarts1/1200/675'],
    platforms: ['PC', 'PS5', 'Xbox Series', 'Switch', 'PS4'],
    genres: ['Action', 'RPG', 'Adventure'],
    tags: ['harry-potter', 'magic', 'open-world', 'fantasy'],
    developer: 'Avalanche Software',
    publisher: 'Warner Bros. Interactive Entertainment',
    release_date: new Date('2023-02-10'),
    score_opencritic: 85,
    score_community: 88,
    score_review_count: 1234,
    description: 'Hogwarts Legacy is an open-world action RPG set in the wizarding world of Harry Potter.',
  },
  {
    slug: 'stardew-valley',
    name: 'Stardew Valley',
    igdb_id: 23040,
    steam_appid: 413150,
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1de8.jpg',
    screenshots: ['https://picsum.photos/seed/stardew1/1200/675'],
    platforms: ['PC', 'Switch', 'PS4', 'Xbox One', 'Mobile'],
    genres: ['Simulation', 'RPG', 'Indie'],
    tags: ['farming', 'relaxing', 'pixel-art', 'life-sim'],
    developer: 'ConcernedApe',
    publisher: 'ConcernedApe',
    release_date: new Date('2016-02-26'),
    score_opencritic: 89,
    score_community: 94,
    score_review_count: 2345,
    description: 'Stardew Valley is a simulation game where you inherit your grandfather\'s farm and make it flourish.',
  },
  {
    slug: 'zelda-breath-of-the-wild',
    name: 'The Legend of Zelda: Breath of the Wild',
    igdb_id: 73597,
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co3u6p.jpg',
    screenshots: ['https://picsum.photos/seed/botw1/1200/675'],
    platforms: ['Switch'],
    genres: ['Action', 'Adventure', 'Open World'],
    tags: ['zelda', 'nintendo', 'open-world', 'puzzle'],
    developer: 'Nintendo',
    publisher: 'Nintendo',
    release_date: new Date('2017-03-03'),
    score_opencritic: 97,
    score_community: 95,
    score_review_count: 3456,
    description: 'Step into a world of discovery, exploration, and adventure in The Legend of Zelda: Breath of the Wild.',
  },
  {
    slug: 'super-mario-odyssey',
    name: 'Super Mario Odyssey',
    igdb_id: 138896,
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1x5a.jpg',
    screenshots: ['https://picsum.photos/seed/odyssey1/1200/675'],
    platforms: ['Switch'],
    genres: ['Action', 'Adventure', 'Platformer'],
    tags: ['mario', 'nintendo', '3d-platformer', 'sandbox'],
    developer: 'Nintendo',
    publisher: 'Nintendo',
    release_date: new Date('2017-10-27'),
    score_opencritic: 97,
    score_community: 93,
    score_review_count: 2134,
    description: 'Super Mario Odyssey is a platform game where Mario embarks on a journey through strange worlds.',
  },
  {
    slug: 'animal-crossing-new-horizons',
    name: 'Animal Crossing: New Horizons',
    igdb_id: 132969,
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2enq.jpg',
    screenshots: ['https://picsum.photos/seed/acnh1/1200/675'],
    platforms: ['Switch'],
    genres: ['Simulation', 'Life Sim', 'Social'],
    tags: ['nintendo', 'relaxing', 'cozy', 'multiplayer'],
    developer: 'Nintendo',
    publisher: 'Nintendo',
    release_date: new Date('2020-03-20'),
    score_opencritic: 91,
    score_community: 89,
    score_review_count: 1892,
    description: 'Animal Crossing: New Horizons is a life simulation game where you build your own island paradise.',
  },
  {
    slug: 'call-of-duty-warzone',
    name: 'Call of Duty: Warzone',
    igdb_id: 133001,
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co3gwj.jpg',
    screenshots: ['https://picsum.photos/seed/warzone1/1200/675'],
    platforms: ['PC', 'PS5', 'PS4', 'Xbox Series', 'Xbox One'],
    genres: ['Shooter', 'Battle Royale', 'FPS'],
    tags: ['battle-royale', 'fps', 'multiplayer', 'military'],
    developer: 'Infinity Ward',
    publisher: 'Activision',
    release_date: new Date('2020-03-10'),
    score_opencritic: 79,
    score_community: 76,
    score_review_count: 3456,
    description: 'Call of Duty: Warzone is a free-to-play battle royale game set in the Call of Duty universe.',
  },
  {
    slug: 'rocket-league',
    name: 'Rocket League',
    igdb_id: 292848,
    steam_appid: 252470,
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2j3r.jpg',
    screenshots: ['https://picsum.photos/seed/rocket1/1200/675'],
    platforms: ['PC', 'Switch', 'PS4', 'Xbox One'],
    genres: ['Sports', 'Action', 'Vehicular Combat'],
    tags: ['soccer', 'cars', 'competitive', 'multiplayer'],
    developer: 'Psyonix',
    publisher: 'Psyonix',
    release_date: new Date('2015-07-07'),
    score_opencritic: 86,
    score_community: 90,
    score_review_count: 1234,
    description: 'Rocket League is a high-powered hybrid of arcade-style soccer and vehicular mayhem.',
  },
  {
    slug: 'overwatch-2',
    name: 'Overwatch 2',
    igdb_id: 141722,
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co4j7p.jpg',
    screenshots: ['https://picsum.photos/seed/ow21/1200/675'],
    platforms: ['PC', 'Switch', 'PS5', 'PS4', 'Xbox Series', 'Xbox One'],
    genres: ['Shooter', 'FPS', 'Hero Shooter'],
    tags: ['fps', 'team-based', 'heroes', 'competitive'],
    developer: 'Blizzard Entertainment',
    publisher: 'Blizzard Entertainment',
    release_date: new Date('2022-10-04'),
    score_opencritic: 80,
    score_community: 75,
    score_review_count: 2345,
    description: 'Overwatch 2 is a team-based shooter where heroes compete in a world of futuristic conflict.',
  },
  {
    slug: 'world-of-warcraft',
    name: 'World of Warcraft',
    igdb_id: 14555,
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1r8m.jpg',
    screenshots: ['https://picsum.photos/seed/wow1/1200/675'],
    platforms: ['PC', 'Mac'],
    genres: ['MMORPG', 'RPG', 'Massively Multiplayer'],
    tags: ['mmorpg', 'fantasy', 'multiplayer', 'azeroth'],
    developer: 'Blizzard Entertainment',
    publisher: 'Blizzard Entertainment',
    release_date: new Date('2004-11-23'),
    score_opencritic: 88,
    score_community: 85,
    score_review_count: 5678,
    description: 'World of Warcraft is a massively multiplayer online role-playing game set in the Warcraft universe.',
  },
  {
    slug: 'final-fantasy-xiv',
    name: 'Final Fantasy XIV',
    igdb_id: 33786,
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2f7v.jpg',
    screenshots: ['https://picsum.photos/seed/ffxiv1/1200/675'],
    platforms: ['PC', 'PS5', 'PS4'],
    genres: ['MMORPG', 'RPG', 'Massively Multiplayer'],
    tags: ['mmorpg', 'final-fantasy', 'multiplayer', 'fantasy'],
    developer: 'Square Enix',
    publisher: 'Square Enix',
    release_date: new Date('2010-09-30'),
    score_opencritic: 85,
    score_community: 90,
    score_review_count: 3456,
    description: 'Final Fantasy XIV is a massively multiplayer online role-playing game in the Final Fantasy series.',
  },
  {
    slug: 'palworld',
    name: 'Palworld',
    igdb_id: 217933,
    steam_appid: 1623730,
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co9h6z.jpg',
    screenshots: ['https://picsum.photos/seed/palworld1/1200/675'],
    platforms: ['PC', 'Xbox Series'],
    genres: ['Action', 'RPG', 'Survival', 'Open World'],
    tags: ['open-world', 'creatures', 'survival', 'base-building'],
    developer: 'Pocket Pair',
    publisher: 'Pocket Pair',
    release_date: new Date('2024-01-19'),
    score_opencritic: 82,
    score_community: 88,
    score_review_count: 876,
    description: 'Palworld is a survival game where you can befriend and capture mysterious creatures called Pals.',
  },
  {
    slug: 'lethal-company',
    name: 'Lethal Company',
    igdb_id: 208792,
    steam_appid: 1963720,
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co7nqt.jpg',
    screenshots: ['https://picsum.photos/seed/lethal1/1200/675'],
    platforms: ['PC'],
    genres: ['Horror', 'Co-op', 'Action'],
    tags: ['horror', 'co-op', 'multiplayer', 'sci-fi'],
    developer: 'Zeekerss',
    publisher: 'Zeekerss',
    release_date: new Date('2023-10-23'),
    score_opencritic: 86,
    score_community: 94,
    score_review_count: 543,
    description: 'Lethal Company is a cooperative horror game where you work for a company on moon bases.',
  },
  {
    slug: 'black-myth-wukong',
    name: 'Black Myth: Wukong',
    igdb_id: 220953,
    steam_appid: 2358720,
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/coi2kr.jpg',
    screenshots: ['https://picsum.photos/seed/wukong1/1200/675'],
    platforms: ['PC', 'PS5'],
    genres: ['Action', 'RPG', 'Souls-like'],
    tags: ['action', 'chinese-mythology', 'souls-like', 'singleplayer'],
    developer: 'Game Science',
    publisher: 'Game Science',
    release_date: new Date('2024-08-20'),
    score_opencritic: 87,
    score_community: 92,
    score_review_count: 1234,
    description: 'Black Myth: Wukong is an action RPG based on Chinese mythology.',
  },
  {
    slug: 'balatro',
    name: 'Balatro',
    igdb_id: 228937,
    steam_appid: 2379780,
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/col5bt.jpg',
    screenshots: ['https://picsum.photos/seed/balatro1/1200/675'],
    platforms: ['PC', 'Switch', 'PS5', 'Xbox Series'],
    genres: ['Roguelike', 'Card Game', 'Strategy'],
    tags: ['poker', 'roguelike', 'cards', 'indie'],
    developer: 'LocalThunk',
    publisher: 'Playism',
    release_date: new Date('2024-02-20'),
    score_opencritic: 89,
    score_community: 94,
    score_review_count: 678,
    description: 'Balatro is a poker-themed roguelike deck builder with an infinite replayability.',
  },
  {
    slug: 'silk-sons',
    name: 'Silk: Sons',
    igdb_id: 277900,
    steam_appid: 2496540,
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/cojlxq.jpg',
    screenshots: ['https://picsum.photos/seed/silk1/1200/675'],
    platforms: ['PC'],
    genres: ['Action', 'Adventure', 'Metroidvania'],
    tags: ['metroidvania', 'action', 'silk', 'spider'],
    developer: 'Skylight',
    publisher: 'Skylight',
    release_date: new Date('2024-06-13'),
    score_opencritic: 84,
    score_community: 88,
    score_review_count: 234,
    description: 'Silk: Sons is a stylized Metroidvania where you play as a spider-like creature.',
  },
  {
    slug: 'once-human',
    name: 'Once Human',
    igdb_id: 219051,
    steam_appid: 2198400,
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/cojcf4.jpg',
    screenshots: ['https://picsum.photos/seed/oncehuman1/1200/675'],
    platforms: ['PC'],
    genres: ['Survival', 'Open World', 'Action'],
    tags: ['survival', 'open-world', 'multiplayer', 'scifi'],
    developer: 'Starry Studio',
    publisher: 'Moon Games',
    release_date: new Date('2024-07-10'),
    score_opencritic: 78,
    score_community: 85,
    score_review_count: 456,
    description: 'Once Human is an open-world survival game with multiplayer co-op and horror elements.',
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

## Event Sources
- **Version Events**: 1,000-2,000 Primogems per major event
- **Maintenance Compensation**: Usually 300 Primogems
- **Mini-events**: 100-300 Primogems each

## Pro Tips
- Always claim your daily commissions
- Complete Spiral Abyss even if you can't finish all floors
- Don't waste Resin - use it daily
- Save Primogems for limited banners you really want
- Focus on completing achievements for bonus Primogems

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

### Neuvillette
The strongest hydro DPS with massive damage output and ease of play.

## A Tier - Strong Picks

### Raiden Shogun
Consistent Electro damage and energy battery for the team. Still amazing after all these patches.

### Kazuha
Versatile Anemo support with grouping and elemental damage buffs.

### Yelan
Excellent off-field hydro DPS with mobility boost.

## B Tier - Good Choices

### Bennett
The ultimate support who still finds a place in many team compositions.

### Xiangling
Pyro DPS that remains relevant despite powercreep.

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
- Talk to NPC after boss fights - some rewards are missable

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

### Phoenix
Self-sustaining duelist with great utility.

## B Tier - Viable Options

### Omen
Versatile controller with reliable smokes and mobility.

### Viper
Best area denial in the game, requires team coordination.

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
- **Crafting Table**: 4 wood planks

## Important Tips
- Always carry a bucket of water - saves you from falls and lava!
- Torches stop mob spawning - light up your base
- Always sleep if you can - resetting the spawn is crucial
- Make a shield ASAP - blocks mob attacks

## Nether Preparation
- Build a nether portal with 10 obsidian
- Bring food, armor, and weapons
- Find a fortress for blaze rods and nether wart

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
    title: "Baldur's Gate 3: Best Classes Ranked - Complete Tier List",
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

### Sorcerer
Metamagic provides incredible flexibility. Twin Spell is game-changing.

## B Tier - Viable Choices

### Fighter
Action Surge is amazing. Battle Master offers great control options.

### Rogue
Stealth and sneak attack remain incredibly useful.

Remember - play what you find fun! BG3 is all about roleplaying.`,
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co319m.jpg',
    cover_alt: "Baldur's Gate 3",
    read_time: 10,
    seo_title: "Baldur's Gate 3: Best Classes Ranked",
    seo_description: 'Discover the most powerful classes in BG3 for your first playthrough',
    seo_keywords: ["Baldur's Gate 3", 'classes', 'tier list', 'guide'],
    view_count: 37654,
    share_count: 2134,
    published_at: new Date('2024-05-06T10:00:00Z'),
  },
  {
    slug: 'how-to-beat-margit-elden-ring',
    title: 'How to Beat Margit, the Fell Omen in Elden Ring',
    article_type: 'guide',
    status: 'published',
    source_type: 'ai',
    excerpt: 'Complete strategy guide for defeating Margit, the Fell Omen - including attack patterns and tips.',
    content: `# How to Beat Margit, the Fell Omen in Elden Ring

Margit, the Fell Omen is the first major boss obstacle in Elden Ring. Here's how to defeat him!

## Q: What level should I be to fight Margit?
A: Level 15-20 is recommended with a +3 weapon.

## Q: Is Margit optional?
A: Yes! You can explore other areas and return later.

## Attack Patterns

### Hammer Attacks
- **Overhead Smash**: Dodge left or right
- **Sweeping Strike**: Jump or backstep
- **Ground Pound**: Roll away

### Daggers
- **Quick Combo**: Stay patient, wait for opening
- **Leaping Attack**: Roll through

## Strategy

### Best Summons
- **NPC Spirit Ashes**: Can be summoned outside the fog gate
- **Spirit Ashes**: Level up the jellyfish for magic damage

### Recommended Build
- High Vigor (at least 15)
- Fast weapon for staggers
- Block if you have a shield with 100% stability

### Critical Tips
- Wait for him to do combo finishers
- Punish after hammer overhead
- Don't get greedy - one or two hits only
- Use the environment pillars for cover

Persistence pays off!`,
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2l4k.jpg',
    cover_alt: 'Elden Ring Margit',
    read_time: 8,
    seo_title: 'How to Beat Margit in Elden Ring',
    seo_description: 'Complete strategy guide for defeating Margit, the Fell Omen in Elden Ring',
    seo_keywords: ['Elden Ring', 'Margit', 'boss', 'guide', 'how-to'],
    view_count: 28934,
    share_count: 1876,
    published_at: new Date('2024-05-07T10:00:00Z'),
  },
  {
    slug: 'honkai-star-rail-best-team-comp',
    title: 'Honkai: Star Rail - Best Team Compositions for Every DPS',
    article_type: 'guide',
    status: 'published',
    source_type: 'ai',
    excerpt: 'Optimize your Honkai Star Rail team with these top-tier compositions.',
    content: `# Honkai: Star Rail - Best Team Compositions

Building the perfect team in Honkai: Star Rail is crucial for success. Here's our guide!

## Q: How many characters do I need?
A: You need 4 characters - 1 DPS and 3 supports.

## General Team Structure
- **1 Main DPS**: Deals most damage
- **1 Sustain**: Healer/shielder
- **2 Sub-DPS/Supports**: Buff damage, debuff enemies

## Top Compositions

### Jing Yuan Team
- **Jing Yuan** (DPS)
- **Tingyun** (Battery)
- **Pela** (Defense shred)
- **Lynx** (Sustain)

### Dr. Ratio Team
- **Dr. Ratio** (DPS)
- **Topaz** (Debuff)
- **Pela** (Defense shred)
- **Luocha** (Sustain)

## Key Tips
- Always match elements for quantum weak enemies
- Speed tuning is important
- Focus on relic substats over set bonuses early game
- Use follow-up attacks for extra damage

Good luck, Trailblazer!`,
    cover_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co6j6l.jpg',
    cover_alt: 'Honkai Star Rail',
    read_time: 9,
    seo_title: 'Honkai Star Rail Best Team Compositions',
    seo_description: 'Optimize your Honkai Star Rail team with these top-tier compositions',
    seo_keywords: ['Honkai Star Rail', 'team', 'guide', 'DPS', 'how-to'],
    view_count: 23456,
    share_count: 1567,
    published_at: new Date('2024-05-08T10:00:00Z'),
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
  { code: 'GENS30DAY', reward_desc: '30 Primogems Daily Login Bonus', source: 'official', status: 'active' },
  { code: 'LUCKYPALS', reward_desc: 'Mysterious Creature Box x1', source: 'official', status: 'active' },
  { code: 'WELCOME2048', reward_desc: '2048 Stellar Jade First Login', source: 'official', status: 'active' },
  { code: 'APEXPALS', reward_desc: 'Free Skin Pack for Pals', source: 'reddit', status: 'active' },
  { code: 'PALWORLD2024', reward_desc: 'Palworld Starter Pack', source: 'official', status: 'active' },
  { code: 'LETHALCO', reward_desc: 'Lethal Company Item Bundle', source: 'official', status: 'active' },
  { code: 'WUKONG2024', reward_desc: 'Black Myth Wukong Bonus', source: 'official', status: 'active' },
  { code: 'BALATRO2024', reward_desc: 'Balatro Starting Deck Upgrade', source: 'official', status: 'active' },
  { code: 'HONKAI3RD', reward_desc: 'Honkai Impact 3rd: 1000 Gem', source: 'official', status: 'active' },
  { code: 'GGZZ2024', reward_desc: 'Zenless Zone Zero: 100 Polychrome', source: 'official', status: 'active' },
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
      { name: 'Phoenix', image_url: 'https://picsum.photos/seed/phoenix/100/100', grade: 'A', avg_score: 4.1, vote_count: 1056, description: 'Self-sustaining duelist' },
      { name: 'Reyna', image_url: 'https://picsum.photos/seed/reyna/100/100', grade: 'A', avg_score: 4.0, vote_count: 987, description: 'Queen of aim duels' },
      { name: 'Yoru', image_url: 'https://picsum.photos/seed/yoru/100/100', grade: 'B', avg_score: 3.5, vote_count: 876, description: 'Stealthy fragger' },
      { name: 'Viper', image_url: 'https://picsum.photos/seed/viper/100/100', grade: 'B', avg_score: 3.4, vote_count: 765, description: 'Best area denial' },
      { name: 'Brimstone', image_url: 'https://picsum.photos/seed/brimstone/100/100', grade: 'B', avg_score: 3.3, vote_count: 654, description: 'Reliable controller' },
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
      { name: 'Kazuha', image_url: 'https://picsum.photos/seed/kazuha/100/100', grade: 'A', avg_score: 4.4, vote_count: 2543, description: 'Versatile Anemo support' },
      { name: 'Yelan', image_url: 'https://picsum.photos/seed/yelan/100/100', grade: 'A', avg_score: 4.3, vote_count: 2321, description: 'Excellent off-field hydro DPS' },
      { name: 'Alhaitham', image_url: 'https://picsum.photos/seed/alhaitham/100/100', grade: 'A', avg_score: 4.2, vote_count: 2109, description: 'Powerful Dendro DPS' },
      { name: 'Bennett', image_url: 'https://picsum.photos/seed/bennett/100/100', grade: 'B', avg_score: 3.8, vote_count: 1987, description: 'The ultimate support' },
    ],
  },
];

async function seed() {
  console.log('Starting database seeding...');

  const createdGames = [];
  for (const game of gamesData) {
    try {
      const createdGame = await db.game.upsert({
        where: { slug: game.slug },
        update: game,
        create: {
          ...game,
          guide_count: 0,
          code_count: 0,
          has_tier_list: false,
        }
      });
      createdGames.push(createdGame);
      console.log(`Created/Updated game: ${createdGame.name}`);
    } catch (err) {
      console.error(`Error creating game ${game.name}:`, err);
    }
  }

  const gameMap = new Map(createdGames.map(g => [g.slug, g]));

  const articleGameSlugs = [
    'genshin-impact', 'genshin-impact', 'elden-ring', 'valorant',
    'minecraft', 'baldurs-gate-3', 'elden-ring', 'honkai-star-rail'
  ];

  const createdArticles = [];
  for (let i = 0; i < articlesData.length; i++) {
    const article = articlesData[i];
    const gameSlug = articleGameSlugs[i];
    const game = gameMap.get(gameSlug);

    if (!game) continue;

    try {
      const createdArticle = await db.article.upsert({
        where: { slug: article.slug },
        update: article,
        create: {
          ...article,
          game_id: game.id,
          seo_keywords: JSON.stringify(article.seo_keywords),
          source_urls: JSON.stringify([]),
          affiliate_links: JSON.stringify([]),
        }
      });
      createdArticles.push(createdArticle);

      await db.game.update({
        where: { id: game.id },
        data: { guide_count: { increment: 1 } }
      });

      console.log(`Created/Updated article: ${createdArticle.title}`);
    } catch (err) {
      console.error(`Error creating article ${article.title}:`, err);
    }
  }

  const codeGameSlugs = [
    'genshin-impact', 'genshin-impact', 'genshin-impact',
    'honkai-star-rail', 'honkai-star-rail', 'valorant', 'valorant',
    'fortnite', 'minecraft', 'elden-ring', 'genshin-impact',
    'palworld', 'honkai-star-rail', 'apex-legends', 'palworld',
    'lethal-company', 'black-myth-wukong', 'balatro', 'honkai-star-rail', 'roblox'
  ];

  for (let i = 0; i < codesData.length; i++) {
    const code = codesData[i];
    const gameSlug = codeGameSlugs[i];
    const game = gameMap.get(gameSlug);

    if (!game) continue;

    try {
      await db.gameCode.upsert({
        where: {
          code_game_id: {
            code: code.code,
            game_id: game.id
          }
        },
        update: code,
        create: {
          ...code,
          game_id: game.id,
        }
      });

      await db.game.update({
        where: { id: game.id },
        data: { code_count: { increment: 1 } }
      });

      console.log(`Created/Updated code: ${code.code} for ${game.name}`);
    } catch (err) {
      console.error(`Error creating code ${code.code}:`, err);
    }
  }

  const tierListGameSlugs = ['valorant', 'genshin-impact'];

  for (let i = 0; i < tierListsData.length; i++) {
    const tierListData = tierListsData[i];
    const gameSlug = tierListGameSlugs[i];
    const game = gameMap.get(gameSlug);

    if (!game) continue;

    try {
      const existingTierList = await db.tierList.findUnique({
        where: { game_id_category: { game_id: game.id, category: tierListData.category } }
      });

      if (existingTierList) {
        await db.tierEntry.deleteMany({ where: { tier_list_id: existingTierList.id } });
        await db.tierList.delete({ where: { id: existingTierList.id } });
      }

      await db.tierList.create({
        data: {
          game_id: game.id,
          category: tierListData.category,
          patch_version: tierListData.patch_version,
          is_community: tierListData.is_community,
          total_votes: tierListData.entries.reduce((sum, entry) => sum + entry.vote_count, 0),
          entries: {
            create: tierListData.entries
          }
        }
      });

      await db.game.update({
        where: { id: game.id },
        data: { has_tier_list: true }
      });

      console.log(`Created/Updated tier list for ${game.name} with ${tierListData.entries.length} entries`);
    } catch (err) {
      console.error(`Error creating tier list for ${game.name}:`, err);
    }
  }

  console.log('Seeding complete!');
  console.log(`Total games: ${createdGames.length}`);
  console.log(`Total articles: ${createdArticles.length}`);
  console.log(`Total codes: ${codesData.length}`);
  console.log(`Total tier lists: ${tierListsData.length}`);
}

seed()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
