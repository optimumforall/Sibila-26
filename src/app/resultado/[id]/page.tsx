'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface Analysis {
  id: string
  veredicto: string
  puntuacion: number
  visionAnalysis: string
  hashtags: string
  captionSugerido: string
}

const hashtagsMap: { [key: string]: string } = {
  APROBADO: '#tarot #lecturadetarot #tarotista #espiritualidad #autoconocimiento',
  CAMBIOS: '#reiki #reikihealing #chakras #energiapositiva #sanacion',
  NO_PUBLICAR: '#terapiaholistica #bienestar #saludmental #espiritualidad #crecimientopersonal'
}

// SVG iconos holísticos — sin emojis duplicados
const I = {
  tortuga: (s=16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="12" rx="5" ry="4"/><path d="M7 12c-1.5 0-3 .5-3 2s1 2 2 2l2-1"/><path d="M17 12c1.5 0 3 .5 3 2s-1 2-2 2l-2-1"/><path d="M9 16c0 1.5-.5 3-1 3s-1-.5-1-2"/><path d="M15 16c0 1.5.5 3 1 3s1-.5 1-2"/><path d="M10 8c0-1.5-.5-3-1-3s-1 .5-1 2"/><path d="M14 8c0-1.5.5-3 1-3s1 .5 1 2"/></svg>,
  vela: (s=16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="6" height="12" rx="1"/><path d="M12 9V6"/><path d="M10 6c0-1.5 2-3 2-3s2 1.5 2 3-1 1.5-2 1.5S10 7.5 10 6z" fill="currentColor" opacity="0.25"/><line x1="9" y1="13" x2="15" y2="13" opacity="0.3"/><line x1="9" y1="17" x2="15" y2="17" opacity="0.3"/></svg>,
  planta: (s=16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V12"/><path d="M12 12C12 7 7 4 4 6c0 4 3 7 8 6"/><path d="M12 12c0-5 5-8 8-6 0 4-3 7-8 6"/></svg>,
  piedra: (s=16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><polygon points="12,3 19,8 19,16 12,21 5,16 5,8"/><line x1="12" y1="3" x2="12" y2="21" opacity="0.25"/><line x1="5" y1="8" x2="19" y2="16" opacity="0.25"/><line x1="19" y1="8" x2="5" y2="16" opacity="0.25"/></svg>,
  talisman: (s=16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><polygon points="12,6 13.5,10.5 18,10.5 14.5,13.5 15.5,18 12,15 8.5,18 9.5,13.5 6,10.5 10.5,10.5"/></svg>,
  luna: (s=16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  flor: (s=16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="12" cy="12" r="2.5"/><ellipse cx="12" cy="6.5" rx="2" ry="3" transform="rotate(0 12 12)"/><ellipse cx="12" cy="6.5" rx="2" ry="3" transform="rotate(60 12 12)"/><ellipse cx="12" cy="6.5" rx="2" ry="3" transform="rotate(120 12 12)"/><ellipse cx="12" cy="6.5" rx="2" ry="3" transform="rotate(180 12 12)"/><ellipse cx="12" cy="6.5" rx="2" ry="3" transform="rotate(240 12 12)"/><ellipse cx="12" cy="6.5" rx="2" ry="3" transform="rotate(300 12 12)"/></svg>,
  ojo: (s=16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="1" fill="currentColor"/></svg>,
  espiral: (s=16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12c0 3.5 2 6 5 6s5-2.5 5-5-1.5-4-4-4"/></svg>,
  hoja: (s=16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>,
  copiar: (s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
}

// Icono por tipo de línea de análisis — sin emoji duplicado
const getLineIcon = (line: string) => {
  const l = line.toLowerCase()
  if (l.startsWith('colores:') || l.startsWith('color:')) return I.flor(13)
  if (l.startsWith('luz:')) return I.vela(13)
  if (l.startsWith('composicion:') || l.startsWith('composición:')) return I.espiral(13)
  if (l.startsWith('publico:') || l.startsWith('público:')) return I.ojo(13)
  if (l.startsWith('funciona:')) return I.piedra(13)
  if (l.startsWith('mejorar:')) return I.planta(13)
  return I.luna(13)
}

// Quitar la clave del inicio de la línea (ej: "Colores: ..." -> "...")
const cleanLine = (line: string) => {
  return line.replace(/^[^:]+:\s*/, '').trim()
}

// Limpiar línea: quitar emojis iniciales del análisis (los ponemos nosotros vía SVG)


export default function ResultadoPage() {
  const params = useParams()
  const router = useRouter()
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [copied, setCopied] = useState('')

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('analysisResult')
      if (stored) {
        const data = JSON.parse(stored)
        const veredicto = data.veredicto || 'APROBADO'
        // Usar caption de Claude Vision (específico de la imagen)
        // Si no hay caption de visión, usar genérico
        const caption = data.captionFromVision && data.captionFromVision.length > 10
          ? data.captionFromVision
          : 'Tu energía se transmite en cada imagen. Comparte con intención. 🌙'

        setAnalysis({
          id: params.id as string,
          veredicto,
          puntuacion: data.puntuacion || 8,
          visionAnalysis: data.visionAnalysis || '',
          hashtags: hashtagsMap[veredicto] || hashtagsMap.APROBADO,
          captionSugerido: caption
        })
        sessionStorage.removeItem('analysisResult')
      }
    } catch (e) { console.error(e) }
  }, [params.id])

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(''), 2000)
  }

  if (!analysis) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-4">
        <div className="text-[#9BA88F] animate-spin">{I.flor(36)}</div>
        <p className="text-[15px] text-[#4d453e]">Claude Vision analizando tu imagen...</p>
      </div>
    )
  }

  const vConfig = {
    APROBADO:    { bg: '#34C759', icon: I.piedra(20),   label: 'APROBADO — Listo para publicar' },
    CAMBIOS:     { bg: '#FF9500', icon: I.vela(20),     label: 'CAMBIOS RECOMENDADOS' },
    NO_PUBLICAR: { bg: '#FF3B30', icon: I.talisman(20), label: 'NO PUBLICAR' }
  }[analysis.veredicto] || { bg: '#34C759', icon: I.piedra(20), label: 'APROBADO' }

  const lines = analysis.visionAnalysis.split('\n').filter(l => l.trim())

  return (
    <body className="text-on-surface antialiased min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, rgba(143, 168, 149, 0.12) 0%, #FFFFFF 50%, rgba(143, 168, 149, 0.1) 100%)' }}>

      {/* Decorativos fondo */}
      <div className="fixed top-6 right-8 text-[#9BA88F] opacity-[0.05] pointer-events-none">{I.tortuga(80)}</div>
      <div className="fixed bottom-8 left-6 text-[#9BA88F] opacity-[0.05] pointer-events-none">{I.planta(70)}</div>
      <div className="fixed top-1/2 right-4 text-[#9BA88F] opacity-[0.04] pointer-events-none">{I.piedra(55)}</div>
      <div className="fixed bottom-1/3 right-14 text-[#9BA88F] opacity-[0.04] pointer-events-none">{I.vela(45)}</div>

      <header className="fixed top-0 left-0 w-full z-50 flex justify-center bg-[rgba(251,249,248,0.9)] backdrop-blur-md border-b border-[#d0c4bb]">
        <div className="w-full max-w-[900px] flex justify-between items-center px-[20px] py-3">
          <span className="font-semibold text-[17px] text-[#695c4f]">Sibila 26</span>
          <a href="/dashboard" className="text-[14px] font-medium text-[#4d453e] hover:text-[#695c4f] flex items-center gap-1.5">
            <span className="text-[#9BA88F]">{I.hoja(13)}</span> Volver
          </a>
        </div>
      </header>

      <main className="flex-grow flex items-start justify-center pt-20 pb-8 px-[20px] w-full relative z-10">
        <div className="w-full max-w-[700px] flex flex-col gap-4 py-4">

          {/* Veredicto + Puntuación */}
          <div className="flex gap-4">
            <div className="flex-1 rounded-xl p-5 text-center text-white flex flex-col items-center gap-2" style={{ background: vConfig.bg }}>
              <div className="opacity-80">{vConfig.icon}</div>
              <p className="font-semibold text-[14px]">{vConfig.label}</p>
            </div>
            <div className="w-[90px] bg-white border border-[#E5E5EA] rounded-xl flex flex-col items-center justify-center gap-1">
              <div className="text-[#9BA88F] opacity-40">{I.talisman(13)}</div>
              <div className="text-[32px] font-semibold text-[#9BA88F] leading-none">{analysis.puntuacion}</div>
              <div className="text-[11px] text-[#4d453e]">/10</div>
            </div>
          </div>

          {/* Análisis */}
          <div className="bg-white border border-[#E5E5EA] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="text-[#9BA88F]">{I.ojo(15)}</div>
              <h2 className="font-semibold text-[15px] text-[#1b1c1c]">Análisis de la imagen</h2>
              <span className="text-[11px] text-[#9BA88F] ml-auto bg-[#9BA88F15] px-2 py-0.5 rounded-full">Claude Vision</span>
            </div>
            <div className="space-y-2.5">
              {lines.map((line, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <div className="text-[#9BA88F] shrink-0 mt-0.5 opacity-60">{getLineIcon(line)}</div>
                  <p className="text-[13px] text-[#4d453e] leading-[20px]">{cleanLine(line)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Caption + Hashtags */}
          <div className="flex gap-4">
            <div className="flex-1 bg-white border-l-4 border-[#9BA88F] rounded-xl p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="text-[#9BA88F]">{I.luna(13)}</div>
                <h3 className="font-semibold text-[13px] text-[#1b1c1c]">Caption sugerido</h3>
              </div>
              <p className="text-[13px] text-[#4d453e] italic leading-[20px] mb-3">{analysis.captionSugerido}</p>
              <button onClick={() => copy(analysis.captionSugerido, 'caption')} className="text-[12px] font-medium text-[#9BA88F] flex items-center gap-1.5 hover:text-[#6ABE76] transition-colors">
                {I.copiar(12)} {copied === 'caption' ? 'Copiado' : 'Copiar'}
              </button>
            </div>

            <div className="flex-1 bg-[#f6f3f2] border border-[#E5E5EA] rounded-xl p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="text-[#9BA88F]">{I.flor(13)}</div>
                <h3 className="font-semibold text-[13px] text-[#1b1c1c]">Hashtags</h3>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {analysis.hashtags.split(' ').map((tag, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-white border border-[#E5E5EA] rounded-full text-[11px] text-[#695c4f] font-medium">{tag}</span>
                ))}
              </div>
              <button onClick={() => copy(analysis.hashtags, 'tags')} className="text-[12px] font-medium text-[#9BA88F] flex items-center gap-1.5 hover:text-[#6ABE76] transition-colors">
                {I.copiar(12)} {copied === 'tags' ? 'Copiados' : 'Copiar'}
              </button>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 justify-center pt-1">
            <button onClick={() => router.push('/dashboard')} className="px-5 py-2.5 bg-white border border-[#E5E5EA] text-[#1b1c1c] rounded-lg text-[14px] font-medium hover:bg-[#f6f3f2] flex items-center gap-2">
              <span className="text-[#9BA88F]">{I.tortuga(14)}</span> Analizar otra
            </button>
            <button onClick={() => router.push('/content-generator')} className="px-5 py-2.5 bg-[#9BA88F] text-white rounded-lg text-[14px] font-medium hover:brightness-105 flex items-center gap-2">
              <span>{I.planta(14)}</span> Generar contenido
            </button>
          </div>

        </div>
      </main>
    </body>
  )
}
