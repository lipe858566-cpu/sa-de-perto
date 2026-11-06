import { ArrowLeft, Clock, MapPin, Phone } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { SeloDadoDemo } from '@/components/estados/SeloDadoDemo'
import { Vazio } from '@/components/estados/Vazio'
import { useTituloPagina } from '@/hooks/useTituloPagina'
import { unidadePorId } from '@/services/unidades'
import { ROTULO_SERVICO, ROTULO_TIPO } from '@/types/unidade'

function Linha({
  icone: Icone,
  rotulo,
  valor,
}: {
  icone: typeof MapPin
  rotulo: string
  valor: string | null
}) {
  return (
    <div className="flex items-start gap-3 border-b border-border py-4">
      <Icone className="mt-1 size-5 shrink-0 text-verde-posto" aria-hidden="true" />
      <div>
        <p className="font-semibold text-tinta">{rotulo}</p>
        <p className="text-tinta-suave">
          {valor ?? <span className="italic">Não informado</span>}
        </p>
      </div>
    </div>
  )
}

export function UnidadeDetalhe() {
  const { id } = useParams()
  const unidade = id ? unidadePorId(id) : undefined

  useTituloPagina(unidade ? unidade.nome : 'Unidade não encontrada')

  if (!unidade) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-14">
        <h1 className="font-heading text-3xl font-bold text-tinta">Unidade não encontrada</h1>
        <div className="mt-8">
          <Vazio
            titulo="Esta unidade não está na lista"
            orientacao="O endereço pode estar incorreto. Resultados de busca ficam disponíveis apenas enquanto a página não é recarregada — se você recarregou, faça a busca de novo."
            acao={
              <Link
                to="/unidades"
                className="inline-block rounded-sm bg-verde-posto px-5 py-3 font-semibold text-papel"
              >
                Ver todas as unidades
              </Link>
            }
          />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <p>
        <Link
          to="/unidades"
          className="inline-flex items-center gap-2 font-medium text-azul-cartilha underline"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Voltar para a lista
        </Link>
      </p>

      <p className="mt-8 font-semibold text-verde-posto">{ROTULO_TIPO[unidade.tipo]}</p>
      <h1 className="mt-1 font-heading text-3xl font-bold text-tinta md:text-4xl">
        {unidade.nome}
      </h1>

      <div className="mt-6">
        <SeloDadoDemo origem={unidade.origem} />
      </div>

      <div className="mt-8">
        {/* Endereço e bairro são campos distintos: mostrar o bairro sob o
            rótulo "Endereço" quando o endereço falta seria enganoso. */}
        <Linha icone={MapPin} rotulo="Endereço" valor={unidade.endereco} />
        <Linha icone={MapPin} rotulo="Bairro" valor={unidade.bairro} />
        <Linha icone={MapPin} rotulo="Município" valor={`${unidade.municipio} — ${unidade.uf}`} />
        <Linha icone={Clock} rotulo="Horário de funcionamento" valor={unidade.horario} />
        <Linha icone={Phone} rotulo="Telefone" valor={unidade.telefone} />
      </div>

      <section aria-labelledby="titulo-servicos" className="mt-10">
        <h2 id="titulo-servicos" className="font-heading text-xl font-bold text-tinta">
          Serviços
        </h2>
        {unidade.servicos.length === 0 ? (
          <p className="mt-3 text-tinta-suave italic">Não informado</p>
        ) : (
          <ul className="mt-4 flex flex-wrap gap-2">
            {unidade.servicos.map((servico) => (
              <li
                key={servico}
                className="rounded-sm bg-verde-claro px-3 py-2 font-medium text-verde-posto"
              >
                {ROTULO_SERVICO[servico]}
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="mt-10 border-t-2 border-border pt-6 text-sm text-tinta-suave">
        O mapa com a localização desta unidade entra na Fase 5 do projeto.
      </p>
    </div>
  )
}
