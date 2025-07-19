import { useEffect } from 'react'

export default function LogoutPage() {
  useEffect(() => {
    console.log('🔁 Logout start')

    // 清除本地存储中的用户信息（UID, token等）
    localStorage.removeItem('userId')
    localStorage.removeItem('token')


    window.location.replace('/login.html')
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ede9f5] text-purple-800 text-lg">
      Logging out...
    </div>
  )
}
