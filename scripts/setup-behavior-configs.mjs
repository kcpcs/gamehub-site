const AI_PLAYER_DATA = [
  { username: 'GamerX', p: { playfulness: 0.8, aggressiveness: 0.3, socialness: 0.7 } },
  { username: 'StrategyMaster', p: { playfulness: 0.5, aggressiveness: 0.6, socialness: 0.4 } },
  { username: 'CasualPlayer99', p: { playfulness: 0.9, aggressiveness: 0.2, socialness: 0.8 } },
  { username: 'CompetitivePro', p: { playfulness: 0.6, aggressiveness: 0.9, socialness: 0.5 } },
  { username: 'RetroGamer', p: { playfulness: 0.7, aggressiveness: 0.1, socialness: 0.6 } },
  { username: 'SpeedrunnerX', p: { playfulness: 0.8, aggressiveness: 0.7, socialness: 0.4 } },
  { username: 'IndieFan', p: { playfulness: 0.9, aggressiveness: 0.2, socialness: 0.7 } },
  { username: 'HardcoreGamer', p: { playfulness: 0.6, aggressiveness: 0.8, socialness: 0.3 } },
  { username: 'CozyGamer', p: { playfulness: 0.95, aggressiveness: 0.1, socialness: 0.9 } },
  { username: 'BattleRoyaleKing', p: { playfulness: 0.7, aggressiveness: 0.9, socialness: 0.6 } },
  { username: 'MMORPGAddict', p: { playfulness: 0.6, aggressiveness: 0.5, socialness: 0.95 } },
  { username: 'FightingGameChamp', p: { playfulness: 0.8, aggressiveness: 0.95, socialness: 0.5 } },
  { username: 'SurvivalExpert', p: { playfulness: 0.5, aggressiveness: 0.7, socialness: 0.4 } },
  { username: 'RacingAddict', p: { playfulness: 0.8, aggressiveness: 0.8, socialness: 0.5 } },
  { username: 'HorrorFan', p: { playfulness: 0.7, aggressiveness: 0.4, socialness: 0.6 } },
  { username: 'SandboxBuilder', p: { playfulness: 0.95, aggressiveness: 0.1, socialness: 0.7 } },
  { username: 'RoguelikeLover', p: { playfulness: 0.8, aggressiveness: 0.6, socialness: 0.4 } },
  { username: 'VisualNovelGeek', p: { playfulness: 0.9, aggressiveness: 0.2, socialness: 0.8 } },
  { username: 'MusicRhythmKing', p: { playfulness: 0.95, aggressiveness: 0.3, socialness: 0.7 } },
  { username: 'SportsGuru', p: { playfulness: 0.8, aggressiveness: 0.6, socialness: 0.8 } },
  { username: 'AdventureSeeker', p: { playfulness: 0.9, aggressiveness: 0.4, socialness: 0.7 } },
  { username: 'TechOptimizer', p: { playfulness: 0.6, aggressiveness: 0.5, socialness: 0.3 } },
  { username: 'CardGameWizard', p: { playfulness: 0.8, aggressiveness: 0.7, socialness: 0.6 } },
  { username: 'PartyGameKing', p: { playfulness: 0.95, aggressiveness: 0.3, socialness: 0.95 } },
  { username: 'AnimeGamer', p: { playfulness: 0.9, aggressiveness: 0.4, socialness: 0.8 } },
  { username: 'SpaceExplorer', p: { playfulness: 0.8, aggressiveness: 0.4, socialness: 0.5 } },
  { username: 'ZombieHunter', p: { playfulness: 0.7, aggressiveness: 0.9, socialness: 0.4 } },
  { username: 'DragonTamer', p: { playfulness: 0.8, aggressiveness: 0.6, socialness: 0.7 } },
  { username: 'CyberRunner', p: { playfulness: 0.8, aggressiveness: 0.7, socialness: 0.5 } },
  { username: 'PuzzleMaster', p: { playfulness: 0.95, aggressiveness: 0.2, socialness: 0.6 } },
]

async function setupBehaviorConfigs() {
  console.log('Setting up behavior configs for AI players...\n')
  
  // First get all AI players
  const response = await fetch('http://localhost:3000/api/admin/ai-players')
  const result = await response.json()
  
  if (!result.success) {
    console.log(`Failed to fetch players: ${result.error}`)
    return
  }
  
  let successCount = 0
  let skipCount = 0
  let failCount = 0
  
  for (const data of AI_PLAYER_DATA) {
    const player = result.data.find(p => p.username === data.username)
    if (!player) {
      console.log(`Player not found: ${data.username}`)
      failCount++
      continue
    }
    
    if (player.behavior_config) {
      console.log(`Config exists: ${data.username}`)
      skipCount++
      continue
    }
    
    try {
      // Use PATCH to add behavior config
      const patchResponse = await fetch(`http://localhost:3000/api/admin/ai-players/${player.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          behavior: {
            wake_up_time: '08:00',
            sleep_time: '00:00',
            activity_interval_min: 30,
            activity_interval_max: 120,
            post_probability: 0.3 + Math.random() * 0.3,
            comment_probability: 0.4 + Math.random() * 0.3,
            reply_probability: 0.2 + Math.random() * 0.2,
            typing_speed_min: 3,
            typing_speed_max: 8,
            thinking_time_min: 2,
            thinking_time_max: 10,
          },
        }),
      })
      
      const patchResult = await patchResponse.json()
      
      if (patchResult.success) {
        console.log(`Added config: ${data.username}`)
        successCount++
      } else {
        console.log(`Failed config: ${data.username} - ${patchResult.error}`)
        failCount++
      }
    } catch (error) {
      console.log(`Error: ${data.username} - ${error.message}`)
      failCount++
    }
    
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  console.log(`\n========================================`)
  console.log(`Configs added: ${successCount}`)
  console.log(`Skipped: ${skipCount}`)
  console.log(`Failed: ${failCount}`)
  console.log(`========================================`)
}

setupBehaviorConfigs()
