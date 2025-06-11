// pages/charts.tsx
import { useEffect, useState } from 'react'
import { db, auth } from '../lib/firebase'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
} from 'chart.js'
import { Quicksand, Dancing_Script } from 'next/font/google'

const quicksand = Quicksand({ subsets: ['latin'] })
const dancingScript = Dancing_Script({ subsets: ['latin'], weight: ['700'] })

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip)

interface LogEntry {
  date: string
  weight: number
  bodyFat: number
}

export default function ChartsPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Wishes', href: '/wishes' },
    { name: 'Log', href: '/log' },
    { name: 'Charts', href: '/charts' },
    { name: 'Mood', href: '/mood-heatmap' },
  ]

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
    const q = query(
      collection(db, 'logs'),
      where('userId', '==', uid),
      orderBy('date', 'asc')
    )
    const snapshot = await getDocs(q)
    const results: LogEntry[] = []
    snapshot.forEach((doc) => {
      const data = doc.data() as LogEntry
      results.push(data)
    })
    setLogs(results)
  }

  const dates = logs.map((log) => log.date)
  const weights = logs.map((log) => log.weight)
  const bodyFats = logs.map((log) => log.bodyFat)

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: 'Weight (lbs)',
        data: weights,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.3,
        fill: false,
      },
      {
        label: 'Body Fat (%)',
        data: bodyFats,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.3,
        fill: false,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  }

  return (
    <div
      className={`min-h-screen px-4 py-8 bg-purple-50 ${quicksand.className} bg-[url('/bg-girl-topright.png')] bg-no-repeat bg-top-right`}
    >
      <nav className="mb-6 flex justify-center gap-6 text-sm text-purple-700 font-medium">
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="hover:underline hover:text-purple-900"
          >
            {item.name}
          </a>
        ))}
      </nav>

      <h1 className={`text-3xl font-bold mb-6 text-center text-purple-700 ${dancingScript.className}`}>
        📊 Body Fat / Weight Trend
      </h1>

      <div className="max-w-3xl mx-auto">
        {logs.length === 0 ? (
          <p className="text-center text-gray-500">No logs found. Please add entries first.</p>
        ) : (
          <Line data={chartData} options={chartOptions} />
        )}
      </div>

      <div className="text-center mt-10">
        <a
          href="/mood-heatmap"
          className="text-purple-600 underline text-sm hover:text-purple-800"
        >
          🔥 View Mood Heatmap
        </a>
      </div>
    </div>
  )
}
