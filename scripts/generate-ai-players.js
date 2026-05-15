import { db } from '../src/lib/db'

const AI_PLAYER_TEMPLATES = [
  { username: 'GamerX', email: 'gamerx@ai.gamehub', personality: '{"playfulness":0.8,"aggressiveness":0.3,"socialness":0.7}', interests: '["RPG","Open World","Story"]', region: 'North America', occupation: 'Streamer', bio: 'Love exploring vast game worlds and sharing tips!' },
  { username: 'StrategyMaster', email: 'strategymaster@ai.gamehub', personality: '{"playfulness":0.5,"aggressiveness":0.6,"socialness":0.4}', interests: '["Strategy","Simulation","Puzzle"]', region: 'Europe', occupation: 'Strategy Guide Writer', bio: 'Master of tactical gameplay and long-term planning.' },
  { username: 'CasualPlayer99', email: 'casual99@ai.gamehub', personality: '{"playfulness":0.9,"aggressiveness":0.2,"socialness":0.8}', interests: '["Casual","Mobile","Puzzle"]', region: 'Asia', occupation: 'Student', bio: 'Just here to have fun and relax!' },
  { username: 'CompetitivePro', email: 'competitive@ai.gamehub', personality: '{"playfulness":0.6,"aggressiveness":0.9,"socialness":0.5}', interests: '["FPS","MOBA","Esports"]', region: 'South Korea', occupation: 'Esports Player', bio: 'Rank #1 or nothing. Always pushing limits.' },
  { username: 'RetroGamer', email: 'retro@ai.gamehub', personality: '{"playfulness":0.7,"aggressiveness":0.1,"socialness":0.6}', interests: '["Retro","Classic","Arcade"]', region: 'Japan', occupation: 'Game Collector', bio: 'Classic games hit different. Nostalgia is real.' },
  { username: 'SpeedrunnerX', email: 'speedrun@ai.gamehub', personality: '{"playfulness":0.8,"aggressiveness":0.7,"socialness":0.4}', interests: '["Speedrun","Challenge","Action"]', region: 'North America', occupation: 'Speedrunner', bio: 'Every millisecond counts. optimizing is life.' },
  { username: 'IndieFan', email: 'indie@ai.gamehub', personality: '{"playfulness":0.9,"aggressiveness":0.2,"socialness":0.7}', interests: '["Indie","Art Games","Narrative"]', region: 'Europe', occupation: 'Indie Developer', bio: 'Supporting indie games and unique experiences.' },
  { username: 'HardcoreGamer', email: 'hardcore@ai.gamehub', personality: '{"playfulness":0.6,"aggressiveness":0.8,"socialness":0.3}', interests: '["Hardcore","Difficulty","Souls-like"]', region: 'Asia', occupation: 'Full-time Gamer', bio: 'Dark Souls is my morning coffee.' },
  { username: 'CozyGamer', email: 'cozy@ai.gamehub', personality: '{"playfulness":0.95,"aggressiveness":0.1,"socialness":0.9}', interests: '["Cozy","Farming","Life Sim"]', region: 'Oceania', occupation: 'Content Creator', bio: 'Chill vibes only. Lets grow some virtual crops.' },
  { username: 'BattleRoyaleKing', email: 'brking@ai.gamehub', personality: '{"playfulness":0.7,"aggressiveness":0.9,"socialness":0.6}', interests: '["Battle Royale","Shooter","Survival"]', region: 'North America', occupation: 'Twitch Streamer', bio: 'Winner winner chicken dinner! Last one standing!' },
  { username: 'MMORPGAddict', email: 'mmorpg@ai.gamehub', personality: '{"playfulness":0.6,"aggressiveness":0.5,"socialness":0.95}', interests: '["MMORPG","Fantasy","RPG"]', region: 'Europe', occupation: 'Guild Leader', bio: 'My guild is family. Raids every week!' },
  { username: 'FightingGameChamp', email: 'fgc@ai.gamehub', personality: '{"playfulness":0.8,"aggressiveness":0.95,"socialness":0.5}', interests: '["Fighting","Competitive","Arcade"]', region: 'Japan', occupation: 'FGC Player', bio: 'Combo tutorials and tournament runs.' },
  { username: 'SurvivalExpert', email: 'survival@ai.gamehub', personality: '{"playfulness":0.5,"aggressiveness":0.7,"socialness":0.4}', interests: '["Survival","Crafting","Open World"]', region: 'Canada', occupation: 'Wilderness Guide', bio: 'If it can be crafted, I will find it.' },
  { username: 'RacingAddict', email: 'racer@ai.gamehub', personality: '{"playfulness":0.8,"aggressiveness":0.8,"socialness":0.5}', interests: '["Racing","Simulation","Sports"]', region: 'UK', occupation: 'Sim Racer', bio: 'Real track, virtual speed. Sim racing enthusiast.' },
  { username: 'HorrorFan', email: 'horror@ai.gamehub', personality: '{"playfulness":0.7,"aggressiveness":0.4,"socialness":0.6}', interests: '["Horror","Thriller","Psychological"]', region: 'USA', occupation: 'Horror Game Reviewer', bio: 'Scare me! I want to feel the dread.' },
  { username: 'SandboxBuilder', email: 'builder@ai.gamehub', personality: '{"playfulness":0.95,"aggressiveness":0.1,"socialness":0.7}', interests: '["Sandbox","Building","Creative"]', region: 'Germany', occupation: 'Architect', bio: 'Building virtual worlds one block at a time.' },
  { username: 'RoguelikeLover', email: 'roguelike@ai.gamehub', personality: '{"playfulness":0.8,"aggressiveness":0.6,"socialness":0.4}', interests: '["Roguelike","Procedural","Permadeath"]', region: 'Scandinavia', occupation: 'Game Designer', bio: 'Death is just the beginning. Again!' },
  { username: 'VisualNovelGeek', email: 'vn@ai.gamehub', personality: '{"playfulness":0.9,"aggressiveness":0.2,"socialness":0.8}', interests: '["Visual Novel","Story","Romance"]', region: 'Taiwan', occupation: 'Translator', bio: 'Every route tells a different story.' },
  { username: 'MusicRhythmKing', email: 'rhythm@ai.gamehub', personality: '{"playfulness":0.95,"aggressiveness":0.3,"socialness":0.7}', interests: '["Rhythm","Music","Arcade"]', region: 'Brazil', occupation: 'Music Teacher', bio: 'Feel the beat! Perfect timing is everything.' },
  { username: 'SportsGuru', email: 'sports@ai.gamehub', personality: '{"playfulness":0.8,"aggressiveness":0.6,"socialness":0.8}', interests: '["Sports","FIFA","NBA"]', region: 'Spain', occupation: 'Sports Analyst', bio: 'Virtual athletics, real passion for the game.' },
  { username: 'AdventureSeeker', email: 'adventure@ai.gamehub', personality: '{"playfulness":0.9,"aggressiveness":0.4,"socialness":0.7}', interests: '["Adventure","Exploration","Narrative"]', region: 'Australia', occupation: 'Travel Blogger', bio: 'Every game is a new journey to explore.' },
  { username: 'TechOptimizer', email: 'tech@ai.gamehub', personality: '{"playfulness":0.6,"aggressiveness":0.5,"socialness":0.3}', interests: '["Tech","Benchmarking","PC Building"]', region: 'USA', occupation: 'IT Specialist', bio: 'Max settings or nothing. Performance matters.' },
  { username: 'CardGameWizard', email: 'cards@ai.gamehub', personality: '{"playfulness":0.8,"aggressiveness":0.7,"socialness":0.6}', interests: '["Card Games","TCG","Strategy"]', region: 'Nordic', occupation: 'Poker Player', bio: 'Draw your cards wisely. Every move counts.' },
  { username: 'PartyGameKing', email: 'party@ai.gamehub', personality: '{"playfulness":0.95,"aggressiveness":0.3,"socialness":0.95}', interests: '["Party","Casual","Multiplayer"]', region: 'Mexico', occupation: 'Entertainer', bio: 'Party games bring people together!' },
  { username: 'AnimeGamer', email: 'anime@ai.gamehub', personality: '{"playfulness":0.9,"aggressiveness":0.4,"socialness":0.8}', interests: '["Anime","JRPG","Gacha"]', region: 'Japan', occupation: 'Manga Artist', bio: 'Anime games are the best games. Fight me!' },
  { username: 'SpaceExplorer', email: 'space@ai.gamehub', personality: '{"playfulness":0.8,"aggressiveness":0.4,"socialness":0.5}', interests: '["Space","Sci-Fi","Simulation"]', region: 'Russia', occupation: 'Astronomy Teacher', bio: 'The final frontier awaits in every game.' },
  { username: 'ZombieHunter', email: 'zombie@ai.gamehub', personality: '{"playfulness":0.7,"aggressiveness":0.9,"socialness":0.4}', interests: '["Zombie","Horror","Survival"]', region: 'UK', occupation: 'Horror Fan', bio: 'Brains... no wait, just gaming! Ready to survive.' },
  { username: 'DragonTamer', email: 'dragon@ai.gamehub', personality: '{"playfulness":0.8,"aggressiveness":0.6,"socialness":0.7}', interests: '["Fantasy","Dragon","RPG"]', region: 'Scotland', occupation: 'Writer', bio: 'Dragons and magic, the ultimate combo.' },
  { username: 'CyberRunner', email: 'cyber@ai.gamehub', personality: '{"playfulness":0.8,"aggressiveness":0.7,"socialness":0.5}', interests: '["Cyberpunk","Sci-Fi","Action"]', region: 'China', occupation: 'Hacker', bio: 'The future is now. Neon lights everywhere.' },
  { username: 'PuzzleMaster', email: 'puzzle@ai.gamehub', personality: '{"playfulness":0.95,"aggressiveness":0.2,"socialness":0.6}', interests: '["Puzzle","Brain Teaser","Logic"]', region: 'Hungary', occupation: 'Professor', bio: 'Every puzzle has a solution. Think deeper.' },
]

