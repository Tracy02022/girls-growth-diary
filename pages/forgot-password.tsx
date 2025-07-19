'use client'

import { useState } from 'react'
import { useRouter } from 'next/router'
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const router = useRouter()

  const handleReset = async () => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '<your-api-key>'
      const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestType: 'PASSWORD_RESET',
          email: email,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to send reset email')
      }

      toast.success('Reset email sent. Please check your inbox.')
      router.push('/login.html')
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong.')
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
