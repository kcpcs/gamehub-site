import { getGameImageUrl } from '@/lib/game-images'

export interface GameCharacter {
  id: string
  name: string
  image_url: string
}

export const valorantCharacters: GameCharacter[] = [
  { id: 'jett', name: 'Jett', image_url: getGameImageUrl('Jett Valorant character', 'small') },
  { id: 'reyna', name: 'Reyna', image_url: getGameImageUrl('Reyna Valorant character', 'small') },
  { id: 'raze', name: 'Raze', image_url: getGameImageUrl('Raze Valorant character', 'small') },
  { id: 'phoenix', name: 'Phoenix', image_url: getGameImageUrl('Phoenix Valorant character', 'small') },
  { id: 'neon', name: 'Neon', image_url: getGameImageUrl('Neon Valorant character', 'small') },
  { id: 'yoru', name: 'Yoru', image_url: getGameImageUrl('Yoru Valorant character', 'small') },
  { id: 'viper', name: 'Viper', image_url: getGameImageUrl('Viper Valorant character', 'small') },
  { id: 'brimstone', name: 'Brimstone', image_url: getGameImageUrl('Brimstone Valorant character', 'small') },
  { id: 'omen', name: 'Omen', image_url: getGameImageUrl('Omen Valorant character', 'small') },
  { id: 'cypher', name: 'Cypher', image_url: getGameImageUrl('Cypher Valorant character', 'small') },
  { id: 'sage', name: 'Sage', image_url: getGameImageUrl('Sage Valorant character', 'small') },
  { id: 'killjoy', name: 'Killjoy', image_url: getGameImageUrl('Killjoy Valorant character', 'small') },
  { id: 'sky', name: 'Skye', image_url: getGameImageUrl('Skye Valorant character', 'small') },
  { id: 'sova', name: 'Sova', image_url: getGameImageUrl('Sova Valorant character', 'small') },
  { id: 'fade', name: 'Fade', image_url: getGameImageUrl('Fade Valorant character', 'small') },
  { id: 'harbor', name: 'Harbor', image_url: getGameImageUrl('Harbor Valorant character', 'small') },
  { id: 'gekko', name: 'Gekko', image_url: getGameImageUrl('Gekko Valorant character', 'small') },
  { id: 'deadlock', name: 'Deadlock', image_url: getGameImageUrl('Deadlock Valorant character', 'small') },
  { id: 'iso', name: 'Iso', image_url: getGameImageUrl('Iso Valorant character', 'small') },
  { id: 'clove', name: 'Clove', image_url: getGameImageUrl('Clove Valorant character', 'small') },
]

export const genshinCharacters: GameCharacter[] = [
  { id: 'zhongli', name: 'Zhongli', image_url: getGameImageUrl('Zhongli Genshin Impact character', 'small') },
  { id: 'hutao', name: 'Hu Tao', image_url: getGameImageUrl('Hu Tao Genshin Impact character', 'small') },
  { id: 'ayaka', name: 'Ayaka', image_url: getGameImageUrl('Ayaka Genshin Impact character', 'small') },
  { id: 'raiden', name: 'Raiden Shogun', image_url: getGameImageUrl('Raiden Shogun Genshin Impact character', 'small') },
  { id: 'nahida', name: 'Nahida', image_url: getGameImageUrl('Nahida Genshin Impact character', 'small') },
  { id: 'wanderer', name: 'Wanderer', image_url: getGameImageUrl('Wanderer Genshin Impact character', 'small') },
  { id: 'alhaitham', name: 'Alhaitham', image_url: getGameImageUrl('Alhaitham Genshin Impact character', 'small') },
  { id: 'kazuha', name: 'Kazuha', image_url: getGameImageUrl('Kazuha Genshin Impact character', 'small') },
  { id: 'ganyu', name: 'Ganyu', image_url: getGameImageUrl('Ganyu Genshin Impact character', 'small') },
  { id: 'yelan', name: 'Yelan', image_url: getGameImageUrl('Yelan Genshin Impact character', 'small') },
  { id: 'xilonen', name: 'Xilonen', image_url: getGameImageUrl('Xilonen Genshin Impact character', 'small') },
  { id: 'chiori', name: 'Chiori', image_url: getGameImageUrl('Chiori Genshin Impact character', 'small') },
  { id: 'furina', name: 'Furina', image_url: getGameImageUrl('Furina Genshin Impact character', 'small') },
  { id: 'navia', name: 'Navia', image_url: getGameImageUrl('Navia Genshin Impact character', 'small') },
  { id: 'baizhu', name: 'Baizhu', image_url: getGameImageUrl('Baizhu Genshin Impact character', 'small') },
  { id: 'nilou', name: 'Nilou', image_url: getGameImageUrl('Nilou Genshin Impact character', 'small') },
  { id: 'cyno', name: 'Cyno', image_url: getGameImageUrl('Cyno Genshin Impact character', 'small') },
  { id: 'tighnari', name: 'Tighnari', image_url: getGameImageUrl('Tighnari Genshin Impact character', 'small') },
  { id: 'dehya', name: 'Dehya', image_url: getGameImageUrl('Dehya Genshin Impact character', 'small') },
]

