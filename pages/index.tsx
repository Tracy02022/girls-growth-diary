import Link from 'next/link'
import Image from 'next/image'
import { Quicksand, Dancing_Script } from 'next/font/google'
import { useState } from 'react'
import AvatarDropdownLayout from '@/components/AvatarDropdownLayout'
import PrivacyConsentModal from '@/components/PrivacyConsentModal'

const quicksand = Quicksand({ subsets: ['latin'], weight: ['400', '600', '700'] })
const dancingScript = Dancing_Script({ subsets: ['latin'], weight: ['700'] })

export default function Home() {
  const [open, setOpen] = useState(false)

  return (
    <>
    <PrivacyConsentModal />
    <AvatarDropdownLayout>
    <div
      className={`relative min-h-screen bg-[#ede9f5] ${quicksand.className}`}
      style={{
        backgroundImage: "url('/illustration-girl-diary.png')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top center',
      }}
    >
      {/* 顶部头像（移动端） */}
      {/* <div className="absolute top-8 right-5 z-50 block md:hidden">
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
            <Link href="/profile" className="block" onClick={() => setOpen(false)}>Profile</Link>
            <Link href="/logout" className="block" onClick={() => setOpen(false)}>Logout</Link>
          </div>
        )}
      </div> */}

      {/* 页面标题（通用显示） */}
      <div className="pt-8 md:pt-12 text-center z-10">
        <h1 className={`${dancingScript.className} text-5xl md:text-7xl text-purple-800`}>
          Girl Growth Diary
        </h1>
      </div>

      {/* 桌面导航栏 */}
      <nav className="hidden md:flex w-full justify-center p-6 gap-12 z-10">
        <div className="space-x-6 text-base font-semibold text-purple-700">
          <Link href="/">Home</Link>
          <Link href="/wishes.html">Wish List</Link>
          <Link href="/log.html">Body Fat Log</Link>
          <Link href="/mood-heatmap.html">Mood Heatmap</Link>
          <Link href="/future-letter/new.html">Write Future Letters</Link>
          <Link href="/profile.html">Profile</Link>
          <Link href="/logout.html">Logout</Link>
        </div>
      </nav>

      {/* Cards Section */}
      <section className="flex flex-col items-center justify-center relative z-10 px-6 pt-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mt-6">
          <Link href="/wishes.html">
            <div className="rounded-xl shadow-lg bg-white bg-opacity-90 p-6 hover:bg-violet-100 transition-all transform hover:scale-105 duration-300 ease-in-out text-center flex flex-col justify-center items-center">
              <Image src="/icons/wish-list.png" alt="Wish List Icon" width={64} height={64} />
              <h3 className="text-xl font-bold text-purple-700 mt-4">Wish List</h3>
              <p className="mt-2 text-sm text-gray-600">Record your dreams and goals</p>
            </div>
          </Link>

          <Link href="/log.html">
            <div className="rounded-xl shadow-lg bg-white bg-opacity-90 p-6 hover:bg-violet-100 transition-all transform hover:scale-105 duration-300 ease-in-out text-center flex flex-col justify-center items-center">
              <Image src="/icons/body-fat-log.png" alt="Body Fat Log Icon" width={64} height={64} />
              <h3 className="text-xl font-bold text-purple-700 mt-4">Body Fat Log</h3>
              <p className="mt-2 text-sm text-gray-600">Track your body fat changes and progress</p>
            </div>
          </Link>

          <Link href="/mood-heatmap.html">
            <div className="rounded-xl shadow-lg bg-white bg-opacity-90 p-6 hover:bg-violet-100 transition-all transform hover:scale-105 duration-300 ease-in-out text-center flex flex-col justify-center items-center">
              <Image src="/icons/mood-heatmap.png" alt="Mood Heatmap Icon" width={64} height={64} />
              <h3 className="text-xl font-bold text-purple-700 mt-4">Mood Heatmap</h3>
              <p className="mt-2 text-sm text-gray-600">Visualize your daily mood patterns</p>
            </div>
          </Link>

          <Link href="/future-letter/new">
            <div className="rounded-xl shadow-lg bg-white bg-opacity-90 p-6 hover:bg-violet-100 transition-all transform hover:scale-105 duration-300 ease-in-out text-center flex flex-col justify-center items-center">
              <Image src="/icons/future-letter.png" alt="Future Letter Icon" width={64} height={64} />
              <h3 className="text-xl font-bold text-purple-700 mt-4">Write Future Letter</h3>
              <p className="mt-2 text-sm text-gray-600">Write a letter to your future self with unlock date and time</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
    </AvatarDropdownLayout>
    </>
  )
}
