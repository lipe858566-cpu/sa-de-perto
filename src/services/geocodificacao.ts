import { respostaNominatimSchema, type LocalGeocodificado } from '@/schemas/nominatim'

import { buscarJson } from './http'
import type { ResultadoRede } from './erros'

const BASE = import.meta.env['VITE_NOMINATIM_URL'] ?? 'https://nominatim.openstreetmap.org'

/**
 * Política de uso do Nominatim: no máximo 1 requisição por segundo.
 *
 * O navegador não permite definir `User-Agent` por JavaScript, então a
 * identificação do cliente se dá pelo cabeçalho `Referer`, enviado
 * automaticamente. Ver docs/apis.md §3.
 */
const INTERVALO_MINIMO_MS = 1100
let ultimaChamada = 0

/** Cache da sessão: a mesma consulta não vai à rede duas vezes. */
const cache = new Map<string, LocalGeocodificado[]>()

export async function buscarLocal(termo: string): Promise<ResultadoRede<LocalGeocodificado[]>> {
  const chave = termo.trim().toLowerCase()
  if (!chave) return { ok: true, dados: [] }

  const emCache = cache.get(chave)
  if (emCache) return { ok: true, dados: emCache }

  const desde = Date.now() - ultimaChamada
  if (desde < INTERVALO_MINIMO_MS) {
    await new Promise((r) => setTimeout(r, INTERVALO_MINIMO_MS - desde))
  }
  ultimaChamada = Date.now()

  const url = `${BASE}/search?${new URLSearchParams({
    q: termo,
    format: 'json',
    limit: '5',
    countrycodes: 'br',
    'accept-language': 'pt-BR',
  })}`

  const resposta = await buscarJson(url)
  if (!resposta.ok) return resposta

  const validado = respostaNominatimSchema.safeParse(resposta.dados)
  if (!validado.success) return { ok: false, erro: { tipo: 'formato' } }

  cache.set(chave, validado.data)
  return { ok: true, dados: validado.data }
}
