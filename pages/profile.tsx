'use client'

import { useEffect, useState } from 'react'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth'
import { auth, db, storage } from '@/lib/firebase'
import { quicksand, dancingScript } from '@/lib/fonts'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/router'
import Image from 'next/image'

export default function ProfilePage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [nickname, setNickname] = useState('')
  const [gender, setGender] = useState<string>('') // 🟣 新增字段
  const [photoURL, setPhotoURL] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid)
        setEmail(user.email || '')

        const docRef = doc(db, 'profiles', user.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const data = docSnap.data()
          setNickname(data.nickname || '')
          setPhotoURL(data.photoURL || null)
          setGender(data.gender || '') // 🟣 加载性别
        }
      } else {
        router.push('/login')
      }
    })

    return () => unsub()
  }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !userId) return

    const storageRef = ref(storage, `avatars/${userId}`)
    await uploadBytes(storageRef, file)
    const newPhotoURL = await getDownloadURL(storageRef)
    setPhotoURL(newPhotoURL)

    await setDoc(doc(db, 'profiles', userId), {
      nickname,
      photoURL: newPhotoURL,
      gender,
    })
  }

  const handleSave = async () => {
    if (!userId) return
    await setDoc(doc(db, 'profiles', userId), {
      nickname,
      photoURL,
      gender,
    })
    alert('Profile saved!')
  }

  const handleResetPassword = async () => {
    if (!email) return
    await sendPasswordResetEmail(auth, email)
    alert('Password reset email sent.')
  }

  return (
    <div className={`min-h-screen px-4 py-8 bg-[#f2eafa] ${quicksand.className}`}>
      {/* 顶部导航栏 */}
      <nav className="mb-6 flex justify-end px-4 text-sm text-purple-700 font-medium">
        <a href="/" className="hover:underline hover:text-purple-900">← Back Home</a>
      </nav>

      <h1 className={cn('text-3xl font-bold text-center text-purple-600 mb-6', dancingScript.className)}>
        👤 My Profile
      </h1>

      <div className="max-w-md mx-auto space-y-6 bg-white rounded-2xl p-6 shadow-md border border-purple-200">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border border-purple-300 shadow-sm">
            {photoURL ? (
              <Image src={photoURL} alt="avatar" fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-purple-100 flex items-center justify-center text-purple-500">
                No Avatar
              </div>
            )}
          </div>
          <input type="file" accept="image/*" onChange={handleUpload} className="text-sm text-gray-600" />
        </div>

        <div>
          <Label className={quicksand.className}>Nickname</Label>
          <Input value={nickname} onChange={(e) => setNickname(e.target.value)} className="rounded-xl mt-1" />
        </div>

        <div>
          <Label className={quicksand.className}>Gender</Label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="mt-1 w-full border rounded-xl px-3 py-2 text-gray-700"
          >
            <option value="">Select</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other / Prefer not to say</option>
          </select>
        </div>

        <div>
          <Label className={quicksand.className}>Email</Label>
          <Input value={email} disabled className="rounded-xl mt-1 bg-gray-100" />
        </div>

        <Button onClick={handleSave} className="w-full bg-purple-600 text-white rounded-xl hover:bg-purple-700">
          Save Profile
        </Button>

        <button
          onClick={handleResetPassword}
          className="text-sm text-purple-600 underline hover:text-purple-800 mt-2"
        >
          🔐 Reset Password
        </button>
      </div>
    </div>
  )
}
