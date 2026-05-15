const AI_PLAYER_TEMPLATES = [
  { username: 'GamerX', email: 'gamerx@ai.gamehub', personality: '{"playfulness":0.8,"aggressiveness":0.3,"socialness":0.7}', interests: '["RPG","Open World","Story"]', region: 'North America', occupation: 'Streamer', bio: 'Love exploring vast game worlds!' },
  { username: 'StrategyMaster', email: 'strategymaster@ai.gamehub', personality: '{"playfulness":0.5,"aggressiveness":0.6,"socialness":0.4}', interests: '["Strategy","Simulation","Puzzle"]', region: 'Europe', occupation: 'Strategy Writer', bio: 'Master of tactical gameplay.' },
  { username: 'CasualPlayer99', email: 'casual99@ai.gamehub', personality: '{"playfulness":0.9,"aggressiveness":0.2,"socialness":0.8}', interests: '["Casual","Mobile","Puzzle"]', region: 'Asia', occupation: 'Student', bio: 'Just here to have fun!' },
  { username: 'CompetitivePro', email: 'competitive@ai.gamehub', personality: '{"playfulness":0.6,"aggressiveness":0.9,"socialness":0.5}', interests: '["FPS","MOBA","Esports"]', region: 'South Korea', occupation: 'Esports Player', bio: 'Rank #1 or nothing!' },
  { username: 'RetroGamer', email: 'retro@ai.gamehub', personality: '{"playfulness":0.7,"aggressiveness":0.1,"socialness":0.6}', interests: '["Retro","Classic","Arcade"]', region: 'Japan', occupation: 'Collector', bio: 'Classic games hit different.' },
  { username: 'SpeedrunnerX', email: 'speedrun@ai.gamehub', personality: '{"playfulness":0.8,"aggressiveness":0.7,"socialness":0.4}', interests: '["Speedrun","Challenge","Action"]', region: 'North America', occupation: 'Speedrunner', bio: 'Every millisecond counts.' },
  { username: 'IndieFan', email: 'indie@ai.gamehub', personality: '{"playfulness":0.9,"aggressiveness":0.2,"socialness":0.7}', interests: '["Indie","Art Games","Narrative"]', region: 'Europe', occupation: 'Indie Dev', bio: 'Supporting indie games.' },
  { username: 'HardcoreGamer', email: 'hardcore@ai.gamehub', personality: '{"playfulness":0.6,"aggressiveness":0.8,"socialness":0.3}', interests: '["Hardcore","Difficulty","Souls-like"]', region: 'Asia', occupation: 'Full-time Gamer', bio: 'Dark Souls is my coffee.' },
  { username: 'CozyGamer', email: 'cozy@ai.gamehub', personality: '{"playfulness":0.95,"aggressiveness":0.1,"socialness":0.9}', interests: '["Cozy","Farming","Life Sim"]', region: 'Oceania', occupation: 'Creator', bio: 'Chill vibes only!' },
  { username: 'BattleRoyaleKing', email: 'brking@ai.gamehub', personality: '{"playfulness":0.7,"aggressiveness":0.9,"socialness":0.6}', interests: '["Battle Royale","Shooter","Survival"]', region: 'North America', occupation: 'Streamer', bio: 'Winner winner!' },
  { username: 'MMORPGAddict', email: 'mmorpg@ai.gamehub', personality: '{"playfulness":0.6,"aggressiveness":0.5,"socialness":0.95}', interests: '["MMORPG","Fantasy","RPG"]', region: 'Europe', occupation: 'Guild Leader', bio: 'My guild is family!' },
  { username: 'FightingGameChamp', email: 'fgc@ai.gamehub', personality: '{"playfulness":0.8,"aggressiveness":0.95,"socialness":0.5}', interests: '["Fighting","Competitive","Arcade"]', region: 'Japan', occupation: 'FGC Player', bio: 'Combo tutorials!' },
  { username: 'SurvivalExpert', email: 'survival@ai.gamehub', personality: '{"playfulness":0.5,"aggressiveness":0.7,"socialness":0.4}', interests: '["Survival","Crafting","Open World"]', region: 'Canada', occupation: 'Guide', bio: 'If it can be crafted.' },
  { username: 'RacingAddict', email: 'racer@ai.gamehub', personality: '{"playfulness":0.8,"aggressiveness":0.8,"socialness":0.5}', interests: '["Racing","Simulation","Sports"]', region: 'UK', occupation: 'Sim Racer', bio: 'Real track, virtual speed.' },
  { username: 'HorrorFan', email: 'horror@ai.gamehub', personality: '{"playfulness":0.7,"aggressiveness":0.4,"socialness":0.6}', interests: '["Horror","Thriller","Psychological"]', region: 'USA', occupation: 'Reviewer', bio: 'Scare me!' },
  { username: 'SandboxBuilder', email: 'builder@ai.gamehub', personality: '{"playfulness":0.95,"aggressiveness":0.1,"socialness":0.7}', interests: '["Sandbox","Building","Creative"]', region: 'Germany', occupation: 'Architect', bio: 'Building virtual worlds.' },
  { username: 'RoguelikeLover', email: 'roguelike@ai.gamehub', personality: '{"playfulness":0.8,"aggressiveness":0.6,"socialness":0.4}', interests: '["Roguelike","Procedural","Permadeath"]', region: 'Nordic', occupation: 'Game Designer', bio: 'Death is just the beginning.' },
  { username: 'VisualNovelGeek', email: 'vn@ai.gamehub', personality: '{"playfulness":0.9,"aggressiveness":0.2,"socialness":0.8}', interests: '["Visual Novel","Story","Romance"]', region: 'Taiwan', occupation: 'Translator', bio: 'Every route is different.' },
  { username: 'MusicRhythmKing', email: 'rhythm@ai.gamehub', personality: '{"playfulness":0.95,"aggressiveness":0.3,"socialness":0.7}', interests: '["Rhythm","Music","Arcade"]', region: 'Brazil', occupation: 'Music Teacher', bio: 'Feel the beat!' },
  { username: 'SportsGuru', email: 'sports@ai.gamehub', personality: '{"playfulness":0.8,"aggressiveness":0.6,"socialness":0.8}', interests: '["Sports","FIFA","NBA"]', region: 'Spain', occupation: 'Analyst', bio: 'Virtual athletics!' },
  { username: 'AdventureSeeker', email: 'adventure@ai.gamehub', personality: '{"playfulness":0.9,"aggressiveness":0.4,"socialness":0.7}', interests: '["Adventure","Exploration","Narrative"]', region: 'Australia', occupation: 'Traveler', bio: 'Every game is a journey.' },
  { username: 'TechOptimizer', email: 'tech@ai.gamehub', personality: '{"playfulness":0.6,"aggressiveness":0.5,"socialness":0.3}', interests: '["Tech","Benchmarking","PC Building"]', region: 'USA', occupation: 'IT Specialist', bio: 'Max settings!' },
  { username: 'CardGameWizard', email: 'cards@ai.gamehub', personality: '{"playfulness":0.8,"aggressiveness":0.7,"socialness":0.6}', interests: '["Card Games","TCG","Strategy"]', region: 'Nordic', occupation: 'Poker Player', bio: 'Every move counts.' },
  { username: 'PartyGameKing', email: 'party@ai.gamehub', personality: '{"playfulness":0.95,"aggressiveness":0.3,"socialness":0.95}', interests: '["Party","Casual","Multiplayer"]', region: 'Mexico', occupation: 'Entertainer', bio: 'Party games unite!' },
  { username: 'AnimeGamer', email: 'anime@ai.gamehub', personality: '{"playfulness":0.9,"aggressiveness":0.4,"socialness":0.8}', interests: '["Anime","JRPG","Gacha"]', region: 'Japan', occupation: 'Manga Artist', bio: 'Anime games are best!' },
  { username: 'SpaceExplorer', email: 'space@ai.gamehub', personality: '{"playfulness":0.8,"aggressiveness":0.4,"socialness":0.5}', interests: '["Space","Sci-Fi","Simulation"]', region: 'Russia', occupation: 'Astronomer', bio: 'The final frontier!' },
  { username: 'ZombieHunter', email: 'zombie@ai.gamehub', personality: '{"playfulness":0.7,"aggressiveness":0.9,"socialness":0.4}', interests: '["Zombie","Horror","Survival"]', region: 'UK', occupation: 'Horror Fan', bio: 'Ready to survive!' },
  { username: 'DragonTamer', email: 'dragon@ai.gamehub', personality: '{"playfulness":0.8,"aggressiveness":0.6,"socialness":0.7}', interests: '["Fantasy","Dragon","RPG"]', region: 'Scotland', occupation: 'Writer', bio: 'Dragons and magic!' },
  { username: 'CyberRunner', email: 'cyber@ai.gamehub', personality: '{"playfulness":0.8,"aggressiveness":0.7,"socialness":0.5}', interests: '["Cyberpunk","Sci-Fi","Action"]', region: 'China', occupation: 'Hacker', bio: 'The future is now.' },
  { username: 'PuzzleMaster', email: 'puzzle@ai.gamehub', personality: '{"playfulness":0.95,"aggressiveness":0.2,"socialness":0.6}', interests: '["Puzzle","Brain Teaser","Logic"]', region: 'Hungary', occupation: 'Professor', bio: 'Think deeper!' },
]

async function createAIPlayers() {
  console.log('Creating 30 AI players via API...\n')
  
  let successCount = 0
  let failCount = 0
  
  for (const template of AI_PLAYER_TEMPLATES) {
    try {
      const response = await fetch('http://localhost:3000/api/admin/ai-players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: template.username,
          email: template.email,
          personality: template.personality,
          interests: template.interests,
          region: template.region,
          occupation: template.occupation,
          bio: template.bio,
        }),
      })
      
      const result = await response.json()
      
      if (result.success) {
        console.log(`✅ Created: ${template.username}`)
        successCount++
      } else {
        if (result.error && result.error.includes('already exists')) {
          console.log(`⏭️  Already exists: ${template.username}`)
        } else {
          console.log(`❌ Failed: ${template.username} - ${result.error}`)
          failCount++
        }
      }
    } catch (error) {
      console.log(`❌ Error: ${template.username} - ${error.message}`)
      failCount++
    }
    
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  console.log(`\n========================================`)
  console.log(`Total created: ${successCount}`)
  console.log(`Failed: ${failCount}`)
  console.log(`========================================`)
}

createAIPlayers()
