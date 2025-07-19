import { useState } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import Particles from 'react-tsparticles'
import { loadFull } from 'tsparticles'
import { Engine } from 'tsparticles-engine'

const particlesInit = async (engine: Engine) => {
  await loadFull(engine)
}

const registerWithEmailPassword = async (email: string, password: string) => {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '<your-api-key>'
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password,
      returnSecureToken: true
    })
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error?.message || 'Registration failed')
  }

  return data // 包含 idToken, localId, email
}

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleRegister = async () => {
    setError('')
    try {
      const data = await registerWithEmailPassword(email, password)

      // 存储登录信息
      localStorage.setItem('userId', data.localId)
      localStorage.setItem('token', data.idToken)
      localStorage.setItem('email', data.email)

      router.push('/wishes')
    } catch (err: any) {
      console.error('❌ Register failed:', err.message)
      setError('Registration failed. Please check your input.')
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
          <h1 className="text-3xl font-bold text-center text-white mb-2">Join Us 💜</h1>
          <p className="text-center text-sm text-white/80 mb-6">Create your account to get started.</p>
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
            onClick={handleRegister}
            className="w-full py-2 rounded-lg bg-purple-500 text-white font-semibold hover:bg-purple-600 transition-all"
          >
            Register
          </motion.button>
          <p className="text-sm text-center text-white mt-5">
            Already have an account?{' '}
            <a href="/login.html" className="text-blue-200 underline hover:text-blue-400">Login</a>
          </p>
        </motion.div>
      </div>
    </>
  )
}
