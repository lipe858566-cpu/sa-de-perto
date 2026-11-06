import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'

import { renderizar } from '@/test/utils'
import type { Unidade } from '@/types/unidade'

import { UnidadeCard } from './UnidadeCard'

const COMPLETA: Unidade = {
  id: 'u1',
  nome: 'UBS Teste',
  tipo: 'ubs',
  servicos: ['clinica-geral', 'vacinacao'],
  endereco: 'Rua A, 10',
  bairro: 'Centro',
  municipio: 'Recife',
  uf: 'PE',
  telefone: '81 99999-0000',
  horario: 'Seg a sex, 8h às 17h',
  coordenadas: { lat: -8, lon: -34 },
  origem: 'demonstrativo',
  obtidoEm: '2026-10-23',
}

const INCOMPLETA: Unidade = {
  ...COMPLETA,
  id: 'u2',
  nome: 'UBS Sem Dados',
  endereco: null,
  horario: null,
  telefone: null,
  servicos: [],
}

describe('UnidadeCard (RF03)', () => {
  it('mostra nome, tipo, endereço, horário e serviços', () => {
    renderizar(<UnidadeCard unidade={COMPLETA} />)
    expect(screen.getByRole('link', { name: 'UBS Teste' })).toBeInTheDocument()
    expect(screen.getByText('Unidade Básica de Saúde')).toBeInTheDocument()
    expect(screen.getByText(/Rua A, 10/)).toBeInTheDocument()
    expect(screen.getByText(/Seg a sex/)).toBeInTheDocument()
    expect(screen.getByText('Vacinação')).toBeInTheDocument()
  })

  /**
   * Campo ausente na fonte nunca pode aparecer vazio nem como `undefined`:
   * o OpenStreetMap é incompleto por natureza (só 15 de 29 unidades reais
   * traziam município na medição da Fase 5).
   */
  it('escreve "Não informado" para campo ausente, nunca vazio nem undefined', () => {
    const { container } = renderizar(<UnidadeCard unidade={INCOMPLETA} />)
    expect(screen.getAllByText(/não informado/i).length).toBeGreaterThanOrEqual(2)
    expect(container.textContent).not.toMatch(/undefined|null/)
  })

  it('aponta para a página de detalhes da unidade', () => {
    renderizar(<UnidadeCard unidade={COMPLETA} />)
    expect(screen.getByRole('link', { name: 'UBS Teste' })).toHaveAttribute(
      'href',
      '/unidades/u1',
    )
  })
})