export const lolCharacters: GameCharacter[] = [
  { id: 'yasuo', name: 'Yasuo', image_url: getGameImageUrl('Yasuo League of Legends character', 'small') },
  { id: 'zed', name: 'Zed', image_url: getGameImageUrl('Zed League of Legends character', 'small') },
  { id: 'riven', name: 'Riven', image_url: getGameImageUrl('Riven League of Legends character', 'small') },
  { id: 'lee-sin', name: 'Lee Sin', image_url: getGameImageUrl('Lee Sin League of Legends character', 'small') },
  { id: 'akali', name: 'Akali', image_url: getGameImageUrl('Akali League of Legends character', 'small') },
  { id: 'viego', name: 'Viego', image_url: getGameImageUrl('Viego League of Legends character', 'small') },
  { id: 'pyke', name: 'Pyke', image_url: getGameImageUrl('Pyke League of Legends character', 'small') },
  { id: 'lillia', name: 'Lillia', image_url: getGameImageUrl('Lillia League of Legends character', 'small') },
  { id: 'gwen', name: 'Gwen', image_url: getGameImageUrl('Gwen League of Legends character', 'small') },
  { id: 'seraphine', name: 'Seraphine', image_url: getGameImageUrl('Seraphine League of Legends character', 'small') },
  { id: 'samira', name: 'Samira', image_url: getGameImageUrl('Samira League of Legends character', 'small') },
  { id: 'kayn', name: 'Kayn', image_url: getGameImageUrl('Kayn League of Legends character', 'small') },
  { id: 'khazix', name: "Kha'Zix", image_url: getGameImageUrl('KhaZix League of Legends character', 'small') },
  { id: 'darius', name: 'Darius', image_url: getGameImageUrl('Darius League of Legends character', 'small') },
  { id: 'sett', name: 'Sett', image_url: getGameImageUrl('Sett League of Legends character', 'small') },
  { id: 'camille', name: 'Camille', image_url: getGameImageUrl('Camille League of Legends character', 'small') },
  { id: 'irelia', name: 'Irelia', image_url: getGameImageUrl('Irelia League of Legends character', 'small') },
  { id: 'yone', name: 'Yone', image_url: getGameImageUrl('Yone League of Legends character', 'small') },
  { id: 'vayne', name: 'Vayne', image_url: getGameImageUrl('Vayne League of Legends character', 'small') },
  { id: 'jinx', name: 'Jinx', image_url: getGameImageUrl('Jinx League of Legends character', 'small') },
]

