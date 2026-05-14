import type { Metadata } from 'next'
import { db } from '@/lib/db'
import { Breadcrumb } from '@/components/Breadcrumb'
import { VideoEmbed, LiveStreamsSection } from '@/components/VideoEmbed'
import { LikeButton, BookmarkButton, HelpfulVote, CommentSection, ShareButtons, ReadingProgress } from '@/components/InteractiveComponents'
import { AuthorCard, RelatedArticles } from '@/components/AuthorComponents'
import { TableOfContentsNav } from '@/components/TableOfContentsNav'
import { FAQSection } from '@/components/FAQSection'
import { FAQSchema } from '@/components/FAQSchema'
import { Clock, Star } from 'lucide-react'
import { JsonLdScript, getArticleSchema, getBreadcrumbSchema } from '@/components/seo/JsonLd'
import { getGameCoverUrl } from '@/lib/game-images'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  
  try {
    const article = await db.article.findUnique({
      where: { slug },
      include: { game: true },
    })

    if (article) {
      return {
        title: `${article.title} | GameHub`,
        description: article.excerpt || `Read this guide about ${article.game?.name || 'games'} on GameHub.`,
        openGraph: {
          title: article.title,
          description: article.excerpt || `Read this guide about ${article.game?.name || 'games'} on GameHub.`,
          type: 'article',
          images: [
            {
              url: article.cover_url || getGameCoverUrl(article.title),
              width: 1200,
              height: 630,
              alt: article.title,
            },
          ],
        },
        twitter: {
          card: 'summary_large_image',
          title: article.title,
          description: article.excerpt || `Read this guide about ${article.game?.name || 'games'} on GameHub.`,
          images: [article.cover_url || getGameCoverUrl(article.title)],
        },
      }
    }
  } catch {
    // Fall through to default metadata
  }

  // Fallback metadata
  return {
    title: 'Game Guide | GameHub',
    description: 'Read expert game guides and walkthroughs on GameHub.',
  }
}

interface GuideDetailPageProps {
  params: {
    slug: string
  }
}

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  read_time: number
  view_count: number
  like_count: number
  share_count: number
  published_at: string
  difficulty: string
  game: {
    name: string
    slug: string
    cover_url: string
  }
  author: {
    name: string
    bio: string
    level: number
    reputation: number
    articles: number
    followers: number
    join_date: string
    socialLinks?: { twitter?: string; youtube?: string; twitch?: string }
  }
}

