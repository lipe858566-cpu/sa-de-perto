import { describe, expect, it } from 'vitest'

import { respostaNominatimSchema } from './nominatim'

describe('respostaNominatimSchema', () => {
  it('converte lat e lon de string para número', () => {
    // O Nominatim devolve coordenadas como STRING. Se a coerção sumir, o mapa
    // quebra de um jeito silencioso.
    const r = respostaNominatimSchema.safeParse([
      { display_name: 'Recife, PE', lat: '-8.0584933', lon: '-34.8848193' },
    ])
    expect(r.success).toBe(true)
    if (r.success) {
      expect(r.data[0]?.lat).toBeCloseTo(-8.0584933)
      expect(typeof r.data[0]?.lon).toBe('number')
    }
  })

  it('aceita resposta vazia', () => {
    expect(respostaNominatimSchema.safeParse([]).success).toBe(true)
  })

  it('aceita item sem boundingbox, que é opcional', () => {
    const r = respostaNominatimSchema.safeParse([
      { display_name: 'Olinda, PE', lat: '-8.0', lon: '-34.8' },
    ])
    expect(r.success).toBe(true)
  })

  it('rejeita item sem display_name', () => {
    const r = respostaNominatimSchema.safeParse([{ lat: '-8.0', lon: '-34.8' }])
    expect(r.success).toBe(false)
  })

  it('rejeita coordenada fora do intervalo possível', () => {
    const r = respostaNominatimSchema.safeParse([
      { display_name: 'Lugar impossível', lat: '120', lon: '-34.8' },
    ])
    expect(r.success).toBe(false)
  })

  it('rejeita resposta que não é lista', () => {
    expect(respostaNominatimSchema.safeParse({ display_name: 'x' }).success).toBe(false)
  })
})
