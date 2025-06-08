import Link from 'next/link'
import Image from 'next/image'
import { Quicksand, Dancing_Script } from 'next/font/google'

const quicksand = Quicksand({ subsets: ['latin'], weight: ['400', '600', '700'] })
const dancingScript = Dancing_Script({ subsets: ['latin'], weight: ['700'] })

export default function Home() {
  return (
    <div
      className={`relative min-h-screen bg-gradient-to-br from-violet-100 via-purple-100 to-indigo-100 ${quicksand.className}`}
      style={{ backgroundImage: "url('/illustration-girl-diary.png')", backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'top center' }}
    >
      {/* Overlay for contrast */}
      <div className="absolute inset-0 bg-white bg-opacity-70 z-0"></div>

      {/* Navigation Bar */}
      <nav className="w-full bg-transparent p-6 flex justify-between items-center relative z-10">
        <h1 className={`${dancingScript.className} text-3xl text-purple-800`}>Girl Growth Diary</h1>
        <div className="space-x-6 text-base font-semibold text-purple-700">
          <Link href="/">Home</Link>
          <Link href="/wishes">Wish List</Link>
          <Link href="/log">Body Fat Log</Link>
          <Link href="/mood-heatmap">Mood Heatmap</Link>
        </div>
      </nav>

      {/* Spacer to push cards lower */}
      <div className="h-[480px]" />

      {/* Feature Cards at Bottom */}
      <section className="flex flex-col items-center justify-center relative z-10 px-6 pt-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
          <Link href="/wishes">
            <div className="rounded-xl shadow-lg bg-white bg-opacity-90 p-6 hover:bg-violet-100 transition-all text-center flex flex-col justify-center items-center">
              <Image src="/icons/wish-list.png" alt="Wish List Icon" width={50} height={50} />
              <h3 className="text-xl font-bold text-purple-700 mt-4">Wish List</h3>
              <p className="mt-2 text-sm text-gray-600">Record your dreams and goals</p>
            </div>
          </Link>

          <Link href="/log">
            <div className="rounded-xl shadow-lg bg-white bg-opacity-90 p-6 hover:bg-violet-100 transition-all text-center flex flex-col justify-center items-center">
              <Image src="/icons/body-fat-log.png" alt="Body Fat Log Icon" width={50} height={50} />
              <h3 className="text-xl font-bold text-purple-700 mt-4">Body Fat Log</h3>
              <p className="mt-2 text-sm text-gray-600">Track your body fat changes and progress</p>
            </div>
          </Link>

          <Link href="/mood-heatmap">
            <div className="rounded-xl shadow-lg bg-white bg-opacity-90 p-6 hover:bg-violet-100 transition-all text-center flex flex-col justify-center items-center">
              <Image src="/icons/mood-heatmap.png" alt="Mood Heatmap Icon" width={50} height={50} />
              <h3 className="text-xl font-bold text-purple-700 mt-4">Mood Heatmap</h3>
              <p className="mt-2 text-sm text-gray-600">Visualize your daily mood patterns</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}
