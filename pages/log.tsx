// Enhanced FatLog Page with collapsible history section
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
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'
import UserAvatar from '@/components/UserAvatar'

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
  const [showHistory, setShowHistory] = useState(true)

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Wishes', href: '/wishes' },
    { name: 'Log', href: '/log' },
    { name: 'Charts', href: '/charts' },
    { name: 'Mood', href: '/mood-heatmap' },
    { name: 'Write Future Letters', href: '/future-letter/new' },
    { name: 'Logout', href: '/logout' },
  ];

  const router = useRouter()

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
      className={`min-h-screen px-4 py-8 bg-[#f2eafa] ${quicksand.className} bg-no-repeat bg-top-right`}
    >
      <UserAvatar />
      <nav className="mb-6 flex justify-center gap-6 text-sm text-purple-700 font-medium">
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className={`hover:underline hover:text-purple-900 ${item.href == '/log' ? 'underline font-semibold text-purple-900' : ''
              }`}
          >
            {item.name}
          </a>
        ))}
      </nav>
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

      <div className="mt-10 max-w-xl mx-auto">
        <h2
          className="text-xl font-semibold mb-2 cursor-pointer flex items-center gap-2"
          onClick={() => setShowHistory(!showHistory)}
        >
          <span className={`transform transition-transform ${showHistory ? 'rotate-90' : ''}`}>▶</span>
          📜 History
        </h2>
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-4 max-h-[450px] overflow-y-auto"
            >
              {logs.map((log) => (
                <motion.div
                  key={log.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="border rounded-2xl p-4 bg-white shadow"
                >
                  <div className="font-semibold">📅 {log.date}</div>
                  <div>Body Fat: {log.bodyFat}%</div>
                  <div>
                    Weight: {unit === 'kg' ? (log.weight / 2.20462).toFixed(1) : log.weight} {unit}
                  </div>
                  {log.mood && <div>Mood: {log.mood}</div>}
                  {log.note && <div>Note: {log.note}</div>}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="text-center mt-10">
        <a
          href="/charts"
          className="text-purple-600 underline text-sm hover:text-purple-800"
        >
          📊 View Body Fat Trends
        </a>
      </div>
    </div>
  )
}