const fallbackArticles: Record<string, Article> = {
  'minecraft-survival-guide-2024': {
    id: '1',
    title: 'Minecraft Survival Guide 2024: Ultimate Beginner to Expert Guide',
    slug: 'minecraft-survival-guide-2024',
    excerpt: 'Master Minecraft survival with this comprehensive guide covering everything from day one basics to advanced redstone engineering.',
    content: `## Getting Started

Welcome to your Minecraft adventure! This guide will help you survive and thrive in the blocky world of Minecraft.

### Day 1: The Basics

When you first spawn, you'll need to gather basic resources:

1. **Punch trees** - Get wood to craft tools
2. **Craft a workbench** - Essential for all crafting
3. **Build a shelter** - Protect yourself from monsters at night

### Gathering Resources

Different biomes offer different resources:

- **Forests**: Wood, berries, animals
- **Mountains**: Stone, coal, iron
- **Deserts**: Sand, cactus
- **Oceans**: Fish, treasure chests

### Tools and Equipment

Craft better tools to mine faster and fight stronger:

| Tool | Material | Uses |
|------|----------|------|
| Wooden | Wood | Basic mining |
| Stone | Cobblestone | Better mining |
| Iron | Iron Ingot | Fast mining |
| Diamond | Diamond | Best mining |

### Combat Tips

Always be prepared for danger:

- Carry a sword and shield
- Wear armor
- Use potions for extra effects
- Build traps to protect your base

### Building Your Base

A good base should have:

- Storage room
- Crafting area
- Farming station
- Enchanting room

### Farming and Food

Never run out of food:

1. Plant crops
2. Breed animals
3. Fish in water
4. Hunt mobs

### Advanced Redstone

Once you're comfortable, try redstone:

- Build automatic farms
- Create traps
- Make working doors and gates
- Build complex contraptions

### Exploring the Nether

When you're ready for a challenge:

1. Build a Nether portal
2. Bring fire resistance potions
3. Watch out for dangerous mobs
4. Collect rare resources like netherite

### Conclusion

Minecraft is all about creativity and survival. Take your time, experiment, and have fun!`,
    read_time: 15,
    view_count: 12580,
    like_count: 2340,
    share_count: 890,
    published_at: 'January 15, 2024',
    difficulty: 'Intermediate',
    game: {
      name: 'Minecraft',
      slug: 'minecraft',
      cover_url: 'https://images.unsplash.com/photo-1622182371017-99b005124524?w=1200&h=630&fit=crop'
    },
    author: {
      name: 'ProGamer42',
      bio: 'Minecraft veteran with 10+ years of experience. Creator of popular YouTube tutorials.',
      level: 8,
      reputation: 12500,
      articles: 45,
      followers: 18500,
      join_date: 'March 2020',
      socialLinks: { twitter: 'ProGamer42', youtube: 'ProGamer42', twitch: 'ProGamer42' }
    }
  },
  'genshin-impact-beginners-guide': {
    id: '2',
    title: 'Genshin Impact Beginners Guide 2024',
    slug: 'genshin-impact-beginners-guide',
    excerpt: 'Start your journey in Teyvat with this comprehensive beginner guide covering characters, artifacts, and exploration tips.',
    content: `## Welcome to Teyvat

Welcome to Genshin Impact! This guide will help you start your adventure in the beautiful world of Teyvat.

### Getting Started

When you first start, focus on:

1. **Complete the Archon Quests** - Unlock new regions
2. **Collect Characters** - Build your team
3. **Upgrade Weapons** - Increase your power

### Character Elements

Each character has a unique element:

- **Pyro** - Fire attacks
- **Hydro** - Water attacks
- **Anemo** - Wind attacks
- **Electro** - Lightning attacks
- **Cryo** - Ice attacks
- **Geo** - Earth attacks
- **Dendro** - Nature attacks

### Artifacts

Equip artifacts to boost your characters:

| Set | Bonus | Best For |
|-----|-------|----------|
| Gladiator's Finale | ATK Boost | DPS Characters |
| Viridescent Venerer | Anemo Bonus | Anemo Characters |
| Noblesse Oblige | Team Buff | Support Characters |

### Tips for New Players

- Explore every corner of the map
- Complete daily commissions
- Join co-op with friends
- Save primogems for limited banners

### Conclusion

Genshin Impact offers endless adventure. Enjoy your journey!`,
    read_time: 12,
    view_count: 25600,
    like_count: 5200,
    share_count: 1850,
    published_at: 'February 1, 2024',
    difficulty: 'Beginner',
    game: {
      name: 'Genshin Impact',
      slug: 'genshin-impact',
      cover_url: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=1200&h=630&fit=crop'
    },
    author: {
      name: 'GenshinMaster',
      bio: 'Genshin Impact content creator with 500k+ subscribers.',
      level: 10,
      reputation: 45000,
      articles: 89,
      followers: 52000,
      join_date: 'January 2021',
      socialLinks: { twitter: 'GenshinMaster', youtube: 'GenshinMaster' }
    }
  },
  'valorant-agent-guide': {
    id: '3',
    title: 'Valorant Agent Guide: Best Agents for Ranked',
    slug: 'valorant-agent-guide',
    excerpt: 'Learn which agents are best for ranked play and how to master their abilities.',
    content: `## Choosing Your Agent

In Valorant, choosing the right agent is crucial for success in ranked matches.

### Agent Roles

Each agent has a specific role:

1. **Duelist** - Entry fragger, aggressive play
2. **Initiator** - Start fights, gather info
3. **Controller** - Control map space
4. **Sentinel** - Protect teammates, area denial

### Best Agents for Ranked

**Duelists:**
- Jett - Best for mobility
- Reyna - Best for self-sustain
- Raze - Best for area damage

**Initiators:**
- Sova - Best for recon
- Skye - Best for healing and utility
- Breach - Best for crowd control

**Controllers:**
- Omen - Best for smokes
- Astra - Best for global utility
- Brimstone - Best for area control

**Sentinels:**
- Sage - Best for healing
- Cypher - Best for traps
- Killjoy - Best for defense

### Tips for Agent Mastery

- Focus on 1-2 agents per role
- Learn lineups and ability combos
- Adapt to team composition
- Practice in deathmatch

### Conclusion

Mastering your agent is key to climbing the ranked ladder!`,
    read_time: 10,
    view_count: 18900,
    like_count: 3800,
    share_count: 1200,
    published_at: 'January 20, 2024',
    difficulty: 'Intermediate',
    game: {
      name: 'Valorant',
      slug: 'valorant',
      cover_url: 'https://images.unsplash.com/photo-1632581161548-f53c25988b48?w=1200&h=630&fit=crop'
    },
    author: {
      name: 'ValorantPro',
      bio: 'Professional Valorant player and coach.',
      level: 9,
      reputation: 32000,
      articles: 67,
      followers: 38000,
      join_date: 'June 2020',
      socialLinks: { twitter: 'ValorantPro', twitch: 'ValorantPro' }
    }
  },
  'apex-legends-weapons-guide': {
    id: '4',
    title: 'Apex Legends Best Weapons Guide 2024',
    slug: 'apex-legends-weapons-guide',
    excerpt: 'Master every weapon in Apex Legends with this comprehensive guide.',
    content: `## Weapon Overview

Apex Legends offers a wide variety of weapons. Understanding each one is key to victory.

### Assault Rifles

- **R-301 Carbine** - All-around excellent weapon
- **Flatline** - High damage, great for mid-range
- **Hemlok** - Burst fire, precise control
- **VK-47 Flatline** - Heavy hitting assault rifle

### SMGs

- **R-99** - Fast fire rate, close range monster
- **Prowler** - Can be converted to burst fire
- **Alternator** - Reliable early game weapon

### Shotguns

- **Mastiff** - High damage per shot
- **EVA-8** - Fast fire rate shotgun
- **Peacekeeper** - Great for close quarters

### Sniper Rifles

- **Kraber** - One-shot kill potential
- **Longbow** - Semi-auto sniper
- **Triple Take** - Unique spread pattern

### Tips for Weapon Mastery

- Practice with different weapons
- Learn recoil patterns
- Understand ammo types
- Always pick up attachments

### Conclusion

Mastering weapons takes practice, but these tips will help you improve!`,
    read_time: 8,
    view_count: 14500,
    like_count: 2900,
    share_count: 980,
    published_at: 'January 18, 2024',
    difficulty: 'Beginner',
    game: {
      name: 'Apex Legends',
      slug: 'apex-legends',
      cover_url: 'https://images.unsplash.com/photo-1611605698335-5b81948d5315?w=1200&h=630&fit=crop'
    },
    author: {
      name: 'ApexChampion',
      bio: 'Apex Legends pro player with 1000+ wins.',
      level: 9,
      reputation: 28000,
      articles: 54,
      followers: 32000,
      join_date: 'August 2019',
      socialLinks: { twitter: 'ApexChampion', twitch: 'ApexChampion' }
    }
  },
  'league-of-legends-champion-guide': {
    id: '5',
    title: 'League of Legends Champion Guide',
    slug: 'league-of-legends-champion-guide',
    excerpt: 'Learn about all champions and find your main.',
    content: `## Champion Roles

In League of Legends, champions fill different roles:

### Top Lane

- **Tanks**: Ornn, Sion, Malphite
- **Fighters**: Darius, Garen, Fiora
- **Split Pushers**: Tryndamere, Jax, Camille

### Jungle

- **Early Game**: Lee Sin, Vi, Elise
- **Farm Junglers**: Warwick, Fiddlesticks
- **Teamfight**: Sejuani, Nunu, Zac

### Mid Lane

- **Mages**: Syndra, Orianna, Viktor
- **Assassins**: Zed, Talon, Katarina
- **Control Mages**: Azir, Cassiopeia, Vel'Koz

### ADC

- **Hyper Carries**: Vayne, Caitlyn, Tristana
- **Teamfight ADCs**: Jinx, Sivir, Miss Fortune
- **Mobile ADCs**: Kalista, Ezreal, Corki

### Support

- **Healers**: Soraka, Nami, Lulu
- **Engagers**: Leona, Thresh, Blitzcrank
- **Enchanters**: Janna, Karma, Yuumi

### Tips for Learning Champions

- Start with 1-2 champions per role
- Watch pro players
- Practice in normal games
- Learn matchups

### Conclusion

Finding your main takes time, but keep playing and you'll find your champion!`,
    read_time: 12,
    view_count: 22000,
    like_count: 4500,
    share_count: 1500,
    published_at: 'February 5, 2024',
    difficulty: 'Intermediate',
    game: {
      name: 'League of Legends',
      slug: 'league-of-legends',
      cover_url: 'https://images.unsplash.com/photo-1551632436-960106b58617?w=1200&h=630&fit=crop'
    },
    author: {
      name: 'LoLMaster',
      bio: 'League of Legends content creator and coach.',
      level: 10,
      reputation: 52000,
      articles: 98,
      followers: 65000,
      join_date: 'March 2015',
      socialLinks: { twitter: 'LoLMaster', youtube: 'LoLMaster' }
    }
  },
  'hollow-knight-advanced-guide': {
    id: '6',
    title: 'Hollow Knight Advanced Guide',
    slug: 'hollow-knight-advanced-guide',
    excerpt: 'Deep dive into Hollow Knight advanced gameplay and hidden content',
    content: `## Hollow Knight Advanced Guide

Welcome to the advanced world of Hollow Knight! This guide will help you explore this beautiful yet dangerous underground kingdom.

### Map Exploration Tips

Master these techniques for efficient exploration:

1. **Mark important locations** - Use map marking feature
2. **Learn to dash** - Key to fast movement
3. **Double jump** - Reach higher places
4. **Dream gate** - Fast travel

### Boss Battle Strategies

Main Boss tactics:

- **False Knight**: Long attack intervals, easy to dodge
- **Hornet**: Fast movement, watch for jumping attacks
- **Mantis Lords**: Triple slash needs precise dodging
- **Hollow Knight**: Final boss, master all skills

### Hidden Areas

Many hidden areas waiting to be discovered:

- **Deepnest**: Hidden insect nest
- **Ancient Basin**: Core area of the game
- **Grimm Troupe**: Mysterious performance venue
- **Godhome**: Ultimate boss challenge area

### Charm Builds

Choose the right charm combinations:

| Charm | Effect | Recommended Build |
|------|------|-----------------|
| Soul Master | Increase soul gain | Combat build |
| Quick Focus | Fast soul regeneration | Sustain build |
| Unbreakable Strength | Increase attack power | Damage build |

### Ending Unlocks

Game has multiple endings:

1. **Normal Ending**: Defeat the Hollow Knight
2. **True Ending**: Complete all conditions
3. **Hidden Ending**: Special conditions trigger

### Conclusion

Hollow Knight is a deep game, enjoy your exploration!`,
    read_time: 10,
    view_count: 8500,
    like_count: 1800,
    share_count: 520,
    published_at: 'January 20, 2024',
    difficulty: 'Expert',
    game: {
      name: 'Hollow Knight',
      slug: 'hollow-knight',
      cover_url: getGameCoverUrl('Hollow Knight')
    },
    author: {
      name: 'Hollow Knight Expert',
      bio: 'Hollow Knight enthusiast, completed all endings and achievements',
      level: 7,
      reputation: 8500,
      articles: 23,
      followers: 3200,
      join_date: 'June 2023',
      socialLinks: { twitter: 'HollowKnightPro' }
    }
  },
  'god-of-war-beginners-guide': {
    id: '7',
    title: 'God of War Beginner Guide',
    slug: 'god-of-war-beginners-guide',
    excerpt: 'Embark on Kratos Nordic journey, master combat and exploration',
    content: `## God of War Beginner Guide

Welcome to the world of God of War! This guide will help you start your Nordic journey.

### Combat Basics

God of War combat system is deep and strategic:

1. **Light Attack**: Fast consecutive attacks
2. **Heavy Attack**: High damage but slower
3. **Parry**: Perfect parry enables counterattack
4. **Dodge**: Evade enemy attacks

### Equipment System

Collect and upgrade equipment:

- **Weapons**: Leviathan Axe and Blades of Chaos
- **Armor**: Provides defense and stat bonuses
- **Runes**: Grant special abilities
- **Enchantments**: Enhance weapon effects

### Exploration Tips

Nine Realms are full of secrets:

- **Rune Chests**: Need to find runes to open
- **Odin Ravens**: Collect all ravens
- **Nornir Chests**: Break seals for rewards
- **Hidden Areas**: Explore every corner carefully

### Skill Upgrades

Upgrade your skill tree:

| Skill Tree | Features |
|--------|------|
| Leviathan Axe | Ice elemental attacks |
| Blades of Chaos | Fire elemental attacks |
| Defense Skills | Parry and dodge |
| Spartan Rage | Burst attacks |

### Character Development

Improve Atreus abilities:

- **Bow Skills**: Ranged attacks
- **Rune Summons**: Summon animal companions
- **Dialogue Options**: Affect story direction

### Conclusion

God of War is an epic journey, enjoy the adventure!`,
    read_time: 8,
    view_count: 12000,
    like_count: 2800,
    share_count: 890,
    published_at: 'February 5, 2024',
    difficulty: 'Beginner',
    game: {
      name: 'God of War',
      slug: 'god-of-war',
      cover_url: getGameCoverUrl('God of War')
    },
    author: {
      name: 'God of War Player',
      bio: 'God of War series fan, platinum achievement holder',
      level: 8,
      reputation: 15000,
      articles: 35,
      followers: 5600,
      join_date: 'November 2022',
      socialLinks: { youtube: 'GodofWarChannel' }
    }
  },
  'zelda-breath-of-the-wild-character-tier-list': {
    id: '8',
    title: 'The Legend of Zelda: Breath of the Wild Character Tier List',
    slug: 'zelda-breath-of-the-wild-character-tier-list',
    excerpt: 'Breath of the Wild character strength analysis and ranking',
    content: `## Zelda Character Tier List

Explore the strongest characters and abilities in Hyrule!

### Character Rankings

Ranked based on overall ability:

**S Tier - Strongest**:
- **Link**: Main character, all abilities
- **Zelda**: Wisdom and power combined

**A Tier - Powerful**:
- **Daruk**: Rock power, extremely defensive
- **Mipha**: Healing abilities, support type
- **Urbosa**: Lightning attacks, area damage
- **Revali**: Flight ability, unbeatable in air combat

**B Tier - Practical**:
- **Impa**: Wisdom character
- **Princess Zelda**: Story key character

### Weapon Strength

Strongest weapon ranking:

1. **Master Sword**: Strongest weapon in game
2. **Ancient Arms**: Powerful ancient weapons
3. **Guardian Weapons**: High-tech equipment
4. **Divine Beast Weapons**: Gifts from divine beasts

### Ability Analysis

Each character unique ability:

| Character | Ability | Purpose |
|------|------|------|
| Daruk | Protection | Invincible defense |
| Mipha | Grace | Auto healing |
| Urbosa | Fury | Lightning attack |
| Revali | Gale | Air dash |

### Combat Tips

Become a combat master:

- **Perfect Dodge**: Trigger bullet time
- **Perfect Parry**: Reflect attacks
- **Elemental Weakness**: Use elemental advantages
- **Environmental Use**: Use terrain to your advantage

### Conclusion

Master these skills and you will become a legend in Hyrule!`,
    read_time: 7,
    view_count: 15000,
    like_count: 3200,
    share_count: 1100,
    published_at: 'January 28, 2024',
    difficulty: 'Intermediate',
    game: {
      name: 'The Legend of Zelda: Breath of the Wild',
      slug: 'the-legend-of-zelda-breath-of-the-wild',
      cover_url: getGameCoverUrl('The Legend of Zelda Breath of the Wild')
    },
    author: {
      name: 'Hyrule Hero',
      bio: 'Zelda series expert, all achievements completed',
      level: 9,
      reputation: 18000,
      articles: 42,
      followers: 7800,
      join_date: 'March 2021',
      socialLinks: { twitter: 'HyruleHero', youtube: 'ZeldaMaster' }
    }
  }
}

