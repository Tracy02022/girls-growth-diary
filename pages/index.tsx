import Link from 'next/link'
import { Quicksand, Dancing_Script } from 'next/font/google'

const quicksand = Quicksand({ subsets: ['latin'], weight: ['400', '600', '700'] })
const dancingScript = Dancing_Script({ subsets: ['latin'], weight: ['700'] })

export default function Home() {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-violet-100 via-purple-100 to-indigo-100 ${quicksand.className}`}>
      {/* Navigation Bar */}
      <nav className="w-full bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className={`${dancingScript.className} text-2xl text-purple-700`}>Girls Growth Diary</h1>
        <div className="space-x-4 text-base font-semibold">
          <Link href="/wishes" className="text-purple-600 hover:underline">Wish List</Link>
          <Link href="/log" className="text-purple-600 hover:underline">Body Fat Log</Link>
          <Link href="/mood-heatmap" className="text-purple-600 hover:underline">Mood Heatmap</Link>
        </div>
      </nav>

      {/* Page Content */}
      <main className="flex flex-col items-center justify-center p-6">
        <h2 className="text-3xl font-semibold mb-8 text-purple-800 drop-shadow">Welcome to Your Personal Growth Space</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          <Link href="/wishes">
            <div className="rounded-2xl shadow-lg p-6 bg-white hover:bg-violet-100 transition cursor-pointer text-center h-40 flex flex-col justify-center">
              <h3 className="text-2xl font-semibold text-purple-700">🌟 Wish List</h3>
              <p className="mt-2 text-sm text-gray-500">Record your dreams and goals</p>
            </div>
          </Link>

          <Link href="/log">
            <div className="rounded-2xl shadow-lg p-6 bg-white hover:bg-violet-100 transition cursor-pointer text-center h-40 flex flex-col justify-center">
              <h3 className="text-2xl font-semibold text-purple-700">📉 Body Fat Log</h3>
              <p className="mt-2 text-sm text-gray-500">Track your body fat changes and progress</p>
            </div>
          </Link>

          <Link href="/mood-heatmap">
            <div className="rounded-2xl shadow-lg p-6 bg-white hover:bg-violet-100 transition cursor-pointer text-center h-40 flex flex-col justify-center">
              <h3 className="text-2xl font-semibold text-purple-700">💖 Mood Heatmap</h3>
              <p className="mt-2 text-sm text-gray-500">Visualize your daily mood patterns</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}