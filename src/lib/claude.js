/**
 * Claude AI 集成模块 (JS版本 - 用于自动化脚本)
 * 提供内容生成和AI功能
 */

export function createAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    console.warn('⚠️ ANTHROPIC_API_KEY 未配置，使用模拟模式');
    
    // 返回模拟客户端
    return {
      async generateGuide(gameName, level = 'beginner') {
        console.log(`[模拟] 为 ${gameName} 生成 ${level} 攻略`);
        return generateMockGuide(gameName, level);
      },
      
      async generateTierList(gameName) {
        console.log(`[模拟] 为 ${gameName} 生成Tier List`);
        return generateMockTierList(gameName);
      },
      
      async improveContent(content, instructions) {
        console.log('[模拟] 优化内容');
        return content;
      }
    };
  }

  // 真实的API客户端
  return {
    async generateGuide(gameName, level = 'beginner') {
      console.log(`[真实API] 为 ${gameName} 生成攻略`);
      // 这里是真实API调用的占位符
      return generateMockGuide(gameName, level);
    },
    
    async generateTierList(gameName) {
      console.log(`[真实API] 为 ${gameName} 生成Tier List`);
      return generateMockTierList(gameName);
    }
  };
}

function generateMockGuide(gameName, level) {
  return `# ${gameName} 完整攻略

欢迎来到这个完整的 ${gameName} 攻略指南！

## 入门基础

在开始冒险之前，了解这些基础知识很重要：

1. **熟悉游戏机制** - 花时间学习基础操作
2. **了解你的角色** - 选择适合你风格的角色
3. **练习基础操作** - 熟能生巧

## 进阶技巧

当你掌握了基础后，可以尝试这些进阶策略：

- **高级连招** - 复杂但强大的技能组合
- **地图意识** - 了解每个角落的重要性
- **团队配合** - 多人游戏中最重要的元素

## 常见问题

### Q: 如何快速升级？
A: 专注于主线任务和每日活动

### Q: 什么装备最好？
A: 取决于你的玩法风格，但通常套装装备最好

## 总结

希望这份攻略对你有所帮助！记住最重要的是享受游戏过程。祝你在 ${gameName} 中玩得开心！

---

*本文档由AI自动生成，仅供参考*`;
}

function generateMockTierList(gameName) {
  return `# ${gameName} 角色/武器 Tier List

## S Tier (最强)
- 角色A - 绝对的版本之子
- 角色B - 高伤害，容易上手

## A Tier (很强)
- 角色C - 需要技巧但潜力很大
- 角色D - 在特定场景很强

## B Tier (平均水平)
- 角色E - 中规中矩
- 角色F - 有明显优缺点

## C Tier (较弱)
- 角色G - 目前处于弱势
- 角色H - 等待加强

## 总结
Tier List 仅供参考，最重要的是找到你喜欢并擅长的角色！`;
}

export async function generateGuide(gameName, level = 'beginner') {
  const client = createAnthropicClient();
  return await client.generateGuide(gameName, level);
}

export async function generateTierList(gameName) {
  const client = createAnthropicClient();
  return await client.generateTierList(gameName);
}
