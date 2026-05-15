const { PrismaClient } = require('@prisma/client')
const { PrismaLibSql } = require('@prisma/adapter-libsql')
require('dotenv').config()

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./dev.db',
})
const db = new PrismaClient({ adapter })

const PLAYER_PRESETS = {
  hardcore_gamer: [
    { username: 'ProSlayer99', seed: 'ProSlayer99' },
    { username: 'GameBeast_X', seed: 'GameBeast_X' },
    { username: 'RankedMaster', seed: 'RankedMaster' },
    { username: 'NoobSlayer42', seed: 'NoobSlayer42' },
    { username: 'EliteGamer88', seed: 'EliteGamer88' },
    { username: 'DiamondRank', seed: 'DiamondRank' },
    { username: 'SkillzMaster', seed: 'SkillzMaster' },
    { username: 'ClutchPlayer', seed: 'ClutchPlayer' },
    { username: 'GG_EZ_PZ', seed: 'GG_EZ_PZ' },
    { username: 'FPS_Beast', seed: 'FPS_Beast' },
    { username: 'MetaHunter', seed: 'MetaHunter' },
    { username: 'SoloQueueKing', seed: 'SoloQueueKing' },
    { username: 'ProGamer69', seed: 'ProGamer69' },
  ],
  casual_player: [
    { username: 'CozyGamer', seed: 'CozyGamer' },
    { username: 'LazyGamer88', seed: 'LazyGamer88' },
    { username: 'ChillPlayer', seed: 'ChillPlayer' },
    { username: 'GameNerd42', seed: 'GameNerd42' },
    { username: 'HappyGamer', seed: 'HappyGamer' },
    { username: 'RelaxedPlay', seed: 'RelaxedPlay' },
    { username: 'CuteGamerGirl', seed: 'CuteGamerGirl' },
    { username: 'SleepyGamer', seed: 'SleepyGamer' },
    { username: 'LunaPlayz', seed: 'LunaPlayz' },
    { username: 'SunshineGamer', seed: 'SunshineGamer' },
    { username: 'MellowPlayer', seed: 'MellowPlayer' },
    { username: 'CozyGamerBabe', seed: 'CozyGamerBabe' },
    { username: 'GamerMom', seed: 'GamerMom' },
  ],
  guide_writer: [
    { username: 'GuideMaster', seed: 'GuideMaster' },
    { username: 'ProTutorial', seed: 'ProTutorial' },
    { username: 'HowToGamer', seed: 'HowToGamer' },
    { username: 'StrategyNerd', seed: 'StrategyNerd' },
    { username: 'GameProfessor', seed: 'GameProfessor' },
    { username: 'TipsExpert', seed: 'TipsExpert' },
    { username: 'WalkthroughKing', seed: 'WalkthroughKing' },
    { username: 'GameMentor', seed: 'GameMentor' },
    { username: 'TutorialGuru', seed: 'TutorialGuru' },
    { username: 'StrategyGuide', seed: 'StrategyGuide' },
    { username: 'ProGuideMaker', seed: 'ProGuideMaker' },
    { username: 'GameCoach', seed: 'GameCoach' },
    { username: 'ExpertGamer', seed: 'ExpertGamer' },
  ],
  code_hunter: [
    { username: 'CodeHunter_X', seed: 'CodeHunter_X' },
    { username: 'FreebieFinder', seed: 'FreebieFinder' },
    { username: 'RedeemMaster', seed: 'RedeemMaster' },
    { username: 'PromoHunter', seed: 'PromoHunter' },
    { username: 'CodeNinja', seed: 'CodeNinja' },
    { username: 'GiveawayKing', seed: 'GiveawayKing' },
    { username: 'FreeCodeGuy', seed: 'FreeCodeGuy' },
    { username: 'RewardHunter', seed: 'RewardHunter' },
    { username: 'CodeFinder', seed: 'CodeFinder' },
    { username: 'GiftCodePro', seed: 'GiftCodePro' },
    { username: 'FreeStuffPro', seed: 'FreeStuffPro' },
    { username: 'DealHunter', seed: 'DealHunter' },
    { username: 'CodeMaster', seed: 'CodeMaster' },
  ],
  news_enthusiast: [
    { username: 'NewsJunkie', seed: 'NewsJunkie' },
    { username: 'PatchNotesPro', seed: 'PatchNotesPro' },
    { username: 'GameReporter', seed: 'GameReporter' },
    { username: 'EsportsFan', seed: 'EsportsFan' },
    { username: 'LeakHunter', seed: 'LeakHunter' },
    { username: 'GameNewsGuy', seed: 'GameNewsGuy' },
    { username: 'UpdateWatcher', seed: 'UpdateWatcher' },
    { username: 'DevTracker', seed: 'DevTracker' },
    { username: 'RoadmapFan', seed: 'RoadmapFan' },
    { username: 'NewsGeek', seed: 'NewsGeek' },
    { username: 'GamingReporter', seed: 'GamingReporter' },
    { username: 'PatchTracker', seed: 'PatchTracker' },
    { username: 'GameJournalist', seed: 'GameJournalist' },
  ],
  community_helper: [
    { username: 'HelpfulGamer', seed: 'HelpfulGamer' },
    { username: 'CommunityHero', seed: 'CommunityHero' },
    { username: 'NewPlayerHelper', seed: 'NewPlayerHelper' },
    { username: 'FriendlyMod', seed: 'FriendlyMod' },
    { username: 'SupportGuy', seed: 'SupportGuy' },
    { username: 'HelpDeskGamer', seed: 'HelpDeskGamer' },
    { username: 'CommunityHelper', seed: 'CommunityHelper' },
    { username: 'GameAdvisor', seed: 'GameAdvisor' },
    { username: 'NiceGamer', seed: 'NiceGamer' },
    { username: 'SupportHero', seed: 'SupportHero' },
    { username: 'FriendlyHelper', seed: 'FriendlyHelper' },
    { username: 'CommunityNurse', seed: 'CommunityNurse' },
    { username: 'HelpingHand', seed: 'HelpingHand' },
  ],
}

