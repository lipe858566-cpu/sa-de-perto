import { Suspense, lazy, useMemo, useState } from 'react'

import { Carregando } from '@/components/estados/Carregando'
import { Erro } from '@/components/estados/Erro'
import { SeloDadoDemo } from '@/components/estados/SeloDadoDemo'
import { Vazio } from '@/components/estados/Vazio'
import { BuscaUnidades } from '@/components/unidades/BuscaUnidades'
import { UnidadeCard } from '@/components/unidades/UnidadeCard'
import { UnidadeFiltros } from '@/components/unidades/UnidadeFiltros'
import { FILTROS_VAZIOS, temFiltroAtivo, type Filtros } from '@/components/unidades/filtros'
import { UNIDADES_DEMO } from '@/data/unidades.mock'
import { useBuscaUnidades } from '@/hooks/useBuscaUnidades'
import { useTituloPagina } from '@/hooks/useTituloPagina'
import { mensagemDoErro } from '@/services/erros'
import type { Unidade } from '@/types/unidade'

// O mapa pesa; só é carregado quando há o que mostrar (RNF05).
const MapaUnidades = lazy(() =>
  import('@/components/mapa/MapaUnidades').then((m) => ({ default: m.MapaUnidades })),
)

export function Unidades() {
  useTituloPagina('Unidades de saúde')

  const { estado, buscar } = useBuscaUnidades()
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_VAZIOS)
  const [ultimoTermo, setUltimoTermo] = useState('')

  // Antes da primeira busca, a página mostra o conjunto demonstrativo.
  const base: Unidade[] = estado.situacao === 'pronto' ? estado.unidades : UNIDADES_DEMO
  const ehResultadoDeBusca = estado.situacao === 'pronto'

  const municipios = useMemo(
    () => [...new Set(base.map((u) => u.municipio))].sort((a, b) => a.localeCompare(b)),
    [base],
  )

  const unidades = useMemo(
    () =>
      base.filter(
        (u) =>
          (filtros.municipio === 'todos' || u.municipio === filtros.municipio) &&
          (filtros.tipo === 'todos' || u.tipo === filtros.tipo) &&
          (filtros.servico === 'todos' || u.servicos.includes(filtros.servico)),
      ),
    [base, filtros],
  )

  function executarBusca(termo: string) {
    setUltimoTermo(termo)
    setFiltros(FILTROS_VAZIOS)
    void buscar(termo)
  }

  const carregando = estado.situacao === 'carregando'

  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <h1 className="font-heading text-3xl font-bold text-tinta md:text-4xl">Unidades de saúde</h1>
      <p className="mt-4 max-w-prose text-tinta-suave">
        Busque por localidade para ver unidades reais do OpenStreetMap, ou use os filtros no
        conjunto de exemplo.
      </p>

      <div className="mt-8">
        <BuscaUnidades aoBuscar={executarBusca} carregando={carregando} />
      </div>

      {carregando && (
        <Carregando
          mensagem={
            estado.etapa === 'local'
              ? 'Localizando o endereço…'
              : 'Procurando unidades na região…'
          }
        />
      )}

      {estado.situacao === 'erro' && (
        <div className="mt-8">
          <Erro
            {...mensagemDoErro(estado.erro)}
            aoTentarNovamente={ultimoTermo ? () => executarBusca(ultimoTermo) : undefined}
          />
          <p className="mt-4 text-tinta-suave">
            Enquanto isso, o conjunto de exemplo continua disponível abaixo.
          </p>
        </div>
      )}

      {estado.situacao === 'pronto' && (
        <div className="mt-8 max-w-prose">
          <p className="font-medium text-tinta">
            Resultados para <strong>{estado.local}</strong>
          </p>
          <div className="mt-3">
            <SeloDadoDemo origem={estado.usouFallback ? 'demonstrativo' : 'openstreetmap'} />
          </div>
          {estado.usouFallback && (
            <p className="mt-3 text-sm text-tinta-suave">
              O serviço público do OpenStreetMap não respondeu a esta consulta, então a lista
              abaixo é o conjunto de exemplo — não corresponde à região buscada.
            </p>
          )}
        </div>
      )}

      {!ehResultadoDeBusca && estado.situacao !== 'carregando' && (
        <div className="mt-8 max-w-prose">
          <SeloDadoDemo origem="demonstrativo" />
        </div>
      )}

      {unidades.length > 0 && (
        <section aria-labelledby="titulo-mapa" className="mt-10">
          <h2 id="titulo-mapa" className="font-heading text-2xl font-bold text-tinta">
            No mapa
          </h2>
          <p className="mt-2 max-w-prose text-tinta-suave">
            O mapa mostra as mesmas unidades da lista. Se preferir, use a lista — ela tem a
            mesma informação.
          </p>
          <div className="mt-4">
            <Suspense fallback={<Carregando mensagem="Carregando o mapa…" />}>
              <MapaUnidades unidades={unidades} />
            </Suspense>
          </div>
        </section>
      )}

      <div className="mt-10">
        <UnidadeFiltros
          filtros={filtros}
          municipios={municipios}
          aoMudar={setFiltros}
          aoLimpar={() => setFiltros(FILTROS_VAZIOS)}
          temFiltroAtivo={temFiltroAtivo(filtros)}
          totalResultados={unidades.length}
        />
      </div>

      <section aria-label="Lista de unidades" className="mt-8">
        {unidades.length === 0 ? (
          <Vazio
            titulo="Nenhuma unidade com esses filtros"
            orientacao="Tente remover um dos filtros ou buscar por outra localidade."
            acao={
              <button
                type="button"
                onClick={() => setFiltros(FILTROS_VAZIOS)}
                className="rounded-sm bg-verde-posto px-5 py-3 font-semibold text-papel"
              >
                Limpar filtros
              </button>
            }
          />
        ) : (
          <ul className="grid gap-6 md:grid-cols-2">
            {unidades.map((unidade) => (
              <li key={unidade.id}>
                <UnidadeCard unidade={unidade} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
