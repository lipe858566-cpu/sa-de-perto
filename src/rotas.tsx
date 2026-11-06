import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

import { ErroDeRota } from '@/components/estados/ErroDeRota'
import { ProtecaoDeRota } from '@/components/ProtecaoDeRota'
import { LayoutPrincipal } from '@/layouts/LayoutPrincipal'
import { Inicio } from '@/pages/Inicio'

const Login = lazy(() => import('@/pages/Login').then(({ Login }) => ({ default: Login })))
const Unidades = lazy(() => import('@/pages/Unidades').then(({ Unidades }) => ({ default: Unidades })))
const UnidadeDetalhe = lazy(() =>
  import('@/pages/UnidadeDetalhe').then(({ UnidadeDetalhe }) => ({ default: UnidadeDetalhe })),
)
const Campanhas = lazy(() => import('@/pages/Campanhas').then(({ Campanhas }) => ({ default: Campanhas })))
const PrimeirosSocorros = lazy(() =>
  import('@/pages/PrimeirosSocorros').then(({ PrimeirosSocorros }) => ({ default: PrimeirosSocorros })),
)
const SaudeMental = lazy(() =>
  import('@/pages/SaudeMental').then(({ SaudeMental }) => ({ default: SaudeMental })),
)
const Agendamento = lazy(() =>
  import('@/pages/Agendamento').then(({ Agendamento }) => ({ default: Agendamento })),
)
const MinhasSolicitacoes = lazy(() =>
  import('@/pages/MinhasSolicitacoes').then(({ MinhasSolicitacoes }) => ({ default: MinhasSolicitacoes })),
)
const Sobre = lazy(() => import('@/pages/Sobre').then(({ Sobre }) => ({ default: Sobre })))
const Privacidade = lazy(() =>
  import('@/pages/Privacidade').then(({ Privacidade }) => ({ default: Privacidade })),
)
const Acessibilidade = lazy(() =>
  import('@/pages/Acessibilidade').then(({ Acessibilidade }) => ({ default: Acessibilidade })),
)
const NaoEncontrado = lazy(() =>
  import('@/pages/NaoEncontrado').then(({ NaoEncontrado }) => ({ default: NaoEncontrado })),
)

export const rotas: RouteObject[] = [
  {
    path: '/',
    element: <LayoutPrincipal />,
    children: [
      {
        errorElement: <ErroDeRota />,
        children: [
          { path: 'login', element: <Login /> },
          { path: 'privacidade', element: <Privacidade /> },
          {
            element: <ProtecaoDeRota />,
            children: [
              { index: true, element: <Inicio /> },
              { path: 'unidades', element: <Unidades /> },
              { path: 'unidades/:id', element: <UnidadeDetalhe /> },
              { path: 'campanhas', element: <Campanhas /> },
              { path: 'primeiros-socorros', element: <PrimeirosSocorros /> },
              { path: 'saude-mental', element: <SaudeMental /> },
              { path: 'agendamento', element: <Agendamento /> },
              { path: 'minhas-solicitacoes', element: <MinhasSolicitacoes /> },
              { path: 'sobre', element: <Sobre /> },
              { path: 'acessibilidade', element: <Acessibilidade /> },
              { path: '*', element: <NaoEncontrado /> },
            ],
          },
        ],
      },
    ],
  },
]
