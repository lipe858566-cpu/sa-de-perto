import { Link } from 'react-router-dom'

import { Vazio } from '@/components/estados/Vazio'
import { useSolicitacoes } from '@/hooks/useSolicitacoes'
import { useTituloPagina } from '@/hooks/useTituloPagina'
import { ROTULO_ATENDIMENTO } from '@/schemas/agendamento'
import { limparSolicitacoes } from '@/services/solicitacoes'

function formataData(iso: string): string {
  const [ano, mes, dia] = iso.split('-')
  return dia && mes && ano ? `${dia}/${mes}/${ano}` : iso
}

export function MinhasSolicitacoes() {
  useTituloPagina('Minhas solicitações')

  const solicitacoes = useSolicitacoes()

  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="font-heading text-3xl font-bold text-tinta md:text-4xl">
        Minhas solicitações
      </h1>

      <div className="mt-6 border-l-4 border-amarelo-campanha bg-amarelo-campanha/15 p-5">
        <p className="text-tinta">
          <strong>Tudo aqui é simulado e temporário.</strong> As solicitações ficam apenas na
          memória desta aba e <strong>somem ao recarregar a página</strong>. Nada foi enviado a
          nenhuma unidade de saúde, e nenhuma consulta foi agendada.
        </p>
        <p className="mt-2 text-sm text-tinta-suave">
          Nada é gravado no seu dispositivo, de propósito: o formulário coleta nome e contato,
          que são dados pessoais, e guardá-los no navegador não traria benefício algum num
          projeto acadêmico.
        </p>
      </div>

      <section aria-label="Lista de solicitações" className="mt-10">
        {solicitacoes.length === 0 ? (
          <Vazio
            titulo="Nenhuma solicitação nesta sessão"
            orientacao="Preencha o formulário de demonstração para ver como o fluxo funciona."
            acao={
              <Link
                to="/agendamento"
                className="inline-block rounded-sm bg-verde-posto px-5 py-3 font-semibold text-papel"
              >
                Ir para o formulário
              </Link>
            }
          />
        ) : (
          <>
            <output aria-live="polite" className="block font-medium text-tinta">
              {solicitacoes.length}{' '}
              {solicitacoes.length === 1 ? 'solicitação simulada' : 'solicitações simuladas'}
            </output>

            <ul className="mt-6 space-y-6">
              {solicitacoes.map((s) => (
                <li key={s.protocolo} className="border-t-4 border-amarelo-campanha bg-papel-2 p-5">
                  <p className="text-sm font-semibold text-verde-posto">
                    Protocolo simulado {s.protocolo}
                  </p>
                  <h2 className="mt-1 font-heading text-lg font-semibold text-tinta">
                    {s.unidadeNome}
                  </h2>
                  <dl className="mt-3 space-y-1 text-tinta-suave">
                    <div className="flex gap-2">
                      <dt className="font-medium text-tinta">Atendimento:</dt>
                      <dd>{ROTULO_ATENDIMENTO[s.tipoAtendimento]}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="font-medium text-tinta">Preferência:</dt>
                      <dd>
                        {formataData(s.dataPreferida)}, {s.periodo === 'manha' ? 'manhã' : 'tarde'}
                      </dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="font-medium text-tinta">Situação:</dt>
                      <dd>Não enviada — demonstração</dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>

            <div className="mt-8 border-t-2 border-border pt-6">
              <button
                type="button"
                onClick={limparSolicitacoes}
                className="rounded-sm border-2 border-verde-posto px-5 py-3 font-medium text-verde-posto"
              >
                Apagar todas as solicitações desta sessão
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  )
}
