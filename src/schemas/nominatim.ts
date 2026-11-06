import { z } from 'zod'

/**
 * Resposta do Nominatim (/search?format=json).
 *
 * `lat` e `lon` chegam como STRING na resposta — por isso a coerção explícita.
 * Campos que o serviço pode omitir são opcionais, para a validação não falhar
 * por um dado ausente que a interface sabe tratar.
 */
export const localGeocodificadoSchema = z.object({
  display_name: z.string().min(1),
  lat: z.coerce.number().min(-90).max(90),
  lon: z.coerce.number().min(-180).max(180),
  boundingbox: z.array(z.coerce.number()).length(4).optional(),
})

export const respostaNominatimSchema = z.array(localGeocodificadoSchema)

export type LocalGeocodificado = z.infer<typeof localGeocodificadoSchema>
