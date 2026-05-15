async function checkAIPlayers() {
  console.log('Checking AI players via API...\n')
  
  try {
    const response = await fetch('http://localhost:3000/api/admin/ai-players')
    const result = await response.json()
    
    console.log('API Response:', JSON.stringify(result, null, 2))
    
    if (result.success && result.data) {
      console.log(`\nTotal AI players found: ${result.data.length}`)
      result.data.forEach((player, i) => {
        console.log(`${i+1}. ${player.username} - ${player.email} - config: ${player.behavior_config ? 'yes' : 'no'}`)
      })
    }
  } catch (error) {
    console.log('Error:', error.message)
  }
}

checkAIPlayers()
