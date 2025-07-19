'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs, query, where, orderBy, doc, deleteDoc } from 'firebase/firestore'
import { format } from 'date-fns'
import { db } from '@/lib/firebase'
import { quicksand, dancingScript } from '@/lib/fonts'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface FutureLetter {
    id: string
    userId: string
    title: string
    content: string
    type: 'success' | 'failure'
    unlockTimestamp: string
    createdAt: string
}

export default function FutureLetterListPage() {
    const [letters, setLetters] = useState<FutureLetter[]>([])
    const [loading, setLoading] = useState(true)
    const [userId, setUserId] = useState<string | null>(null)
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const pageSize = 3

    useEffect(() => {
        const uid = localStorage.getItem('userId')
        if (uid) {
            setUserId(uid)
        } else {
            window.location.href = '/login.html'
        }
    }, [])

    const fetchLetters = async () => {
        if (!userId) return
        setLoading(true)
        try {
            const q = query(
                collection(db, 'futureLetters'),
                where('userId', '==', userId),
                orderBy('unlockTimestamp', 'asc')
            )
            const snapshot = await getDocs(q)
            const results: FutureLetter[] = []
            snapshot.forEach((doc) => {
                const data = doc.data() as FutureLetter
                results.push({ ...data, id: doc.id })
            })
            setLetters(results)
        } catch (err) {
            console.error('Failed to load letters:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (userId) fetchLetters()
    }, [userId])

    const handleDownload = (letter: FutureLetter) => {
        const content = `${letter.title}\n\n${letter.content}`
        const blob = new Blob([content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${letter.title}.txt`
        link.click()
    }

    const handleDelete = async (letter: FutureLetter) => {
        const confirmDelete = confirm(`Are you sure you want to delete "${letter.title}"?`)
        if (!confirmDelete) return
        try {
            await deleteDoc(doc(db, 'futureLetters', letter.id))
            setLetters(prev => prev.filter(l => l.id !== letter.id))
            toast.success('Letter deleted')
        } catch (err) {
            console.error('Failed to delete letter:', err)
            toast.error('Failed to delete letter')
        }
    }

    const filteredLetters = letters.filter(l => l.title.toLowerCase().includes(search.toLowerCase()))
    const unlockedLetters = filteredLetters.filter(l => new Date() >= new Date(l.unlockTimestamp))
    const lockedLetters = filteredLetters.filter(l => new Date() < new Date(l.unlockTimestamp))

    const totalUnlockedPages = Math.ceil(unlockedLetters.length / pageSize)
    const totalLockedPages = Math.ceil(lockedLetters.length / pageSize)
    const totalPages = Math.max(totalUnlockedPages, totalLockedPages)

    const paginatedUnlocked = unlockedLetters.slice((page - 1) * pageSize, page * pageSize)
    const paginatedLocked = lockedLetters.slice((page - 1) * pageSize, page * pageSize)

    const renderLetterCard = (letter: FutureLetter, isUnlocked: boolean) => (
        <div key={letter.id} className="border rounded-xl p-4 bg-white shadow-sm mb-2">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-semibold text-purple-800">{letter.title}</h2>
                    <p className="text-sm text-gray-600">
                        Unlock Time: {format(new Date(letter.unlockTimestamp), 'PPP p')}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        {letter.type === 'success' ? '🎯 Success Letter' : '🌧 Comfort Letter'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        Created: {format(new Date(letter.createdAt), 'PPP p')} | Words: {letter.content.split(/\s+/).length}
                    </p>
                </div>
                <div className="flex flex-col gap-2 text-sm text-right">
                    {isUnlocked ? (
                        <>
                            <a href={`/future-letter/${letter.id}`} className="text-purple-600 hover:underline">View</a>
                            <button onClick={() => handleDownload(letter)} className="text-green-600 hover:underline">Download</button>
                        </>
                    ) : (
                        <div className="text-gray-500">🔒 Locked</div>
                    )}
                    <button onClick={() => handleDelete(letter)} className="text-red-500 hover:underline">Delete</button>
                </div>
            </div>
        </div>
    )

    return (
        <div className={`min-h-screen px-4 py-8 bg-[#f2eafa] ${quicksand.className} bg-[url('/bg-girl-topright.png')] bg-no-repeat bg-top-right`}>
            <h1 className={cn("text-3xl font-bold text-center text-purple-600 mb-6", dancingScript.className)}>
                ✉️ All My Future Letters
            </h1>

            <div className="text-center mb-4 flex flex-col items-center gap-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="🔍 Search by title..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="px-3 py-2 rounded-xl border border-purple-300 w-64"
                    />
                    <button
                        onClick={fetchLetters}
                        className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700"
                    >
                        🔄 Refresh
                    </button>
                </div>
            </div>

            <div className="max-w-2xl mx-auto space-y-8">
                <div>
                    <h2 className="text-lg font-semibold text-purple-800 mb-2">🔓 Unlocked Letters</h2>
                    {loading ? (
                        <p className="text-gray-500">Loading...</p>
                    ) : paginatedUnlocked.length === 0 ? (
                        <p className="text-gray-500">No unlocked letters.</p>
                    ) : (
                        paginatedUnlocked.map((letter) => renderLetterCard(letter, true))
                    )}
                </div>

                <div>
                    <h2 className="text-lg font-semibold text-purple-800 mb-2">🔒 Locked Letters</h2>
                    {loading ? (
                        <p className="text-gray-500">Loading...</p>
                    ) : paginatedLocked.length === 0 ? (
                        <p className="text-gray-500">No locked letters.</p>
                    ) : (
                        paginatedLocked.map((letter) => renderLetterCard(letter, false))
                    )}
                </div>

                <div className="text-center mt-6 flex justify-center gap-2 flex-wrap">
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => setPage(i + 1)}
                            className={`px-3 py-1 rounded ${page === i + 1 ? 'bg-purple-600 text-white' : 'bg-purple-200 text-purple-700'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    {page < totalPages && (
                        <button
                            onClick={() => setPage(totalPages)}
                            className="ml-2 px-3 py-1 bg-purple-300 text-purple-800 rounded hover:bg-purple-400"
                        >
                            ⏩ Last Page
                        </button>
                    )}
                </div>
            </div>

            <div className="text-center mt-6">
                <a
                    href="/future-letter/new.html"
                    className="text-purple-600 underline text-sm hover:text-purple-800"
                >
                    🔙 Back to Write Future Letters
                </a>
            </div>
        </div>
    )
}
