'use client'

import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Header() {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="sticky top-0 z-10 bg-crema/90 backdrop-blur-sm border-b border-crema/50 px-4 py-3">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <Link href="/dashboard" className="font-serif text-xl font-bold text-dark-text tracking-widest hover:text-ocre transition-colors">
          SIBILA 26
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/historial" className="text-sm text-light-text hover:text-ocre transition-colors">
            Mis análisis
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm text-light-text hover:text-dark-text transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  )
}
