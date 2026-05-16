// Mock Redis client for development without Upstash account
const MAX_CACHE_SIZE = 10000
const CLEANUP_INTERVAL = 60000

class MockRedis {
  private cache: Map<string, { value: string; expiresAt: number | null }> = new Map()
  private accessOrder: string[] = []
  private cleanupTimer: ReturnType<typeof setInterval> | null = null

  constructor() {
    this.cleanupTimer = setInterval(() => this.evictExpired(), CLEANUP_INTERVAL)
    process.on('exit', () => this.destroy())
  }

  destroy() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer)
      this.cleanupTimer = null
    }
  }

  private evictExpired() {
    const now = Date.now()
    for (const [key, item] of this.cache) {
      if (item.expiresAt && now > item.expiresAt) {
        this.cache.delete(key)
      }
    }
  }

  private enforceSizeLimit() {
    while (this.accessOrder.length > MAX_CACHE_SIZE) {
      const oldest = this.accessOrder.shift()
      if (oldest) this.cache.delete(oldest)
    }
  }

  private touchKey(key: string) {
    const idx = this.accessOrder.indexOf(key)
    if (idx > -1) this.accessOrder.splice(idx, 1)
    this.accessOrder.push(key)
    this.enforceSizeLimit()
  }

  async ping() {
    return 'PONG'
  }

  async set(key: string, value: string, options?: { ex?: number; px?: number; nx?: boolean; xx?: boolean }) {
    if (options?.nx && this.cache.has(key)) return null
    if (options?.xx && !this.cache.has(key)) return null
    let expiresAt: number | null = null
    if (options?.ex) expiresAt = Date.now() + options.ex * 1000
    else if (options?.px) expiresAt = Date.now() + options.px
    this.cache.set(key, { value, expiresAt })
    this.touchKey(key)
    return 'OK'
  }

  async get(key: string) {
    const item = this.cache.get(key)
    if (!item) return null
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.cache.delete(key)
      return null
    }
    this.touchKey(key)
    return item.value
  }

  async del(key: string) {
    const existed = this.cache.has(key)
    this.cache.delete(key)
    return existed ? 1 : 0
  }

  async keys(pattern: string) {
    const regex = new RegExp('^' + pattern.replace('*', '.*') + '$')
    return Array.from(this.cache.keys()).filter(key => regex.test(key))
  }

  async exists(key: string) {
    const item = this.cache.get(key)
    if (!item) return 0
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.cache.delete(key)
      return 0
    }
    return 1
  }

  async expire(key: string, seconds: number) {
    const item = this.cache.get(key)
    if (!item) return 0
    item.expiresAt = Date.now() + seconds * 1000
    return 1
  }

  async ttl(key: string) {
    const item = this.cache.get(key)
    if (!item) return -2
    if (!item.expiresAt) return -1
    return Math.max(-1, Math.ceil((item.expiresAt - Date.now()) / 1000))
  }

  get size() {
    return this.cache.size
  }
}

// Create Redis client or mock
let redisInstance: any

const hasRedisConfig = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN

if (hasRedisConfig) {
  const { Redis } = require('@upstash/redis')
  redisInstance = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  })
} else {
  redisInstance = new MockRedis()
}

export const redis = redisInstance
export const isRedisConnected = hasRedisConfig

/** Convenience: delete multiple keys at once */
export async function redisDel(...keys: string[]) {
  if (keys.length === 0) return
  await Promise.all(keys.map((k: string) => redis.del(k)))
}

/** Convenience: bust all cache keys matching a pattern prefix */
export async function redisBustPrefix(prefix: string) {
  const keys = await redis.keys(`${prefix}*`)
  if (keys.length > 0) await Promise.all(keys.map((k: string) => redis.del(k)))
}

