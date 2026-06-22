'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const MAX_DAILY = 5 // Límite diario de análisis
const MAX_FILE_SIZE_MB = 10 // Límite de tamaño de archivo
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
const ALLOWED_EXTENSIONS = 'JPG, PNG, WEBP, GIF'

export default function DashboardPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [caption, setCaption] = useState('')
  const [loading, setLoading] = useState(false)
  const [fileName, setFileName] = useState('')
  const [loadingMsg, setLoadingMsg] = useState('')
  const [fileError, setFileError] = useState('')
  const [dailyCount, setDailyCount] = useState(0)
  const [limitReached, setLimitReached] = useState(false)

  // Verificar límite diario
  useEffect(() => {
    const today = new Date().toDateString()
    const stored = localStorage.getItem('sibila26_daily')
    if (stored) {
      const { date, count } = JSON.parse(stored)
      if (date === today) {
        setDailyCount(count)
        if (count >= MAX_DAILY) setLimitReached(true)
      } else {
        // Resetear si es nuevo día
        localStorage.setItem('sibila26_daily', JSON.stringify({ date: today, count: 0 }))
      }
    }
  }, [])

  const incrementDailyCount = () => {
    const today = new Date().toDateString()
    const newCount = dailyCount + 1
    localStorage.setItem('sibila26_daily', JSON.stringify({ date: today, count: newCount }))
    setDailyCount(newCount)
    if (newCount >= MAX_DAILY) setLimitReached(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError('')
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Validar tipo
    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setFileError(`Formato no permitido. Solo: ${ALLOWED_EXTENSIONS}`)
      return
    }

    // Validar tamaño
    const sizeMB = selectedFile.size / (1024 * 1024)
    if (sizeMB > MAX_FILE_SIZE_MB) {
      setFileError(`Archivo demasiado grande. Máximo ${MAX_FILE_SIZE_MB}MB (tu archivo: ${sizeMB.toFixed(1)}MB)`)
      return
    }

    setFile(selectedFile)
    setFileName(selectedFile.name)
  }

  const handleAnalyze = async () => {
    if (!file) return
    if (limitReached) {
      alert(`Has alcanzado el límite de ${MAX_DAILY} análisis por día. Vuelve mañana.`)
      return
    }

    setLoading(true)
    setLoadingMsg('Subiendo imagen...')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('caption', caption)

      setLoadingMsg('Claude Vision está analizando tu imagen...')

      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Error en análisis')
      }

      const data = await res.json()

      // Guardar datos para página resultado
      sessionStorage.setItem('analysisResult', JSON.stringify(data))

      // Incrementar contador diario
      incrementDailyCount()

      router.push(`/resultado/${data.id}`)
    } catch (error: any) {
      alert(`Error: ${error.message}`)
      setLoading(false)
      setLoadingMsg('')
    }
  }

  return (
    <body className="text-on-surface antialiased min-h-screen flex flex-col relative overflow-x-hidden" style={{ background: 'linear-gradient(135deg, rgba(143, 168, 149, 0.12) 0%, #FFFFFF 50%, rgba(143, 168, 149, 0.1) 100%)', backgroundAttachment: 'fixed' }}>
      <div className="fixed rounded-full blur-[100px] z-[-1] opacity-[0.04] bg-[#9BA88F]" style={{ width: '384px', height: '384px', top: '10%', left: '5%' }}></div>
      <div className="fixed rounded-full blur-[100px] z-[-1] opacity-[0.04] bg-[#9BA88F]" style={{ width: '500px', height: '500px', bottom: '15%', right: '10%' }}></div>

      <header className="fixed top-0 left-0 w-full z-50 flex justify-center bg-[rgba(251,249,248,0.8)] backdrop-blur-md border-b border-[#d0c4bb]">
        <div className="w-full max-w-[1200px] flex justify-between items-center px-[20px] md:px-[40px] py-4">
          <span className="font-semibold text-[17px] text-[#695c4f]">Sibila 26</span>
          <nav className="hidden md:flex items-center gap-4">
            <a href="/content-generator" className="flex items-center gap-2 px-4 py-2 border border-[#E5E5EA] rounded-lg text-[15px] text-[#1b1c1c] hover:bg-[#f6f3f2] transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9BA88F" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12c0 3.5 2 6 5 6s5-2.5 5-5-1.5-4-4-4"/></svg>
              Generar contenido
            </a>
            <a href="/historial" className="flex items-center gap-2 px-4 py-2 border border-[#E5E5EA] rounded-lg text-[15px] text-[#1b1c1c] hover:bg-[#f6f3f2] transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9BA88F" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              Mis análisis
            </a>
            <a href="/login" className="text-[15px] font-medium text-[#4d453e] hover:text-[#695c4f] transition-colors">Logout</a>
          </nav>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center pt-24 pb-[40px] px-[20px] md:px-[40px] w-full z-10 relative">
        <div className="w-full max-w-[600px] flex flex-col justify-center items-center text-center">
          
          {/* Header */}
          <div className="flex flex-col gap-2 mb-[32px] w-full">
            <h1 className="font-semibold text-[22px] leading-[28px] text-[#1b1c1c]">Analiza tu contenido</h1>
            <p className="font-normal text-[15px] leading-[20px] text-[#4d453e]">Sube tu imagen antes de publicar en Instagram</p>
          </div>

          {/* Contador diario */}
          <div className={`w-full flex items-center justify-between px-4 py-2 rounded-lg mb-6 text-[13px] ${limitReached ? 'bg-[#FF3B3015] border border-[#FF3B30]' : 'bg-[#f6f3f2] border border-[#E5E5EA]'}`}>
            <span className="text-[#4d453e]">Análisis de hoy</span>
            <span className={`font-semibold ${limitReached ? 'text-[#FF3B30]' : 'text-[#9BA88F]'}`}>
              {dailyCount}/{MAX_DAILY} {limitReached ? '— Límite alcanzado' : ''}
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center gap-6 py-16 w-full">
              <div className="text-[#9BA88F] animate-spin">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="2.5"/>
                  <ellipse cx="12" cy="6.5" rx="2" ry="3" transform="rotate(0 12 12)"/>
                  <ellipse cx="12" cy="6.5" rx="2" ry="3" transform="rotate(60 12 12)"/>
                  <ellipse cx="12" cy="6.5" rx="2" ry="3" transform="rotate(120 12 12)"/>
                  <ellipse cx="12" cy="6.5" rx="2" ry="3" transform="rotate(180 12 12)"/>
                  <ellipse cx="12" cy="6.5" rx="2" ry="3" transform="rotate(240 12 12)"/>
                  <ellipse cx="12" cy="6.5" rx="2" ry="3" transform="rotate(300 12 12)"/>
                </svg>
              </div>
              <p className="text-[15px] text-[#4d453e] font-medium">{loadingMsg}</p>
              <p className="text-[13px] text-[#9BA88F]">Claude Vision analiza cada detalle de tu imagen...</p>
            </div>
          ) : limitReached ? (
            <div className="w-full flex flex-col items-center gap-4 py-12">
              <div className="text-[#9BA88F] opacity-40">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              </div>
              <p className="text-[15px] text-[#4d453e] font-medium">Has alcanzado el límite diario</p>
              <p className="text-[13px] text-[#9BA88F]">Puedes hacer {MAX_DAILY} análisis al día. Vuelve mañana.</p>
              <button
                onClick={() => router.push('/content-generator')}
                className="mt-4 px-6 py-3 bg-[#9BA88F] text-white rounded-lg font-medium text-[15px] hover:brightness-105"
              >
                Generar contenido mientras tanto
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-[24px] w-full">
              
              {/* Upload Zone */}
              <div className="relative group cursor-pointer transition-colors duration-200">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept={ALLOWED_TYPES.join(',')}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={`flex flex-col items-center justify-center p-[48px] border rounded-lg transition-all ${fileError ? 'border-[#FF3B30]' : 'border-[rgba(143,168,149,0.3)] group-hover:border-[#9BA88F]'}`} style={{ background: 'linear-gradient(135deg,rgba(143,168,149,0.04),#FFFFFF)' }}>
                  <span className="text-[#9BA88F] mb-2 flex justify-center">
                    {fileError
                      ? <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF3B30" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="0.5" fill="#FF3B30"/></svg>
                      : file
                        ? <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><polygon points="12,3 19,8 19,16 12,21 5,16 5,8"/><line x1="12" y1="3" x2="12" y2="21" opacity="0.3"/><line x1="5" y1="8" x2="19" y2="16" opacity="0.3"/><line x1="19" y1="8" x2="5" y2="16" opacity="0.3"/></svg>
                        : <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
                    }
                  </span>
                  <span className="font-medium text-[15px] text-[#4d453e] group-hover:text-[#9BA88F] transition-colors">
                    {fileName || 'Sube tu imagen aquí'}
                  </span>
                  {/* Nota de formatos y límite */}
                  <div className="mt-4 text-center">
                    <p className="text-[12px] text-[#9BA88F]">
                      Formatos: {ALLOWED_EXTENSIONS} · Máximo {MAX_FILE_SIZE_MB}MB
                    </p>
                    <p className="text-[11px] text-[#7f756d] mt-1">
                      Solo imágenes (los vídeos no están disponibles aún)
                    </p>
                  </div>
                </div>
              </div>

              {/* Error de archivo */}
              {fileError && (
                <div className="w-full px-4 py-3 bg-[#FF3B3015] border border-[#FF3B30] rounded-lg text-[13px] text-[#FF3B30] text-left">
                  {fileError}
                </div>
              )}

              {/* Caption */}
              <div className="flex flex-col gap-2 text-left w-full">
                <label className="font-medium text-[13px] leading-[18px] text-[#4d453e]">Caption (Opcional)</label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Escribe el caption que quieres usar..."
                  rows={4}
                  className="w-full bg-[rgba(255,255,255,0.8)] border border-[#E5E5EA] rounded-lg p-4 text-[15px] text-[#1b1c1c] focus:border-[#9BA88F] focus:ring-0 resize-none transition-colors"
                />
              </div>

              {/* Botón Analizar */}
              <button
                onClick={handleAnalyze}
                disabled={!file || !!fileError}
                className="w-full bg-[#9BA88F] disabled:opacity-40 text-white font-semibold text-[17px] py-4 rounded-lg hover:brightness-105 transition-all flex justify-center items-center gap-2 shadow-sm"
              >
                ANALIZAR →
              </button>

            </div>
          )}
        </div>
      </main>
    </body>
  )
}
