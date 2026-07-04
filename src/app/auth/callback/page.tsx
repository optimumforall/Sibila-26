'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) router.replace('/dashboard')
    })
    setTimeout(async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) router.replace('/dashboard')
      else router.replace('/login?error=sin-sesion')
    }, 2000)
  }, [router])
  return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#fbf9f8'}}>Verificando acceso...</div>
}
