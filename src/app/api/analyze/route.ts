import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function getAnthropic() {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('Anthropic API key is required')
  }
  return new Anthropic({ apiKey })
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('Supabase URL and Service Role Key are required')
  }
  return createClient(url, key)
}

const ANALYSIS_PROMPT = `Analiza esta imagen para Instagram de Sibila 26 (tarot, reiki, holístico). Público: mujeres 35-60 años.

Responde SOLO con estas 8 líneas exactas, sin emojis, sin asteriscos, sin markdown:

Colores: [describe exactamente los colores que ves]
Luz: [describe la iluminación real]
Composicion: [describe el encuadre y elemento principal]
Publico: [a quién le habla y qué emoción transmite]
Funciona: [lo mejor concreto de esta imagen]
Mejorar: [una cosa concreta a cambiar]
Caption: [caption de 2-3 líneas basado en lo que ves, tono cálido y holístico, sin hashtags]
Veredicto: [escribe SOLO una de estas tres palabras: APROBADO, CAMBIOS o NO_PUBLICAR]
Puntuacion: [escribe SOLO un número del 1 al 10]

Criterios para el veredicto:
- APROBADO: imagen profesional, buena luz, colores coherentes con marca holística, mensaje claro
- CAMBIOS: tiene potencial pero algo falla (luz, encuadre, fondo, mensaje poco claro)
- NO_PUBLICAR: imagen amateur, luz mala, fondo confuso, no comunica profesionalismo

Solo esas 9 líneas. Nada más.`

async function analyzeImage(imageBase64: string, mimeType: string): Promise<{
  analysis: string
  caption: string
  veredicto: string
  puntuacion: number
}> {
  const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  const finalMimeType = validMimeTypes.includes(mimeType) ? mimeType : 'image/jpeg'

  const message = await getAnthropic().messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 600,
    messages: [{
      role: 'user',
      content: [
        { type: 'image', source: { type: 'base64', media_type: finalMimeType as any, data: imageBase64 } },
        { type: 'text', text: ANALYSIS_PROMPT }
      ],
    }]
  })

  const raw = message.content.find(c => c.type === 'text')
  const text = raw && raw.type === 'text' ? raw.text : ''
  const lines = text.split('\n').filter(l => l.trim())

  // Extraer campos específicos
  const get = (key: string) => {
    const line = lines.find(l => l.toLowerCase().startsWith(key.toLowerCase() + ':'))
    return line ? line.replace(/^[^:]+:\s*/i, '').trim() : ''
  }

  const caption = get('Caption')
  const veredictoRaw = get('Veredicto').toUpperCase()
  const puntuacionRaw = parseInt(get('Puntuacion')) || 7

  // Validar veredicto
  const veredicto = ['APROBADO', 'CAMBIOS', 'NO_PUBLICAR'].includes(veredictoRaw)
    ? veredictoRaw
    : 'CAMBIOS'

  // Validar puntuación (1-10)
  const puntuacion = Math.min(10, Math.max(1, puntuacionRaw))

  // Análisis sin caption, veredicto ni puntuación
  const analysis = lines
    .filter(l => !l.toLowerCase().startsWith('caption:') &&
                 !l.toLowerCase().startsWith('veredicto:') &&
                 !l.toLowerCase().startsWith('puntuacion:') &&
                 !l.toLowerCase().startsWith('puntuación:'))
    .join('\n')

  return { analysis, caption, veredicto, puntuacion }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const captionOriginal = formData.get('caption') as string || ''

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const mimeType = file.type || 'image/jpeg'
    if (!mimeType.startsWith('image/')) {
      return NextResponse.json({ error: 'Solo imágenes (JPG, PNG, WEBP)' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')

    const { analysis, caption, veredicto, puntuacion } = await analyzeImage(base64, mimeType)

    const analysisId = randomUUID()

    // Guardar en Supabase
    const { error: dbError } = await getSupabase().from('analyses').insert([{
      id: analysisId,
      file_type: 'image',
      created_at: new Date().toISOString(),
      veredicto,
      puntuacion,
      caption_original: captionOriginal,
      explicacion: analysis,
      caption_sugerido: caption,
      problemas: {}
    }])

    if (dbError) console.error('Supabase error:', dbError.message)

    return NextResponse.json({
      id: analysisId,
      visionAnalysis: analysis,
      captionFromVision: caption,
      veredicto,
      puntuacion,
    }, { status: 200 })

  } catch (error: any) {
    console.error('Error:', error?.message)
    return NextResponse.json({ error: `Error en análisis: ${error?.message}` }, { status: 500 })
  }
}
