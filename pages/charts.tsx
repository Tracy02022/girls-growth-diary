// pages/charts.tsx (Enhanced with unit toggle + bar/line switch)
import { useEffect, useState } from 'react'
import { db } from '../lib/firebase'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { Line, Bar } from 'react-chartjs-2'
import LayoutWithNav from '@/components/AvatarDropdownLayout'
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
} from 'chart.js'
import { Quicksand, Dancing_Script } from 'next/font/google'

const quicksand = Quicksand({ subsets: ['latin'] })
const dancingScript = Dancing_Script({ subsets: ['latin'], weight: ['700'] })

ChartJS.register(LineElement, BarElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip)

interface LogEntry {
  date: string
  weight: number
  bodyFat: number
}

export default function ChartsPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [unit, setUnit] = useState<'lb' | 'kg'>('lb')
  const [chartType, setChartType] = useState<'line' | 'bar'>('line')

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Wishes', href: '/wishes' },
    { name: 'Log', href: '/log' },
    { name: 'Charts', href: '/charts' },
    { name: 'Mood', href: '/mood-heatmap' },
    { name: 'Write Future Letters', href: '/future-letter/new' },
    { name: 'Logout', href: '/logout' },
  ]

  useEffect(() => {
    const uid = localStorage.getItem('userId')
    if (uid) {
      setUserId(uid)
    } else {
      window.location.href = '/login.html'
    }
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
  const weights = logs.map((log) =>
    unit === 'kg' ? parseFloat((log.weight / 2.20462).toFixed(1)) : log.weight
  )
  const bodyFats = logs.map((log) => log.bodyFat)

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: `Weight (${unit})`,
        data: weights,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.3)',
        tension: 0.3,
        fill: chartType === 'line' ? false : true,
      },
      {
        label: 'Body Fat (%)',
        data: bodyFats,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.3)',
        tension: 0.3,
        fill: chartType === 'line' ? false : true,
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

  const ChartComponent = chartType === 'line' ? Line : Bar

  return (
    <LayoutWithNav>
      <div
        className={`min-h-screen px-4 py-8 bg-[#f2eafa] ${quicksand.className} bg-no-repeat bg-top-right`}
      >
        {/* <div className="absolute top-4 right-4 z-20">
        <UserAvatar />
      </div>      
      <nav className="mb-6 flex justify-center gap-6 text-sm text-purple-700 font-medium">
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className={`hover:underline hover:text-purple-900 ${
              item.href == '/charts' ? 'underline font-semibold text-purple-900' : ''
            }`}
          >
            {item.name}
          </a>
        ))}
      </nav>  */}
        <h1 className={`text-3xl font-bold mb-4 text-center text-purple-700 ${dancingScript.className}`}>
          📊 Body Fat / Weight Trend
        </h1>

        <div className="max-w-3xl mx-auto mb-4 flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={() => setUnit(unit === 'lb' ? 'kg' : 'lb')}
            className="bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700 text-sm"
          >
            Switch to {unit === 'lb' ? 'kg' : 'lb'}
          </button>
          <button
            onClick={() => setChartType(chartType === 'line' ? 'bar' : 'line')}
            className="bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700 text-sm"
          >
            Switch to {chartType === 'line' ? 'Bar' : 'Line'} Chart
          </button>
        </div>

        <div className="max-w-3xl mx-auto">
          {logs.length === 0 ? (
            <p className="text-center text-gray-500">No logs found. Please add entries first.</p>
          ) : (
            <ChartComponent data={chartData} options={chartOptions} />
          )}
        </div>

        <div className="text-center mt-10">
          <a
            href="/mood-heatmap.html"
            className="text-purple-600 underline text-sm hover:text-purple-800"
          >
            🔥 View Mood Heatmap
          </a>
        </div>
      </div>
    </LayoutWithNav>
  )
}