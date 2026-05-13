export default function TestPage() {
  return (
    <div className="min-h-screen p-8" style={{ background: '#0d1117', color: '#e6edf3' }}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">GameHub 诊断测试</h1>
        
        <div className="space-y-4">
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#161b22', border: '1px solid #30363d' }}>
            <h2 className="font-semibold mb-2" style={{ color: '#7c3aed' }}>✓ 基础服务正常</h2>
            <p className="text-sm" style={{ color: '#8b949e' }}>
              Next.js 开发服务器正在运行
            </p>
          </div>
          
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#161b22', border: '1px solid #30363d' }}>
            <h2 className="font-semibold mb-2" style={{ color: '#7c3aed' }}>下一步测试</h2>
            <ul className="text-sm space-y-2" style={{ color: '#8b949e' }}>
              <li>• <a href="/api/health" style={{ color: '#7c3aed' }}>点击这里检查健康状态</a></li>
              <li>• <a href="/games" style={{ color: '#7c3aed' }}>点击这里访问游戏列表</a></li>
              <li>• <a href="/" style={{ color: '#7c3aed' }}>点击这里返回首页</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}