const PLAYER_TYPE_CONFIGS = {
  hardcore_gamer: {
    personality: { tone: 'analytical', traits: ['competitive', 'detail-oriented', 'knowledgeable', 'direct'], activity_level: 0.85 },
    topics: ['tier lists', 'meta builds', 'competitive strategy', 'character optimization', 'DPS calculations', 'endgame content', 'PvP', 'speedrunning'],
  },
  casual_player: {
    personality: { tone: 'friendly', traits: ['laid-back', 'supportive', 'humorous', 'positive'], activity_level: 0.4 },
    topics: ['casual gaming', 'cute characters', 'exploration', 'events', 'daily rewards', 'screenshots', 'fan art appreciation'],
  },
  guide_writer: {
    personality: { tone: 'formal', traits: ['thorough', 'educational', 'patient', 'structured'], activity_level: 0.7 },
    topics: ['beginner guides', 'advanced tutorials', 'game mechanics', 'resource optimization', 'progression tips', 'walkthroughs', 'hidden secrets'],
  },
  code_hunter: {
    personality: { tone: 'casual', traits: ['resourceful', 'quick', 'sharing', 'alert'], activity_level: 0.7 },
    topics: ['redeem codes', 'freebies', 'limited events', 'promo tracking', 'reward optimization', 'giveaways', 'daily logins'],
  },
  news_enthusiast: {
    personality: { tone: 'enthusiastic', traits: ['observant', 'timely', 'informed', 'speculative'], activity_level: 0.7 },
    topics: ['patch notes', 'game updates', 'balance changes', 'roadmaps', 'developer news', 'leaks', 'upcoming content', 'esports'],
  },
  community_helper: {
    personality: { tone: 'friendly', traits: ['patient', 'empathetic', 'knowledgeable', 'supportive'], activity_level: 0.75 },
    topics: ['troubleshooting', 'FAQ answers', 'new player help', 'community support', 'game mechanics explanations', 'team building advice'],
  },
}

const REGIONS = [
  'North America',
  'Europe',
  'Asia',
  'South America',
  'Oceania',
  'Africa',
]

