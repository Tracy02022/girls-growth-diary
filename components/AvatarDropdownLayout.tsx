'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Quicksand } from 'next/font/google'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useRouter } from 'next/router'
import Image from 'next/image'

const quicksand = Quicksand({ subsets: ['latin'] })

export default function AvatarDropdownLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [photo, setPhoto] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const uid = localStorage.getItem('userId')
    if (!uid) return

    const loadAvatar = async () => {
      try {
        const docRef = doc(db, 'profiles', uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const data = docSnap.data()
          if (data.photoBase64) {
            setPhoto(data.photoBase64)
          }
        }
      } catch (err) {
        console.error('Failed to load avatar:', err)
      }
    }

    loadAvatar()
  }, [])

  return (
    <div
      className={`relative min-h-screen bg-[#f2eafa] px-4 py-8 ${quicksand.className}`}
    >
      {/* 顶部头像与下拉菜单 */}
      <div className="absolute top-8 right-5 z-50">
        <div
          className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-purple-400 shadow cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          <Image
            src={photo || '/icons/default-avatar.png'}
            alt="avatar"
            fill
            unoptimized
            className="object-cover"
          />
        </div>
        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-purple-700 rounded-2xl shadow-xl p-4 space-y-2 z-50">
            <Link href="/" className="block" onClick={() => setOpen(false)}>Home</Link>
            <Link href="/wishes" className="block" onClick={() => setOpen(false)}>Wish List</Link>
            <Link href="/log" className="block" onClick={() => setOpen(false)}>Body Fat Log</Link>
            <Link href="/mood-heatmap" className="block" onClick={() => setOpen(false)}>Mood Heatmap</Link>
            <Link href="/future-letter/new" className="block" onClick={() => setOpen(false)}>Write Future Letters</Link>
            <Link href="/profile" className="block" onClick={() => setOpen(false)}>Profile</Link>
            <Link href="/logout" className="block" onClick={() => setOpen(false)}>Logout</Link>
          </div>
        )}
      </div>

      {/* 主体内容 */}
      <div>{children}</div>
    </div>
  )
}
