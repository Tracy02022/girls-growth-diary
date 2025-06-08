import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { onAuthStateChanged } from 'firebase/auth'
import { db, auth } from '../../lib/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

interface FatLog {
  id?: string
  userId: string
  date: string
  bodyFat: number
  weight: number
  mood?: string
  note?: string
  createdAt: string
}

const moodLabels: Record<string, string> = {
  '😊': '开心',
  '😐': '平静',
  '😢': '伤心',
  '😡': '生气',
  '😩': '焦虑',
  '🥳': '兴奋',
  '😴': '疲惫',
}

export default function LogDetailPage() {
  const router = useRouter()
  const { date } = router.query
  const [log, setLog] = useState<FatLog | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid)
      else router.push('/login')
    })
    return () => unsub()
  }, [router])

  useEffect(() => {
    if (userId && typeof date === 'string') {
      const fetchLog = async () => {
        const q = query(
          collection(db, 'logs'),
          where('userId', '==', userId),
          where('date', '==', date)
        )
        const snapshot = await getDocs(q)
        if (!snapshot.empty) {
          const data = snapshot.docs[0].data() as FatLog
          setLog(data)
        }
      }
      fetchLog()
    }
  }, [userId, date])

  if (!date) return <p>加载中...</p>
  if (!log) return <p className="p-4 text-center">没有找到该日期的记录：{date}</p>

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">📅 日志详情：{log.date}</h1>
      <ul className="text-gray-700 space-y-3">
        {log.mood && (
          <li>
            <strong>心情：</strong>
            <span className="text-lg">{log.mood}</span>（{moodLabels[log.mood] || '未知'}）
          </li>
        )}
        <li>
          <strong>体脂率：</strong> {log.bodyFat}%
        </li>
        <li>
          <strong>体重：</strong> {log.weight} lbs
        </li>
        {log.note && (
          <li>
            <strong>备注：</strong> {log.note}
          </li>
        )}
        <li>
          <strong>记录时间：</strong> {new Date(log.createdAt).toLocaleString()}
        </li>
      </ul>
    </div>
  )
}
