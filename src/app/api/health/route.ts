import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { redis, isRedisConnected } from '@/lib/redis'

if (!isRedisConnected) {
  redis.ping = async () => 'PONG'
}
import { logger } from '@/lib/logger'

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  version: string
  uptime: number
  checks: {
    database: {
      status: 'up' | 'down'
      latency_ms?: number
      error?: string
    }
    redis: {
      status: 'up' | 'down'
      latency_ms?: number
      error?: string
    }
    memory: {
      status: 'healthy' | 'warning' | 'critical'
      used_mb: number
      limit_mb: number
      percentage: number
    }
    disk?: {
      status: 'healthy' | 'warning' | 'critical'
      used_gb: number
      total_gb: number
      percentage: number
    }
  }
}

const startTime = Date.now()

export async function GET() {
  const health: HealthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: Math.floor((Date.now() - startTime) / 1000),
    checks: {
      database: { status: 'down' },
      redis: { status: 'down' },
      memory: {
        status: 'healthy',
        used_mb: 0,
        limit_mb: 0,
        percentage: 0,
      },
    },
  }

  const issues: string[] = []

  try {
    const dbStart = Date.now()
    await db.$queryRaw`SELECT 1`
    health.checks.database = {
      status: 'up',
      latency_ms: Date.now() - dbStart,
    }
  } catch (error) {
    health.checks.database = {
      status: 'down',
      error: error instanceof Error ? error.message : 'Unknown database error',
    }
    issues.push('Database connection failed')
    logger.error('Health check: Database connection failed', error as Error)
  }

  try {
    const redisStart = Date.now()
    await redis.ping()
    health.checks.redis = {
      status: 'up',
      latency_ms: Date.now() - redisStart,
      ...(!isRedisConnected && { note: 'Using mock Redis for development' }),
    }
  } catch (error) {
    health.checks.redis = {
      status: 'down',
      error: error instanceof Error ? error.message : 'Unknown Redis error',
    }
    issues.push('Redis connection failed')
    logger.error('Health check: Redis connection failed', error as Error)
  }

  const memUsage = process.memoryUsage()
  const memUsed = Math.round(memUsage.heapUsed / 1024 / 1024)
  const memLimit = Math.round(memUsage.heapTotal / 1024 / 1024)
  const memPercentage = Math.round((memUsed / memLimit) * 100)

  health.checks.memory = {
    status: memPercentage > 90 ? 'critical' : memPercentage > 70 ? 'warning' : 'healthy',
    used_mb: memUsed,
    limit_mb: memLimit,
    percentage: memPercentage,
  }

  if (memPercentage > 90) {
    issues.push(`High memory usage: ${memPercentage}%`)
    logger.warn(`Health check: High memory usage ${memPercentage}%`)
  }

  if (issues.length === 0) {
    health.status = 'healthy'
  } else if (issues.length <= 2 && !issues.some(i => i.includes('Database'))) {
    health.status = 'degraded'
  } else {
    health.status = 'unhealthy'
  }

  const statusCode = health.status === 'healthy' ? 200 : health.status === 'degraded' ? 200 : 503

  return NextResponse.json(health, { status: statusCode })
}
