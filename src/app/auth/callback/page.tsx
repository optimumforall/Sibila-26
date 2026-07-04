'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [msg, setMsg] = useState('Verificando acceso...')

  useEffect(() => {
    const run = async () => {
      const supabase = createClient()
      const code = new URLSearchParams(window.location.search).get('code')

      if (!code) {
        router.replace('/login?error=no-code')
        return
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) {
        router.replace(`/login?error=${encodeURIComponent(error.message)}`)
        return
      }

      setMsg('Acceso correcto. Entrando...')
      router.replace('/dashboard')
    }
    run()
  }, [router])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fbf9f8', fontFamily: 'sans-serif', color: '#4d453e' }}>
      {msg}
    </div>
  )
}
