import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { query, session_id, user_id, game_context } = await req.json()

  if (!query) {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 })
  }

  const difyApiKey = process.env.DIFY_API_KEY
  const difyBaseUrl = process.env.DIFY_BASE_URL || 'https://api.dify.ai/v1'

  if (!difyApiKey) {
    return NextResponse.json({ error: 'RAG service not configured' }, { status: 503 })
  }

  try {
    const response = await fetch(`${difyBaseUrl}/chat-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${difyApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        user_id: user_id || 'anonymous',
        response_mode: 'blocking',
        conversation_id: session_id || undefined,
        knowledge_id: process.env.DIFY_KNOWLEDGE_ID,
        inputs: {
          game_context: game_context || ''
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Dify API error: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json({
      answer: data.answer,
      conversation_id: data.conversation_id,
      message_id: data.message_id
    })
  } catch (error) {
    console.error('[RAG Chat Error]', error)
    return NextResponse.json(
      { error: 'Failed to get response from AI assistant' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({
    status: 'ok',
    service: 'RAG Chat API',
    version: '1.0.0'
  })
}
