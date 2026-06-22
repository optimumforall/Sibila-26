import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('Supabase URL and Service Role Key are required')
  }
  return createClient(url, key)
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // AUTH DESHABILITADA TEMPORALMENTE PARA TESTING
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(params.id)) {
    return NextResponse.json({ error: 'ID no válido' }, { status: 400 })
  }

  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Análisis no encontrado' }, { status: 404 })
  }

  return NextResponse.json(data)
}
