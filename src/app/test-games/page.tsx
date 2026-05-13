'use client'

import { useEffect, useState } from 'react'
import { GameCard } from '@/components/games/GameCard'

export default function TestPage() {
  const [games, setGames] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        console.log('开始加载游戏数据...')
        const res = await fetch('/api/games')
        console.log('响应状态:', res.status)
        
        if (!res.ok) throw new Error('API 请求失败')
        
        const data = await res.json()
        console.log('API 响应:', JSON.stringify(data, null, 2))
        
        if (data.success && data.data?.games) {
          setGames(data.data.games)
        }
      } catch (err) {
        console.error('加载错误:', err)
        setError(err instanceof Error ? err.message : '未知错误')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (loading) {
    return (
      <div style={{ padding: '40px', backgroundColor: '#0d1117', color: '#fff' }}>
        <h1>正在加载...</h1>
        <p>请查看浏览器控制台 (F12) 看有什么错误</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '40px', backgroundColor: '#0d1117', color: '#ff4444' }}>
        <h1>错误!</h1>
        <p>{error}</p>
        <h2>原始数据:</h2>
        <pre>{JSON.stringify(games, null, 2)}</pre>
      </div>
    )
  }

  return (
    <div style={{ padding: '40px', backgroundColor: '#0d1117', color: '#e6edf3' }}>
      <h1>测试页面 - 直接显示</h1>
      <p>找到 {games.length} 个游戏</p>
      
      <h2>原始数据 (前2个游戏:</h2>
      <pre style={{ fontSize: '10px', maxHeight: '300px', overflow: 'auto' }}>
        {JSON.stringify(games.slice(0, 2), null, 2)}
      </pre>

      <h2>GameCard 渲染:</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginTop: '20px' }}>
        {games.slice(0, 4).map((game) => (
          <div key={game.id} style={{ border: '1px solid #30363d', padding: '12px', borderRadius: '8px' }}>
            <h3>{game.name}</h3>
            <p>slug: {game.slug}</p>
            <p>cover_url: {game.cover_url}</p>
            <p>platforms: {JSON.stringify(game.platforms)}</p>
            <p>guide_count: {game.guide_count}</p>
          </div>
          ))}
      </div>
    </div>
  )
}