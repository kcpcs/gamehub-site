async function activateAllAIPlayers() {
  console.log('Activating all AI players and adding behavior configs...\n')
  
  // First get all AI players (page 1)
  const page1 = await fetch('http://localhost:3000/api/admin/ai-players?page=1&limit=30')
  const result1 = await page1.json()
  
  // Get page 2 if exists
  let allPlayers = result1.data || []
  if (result1.pages > 1) {
    const page2 = await fetch('http://localhost:3000/api/admin/ai-players?page=2&limit=30')
    const result2 = await page2.json()
    allPlayers = [...allPlayers, ...(result2.data || [])]
  }
  
  console.log(`Found ${allPlayers.length} AI players\n`)
  
  let successCount = 0
  let failCount = 0
  
  for (const player of allPlayers) {
    try {
      // Activate player and add behavior config
      const patchResponse = await fetch(`http://localhost:3000/api/admin/ai-players/${player.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'active',
          behavior: {
            wake_up_time: '08:00',
            sleep_time: '00:00',
            activity_interval_min: 30,
            activity_interval_max: 120,
            post_probability: 0.2 + Math.random() * 0.3,
            comment_probability: 0.3 + Math.random() * 0.4,
            reply_probability: 0.1 + Math.random() * 0.2,
            typing_speed_min: 3,
            typing_speed_max: 8,
            thinking_time_min: 2,
            thinking_time_max: 10,
          },
        }),
      })
      
      const patchResult = await patchResponse.json()
      
      if (patchResult.success) {
        console.log(`Activated: ${player.username}`)
        successCount++
      } else {
        console.log(`Failed: ${player.username} - ${patchResult.error}`)
        failCount++
      }
    } catch (error) {
      console.log(`Error: ${player.username} - ${error.message}`)
      failCount++
    }
    
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  console.log(`\n========================================`)
  console.log(`Total players: ${allPlayers.length}`)
  console.log(`Activated: ${successCount}`)
  console.log(`Failed: ${failCount}`)
  console.log(`========================================`)
  
  if (successCount > 0) {
    console.log('\nNext step: Start the AI scheduler from the admin panel!')
  }
}

activateAllAIPlayers()
