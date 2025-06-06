import { useState } from 'react'
import { auth } from '../lib/firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const signIn = async () => {
    await signInWithEmailAndPassword(auth, email, password)
    alert('Logged in!')
  }

  const signUp = async () => {
    await createUserWithEmailAndPassword(auth, email, password)
    alert('Account created!')
  }

  return (
    <div className='min-h-screen flex flex-col justify-center items-center space-y-4'>
      <input
        type='email'
        placeholder='Email'
        className='border p-2 w-80'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type='password'
        placeholder='Password'
        className='border p-2 w-80'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className='flex space-x-4'>
        <button onClick={signIn} className='bg-blue-500 text-white px-4 py-2'>Login</button>
        <button onClick={signUp} className='bg-green-500 text-white px-4 py-2'>Sign Up</button>
      </div>
    </div>
  )
}
