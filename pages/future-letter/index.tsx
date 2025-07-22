'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs, query, where, orderBy, doc, deleteDoc } from 'firebase/firestore'
import { format } from 'date-fns'
import { db } from '@/lib/firebase'
import { quicksand, dancingScript } from '@/lib/fonts'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { toast } from 'sonner'
import LayoutWithNav from '@/components/AvatarDropdownLayout'

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

    const unlockedLetters = letters
        .filter((l) => new Date() >= new Date(l.unlockTimestamp))
        .sort((a, b) => new Date(b.unlockTimestamp).getTime() - new Date(a.unlockTimestamp).getTime())
    const lockedLetters = letters.filter((l) => new Date() < new Date(l.unlockTimestamp))

  const totalPages = Math.ceil(unlockedLetters.length / pageSize)
  const paginatedUnlocked = unlockedLetters.slice((page - 1) * pageSize, page * pageSize)
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
    <LayoutWithNav>
    <div className={`min-h-screen px-4 py-8 bg-[#f2eafa] ${quicksand.className}`}>
      <h1 className={cn('text-3xl font-bold text-center text-purple-600 mb-6', dancingScript.className)}>
        ✉️ All My Future Letters
      </h1>

      <div className="max-w-2xl mx-auto space-y-6">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <>
            {paginatedUnlocked.map((letter) => (
              <div key={letter.id} className="border rounded-xl p-4 bg-white shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-purple-800">{letter.title}</h2>
                    <p className="text-sm text-gray-600">
                      Unlock Time: {format(new Date(letter.unlockTimestamp), 'PPP p')}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Created: {format(new Date(letter.createdAt), 'PPP p')}
                    </p>
                  </div>
                  <button onClick={() => handleDelete(letter)} className="text-red-500 hover:underline">Delete</button>
                  <div className="text-right">
                    <Link href={`/future-letter/${letter.id}`} className="text-purple-600 hover:underline">
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}

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
            </div>

            {lockedLetters.length > 0 && (
              <div className="mt-10">
                <h2 className="text-lg font-semibold text-purple-800 mb-2">🔒 Locked Letters (Not Yet Available)</h2>
                <ul className="text-sm text-gray-500 space-y-1">
                  {lockedLetters.map((l) => (
                    <li key={l.id}>🔒 {l.title} – Available on {format(new Date(l.unlockTimestamp), 'PPP')}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
    </LayoutWithNav>
  )
}
