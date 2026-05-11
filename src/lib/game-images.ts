export function getGameImageUrl(name: string, size: 'small' | 'medium' | 'large' = 'medium'): string {
  const sizeMap = {
    small: 'square',
    medium: 'square_hd',
    large: 'landscape_16_9'
  }
  
  const safeName = encodeURIComponent(name)
  return `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=video%20game%20${safeName}%20character%20portrait%20fantasy%20style%20dark%20background&image_size=${sizeMap[size]}`
}

export function getGameCoverUrl(title: string): string {
  const safeTitle = encodeURIComponent(title)
  return `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=video%20game%20guide%20cover%20art%20${safeTitle}%20gaming%20dark%20theme%20fantasy%20style&image_size=landscape_16_9`
}

export function getGameLogoUrl(gameName: string): string {
  const safeName = encodeURIComponent(gameName)
  return `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=video%20game%20logo%20${safeName}%20minimalist%20dark%20background%20modern%20style&image_size=square`
}