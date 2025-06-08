import Link from 'next/link'
import Image from 'next/image'
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

      {/* Hero Section with Illustration */}
      <section className="flex flex-col lg:flex-row items-center justify-between p-8 max-w-6xl mx-auto">
        <div className="text-center lg:text-left max-w-xl">
          <h2 className="text-4xl text-purple-800 font-bold mb-4">Welcome to Your Personal Growth Space</h2>
          <p className="text-gray-600 text-lg">Track your dreams, progress, and emotions in a beautifully organized way.</p>
        </div>
        <div className="mt-8 lg:mt-0">
          <Image
            src="/illustration-girl-diary.png"
            alt="Girl writing in diary illustration"
            width={360}
            height={300}
            className="rounded-xl drop-shadow-xl"
          />
        </div>
      </section>

      {/* Feature Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 max-w-6xl mx-auto">
        <Link href="/wishes">
          <div className="rounded-2xl shadow-xl p-6 bg-white hover:bg-violet-100 transition cursor-pointer text-center h-44 flex flex-col justify-center items-center">
            <Image src="/icons/wish-list.png" alt="Wish List Icon" width={40} height={40} />
            <h3 className="text-xl font-semibold text-purple-700 mt-2">Wish List</h3>
            <p className="mt-1 text-sm text-gray-500">Record your dreams and goals</p>
          </div>
        </Link>

        <Link href="/log">
          <div className="rounded-2xl shadow-xl p-6 bg-white hover:bg-violet-100 transition cursor-pointer text-center h-44 flex flex-col justify-center items-center">
            <Image src="/icons/body-fat-log.png" alt="Body Fat Log Icon" width={40} height={40} />
            <h3 className="text-xl font-semibold text-purple-700 mt-2">Body Fat Log</h3>
            <p className="mt-1 text-sm text-gray-500">Track your body fat changes and progress</p>
          </div>
        </Link>

        <Link href="/mood-heatmap">
          <div className="rounded-2xl shadow-xl p-6 bg-white hover:bg-violet-100 transition cursor-pointer text-center h-44 flex flex-col justify-center items-center">
            <Image src="/icons/mood-heatmap.png" alt="Mood Heatmap Icon" width={40} height={40} />
            <h3 className="text-xl font-semibold text-purple-700 mt-2">Mood Heatmap</h3>
            <p className="mt-1 text-sm text-gray-500">Visualize your daily mood patterns</p>
          </div>
        </Link>
      </section>
    </div>
  )
}
