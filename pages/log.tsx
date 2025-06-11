// Enhanced FatLog Page with consistent style
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
import { Quicksand, Dancing_Script } from 'next/font/google'

const quicksand = Quicksand({ subsets: ['latin'] })
const dancingScript = Dancing_Script({ subsets: ['latin'], weight: ['700'] })

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
      console.error('Failed to load logs:', err)
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
    <div
      className={`min-h-screen px-4 py-8 bg-purple-50 ${quicksand.className} bg-[url('/bg-girl-topright.png')] bg-no-repeat bg-top-right`}
    >
      <h1 className={`text-3xl font-bold mb-6 text-center text-purple-700 ${dancingScript.className}`}>
        📉 Body Fat Log
      </h1>

      <div className="max-w-xl mx-auto space-y-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border px-3 py-2 rounded-xl"
        />
        <input
          type="number"
          step="0.1"
          placeholder="Body Fat %"
          value={bodyFat}
          onChange={(e) => setBodyFat(e.target.value)}
          className="w-full border px-3 py-2 rounded-xl"
        />
        <input
          type="number"
          step="0.1"
          placeholder={`Weight (${unit === 'lb' ? 'lbs' : 'kg'})`}
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-full border px-3 py-2 rounded-xl"
        />
        <div className="text-right text-sm">
          <button
            onClick={() => {
              const weightVal = parseFloat(weight)
              if (!isNaN(weightVal)) {
                if (unit === 'lb') {
                  setWeight((weightVal / 2.20462).toFixed(1))
                  setUnit('kg')
                } else {
                  setWeight((weightVal * 2.20462).toFixed(1))
                  setUnit('lb')
                }
              } else {
                setUnit(unit === 'lb' ? 'kg' : 'lb')
              }
            }}
            className="text-blue-600 underline"
          >
            Switch to {unit === 'lb' ? 'kg' : 'lbs'}
          </button>
        </div>

        <select
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          className="w-full border px-3 py-2 rounded-xl"
        >
          <option value="">Select Mood</option>
          <option value="😊">😊 Happy</option>
          <option value="😐">😐 Calm</option>
          <option value="😞">😞 Down</option>
          <option value="😡">😡 Angry</option>
          <option value="😩">😩 Anxious</option>
          <option value="🥳">🥳 Excited</option>
          <option value="😴">😴 Tired</option>
          <option value="😢">😢 Sad</option>
        </select>
        <textarea
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full border px-3 py-2 rounded-xl"
        ></textarea>
        <button
          onClick={addLog}
          className="w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700"
        >
          Add Log
        </button>
      </div>

      <div className="mt-10 max-w-xl mx-auto space-y-4">
        <h2 className="text-xl font-semibold">📜 History</h2>
        {logs.map((log) => (
          <div key={log.id} className="border rounded-2xl p-4 bg-white shadow">
            <div className="font-semibold">📅 {log.date}</div>
            <div>Body Fat: {log.bodyFat}%</div>
            <div>
              Weight: {unit === 'kg' ? (log.weight / 2.20462).toFixed(1) : log.weight} {unit}
            </div>
            {log.mood && <div>Mood: {log.mood}</div>}
            {log.note && <div>Note: {log.note}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}