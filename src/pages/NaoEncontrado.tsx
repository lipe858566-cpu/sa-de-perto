import { Link } from 'react-router-dom'

import { ITENS_NAV } from '@/components/layout/itens-nav'
import { useTituloPagina } from '@/hooks/useTituloPagina'

export function NaoEncontrado() {
  useTituloPagina('Página não encontrada')

  return (
    <section className="mx-auto max-w-5xl px-4 py-20">
      <p className="font-heading text-sm font-bold text-verde-posto">Erro 404</p>
      <h1 className="mt-2 font-heading text-3xl font-bold text-tinta md:text-4xl">
        Esta página não existe
      </h1>
      <p className="mt-4 max-w-prose text-tinta-suave">
        O endereço pode ter sido digitado de outra forma ou a página pode ter mudado de lugar.
        Estas são as seções disponíveis:
      </p>
      <ul className="mt-6 space-y-2">
        {ITENS_NAV.map((item) => (
          <li key={item.para}>
            <Link to={item.para} className="font-medium text-azul-cartilha underline">
              {item.rotulo}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
