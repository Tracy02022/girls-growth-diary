'use client'

import Link from 'next/link'
import { dancingScript, quicksand } from '@/lib/fonts'
import { cn } from '@/lib/utils'

export default function GoodbyePage() {
  return (
    <div className={`min-h-screen bg-[#f8f0fc] flex flex-col items-center justify-center px-6 text-center ${quicksand.className}`}>
      <h1 className={cn('text-4xl text-purple-700 font-bold mb-4', dancingScript.className)}>
        Goodbye 💜
      </h1>
      <p className="text-gray-700 text-lg mb-6">
        Your account has been successfully deleted.  
        Thank you for being part of KittyTime — we hope to see you again in the future.
      </p>
      <Link
        href="/"
        className="inline-block px-6 py-2 bg-purple-600 text-white rounded-xl shadow hover:bg-purple-700 transition"
      >
        Back to Home
      </Link>
    </div>
  )
}
