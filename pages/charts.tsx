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
  ];
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
        label: '体重（磅）',
        data: weights,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.3,
        fill: false,
      },
      {
        label: '体脂率（%）',
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
    <div className="max-w-3xl mx-auto px-4 py-8">
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
      <h1 className="text-2xl font-bold mb-6 text-center">📊 体脂 / 体重趋势图</h1>
      {logs.length === 0 ? (
        <p className="text-center text-gray-500">暂无记录，请先添加日志</p>
      ) : (
        <Line data={chartData} options={chartOptions} />
      )}
      <a href="/mood-heatmap" className="text-blue-600 hover:underline">查看心情热力图</a>
    </div>
  )
}
