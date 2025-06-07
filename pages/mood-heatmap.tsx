import { useEffect, useState } from 'react'
import { db, auth } from '../lib/firebase'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import CalendarHeatmap from 'react-calendar-heatmap'
import { Tooltip } from 'react-tooltip'

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
}

export default function MoodHeatmapPage() {
    const [logs, setLogs] = useState<FatLog[]>([])
    const [userId, setUserId] = useState<string | null>(null)

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
                    if (data.mood && data.date) entries.push(data)
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
        <div className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6 text-center">💭 心情热力图</h1>
            <CalendarHeatmap
                startDate={startDate}
                endDate={endDate}
                values={values}
                showWeekdayLabels
                weekdayLabels={['日', '一', '二', '三', '四', '五', '六']}
                classForValue={(value) => {
                    if (!value || !value.mood) return 'color-empty'
                    return moodColorMap[value.mood] || 'color-empty'
                }}
                tooltipDataAttrs={(value) =>
                    value?.date
                        ? {
                            'data-tooltip-id': 'heatmap-tooltip',
                            'data-tooltip-content': `${value.date} ${value.mood}`,
                        }
                        : {}
                }
            />
            <Tooltip id="heatmap-tooltip" />
            {/* 图例区域 */}
            <div className="mt-6 text-sm text-center">
                <p className="mb-2 text-gray-600">心情图例：</p>
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