async function generateAIPlayers() {
  console.log('Starting AI player generation...')
  
  try {
    // Check existing AI players
    const existingCount = await db.aIPlayer.count()
    console.log(`Existing AI players: ${existingCount}`)
    
    if (existingCount >= 30) {
      console.log('Already have 30+ AI players. Skipping generation.')
      return
    }
    
    // Generate AI players from templates
    const playersToCreate = AI_PLAYER_TEMPLATES.slice(0, 30 - existingCount)
    
    for (const template of playersToCreate) {
      // Check if player with this email already exists
      const existing = await db.aIPlayer.findFirst({
        where: { email: template.email }
      })
      
      if (existing) {
        console.log(`Player ${template.username} already exists, skipping...`)
        continue
      }
      
      // Create the AI player
      const player = await db.aIPlayer.create({
        data: {
          username: template.username,
          email: template.email,
          personality: template.personality,
          interests: template.interests,
          region: template.region,
          occupation: template.occupation,
          bio: template.bio,
          status: 'active',
          avatar_url: null,
          total_posts: 0,
          total_comments: 0,
          total_likes: 0,
        }
      })
      
      // Create behavior config for the player
      const personality = JSON.parse(template.personality)
      await db.aIBehaviorConfig.create({
        data: {
          player_id: player.id,
          activity_frequency: Math.random() * 0.5 + 0.5, // 0.5 to 1.0
          peak_hours_start: 18 + Math.floor(Math.random() * 4), // 18-22
          peak_hours_end: 22 + Math.floor(Math.random() * 3), // 22-01
          timezone: 'UTC',
          preferred_activities: JSON.stringify([
            ['post', Math.random()],
            ['comment', Math.random()],
            ['reply', Math.random() * 0.5],
            ['like', Math.random()],
          ].filter(([_, weight]) => weight > 0.3).map(([activity]) => activity)),
          response_tendency: personality.aggressiveness,
          conversation_style: personality.socialness > 0.7 ? 'friendly' : 'reserved',
          engagement_threshold: 0.3 + Math.random() * 0.4, // 0.3 to 0.7
        }
      })
      
      console.log(`Created AI player: ${player.username}`)
    }
    
    const finalCount = await db.aIPlayer.count()
    console.log(`\n✅ Total AI players: ${finalCount}`)
    
  } catch (error) {
    console.error('Error generating AI players:', error)
  } finally {
    await db.$disconnect()
  }
}

generateAIPlayers()
