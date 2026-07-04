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
        redirectTo: 'https://sibila-26.vercel.app/auth/callback',
      },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#fbf9f8' }}>
      <main className="flex flex-col items-center text-center gap-6">
        <h1 className="text-[28px] font-semibold text-[#1b1c1c]">SIBILA 26</h1>
        <p className="text-[13px] text-[#4d453e] uppercase tracking-widest">Tarot · Reiki · Acompanamiento Holistico</p>
        <p className="text-[15px] text-[#9BA88F] italic">El espacio sagrado donde te cuidan de verdad</p>
        <button onClick={handleGoogleLogin} disabled={loading}
          className="bg-[#9BA88F] text-white text-[15px] font-medium py-3 px-8 rounded-lg hover:brightness-105 disabled:opacity-50">
          {loading ? 'Redirigiendo...' : 'Continuar con Google'}
        </button>
        <p className="text-[11px] text-[#7f756d]">Acceso privado. Solo usuarios autorizados.</p>
      </main>
    </div>
  )
}
