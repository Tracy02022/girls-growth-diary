import { useState } from 'react'
import Link from 'next/link'
import { Quicksand } from 'next/font/google'

const quicksand = Quicksand({ subsets: ['latin'] })

export default function AvatarDropdownLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className={`relative min-h-screen bg-[#f2eafa] px-4 py-8 ${quicksand.className}`}
    >
      {/* 顶部头像与下拉菜单 */}
      <div className="absolute top-4 right-4 z-50">
        <img
          src="/icons/default-avatar.png"
          alt="avatar"
          className="w-10 h-10 rounded-full cursor-pointer"
          onClick={() => setOpen(!open)}
        />
        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-purple-700 rounded-2xl shadow-xl p-4 space-y-2 z-50">
            <Link href="/" className="block" onClick={() => setOpen(false)}>Home</Link>
            <Link href="/wishes" className="block" onClick={() => setOpen(false)}>Wish List</Link>
            <Link href="/log" className="block" onClick={() => setOpen(false)}>Body Fat Log</Link>
            <Link href="/mood-heatmap" className="block" onClick={() => setOpen(false)}>Mood Heatmap</Link>
            <Link href="/future-letter/new" className="block" onClick={() => setOpen(false)}>Write Future Letters</Link>
            <Link href="/logout" className="block" onClick={() => setOpen(false)}>Logout</Link>
          </div>
        )}
      </div>

      {/* 主体内容 */}
      <div>{children}</div>
    </div>
  )
}
