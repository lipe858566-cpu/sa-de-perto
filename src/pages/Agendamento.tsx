import { useState } from 'react'
import { TriangleAlert } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

import { Campo } from '@/components/formulario/Campo'
import { classeControle } from '@/components/formulario/estilos'
import { useTituloPagina } from '@/hooks/useTituloPagina'
import { resolverZod } from '@/lib/resolverZod'
import {
  ROTULO_ATENDIMENTO,
  TIPOS_ATENDIMENTO,
  agendamentoSchema,
  hojeISO,
  type DadosAgendamento,
} from '@/schemas/agendamento'
import { registrarSolicitacao } from '@/services/solicitacoes'
import { UNIDADES_DEMO } from '@/data/unidades.mock'
import type { Solicitacao } from '@/types/solicitacao'

import { ConfirmacaoSolicitacao } from './ConfirmacaoSolicitacao'

export function Agendamento() {
  useTituloPagina('Solicitação de agendamento')

  const [enviada, setEnviada] = useState<Solicitacao | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<DadosAgendamento>({
    resolver: resolverZod(agendamentoSchema),
    defaultValues: { observacao: '' },
    // O foco automático do react-hook-form escolhe o campo pela ordem interna
    // de registro, o que levou o foco ao último inválido em vez do primeiro.
    // Desligado aqui para que `aoFalhar` controle a ordem explicitamente (RF11).
    shouldFocusError: false,
  })

  if (enviada) {
    return (
      <ConfirmacaoSolicitacao
        solicitacao={enviada}
        aoNovaSolicitacao={() => {
          setEnviada(null)
          reset()
        }}
      />
    )
  }

  function aoEnviar(dados: DadosAgendamento) {
    const unidade = UNIDADES_DEMO.find((u) => u.id === dados.unidadeId)
    setEnviada(
      registrarSolicitacao({
        nome: dados.nome,
        contato: dados.contato,
        unidadeId: dados.unidadeId,
        unidadeNome: unidade?.nome ?? 'Unidade não identificada',
        tipoAtendimento: dados.tipoAtendimento,
        dataPreferida: dados.dataPreferida,
        periodo: dados.periodo,
        observacao: dados.observacao,
      }),
    )
  }

  /**
   * Ao falhar a validação, o foco vai para o PRIMEIRO campo inválido, na ordem
   * visual do formulário (RF11) — não na ordem interna do react-hook-form.
   */
  function aoFalhar(erros: typeof errors) {
    const ordem: (keyof DadosAgendamento)[] = [
      'nome',
      'contato',
      'unidadeId',
      'tipoAtendimento',
      'dataPreferida',
      'periodo',
      'observacao',
    ]
    const primeiro = ordem.find((campo) => erros[campo])
    if (primeiro) setFocus(primeiro)
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <h1 className="font-heading text-3xl font-bold text-tinta md:text-4xl">
        Solicitação de agendamento
      </h1>

      <div className="mt-6 border-l-8 border-vermelho-urgencia bg-papel-2 p-5">
        <p className="flex items-start gap-3 font-heading text-lg font-bold text-tinta">
          <TriangleAlert
            className="mt-0.5 size-5 shrink-0 text-vermelho-urgencia"
            aria-hidden="true"
          />
          Isto não marca consulta de verdade.
        </p>
        <p className="mt-2 text-tinta-suave">
          Este formulário mostra apenas como seria uma solicitação. Nenhum pedido é enviado
          a unidades de saúde. Para marcar atendimento, procure a unidade diretamente.
        </p>
        <p className="mt-2 text-tinta-suave">
          Em emergência, ligue <strong className="text-tinta">192</strong>.
        </p>
      </div>

      <form onSubmit={handleSubmit(aoEnviar, aoFalhar)} noValidate className="mt-10 space-y-8">
        <Campo
          id="nome"
          rotulo="Como podemos chamar você"
          ajuda="Pode ser só o primeiro nome."
          erro={errors.nome?.message}
          obrigatorio
        >
          {({ id, descritoPor, invalido }) => (
            <input
              {...register('nome')}
              id={id}
              type="text"
              autoComplete="name"
              aria-describedby={descritoPor || undefined}
              aria-invalid={invalido}
              className={classeControle(invalido)}
            />
          )}
        </Campo>

        <Campo
          id="contato"
          rotulo="Telefone ou e-mail"
          ajuda="Só para demonstrar o fluxo. Nada é enviado a lugar nenhum."
          erro={errors.contato?.message}
          obrigatorio
        >
          {({ id, descritoPor, invalido }) => (
            <input
              {...register('contato')}
              id={id}
              type="text"
              aria-describedby={descritoPor || undefined}
              aria-invalid={invalido}
              className={classeControle(invalido)}
            />
          )}
        </Campo>

        <Campo
          id="unidadeId"
          rotulo="Unidade"
          erro={errors.unidadeId?.message}
          obrigatorio
        >
          {({ id, descritoPor, invalido }) => (
            <select
              {...register('unidadeId')}
              id={id}
              aria-describedby={descritoPor || undefined}
              aria-invalid={invalido}
              className={classeControle(invalido)}
              defaultValue=""
            >
              <option value="">Escolha uma unidade</option>
              {UNIDADES_DEMO.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nome} — {u.municipio}
                </option>
              ))}
            </select>
          )}
        </Campo>

        <Campo
          id="tipoAtendimento"
          rotulo="Tipo de atendimento"
          erro={errors.tipoAtendimento?.message}
          obrigatorio
        >
          {({ id, descritoPor, invalido }) => (
            <select
              {...register('tipoAtendimento')}
              id={id}
              aria-describedby={descritoPor || undefined}
              aria-invalid={invalido}
              className={classeControle(invalido)}
              defaultValue=""
            >
              <option value="">Escolha o tipo</option>
              {TIPOS_ATENDIMENTO.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {ROTULO_ATENDIMENTO[tipo]}
                </option>
              ))}
            </select>
          )}
        </Campo>

        <Campo
          id="dataPreferida"
          rotulo="Data de preferência"
          ajuda="Hoje ou uma data futura."
          erro={errors.dataPreferida?.message}
          obrigatorio
        >
          {({ id, descritoPor, invalido }) => (
            <input
              {...register('dataPreferida')}
              id={id}
              type="date"
              min={hojeISO()}
              aria-describedby={descritoPor || undefined}
              aria-invalid={invalido}
              className={classeControle(invalido)}
            />
          )}
        </Campo>

        <fieldset>
          <legend className="font-medium text-tinta">
            Período
            <span className="text-vermelho-urgencia">
              {' '}
              *<span className="sr-only"> (obrigatório)</span>
            </span>
          </legend>
          <div className="mt-3 flex gap-6">
            {(
              [
                ['manha', 'Manhã'],
                ['tarde', 'Tarde'],
              ] as const
            ).map(([valor, rotulo]) => (
              <label key={valor} className="flex items-center gap-2 text-tinta">
                <input
                  {...register('periodo')}
                  type="radio"
                  value={valor}
                  aria-describedby={errors.periodo ? 'periodo-erro' : undefined}
                  className="size-5"
                />
                {rotulo}
              </label>
            ))}
          </div>
          {errors.periodo && (
            <p id="periodo-erro" className="mt-2 text-vermelho-urgencia">
              {errors.periodo.message}
            </p>
          )}
        </fieldset>

        <Campo
          id="observacao"
          rotulo="Observação (opcional)"
          ajuda="Não escreva sintomas, diagnósticos nem informações de saúde aqui."
          erro={errors.observacao?.message}
        >
          {({ id, descritoPor, invalido }) => (
            <textarea
              {...register('observacao')}
              id={id}
              rows={3}
              maxLength={300}
              aria-describedby={descritoPor || undefined}
              aria-invalid={invalido}
              className={classeControle(invalido)}
            />
          )}
        </Campo>

        <div className="flex flex-wrap items-center gap-4 border-t-2 border-border pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-sm bg-verde-posto px-6 py-4 font-semibold text-papel disabled:opacity-60"
          >
            Enviar solicitação de demonstração
          </button>
          <Link to="/unidades" className="font-medium text-azul-cartilha underline">
            Ver unidades
          </Link>
        </div>
      </form>
    </div>
  )
}
