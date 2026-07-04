import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  // DEBUG: verifica que las variables existen
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  console.log('CALLBACK DEBUG:', {
    hasCode: !!code,
    hasUrl: !!url,
    hasKey: !!key,
    urlStart: url?.substring(0, 30),
    keyStart: key?.substring(0, 15),
    next,
  })

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=no-code`)
  }
  if (!url || !key) {
    return NextResponse.redirect(`${origin}/login?error=missing-env`)
  }

  try {
    const cookieStore = cookies()
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    })

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('EXCHANGE ERROR:', error.message)
      return NextResponse.redirect(`${origin}/login?error=exchange-${encodeURIComponent(error.message)}`)
    }
    
    return NextResponse.redirect(`${origin}${next}`)
  } catch (e: any) {
    console.error('CALLBACK EXCEPTION:', e?.message)
    return NextResponse.redirect(`${origin}/login?error=exception-${encodeURIComponent(e?.message || 'unknown')}`)
  }
}
