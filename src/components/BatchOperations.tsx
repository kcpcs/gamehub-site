'use client'

import { useState, useRef } from 'react'
import { Upload, Download, FileText, AlertCircle, Check, RefreshCw, Trash2, Edit2 } from 'lucide-react'

interface BatchOperationsProps {
  type: 'games' | 'articles' | 'codes'
  onComplete?: () => void
}

export function BatchOperations({ type, onComplete }: BatchOperationsProps) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const typeLabels = {
    games: 'Games',
    articles: 'Articles',
    codes: 'Codes',
  }

  const handleExport = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/admin/import-export?type=${type}&format=csv`)
      
      if (!response.ok) {
        throw new Error('Export failed')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${type}-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setResult({ message: 'Export completed successfully' })
      onComplete?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed')
    } finally {
      setLoading(false)
    }
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setLoading(true)
      setError(null)
      setResult(null)

      const text = await file.text()
      const lines = text.split('\n').filter(line => line.trim())
      
      if (lines.length < 2) {
        throw new Error('CSV file must have header and at least one data row')
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
      
      const data: Record<string, any>[] = []
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
        const row: Record<string, any> = {}
        headers.forEach((header, index) => {
          let value = values[index] || ''
          try {
            const parsed = JSON.parse(value)
            value = parsed
          } catch {
          }
          row[header] = value
        })
        data.push(row)
      }

      const response = await fetch('/api/admin/import-export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data, mode: 'update' }),
      })

      const result = await response.json()

      if (result.success) {
        setResult(result.data)
        onComplete?.()
      } else {
        throw new Error(result.error || 'Import failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed')
    } finally {
      setLoading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
          <FileText className="text-blue-500" size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Batch {typeLabels[type]}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Import or export {typeLabels[type].toLowerCase()} data</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <span className="text-red-600 dark:text-red-400 text-sm">{error}</span>
        </div>
      )}

      {/* Result Message */}
      {result && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Check className="w-5 h-5 text-green-500" />
            <span className="font-medium text-green-700 dark:text-green-400">Operation Successful</span>
          </div>
          <div className="text-sm text-green-600 dark:text-green-300 space-y-1">
            {result.message && <p>{result.message}</p>}
            {result.created !== undefined && <p>Created: {result.created}</p>}
            {result.updated !== undefined && <p>Updated: {result.updated}</p>}
            {result.skipped !== undefined && <p>Skipped: {result.skipped}</p>}
            {result.errors?.length > 0 && (
              <div className="mt-2">
                <p className="font-medium">Errors:</p>
                <ul className="list-disc list-inside text-xs">
                  {result.errors.slice(0, 5).map((err: string, i: number) => (
                    <li key={i}>{err}</li>
                  ))}
                  {result.errors.length > 5 && <li>...and {result.errors.length - 5} more errors</li>}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-4">
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.json"
            onChange={handleImport}
            className="hidden"
            id={`import-${type}`}
          />
          <label
            htmlFor={`import-${type}`}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload size={18} />}
            Import CSV
          </label>
        </div>
        
        <button
          onClick={handleExport}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download size={18} />}
          Export CSV
        </button>
      </div>

      {/* Format Guide */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">CSV Format Requirements</h4>
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          {type === 'games' && (
            <>
              <p><strong>Required Fields:</strong> name, slug</p>
              <p><strong>Optional Fields:</strong> cover_url, platforms, genres, description, developer, publisher</p>
              <p><strong>Example:</strong> name,slug,cover_url,platforms,genres,description</p>
              <p>Genshin Impact,genshin-impact,https://...,PC|Mobile,Action RPG,A popular gacha game</p>
            </>
          )}
          {type === 'articles' && (
            <>
              <p><strong>Required Fields:</strong> title, slug</p>
              <p><strong>Optional Fields:</strong> content, article_type, status, excerpt, game_id</p>
              <p><strong>Example:</strong> title,slug,article_type,status</p>
              <p>Beginner Guide,genshin-beginner-guide,guide,published</p>
            </>
          )}
          {type === 'codes' && (
            <>
              <p><strong>Required Fields:</strong> code, game_id</p>
              <p><strong>Optional Fields:</strong> reward_desc, source, status, expires_at</p>
              <p><strong>Example:</strong> code,game_id,reward_desc,status</p>
              <p>GENSHINGIFT,abc123,100 Primogems,active</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
