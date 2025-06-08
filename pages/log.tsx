// pages/log.tsx
import { useEffect, useState } from 'react'
import { db, auth } from '../lib/firebase'
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

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

export default function FatLogPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [logs, setLogs] = useState<FatLog[]>([])
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [bodyFat, setBodyFat] = useState('')
  const [weight, setWeight] = useState('')
  const [unit, setUnit] = useState<'lb' | 'kg'>('lb')
  const [mood, setMood] = useState('')
  const [note, setNote] = useState('')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid)
      } else {
        window.location.href = '/login'
      }
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (userId) loadLogs(userId)
  }, [userId])

  const loadLogs = async (uid: string) => {
    try {
      const q = query(
        collection(db, 'logs'),
        where('userId', '==', uid),
        orderBy('date', 'desc')
      )
      const snapshot = await getDocs(q)
      const results: FatLog[] = []
      snapshot.forEach((doc) => {
        const data = doc.data() as FatLog
        results.push({ ...data, id: doc.id })
      })
      setLogs(results)
    } catch (err) {
      console.error('加载日志失败:', err)
    }
  }

  const addLog = async () => {
    if (!userId || !date || !bodyFat || !weight) return
    const weightVal = parseFloat(weight)
    const finalWeight = unit === 'kg' ? weightVal * 2.20462 : weightVal
    const newLog: FatLog = {
      userId,
      date,
      bodyFat: parseFloat(bodyFat),
      weight: parseFloat(finalWeight.toFixed(1)),
      mood,
      note,
      createdAt: new Date().toISOString(),
    }
    await addDoc(collection(db, 'logs'), newLog)
    setBodyFat('')
    setWeight('')
    setMood('')
    setNote('')
    loadLogs(userId)
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">📉 体脂日志</h1>

      <div className="space-y-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="number"
          step="0.1"
          placeholder="体脂率 %"
          value={bodyFat}
          onChange={(e) => setBodyFat(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="number"
          step="0.1"
          placeholder={`体重（${unit === 'lb' ? '磅' : '公斤'}）`}
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <div className="text-right mb-2 text-sm">
          <button
            onClick={() => {
              const weightVal = parseFloat(weight)
              if (!isNaN(weightVal)) {
                if (unit === 'lb') {
                  // lb -> kg
                  const converted = weightVal / 2.20462
                  setWeight(converted.toFixed(1))
                  setUnit('kg')
                } else {
                  // kg -> lb
                  const converted = weightVal * 2.20462
                  setWeight(converted.toFixed(1))
                  setUnit('lb')
                }
              } else {
                setUnit(unit === 'lb' ? 'kg' : 'lb') // 没有输入值时只切单位
              }
            }}
            className="text-blue-600 underline"
          >
            切换为 {unit === 'lb' ? '公斤' : '磅'}
          </button>

        </div>
        <select
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">选择今日心情</option>
          <option value="😊">😊 开心</option>
          <option value="😐">😐 平静</option>
          <option value="😞">😞 低落</option>
          <option value="😡">😡 生气</option>
          <option value="😩">😩 压力大</option>
          <option value="🥳">🥳 兴奋</option>
          <option value="😴">😴 累了</option>
          <option value="😢">😢 想哭</option>
        </select>
        <textarea
          placeholder="备注（可选）"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        ></textarea>
        <button
          onClick={addLog}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          添加日志
        </button>
      </div>

      <div className="mt-10 space-y-4">
        <h2 className="text-xl font-semibold">📜 历史记录</h2>
        {logs.map((log) => (
          <div key={log.id} className="border rounded p-4 bg-white shadow">
            <div className="font-semibold">📅 {log.date}</div>
            <div>体脂率: {log.bodyFat}%</div>
            <div>
              体重: {unit === 'kg' ? (log.weight / 2.20462).toFixed(1) : log.weight}{' '}
              {unit}
            </div>
            {log.mood && <div>心情: {log.mood}</div>}
            {log.note && <div>备注: {log.note}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
