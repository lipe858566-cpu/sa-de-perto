import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'

import { renderizar } from '@/test/utils'
import type { Solicitacao } from '@/types/solicitacao'

import { ConfirmacaoSolicitacao } from './ConfirmacaoSolicitacao'

const SOLICITACAO: Solicitacao = {
  protocolo: 'DEMO-2026-0001',
  nome: 'Maria',
  contato: 'maria@exemplo.com',
  unidadeId: 'demo-1',
  unidadeNome: 'UBS Exemplo — Vila das Flores',
  tipoAtendimento: 'vacinacao',
  dataPreferida: '2099-01-01',
  periodo: 'manha',
  observacao: '',
  criadaEm: '2026-10-23T12:00:00.000Z',
}

/**
 * Estes testes guardam um compromisso de INTEGRIDADE, não de estética.
 *
 * A aplicação não agenda nada. Se um dia alguém mexer nesta tela e escrever
 * "consulta confirmada", a pessoa que usa o site pode acreditar que tem
 * atendimento marcado e não aparecer na unidade. A suíte falha antes disso.
 */
describe('ConfirmacaoSolicitacao — honestidade da mensagem (RF12)', () => {
  const FRASES_PROIBIDAS = [
    'consulta confirmada',
    'consulta agendada',
    'agendamento confirmado',
    'agendamento realizado',
    'agendado com sucesso',
    'consulta marcada',
    'atendimento confirmado',
    'atendimento agendado',
  ]

  it.each(FRASES_PROIBIDAS)('nunca diz "%s"', (frase) => {
    const { container } = renderizar(
      <ConfirmacaoSolicitacao solicitacao={SOLICITACAO} aoNovaSolicitacao={vi.fn()} />,
    )
    expect(container.textContent?.toLowerCase()).not.toContain(frase)
  })

  it('declara que nenhuma consulta foi agendada, em destaque', () => {
    renderizar(<ConfirmacaoSolicitacao solicitacao={SOLICITACAO} aoNovaSolicitacao={vi.fn()} />)
    expect(
      screen.getByRole('heading', { level: 1, name: /nenhuma consulta foi agendada/i }),
    ).toBeInTheDocument()
  })

  it('diz que os dados não foram enviados a nenhuma unidade', () => {
    const { container } = renderizar(
      <ConfirmacaoSolicitacao solicitacao={SOLICITACAO} aoNovaSolicitacao={vi.fn()} />,
    )
    expect(container.textContent).toMatch(/não foram enviados a nenhuma unidade de saúde/i)
  })

  it('rotula o protocolo como simulado em toda menção', () => {
    const { container } = renderizar(
      <ConfirmacaoSolicitacao solicitacao={SOLICITACAO} aoNovaSolicitacao={vi.fn()} />,
    )
    expect(screen.getByText(/protocolo simulado/i)).toBeInTheDocument()
    expect(container.textContent).toMatch(/não existe em nenhum sistema de saúde/i)
  })

  it('anuncia a mudança de tela por região live', () => {
    const { container } = renderizar(
      <ConfirmacaoSolicitacao solicitacao={SOLICITACAO} aoNovaSolicitacao={vi.fn()} />,
    )
    expect(container.querySelector('output')).toBeInTheDocument()
  })

  it('move o foco para o título, para quem usa leitor de tela perceber a mudança', () => {
    renderizar(<ConfirmacaoSolicitacao solicitacao={SOLICITACAO} aoNovaSolicitacao={vi.fn()} />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveFocus()
  })

  it('mostra de volta o que a pessoa preencheu', () => {
    renderizar(<ConfirmacaoSolicitacao solicitacao={SOLICITACAO} aoNovaSolicitacao={vi.fn()} />)
    expect(screen.getByText('Maria')).toBeInTheDocument()
    expect(screen.getByText('UBS Exemplo — Vila das Flores')).toBeInTheDocument()
    expect(screen.getByText('Vacinação')).toBeInTheDocument()
    expect(screen.getByText('01/01/2099')).toBeInTheDocument()
  })
})
