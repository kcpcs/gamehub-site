'use client'
 
import { useEffect } from 'react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])
 
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="text-center max-w-2xl">
        <div className="text-8xl font-bold mb-6" style={{ color: '#ef4444' }}>
          !
        </div>
        
        <h1 className="text-2xl font-bold mb-4" style={{ color: '#e6edf3' }}>
          服务不可用
        </h1>
        
        <div className="mb-8 p-4 rounded-lg" style={{ backgroundColor: '#161b22', border: '1px solid #30363d' }}>
          <p className="mb-2" style={{ color: '#8b949e' }}>
            错误信息:
          </p>
          <p className="font-mono text-sm" style={{ color: '#f85149' }}>
            {error.message || '未知错误'}
          </p>
          {error.digest && (
            <p className="mt-2 font-mono text-xs" style={{ color: '#8b949e' }}>
              Digest: {error.digest}
            </p>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
            style={{ backgroundColor: '#7c3aed', color: 'white' }}
          >
            重试
          </button>
          <a
            href="/"
            className="px-6 py-3 rounded-lg font-medium transition-colors"
            style={{ 
              backgroundColor: '#161b22', 
              color: '#e6edf3',
              border: '1px solid #30363d'
            }}
          >
            返回首页
          </a>
        </div>
        
        <div className="mt-8 pt-6" style={{ borderTop: '1px solid #30363d' }}>
          <p className="text-sm mb-4" style={{ color: '#8b949e' }}>
            如果问题持续存在，请尝试以下方法:
          </p>
          <ul className="text-left text-sm list-disc list-inside space-y-2" style={{ color: '#6e7681' }}>
            <li>检查开发服务器是否正在运行</li>
            <li>检查数据库文件 (dev.db) 是否存在</li>
            <li>查看终端中的错误日志</li>
          </ul>
        </div>
      </div>
    </div>
  )
}