#!/usr/bin/env node

/**
 * GameHub 性能测试脚本
 * 【窗口A】基础架构修复 - Claude-3.5-Sonnet
 * 用于测试API响应时间和识别性能瓶颈
 */

import https from 'https';
import http from 'http';
import { performance } from 'perf_hooks';

// 测试配置
const BASE_URL = 'http://localhost:3000';
const TEST_ENDPOINTS = [
  '/api/health',
  '/api/games',
  '/api/games/genshin-impact',
  '/api/games/elden-ring',
  '/api/guides',
  '/api/codes/genshin-impact',
];

async function measureApiCall(endpoint) {
  return new Promise((resolve) => {
    const url = new URL(endpoint, BASE_URL);
    const start = performance.now();
    
    const client = url.protocol === 'https:' ? https : http;
    const req = client.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const end = performance.now();
        const duration = end - start;
        
        resolve({
          endpoint,
          status: res.statusCode,
          duration: Math.round(duration),
          size: Buffer.byteLength(data, 'utf8'),
          success: res.statusCode >= 200 && res.statusCode < 300
        });
      });
    });
    
    req.on('error', (err) => {
      const end = performance.now();
      const duration = end - start;
      
      resolve({
        endpoint,
        status: 0,
        duration: Math.round(duration),
        size: 0,
        success: false,
        error: err.message
      });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      const end = performance.now();
      const duration = end - start;
      
      resolve({
        endpoint,
        status: 0,
        duration: Math.round(duration),
        size: 0,
        success: false,
        error: 'Timeout (10s)'
      });
    });
  });
}

async function runPerformanceTest() {
  console.log('🚀 GameHub 性能测试开始...\n');
  console.log('【窗口A】基础架构修复 - Claude-3.5-Sonnet\n');
  
  const results = [];
  
  for (const endpoint of TEST_ENDPOINTS) {
    console.log(`测试中: ${endpoint}`);
    
    // 运行3次测试取平均值
    const runs = [];
    for (let i = 0; i < 3; i++) {
      const result = await measureApiCall(endpoint);
      runs.push(result);
      await new Promise(resolve => setTimeout(resolve, 100)); // 间隔100ms
    }
    
    // 计算平均值
    const avgDuration = Math.round(runs.reduce((sum, r) => sum + r.duration, 0) / runs.length);
    const avgSize = Math.round(runs.reduce((sum, r) => sum + r.size, 0) / runs.length);
    const successRate = runs.filter(r => r.success).length / runs.length;
    
    const testResult = {
      endpoint,
      avgDuration,
      avgSize,
      successRate,
      status: runs[0].status,
      error: runs.find(r => r.error)?.error
    };
    
    results.push(testResult);
    
    // 实时输出结果
    const statusIcon = testResult.successRate === 1 ? '✅' : '❌';
    const performanceIcon = avgDuration < 100 ? '🟢' : avgDuration < 500 ? '🟡' : '🔴';
    
    console.log(`${statusIcon} ${performanceIcon} ${endpoint}`);
    console.log(`   响应时间: ${avgDuration}ms | 数据大小: ${avgSize}B | 成功率: ${(successRate * 100).toFixed(0)}%`);
    if (testResult.error) {
      console.log(`   错误: ${testResult.error}`);
    }
    console.log('');
  }
  
  // 生成性能报告
  console.log('\n📊 性能测试报告\n');
  console.log('=' .repeat(80));
  
  const slowEndpoints = results.filter(r => r.avgDuration > 500);
  const fastEndpoints = results.filter(r => r.avgDuration < 100);
  const failedEndpoints = results.filter(r => r.successRate < 1);
  
  console.log(`🔴 慢响应端点 (>500ms): ${slowEndpoints.length}`);
  slowEndpoints.forEach(r => {
    console.log(`   ${r.endpoint}: ${r.avgDuration}ms`);
  });
  
  console.log(`\n🟡 中等响应端点 (100-500ms): ${results.filter(r => r.avgDuration >= 100 && r.avgDuration <= 500).length}`);
  
  console.log(`\n🟢 快速响应端点 (<100ms): ${fastEndpoints.length}`);
  fastEndpoints.forEach(r => {
    console.log(`   ${r.endpoint}: ${r.avgDuration}ms`);
  });
  
  if (failedEndpoints.length > 0) {
    console.log(`\n❌ 失败端点: ${failedEndpoints.length}`);
    failedEndpoints.forEach(r => {
      console.log(`   ${r.endpoint}: ${r.error || 'HTTP ' + r.status}`);
    });
  }
  
  // 性能优化建议
  console.log('\n🔧 性能优化建议:\n');
  
  if (slowEndpoints.length > 0) {
    console.log('1. 🎯 优先优化以下慢响应端点:');
    slowEndpoints.forEach(r => {
      console.log(`   - ${r.endpoint} (${r.avgDuration}ms) - 检查数据库查询和缓存策略`);
    });
  }
  
  const totalDataSize = results.reduce((sum, r) => sum + r.avgSize, 0);
  if (totalDataSize > 100000) { // >100KB
    console.log('2. 📦 考虑实施响应压缩 (gzip/brotli)');
  }
  
  if (failedEndpoints.length > 0) {
    console.log('3. 🚨 修复失败端点的错误处理');
  }
  
  console.log('4. 💾 确保Redis缓存策略正确配置');
  console.log('5. 📊 添加数据库查询性能监控');
  
  console.log('\n✅ 性能测试完成!\n');
  
  return results;
}

// 直接运行性能测试
runPerformanceTest().catch(console.error);

export { measureApiCall, runPerformanceTest };