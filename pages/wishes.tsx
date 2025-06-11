// pages/wishes.tsx
import { useEffect, useState } from 'react'
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  doc,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore'
import { db, auth } from '../lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { differenceInCalendarDays, parseISO } from 'date-fns'
import { Quicksand, Dancing_Script } from 'next/font/google'

const quicksand = Quicksand({ subsets: ['latin'] })
const dancingScript = Dancing_Script({ subsets: ['latin'], weight: ['700'] })

interface Wish {
  id?: string
  title: string
  description?: string
  targetDate: string
  createdAt: string
  isDone: boolean
  userId: string
}

export default function WishesPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [wishes, setWishes] = useState<Wish[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [targetDate, setTargetDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [error, setError] = useState('')

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
    if (userId) loadWishes(userId)
  }, [userId])

  const loadWishes = async (uid: string) => {
    const q = query(
      collection(db, 'wishes'),
      where('userId', '==', uid),
      orderBy('targetDate', 'asc')
    )
    const snapshot = await getDocs(q)
    const results: Wish[] = []
    snapshot.forEach((doc) => {
      const data = doc.data() as Wish
      results.push({ ...data, id: doc.id })
    })
    setWishes(results)
  }

  const addWish = async () => {
    if (!userId) return
    if (!title.trim()) {
      setError('Title cannot be empty')
      return
    }
    const selectedDate = new Date(targetDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (selectedDate < today) {
      setError('Target date cannot be in the past')
      return
    }
    setError('')
    const newWish: Wish = {
      title,
      description,
      targetDate,
      createdAt: new Date().toISOString(),
      isDone: false,
      userId,
    }
    await addDoc(collection(db, 'wishes'), newWish)
    setTitle('')
    setDescription('')
    setTargetDate(new Date().toISOString().split('T')[0])
    loadWishes(userId)
  }

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const markSelectedDone = async () => {
    const batch = writeBatch(db)
    selectedIds.forEach((id) => {
      const ref = doc(db, 'wishes', id)
      batch.update(ref, { isDone: true })
    })
    await batch.commit()
    if (userId) loadWishes(userId)
    setSelectedIds([])
  }

  const deleteSelected = async () => {
    const batch = writeBatch(db)
    selectedIds.forEach((id) => {
      const ref = doc(db, 'wishes', id)
      batch.delete(ref)
    })
    await batch.commit()
    if (userId) loadWishes(userId)
    setSelectedIds([])
  }

  const markWishDone = async (id: string) => {
    await updateDoc(doc(db, 'wishes', id), { isDone: true })
    if (userId) loadWishes(userId)
  }

  const deleteWish = async (id: string) => {
    await deleteDoc(doc(db, 'wishes', id))
    if (userId) loadWishes(userId)
  }

  const renderWish = (wish: Wish) => {
    const daysLeft = differenceInCalendarDays(parseISO(wish.targetDate), new Date())
    let countdownText = ''
    if (!wish.isDone) {
      if (daysLeft > 0) countdownText = `${daysLeft} days left`
      else if (daysLeft === 0) countdownText = `Due today!`
      else countdownText = `${Math.abs(daysLeft)} days ago`
    }

    return (
      <div
        key={wish.id}
        className="border rounded-2xl p-4 bg-white shadow-md flex items-start gap-2 relative"
      >
        <input
          type="checkbox"
          checked={selectedIds.includes(wish.id!)}
          onChange={() => toggleSelected(wish.id!)}
          className="mt-1"
        />
        <div className="flex-1">
          <div className={`font-semibold ${wish.isDone ? 'line-through text-gray-500' : ''}`}>
            {wish.title}
          </div>
          {wish.description && <div className="text-sm text-gray-600">{wish.description}</div>}
          <div className="text-sm text-gray-500 mt-1">
            🎯 Target date: {wish.targetDate}
            <span className="ml-2 text-purple-500">{countdownText}</span>
          </div>
          <div className="flex items-center mb-2 justify-between">
            <div className="flex gap-2 text-sm text-right text-purple-600">
              {!wish.isDone && (
                <button onClick={() => markWishDone(wish.id!)} className="hover:underline">
                  Mark Done
                </button>
              )}
              <button onClick={() => deleteWish(wish.id!)} className="text-red-600 hover:underline">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const uncompleted = wishes.filter((w) => !w.isDone)
  const completed = wishes.filter((w) => w.isDone)

  return (
    <div
      className={`min-h-screen px-4 py-8 bg-purple-50 ${quicksand.className} bg-[url('/bg-girl-topright.png')] bg-no-repeat bg-top-right`}
    >
      <h1 className={`text-3xl font-bold mb-6 text-center text-purple-700 ${dancingScript.className}`}>
        🌠 Wish List
      </h1>

      <div className="max-w-xl mx-auto space-y-4">
        <input
          type="text"
          placeholder="Wish Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={20}
          className="w-full border px-3 py-2 rounded-xl"
        />
        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        <p className="text-sm text-gray-400 text-right">{title.length}/20</p>
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={100}
          className="w-full border px-3 py-2 rounded-xl"
        ></textarea>
        <p className="text-sm text-gray-400 text-right">{description.length}/100</p>
        <input
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          className="w-full border px-3 py-2 rounded-xl"
        />
        <button
          onClick={addWish}
          className="w-full bg-purple-600 text-white py-2 rounded-xl hover:bg-purple-700"
        >
          Add Wish
        </button>

        {selectedIds.length > 0 && (
          <div className="flex gap-4 mt-6">
            <button
              onClick={markSelectedDone}
              className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600"
            >
              Mark Selected Done
            </button>
            <button
              onClick={deleteSelected}
              className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
            >
              Delete Selected
            </button>
          </div>
        )}

        <div className="mt-10 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">🟣 Pending Wishes</h2>
            {uncompleted.length === 0 && <p className="text-gray-500">No pending wishes</p>}
            {uncompleted.map(renderWish)}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">✅ Completed Wishes</h2>
            {completed.length === 0 && <p className="text-gray-500">No completed wishes</p>}
            {completed.map(renderWish)}
          </div>
        </div>
      </div>
    </div>
  )
}
