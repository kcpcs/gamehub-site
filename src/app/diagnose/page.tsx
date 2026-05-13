'use client'

import { useEffect, useState } from 'react'

export default function DiagnosePage() {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/games')
        const json = await res.json()
        setData(json)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="p-8" style={{ backgroundColor: '#0d1117', color: '#e6edf3', minHeight: '100vh' }}>
      <h1 className="text-2xl font-bold mb-4">API 诊断页面</h1>
      
      {error && (
        <div className="mb-4 p-4 rounded" style={{ backgroundColor: '#ff444422', color: '#ff4444' }}>
          <strong>错误:</strong> {error}
        </div>
      )}

      {data && (
        <div>
          <h2 className="text-xl font-semibold mb-2">API 响应:</h2>
          <pre className="p-4 rounded overflow-auto" style={{ backgroundColor: '#161b22', fontSize: '12px' }}>
            {JSON.stringify(data, null, 2)}
          </pre>

          {data.data?.games && (
            <>
              <h2 className="text-xl font-semibold mt-6 mb-2">第一个游戏数据:</h2>
              <pre className="p-4 rounded overflow-auto" style={{ backgroundColor: '#161b22', fontSize: '12px' }}>
                {JSON.stringify(data.data.games[0], null, 2)}
              </pre>
              
              <h2 className="text-xl font-semibold mt-6 mb-2">数据类型检查:</h2>
              <div className="p-4 rounded" style={{ backgroundColor: '#161b22' }}>
                <p>game.platforms 类型: {typeof data.data.games[0]?.platforms}</p>
                <p>game.platforms 是数组: {Array.isArray(data.data.games[0]?.platforms) ? '是' : '否'}</p>
                <p>game.scores 类型: {typeof data.data.games[0]?.scores}</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}