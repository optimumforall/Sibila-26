export type Veredicto = 'APROBADO' | 'APROBADO_CON_CAMBIOS' | 'NO_PUBLICAR'

export type FileType = 'video' | 'image'

export interface Problema {
  tipo: 'vocabulario' | 'visual' | 'hashtags' | 'instagram'
  descripcion: string
}

export interface Analysis {
  id: string
  user_id: string
  created_at: string
  file_url: string
  file_type: FileType
  caption_original: string | null
  transcription: string | null
  veredicto: Veredicto
  puntuacion: number
  problemas: Problema[]
  caption_sugerido: string | null
  explicacion: string | null
}

export interface AnalysisResult {
  veredicto: Veredicto
  puntuacion: number
  problemas: Problema[]
  caption_sugerido: string
  explicacion: string
}
