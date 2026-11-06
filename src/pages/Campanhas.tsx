import { useMemo, useState } from 'react'

import { SeloDadoDemo } from '@/components/estados/SeloDadoDemo'
import { Vazio } from '@/components/estados/Vazio'
import { CAMPANHAS_DEMO } from '@/data/campanhas.mock'
import { useTituloPagina } from '@/hooks/useTituloPagina'
import { ROTULO_PUBLICO, type PublicoAlvo } from '@/types/campanha'

export function Campanhas() {
  useTituloPagina('Temas de prevenção')

  const [publico, setPublico] = useState<PublicoAlvo | 'todos'>('todos')

  const campanhas = useMemo(
    () => CAMPANHAS_DEMO.filter((c) => publico === 'todos' || c.publico === publico),
    [publico],
  )

  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <h1 className="font-heading text-3xl font-bold text-tinta md:text-4xl">
        Temas de prevenção
      </h1>
      <p className="mt-4 max-w-prose text-tinta-suave">
        Assuntos de saúde preventiva e o que fazer sobre cada um. Em todos os casos, a orientação
        é procurar a equipe da unidade de saúde.
      </p>

      <div className="mt-6 max-w-prose">
        <SeloDadoDemo origem="demonstrativo" />
        <p className="mt-3 text-sm text-tinta-suave">
          Estes são <strong className="text-tinta">temas</strong>, não campanhas em andamento.
          Não há período, meta nem órgão responsável associado — informar isso sem fonte oficial
          seria inventar dado de saúde pública.
        </p>
      </div>

      <div className="mt-8 max-w-sm">
        <label htmlFor="filtro-publico" className="font-medium text-tinta">
          Filtrar por público
        </label>
        <select
          id="filtro-publico"
          className="mt-1 w-full rounded-sm border-2 border-input bg-papel px-3 py-2 text-tinta"
          value={publico}
          onChange={(e) => setPublico(e.target.value as PublicoAlvo | 'todos')}
        >
          <option value="todos">Todos os públicos</option>
          {Object.entries(ROTULO_PUBLICO).map(([valor, rotulo]) => (
            <option key={valor} value={valor}>
              {rotulo}
            </option>
          ))}
        </select>
        <output aria-live="polite" className="mt-3 block font-medium text-tinta">
          {campanhas.length === 0
            ? 'Nenhum tema para esse público'
            : `${campanhas.length} ${campanhas.length === 1 ? 'tema' : 'temas'}`}
        </output>
      </div>

      <section aria-label="Temas" className="mt-8">
        {campanhas.length === 0 ? (
          <Vazio
            titulo="Nenhum tema para esse público"
            orientacao="Escolha outro público ou veja todos os temas disponíveis."
            acao={
              <button
                type="button"
                onClick={() => setPublico('todos')}
                className="rounded-sm bg-verde-posto px-5 py-3 font-semibold text-papel"
              >
                Ver todos os temas
              </button>
            }
          />
        ) : (
          <ul className="grid gap-8 md:grid-cols-2">
            {campanhas.map((campanha) => (
              <li key={campanha.id} className="border-t-4 border-amarelo-campanha bg-papel-2 p-6">
                <p className="text-sm font-semibold text-verde-posto">
                  {ROTULO_PUBLICO[campanha.publico]}
                </p>
                <h2 className="mt-1 font-heading text-xl font-bold text-tinta">{campanha.tema}</h2>
                <p className="mt-2 font-medium text-tinta">{campanha.resumo}</p>
                <p className="mt-3 text-tinta-suave">{campanha.porQueImporta}</p>

                <h3 className="mt-5 font-heading font-semibold text-tinta">O que fazer</h3>
                <ul className="mt-2 space-y-2">
                  {campanha.oQueFazer.map((acao) => (
                    <li key={acao} className="flex gap-2 text-tinta-suave">
                      <span aria-hidden="true" className="text-verde-posto">
                        •
                      </span>
                      {acao}
                    </li>
                  ))}
                </ul>

                <p className="mt-5 border-t border-border pt-3 text-sm">
                  <strong className="text-tinta">Onde procurar:</strong>{' '}
                  <span className="text-tinta-suave">{campanha.ondeProcurar}</span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
