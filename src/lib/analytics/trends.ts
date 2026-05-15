import { db } from '@/lib/db'
import { redis } from '@/lib/redis'

const TREND_CACHE_TTL = 300

export interface TrendPoint {
  date: string
  value: number
  predicted?: number
  is_anomaly?: boolean
  anomaly_score?: number
}

export interface TrendResult {
  metric: string
  data: TrendPoint[]
  trend_direction: 'up' | 'down' | 'stable'
  trend_slope: number
  anomalies: Array<{ date: string; value: number; score: number }>
  prediction_confidence: number
  next_day_prediction: number | null
  next_week_prediction: number | null
}

function calculateSMA(data: number[], window: number): (number | null)[] {
  const result: (number | null)[] = []
  for (let i = 0; i < data.length; i++) {
    if (i < window - 1) {
      result.push(null)
      continue
    }
    let sum = 0
    for (let j = i - window + 1; j <= i; j++) {
      sum += data[j]
    }
    result.push(sum / window)
  }
  return result
}

function linearRegression(x: number[], y: number[]): { slope: number; intercept: number; r2: number } {
  const n = x.length
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0, sumYY = 0

  for (let i = 0; i < n; i++) {
    sumX += x[i]
    sumY += y[i]
    sumXY += x[i] * y[i]
    sumXX += x[i] * x[i]
    sumYY += y[i] * y[i]
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n

  const meanY = sumY / n
  let ssRes = 0, ssTot = 0
  for (let i = 0; i < n; i++) {
    const predicted = slope * x[i] + intercept
    ssRes += (y[i] - predicted) ** 2
    ssTot += (y[i] - meanY) ** 2
  }

  const r2 = ssTot > 0 ? 1 - ssRes / ssTot : 0

  return { slope, intercept, r2 }
}

function detectAnomalies(
  data: TrendPoint[],
  window: number = 7,
  threshold: number = 2.0
): TrendPoint[] {
  if (data.length < window + 2) return data

  const values = data.map(d => d.value)
  const sma = calculateSMA(values, window)

  const residuals: number[] = []
  for (let i = window - 1; i < values.length; i++) {
    residuals.push(values[i] - (sma[i] || 0))
  }

  let meanResidual = 0, stdResidual = 0
  for (const r of residuals) meanResidual += r
  meanResidual /= residuals.length
  for (const r of residuals) stdResidual += (r - meanResidual) ** 2
  stdResidual = Math.sqrt(stdResidual / residuals.length)

  if (stdResidual === 0) return data

  return data.map((point, i) => {
    if (i < window - 1 || !sma[i]) return point

    const residual = Math.abs(values[i] - (sma[i] || 0))
    const zScore = Math.abs(residual - meanResidual) / stdResidual

    return {
      ...point,
      is_anomaly: zScore > threshold,
      anomaly_score: Math.round(zScore * 100) / 100,
    }
  })
}

async function getPageViewTrend(days: number): Promise<TrendResult> {
  const since = new Date()
  since.setDate(since.getDate() - days)
  since.setHours(0, 0, 0, 0)

  const dailyData = await db.pageView.groupBy({
    by: ['created_at'],
    where: { created_at: { gte: since } },
    _count: { id: true },
    orderBy: { created_at: 'asc' },
  })

  const dateMap = new Map<string, number>()
  for (const d of dailyData) {
    const date = d.created_at.toISOString().slice(0, 10)
    dateMap.set(date, (dateMap.get(date) || 0) + d._count.id)
  }

  const sorted = Array.from(dateMap.entries()).sort(([a], [b]) => a.localeCompare(b))
  const trendPoints: TrendPoint[] = sorted.map(([date, value]) => ({ date, value }))

  const anomalies = detectAnomalies(trendPoints, 7, 2.0)

  const x = trendPoints.map((_, i) => i)
  const y = trendPoints.map(p => p.value)
  const { slope, r2 } = linearRegression(x, y)

  let direction: 'up' | 'down' | 'stable' = 'stable'
  if (slope > 0.05) direction = 'up'
  else if (slope < -0.05) direction = 'down'

  const nextDay = slope * (x.length) + (y.reduce((a, b) => a + b, 0) / y.length)
  const nextWeek = slope * (x.length + 6) + (y.reduce((a, b) => a + b, 0) / y.length)

  const predicted = anomalies.map((p, i) => ({
    ...p,
    predicted: i >= 3 ? Math.round((y.slice(Math.max(0, i - 3), i).reduce((a, b) => a + b, 0) / Math.min(i, 3) + slope) * 100) / 100 : undefined,
  }))

  return {
    metric: 'page_views',
    data: predicted,
    trend_direction: direction,
    trend_slope: Math.round(slope * 1000) / 1000,
    anomalies: predicted.filter(p => p.is_anomaly).map(p => ({
      date: p.date,
      value: p.value,
      score: p.anomaly_score || 0,
    })),
    prediction_confidence: Math.round(r2 * 100) / 100,
    next_day_prediction: nextDay > 0 ? Math.round(nextDay * 100) / 100 : null,
    next_week_prediction: nextWeek > 0 ? Math.round(nextWeek * 100) / 100 : null,
  }
}

async function getArticleCreationTrend(days: number): Promise<TrendResult> {
  const since = new Date()
  since.setDate(since.getDate() - days)
  since.setHours(0, 0, 0, 0)

  const dailyData = await db.article.groupBy({
    by: ['created_at'],
    where: { created_at: { gte: since } },
    _count: { id: true },
    orderBy: { created_at: 'asc' },
  })

  const dateMap = new Map<string, number>()
  for (const d of dailyData) {
    const date = d.created_at.toISOString().slice(0, 10)
    dateMap.set(date, (dateMap.get(date) || 0) + d._count.id)
  }

  const sorted = Array.from(dateMap.entries()).sort(([a], [b]) => a.localeCompare(b))
  const trendPoints: TrendPoint[] = sorted.map(([date, value]) => ({ date, value }))

  const anomalies = detectAnomalies(trendPoints, 7, 2.0)

  const x = trendPoints.map((_, i) => i)
  const y = trendPoints.map(p => p.value)
  const { slope, r2 } = linearRegression(x, y)

  let direction: 'up' | 'down' | 'stable' = 'stable'
  if (slope > 0.05) direction = 'up'
  else if (slope < -0.05) direction = 'down'

  const nextDay = slope * (x.length) + (y.reduce((a, b) => a + b, 0) / y.length)
  const nextWeek = slope * (x.length + 6) + (y.reduce((a, b) => a + b, 0) / y.length)

  const predicted = anomalies.map((p, i) => ({
    ...p,
    predicted: i >= 3 ? Math.round((y.slice(Math.max(0, i - 3), i).reduce((a, b) => a + b, 0) / Math.min(i, 3) + slope) * 100) / 100 : undefined,
  }))

  return {
    metric: 'article_creation',
    data: predicted,
    trend_direction: direction,
    trend_slope: Math.round(slope * 1000) / 1000,
    anomalies: predicted.filter(p => p.is_anomaly).map(p => ({
      date: p.date,
      value: p.value,
      score: p.anomaly_score || 0,
    })),
    prediction_confidence: Math.round(r2 * 100) / 100,
    next_day_prediction: nextDay > 0 ? Math.round(nextDay * 100) / 100 : null,
    next_week_prediction: nextWeek > 0 ? Math.round(nextWeek * 100) / 100 : null,
  }
}

async function getUserRegistrationTrend(days: number): Promise<TrendResult> {
  const since = new Date()
  since.setDate(since.getDate() - days)
  since.setHours(0, 0, 0, 0)

  const dailyData = await db.user.groupBy({
    by: ['created_at'],
    where: { created_at: { gte: since } },
    _count: { id: true },
    orderBy: { created_at: 'asc' },
  })

  const dateMap = new Map<string, number>()
  for (const d of dailyData) {
    const date = d.created_at.toISOString().slice(0, 10)
    dateMap.set(date, (dateMap.get(date) || 0) + d._count.id)
  }

  const sorted = Array.from(dateMap.entries()).sort(([a], [b]) => a.localeCompare(b))
  const trendPoints: TrendPoint[] = sorted.map(([date, value]) => ({ date, value }))

  const anomalies = detectAnomalies(trendPoints, 7, 2.0)

  const x = trendPoints.map((_, i) => i)
  const y = trendPoints.map(p => p.value)
  const { slope, r2 } = linearRegression(x, y)

  let direction: 'up' | 'down' | 'stable' = 'stable'
  if (slope > 0.05) direction = 'up'
  else if (slope < -0.05) direction = 'down'

  const nextDay = slope * (x.length) + (y.reduce((a, b) => a + b, 0) / y.length)
  const nextWeek = slope * (x.length + 6) + (y.reduce((a, b) => a + b, 0) / y.length)

  const predicted = anomalies.map((p, i) => ({
    ...p,
    predicted: i >= 3 ? Math.round((y.slice(Math.max(0, i - 3), i).reduce((a, b) => a + b, 0) / Math.min(i, 3) + slope) * 100) / 100 : undefined,
  }))

  return {
    metric: 'user_registration',
    data: predicted,
    trend_direction: direction,
    trend_slope: Math.round(slope * 1000) / 1000,
    anomalies: predicted.filter(p => p.is_anomaly).map(p => ({
      date: p.date,
      value: p.value,
      score: p.anomaly_score || 0,
    })),
    prediction_confidence: Math.round(r2 * 100) / 100,
    next_day_prediction: nextDay > 0 ? Math.round(nextDay * 100) / 100 : null,
    next_week_prediction: nextWeek > 0 ? Math.round(nextWeek * 100) / 100 : null,
  }
}

export async function getTrendAnalysis(metric: string, days: number = 30): Promise<TrendResult> {
  const cacheKey = `analytics:trend:${metric}:${days}`
  const cached = await redis.get(cacheKey)
  if (cached) return typeof cached === 'string' ? JSON.parse(cached) : cached

  try {
    let result: TrendResult

    switch (metric) {
      case 'page_views':
        result = await getPageViewTrend(days)
        break
      case 'article_creation':
        result = await getArticleCreationTrend(days)
        break
      case 'user_registration':
        result = await getUserRegistrationTrend(days)
        break
      default:
        result = await getPageViewTrend(days)
    }

    await redis.set(cacheKey, JSON.stringify(result), { ex: TREND_CACHE_TTL })
    return result
  } catch (err) {
    console.error('[Analytics] getTrendAnalysis error:', err)
    return {
      metric,
      data: [],
      trend_direction: 'stable',
      trend_slope: 0,
      anomalies: [],
      prediction_confidence: 0,
      next_day_prediction: null,
      next_week_prediction: null,
    }
  }
}

export async function getAllTrends(days: number = 30): Promise<{
  page_views: TrendResult
  article_creation: TrendResult
  user_registration: TrendResult
}> {
  const cacheKey = `analytics:all_trends:${days}`
  const cached = await redis.get(cacheKey)
  if (cached) return typeof cached === 'string' ? JSON.parse(cached) : cached

  try {
    const [pageViews, articles, users] = await Promise.all([
      getPageViewTrend(days),
      getArticleCreationTrend(days),
      getUserRegistrationTrend(days),
    ])

    const result = { page_views: pageViews, article_creation: articles, user_registration: users }
    await redis.set(cacheKey, JSON.stringify(result), { ex: TREND_CACHE_TTL })
    return result
  } catch (err) {
    console.error('[Analytics] getAllTrends error:', err)
    return {
      page_views: { metric: 'page_views', data: [], trend_direction: 'stable', trend_slope: 0, anomalies: [], prediction_confidence: 0, next_day_prediction: null, next_week_prediction: null },
      article_creation: { metric: 'article_creation', data: [], trend_direction: 'stable', trend_slope: 0, anomalies: [], prediction_confidence: 0, next_day_prediction: null, next_week_prediction: null },
      user_registration: { metric: 'user_registration', data: [], trend_direction: 'stable', trend_slope: 0, anomalies: [], prediction_confidence: 0, next_day_prediction: null, next_week_prediction: null },
    }
  }
}

export async function getAnomalyReport(days: number = 30): Promise<{
  total_anomalies: number
  anomalies_by_metric: Record<string, Array<{ date: string; value: number; score: number }>>
  summary: string
}> {
  const trends = await getAllTrends(days)

  const allAnomalies: Record<string, Array<{ date: string; value: number; score: number }>> = {}
  let totalAnomalies = 0

  for (const [key, trend] of Object.entries(trends)) {
    if (trend.anomalies.length > 0) {
      allAnomalies[key] = trend.anomalies
      totalAnomalies += trend.anomalies.length
    }
  }

  let summary = '未检测到异常'
  if (totalAnomalies > 10) {
    summary = `检测到 ${totalAnomalies} 个异常点，需要关注数据质量或业务变化`
  } else if (totalAnomalies > 0) {
    summary = `检测到 ${totalAnomalies} 个异常点，属于正常波动范围`
  }

  return {
    total_anomalies: totalAnomalies,
    anomalies_by_metric: allAnomalies,
    summary,
  }
}