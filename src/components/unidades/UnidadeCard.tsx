import { Clock, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

import { ROTULO_SERVICO, ROTULO_TIPO, type Unidade } from '@/types/unidade'

/** Campo ausente na fonte nunca aparece vazio nem como `undefined` (RF03). */
function Campo({ valor }: { valor: string | null }) {
  if (!valor) return <span className="text-tinta-suave italic">Não informado</span>
  return <>{valor}</>
}

export function UnidadeCard({ unidade }: { unidade: Unidade }) {
  return (
    <article className="border-t-2 border-border bg-papel p-5">
      <p className="text-sm font-semibold text-verde-posto">{ROTULO_TIPO[unidade.tipo]}</p>
      {/* O título é o alvo principal para abrir a unidade, então precisa de
          pelo menos 24 px de altura (WCAG 2.2, 2.5.8). */}
      <h3 className="mt-1 font-heading text-lg font-semibold">
        <Link
          to={`/unidades/${unidade.id}`}
          className="inline-block py-1 text-tinta underline"
        >
          {unidade.nome}
        </Link>
      </h3>

      <p className="mt-3 flex items-start gap-2 text-tinta-suave">
        <MapPin className="mt-1 size-4 shrink-0" aria-hidden="true" />
        <span>
          <Campo valor={unidade.endereco} />
          <br />
          {unidade.bairro ? `${unidade.bairro}, ` : ''}
          {unidade.municipio} — {unidade.uf}
        </span>
      </p>

      <p className="mt-2 flex items-start gap-2 text-tinta-suave">
        <Clock className="mt-1 size-4 shrink-0" aria-hidden="true" />
        <Campo valor={unidade.horario} />
      </p>

      {unidade.servicos.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {unidade.servicos.map((servico) => (
            <li
              key={servico}
              className="rounded-sm bg-verde-claro px-2 py-1 text-sm font-medium text-verde-posto"
            >
              {ROTULO_SERVICO[servico]}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}
