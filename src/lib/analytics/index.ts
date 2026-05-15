export { trackPageView, trackEvent, generateSessionId, getSessionData, updateSession, getPageViewStats, shutdown } from './tracker'
export type { TrackPageViewParams, TrackEventParams } from './tracker'

export { getActivitySegments, getEngagementSegments, getPreferenceSegments, getRetentionData, getUserProfile, classifyUser } from './segmentation'
export type { SegmentResult, UserProfile, SegmentType } from './segmentation'

export { getFunnelAnalysis, getDailyConversionRate, FUNNEL_DEFINITIONS } from './funnels'
export type { FunnelStep, FunnelDefinition } from './funnels'

export { getTrendAnalysis, getAllTrends, getAnomalyReport } from './trends'
export type { TrendPoint, TrendResult } from './trends'