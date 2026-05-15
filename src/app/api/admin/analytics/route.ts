import { NextRequest, NextResponse } from 'next/server'

export async function GET(_request: NextRequest) {
  return NextResponse.json({
    success: true,
    data: {
      endpoints: {
        behavior: '/api/admin/analytics/behavior?days=7&path=/',
        segments: '/api/admin/analytics/segments?type=activity|engagement|preference|retention&days=30',
        funnels: '/api/admin/analytics/funnels?funnel=visit_to_register&days=30&type=funnel|daily_conversion|definitions',
        trends: '/api/admin/analytics/trends?metric=page_views&days=30&type=trend|all|anomalies',
      },
      description: 'GameHub 数据分析API',
      categories: [
        {
          name: '行为追踪',
          endpoints: [
            { path: '/api/admin/analytics/behavior', method: 'GET', description: '页面浏览统计' },
            { path: '/api/analytics/track', method: 'POST', description: '客户端行为追踪（公开）' },
          ],
        },
        {
          name: '用户分群',
          endpoints: [
            { path: '/api/admin/analytics/segments', method: 'GET', description: '用户分群与画像分析' },
            { path: '/api/admin/analytics/segments', method: 'POST', description: '触发用户分类' },
          ],
        },
        {
          name: '漏斗分析',
          endpoints: [
            { path: '/api/admin/analytics/funnels', method: 'GET', description: '转化漏斗分析' },
          ],
        },
        {
          name: '趋势预测',
          endpoints: [
            { path: '/api/admin/analytics/trends', method: 'GET', description: '趋势预测与异常检测' },
          ],
        },
      ],
    },
  })
}