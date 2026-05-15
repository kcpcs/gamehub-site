const AI_PLAYER_TEMPLATES = [
  { username: 'GamerX', personality: { playfulness: 0.8, aggressiveness: 0.3, socialness: 0.7 } },
  { username: 'StrategyMaster', personality: { playfulness: 0.5, aggressiveness: 0.6, socialness: 0.4 } },
  { username: 'CasualPlayer99', personality: { playfulness: 0.9, aggressiveness: 0.2, socialness: 0.8 } },
  { username: 'CompetitivePro', personality: { playfulness: 0.6, aggressiveness: 0.9, socialness: 0.5 } },
  { username: 'RetroGamer', personality: { playfulness: 0.7, aggressiveness: 0.1, socialness: 0.6 } },
  { username: 'SpeedrunnerX', personality: { playfulness: 0.8, aggressiveness: 0.7, socialness: 0.4 } },
  { username: 'IndieFan', personality: { playfulness: 0.9, aggressiveness: 0.2, socialness: 0.7 } },
  { username: 'HardcoreGamer', personality: { playfulness: 0.6, aggressiveness: 0.8, socialness: 0.3 } },
  { username: 'CozyGamer', personality: { playfulness: 0.95, aggressiveness: 0.1, socialness: 0.9 } },
  { username: 'BattleRoyaleKing', personality: { playfulness: 0.7, aggressiveness: 0.9, socialness: 0.6 } },
  { username: 'MMORPGAddict', personality: { playfulness: 0.6, aggressiveness: 0.5, socialness: 0.95 } },
  { username: 'FightingGameChamp', personality: { playfulness: 0.8, aggressiveness: 0.95, socialness: 0.5 } },
  { username: 'SurvivalExpert', personality: { playfulness: 0.5, aggressiveness: 0.7, socialness: 0.4 } },
  { username: 'RacingAddict', personality: { playfulness: 0.8, aggressiveness: 0.8, socialness: 0.5 } },
  { username: 'HorrorFan', personality: { playfulness: 0.7, aggressiveness: 0.4, socialness: 0.6 } },
  { username: 'SandboxBuilder', personality: { playfulness: 0.95, aggressiveness: 0.1, socialness: 0.7 } },
  { username: 'RoguelikeLover', personality: { playfulness: 0.8, aggressiveness: 0.6, socialness: 0.4 } },
  { username: 'VisualNovelGeek', personality: { playfulness: 0.9, aggressiveness: 0.2, socialness: 0.8 } },
  { username: 'MusicRhythmKing', personality: { playfulness: 0.95, aggressiveness: 0.3, socialness: 0.7 } },
  { username: 'SportsGuru', personality: { playfulness: 0.8, aggressiveness: 0.6, socialness: 0.8 } },
  { username: 'AdventureSeeker', personality: { playfulness: 0.9, aggressiveness: 0.4, socialness: 0.7 } },
  { username: 'TechOptimizer', personality: { playfulness: 0.6, aggressiveness: 0.5, socialness: 0.3 } },
  { username: 'CardGameWizard', personality: { playfulness: 0.8, aggressiveness: 0.7, socialness: 0.6 } },
  { username: 'PartyGameKing', personality: { playfulness: 0.95, aggressiveness: 0.3, socialness: 0.95 } },
  { username: 'AnimeGamer', personality: { playfulness: 0.9, aggressiveness: 0.4, socialness: 0.8 } },
  { username: 'SpaceExplorer', personality: { playfulness: 0.8, aggressiveness: 0.4, socialness: 0.5 } },
  { username: 'ZombieHunter', personality: { playfulness: 0.7, aggressiveness: 0.9, socialness: 0.4 } },
  { username: 'DragonTamer', personality: { playfulness: 0.8, aggressiveness: 0.6, socialness: 0.7 } },
  { username: 'CyberRunner', personality: { playfulness: 0.8, aggressiveness: 0.7, socialness: 0.5 } },
  { username: 'PuzzleMaster', personality: { playfulness: 0.95, aggressiveness: 0.2, socialness: 0.6 } },
]

async function createBehaviorConfigs() {
  console.log('Creating behavior configs for AI players...\n')
  
  let successCount = 0
  let failCount = 0
  let skipCount = 0
  
  for (const template of AI_PLAYER_TEMPLATES) {
    try {
      // First, get the AI player by username
      const response = await fetch('http://localhost:3000/api/admin/ai-players')
      const result = await response.json()
      
      if (!result.success) {
        console.log(`❌ Failed to fetch players: ${result.error}`)
        failCount++
        continue
      }
      
      const player = result.data.find(p => p.username === template.username)
      if (!player) {
        console.log(`❌ Player not found: ${template.username}`)
        failCount++
        continue
      }
      
      // Check if behavior config already exists
      if (player.behavior_config) {
        console.log(`⏭️  Config exists: ${template.username}`)
        skipCount++
        continue
      }
      
      // Create behavior config
      const configResponse = await fetch(`http://localhost:3000/api/admin/ai-players/${player.id}/behavior-config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activity_frequency: 0.5 + Math.random() * 0.5,
          peak_hours_start: 18 + Math.floor(Math.random() * 4),
          peak_hours_end: 22 + Math.floor(Math.random() * 3),
          timezone: 'UTC',
          preferred_activities: ['post', 'comment', 'reply', 'like'].filter(() => Math.random() > 0.3),
          response_tendency: template.personality.aggressiveness,
          conversation_style: template.personality.socialness > 0.7 ? 'friendly' : 'reserved',
          engagement_threshold: 0.3 + Math.random() * 0.4,
        }),
      })
      
      const configResult = await configResponse.json()
      
      if (configResult.success) {
        console.log(`✅ Created config: ${template.username}`)
        successCount++
      } else {
        console.log(`❌ Failed config: ${template.username} - ${configResult.error}`)
        failCount++
      }
    } catch (error) {
      console.log(`❌ Error: ${template.username} - ${error.message}`)
      failCount++
    }
    
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  console.log(`\n========================================`)
  console.log(`Configs created: ${successCount}`)
  console.log(`Skipped (already exists): ${skipCount}`)
  console.log(`Failed: ${failCount}`)
  console.log(`========================================`)
}

createBehaviorConfigs()