const videos: Record<string, Array<{ url: string; title: string; duration: string; thumbnail: string }>> = {
  'minecraft-survival-guide-2024': [
    { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', title: 'Minecraft Survival Guide: Day 1 Tips', duration: '12:34', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg' },
    { url: 'https://www.youtube.com/watch?v=7Z9z8R32420', title: 'How to Build an Automatic Farm', duration: '8:15', thumbnail: 'https://img.youtube.com/vi/7Z9z8R32420/maxresdefault.jpg' }
  ],
  'genshin-impact-beginners-guide': [
    { url: 'https://www.youtube.com/watch?v=abc123', title: 'Genshin Impact Starter Guide', duration: '15:20', thumbnail: 'https://img.youtube.com/vi/abc123/maxresdefault.jpg' },
    { url: 'https://www.youtube.com/watch?v=def456', title: 'Best Characters for New Players', duration: '10:45', thumbnail: 'https://img.youtube.com/vi/def456/maxresdefault.jpg' }
  ],
  'valorant-agent-guide': [
    { url: 'https://www.youtube.com/watch?v=ghi789', title: 'Valorant Agent Breakdown', duration: '18:00', thumbnail: 'https://img.youtube.com/vi/ghi789/maxresdefault.jpg' }
  ],
  'apex-legends-weapons-guide': [
    { url: 'https://www.youtube.com/watch?v=jkl012', title: 'Apex Legends Weapon Guide', duration: '14:30', thumbnail: 'https://img.youtube.com/vi/jkl012/maxresdefault.jpg' }
  ],
  'league-of-legends-champion-guide': [
    { url: 'https://www.youtube.com/watch?v=mno345', title: 'LoL Champion Guide', duration: '20:00', thumbnail: 'https://img.youtube.com/vi/mno345/maxresdefault.jpg' }
  ]
}

