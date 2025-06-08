
import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleRegister = async () => {
    setError('')
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      router.push('/wishes')
    } catch (err: any) {
      setError('Registration failed. Please check your information.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-700 to-yellow-500">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/20 backdrop-blur-lg rounded-2xl shadow-lg p-8 w-full max-w-sm border border-white/30"
      >
        <h1 className="text-3xl font-bold text-center text-white mb-2">Join Us 💜</h1>
        <p className="text-center text-sm text-white/80 mb-6">Create your own growth diary account</p>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded-lg mb-3 border border-white/40 bg-white/30 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-purple-300"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 rounded-lg mb-5 border border-white/40 bg-white/30 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-purple-300"
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          onClick={handleRegister}
          className="w-full py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-all"
        >
          Register
        </motion.button>
        <p className="text-sm text-center text-white mt-5">
          Already have an account?{' '}
          <a href="/login" className="text-blue-200 underline hover:text-blue-400">
            Login here
          </a>
        </p>
      </motion.div>
    </div>
  )
}
