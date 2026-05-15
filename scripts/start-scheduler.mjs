async function startScheduler() {
  console.log('Starting AI Scheduler...\n')
  
  try {
    const response = await fetch('http://localhost:3000/api/admin/ai-scheduler', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'setAutoStart',
        autoStart: true,
      }),
    })
    
    const result = await response.json()
    console.log('Set auto-start:', result.message || result.error)
    
    // Now start the scheduler
    const startResponse = await fetch('http://localhost:3000/api/admin/ai-scheduler', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'start',
      }),
    })
    
    const startResult = await startResponse.json()
    console.log('Start scheduler:', startResult.message || startResult.error)
    
    // Check status
    const statusResponse = await fetch('http://localhost:3000/api/admin/ai-scheduler')
    const statusResult = await statusResponse.json()
    
    console.log('\n========================================')
    console.log('Scheduler Status:')
    console.log('========================================')
    console.log(`Running: ${statusResult.data?.isRunning ? 'Yes' : 'No'}`)
    console.log(`Active Players: ${statusResult.data?.activePlayerCount || 0}`)
    console.log(`Last Run: ${statusResult.data?.lastRunTime || 'Never'}`)
    console.log(`Auto-start: ${statusResult.data?.autoStartEnabled ? 'Enabled' : 'Disabled'}`)
    console.log('========================================')
    
  } catch (error) {
    console.error('Error:', error.message)
  }
}

startScheduler()
