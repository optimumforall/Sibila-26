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

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('analyses')
      .select('id, file_type, created_at, veredicto, puntuacion')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error

    return NextResponse.json(data || [], { status: 200 })
  } catch (error: any) {
    console.error('Error fetching analyses:', error?.message)
    return NextResponse.json([], { status: 200 })
  }
}
