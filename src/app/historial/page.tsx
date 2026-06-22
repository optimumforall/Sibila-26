'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Analysis {
  id: string
  file_type: string
  created_at: string
  veredicto: string
  puntuacion: number
}

// SVG iconos holísticos
const I = {
  tortuga: (s=16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="12" rx="5" ry="4"/><path d="M7 12c-1.5 0-3 .5-3 2s1 2 2 2l2-1"/><path d="M17 12c1.5 0 3 .5 3 2s-1 2-2 2l-2-1"/><path d="M9 16c0 1.5-.5 3-1 3s-1-.5-1-2"/><path d="M15 16c0 1.5.5 3 1 3s1-.5 1-2"/><path d="M10 8c0-1.5-.5-3-1-3s-1 .5-1 2"/><path d="M14 8c0-1.5.5-3 1-3s1 .5 1 2"/></svg>,
  planta: (s=16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V12"/><path d="M12 12C12 7 7 4 4 6c0 4 3 7 8 6"/><path d="M12 12c0-5 5-8 8-6 0 4-3 7-8 6"/></svg>,
  luna: (s=16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  piedra: (s=16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><polygon points="12,3 19,8 19,16 12,21 5,16 5,8"/><line x1="12" y1="3" x2="12" y2="21" opacity="0.25"/><line x1="5" y1="8" x2="19" y2="16" opacity="0.25"/><line x1="19" y1="8" x2="5" y2="16" opacity="0.25"/></svg>,
  flor: (s=16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="12" cy="12" r="2.5"/><ellipse cx="12" cy="6.5" rx="2" ry="3" transform="rotate(0 12 12)"/><ellipse cx="12" cy="6.5" rx="2" ry="3" transform="rotate(60 12 12)"/><ellipse cx="12" cy="6.5" rx="2" ry="3" transform="rotate(120 12 12)"/><ellipse cx="12" cy="6.5" rx="2" ry="3" transform="rotate(180 12 12)"/><ellipse cx="12" cy="6.5" rx="2" ry="3" transform="rotate(240 12 12)"/><ellipse cx="12" cy="6.5" rx="2" ry="3" transform="rotate(300 12 12)"/></svg>,
  espiral: (s=16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12c0 3.5 2 6 5 6s5-2.5 5-5-1.5-4-4-4"/></svg>,
  hoja: (s=16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>,
  vela: (s=16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="6" height="12" rx="1"/><path d="M12 9V6"/><path d="M10 6c0-1.5 2-3 2-3s2 1.5 2 3-1 1.5-2 1.5S10 7.5 10 6z" fill="currentColor" opacity="0.25"/></svg>,
}

export default function HistorialPage() {
  const router = useRouter()
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const res = await fetch('/api/analyses')
        if (!res.ok) throw new Error('Error fetching')
        const data = await res.json()
        setAnalyses(data)
      } catch (error) {
        console.error('Error:', error)
        setAnalyses([])
      } finally {
        setLoading(false)
      }
    }
    fetchAnalyses()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })
  }

  const veredictoConfig = {
    APROBADO:    { color: '#34C759', label: 'Aprobado',  icon: I.piedra(12) },
    CAMBIOS:     { color: '#FF9500', label: 'Cambios',   icon: I.vela(12) },
    NO_PUBLICAR: { color: '#FF3B30', label: 'No publicar', icon: I.flor(12) }
  }

  return (
    <body className="text-on-surface antialiased min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, rgba(143, 168, 149, 0.12) 0%, #FFFFFF 50%, rgba(143, 168, 149, 0.1) 100%)', backgroundAttachment: 'fixed' }}>

      {/* Decorativos */}
      <div className="fixed top-6 right-8 text-[#9BA88F] opacity-[0.05] pointer-events-none">{I.tortuga(80)}</div>
      <div className="fixed bottom-8 left-6 text-[#9BA88F] opacity-[0.05] pointer-events-none">{I.planta(70)}</div>

      <header className="fixed top-0 left-0 w-full z-50 flex justify-center bg-[rgba(251,249,248,0.9)] backdrop-blur-md border-b border-[#d0c4bb]">
        <div className="w-full max-w-[1200px] flex justify-between items-center px-[20px] md:px-[40px] py-4">
          <span className="font-semibold text-[17px] text-[#695c4f]">Sibila 26</span>
          <nav className="hidden md:flex items-center gap-4">
            <a href="/content-generator" className="flex items-center gap-2 px-4 py-2 border border-[#E5E5EA] rounded-lg text-[15px] text-[#1b1c1c] hover:bg-[#f6f3f2] transition-colors">
              <span className="text-[#9BA88F]">{I.espiral(14)}</span> Generar contenido
            </a>
            <a href="/dashboard" className="flex items-center gap-2 px-4 py-2 border border-[#E5E5EA] rounded-lg text-[15px] text-[#1b1c1c] hover:bg-[#f6f3f2] transition-colors">
              <span className="text-[#9BA88F]">{I.tortuga(14)}</span> Dashboard
            </a>
            <a href="/login" className="text-[15px] font-medium text-[#4d453e] hover:text-[#695c4f] transition-colors">Logout</a>
          </nav>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center pt-24 pb-[40px] px-[20px] md:px-[40px] w-full z-10 relative">
        <div className="w-full max-w-[700px]">
          <div className="text-center mb-[32px]">
            <h1 className="font-semibold text-[22px] text-[#8FA895] mb-2 flex items-center justify-center gap-2">
              <span className="text-[#9BA88F]">{I.luna(20)}</span> Mis análisis
            </h1>
            <p className="text-[15px] text-[#4d453e]">Historial de contenido analizado</p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center py-20 gap-4">
              <div className="text-[#9BA88F] animate-spin">{I.flor(36)}</div>
              <p className="text-[14px] text-[#4d453e]">Cargando historial...</p>
            </div>
          ) : analyses.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center gap-4">
              <div className="text-[#9BA88F] opacity-30">{I.piedra(48)}</div>
              <p className="text-[15px] text-[#1b1c1c] font-medium">Aún no has analizado ningún contenido</p>
              <p className="text-[14px] text-[#4d453e]">Sube tu primera imagen y veremos si está lista para publicar</p>
              <button onClick={() => router.push('/dashboard')} className="mt-2 bg-[#9BA88F] text-white font-medium text-[15px] py-2.5 px-6 rounded-lg hover:brightness-105 flex items-center gap-2">
                <span>{I.hoja(14)}</span> Analizar mi primer post
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {analyses.map((analysis) => {
                const vConfig = veredictoConfig[analysis.veredicto as keyof typeof veredictoConfig] || veredictoConfig.CAMBIOS
                return (
                  <div
                    key={analysis.id}
                    onClick={() => router.push(`/historial/${analysis.id}`)}
                    className="flex items-center justify-between p-4 border border-[#E5E5EA] rounded-xl bg-white hover:bg-[#f6f3f2] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-[#f6f3f2] flex items-center justify-center text-[#9BA88F]">
                        {I.piedra(18)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-[14px] text-[#1b1c1c]">
                            {analysis.file_type === 'video' ? 'Vídeo' : 'Imagen'}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-medium flex items-center gap-1"
                            style={{ background: vConfig.color + '20', color: vConfig.color }}>
                            {vConfig.icon} {vConfig.label}
                          </span>
                        </div>
                        <div className="text-[12px] text-[#9BA88F]">{formatDate(analysis.created_at)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-semibold text-[17px] text-[#9BA88F]">{analysis.puntuacion}<span className="text-[12px] text-[#4d453e] font-normal">/10</span></div>
                      </div>
                      <div className="text-[#E5E5EA] group-hover:text-[#9BA88F] transition-colors">{I.hoja(14)}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </body>
  )
}
