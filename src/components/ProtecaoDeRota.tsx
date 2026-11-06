import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

type Estado = 'carregando' | 'autenticado' | 'visitante'

export function ProtecaoDeRota() {
  const [estado, setEstado] = useState<Estado>('carregando')
  const localizacao = useLocation()

  useEffect(() => {
    if (!supabase) {
      setEstado('visitante')
      return
    }

    let ativo = true
    const atualizar = (sessao: Session | null) => {
      if (ativo) setEstado(sessao ? 'autenticado' : 'visitante')
    }

    supabase.auth.getSession()
      .then(({ data }) => atualizar(data.session))
      .catch(() => atualizar(null))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_evento, sessao) => {
      atualizar(sessao)
    })

    return () => {
      ativo = false
      subscription.unsubscribe()
    }
  }, [])

  if (estado === 'carregando') {
    return <div className="flex min-h-[50vh] items-center justify-center" role="status">Verificando seu acesso...</div>
  }

  if (estado === 'visitante') {
    return <Navigate to="/login" replace state={{ destino: localizacao.pathname + localizacao.search }} />
  }

  return <Outlet />
}
