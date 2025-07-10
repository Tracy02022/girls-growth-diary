// pages/log/[date].tsx (Styled + English)
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { onAuthStateChanged } from 'firebase/auth'
import { db, auth } from '../../lib/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
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

const moodLabels: Record<string, string> = {
  '😊': 'Happy',
  '😐': 'Calm',
  '😢': 'Sad',
  '😡': 'Angry',
  '😩': 'Anxious',
  '🥳': 'Excited',
  '😴': 'Tired',
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

  if (!date) return <p>Loading...</p>
  if (!log) return <p className="p-4 text-center">No log found for {date}</p>

  return (
    <div
      className={`min-h-screen px-4 py-8 bg-[#f2eafa] ${quicksand.className} bg-no-repeat bg-top-right`}
    >
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow p-6">
        <h1
          className={`text-3xl font-bold mb-4 text-center text-purple-700 ${dancingScript.className}`}
        >
          📅 Log Detail: {log.date}
        </h1>
        <ul className="text-gray-700 space-y-3">
          {log.mood && (
            <li>
              <strong>Mood: </strong>
              <span className="text-lg">{log.mood}</span>{' '}
              ({moodLabels[log.mood] || 'Unknown'})
            </li>
          )}
          <li>
            <strong>Body Fat: </strong> {log.bodyFat}%
          </li>
          <li>
            <strong>Weight: </strong> {log.weight} lbs
          </li>
          {log.note && (
            <li>
              <strong>Note: </strong> {log.note}
            </li>
          )}
          <li>
            <strong>Created At: </strong>{' '}
            {new Date(log.createdAt).toLocaleString()}
          </li>
        </ul>
      </div>
      <div className="text-center mt-6">
        <a
          href="/mood-heatmap"
          className="text-purple-600 underline text-sm hover:text-purple-800"
        >
          🔙 Back to Mood Heatmap
        </a>
      </div>
    </div>
  )
}