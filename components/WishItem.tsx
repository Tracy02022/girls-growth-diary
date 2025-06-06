// components/WishItem.tsx
import { formatDistanceToNow } from 'date-fns'

interface Wish {
  id?: string
  title: string
  description?: string
  targetDate: string
  createdAt: string
  isDone: boolean
  userId: string
}

export function WishItem({
  wish,
  onToggle,
}: {
  wish: Wish
  onToggle: (id: string, current: boolean) => void
}) {
  const getCountdownMessage = (targetDateStr: string) => {
    const target = new Date(targetDateStr)
    const now = new Date()
    const diffMs = target.getTime() - now.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays > 0) {
      return `⏳ 距离目标还有 ${diffDays} 天`
    } else if (diffDays === 0) {
      return `🎯 今天就是目标日！`
    } else {
      return `⚠️ 已超过目标 ${Math.abs(diffDays)} 天`
    }
  }

  return (
    <li
      className={`border p-4 rounded shadow-sm bg-white space-y-1 transition-all ${wish.isDone ? 'opacity-50 line-through' : ''
        }`}
    >
      <div className="flex items-center justify-between">
        <span className="font-semibold">{wish.title}</span>
        <input
          type="checkbox"
          checked={wish.isDone}
          onChange={() => onToggle(wish.id!, wish.isDone)}
          className="h-5 w-5 text-green-600"
        />
      </div>
      {!wish.isDone && (
        <div className="text-sm text-gray-600">
          {getCountdownMessage(wish.targetDate)}
        </div>
      )}
    </li>
  )
}

