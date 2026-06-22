'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type ContentType = 'tarot' | 'reiki' | 'holistico' | 'motivacional'

interface ContentData {
  captions: string[]
  ideas: string[]
  hashtags: string[]
}

const contentData: { [key in ContentType]: ContentData } = {
  tarot: {
    captions: [
      'Las cartas no predicen el futuro, lo revelan. ¿Qué mensaje tiene el Universo para ti hoy? 🔮',
      'Cada tirada es un espejo de tu alma. Tu intuición ya sabe la respuesta. ¿Te atreves a escucharla? 🌙',
      'No busco decirte lo que quieres oír. Busco mostrarte lo que necesitas ver. Tarot honesto y consciente.',
      'Las cartas hablan de lo que ya existe dentro de ti. Yo solo soy la traductora. ¿Conectamos? ✨',
      'Una lectura de tarot no cambia tu destino. Cambia cómo lo navegas. Reserva tu sesión. 🌙'
    ],
    ideas: [
      'Tirada del lunes: carta de la semana con explicación',
      'Desmontando mitos sobre el tarot (el más viral)',
      'Historia de una carta del tarot que cambia la vida',
      'Cómo preparo el espacio antes de una lectura',
      'Diferencia entre tarot predictivo y tarot consciente',
      'Qué pasa en una sesión conmigo — proceso paso a paso',
      'Las 3 preguntas que NO debes hacer al tarot'
    ],
    hashtags: ['#tarot', '#lecturadetarot', '#tarotista', '#espiritualidad', '#autoconocimiento']
  },
  reiki: {
    captions: [
      'La energía no miente. Cuando el cuerpo pide parar, hay que escucharlo. Reiki para ti, hoy. 🕯️',
      'Una sesión de Reiki no es magia. Es recordarte que tienes la capacidad de sanar. ✨',
      'El Reiki no cura. Desbloquea lo que tú mismo puedes sanar. ¿Estás listo para empezar? 🌿',
      'Tu aura habla cuando tú no puedes. Limpieza energética con Reiki. Sesiones online disponibles.',
      'Cuando la mente está saturada, el cuerpo lo acusa. El Reiki devuelve el equilibrio. 🕯️'
    ],
    ideas: [
      'Qué sientes durante una sesión de Reiki — de verdad',
      'Los 7 chakras explicados en lenguaje humano',
      'Antes y después de una limpieza energética',
      'Señales de que tu energía necesita atención ya',
      'Reiki online: cómo funciona y por qué sí funciona',
      'Símbolos del Reiki y su significado real',
      'Diferencia entre Reiki, limpieza de aura y cuencos tibetanos'
    ],
    hashtags: ['#reiki', '#reikihealing', '#chakras', '#energiapositiva', '#sanacion']
  },
  holistico: {
    captions: [
      'Tu cuerpo, tu mente y tu espíritu no son tres cosas. Son una. Tratar solo una parte no es suficiente. 🌿',
      'El bienestar holístico no es alternativo. Es la forma más completa de cuidarse. 🧿',
      'Cuando el alma duele, el cuerpo habla. Acompañamiento holístico para escucharte de verdad.',
      'No soy terapeuta de lo que está roto. Soy guía de lo que quiere crecer. ✨',
      'La sanación no es un destino. Es el camino que eliges cada día. Acompañémoslo juntas. 🌙'
    ],
    ideas: [
      'Rutina matinal de 10 min para limpiar tu energía',
      'Cómo saber si tu aura necesita limpieza (señales reales)',
      'Plantas que purifican energía en casa',
      'Diferencia entre terapia psicológica y acompañamiento holístico',
      'Qué pasa en una sesión holística conmigo',
      'Cuencos tibetanos: qué son y para qué sirven realmente',
      'Rituales sencillos para fin de mes: cierre y apertura'
    ],
    hashtags: ['#terapiaholistica', '#bienestar', '#saludmental', '#espiritualidad', '#crecimientopersonal']
  },
  motivacional: {
    captions: [
      'No vine a decirte que todo pasa por algo. Vine a acompañarte mientras lo descubres. 💫',
      'La transformación no duele porque sea mala. Duele porque es real. Y eso es exactamente lo que necesitas.',
      'No eres lo que te pasó. Eres lo que decides hacer con ello. Hoy puedes elegir diferente. ✨',
      'El miedo y la intuición se sienten igual. La diferencia es que uno te para y la otra te guía. 🌙',
      'Mereces apoyo real, no palabras vacías. Acompañamiento holístico honesto y a tu ritmo. 🕯️'
    ],
    ideas: [
      'Por qué la espiritualidad no es escapismo',
      'Cómo diferenciar intuición de ansiedad',
      'Lo que nadie te dice sobre el crecimiento personal',
      'Cuando pedir ayuda es el acto más valiente',
      'Historia de transformación real',
      'Errores que cometí en mi propio camino de sanación',
      '3 señales de que estás lista para un cambio'
    ],
    hashtags: ['#crecimientopersonal', '#autoconocimiento', '#bienestaremocional', '#transformacionpersonal', '#espiritualidad']
  }
}