const liveStreams = [
  { streamer: 'MinecraftMaster', game: 'Minecraft', viewers: 1250, thumbnail: 'https://images.unsplash.com/photo-1622182371017-99b005124524?w=640&h=360&fit=crop', isLive: true, platform: 'twitch' as const },
  { streamer: 'BuildCraftGaming', game: 'Minecraft', viewers: 890, thumbnail: 'https://images.unsplash.com/photo-1513721032312-6a18a42c8763?w=640&h=360&fit=crop', isLive: true, platform: 'youtube' as const }
]

const comments: Record<string, Array<{ id: string; author: string; content: string; likes: number; createdAt: string; replies?: Array<{ id: string; author: string; content: string; likes: number; createdAt: string }> }>> = {
  'minecraft-survival-guide-2024': [
    { id: '1', author: 'NoobPlayer99', content: 'Great guide! Helped me finally build my first automatic farm.', likes: 42, createdAt: '2 hours ago', replies: [{ id: '1-1', author: 'ProGamer42', content: 'Glad it helped! Let me know if you need more tips.', likes: 23, createdAt: '1 hour ago' }] },
    { id: '2', author: 'RedstoneExpert', content: 'The redstone section is really well explained. Thanks!', likes: 28, createdAt: '5 hours ago' },
    { id: '3', author: 'BuilderBob', content: 'Could you add more building tips?', likes: 15, createdAt: '1 day ago' }
  ],
  'genshin-impact-beginners-guide': [
    { id: '1', author: 'NewPlayer', content: 'Perfect guide for beginners!', likes: 56, createdAt: '1 hour ago' },
    { id: '2', author: 'VeteranPlayer', content: 'Good tips for new players!', likes: 32, createdAt: '3 hours ago' }
  ],
  'valorant-agent-guide': [
    { id: '1', author: 'RankClimber', content: 'This helped me climb from Silver to Gold!', likes: 89, createdAt: '4 hours ago' },
    { id: '2', author: 'CompetitiveGamer', content: 'Great analysis of each agent!', likes: 45, createdAt: '6 hours ago' }
  ],
  'apex-legends-weapons-guide': [
    { id: '1', author: 'ApexNoob', content: 'Finally understand all weapons!', likes: 34, createdAt: '3 hours ago' },
    { id: '2', author: 'ProPlayer', content: 'Good tips for new players!', likes: 22, createdAt: '5 hours ago' }
  ],
  'league-of-legends-champion-guide': [
    { id: '1', author: 'Summoner123', content: 'Helped me find my main!', likes: 67, createdAt: '2 hours ago' },
    { id: '2', author: 'DiamondPlayer', content: 'Great overview of all roles!', likes: 41, createdAt: '4 hours ago' }
  ]
}

