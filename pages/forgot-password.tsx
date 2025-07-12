'use client'

import { useState } from 'react'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/router'
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const router = useRouter()

  const handleReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email)
      toast.success('Reset email sent. Please check your inbox.')
      router.push('/login')
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-purple-100 p-4">
      <h2 className="text-2xl font-bold mb-4 text-purple-700">Reset Your Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border rounded px-4 py-2 w-full max-w-md mb-4"
      />
      <button
        onClick={handleReset}
        className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
      >
        Send Reset Password Email
      </button>
    </div>
  )
}
