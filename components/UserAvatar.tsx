'use client'

import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import Image from 'next/image'
import { useRouter } from 'next/router'

export default function UserAvatar() {
  const [photo, setPhoto] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'profiles', user.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const data = docSnap.data()
          console.log('👤 Avatar loaded:', data.photoBase64)
          setPhoto(data.photoBase64 || null)
        }
      }
    })

    return () => unsub()
  }, [])

  return (
    <div className="fixed top-4 right-4 z-50 cursor-pointer" onClick={() => router.push('/profile')}>
      <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-purple-400 shadow">
        {photo ? (
          <Image
          src={photo}
          alt="Avatar"
          width={40}
          height={40}
          className="object-cover"
          unoptimized // ← 必须加
        />
        ) : (
            <Image
            src="/icons/default-avatar.png"
            alt="Default Avatar"
            width={40}
            height={40}
            className="object-cover"
            unoptimized
          />
        )}
      </div>
    </div>
  )
}
