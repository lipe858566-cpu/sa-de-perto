import { describe, expect, it } from 'vitest'

import { respostaOverpassSchema } from './overpass'

describe('respostaOverpassSchema', () => {
  it('aceita um nó completo', () => {
    const r = respostaOverpassSchema.safeParse({
      elements: [
        {
          type: 'node',
          id: 1,
          lat: -8.06,
          lon: -34.89,
          tags: { name: 'Hospital Exemplo', amenity: 'hospital', 'addr:city': 'Recife' },
        },
      ],
    })
    expect(r.success).toBe(true)
  })

  it('aceita elemento sem tags, porque o OSM é incompleto por natureza', () => {
    const r = respostaOverpassSchema.safeParse({
      elements: [{ type: 'node', id: 2, lat: -8, lon: -34 }],
    })
    expect(r.success).toBe(true)
  })

  it('aceita way com center em vez de lat/lon', () => {
    // `out center` devolve o centro em um objeto próprio; sem isso, todo way
    // seria descartado.
    const r = respostaOverpassSchema.safeParse({
      elements: [
        { type: 'way', id: 3, center: { lat: -8.1, lon: -34.9 }, tags: { name: 'UPA Exemplo' } },
      ],
    })
    expect(r.success).toBe(true)
  })

  it('aceita tags desconhecidas sem quebrar', () => {
    const r = respostaOverpassSchema.safeParse({
      elements: [
        { type: 'node', id: 4, lat: -8, lon: -34, tags: { name: 'X', tag_que_nao_conhecemos: 'y' } },
      ],
    })
    expect(r.success).toBe(true)
  })

  it('aceita lista vazia de elementos', () => {
    expect(respostaOverpassSchema.safeParse({ elements: [] }).success).toBe(true)
  })

  it('rejeita resposta sem elements', () => {
    expect(respostaOverpassSchema.safeParse({}).success).toBe(false)
  })

  it('rejeita tipo de elemento desconhecido', () => {
    const r = respostaOverpassSchema.safeParse({
      elements: [{ type: 'galaxia', id: 5 }],
    })
    expect(r.success).toBe(false)
  })
})
