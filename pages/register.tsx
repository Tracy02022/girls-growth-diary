import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { useRouter } from 'next/router'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleRegister = async () => {
    setError('')
    if (password.length < 6) {
      setError('密码长度不能少于 6 个字符')
      return
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      router.push('/wishes')
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-20 space-y-4">
      <h1 className="text-2xl font-bold text-center">注册</h1>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <input
        type="email"
        placeholder="邮箱"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />
      <input
        type="password"
        placeholder="密码"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />
      <button
        onClick={handleRegister}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        注册
      </button>
      <p className="text-sm text-center">
        已有账号？ <a href="/login" className="text-blue-600 underline">前往登录</a>
      </p>
    </div>
  )
}
