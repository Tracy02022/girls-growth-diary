
import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import Particles from 'react-tsparticles'
import { loadFull } from 'tsparticles'
import { Engine } from 'tsparticles-engine'

const particlesInit = async (engine: Engine) => {
  await loadFull(engine)
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    setError('')
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/')
    } catch (err: any) {
      setError('Login failed. Please check your credentials.')
    }
  }

  return (
    <>
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: { value: '#00000000' } },
          particles: {
            number: { value: 50 },
            size: { value: 2 },
            move: { enable: true, speed: 0.6 },
            links: { enable: true, color: '#ffffff', distance: 130 },
            color: { value: '#ffffff' }
          },
          fullScreen: { enable: true, zIndex: -1 }
        }}
      />
      <div className="min-h-screen flex items-center justify-center animated-gradient relative overflow-hidden px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/20 backdrop-blur-xl rounded-2xl shadow-lg p-8 w-full max-w-md border border-white/30 z-10"
        >
          <h1 className="text-3xl font-bold text-center text-white mb-2">Welcome Back ✨</h1>
          <p className="text-center text-sm text-white/80 mb-6">Please enter your details.</p>
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
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.01 }}
            onClick={handleLogin}
            className="w-full py-2 rounded-lg bg-purple-500 text-white font-semibold hover:bg-purple-600 transition-all"
          >
            Sign in
          </motion.button>
          <p className="text-sm text-center text-white mt-5">
            Don’t have an account?{' '}
            <a href="/register" className="text-blue-200 underline hover:text-blue-400">Sign up</a>
          </p>
          <p className="text-sm text-center mt-2 text-purple-600 hover:underline cursor-pointer" onClick={() => router.push('/forgot-password')}>
            Forgot Password?
        </p>
        </motion.div>
      </div>
    </>
  )
}
