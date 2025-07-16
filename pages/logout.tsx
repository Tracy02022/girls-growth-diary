import { useEffect } from 'react'
import { auth } from '../lib/firebase'

export default function LogoutPage() {
  useEffect(() => {
    console.log('🔁 Logout start')

    window.location.replace('/login.html')

    setTimeout(() => {
      auth.signOut()
        .then(() => {
          console.log('✅ Sign out success')
        })
        .catch((err) => {
          console.error('❌ Sign out failed:', err)
        })
    }, 500) 
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ede9f5] text-purple-800 text-lg">
      Logging out...
    </div>
  )
}
