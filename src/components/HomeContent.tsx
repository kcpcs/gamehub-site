'use client'

import Link from 'next/link'
import { GameCard } from '@/components/games/GameCard'
import { ResponsiveImage } from '@/components/ResponsiveImage'
import { SkeletonCard, SkeletonGameCard, SkeletonBanner } from '@/components/Skeleton'
import { Search, Sparkles, BookOpen, Gift, Trophy, TrendingUp, Star, Zap, Gamepad2, Users, Clock } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import { getGameCoverUrl } from '@/lib/game-images'

interface Guide {
  id: string | number
  slug: string
  title: string
  excerpt?: string
  cover_url?: string
  game_name?: string
  game_slug?: string
  read_time?: number
  view_count?: number
}

interface Game {
  id: string | number
  slug: string
  name: string
  cover?: { url: string; igdb_url?: string }
  cover_url?: string
  scores?: {
    opencritic?: number | null
    community?: number | null
    steam_positive_pct?: number | null
    review_count?: number
  }
  platforms?: string[]
  genres?: string[]
  screenshots?: any[]
  tags?: any[]
  has_tier_list?: boolean
  created_at?: string
  updated_at?: string
  guide_count?: number
  code_count?: number
}

interface HomeContentProps {
  featuredGames: Game[]
  stats: { games: number; articles: number; codes: number }
  latestGuides: Guide[]
  trendingGames: Game[]
}