export default function ContentGeneratorPage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<ContentType | null>(null)
  const [selectedIdeas, setSelectedIdeas] = useState<string[]>([])
  const [copied, setCopied] = useState('')
  const [generatingCaption, setGeneratingCaption] = useState(false)
  const [generatedCaption, setGeneratedCaption] = useState('')

  // Upload imagen para análisis
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadFileName, setUploadFileName] = useState('')
  const [analyzingImage, setAnalyzingImage] = useState(false)
  const [imageAnalysis, setImageAnalysis] = useState('')

  const data = selectedType ? contentData[selectedType] : null

  const toggleIdea = (idea: string) => {
    setSelectedIdeas(prev =>
      prev.includes(idea) ? prev.filter(i => i !== idea) : [...prev, idea]
    )
  }

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(''), 2000)
  }

  const generateFromIdeas = async () => {
    if (selectedIdeas.length === 0) return
    setGeneratingCaption(true)
    setGeneratedCaption('')
    try {
      const res = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: selectedType, ideas: selectedIdeas })
      })
      if (!res.ok) throw new Error('Error')
      const data = await res.json()
      setGeneratedCaption(data.caption)
    } catch {
      alert('Error generando. Intenta de nuevo.')
    } finally {
      setGeneratingCaption(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) {
      alert('Solo imágenes: JPG, PNG, WEBP')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('Máximo 10MB')
      return
    }
    setUploadFile(file)
    setUploadFileName(file.name)
    setImageAnalysis('')
  }

  const analyzeUploadedImage = async () => {
    if (!uploadFile) return
    setAnalyzingImage(true)
    setImageAnalysis('')
    try {
      const formData = new FormData()
      formData.append('file', uploadFile)
      formData.append('caption', '')
      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData
      })
      if (!res.ok) throw new Error('Error')
      const data = await res.json()
      sessionStorage.setItem('analysisResult', JSON.stringify(data))
      router.push(`/resultado/${data.id}`)
    } catch {
      alert('Error analizando. Intenta de nuevo.')
      setAnalyzingImage(false)
    }
  }

  // Iconos SVG holísticos por tipo
  const typeIcons: { [key: string]: JSX.Element } = {
    tarot: (
      // Ojo que todo lo ve — tarot
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
        <circle cx="12" cy="12" r="1" fill="currentColor"/>
      </svg>
    ),
    reiki: (
      // Vela — reiki y energía
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="6" height="12" rx="1"/>
        <path d="M12 9V6"/>
        <path d="M10 6c0-1.5 2-3 2-3s2 1.5 2 3-1 1.5-2 1.5S10 7.5 10 6z" fill="currentColor" opacity="0.3"/>
        <line x1="9" y1="13" x2="15" y2="13" opacity="0.3"/>
        <line x1="9" y1="17" x2="15" y2="17" opacity="0.3"/>
      </svg>
    ),
    holistico: (
      // Planta — holístico y naturaleza
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22V12"/>
        <path d="M12 12C12 7 7 4 4 6c0 4 3 7 8 6"/>
        <path d="M12 12c0-5 5-8 8-6 0 4-3 7-8 6"/>
      </svg>
    ),
    motivacional: (
      // Talisman estrella — motivacional
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9"/>
        <polygon points="12,6 13.5,10.5 18,10.5 14.5,13.5 15.5,18 12,15 8.5,18 9.5,13.5 6,10.5 10.5,10.5"/>
      </svg>
    ),
  }

  return (
    <body className="text-on-surface antialiased min-h-screen flex flex-col relative overflow-x-hidden" style={{ background: 'linear-gradient(135deg, rgba(143, 168, 149, 0.12) 0%, #FFFFFF 50%, rgba(143, 168, 149, 0.1) 100%)', backgroundAttachment: 'fixed' }}>
      <div className="fixed rounded-full blur-[100px] z-[-1] opacity-[0.04] bg-[#9BA88F]" style={{ width: '384px', height: '384px', top: '10%', left: '5%' }}></div>

      <header className="fixed top-0 left-0 w-full z-50 flex justify-center bg-[rgba(251,249,248,0.8)] backdrop-blur-md border-b border-[#d0c4bb]">
        <div className="w-full max-w-[1200px] flex justify-between items-center px-[20px] md:px-[40px] py-4">
          <span className="font-semibold text-[17px] text-[#695c4f]">Sibila 26</span>
          <a href="/dashboard" className="text-[15px] font-medium text-[#4d453e] hover:text-[#695c4f]">← Dashboard</a>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center pt-24 pb-[40px] px-[20px] md:px-[40px] w-full z-10 relative">
        <div className="w-full max-w-[800px] flex flex-col gap-6">

          <div className="text-center">
            <h1 className="font-semibold text-[28px] text-[#1b1c1c] mb-2">Generador de Contenido</h1>
            <p className="text-[15px] text-[#4d453e]">Captions, ideas y hashtags virales · o analiza tu imagen directamente</p>
          </div>

          {/* SUBIR IMAGEN PARA ANÁLISIS */}
          <div className="bg-white border-2 border-dashed border-[#9BA88F50] rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[#9BA88F]"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="1" fill="currentColor"/></svg></span>
              <div>
                <h2 className="font-semibold text-[15px] text-[#1b1c1c]">Analizar imagen con IA</h2>
                <p className="text-[12px] text-[#9BA88F]">Sube una imagen y Claude Vision la analiza antes de publicar</p>
              </div>
            </div>

            <div className="relative">
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${uploadFile ? 'border-[#9BA88F] bg-[#9BA88F10]' : 'border-[#E5E5EA] bg-[#f6f3f2]'}`}>
                <span className="text-[#9BA88F]">
                  {uploadFile
                    ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><polygon points="12,3 19,8 19,16 12,21 5,16 5,8"/><line x1="12" y1="3" x2="12" y2="21" opacity="0.3"/><line x1="5" y1="8" x2="19" y2="16" opacity="0.3"/><line x1="19" y1="8" x2="5" y2="16" opacity="0.3"/></svg>
                    : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
                  }
                </span>
                <div className="flex-1">
                  <p className="text-[14px] text-[#4d453e] font-medium">
                    {uploadFileName || 'Haz click para subir imagen'}
                  </p>
                  <p className="text-[12px] text-[#9BA88F]">JPG, PNG, WEBP · Máx 10MB</p>
                </div>
              </div>
            </div>

            {uploadFile && (
              <button
                onClick={analyzeUploadedImage}
                disabled={analyzingImage}
                className="w-full mt-3 bg-[#9BA88F] disabled:opacity-50 text-white font-semibold text-[15px] py-3 rounded-lg hover:brightness-105 transition-all flex justify-center items-center gap-2"
              >
                {analyzingImage
                  ? <><svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="12" cy="12" r="2.5"/><ellipse cx="12" cy="6.5" rx="2" ry="3" transform="rotate(0 12 12)"/><ellipse cx="12" cy="6.5" rx="2" ry="3" transform="rotate(120 12 12)"/><ellipse cx="12" cy="6.5" rx="2" ry="3" transform="rotate(240 12 12)"/></svg> Analizando...</>
                  : <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="1" fill="currentColor"/></svg> Analizar esta imagen</>
                }
              </button>
            )}
          </div>

          {/* DIVISOR */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-[1px] bg-[#E5E5EA]"></div>
            <span className="text-[13px] text-[#9BA88F] font-medium">o genera contenido por tipo</span>
            <div className="flex-1 h-[1px] bg-[#E5E5EA]"></div>
          </div>

          {/* Selector de tipo */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {([
              { id: 'tarot' as ContentType, label: 'Tarot' },
              { id: 'reiki' as ContentType, label: 'Reiki' },
              { id: 'holistico' as ContentType, label: 'Holístico' },
              { id: 'motivacional' as ContentType, label: 'Motivacional' }
            ]).map((type) => (
              <button
                key={type.id}
                onClick={() => { setSelectedType(type.id); setSelectedIdeas([]); setGeneratedCaption('') }}
                className={`p-4 border rounded-lg text-center transition-all ${selectedType === type.id ? 'border-[#9BA88F] bg-[#9BA88F15]' : 'border-[#E5E5EA] hover:bg-[#f6f3f2]'}`}
              >
                <div className="mb-2 text-[#9BA88F] flex justify-center">{typeIcons[type.id]}</div>
                <div className="font-semibold text-[14px] text-[#1b1c1c]">{type.label}</div>
              </button>
            ))}
          </div>

          {data && (
            <>
              {/* Captions */}
              <div className="bg-white border border-[#E5E5EA] rounded-xl p-6">
                <h2 className="font-semibold text-[17px] text-[#1b1c1c] mb-4">📝 Captions</h2>
                <div className="space-y-3">
                  {data.captions.map((caption, idx) => (
                    <div key={idx} className="p-4 bg-[#f6f3f2] rounded-lg flex justify-between items-start gap-4">
                      <p className="text-[14px] text-[#4d453e] leading-[22px] flex-1">{caption}</p>
                      <button onClick={() => copy(caption, `c${idx}`)} className="text-[12px] text-[#9BA88F] shrink-0">
                        {copied === `c${idx}` ? '✅' : '📋'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ideas seleccionables */}
              <div className="bg-white border border-[#E5E5EA] rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-[17px] text-[#1b1c1c]">💡 Ideas</h2>
                  <span className="text-[12px] text-[#9BA88F]">Selecciona → Genera caption</span>
                </div>
                <div className="space-y-2">
                  {data.ideas.map((idea, idx) => (
                    <div
                      key={idx}
                      onClick={() => toggleIdea(idea)}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${selectedIdeas.includes(idea) ? 'bg-[#9BA88F15] border border-[#9BA88F]' : 'hover:bg-[#f6f3f2] border border-transparent'}`}
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${selectedIdeas.includes(idea) ? 'bg-[#9BA88F] border-[#9BA88F]' : 'border-[#E5E5EA]'}`}>
                        {selectedIdeas.includes(idea) && <span className="text-white text-[10px]">✓</span>}
                      </div>
                      <p className="text-[14px] text-[#4d453e]">{idea}</p>
                    </div>
                  ))}
                </div>

                {selectedIdeas.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-[#E5E5EA]">
                    <button
                      onClick={generateFromIdeas}
                      disabled={generatingCaption}
                      className="w-full bg-[#9BA88F] disabled:opacity-50 text-white font-semibold text-[15px] py-3 rounded-lg hover:brightness-105 transition-all"
                    >
                      {generatingCaption ? '✨ Generando...' : `✨ Generar caption (${selectedIdeas.length} idea${selectedIdeas.length > 1 ? 's' : ''} seleccionada${selectedIdeas.length > 1 ? 's' : ''})`}
                    </button>
                  </div>
                )}

                {generatedCaption && (
                  <div className="mt-4 p-4 bg-[#9BA88F10] border border-[#9BA88F] rounded-lg">
                    <p className="text-[12px] text-[#9BA88F] font-medium mb-2">Caption generado por IA:</p>
                    <p className="text-[14px] text-[#4d453e] leading-[22px] mb-3">{generatedCaption}</p>
                    <button onClick={() => copy(generatedCaption, 'gen')} className="text-[12px] font-medium text-[#9BA88F]">
                      {copied === 'gen' ? '✅ Copiado' : '📋 Copiar'}
                    </button>
                  </div>
                )}
              </div>

              {/* Hashtags */}
              <div className="bg-white border border-[#E5E5EA] rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold text-[17px] text-[#1b1c1c]">🏷️ Hashtags</h2>
                  <span className="text-[12px] text-[#9BA88F] bg-[#9BA88F15] px-2 py-1 rounded-full">5 virales investigados</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {data.hashtags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-[#f6f3f2] border border-[#E5E5EA] rounded-full text-[13px] text-[#695c4f] font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                <button onClick={() => copy(data.hashtags.join(' '), 'tags')} className="text-[13px] font-medium text-[#9BA88F]">
                  {copied === 'tags' ? '✅ Copiados' : '📋 Copiar los 5 hashtags'}
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </body>
  )
}
