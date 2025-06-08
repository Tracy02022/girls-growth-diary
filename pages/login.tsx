
import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    setError('')
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/wishes')
    } catch (err: any) {
      setError('登录失败，请检查邮箱或密码是否正确')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 via-pink-100 to-yellow-100">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/30 backdrop-blur-lg rounded-2xl shadow-lg p-8 w-full max-w-sm border border-white/40"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">欢迎回来 💫</h1>
        <p className="text-center text-sm text-gray-600 mb-6">开始记录你的每一个心情时刻</p>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <input
          type="email"
          placeholder="邮箱"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded-lg mb-3 border border-white/60 bg-white/40 placeholder-gray-600 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-300"
        />
        <input
          type="password"
          placeholder="密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 rounded-lg mb-5 border border-white/60 bg-white/40 placeholder-gray-600 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-300"
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          onClick={handleLogin}
          className="w-full py-2 rounded-lg bg-purple-500 text-white font-semibold hover:bg-purple-600 transition-all"
        >
          登录
        </motion.button>
        <p className="text-sm text-center text-gray-700 mt-5">
          还没有账号？{' '}
          <a href="/register" className="text-purple-600 underline hover:text-purple-800">
            点击注册
          </a>
        </p>
      </motion.div>
    </div>
  )
}
