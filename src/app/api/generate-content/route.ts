import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: NextRequest) {
  try {
    const { type, ideas } = await request.json()

    const typeLabels: { [key: string]: string } = {
      tarot: 'tarot y lectura de cartas',
      reiki: 'reiki y energía',
      holistico: 'terapia holística y bienestar',
      motivacional: 'crecimiento personal y motivación'
    }

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: `Eres copywriter experta en marcas holísticas para Instagram en España.

Escribe UN caption corto (máx 3 líneas) para Instagram sobre: ${ideas.join(', ')}

Contexto: cuenta de ${typeLabels[type] || type}. Público: mujeres 40-60 años. Tono: cálido, auténtico, sin clichés esotéricos baratos.

Reglas:
- Máximo 3 líneas
- 1-2 emojis máximo
- Sin hashtags (van aparte)
- Sin "garantizo", "predigo" ni promesas
- Termina con pregunta o llamada suave a la acción

Solo escribe el caption, nada más.`
      }]
    })

    const caption = message.content[0].type === 'text' ? message.content[0].text.trim() : ''
    return NextResponse.json({ caption }, { status: 200 })

  } catch (error: any) {
    console.error('Error generating content:', error?.message)
    return NextResponse.json({ error: 'Error generando contenido' }, { status: 500 })
  }
}
