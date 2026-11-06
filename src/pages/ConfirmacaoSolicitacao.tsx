import { useEffect, useRef } from 'react'
import { CircleCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

import { ROTULO_ATENDIMENTO } from '@/schemas/agendamento'
import type { Solicitacao } from '@/types/solicitacao'

function formataData(iso: string): string {
  const [ano, mes, dia] = iso.split('-')
  return dia && mes && ano ? `${dia}/${mes}/${ano}` : iso
}

/**
 * Retorno após o envio (RF12).
 *
 * **Nunca** usa "consulta confirmada", "agendamento realizado" ou equivalente.
 * A primeira coisa dita é que nada foi agendado. O protocolo é rotulado como
 * simulado em toda menção.
 */
export function ConfirmacaoSolicitacao({
  solicitacao,
  aoNovaSolicitacao,
}: {
  solicitacao: Solicitacao
  aoNovaSolicitacao: () => void
}) {
  const tituloRef = useRef<HTMLHeadingElement>(null)

  // Move o foco para o título: sem isso, quem usa leitor de tela não percebe
  // que a tela mudou depois do envio.
  useEffect(() => {
    tituloRef.current?.focus()
  }, [])

  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      {/* <output> já tem role="status": a mudança é anunciada sem o atributo. */}
      <output className="block">
        <p className="flex items-center gap-3 font-semibold text-verde-posto">
          <CircleCheck className="size-6 shrink-0" aria-hidden="true" />
          Solicitação de demonstração registrada nesta sessão
        </p>
        <h1
          ref={tituloRef}
          tabIndex={-1}
          className="mt-3 font-heading text-3xl font-bold text-tinta md:text-4xl"
        >
          Nenhuma consulta foi agendada
        </h1>
      </output>

      <div className="mt-6 border-l-8 border-vermelho-urgencia bg-papel-2 p-5">
        <p className="text-tinta">
          Este é um projeto acadêmico sem servidor. Os dados que você digitou{' '}
          <strong>não foram enviados a nenhuma unidade de saúde</strong> e ninguém vai entrar em
          contato. Para marcar atendimento de verdade, procure a unidade diretamente.
        </p>
      </div>

      <section aria-labelledby="titulo-resumo" className="mt-10">
        <h2 id="titulo-resumo" className="font-heading text-xl font-bold text-tinta">
          O que você preencheu
        </h2>

        <dl className="mt-4">
          {[
            ['Protocolo simulado', solicitacao.protocolo],
            ['Nome', solicitacao.nome],
            ['Contato', solicitacao.contato],
            ['Unidade', solicitacao.unidadeNome],
            ['Atendimento', ROTULO_ATENDIMENTO[solicitacao.tipoAtendimento]],
            ['Data de preferência', formataData(solicitacao.dataPreferida)],
            ['Período', solicitacao.periodo === 'manha' ? 'Manhã' : 'Tarde'],
            ...(solicitacao.observacao ? [['Observação', solicitacao.observacao]] : []),
          ].map(([rotulo, valor]) => (
            <div key={rotulo} className="flex flex-col border-b border-border py-3 sm:flex-row">
              <dt className="font-semibold text-tinta sm:w-56">{rotulo}</dt>
              <dd className="text-tinta-suave sm:flex-1">{valor}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-4 text-sm text-tinta-suave">
          O número de protocolo é gerado pelo navegador para demonstrar a interface. Ele não
          existe em nenhum sistema de saúde e não serve para consultar nada.
        </p>
      </section>

      <div className="mt-10 flex flex-wrap gap-4 border-t-2 border-border pt-6">
        <Link
          to="/minhas-solicitacoes"
          className="rounded-sm bg-verde-posto px-6 py-4 font-semibold text-papel"
        >
          Ver minhas solicitações
        </Link>
        <button
          type="button"
          onClick={aoNovaSolicitacao}
          className="rounded-sm border-2 border-verde-posto px-6 py-4 font-semibold text-verde-posto"
        >
          Fazer outra solicitação
        </button>
      </div>
    </div>
  )
}
