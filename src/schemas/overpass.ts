import { z } from 'zod'

/**
 * Resposta da Overpass API.
 *
 * Quase tudo em `tags` é opcional: o OpenStreetMap é colaborativo e a
 * completude varia muito. Um elemento sem nome ou sem endereço é válido —
 * a interface exibe "não informado" (RF03).
 *
 * `way` e `relation` não têm lat/lon próprios; com `out center` eles trazem
 * um objeto `center`. Ambos os formatos são aceitos aqui.
 */
const tagsSchema = z
  .object({
    name: z.string().optional(),
    amenity: z.string().optional(),
    healthcare: z.string().optional(),
    'addr:street': z.string().optional(),
    'addr:housenumber': z.string().optional(),
    'addr:suburb': z.string().optional(),
    'addr:city': z.string().optional(),
    'addr:state': z.string().optional(),
    phone: z.string().optional(),
    'contact:phone': z.string().optional(),
    opening_hours: z.string().optional(),
  })
  .loose()

export const elementoOverpassSchema = z.object({
  type: z.enum(['node', 'way', 'relation']),
  id: z.number(),
  lat: z.number().optional(),
  lon: z.number().optional(),
  center: z.object({ lat: z.number(), lon: z.number() }).optional(),
  tags: tagsSchema.optional(),
})

export const respostaOverpassSchema = z.object({
  elements: z.array(elementoOverpassSchema),
})

export type ElementoOverpass = z.infer<typeof elementoOverpassSchema>
