'use client'

import { useEffect } from 'react'

interface SchemaOrgProps {
  schemas: Record<string, unknown>[]
}

export function SchemaOrg({ schemas }: SchemaOrgProps) {
  useEffect(() => {
    schemas.forEach(schema => {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.text = JSON.stringify(schema)
      const type = (schema['@type'] as string)?.toLowerCase()
      script.id = `schema-${type || Math.random().toString(36)}`
      document.head.appendChild(script)
    })

    return () => {
      schemas.forEach(schema => {
        const type = (schema['@type'] as string)?.toLowerCase()
        const id = `schema-${type || ''}`
        const existing = document.getElementById(id)
        if (existing) existing.remove()
      })
    }
  }, [schemas])

  return null
}
