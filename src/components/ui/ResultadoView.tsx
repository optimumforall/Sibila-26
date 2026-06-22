'use client'

import { Analysis } from '@/types'
import { useState } from 'react'
import Link from 'next/link'

const VEREDICTO_CONFIG = {
  APROBADO: {
    bg: 'bg-aprobado',
    icon: '✅',
    text: 'APROBADO',
    label: '¡Todo perfecto! Tu contenido está listo para publicar.'
  },
  APROBADO_CON_CAMBIOS: {
    bg: 'bg-cambios',
    icon: '⚠️',
    text: 'APROBADO CON CAMBIOS',
    label: 'Revisa los cambios sugeridos antes de publicar.'
  },
  NO_PUBLICAR: {
    bg: 'bg-no-publicar',
    icon: '❌',
    text: 'NO PUBLICAR',
    label: 'Este contenido necesita cambios importantes antes de publicarse.'
  }
}

export default function ResultadoView({ analysis, showBack }: { analysis: Analysis; showBack?: boolean }) {
  const [copied, setCopied] = useState(false)
  const config = VEREDICTO_CONFIG[analysis.veredicto]

  function copyCaption() {
    if (!analysis.caption_sugerido) return
    navigator.clipboard.writeText(analysis.caption_sugerido)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const fecha = new Date(analysis.created_at).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'long', year: 'numeric'
  })

  return (
    <div className="space-y-6">

      {/* Fecha (solo en historial) */}
      {showBack && (
        <p className="text-center text-sm text-light-text">{fecha}</p>
      )}

      {/* Banner veredicto */}
      <div className={`${config.bg} rounded-2xl p-6 text-white text-center space-y-2`}>
        <div className="text-4xl">{config.icon}</div>
        <h2 className="font-serif text-3xl font-bold">{config.text}</h2>
        <p className="text-white/80 text-sm">{config.label}</p>
      </div>

      {/* Puntuación */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-4 border-ocre">
          <span className="font-serif text-2xl font-bold text-ocre">{analysis.puntuacion}/10</span>
        </div>
      </div>

      {/* Problemas */}
      {analysis.problemas.length > 0 && (
        <div className="card border-l-4 border-l-no-publicar space-y-3">
          <h3 className="font-semibold text-dark-text">Problemas detectados</h3>
          <ul className="space-y-2">
            {analysis.problemas.map((p, i) => (
              <li key={i} className="flex gap-2 text-sm text-dark-text">
                <span>⚠️</span>
                <span><strong className="capitalize">{p.tipo}:</strong> {p.descripcion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Explicación */}
      {analysis.explicacion && (
        <div className="card flex gap-3">
          <span className="text-xl">💬</span>
          <p className="text-sm text-dark-text leading-relaxed">{analysis.explicacion}</p>
        </div>
      )}

      {/* Caption sugerido */}
      {analysis.caption_sugerido && (
        <div className="card space-y-3">
          <h3 className="font-semibold text-dark-text">Caption listo para copiar</h3>
          <p className="text-sm text-dark-text leading-relaxed whitespace-pre-wrap bg-crema rounded-xl p-4">
            {analysis.caption_sugerido}
          </p>
          <button
            onClick={copyCaption}
            className={`btn-primary text-sm py-2 px-4 ${copied ? 'bg-aprobado' : ''}`}
          >
            {copied ? '¡Copiado! ✓' : '📋 Copiar caption'}
          </button>
        </div>
      )}

      {/* Acciones */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/dashboard" className="btn-primary flex-1 text-center text-sm py-3">
          Analizar otro contenido
        </Link>
        {!showBack ? (
          <Link href="/historial" className="btn-secondary flex-1 text-center text-sm py-3">
            Ver mis análisis
          </Link>
        ) : (
          <Link href="/historial" className="btn-secondary flex-1 text-center text-sm py-3">
            ← Volver al historial
          </Link>
        )}
      </div>

    </div>
  )
}