const relatedArticles: Record<string, Array<{ id: string; slug: string; title: string; coverUrl: string; views: number }>> = {
  'minecraft-survival-guide-2024': [
    { id: '2', slug: 'minecraft-redstone-guide', title: 'Minecraft Redstone Guide: From Basics to Advanced', coverUrl: 'https://images.unsplash.com/photo-1555421689-44010a021402?w=400&h=225&fit=crop', views: 8900 },
    { id: '3', slug: 'minecraft-building-tips', title: '10 Amazing Minecraft Building Tips', coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=225&fit=crop', views: 6500 }
  ],
  'genshin-impact-beginners-guide': [
    { id: '1', slug: 'genshin-artifact-guide', title: 'Best Artifact Sets for Every Character', coverUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&h=225&fit=crop', views: 15000 },
    { id: '2', slug: 'genshin-spiral-abyss-guide', title: 'Spiral Abyss Guide: Floor 12 Strategies', coverUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&h=225&fit=crop', views: 12000 }
  ],
  'valorant-agent-guide': [
    { id: '1', slug: 'valorant-map-guide', title: 'All Maps Guide: Callouts and Strategies', coverUrl: 'https://images.unsplash.com/photo-1632581161548-f53c25988b48?w=400&h=225&fit=crop', views: 18000 },
    { id: '2', slug: 'valorant-ranked-tips', title: '10 Tips to Climb Ranked Fast', coverUrl: 'https://images.unsplash.com/photo-1632581161548-f53c25988b48?w=400&h=225&fit=crop', views: 22000 }
  ],
  'apex-legends-weapons-guide': [
    { id: '1', slug: 'apex-legends-legend-guide', title: 'All Legends Guide: Abilities and Tips', coverUrl: 'https://images.unsplash.com/photo-1611605698335-5b81948d5315?w=400&h=225&fit=crop', views: 16000 },
    { id: '2', slug: 'apex-legends-map-guide', title: 'Map Guide: Best Looting Spots', coverUrl: 'https://images.unsplash.com/photo-1611605698335-5b81948d5315?w=400&h=225&fit=crop', views: 14000 }
  ],
  'league-of-legends-champion-guide': [
    { id: '1', slug: 'league-of-legends-build-guide', title: 'Best Builds for Every Champion', coverUrl: 'https://images.unsplash.com/photo-1551632436-960106b58617?w=400&h=225&fit=crop', views: 25000 },
    { id: '2', slug: 'league-of-legends-role-guide', title: 'Mastering Every Role', coverUrl: 'https://images.unsplash.com/photo-1551632436-960106b58617?w=400&h=225&fit=crop', views: 19000 }
  ]
}

const faqData: Record<string, Array<{ question: string; answer: string }>> = {
  'minecraft-survival-guide-2024': [
    { question: 'What is the best way to find diamonds in Minecraft?', answer: 'The best method is to mine at Y-level -58 using a diamond or netherite pickaxe with the Fortune enchantment. Use TNT or branch mining for efficiency. Always carry torches to light up your path and prevent mob spawns.' },
    { question: 'How do I survive the first night in Minecraft?', answer: 'Quickly gather wood to craft a workbench and tools, then build a small shelter before dark. Make a bed to skip the night if possible. Digging a 3-block deep hole and covering the top also works as a temporary safe spot.' },
    { question: 'What food should I prioritize early in the game?', answer: 'Start with bread from wheat, then upgrade to meat from cows or pigs. Cook meat in a furnace to get more hunger points. Farms are essential for sustainable food sources long-term.' },
    { question: 'How do I defeat the Ender Dragon?', answer: 'First destroy all End Crystals to prevent the dragon from healing. Use beds for massive damage (they explode in the End). Bring plenty of arrows, potions, and blocks to build bridges to the main island.' }
  ],
  'genshin-impact-beginners-guide': [
    { question: 'What is the best 4-star character for beginners?', answer: 'Bennet is widely regarded as the best 4-star character. He provides healing, attack buffs, and Pyro application all in one kit. He works well with almost every team composition.' },
    { question: 'How should I spend my Primogems as a new player?', answer: 'Always prioritize limited character banners. Save for characters you want rather than pulling on every banner. Avoid spending on the standard banner except with free pulls. 5-star weapons are nice but characters come first.' },
    { question: 'What artifacts should I farm first?', answer: 'Start with the Noblesse Oblige set for supports and Gladiator\'s Finale for DPS characters. Wait until Adventure Rank 45 to farm artifacts seriously, as that\'s when 5-star artifacts become guaranteed.' },
    { question: 'How do I increase my Adventure Rank quickly?', answer: 'Complete daily commissions, spend your Resin daily, do world quests, and explore. Open chests, collect waypoints, and do events when available. Resin efficiency is key for consistent progression.' }
  ],
  'valorant-agent-guide': [
    { question: 'What is the best agent for beginners in Valorant?', answer: 'Sage is perfect for beginners. She has simple abilities that help the team (healing, walls, revives) and teaches players about positioning and map control without requiring precise mechanical skill.' },
    { question: 'How do I improve my aim in Valorant?', answer: 'Practice in the Range daily, focus on crosshair placement, and play Deathmatch. Lower your sensitivity for better precision. Consistency is more important than speed when starting out.' },
    { question: 'What are the most important callouts to learn?', answer: 'Learn common locations like A Site, B Site, Mid, and spawn. Master the specific callouts for each map - sites, chokepoints, and common angles. Clear communication wins games.' },
    { question: 'Should I play ranked immediately?', answer: 'Wait until you\'ve mastered the basics in unrated. Learn all agents and maps first. Playing too early can lead to frustration and bad habits. Focus on improvement rather than rank when you do start.' }
  ],
  'apex-legends-weapons-guide': [
    { question: 'What is the best weapon combination in Apex Legends?', answer: 'The R-301 Carbine with a shotgun (either Mastiff or Eva-8) is a very versatile combination. The R-301 handles medium to long range, while the shotgun covers close quarters fights.' },
    { question: 'How do I get better at movement in Apex?', answer: 'Practice slide jumping, wall bouncing, and tap strafing (if on controller). Movement is key to surviving fights and outmaneuvering opponents. Watch pro players and mimic their movement patterns.' },
    { question: 'What legend should I main as a beginner?', answer: 'Lifeline is great for beginners. Her healing drone and revival shield support the team while teaching basic positioning. Gibraltar or Bangalore are also solid choices for learning team play.' },
    { question: 'How important is loot priority in Apex?', answer: 'Extremely important! Prioritize shields and weapons first. Early game focus on survival, late game focus on optimal loadouts. Knowing what to pick up and what to ignore saves crucial time.' }
  ],
  'league-of-legends-champion-guide': [
    { question: 'What is the easiest role for beginners in LoL?', answer: 'Bot lane ADC is generally the easiest to start with, as you have a support to help you. Focus last hitting minions and learning positioning. Alternatively, Top Lane is good for learning 1v1 matchups.' },
    { question: 'How do I climb ranked in League of Legends?', answer: 'Focus on a small pool of champions (2-3) to master. Learn wave management, map awareness, and objective control. Review your losses to identify mistakes. Consistency beats trying to carry every game.' },
    { question: 'What are the most important macro concepts?', answer: 'Wave management, objective timers, vision control, and knowing when to group versus split push. Understanding map pressure and when to take fights wins more games than individual mechanics.' },
    { question: 'Should I use a build guide or experiment?', answer: 'Use established build guides from sites like OP.GG or U.GG when starting out. Once you understand itemization, you can adapt builds based on the game state. Core items usually remain consistent.' }
  ]
}

async function getArticle(inputSlug: string): Promise<Article> {
  const slug = decodeURIComponent(inputSlug)
  const originalSlug = inputSlug
  
  try {
    const dbArticle = await db.article.findUnique({
      where: { slug },
      include: {
        game: true,
      },
    })

    if (dbArticle) {
      return {
        id: dbArticle.id,
        title: dbArticle.title,
        slug: dbArticle.slug,
        excerpt: dbArticle.excerpt || '',
        content: dbArticle.content || '',
        read_time: dbArticle.read_time || 5,
        view_count: dbArticle.view_count || 0,
        like_count: 0,
        share_count: dbArticle.share_count || 0,
        published_at: dbArticle.published_at ? new Date(dbArticle.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'January 1, 2024',
        difficulty: 'Intermediate',
        game: dbArticle.game || { name: 'Unknown', slug: 'unknown', cover_url: getGameCoverUrl('Unknown Game') },
        author: {
          name: (dbArticle as any).author?.name || 'Anonymous',
          bio: (dbArticle as any).author?.bio || '',
          level: Math.floor(Math.random() * 5) + 5,
          reputation: Math.floor(Math.random() * 10000) + 5000,
          articles: Math.floor(Math.random() * 50) + 10,
          followers: Math.floor(Math.random() * 10000) + 5000,
          join_date: 'January 2023',
        },
      }
    }
  } catch {
  }

  if (fallbackArticles[slug]) {
    return fallbackArticles[slug]
  }
  
  if (fallbackArticles[originalSlug]) {
    return fallbackArticles[originalSlug]
  }
  
  throw new Error('Article not found')
}

function getDefaultArticle(): Article {
  return {
    id: 'default',
    title: 'Article Not Found',
    slug: '',
    excerpt: '',
    content: '',
    read_time: 5,
    view_count: 0,
    like_count: 0,
    share_count: 0,
    published_at: 'January 1, 2024',
    difficulty: 'Intermediate',
    game: { name: 'Unknown', slug: 'unknown', cover_url: getGameCoverUrl('Unknown Game') },
    author: {
      name: 'Anonymous',
      bio: '',
      level: 1,
      reputation: 0,
      articles: 0,
      followers: 0,
      join_date: 'January 2024',
    },
  }
}

function mergeArticleWithDefaults(article: Partial<Article>): Article {
  const defaults = getDefaultArticle()
  return {
    ...defaults,
    ...article,
    game: { ...defaults.game, ...article.game },
    author: { ...defaults.author, ...article.author },
    read_time: article.read_time ?? defaults.read_time,
    view_count: article.view_count ?? defaults.view_count,
    like_count: article.like_count ?? defaults.like_count,
    share_count: article.share_count ?? defaults.share_count,
  }
}

export default async function GuideDetailPage({ params }: GuideDetailPageProps) {
  const { slug } = await params
  let article: Article
  try {
    const rawArticle = await getArticle(slug)
    article = mergeArticleWithDefaults(rawArticle)
  } catch {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>404</h1>
          <p className="text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>Guide not found</p>
          <a href="/guides" className="px-6 py-3 rounded-xl font-medium" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
            Browse Guides
          </a>
        </div>
      </div>
    )
  }

  const headings = article.content.match(/^##\s+(.+)$/gm) || []
  const currentVideos = videos[slug] || []
  const currentComments = comments[slug] || []
  const currentRelatedArticles = relatedArticles[slug] || []
  const currentFAQs = faqData[slug] || [
    { question: `What is ${article.game.name}?`, answer: `${article.game.name} is a popular video game that this guide covers in detail.` },
    { question: `Is ${article.game.name} worth playing?`, answer: `Absolutely! This guide will help you get started and master the game.` }
  ]

  const renderContent = () => {
    const lines = article.content.split('\n')
    return lines.map((line, index) => {
      if (line.startsWith('## ')) {
        return (
          <h2 key={index} id={`heading-${index}`} className="text-2xl font-bold mt-8 mb-4 scroll-mt-20" style={{ color: 'var(--text-primary)' }}>
            {line.replace('## ', '')}
          </h2>
        )
      }
      if (line.startsWith('### ')) {
        return (
          <h3 key={index} className="text-xl font-semibold mt-6 mb-3" style={{ color: 'var(--text-primary)' }}>
            {line.replace('### ', '')}
          </h3>
        )
      }
      if (line.startsWith('|')) {
        const tableRows = lines.slice(index).filter(l => l.startsWith('|'))
        return (
          <div key={index} className="overflow-x-auto my-4">
            <table className="w-full rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              <tbody>
                {tableRows.map((row, i) => {
                  const cells = row.split('|').filter(c => c.trim())
                  return (
                    <tr key={i} className={i === 0 ? 'font-semibold' : ''} style={{ backgroundColor: i % 2 === 0 ? 'var(--bg-surface)' : 'transparent' }}>
                      {cells.map((cell, j) => (
                        <td key={j} className="px-4 py-3" style={{ color: 'var(--text-primary)' }}>
                          {cell.trim()}
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )
      }
      if (line.startsWith('- ') || line.startsWith('1. ')) {
        const content = line.replace(/^[-1.]\s+/, '')
        return (
          <li key={index} className="ml-4 mb-2" style={{ color: 'var(--text-secondary)' }}>
            {content}
          </li>
        )
      }
      if (line.trim()) {
        return (
          <p key={index} className="mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {line}
          </p>
        )
      }
      return null
    })
  }

  return (
    <>
      <JsonLdScript data={getArticleSchema({
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        coverImage: article.game.cover_url,
        publishedAt: article.published_at,
        authorName: article.author.name,
        readTime: article.read_time,
        gameName: article.game.name,
      })} />
      <JsonLdScript data={getBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Guides', url: '/guides' },
        { name: article.game.name, url: `/guides?game=${article.game.slug}` },
        { name: article.title },
      ])} />
      <FAQSchema 
        faqs={currentFAQs}
        articleTitle={article.title}
        articleUrl={`/guides/${article.slug}`}
        datePublished={article.published_at}
        author={article.author.name}
      />
    <div className="min-h-screen">
      <ReadingProgress progress={0} />

      <div className="relative h-72 overflow-hidden">
        <img
          src={article.game.cover_url}
          alt={article.game.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-4xl mx-auto">
            <Breadcrumb items={[
              { label: 'Guides', href: '/guides' },
              { label: article.game.name, href: `/guides?game=${article.game.slug}` },
              { label: article.title }
            ]} />
            <h1 className="text-3xl md:text-4xl font-bold mt-4" style={{ color: 'white' }}>
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-white/80">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {article.read_time} min read
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                {article.like_count.toLocaleString()} likes
              </span>
              <span className="px-3 py-1 rounded-full text-sm" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
                {article.difficulty}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-8">
          <div className="lg:pr-4">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <LikeButton initialLikes={article.like_count} articleId={article.id} />
              <BookmarkButton articleId={article.id} />
              <ShareButtons url={`/guides/${article.slug}`} title={article.title} />
            </div>

            <div className="prose max-w-none" style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '2xl', padding: '2rem', border: '1px solid var(--border)' }}>
              {renderContent()}
            </div>

            <FAQSection faqs={currentFAQs} />

            <HelpfulVote articleId={article.id} />

            <CommentSection comments={currentComments} articleId={article.id} />
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
            <TableOfContentsNav headings={headings} />

            <AuthorCard 
              name={article.author.name}
              bio={article.author.bio}
              level={article.author.level}
              reputation={article.author.reputation}
              articles={article.author.articles}
              followers={article.author.followers}
              joinDate={article.author.join_date}
              socialLinks={article.author.socialLinks}
            />

            {currentVideos.length > 0 && (
              <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Video Tutorials
                </h3>
                <div className="space-y-4">
                  {currentVideos.map((video, index) => (
                    <VideoEmbed key={index} {...video} />
                  ))}
                </div>
              </div>
            )}

            <LiveStreamsSection streams={liveStreams} />

            <RelatedArticles articles={currentRelatedArticles} />
          </div>
        </div>
      </div>
    </div>
    </>
  )
}