const BIO_TEMPLATES = {
  hardcore_gamer: [
    'Competitive gamer focusing on ranked play and esports.',
    'Pro player aiming for top ranks in multiple games.',
    'FPS and MOBA enthusiast with thousands of hours.',
    'Dedicated gamer who takes competition seriously.',
    'Always chasing the next rank up.',
  ],
  casual_player: [
    'Just here to have fun and enjoy games!',
    'Casual gamer who loves cozy and relaxing games.',
    'Playing games to unwind after work.',
    'Love exploring new games and making friends.',
    'Gaming is my favorite hobby!',
  ],
  guide_writer: [
    'Helping others learn and improve their gameplay.',
    'Creating guides and tutorials for new players.',
    'Sharing knowledge and strategies with the community.',
    'Passionate about helping others succeed.',
    'Guide creator focused on quality content.',
  ],
  code_hunter: [
    'Hunting for the latest redeem codes and freebies.',
    'Sharing codes and rewards with the community.',
    'Always on the lookout for new promotions.',
    'Helping others get free in-game items.',
    'Code collector and sharer extraordinaire.',
  ],
  news_enthusiast: [
    'Keeping up with the latest gaming news.',
    'Reporting on patch notes and game updates.',
    'Esports fan who loves competitive gaming.',
    'Always the first to know about new releases.',
    'Gaming news junkie and community reporter.',
  ],
  community_helper: [
    'Here to help new players get started.',
    'Community moderator and friendly helper.',
    'Answering questions and assisting players.',
    'Making the community a better place.',
    'Supportive gamer helping others thrive.',
  ],
}

function getAvatarUrl(seed) {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`
}

function shuffleArray(array) {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function randomDateInLastYear() {
  const now = new Date()
  const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
  const randomTime = oneYearAgo.getTime() + Math.random() * (now.getTime() - oneYearAgo.getTime())
  return new Date(randomTime)
}

async function main() {
  console.log('Starting AI player seeding...')

  const playerTypes = Object.keys(PLAYER_PRESETS)
  const totalPlayers = 30
  const playersPerType = Math.floor(totalPlayers / playerTypes.length)
  const extraPlayers = totalPlayers % playerTypes.length

  const allPlayers = []

  for (let typeIndex = 0; typeIndex < playerTypes.length; typeIndex++) {
    const playerType = playerTypes[typeIndex]
    const presets = shuffleArray(PLAYER_PRESETS[playerType])
    const count = playersPerType + (typeIndex < extraPlayers ? 1 : 0)

    for (let i = 0; i < count; i++) {
      const preset = presets[i % presets.length]
      const config = PLAYER_TYPE_CONFIGS[playerType]

      const player = {
        username: preset.username,
        email: `${preset.username.toLowerCase().replace(/[^a-z0-9]/g, '')}@gamehub.ai`,
        avatar_url: getAvatarUrl(preset.seed),
        age: Math.floor(Math.random() * 25) + 18,
        occupation: getRandomElement([
          'Student',
          'Professional Gamer',
          'Content Creator',
          'Software Engineer',
          'Graphic Designer',
          'Teacher',
          'Marketing',
          'Freelancer',
        ]),
        bio: getRandomElement(BIO_TEMPLATES[playerType]),
        region: getRandomElement(REGIONS),
        personality: JSON.stringify({
          tone: config.personality.tone,
          traits: config.personality.traits,
          introversion: Math.random(),
          agreeableness: Math.random(),
          conscientiousness: Math.random(),
          neuroticism: Math.random(),
          openness: Math.random(),
        }),
        interests: JSON.stringify(config.topics.slice(0, 4)),
        activity_level: config.personality.activity_level,
        status: Math.random() > 0.3 ? 'active' : 'inactive',
        joined_at_simulated: randomDateInLastYear(),
        follower_ids: JSON.stringify([]),
      }

      allPlayers.push(player)
    }
  }

  console.log(`Creating ${allPlayers.length} AI players...`)

  for (const playerData of allPlayers) {
    try {
      await db.aIPlayer.create({
        data: playerData,
      })
      console.log(`Created player: ${playerData.username}`)
    } catch (error) {
      console.log(`Skipping ${playerData.username}: ${error.message}`)
    }
  }

  console.log('Setting up follower relationships...')
  
  const createdPlayers = await db.aIPlayer.findMany()
  
  for (const player of createdPlayers) {
    const otherPlayers = createdPlayers.filter(p => p.id !== player.id)
    const shuffledOthers = shuffleArray(otherPlayers)
    const followerCount = Math.floor(Math.random() * 8) + 2
    const followers = shuffledOthers.slice(0, followerCount).map(p => p.id)
    
    await db.aIPlayer.update({
      where: { id: player.id },
      data: {
        follower_ids: JSON.stringify(followers),
      },
    })
  }

  console.log('Seeding complete!')
  
  const count = await db.aIPlayer.count()
  console.log(`Total AI players created: ${count}`)

  await db.$disconnect()
}

main().catch((error) => {
  console.error('Error seeding AI players:', error)
  process.exit(1)
})
