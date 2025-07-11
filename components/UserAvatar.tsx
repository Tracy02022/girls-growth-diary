'use client'

import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import Image from 'next/image'
import { useRouter } from 'next/router'

export default function UserAvatar() {
  const [photo, setPhoto] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, 'profiles', user.uid)
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
      setIsLoading(false)
    })
    return () => unsub()
  }, [])

  // 等待加载完成再渲染，防止先闪现 default
  if (isLoading) return null

  return (
    <div
      className="fixed top-4 right-4 z-50 cursor-pointer"
      onClick={() => router.push('/profile')}
    >
      <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-purple-400 shadow">
        <Image
          src={photo || '/icons/default-avatar.png'}
          alt="Avatar"
          width={40}
          height={40}
          unoptimized
          className="object-cover"
        />
      </div>
    </div>
  )
}
