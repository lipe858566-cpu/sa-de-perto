import { ROTULO_SERVICO, ROTULO_TIPO } from '@/types/unidade'

import type { Filtros } from './filtros'

type Props = {
  filtros: Filtros
  municipios: string[]
  aoMudar: (filtros: Filtros) => void
  aoLimpar: () => void
  temFiltroAtivo: boolean
  totalResultados: number
}

const CLASSE_SELECT =
  'mt-1 w-full rounded-sm border-2 border-input bg-papel px-3 py-2 text-tinta'

export function UnidadeFiltros({
  filtros,
  municipios,
  aoMudar,
  aoLimpar,
  temFiltroAtivo,
  totalResultados,
}: Props) {
  return (
    <section aria-labelledby="titulo-filtros" className="border-2 border-border bg-papel-2 p-5">
      <h2 id="titulo-filtros" className="font-heading text-lg font-semibold text-tinta">
        Filtrar unidades
      </h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="filtro-municipio" className="font-medium text-tinta">
            Município
          </label>
          <select
            id="filtro-municipio"
            className={CLASSE_SELECT}
            value={filtros.municipio}
            onChange={(e) => aoMudar({ ...filtros, municipio: e.target.value })}
          >
            <option value="todos">Todos os municípios</option>
            {municipios.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filtro-tipo" className="font-medium text-tinta">
            Tipo de unidade
          </label>
          <select
            id="filtro-tipo"
            className={CLASSE_SELECT}
            value={filtros.tipo}
            onChange={(e) => aoMudar({ ...filtros, tipo: e.target.value as Filtros['tipo'] })}
          >
            <option value="todos">Todos os tipos</option>
            {Object.entries(ROTULO_TIPO).map(([valor, rotulo]) => (
              <option key={valor} value={valor}>
                {rotulo}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filtro-servico" className="font-medium text-tinta">
            Serviço
          </label>
          <select
            id="filtro-servico"
            className={CLASSE_SELECT}
            value={filtros.servico}
            onChange={(e) => aoMudar({ ...filtros, servico: e.target.value as Filtros['servico'] })}
          >
            <option value="todos">Todos os serviços</option>
            {Object.entries(ROTULO_SERVICO).map(([valor, rotulo]) => (
              <option key={valor} value={valor}>
                {rotulo}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        {/* A contagem é anunciada a leitores de tela quando os filtros mudam. */}
        <output aria-live="polite" className="font-medium text-tinta">
          {totalResultados === 0
            ? 'Nenhuma unidade encontrada'
            : `${totalResultados} ${totalResultados === 1 ? 'unidade encontrada' : 'unidades encontradas'}`}
        </output>

        {temFiltroAtivo && (
          <button
            type="button"
            onClick={aoLimpar}
            className="rounded-sm border-2 border-verde-posto px-4 py-2 font-medium text-verde-posto"
          >
            Limpar filtros
          </button>
        )}
      </div>
    </section>
  )
}
