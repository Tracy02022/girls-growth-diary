// pages/mood-heatmap.tsx (Hover shows log details + click opens detail page)
import { useEffect, useState } from 'react'
import { db, auth } from '../lib/firebase'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import CalendarHeatmap from 'react-calendar-heatmap'
import { Tooltip } from 'react-tooltip'
import { Quicksand, Dancing_Script } from 'next/font/google'
import { useRouter } from 'next/router'

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

const moodColorMap: Record<string, string> = {
  '😊': 'color-happy',
  '😐': 'color-calm',
  '😢': 'color-sad',
  '😡': 'color-angry',
  '😩': 'color-anxious',
  '🥳': 'color-excited',
  '😴': 'color-tired',
  '😞': 'color-down',
}

export default function MoodHeatmapPage() {
  const [logs, setLogs] = useState<FatLog[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Wishes', href: '/wishes' },
    { name: 'Log', href: '/log' },
    { name: 'Charts', href: '/charts' },
    { name: 'Mood', href: '/mood-heatmap' },
    { name: 'Future Letter', href: '/future-letter' },
  ]

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid)
      else window.location.href = '/login'
    })
    return () => unsub()
  }, [])

  useEffect(() => {
    if (userId) {
      const fetchLogs = async () => {
        const q = query(
          collection(db, 'logs'),
          where('userId', '==', userId),
          orderBy('date', 'asc')
        )
        const snapshot = await getDocs(q)
        const entries: FatLog[] = []
        snapshot.forEach((doc) => {
          const data = doc.data() as FatLog
          if (data.mood && data.date) entries.push({ ...data, id: doc.id })
        })
        setLogs(entries)
      }
      fetchLogs()
    }
  }, [userId])

  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(endDate.getDate() - 364)

  const values = logs.map((log) => ({
    date: log.date,
    count: 1,
    mood: log.mood,
  }))

  return (
    <div
      className={`min-h-screen px-4 py-8 bg-[#f2eafa] ${quicksand.className} bg-[url('/bg-girl-topright.png')] bg-no-repeat bg-top-right`}
    >
      <nav className="mb-6 flex justify-center gap-6 text-sm text-purple-700 font-medium">
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className={`hover:underline hover:text-purple-900 ${item.href == '/mood-heatmap' ? 'underline font-semibold text-purple-900' : ''
              }`}
          >
            {item.name}
          </a>
        ))}
      </nav>
      <h1
        className={`text-3xl font-bold mb-6 text-center text-purple-700 ${dancingScript.className}`}
      >
        💭 Mood Heatmap
      </h1>
      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={values}
        showWeekdayLabels
        weekdayLabels={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
        classForValue={(value) => {
          if (!value || !value.mood) return 'color-empty'
          return moodColorMap[value.mood] || 'color-empty'
        }}
        tooltipDataAttrs={(value) => {
          const found = logs.find((log) => log.date === value.date)
          return found
            ? {
                'data-tooltip-id': 'heatmap-tooltip',
                'data-tooltip-html': `
                  <strong>${found.date}</strong><br/>
                  Mood: ${found.mood}<br/>
                  Body Fat: ${found.bodyFat}%<br/>
                  Weight: ${found.weight} lbs<br/>
                  Note: ${found.note || '—'}
                `,
              }
            : {}
        }}
        onClick={(value) => {
          if (value?.date) {
            router.push(`/log/${value.date}`)
          }
        }}
      />
      <Tooltip id="heatmap-tooltip" html={true} />
      <div className="mt-6 text-sm text-center text-gray-600">
        <p className="mb-2">Mood Legend:</p>
        <div className="flex justify-center flex-wrap gap-4">
          {Object.entries(moodColorMap).map(([emoji, colorClass]) => (
            <div key={emoji} className="flex items-center gap-1">
              <div className={`w-4 h-4 rounded ${colorClass}`}></div>
              <span>{emoji}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
