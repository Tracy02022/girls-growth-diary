'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs, query, where, orderBy, doc, getDoc, deleteDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/router'
import { format } from 'date-fns'
import { db, auth } from '@/lib/firebase'
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

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid)
            } else {
                window.location.href = '/login'
            }
        })
        return () => unsub()
    }, [])

    useEffect(() => {
        if (userId) {
            const fetchLetters = async () => {
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
            fetchLetters()
        }
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

    return (
        <div className={`min-h-screen px-4 py-8 bg-[#f2eafa] ${quicksand.className} bg-[url('/bg-girl-topright.png')] bg-no-repeat bg-top-right`}>
            <h1 className={cn("text-3xl font-bold text-center text-purple-600 mb-6", dancingScript.className)}>
                ✉️ All My Future Letters
            </h1>

            <div className="max-w-2xl mx-auto space-y-4">
                {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : letters.length === 0 ? (
                    <p className="text-center text-gray-500">No letters yet.</p>
                ) : (
                    letters.map((letter) => {
                        const unlockTime = new Date(letter.unlockTimestamp)
                        const isUnlocked = new Date() >= unlockTime

                        return (
                            <div key={letter.id} className="border rounded-xl p-4 bg-white shadow-sm">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-lg font-semibold text-purple-800">{letter.title}</h2>
                                        <p className="text-sm text-gray-600">
                                            Unlock Time: {format(unlockTime, 'PPP p')}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {letter.type === 'success' ? '🎯 Success Letter' : '🌧 Comfort Letter'}
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-2 text-sm text-right">
                                        {isUnlocked ? (
                                            <>
                                                <a
                                                    href={`/future-letter/${letter.id}`}
                                                    className="text-purple-600 hover:underline"
                                                >
                                                    View
                                                </a>
                                                <button
                                                    onClick={() => handleDownload(letter)}
                                                    className="text-green-600 hover:underline"
                                                >
                                                    Download
                                                </button>
                                            </>
                                        ) : (
                                            <div className="text-gray-500">🔒 Locked</div>
                                        )}
                                        <button
                                            onClick={() => handleDelete(letter)}
                                            className="text-red-500 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
            <div className="text-center mt-6">
                <a
                    href="/future-letter/new"
                    className="text-purple-600 underline text-sm hover:text-purple-800"
                >
                    🔙 Back to Write Future Letters
                </a>
            </div>
        </div>
    )
}
