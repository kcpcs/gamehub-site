/**
 * Algolia 索引脚本 (v5 API)
 * 将数据库中的游戏、文章、兑换码导入 Algolia
 *
 * 运行: node algolia-index.cjs
 */

const { algoliasearch } = require('algoliasearch');
const { PrismaClient } = require('@prisma/client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');

const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID || 'RL3MTAFSLK';
const ALGOLIA_API_KEY = process.env.ALGOLIA_API_KEY || '7e1021cdf7d0951f7bc2b861d3c5dd19';

const adapter = new PrismaLibSql({ url: 'file:./dev.db' });
const db = new PrismaClient({ adapter });
const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);

async function indexGames() {
  console.log('📦 索引游戏数据...');
  const games = await db.game.findMany();

  function parseJsonField(value) {
    if (!value) return [];
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [String(parsed)];
    } catch {
      // 可能是逗号分隔的字符串
      if (typeof value === 'string' && value.includes(',')) {
        return value.split(',').map(s => s.trim());
      }
      return value ? [String(value)] : [];
    }
  }

  const records = games.map((game) => ({
    objectID: game.id,
    slug: game.slug,
    name: game.name,
    description: game.description || '',
    platforms: parseJsonField(game.platforms),
    genres: parseJsonField(game.genres),
    tags: parseJsonField(game.tags),
    developer: game.developer || '',
    publisher: game.publisher || '',
    cover_url: game.cover_url || '',
    score_opencritic: game.score_opencritic,
    score_steam_pct: game.score_steam_pct,
    score_community: game.score_community,
    guide_count: game.guide_count,
    code_count: game.code_count,
    has_tier_list: game.has_tier_list,
    release_date: game.release_date ? new Date(game.release_date).toISOString() : null,
    type: 'game',
  }));

  await client.saveObjects({ indexName: 'gamehub_games', objects: records });
  console.log(`   ✅ 已索引 ${records.length} 款游戏`);
}

async function indexArticles() {
  console.log('📝 索引文章数据...');
  const articles = await db.article.findMany({ include: { game: true } });

  const records = articles.map((article) => ({
    objectID: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt || '',
    content: article.content ? article.content.substring(0, 5000) : '',
    article_type: article.article_type,
    status: article.status,
    game_name: article.game?.name || '',
    game_slug: article.game?.slug || '',
    cover_url: article.cover_url || '',
    view_count: article.view_count,
    share_count: article.share_count,
    published_at: article.published_at ? new Date(article.published_at).toISOString() : null,
    type: 'article',
  }));

  await client.saveObjects({ indexName: 'gamehub_articles', objects: records });
  console.log(`   ✅ 已索引 ${records.length} 篇文章`);
}

async function indexCodes() {
  console.log('🎁 索引兑换码数据...');
  const codes = await db.gameCode.findMany({ include: { game: true } });

  const records = codes.map((code) => ({
    objectID: code.id,
    code: code.code,
    reward_desc: code.reward_desc || '',
    status: code.status,
    game_name: code.game?.name || '',
    game_slug: code.game?.slug || '',
    source: code.source || '',
    expires_at: code.expires_at ? new Date(code.expires_at).toISOString() : null,
    type: 'code',
  }));

  await client.saveObjects({ indexName: 'gamehub_codes', objects: records });
  console.log(`   ✅ 已索引 ${records.length} 个兑换码`);
}

async function configureSettings() {
  console.log('⚙️  配置搜索设置...');

  await client.setSettings({
    indexName: 'gamehub_games',
    indexSettings: {
      searchableAttributes: ['name', 'description', 'genres', 'tags', 'developer', 'publisher'],
      attributesForFaceting: ['genres', 'platforms', 'tags', 'type'],
      ranking: ['typo', 'words', 'filters', 'proximity', 'attribute', 'exact', 'custom'],
      customRanking: ['desc(score_opencritic)', 'desc(guide_count)'],
      hitsPerPage: 20,
    },
  });
  console.log('   ✅ gamehub_games 设置完成');

  await client.setSettings({
    indexName: 'gamehub_articles',
    indexSettings: {
      searchableAttributes: ['title', 'excerpt', 'content', 'game_name'],
      attributesForFaceting: ['article_type', 'status', 'type'],
      ranking: ['typo', 'words', 'filters', 'proximity', 'attribute', 'exact'],
      customRanking: ['desc(view_count)', 'desc(published_at)'],
      hitsPerPage: 20,
    },
  });
  console.log('   ✅ gamehub_articles 设置完成');

  await client.setSettings({
    indexName: 'gamehub_codes',
    indexSettings: {
      searchableAttributes: ['code', 'reward_desc', 'game_name'],
      attributesForFaceting: ['status', 'type'],
      ranking: ['typo', 'words', 'filters', 'proximity', 'attribute', 'exact'],
      hitsPerPage: 20,
    },
  });
  console.log('   ✅ gamehub_codes 设置完成');
}

async function main() {
  console.log('🚀 Algolia 索引开始...\n');

  try {
    await indexGames();
    await indexArticles();
    await indexCodes();
    await configureSettings();

    console.log('\n─────────────────────────────────');
    console.log('✅ 索引完成！');
    console.log('   gamehub_games    - 游戏搜索');
    console.log('   gamehub_articles - 文章搜索');
    console.log('   gamehub_codes    - 兑换码搜索');
    console.log('─────────────────────────────────');
  } catch (err) {
    console.error('\n❌ 索引失败:', err.message);
    if (err.stack) console.error(err.stack);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

main();
