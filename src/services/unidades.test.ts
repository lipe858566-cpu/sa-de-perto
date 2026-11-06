import { afterEach, describe, expect, it, vi } from 'vitest'

import { UNIDADES_DEMO } from '@/data/unidades.mock'

import { buscarUnidadesPorArea, unidadePorId } from './unidades'

function respostaOk(corpo: unknown) {
  return { ok: true, status: 200, json: async () => corpo } as Response
}

afterEach(() => vi.restoreAllMocks())

describe('buscarUnidadesPorArea — mapeamento', () => {
  it('converte elementos do OSM em unidades do domínio', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        respostaOk({
          elements: [
            {
              type: 'node',
              id: 99,
              lat: -8.06,
              lon: -34.89,
              tags: {
                name: 'Hospital Exemplo',
                amenity: 'hospital',
                'addr:street': 'Rua A',
                'addr:housenumber': '10',
                'addr:city': 'Recife',
              },
            },
          ],
        }),
      ),
    )

    const r = await buscarUnidadesPorArea(-8.06, -34.89)
    expect(r.ok).toBe(true)
    if (!r.ok) return

    expect(r.dados.usouFallback).toBe(false)
    const [unidade] = r.dados.unidades
    expect(unidade?.nome).toBe('Hospital Exemplo')
    expect(unidade?.tipo).toBe('hospital')
    expect(unidade?.endereco).toBe('Rua A, 10')
    expect(unidade?.origem).toBe('openstreetmap')
  })

  it('descarta elementos sem nome, que não ajudam quem procura atendimento', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        respostaOk({
          elements: [
            { type: 'node', id: 1, lat: -8, lon: -34, tags: { amenity: 'clinic' } },
            { type: 'node', id: 2, lat: -8, lon: -34, tags: { name: 'Com nome', amenity: 'clinic' } },
          ],
        }),
      ),
    )

    const r = await buscarUnidadesPorArea(-8, -34)
    expect(r.ok && r.dados.unidades).toHaveLength(1)
  })

  it('marca município como não informado quando a tag falta (P11)', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        respostaOk({
          elements: [{ type: 'node', id: 3, lat: -8, lon: -34, tags: { name: 'Sem cidade' } }],
        }),
      ),
    )

    const r = await buscarUnidadesPorArea(-8, -34)
    expect(r.ok && r.dados.unidades[0]?.municipio).toBe('Município não informado')
  })
})

/**
 * O fallback é o compromisso central de RNF11: o serviço público do
 * OpenStreetMap falha com frequência, e a aplicação nunca pode quebrar nem
 * apresentar dado demonstrativo como se fosse real.
 */
describe('buscarUnidadesPorArea — fallback (RNF11)', () => {
  it('degrada para dados demonstrativos quando todos os espelhos falham', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: false, status: 502 }) as Response),
    )

    const r = await buscarUnidadesPorArea(-8, -34)
    expect(r.ok).toBe(true)
    if (!r.ok) return

    expect(r.dados.usouFallback).toBe(true)
    expect(r.dados.unidades).toEqual(UNIDADES_DEMO)
    // Todo dado do fallback precisa estar marcado como demonstrativo.
    expect(r.dados.unidades.every((u) => u.origem === 'demonstrativo')).toBe(true)
  })

  it('degrada também quando a resposta não passa na validação', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => respostaOk({ formato: 'inesperado' })))

    const r = await buscarUnidadesPorArea(-8, -34)
    expect(r.ok && r.dados.usouFallback).toBe(true)
  })

  it('nunca lança, mesmo com erro de rede', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('rede caiu')
      }),
    )

    await expect(buscarUnidadesPorArea(-8, -34)).resolves.toMatchObject({ ok: true })
  })
})

describe('unidadePorId', () => {
  it('encontra as unidades demonstrativas desde o início', () => {
    expect(unidadePorId('demo-1')?.nome).toContain('UBS Exemplo')
  })

  it('devolve undefined para id inexistente', () => {
    expect(unidadePorId('nao-existe')).toBeUndefined()
  })
})
