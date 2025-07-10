'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { format } from 'date-fns'
import { dancingScript, quicksand } from '@/lib/fonts'
import { cn } from '@/lib/utils'

interface FutureLetter {
    id: string
    userId: string
    title: string
    content: string
    type: 'success' | 'failure'
    unlockTimestamp: string
    createdAt: string
}

export default function ViewFutureLetterPage() {
    const router = useRouter()
    const { id } = router.query
    const [letter, setLetter] = useState<FutureLetter | null>(null)
    const [isLocked, setIsLocked] = useState(true)

    useEffect(() => {
        if (id && typeof id === 'string') {
            const fetchLetter = async () => {
                const ref = doc(db, 'futureLetters', id)
                const snapshot = await getDoc(ref)
                if (snapshot.exists()) {
                    const data = snapshot.data() as FutureLetter
                    setLetter({ ...data, id: snapshot.id })

                    const now = new Date()
                    const unlockTime = new Date(data.unlockTimestamp)
                    setIsLocked(now < unlockTime)
                } else {
                    setLetter(null)
                }
            }
            fetchLetter()
        }
    }, [id])

    const handleDownload = () => {
        if (!letter) return
        const content = `${letter.title}\n\n${letter.content}`
        const blob = new Blob([content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${letter.title}.txt`
        link.click()
    }

    return (
        <div className={`min-h-screen bg-[#f2eafa] px-4 py-8 ${quicksand.className} bg-no-repeat bg-top-right`}>
            <h1 className={cn("text-3xl font-bold text-center text-purple-600 mb-6", dancingScript.className)}>
                💌 Future Letter
            </h1>

            <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-md space-y-4">
                {!letter ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : isLocked ? (
                    <div className="text-center text-purple-700 space-y-2">
                        <p className="text-xl">🔒 This letter is locked.</p>
                        <p className="text-sm">It will be available on <strong>{format(new Date(letter.unlockTimestamp), 'PPPpp')}</strong>.</p>
                    </div>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold text-purple-700">{letter.title}</h2>
                        <p className="text-sm text-gray-500 mb-2">
                            {letter.type === 'success' ? '🎯 You reached your goal!' : '🌧 You didn’t reach it, but you tried.'}
                        </p>
                        <div className="whitespace-pre-line text-purple-900 leading-relaxed border-t pt-4">
                            {letter.content}
                        </div>

                        <button
                            onClick={handleDownload}
                            className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl"
                        >
                            📥 Download Letter
                        </button>
                    </>
                )}
            </div>
            <div className="text-center mt-6">
                <a
                    href="/future-letter/new"
                    className="text-purple-600 underline text-sm hover:text-purple-800"
                >
                    🔙 Back to Write Future Letter
                </a>
            </div>
        </div>
    )
}
