'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setLoading(true)
    router.push('/dashboard')
  }

  return (
    <body className="min-h-screen flex items-center justify-center py-[60px] px-[20px] md:px-[40px] text-on-surface relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #fbf9f8 0%, rgba(155, 168, 143, 0.05) 100%)' }}>
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute rounded-full blur-[80px] opacity-[0.04] bg-[#9BA88F]" style={{ width: '400px', height: '400px', top: '-80px', left: '-80px' }}></div>
        <div className="absolute rounded-full blur-[80px] opacity-[0.04] bg-[#9BA88F]" style={{ width: '500px', height: '500px', bottom: '25%', right: '-160px' }}></div>
        <div className="absolute rounded-full blur-[80px] opacity-[0.04] bg-[#9BA88F]" style={{ width: '300px', height: '300px', top: '50%', left: '33%' }}></div>
      </div>

      <main className="w-full max-w-lg mx-auto flex flex-col items-center text-center relative z-10">
        <header className="w-full flex flex-col items-center" style={{ animation: 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
          <h1 className="text-[28px] font-semibold text-[#1b1c1c] mb-[12px]">SIBILA 26</h1>
          <div className="flex items-center w-full gap-4">
            <div className="h-[1px] bg-[#9BA88F] opacity-[0.05] flex-grow"></div>
            <p className="text-[13px] text-[#4d453e] uppercase tracking-widest whitespace-nowrap font-medium">
              Tarot · Reiki · Acompañamiento Holístico
            </p>
            <div className="h-[1px] bg-[#9BA88F] opacity-[0.05] flex-grow"></div>
          </div>
          <p className="text-[15px] text-[#9BA88F] italic mt-[16px] max-w-[260px] leading-[20px]">
            El espacio sagrado donde te cuidan de verdad
          </p>
        </header>

        <div className="w-full max-w-sm mt-[32px]" style={{ animation: 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards 200ms backwards' }}>
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-4 bg-[#9BA88F] hover:bg-[#6ABE76] text-white text-[15px] font-medium py-3 px-6 rounded-lg transition-colors duration-300 shadow-sm disabled:opacity-50"
          >
            {loading ? 'Verificando...' : 'Continuar con Google'}
          </button>
          <div className="mt-6 text-center text-[11px] text-[#7f756d]">
            Al continuar, aceptas nuestros Términos de Servicio y Política de Privacidad.
          </div>
        </div>
      </main>

      <style>{`
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </body>
  )
}
