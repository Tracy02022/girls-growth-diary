'use client'

import { useEffect, useState } from 'react'

export default function PrivacyConsentModal() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('privacyConsent')
    if (!consent) setShow(true)
  }, [])

  function onAgree() {
    localStorage.setItem('privacyConsent', 'true')
    window.location.reload() 
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4 text-gray-800">
        <h2 className="text-xl font-semibold mb-4">Privacy Policy & Data Collection</h2>
        <p className="text-sm mb-4">
          We collect and store personal data (e.g. email, mood, body fat) to provide app features.
          Please review our{' '}
          <a href="https://tracy02022.github.io/kittytime-support/privacy.html" target="_blank" rel="noopener noreferrer" className="underline text-purple-600 hover:text-purple-800">
            Privacy Policy
          </a>{' '}
          before using the app.
        </p>
        <button
          onClick={onAgree}
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700"
        >
          I Agree
        </button>
      </div>
    </div>
  )
}
