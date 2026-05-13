'use client'

import { useState, useEffect } from 'react'
import { 
  Play, Pause, Square, Plus, Edit2, Trash2, Eye, Users, 
  Activity, Clock, Settings, ChevronDown, ChevronUp,
  RefreshCw, X, Save, AlertCircle, CheckCircle
} from 'lucide-react'

interface AIPlayer {
  id: string
  username: string
  email: string
  avatar: string | null
  age: number | null
  occupation: string | null
  personality: Record<string, any>
  interests: string[]
  activity_level: number
  status: 'active' | 'inactive' | 'paused'
  created_at: string
  updated_at: string
  last_activity_at: string | null
  total_posts: number
  total_comments: number
  behavior_config?: BehaviorConfig
}

interface BehaviorConfig {
  wake_up_time: string
  sleep_time: string
  activity_interval_min: number
  activity_interval_max: number
  post_probability: number
  comment_probability: number
  reply_probability: number
  typing_speed_min: number
  typing_speed_max: number
  thinking_time_min: number
  thinking_time_max: number
}

export function AIPlayerManagement() {
  const [players, setPlayers] = useState<AIPlayer[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlayer, setSelectedPlayer] = useState<AIPlayer | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [expandedPlayer, setExpandedPlayer] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [newPlayer, setNewPlayer] = useState({
    username: '',
    email: '',
    avatar: '',
    age: '',
    occupation: '',
    interests: '',
    activity_level: '0.5',
    tone: 'friendly',
    behavior: {
      wake_up_time: '08:00',
      sleep_time: '23:00',
      activity_interval_min: '300',
      activity_interval_max: '1800',
      post_probability: '0.1',
      comment_probability: '0.3',
      reply_probability: '0.5',
      typing_speed_min: '30',
      typing_speed_max: '60',
      thinking_time_min: '2',
      thinking_time_max: '10',
    }
  })

  useEffect(() => {
    fetchPlayers()
  }, [statusFilter])

  const fetchPlayers = async () => {
    setLoading(true)
    try {
      const url = statusFilter === 'all' 
        ? '/api/admin/ai-players' 
        : `/api/admin/ai-players?status=${statusFilter}`
      const response = await fetch(url)
      const data = await response.json()
      if (data.success) {
        setPlayers(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch players:', error)
    }
    setLoading(false)
  }

  const handleStartPlayer = async (playerId: string) => {
    try {
      await fetch(`/api/admin/ai-players/${playerId}/start`, { method: 'POST' })
      fetchPlayers()
    } catch (error) {
      console.error('Failed to start player:', error)
    }
  }

  const handleStopPlayer = async (playerId: string) => {
    try {
      await fetch(`/api/admin/ai-players/${playerId}/stop`, { method: 'POST' })
      fetchPlayers()
    } catch (error) {
      console.error('Failed to stop player:', error)
    }
  }

  const handleDeletePlayer = async (playerId: string) => {
    if (!confirm('Are you sure you want to delete this AI player?')) return
    try {
      await fetch(`/api/admin/ai-players/${playerId}`, { method: 'DELETE' })
      fetchPlayers()
    } catch (error) {
      console.error('Failed to delete player:', error)
    }
  }

  const handleCreatePlayer = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        username: newPlayer.username,
        email: newPlayer.email,
        avatar: newPlayer.avatar,
        age: newPlayer.age ? parseInt(newPlayer.age) : undefined,
        occupation: newPlayer.occupation,
        interests: newPlayer.interests.split(',').map(s => s.trim()).filter(Boolean),
        activity_level: parseFloat(newPlayer.activity_level),
        personality: { tone: newPlayer.tone },
        behavior: {
          wake_up_time: newPlayer.behavior.wake_up_time,
          sleep_time: newPlayer.behavior.sleep_time,
          activity_interval_min: parseInt(newPlayer.behavior.activity_interval_min),
          activity_interval_max: parseInt(newPlayer.behavior.activity_interval_max),
          post_probability: parseFloat(newPlayer.behavior.post_probability),
          comment_probability: parseFloat(newPlayer.behavior.comment_probability),
          reply_probability: parseFloat(newPlayer.behavior.reply_probability),
          typing_speed_min: parseInt(newPlayer.behavior.typing_speed_min),
          typing_speed_max: parseInt(newPlayer.behavior.typing_speed_max),
          thinking_time_min: parseInt(newPlayer.behavior.thinking_time_min),
          thinking_time_max: parseInt(newPlayer.behavior.thinking_time_max),
        }
      }

      const response = await fetch('/api/admin/ai-players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        setShowCreateModal(false)
        setNewPlayer({
          username: '',
          email: '',
          avatar: '',
          age: '',
          occupation: '',
          interests: '',
          activity_level: '0.5',
          tone: 'friendly',
          behavior: {
            wake_up_time: '08:00',
            sleep_time: '23:00',
            activity_interval_min: '300',
            activity_interval_max: '1800',
            post_probability: '0.1',
            comment_probability: '0.3',
            reply_probability: '0.5',
            typing_speed_min: '30',
            typing_speed_max: '60',
            thinking_time_min: '2',
            thinking_time_max: '10',
          }
        })
        fetchPlayers()
      }
    } catch (error) {
      console.error('Failed to create player:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Active'
      case 'inactive': return 'Inactive'
      case 'paused': return 'Paused'
      default: return status
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">AI Player Management</h3>
          <p className="text-sm text-gray-500">Manage and monitor AI player characters</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus size={20} />
          Create AI Player
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-600">Filter:</span>
        </div>
        {['all', 'active', 'inactive', 'paused'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
              statusFilter === status
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status === 'all' ? 'All' : getStatusLabel(status)}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-200">
          {players.map((player) => (
            <div key={player.id}>
              <div 
                className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setExpandedPlayer(expandedPlayer === player.id ? null : player.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-semibold">{player.username.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{player.username}</h4>
                    <p className="text-sm text-gray-500">{player.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Activity size={16} />
                      <span>{player.total_posts} posts</span>
                      <span className="text-gray-300">|</span>
                      <span>{player.total_comments} comments</span>
                    </div>
                    {player.last_activity_at && (
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                        <Clock size={12} />
                        <span>Last active: {new Date(player.last_activity_at).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(player.status)}`}>
                    {getStatusLabel(player.status)}
                  </span>
                  {expandedPlayer === player.id ? (
                    <ChevronUp size={20} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-400" />
                  )}
                </div>
              </div>

              {expandedPlayer === player.id && (
                <div className="px-4 pb-4 bg-gray-50 border-t border-gray-200">
                  <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <Settings size={16} />
                        Character Attributes
                      </h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Age</span>
                          <span className="text-gray-900">{player.age || 'Not set'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Occupation</span>
                          <span className="text-gray-900">{player.occupation || 'Not set'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Activity Level</span>
                          <span className="text-gray-900">{(player.activity_level * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Personality</span>
                          <span className="text-gray-900">
                            {typeof player.personality === 'string' 
                              ? JSON.parse(player.personality).tone 
                              : player.personality.tone || 'Friendly'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Interests</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {Array.isArray(player.interests) 
                              ? player.interests.map((interest, idx) => (
                                  <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                                    {interest}
                                  </span>
                                ))
                              : (typeof player.interests === 'string' 
                                  ? JSON.parse(player.interests).map((i: string, idx: number) => (
                                      <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                                        {i}
                                      </span>
                                    ))
                                  : null)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {player.behavior_config && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                          <Clock size={16} />
                          Behavior Configuration
                        </h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Active Hours</span>
                            <span className="text-gray-900">
                              {player.behavior_config.wake_up_time} - {player.behavior_config.sleep_time}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Activity Interval</span>
                            <span className="text-gray-900">
                              {player.behavior_config.activity_interval_min/60}-{player.behavior_config.activity_interval_max/60} minutes
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Post Probability</span>
                            <span className="text-gray-900">{(player.behavior_config.post_probability * 100).toFixed(0)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Comment Probability</span>
                            <span className="text-gray-900">{(player.behavior_config.comment_probability * 100).toFixed(0)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Reply Probability</span>
                            <span className="text-gray-900">{(player.behavior_config.reply_probability * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedPlayer(player)
                        setShowEditModal(true)
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                    {player.status === 'inactive' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleStartPlayer(player.id)
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                      >
                        <Play size={16} />
                        Start
                      </button>
                    )}
                    {player.status === 'active' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleStopPlayer(player.id)
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-yellow-600 hover:bg-yellow-100 rounded-lg transition-colors"
                      >
                        <Square size={16} />
                        Stop
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeletePlayer(player.id)
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {players.length === 0 && (
          <div className="py-12 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No AI players yet</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Create first AI player
            </button>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Create AI Player</h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreatePlayer} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
                  <input
                    type="text"
                    required
                    value={newPlayer.username}
                    onChange={(e) => setNewPlayer({...newPlayer, username: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={newPlayer.email}
                    onChange={(e) => setNewPlayer({...newPlayer, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={newPlayer.age}
                    onChange={(e) => setNewPlayer({...newPlayer, age: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                  <input
                    type="text"
                    value={newPlayer.occupation}
                    onChange={(e) => setNewPlayer({...newPlayer, occupation: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interests (comma separated)</label>
                <input
                  type="text"
                  value={newPlayer.interests}
                  onChange={(e) => setNewPlayer({...newPlayer, interests: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="games, esports, programming, music"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Activity Level</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={newPlayer.activity_level}
                    onChange={(e) => setNewPlayer({...newPlayer, activity_level: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tone Style</label>
                  <select
                    value={newPlayer.tone}
                    onChange={(e) => setNewPlayer({...newPlayer, tone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="friendly">Friendly</option>
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="humorous">Humorous</option>
                    <option value="sarcastic">Sarcastic</option>
                  </select>
                </div>
              </div>
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Behavior Configuration</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Wake Up Time</label>
                    <input
                      type="time"
                      value={newPlayer.behavior.wake_up_time}
                      onChange={(e) => setNewPlayer({...newPlayer, behavior: {...newPlayer.behavior, wake_up_time: e.target.value}})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sleep Time</label>
                    <input
                      type="time"
                      value={newPlayer.behavior.sleep_time}
                      onChange={(e) => setNewPlayer({...newPlayer, behavior: {...newPlayer.behavior, sleep_time: e.target.value}})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Post Probability</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={newPlayer.behavior.post_probability}
                      onChange={(e) => setNewPlayer({...newPlayer, behavior: {...newPlayer.behavior, post_probability: e.target.value}})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Comment Probability</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={newPlayer.behavior.comment_probability}
                      onChange={(e) => setNewPlayer({...newPlayer, behavior: {...newPlayer.behavior, comment_probability: e.target.value}})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reply Probability</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={newPlayer.behavior.reply_probability}
                      onChange={(e) => setNewPlayer({...newPlayer, behavior: {...newPlayer.behavior, reply_probability: e.target.value}})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Save size={16} />
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
