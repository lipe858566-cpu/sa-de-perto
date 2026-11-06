import { describe, expect, it } from 'vitest'

import { agendamentoSchema, hojeISO } from './agendamento'

const VALIDO = {
  nome: 'Maria',
  contato: 'maria@exemplo.com',
  unidadeId: 'demo-1',
  tipoAtendimento: 'vacinacao',
  dataPreferida: '2099-01-01',
  periodo: 'manha',
  observacao: '',
}

describe('agendamentoSchema', () => {
  it('aceita um preenchimento válido', () => {
    const r = agendamentoSchema.safeParse(VALIDO)
    expect(r.success).toBe(true)
  })

  it('aceita observação ausente, porque o campo é opcional', () => {
    const { observacao: _omitida, ...semObservacao } = VALIDO
    const r = agendamentoSchema.safeParse(semObservacao)
    expect(r.success).toBe(true)
  })

  it.each([
    ['nome', ''],
    ['nome', 'M'],
    ['contato', 'curto'],
    ['unidadeId', ''],
    ['periodo', ''],
  ])('rejeita %s inválido', (campo, valor) => {
    const r = agendamentoSchema.safeParse({ ...VALIDO, [campo]: valor })
    expect(r.success).toBe(false)
    if (!r.success) {
      expect(r.error.issues.some((i) => i.path[0] === campo)).toBe(true)
    }
  })

  it('rejeita tipo de atendimento fora da lista', () => {
    const r = agendamentoSchema.safeParse({ ...VALIDO, tipoAtendimento: 'cirurgia-cardiaca' })
    expect(r.success).toBe(false)
  })

  it('rejeita data no passado', () => {
    const r = agendamentoSchema.safeParse({ ...VALIDO, dataPreferida: '2020-01-01' })
    expect(r.success).toBe(false)
    if (!r.success) {
      expect(r.error.issues[0]?.message).toContain('hoje ou depois')
    }
  })

  it('aceita a data de hoje', () => {
    const r = agendamentoSchema.safeParse({ ...VALIDO, dataPreferida: hojeISO() })
    expect(r.success).toBe(true)
  })

  it('rejeita tipo incorreto no lugar de string', () => {
    const r = agendamentoSchema.safeParse({ ...VALIDO, nome: 42 })
    expect(r.success).toBe(false)
  })

  it('devolve mensagens em português, acionáveis', () => {
    const r = agendamentoSchema.safeParse({})
    expect(r.success).toBe(false)
    if (!r.success) {
      for (const problema of r.error.issues) {
        expect(problema.message).not.toMatch(/required|expected|invalid/i)
        expect(problema.message.length).toBeGreaterThan(10)
      }
    }
  })
})
