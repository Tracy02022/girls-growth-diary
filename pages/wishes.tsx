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
    if (!userId || !title) return
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
      if (daysLeft > 0) {
        countdownText = `还有 ${daysLeft} 天`
      } else if (daysLeft === 0) {
        countdownText = `就是今天！`
      } else {
        countdownText = `已过去 ${Math.abs(daysLeft)} 天`
      }
    }

    return (
      <div
        key={wish.id}
        className="border rounded p-4 bg-white shadow flex items-start gap-2 relative"
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
            🎯 目标日期：{wish.targetDate}
            <span className="ml-2 text-blue-500"> {countdownText}</span>
          </div>
          <div className="flex items-center mb-2 justify-between">

            <div className="flex gap-2 text-sm text-right text-blue-600">
              {!wish.isDone && (
                <button onClick={() => markWishDone(wish.id!)} className="hover:underline">
                  完成
                </button>
              )}
              <button onClick={() => deleteWish(wish.id!)} className="text-red-600 hover:underline">
                删除
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
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">🌠 愿望清单</h1>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="愿望标题"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={20}
          className="w-full border px-3 py-2 rounded"
        />
        <p className="text-sm text-gray-400 text-right">{title.length}/20</p>
        <textarea
          placeholder="愿望描述（可选）"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={100}
          className="w-full border px-3 py-2 rounded"
        ></textarea>
        <p className="text-sm text-gray-400 text-right">{description.length}/100</p>
        <input
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
        <button
          onClick={addWish}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          添加愿望
        </button>
      </div>

      {selectedIds.length > 0 && (
        <div className="flex gap-4 mt-6">
          <button
            onClick={markSelectedDone}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            完成选中
          </button>
          <button
            onClick={deleteSelected}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            删除选中
          </button>
        </div>
      )}

      <div className="mt-10 space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">🟢 未完成愿望</h2>
          {uncompleted.length === 0 && <p className="text-gray-500">暂无未完成愿望</p>}
          {uncompleted.map(renderWish)}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">✅ 已完成愿望</h2>
          {completed.length === 0 && <p className="text-gray-500">暂无已完成愿望</p>}
          {completed.map(renderWish)}
        </div>
      </div>
    </div>
  )
}
