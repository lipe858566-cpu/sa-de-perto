import { useEffect, useState } from 'react'
import { HeartPulse } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { supabase } from '@/lib/supabase'
import { Nav } from './Nav'

export function Header() {
  const navegar = useNavigate()
  const { pathname } = useLocation()
  const [autenticado, setAutenticado] = useState(false)
  const [saindo, setSaindo] = useState(false)

  useEffect(() => {
    if (!supabase) return

    let ativo = true

    supabase.auth.getSession().then(({ data }) => {
      if (ativo) setAutenticado(Boolean(data.session))
    }).catch(() => { if (ativo) setAutenticado(false) })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_evento, sessao) => {
      if (ativo) setAutenticado(Boolean(sessao))
    })

    return () => {
      ativo = false
      subscription.unsubscribe()
    }
  }, [])

  async function sair() {
    if (!supabase || saindo) return

    setSaindo(true)
    const { error } = await supabase.auth.signOut()
    setSaindo(false)

    if (!error) navegar('/login', { replace: true })
  }

  return (
    <header className="faixa-escura bg-verde-posto text-papel">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <Link to="/" className="flex items-center gap-2 text-papel">
          <HeartPulse className="size-7 shrink-0" aria-hidden="true" />
          <span className="font-heading text-xl font-bold tracking-tight">Saúde Perto</span>
        </Link>
        {pathname !== '/login' && (
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            {autenticado ? (
              <>
                <Nav />
                <button
                  type="button"
                  onClick={sair}
                  disabled={saindo}
                  className="inline-flex min-h-10 items-center justify-center border-2 border-papel px-4 py-2 text-sm font-semibold text-papel hover:bg-papel hover:text-verde-posto disabled:opacity-60"
                >
                  {saindo ? 'Saindo...' : 'Sair'}
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="inline-flex min-h-10 items-center justify-center border-2 border-papel px-4 py-2 text-sm font-semibold text-papel hover:bg-papel hover:text-verde-posto"
              >
                Entrar
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
