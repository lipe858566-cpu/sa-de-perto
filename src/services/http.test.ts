import { afterEach, describe, expect, it, vi } from 'vitest'

import { buscarJson } from './http'
import { mensagemDoErro } from './erros'

afterEach(() => vi.restoreAllMocks())

describe('buscarJson — falha vira valor, nunca exceção', () => {
  it.each([
    [429, 'limite'],
    [404, 'nao_encontrado'],
    [502, 'indisponivel'],
    [500, 'indisponivel'],
  ])('classifica HTTP %i como %s', async (status, tipo) => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, status }) as Response))
    const r = await buscarJson('https://exemplo.test')
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.erro.tipo).toBe(tipo)
  })

  it('classifica corpo inválido como erro de formato', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        status: 200,
        json: async () => {
          throw new Error('não é JSON')
        },
      }) as unknown as Response),
    )
    const r = await buscarJson('https://exemplo.test')
    expect(r.ok === false && r.erro.tipo).toBe('formato')
  })

  it('classifica queda de rede como erro de rede', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new TypeError('Failed to fetch')
      }),
    )
    const r = await buscarJson('https://exemplo.test')
    expect(r.ok === false && r.erro.tipo).toBe('rede')
  })
})

describe('mensagemDoErro — texto para a pessoa', () => {
  const TIPOS = [
    'rede',
    'timeout',
    'indisponivel',
    'limite',
    'formato',
    'nao_encontrado',
  ] as const

  it.each(TIPOS)('traduz "%s" sem jargão e com caminho de saída', (tipo) => {
    const { mensagem, comoResolver } = mensagemDoErro({ tipo } as never)
    expect(mensagem.length).toBeGreaterThan(10)
    expect(comoResolver.length).toBeGreaterThan(10)
    // Sem jargão técnico nem pedido de desculpa na cara do usuário.
    expect(`${mensagem} ${comoResolver}`.toLowerCase()).not.toMatch(
      /http|fetch|null|undefined|erro 5|desculp/,
    )
  })
})
