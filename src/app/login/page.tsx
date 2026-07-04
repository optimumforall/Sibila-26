'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `https://sibila-26.vercel.app/auth/callback`,
      },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-[60px] px-[20px] md:px-[40px] text-on-surface relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #fbf9f8 0%, rgba(155, 168, 143, 0.05) 100%)' }}>
      <main className="w-full max-w-lg mx-auto flex flex-col items-center text-center relative z-10">
        <header className="w-full flex flex-col items-center">
          <h1 className="text-[28px] font-semibold text-[#1b1c1c] mb-[12px]">SIBILA 26</h1>
          <p className="text-[13px] text-[#4d453e] uppercase tracking-widest font-medium">
            Tarot · Reiki · Acompañamiento Holístico
          </p>
          <p className="text-[15px] text-[#9BA88F] italic mt-[16px] max-w-[260px] leading-[20px]">
            El espacio sagrado donde te cuidan de verdad
          </p>
        </header>

        <div className="w-full max-w-sm mt-[32px]">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-4 bg-[#9BA88F] hover:brightness-105 text-white text-[15px] font-medium py-3 px-6 rounded-lg transition-all duration-300 shadow-sm disabled:opacity-50"
          >
            {loading ? 'Redirigiendo a Google...' : 'Continuar con Google'}
          </button>
          <div className="mt-6 text-center text-[11px] text-[#7f756d]">
            Acceso privado. Solo usuarios autorizados.
          </div>
        </div>
      </main>
    </div>
  )
}
