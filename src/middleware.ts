import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Rutas que requieren login
const PROTECTED = ['/dashboard', '/historial', '/resultado', '/content-generator']

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  if (!PROTECTED.some(p => path.startsWith(p))) {
    return NextResponse.next()
  }

  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Sin sesión → login
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Whitelist: solo el email de Juana (y el tuyo)
  const allowed = (process.env.ALLOWED_EMAIL || '').split(',').map(e => e.trim().toLowerCase())
  if (!allowed.includes((user.email || '').toLowerCase())) {
    return NextResponse.redirect(new URL('/login?error=no-autorizado', request.url))
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/historial/:path*', '/resultado/:path*', '/content-generator/:path*'],
}
