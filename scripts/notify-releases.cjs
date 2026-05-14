require('dotenv').config();

const isDryRun = process.argv.includes('--dry-run');

async function notifyUpcomingReleases() {
  console.log(`[${new Date().toISOString()}] Starting release notifications...`);
  console.log(`Dry run mode: ${isDryRun ? 'ON' : 'OFF'}`);

  const now = new Date();
  const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const upcomingGames = [
    { id: 'game1', name: 'Elden Ring DLC', slug: 'elden-ring-dlc', release_date: next24Hours, cover_url: 'https://example.com/cover.jpg' },
    { id: 'game2', name: 'Final Fantasy XVI', slug: 'final-fantasy-xvi', release_date: next24Hours, cover_url: 'https://example.com/ff16.jpg' }
  ];

  if (upcomingGames.length === 0) {
    console.log('No upcoming releases in the next 24 hours');
    return { notified: 0, games: [] };
  }

  console.log(`Found ${upcomingGames.length} upcoming releases:`);
  upcomingGames.forEach(game => {
    const releaseDate = game.release_date ? new Date(game.release_date).toLocaleDateString() : 'Unknown';
    console.log(`  - ${game.name} (${releaseDate})`);
  });

  const subscribers = [
    { id: 'sub1', email: 'user1@example.com', games: JSON.stringify(['elden-ring-dlc']), status: 'active' },
    { id: 'sub2', email: 'user2@example.com', games: JSON.stringify(['final-fantasy-xvi']), status: 'active' },
    { id: 'sub3', email: 'user3@example.com', games: JSON.stringify([]), status: 'active' },
    { id: 'sub4', email: 'user4@example.com', games: JSON.stringify(['elden-ring-dlc', 'final-fantasy-xvi']), status: 'active' }
  ];

  console.log(`Found ${subscribers.length} active subscribers`);

  if (isDryRun) {
    console.log(`\n[DRY RUN] Would have notified ${subscribers.length} subscribers about ${upcomingGames.length} games`);
    return {
      notified: subscribers.length,
      games: upcomingGames,
      dryRun: true
    };
  }

  let emailNotificationsSent = 0;

  for (const game of upcomingGames) {
    for (const subscriber of subscribers) {
      try {
        const gameList = subscriber.games ? JSON.parse(subscriber.games) : [];
        
        if (gameList.length > 0 && !gameList.includes(game.slug)) {
          continue;
        }

        console.log(`Notifying ${subscriber.email} about ${game.name}`);
        emailNotificationsSent++;
      } catch (error) {
        console.error(`Error notifying ${subscriber.email}:`, error);
      }
    }
  }

  console.log(`\nSummary:`);
  console.log(`Total games: ${upcomingGames.length}`);
  console.log(`Notifications sent: ${emailNotificationsSent}`);

  return {
    notified: emailNotificationsSent,
    games: upcomingGames,
    dryRun: false
  };
}

if (require.main === module) {
  notifyUpcomingReleases()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { notifyUpcomingReleases };