export function HomeContent({ featuredGames, stats, latestGuides, trendingGames }: HomeContentProps) {
  const { t, lang } = useLanguage()

  const displayGames = featuredGames.length > 0 ? featuredGames : []
  const displayStats = stats.games > 0 ? stats : { games: 0, articles: 0, codes: 0 }

  const statsItems = [
    { key: 'games', value: displayStats.games, label: t('game'), icon: Gamepad2 },
    { key: 'articles', value: displayStats.articles, label: t('guide'), icon: BookOpen },
    { key: 'codes', value: displayStats.codes, label: t('code'), icon: Gift },
    { key: 'visitors', value: 125000, label: t('views'), icon: Users },
  ].filter(item => item.value > 0)

  return (
    <div className="space-y-16">
      <section className="relative rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f0a1e 0%, #1a1033 30%, #0d1117 70%, #1a0a2e 100%)' }}>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full animate-pulse" style={{ background: 'rgba(124, 58, 237, 0.15)', filter: 'blur(120px)' }} />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full animate-pulse" style={{ background: 'rgba(59, 130, 246, 0.15)', filter: 'blur(100px)', animationDelay: '1.5s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full" style={{ background: 'rgba(168, 85, 247, 0.05)', filter: 'blur(150px)' }} />

          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `radial-gradient(circle at 20% 30%, rgba(124, 58, 237, 0.3) 0%, transparent 30%),
             radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.3) 0%, transparent 30%),
             radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.2) 0%, transparent 40%)`
          }} />
        </div>

        <div className="relative px-6 py-24 md:py-32 lg:py-40">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 transition-all duration-300 hover:scale-105"
                 style={{ background: 'rgba(124, 58, 237, 0.15)', border: '1px solid rgba(124, 58, 237, 0.3)', backdropFilter: 'blur(10px)' }}>
              <Sparkles className="w-4 h-4 animate-spin" style={{ color: '#a855f7', animationDuration: '3s' }} />
              <span className="text-sm font-medium" style={{ color: '#c084fc' }}>
                {lang === 'en' ? 'New guides added daily' : lang === 'zh' ? '每日新增攻略' : lang === 'ja' ? '毎日新しいガイド追加' : lang === 'ko' ? '매일 새로운 가이드 추가' : 'Nuevas guías cada día'}
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                {lang === 'en' ? 'Ultimate Gaming' : lang === 'zh' ? '终极游戏攻略' : lang === 'ja' ? '究極のゲーム' : lang === 'ko' ? '최고의 게이밍' : 'Gaming'}
              </span>
              <br />
              <span style={{ color: 'var(--text-primary)' }}>
                {lang === 'en' ? 'Guide Hub' : lang === 'zh' ? '中心' : lang === 'ja' ? 'ガイドハブ' : lang === 'ko' ? '가이드 허브' : 'Guide Hub'}
              </span>
            </h1>

            <p className="text-xl md:text-2xl lg:text-3xl max-w-3xl mx-auto mb-12 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {lang === 'en' ? 'Live redeem codes, AI-powered tier lists, walkthroughs and patch notes — updated in real time.' :
               lang === 'zh' ? '实时兑换码、AI生成的强度排名、完整攻略和更新说明 — 实时更新。' :
               lang === 'ja' ? 'ライブ引換えコード、AI搭載ティアリスト、ウォークスルー、パッチノート — リアルタイム更新。' :
               lang === 'ko' ? '실시간 리딤 코드, AI 기반 티어 리스트, 워크스루, 패치 노트 — 실시간 업데이트。' :
               'Códigos en vivo, listas de niveles con IA, guías y notas de parche — actualizadas en tiempo real。'}
            </p>

            <div className="relative max-w-2xl mx-auto mb-16">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <Search className="w-6 h-6" style={{ color: 'var(--text-muted)' }} />
              </div>
              <input
                type="text"
                placeholder={t('search')}
                className="w-full pl-14 pr-6 py-5 rounded-2xl text-lg transition-all duration-300 focus:scale-[1.02] focus:shadow-2xl"
                style={{
                  backgroundColor: 'rgba(17, 24, 39, 0.8)',
                  border: '2px solid rgba(124, 58, 237, 0.3)',
                  color: 'var(--text-primary)',
                  boxShadow: '0 4px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)'
                }}
              />
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <kbd className="px-2 py-1 text-xs rounded-md" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'var(--text-muted)' }}>
                  Enter
                </kbd>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {statsItems.map((stat, index) => (
                <div
                  key={stat.key}
                  className="relative group"
                  style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="relative p-6 rounded-2xl transition-all duration-300 hover:scale-105"
                       style={{
                         background: 'rgba(30, 27, 75, 0.3)',
                         border: '1px solid rgba(124, 58, 237, 0.2)',
                         backdropFilter: 'blur(10px)'
                       }}>
                    <div className="flex items-center justify-center mb-3">
                      <stat.icon className="w-6 h-6" style={{ color: '#a855f7' }} />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      {stat.value.toLocaleString()}+
                    </div>
                    <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{stat.label}</div>

                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                         style={{ background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="absolute -top-8 left-0 right-0 h-16" style={{ background: 'linear-gradient(to bottom, transparent, var(--bg-primary))' }} />

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl" style={{ backgroundColor: 'rgba(124, 58, 237, 0.1)' }}>
              <TrendingUp className="w-6 h-6" style={{ color: '#a855f7' }} />
            </div>
            <div>
              <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {lang === 'en' ? 'Trending Games' : lang === 'zh' ? '热门游戏' : lang === 'ja' ? '人気のゲーム' : lang === 'ko' ? '인기 게임' : 'Juegos Populares'}
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {lang === 'en' ? 'Most popular games this week' : lang === 'zh' ? '本周最受欢迎游戏' : lang === 'ja' ? '今週人気のゲーム' : lang === 'ko' ? '이 주 인기 게임' : 'Los juegos más populares esta semana'}
              </p>
            </div>
          </div>
          <Link
            href="/games"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105"
            style={{
              color: 'var(--accent-light)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border)'
            }}
          >
            {t('view_all')}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {trendingGames.length > 0 ? trendingGames.map((game, index) => (
            <Link
              key={game.id}
              href={`/games/${game.slug}`}
              className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02]"
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border)',
              }}
            >
              <div className="flex items-center gap-4 p-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={game.cover_url || game.cover?.url}
                      alt={game.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute -top-1 -left-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                       style={{
                         background: index < 3 ? '#f59e0b' : '#6b7280',
                         color: '#fff'
                       }}>
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                    {game.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <BookOpen className="w-3 h-3" />
                    <span>{game.guide_count} {t('guide')}</span>
                  </div>
                </div>
                <Trophy className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ color: '#f59e0b' }} />
              </div>
            </Link>
          )) : (
            [...Array(5)].map((_, i) => (
              <div key={i} className="p-4 rounded-2xl" style={{ backgroundColor: 'var(--bg-surface)' }}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl animate-pulse" style={{ backgroundColor: 'var(--bg-overlay)' }} />
                  <div className="flex-1">
                    <div className="h-4 w-24 rounded animate-pulse mb-1" style={{ backgroundColor: 'var(--bg-overlay)' }} />
                    <div className="h-3 w-16 rounded animate-pulse" style={{ backgroundColor: 'var(--bg-overlay)' }} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
              <Star className="w-6 h-6" style={{ color: '#22c55e' }} />
            </div>
            <div>
              <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {lang === 'en' ? 'Featured Games' : lang === 'zh' ? '精选游戏' : lang === 'ja' ? '注目のゲーム' : lang === 'ko' ? '인기 게임' : 'Juegos Destacados'}
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {lang === 'en' ? 'Top games with the most comprehensive guides' : lang === 'zh' ? '拥有最全面攻略的热门游戏' : lang === 'ja' ? '最も包括的なガイド付きのトップゲーム' : lang === 'ko' ? '가장 완전한 가이드가 있는 게임' : 'Los mejores juegos con las guías más completas'}
              </p>
            </div>
          </div>
          <Link
            href="/games"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105"
            style={{
              color: 'var(--accent-light)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border)'
            }}
          >
            {t('view_all')}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {displayGames.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {displayGames.map((game, i) => (
              <GameCard key={game.id} game={game as any} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {[...Array(6)].map((_, i) => (
              <SkeletonGameCard key={i} />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
              <Zap className="w-6 h-6" style={{ color: '#3b82f6' }} />
            </div>
            <div>
              <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {lang === 'en' ? 'Latest Guides' : lang === 'zh' ? '最新攻略' : lang === 'ja' ? '最新ガイド' : lang === 'ko' ? '최신 가이드' : 'Últimas Guías'}
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {lang === 'en' ? 'Fresh content from our community' : lang === 'zh' ? '我们社区的新鲜内容' : lang === 'ja' ? 'コミュニティからの新鮮なコンテンツ' : lang === 'ko' ? '커뮤니티의 새로운 콘텐츠' : 'Contenido nuevo de nuestra comunidad'}
              </p>
            </div>
          </div>
          <Link
            href="/guides"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105"
            style={{
              color: 'var(--accent-light)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border)'
            }}
          >
            {t('view_all')}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestGuides.length > 0 ? (
            latestGuides.map((guide, index) => (
              <Link
                key={guide.id}
                href={`/guides/${guide.slug}`}
                className="group block rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02]"
                style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
              >
                <div className="relative aspect-video overflow-hidden">
                  <ResponsiveImage
                    src={guide.cover_url && !guide.cover_url.includes('picsum.photos') ? guide.cover_url : getGameCoverUrl(guide.game_name || guide.title)}
                    alt={guide.title}
                    className="transition-transform duration-500 group-hover:scale-105"
                    priority={index < 2}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{ backgroundColor: 'rgba(124, 58, 237, 0.9)', color: '#fff' }}>
                      {lang === 'en' ? 'New' : lang === 'zh' ? '新' : lang === 'ja' ? '新規' : lang === 'ko' ? '새로운' : 'Nuevo'}
                    </span>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                         style={{ backgroundColor: 'rgba(0,0,0,0.7)', color: '#fff' }}>
                      <Clock className="w-3 h-3" />
                      {guide.read_time} {t('minutes_read')}
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  {guide.game_name && (
                    <p className="text-xs font-medium mb-2 px-2 py-1 rounded-full w-fit"
                       style={{ backgroundColor: 'rgba(124, 58, 237, 0.1)', color: 'var(--accent-light)' }}>
                      {guide.game_name}
                    </p>
                  )}
                  <h3 className="font-bold text-lg mb-2 line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                    {guide.title}
                  </h3>
                  <p className="text-sm line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                    {guide.excerpt || t('read_more')}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span>{guide.read_time} {t('minutes_read')}</span>
                    <span>{guide.view_count} {t('views')}</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            [...Array(3)].map((_, i) => (
              <SkeletonCard key={i} />
            ))
          )}
        </div>
      </section>

      <section className="rounded-3xl p-8 md:p-12"
               style={{ background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)', border: '1px solid var(--border)' }}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl" style={{ backgroundColor: 'rgba(124, 58, 237, 0.2)' }}>
              <Gift className="w-8 h-8" style={{ color: '#a855f7' }} />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                {lang === 'en' ? 'Redeem Free Rewards' : lang === 'zh' ? '领取免费奖励' : lang === 'ja' ? '無料報酬を</minimax:tool_call>' : lang === 'ko' ? '무료 보상 받기' : 'Canjear Recompensas Gratis'}
              </h2>
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                {lang === 'en' ? 'Get free in-game currency, items, and exclusive rewards with our verified codes.' : lang === 'zh' ? '使用我们验证过的兑换码获取免费游戏货币、道具和专属奖励。' : lang === 'ja' ? '確認済みコードで無料ゲーム通貨、アイテム、独占的な報酬を取得。' : lang === 'ko' ? '확인된 코드로 무료 게임 통화, 아이템, 독점 보상을 받으세요。' : 'Obtén moneda de juego gratuita, artículos y recompensas exclusivas con nuestros códigos verificados。'}
              </p>
            </div>
          </div>
          <Link
            href="/codes"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              color: '#fff',
              boxShadow: '0 4px 20px rgba(124, 58, 237, 0.4)'
            }}
          >
            <Gift size={20} />
            {t('browse_codes')}
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '🎮', label: 'Genshin Impact', count: '12' },
            { icon: '🎯', label: 'Valorant', count: '8' },
            { icon: '⚔️', label: 'Roblox', count: '15' },
            { icon: '🛡️', label: 'Fortnite', count: '6' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl transition-all duration-300 hover:scale-105"
                 style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
              <span className="text-2xl">{item.icon}</span>
              <div>
                <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{item.label}</div>
                <div className="text-xs" style={{ color: '#22c55e' }}>{item.count} {lang === 'en' ? 'active' : lang === 'zh' ? '活跃' : lang === 'ja' ? 'アクティブ' : lang === 'ko' ? '활성' : 'activo'}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        <div
          className="relative overflow-hidden group p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
          style={{ background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(159, 103, 255, 0.05) 100%)' }}>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl" style={{ background: 'rgba(124, 58, 237, 0.2)' }}>
              <BookOpen className="w-6 h-6" style={{ color: '#a855f7' }} />
            </div>
            <div>
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{t('expert_guides')}</h3>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                {lang === 'en' ? 'Walkthroughs, builds, and strategies from pro players' : lang === 'zh' ? '来自职业玩家的攻略、构建和策略' : lang === 'ja' ? 'プロプレイヤーからのウォークスルー、ビルド、戦略' : lang === 'ko' ? '프로 플레이어의 워크스루, 빌드, 전략' : 'Guías, builds y estrategias de jugadores profesionales'}
              </p>
              <Link
                href="/guides"
                className="inline-flex items-center gap-1 mt-3 text-sm font-medium"
                style={{ color: '#a855f7' }}
              >
                {t('explore_guides')}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full opacity-10" style={{ background: '#7c3aed' }} />
        </div>

        <div
          className="relative overflow-hidden group p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
          style={{ background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.05) 100%)' }}>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl" style={{ background: 'rgba(34, 197, 94, 0.2)' }}>
              <Gift className="w-6 h-6" style={{ color: '#22c55e' }} />
            </div>
            <div>
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{t('codes')}</h3>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                {lang === 'en' ? 'Live codes for free rewards, updated daily' : lang === 'zh' ? '每日更新的实时兑换码' : lang === 'ja' ? '毎日更新のライブコード' : lang === 'ko' ? '매일 업데이트되는 라이브 코드' : 'Códigos en vivo para recompensas gratuitas, actualizados diariamente'}
              </p>
              <Link
                href="/codes"
                className="inline-flex items-center gap-1 mt-3 text-sm font-medium"
                style={{ color: '#22c55e' }}
              >
                {t('browse_codes')}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full opacity-10" style={{ background: '#22c55e' }} />
        </div>

        <div
          className="relative overflow-hidden group p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
          style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%)' }}>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl" style={{ background: 'rgba(59, 130, 246, 0.2)' }}>
              <Trophy className="w-6 h-6" style={{ color: '#3b82f6' }} />
            </div>
            <div>
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{t('tier_list')}</h3>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                {lang === 'en' ? 'AI-powered rankings for characters, weapons, and builds' : lang === 'zh' ? 'AI驱动的角色、武器和构建排名' : lang === 'ja' ? 'AI駆動のキャラクター、武器、ビルドランキング' : lang === 'ko' ? 'AI 기반의 캐릭터, 무기, 빌드 순위' : 'Clasificaciones con IA para personajes, armas y builds'}
              </p>
              <Link
                href="/tier-list"
                className="inline-flex items-center gap-1 mt-3 text-sm font-medium"
                style={{ color: '#3b82f6' }}
              >
                {t('view_all')}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full opacity-10" style={{ background: '#3b82f6' }} />
        </div>
      </section>
    </div>
  )
}