export const apexCharacters: GameCharacter[] = [
  { id: 'wraith', name: 'Wraith', image_url: getGameImageUrl('Wraith Apex Legends character', 'small') },
  { id: 'pathfinder', name: 'Pathfinder', image_url: getGameImageUrl('Pathfinder Apex Legends character', 'small') },
  { id: 'octane', name: 'Octane', image_url: getGameImageUrl('Octane Apex Legends character', 'small') },
  { id: 'mirage', name: 'Mirage', image_url: getGameImageUrl('Mirage Apex Legends character', 'small') },
  { id: 'bloodhound', name: 'Bloodhound', image_url: getGameImageUrl('Bloodhound Apex Legends character', 'small') },
  { id: 'gibraltar', name: 'Gibraltar', image_url: getGameImageUrl('Gibraltar Apex Legends character', 'small') },
  { id: 'bangalore', name: 'Bangalore', image_url: getGameImageUrl('Bangalore Apex Legends character', 'small') },
  { id: 'caustic', name: 'Caustic', image_url: getGameImageUrl('Caustic Apex Legends character', 'small') },
  { id: 'wattson', name: 'Wattson', image_url: getGameImageUrl('Wattson Apex Legends character', 'small') },
  { id: 'crypto', name: 'Crypto', image_url: getGameImageUrl('Crypto Apex Legends character', 'small') },
  { id: 'revenant', name: 'Revenant', image_url: getGameImageUrl('Revenant Apex Legends character', 'small') },
  { id: 'loba', name: 'Loba', image_url: getGameImageUrl('Loba Apex Legends character', 'small') },
  { id: 'rampart', name: 'Rampart', image_url: getGameImageUrl('Rampart Apex Legends character', 'small') },
  { id: 'horizon', name: 'Horizon', image_url: getGameImageUrl('Horizon Apex Legends character', 'small') },
  { id: 'valkyrie', name: 'Valkyrie', image_url: getGameImageUrl('Valkyrie Apex Legends character', 'small') },
  { id: 'seer', name: 'Seer', image_url: getGameImageUrl('Seer Apex Legends character', 'small') },
  { id: 'ash', name: 'Ash', image_url: getGameImageUrl('Ash Apex Legends character', 'small') },
  { id: 'mad-maggie', name: 'Mad Maggie', image_url: getGameImageUrl('Mad Maggie Apex Legends character', 'small') },
  { id: 'newcastle', name: 'Newcastle', image_url: getGameImageUrl('Newcastle Apex Legends character', 'small') },
  { id: 'vantage', name: 'Vantage', image_url: getGameImageUrl('Vantage Apex Legends character', 'small') },
]

export const tftCharacters: GameCharacter[] = [
  { id: 'aatrox', name: 'Aatrox', image_url: getGameImageUrl('Aatrox Teamfight Tactics character', 'small') },
  { id: 'ahri', name: 'Ahri', image_url: getGameImageUrl('Ahri Teamfight Tactics character', 'small') },
  { id: 'akshan', name: 'Akshan', image_url: getGameImageUrl('Akshan Teamfight Tactics character', 'small') },
  { id: 'ashe', name: 'Ashe', image_url: getGameImageUrl('Ashe Teamfight Tactics character', 'small') },
  { id: 'belveth', name: "Bel'Veth", image_url: getGameImageUrl('BelVeth Teamfight Tactics character', 'small') },
  { id: 'blitzcrank', name: 'Blitzcrank', image_url: getGameImageUrl('Blitzcrank Teamfight Tactics character', 'small') },
  { id: 'brand', name: 'Brand', image_url: getGameImageUrl('Brand Teamfight Tactics character', 'small') },
  { id: 'caitlyn', name: 'Caitlyn', image_url: getGameImageUrl('Caitlyn Teamfight Tactics character', 'small') },
  { id: 'cassiopeia', name: 'Cassiopeia', image_url: getGameImageUrl('Cassiopeia Teamfight Tactics character', 'small') },
]

export const getCharactersByGame = (gameSlug: string): GameCharacter[] => {
  const characterMap: Record<string, GameCharacter[]> = {
    'valorant': valorantCharacters,
    'genshin-impact': genshinCharacters,
    'league-of-legends': lolCharacters,
    'apex-legends': apexCharacters,
    'teamfight-tactics': tftCharacters,
  }
  return characterMap[gameSlug] || []
}