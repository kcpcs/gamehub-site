// @ts-nocheck
import { algoliasearch, SearchIndex, type SearchResponse } from 'algoliasearch'

interface SearchResult {
  id: string
  type: 'game' | 'guide'
  title: string
  slug: string
  imageUrl?: string
  excerpt?: string
  gameName?: string
}

interface GameIndexDocument {
  objectID: string
  type: 'game'
  title: string
  slug: string
  imageUrl: string
  platforms: string[]
  genres: string[]
}

interface GuideIndexDocument {
  objectID: string
  type: 'guide'
  title: string
  slug: string
  imageUrl?: string
  excerpt: string
  gameName: string
}

const hasAlgoliaConfig = 
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID && 
  process.env.ALGOLIA_ADMIN_KEY

let searchIndex: SearchIndex | null = null

if (hasAlgoliaConfig) {
  try {
    const client = algoliasearch(
      process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
      process.env.ALGOLIA_ADMIN_KEY!
    )
    searchIndex = client.initIndex('gamehub')
    console.log('[Algolia] Connected to Algolia search')
  } catch (error) {
    console.error('[Algolia] Failed to initialize:', error)
    searchIndex = null
  }
}

class AlgoliaService {
  async searchGames(query: string, limit = 10): Promise<SearchResult[]> {
    if (!searchIndex) {
      console.warn('[Algolia] Not configured, returning empty results')
      return []
    }

    try {
      const result: SearchResponse<GameIndexDocument> = await searchIndex.search(query, {
        filters: 'type:"game"',
        hitsPerPage: limit,
        attributesToRetrieve: ['objectID', 'title', 'slug', 'imageUrl'],
      })

      return result.hits.map(hit => ({
        id: hit.objectID,
        type: 'game',
        title: hit.title,
        slug: hit.slug,
        imageUrl: hit.imageUrl,
      }))
    } catch (error) {
      console.error('[Algolia] Search error:', error)
      return []
    }
  }

  async searchGuides(query: string, limit = 10): Promise<SearchResult[]> {
    if (!searchIndex) {
      console.warn('[Algolia] Not configured, returning empty results')
      return []
    }

    try {
      const result: SearchResponse<GuideIndexDocument> = await searchIndex.search(query, {
        filters: 'type:"guide"',
        hitsPerPage: limit,
        attributesToRetrieve: ['objectID', 'title', 'slug', 'imageUrl', 'excerpt', 'gameName'],
      })

      return result.hits.map(hit => ({
        id: hit.objectID,
        type: 'guide',
        title: hit.title,
        slug: hit.slug,
        imageUrl: hit.imageUrl,
        excerpt: hit.excerpt,
        gameName: hit.gameName,
      }))
    } catch (error) {
      console.error('[Algolia] Search error:', error)
      return []
    }
  }

  async searchAll(query: string, limit = 10): Promise<SearchResult[]> {
    if (!searchIndex) {
      console.warn('[Algolia] Not configured, returning empty results')
      return []
    }

    try {
      const result = await searchIndex.search(query, {
        hitsPerPage: limit,
        attributesToRetrieve: ['objectID', 'type', 'title', 'slug', 'imageUrl', 'excerpt', 'gameName'],
      })

      return result.hits.map(hit => ({
        id: hit.objectID,
        type: hit.type === 'game' ? 'game' : 'guide',
        title: hit.title,
        slug: hit.slug,
        imageUrl: hit.imageUrl,
        excerpt: hit.excerpt,
        gameName: hit.gameName,
      }))
    } catch (error) {
      console.error('[Algolia] Search error:', error)
      return []
    }
  }

  async indexGame(game: { id: string; name: string; slug: string; cover_url: string; platforms: string[]; genres: string[] }): Promise<void> {
    if (!searchIndex) {
      console.warn('[Algolia] Not configured, skipping indexing')
      return
    }

    try {
      const document: GameIndexDocument = {
        objectID: `game-${game.id}`,
        type: 'game',
        title: game.name,
        slug: game.slug,
        imageUrl: game.cover_url,
        platforms: game.platforms,
        genres: game.genres,
      }

      await searchIndex.saveObject(document)
      console.log('[Algolia] Indexed game:', game.name)
    } catch (error) {
      console.error('[Algolia] Index game error:', error)
    }
  }

  async indexArticle(article: { id: string; title: string; slug: string; cover_url?: string; excerpt: string; game_name?: string }): Promise<void> {
    if (!searchIndex) {
      console.warn('[Algolia] Not configured, skipping indexing')
      return
    }

    try {
      const document: GuideIndexDocument = {
        objectID: `article-${article.id}`,
        type: 'guide',
        title: article.title,
        slug: article.slug,
        imageUrl: article.cover_url,
        excerpt: article.excerpt,
        gameName: article.game_name || '',
      }

      await searchIndex.saveObject(document)
      console.log('[Algolia] Indexed article:', article.title)
    } catch (error) {
      console.error('[Algolia] Index article error:', error)
    }
  }

  async deleteFromIndex(type: 'game' | 'article', id: string): Promise<void> {
    if (!searchIndex) {
      console.warn('[Algolia] Not configured, skipping deletion')
      return
    }

    try {
      const objectID = `${type}-${id}`
      await searchIndex.deleteObject(objectID)
      console.log('[Algolia] Deleted:', objectID)
    } catch (error) {
      console.error('[Algolia] Delete error:', error)
    }
  }

  async updateGame(game: { id: string; name: string; slug: string; cover_url: string; platforms: string[]; genres: string[] }): Promise<void> {
    await this.indexGame(game)
  }

  async updateArticle(article: { id: string; title: string; slug: string; cover_url?: string; excerpt: string; game_name?: string }): Promise<void> {
    await this.indexArticle(article)
  }
}

export const algolia = new AlgoliaService()

export type { SearchResult, GameIndexDocument, GuideIndexDocument }