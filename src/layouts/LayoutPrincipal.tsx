import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

import { Carregando } from '@/components/estados/Carregando'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { SkipLink } from '@/components/layout/SkipLink'

/** Casca comum a todas as rotas: marcos semânticos header / main / footer. */
export function LayoutPrincipal() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SkipLink />
      <Header />
      <main id="conteudo" tabIndex={-1} className="flex-1">
        {/* As rotas são carregadas sob demanda; este é o estado de espera. */}
        <Suspense fallback={<Carregando mensagem="Carregando a página…" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
