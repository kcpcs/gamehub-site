'use client'

export default function SimplePage() {
  return (
    <div style={{ 
      padding: '40px', 
      backgroundColor: '#0d1117', 
      color: '#e6edf3',
      minHeight: '100vh'
    }}>
      <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>✅ 页面工作正常！</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>测试链接:</h2>
        <ul>
          <li><a href="/" style={{ color: '#7c3aed' }}>首页</a></li>
          <li><a href="/games" style={{ color: '#7c3aed' }}>游戏列表</a></li>
          <li><a href="/diagnose" style={{ color: '#7c3aed' }}>诊断页面</a></li>
        </ul>
      </div>
      
      <div style={{ backgroundColor: '#161b22', padding: '20px', borderRadius: '8px' }}>
        <h3>当前时间:</h3>
        <p>{new Date().toLocaleString()}</p>
      </div>
    </div>
  )
}