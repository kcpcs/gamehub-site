import { useState } from 'react'
import { Plus, Search, Edit2, Trash2, Eye } from 'lucide-react'

interface TierEntry {
  name: string
  grade: string
  description: string
}

interface TierList {
  id: string
  game_name: string
  category: string
  patch_version: string
  entries: TierEntry[]
}

const mockTierLists: TierList[] = [
  {
    id: '1',
    game_name: '原神',
    category: '角色',
    patch_version: '4.5',
    entries: [
      { name: '雷电将军', grade: 'S', description: '最强输出角色之一' },
      { name: '纳西妲', grade: 'S', description: '顶级草元素辅助' },
      { name: '胡桃', grade: 'A', description: '强力火元素输出' },
      { name: '甘雨', grade: 'A', description: '优秀的冰元素输出' },
      { name: '钟离', grade: 'S', description: '最强护盾角色' },
    ]
  },
  {
    id: '2',
    game_name: 'Valorant',
    category: '特工',
    patch_version: '7.0',
    entries: [
      { name: 'Jett', grade: 'S', description: '高机动性决斗者' },
      { name: 'Sage', grade: 'A', description: '强大的支援角色' },
      { name: 'Omen', grade: 'A', description: '出色的信息控制' },
      { name: 'Reyna', grade: 'S', description: '高击杀潜力' },
      { name: 'Brimstone', grade: 'B', description: '区域控制专家' },
    ]
  },
  {
    id: '3',
    game_name: '艾尔登法环',
    category: '武器',
    patch_version: '1.10',
    entries: [
      { name: '月影', grade: 'S', description: '最强直剑之一' },
      { name: '亵渎圣剑', grade: 'S', description: '强力信仰武器' },
      { name: '巨剑', grade: 'A', description: '高伤害武器' },
      { name: '名刀月隐', grade: 'A', description: '优秀的太刀' },
      { name: '黄金树大盾', grade: 'B', description: '强力盾牌' },
    ]
  },
]

export function TierListManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [tierLists] = useState(mockTierLists)
  const [selectedTierList, setSelectedTierList] = useState<TierList | null>(null)
  const [showModal, setShowModal] = useState(false)

  const filteredTierLists = tierLists.filter(list =>
    list.game_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    list.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个排行榜吗？')) {
      console.log('删除排行榜:', id)
    }
  }

  const handleView = (list: TierList) => {
    setSelectedTierList(list)
    setShowModal(true)
  }

  const gradeColors: Record<string, string> = {
    'S': 'bg-red-500',
    'A': 'bg-orange-500',
    'B': 'bg-yellow-500',
    'C': 'bg-green-500',
    'D': 'bg-gray-500',
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="搜索排行榜..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          <Plus size={20} />
          添加排行榜
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">游戏</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">分类</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">版本</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">条目数</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">预览</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredTierLists.map((list) => (
              <tr key={list.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-medium text-gray-900 dark:text-white">{list.game_name}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded">
                    {list.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                  {list.patch_version}
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 text-sm font-medium bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-full">
                    {list.entries.length}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-1">
                    {list.entries.slice(0, 5).map((entry, index) => (
                      <span
                        key={index}
                        className={`w-6 h-6 ${gradeColors[entry.grade]} rounded flex items-center justify-center text-white text-xs font-bold`}
                        title={`${entry.name}: ${entry.grade}`}
                      >
                        {entry.grade}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => handleView(list)} className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors" title="查看">
                      <Eye size={18} />
                    </button>
                    <button className="p-2 text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/50 rounded-lg transition-colors" title="编辑">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(list.id)} className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-colors" title="删除">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedTierList && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">排行榜详情</h3>
              <div className="space-y-3 mb-4">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">游戏：</span>
                  <span className="font-medium">{selectedTierList.game_name}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">分类：</span>
                  <span>{selectedTierList.category}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">版本：</span>
                  <span>{selectedTierList.patch_version}</span>
                </div>
              </div>
              <div className="space-y-2">
                {selectedTierList.entries.map((entry, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className={`w-8 h-8 ${gradeColors[entry.grade]} rounded flex items-center justify-center text-white font-bold`}>
                      {entry.grade}
                    </span>
                    <div className="flex-1">
                      <div className="font-medium">{entry.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{entry.description}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setShowModal(false)} className="mt-6 w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
