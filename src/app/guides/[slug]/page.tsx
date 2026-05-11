import { db } from '@/lib/db'
import { Breadcrumb } from '@/components/Breadcrumb'
import { VideoEmbed, LiveStreamsSection } from '@/components/VideoEmbed'
import { LikeButton, BookmarkButton, HelpfulVote, CommentSection, ShareButtons, ReadingProgress } from '@/components/InteractiveComponents'
import { AuthorCard, RelatedArticles } from '@/components/AuthorComponents'
import { TableOfContentsNav } from '@/components/TableOfContentsNav'
import { Clock, Star } from 'lucide-react'
import { JsonLdScript, getArticleSchema, getBreadcrumbSchema } from '@/components/seo/JsonLd'

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
  'hollow-knight-进阶攻略': {
    id: '6',
    title: 'Hollow Knight 进阶攻略',
    slug: 'hollow-knight-进阶攻略',
    excerpt: '深入探索空洞骑士的进阶玩法和隐藏内容',
    content: `## 空洞骑士进阶指南

欢迎来到空洞骑士的进阶世界！这篇攻略将帮助你深入探索这个美丽而危险的地下王国。

### 地图探索技巧

掌握以下技巧可以更高效地探索：

1. **标记重要位置** - 使用地图标记功能
2. **学会冲刺** - 快速移动的关键
3. **二段跳** - 到达更高的地方
4. **梦之门** - 快速旅行

### Boss 战攻略

主要 Boss 打法：

- **假骑士**: 攻击间隔较长，容易躲避
- **黄蜂女**: 快速移动，注意跳跃攻击
- **螳螂领主**: 三连斩需要精准躲避
- **空洞骑士**: 最终 Boss，需要熟练掌握所有技能

### 隐藏区域

游戏中有许多隐藏区域等待发现：

- **深邃巢穴**: 隐藏的昆虫巢穴
- **古老盆地**: 游戏的核心区域
- **格林剧场**: 神秘的表演场地
- **神居**: 挑战终极 Boss 的地方

### 护符搭配

选择合适的护符组合：

| 护符 | 效果 | 推荐搭配 |
|------|------|----------|
| 灵魂大师 | 增加灵魂获取 | 战斗流 |
| 快速聚集 | 快速回复灵魂 | 续航流 |
| 坚固力量 | 增加攻击力 | 输出流 |

### 结局解锁

游戏有多种结局：

1. **普通结局**: 击败空洞骑士
2. **真结局**: 完成所有条件
3. **隐藏结局**: 特殊条件触发

### 结语

空洞骑士是一款充满深度的游戏，祝你探索愉快！`,
    read_time: 10,
    view_count: 8500,
    like_count: 1800,
    share_count: 520,
    published_at: '2024-01-20',
    difficulty: 'Expert',
    game: {
      name: 'Hollow Knight',
      slug: 'hollow-knight',
      cover_url: 'https://picsum.photos/seed/hollowknight/1200/630'
    },
    author: {
      name: '空洞骑士专家',
      bio: '空洞骑士爱好者，完成所有结局和成就',
      level: 7,
      reputation: 8500,
      articles: 23,
      followers: 3200,
      join_date: '2023-06',
      socialLinks: { twitter: 'HollowKnightPro' }
    }
  },
  'god-of-war-新手入门指南': {
    id: '7',
    title: 'God of War 新手入门指南',
    slug: 'god-of-war-新手入门指南',
    excerpt: '踏上奎托斯的北欧征程，掌握战斗和探索技巧',
    content: `## God of War 新手指南

欢迎来到战神的世界！这篇指南将帮助你开始你的北欧之旅。

### 战斗基础

战神的战斗系统深度且富有策略性：

1. **轻攻击**: 快速连续攻击
2. **重攻击**: 高伤害但较慢
3. **格挡**: 完美格挡可以反击
4. **闪避**: 躲避敌人攻击

### 装备系统

收集和升级装备：

- **武器**: 利维坦之斧和混沌之刃
- **护甲**: 提供防御和属性加成
- **符文**: 赋予特殊能力
- **附魔**: 增强武器效果

### 探索技巧

九界充满秘密：

- **符文宝箱**: 需要找到符文才能打开
- **奥丁的渡鸦**: 收集所有渡鸦
- **诺伦三女神宝箱**: 打破封印获取奖励
- **隐藏区域**: 仔细探索每个角落

### 技能升级

升级你的技能树：

| 技能树 | 特点 |
|--------|------|
| 利维坦之斧 | 冰属性攻击 |
| 混沌之刃 | 火属性攻击 |
| 防御技能 | 格挡和闪避 |
| 斯巴达之怒 | 爆发攻击 |

### 角色培养

提升阿特柔斯的能力：

- **弓箭技能**: 远程攻击
- **符文召唤**: 召唤动物伙伴
- **对话选项**: 影响剧情走向

### 结语

战神是一段史诗般的旅程，享受这段冒险吧！`,
    read_time: 8,
    view_count: 12000,
    like_count: 2800,
    share_count: 890,
    published_at: '2024-02-05',
    difficulty: 'Beginner',
    game: {
      name: 'God of War',
      slug: 'god-of-war',
      cover_url: 'https://picsum.photos/seed/godofwar/1200/630'
    },
    author: {
      name: '战神玩家',
      bio: '战神系列忠实粉丝，白金成就获得者',
      level: 8,
      reputation: 15000,
      articles: 35,
      followers: 5600,
      join_date: '2022-11',
      socialLinks: { youtube: 'GodofWarChannel' }
    }
  },
  'the-legend-of-zelda-breath-of-the-wild-角色强度排名': {
    id: '8',
    title: 'The Legend of Zelda: Breath of the Wild 角色强度排名',
    slug: 'the-legend-of-zelda-breath-of-the-wild-角色强度排名',
    excerpt: '塞尔达传说荒野之息角色强度分析与排名',
    content: `## 塞尔达传说角色强度排名

探索海拉鲁大陆上最强的角色和能力！

### 角色排名

基于综合能力的排名：

**S 级 - 最强**:
- **林克**: 主角，拥有所有能力
- **塞尔达**: 智慧与力量并存

**A 级 - 强力**:
- **达尔克尔**: 岩石之力，防御极强
- **米法**: 治疗能力，支援型
- **乌尔波扎**: 雷电攻击，范围伤害
- **力巴尔**: 飞行能力，空战无敌

**B 级 - 实用**:
- **英帕**: 智慧型角色
- **塞尔达公主**: 剧情关键角色

### 武器强度

最强武器排名：

1. **大师剑**: 游戏最强武器
2. **远古兵装**: 强力古代武器
3. **守护者武器**: 高科技装备
4. **神兽武器**: 来自神兽的馈赠

### 能力解析

每个角色的独特能力：

| 角色 | 能力 | 用途 |
|------|------|------|
| 达尔克尔 | 守护之力 | 无敌防御 |
| 米法 | 治愈之光 | 自动回血 |
| 乌尔波扎 | 雷鸣之力 | 雷电攻击 |
| 力巴尔 | 御风之力 | 空中冲刺 |

### 战斗技巧

成为战斗大师：

- **完美闪避**: 触发子弹时间
- **完美格挡**: 反弹攻击
- **元素克制**: 利用元素弱点
- **环境利用**: 使用地形优势

### 结语

掌握这些技巧，你将成为海拉鲁的传奇！`,
    read_time: 7,
    view_count: 15000,
    like_count: 3200,
    share_count: 1100,
    published_at: '2024-01-28',
    difficulty: 'Intermediate',
    game: {
      name: 'The Legend of Zelda: Breath of the Wild',
      slug: 'the-legend-of-zelda-breath-of-the-wild',
      cover_url: 'https://picsum.photos/seed/zelda/1200/630'
    },
    author: {
      name: '海拉鲁勇者',
      bio: '塞尔达传说系列专家，全成就达成',
      level: 9,
      reputation: 18000,
      articles: 42,
      followers: 7800,
      join_date: '2021-03',
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
        game: dbArticle.game || { name: 'Unknown', slug: 'unknown', cover_url: 'https://picsum.photos/seed/default/1200/630' },
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
    game: { name: 'Unknown', slug: 'unknown', cover_url: 'https://picsum.photos/seed/default/1200/630' },
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