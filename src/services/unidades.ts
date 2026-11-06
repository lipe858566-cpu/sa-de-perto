import { UNIDADES_DEMO } from '@/data/unidades.mock'
import { respostaOverpassSchema, type ElementoOverpass } from '@/schemas/overpass'
import type { Servico, TipoUnidade, Unidade } from '@/types/unidade'

import { buscarJson, espera } from './http'
import type { ResultadoRede } from './erros'

/**
 * Tempo limite por espelho.
 *
 * Medido em 2026-10-23: a Overpass pública responde 502 quase instantaneamente
 * quando está saturada, mas uma consulta aceita pode levar dezenas de segundos.
 * 12 s por espelho mantém a espera total abaixo de ~26 s no pior caso, que já
 * é longo — por isso a interface anuncia a etapa em que está.
 */
const TIMEOUT_OVERPASS_MS = 12_000

const ENDPOINTS = [
  import.meta.env['VITE_OVERPASS_URL'] ?? 'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
]

/** Raio aproximado em graus (~5 km) em torno do ponto geocodificado. */
const RAIO_GRAUS = 0.045

/**
 * Registro das unidades já vistas nesta sessão, por id.
 *
 * A página de detalhe precisa encontrar tanto as unidades demonstrativas
 * quanto as que vieram de uma busca na Overpass. Sem isso, clicar em "ver
 * detalhes" num resultado de busca cairia em "não encontrado".
 *
 * É cache de sessão em memória: some ao recarregar a página, o que é
 * aceitável porque a busca pode ser refeita.
 */
const registro = new Map<string, Unidade>()

for (const u of UNIDADES_DEMO) registro.set(u.id, u)

export function unidadePorId(id: string): Unidade | undefined {
  return registro.get(id)
}

export type ResultadoUnidades = {
  unidades: Unidade[]
  /** `true` quando a API falhou e o retorno veio dos dados demonstrativos. */
  usouFallback: boolean
}

function montaConsulta(lat: number, lon: number): string {
  const s = (lat - RAIO_GRAUS).toFixed(5)
  const o = (lon - RAIO_GRAUS).toFixed(5)
  const n = (lat + RAIO_GRAUS).toFixed(5)
  const l = (lon + RAIO_GRAUS).toFixed(5)
  const filtro = '["amenity"~"^(hospital|clinic|doctors|dentist)$"]'
  return `[out:json][timeout:25];(node${filtro}(${s},${o},${n},${l});way${filtro}(${s},${o},${n},${l}););out center 60;`
}

function mapeiaTipo(el: ElementoOverpass): TipoUnidade {
  const amenity = el.tags?.['amenity']
  if (amenity === 'hospital') return 'hospital'
  if (amenity === 'dentist') return 'odontologia'
  if (amenity === 'doctors') return 'ubs'
  return 'policlinica'
}

function mapeiaServicos(el: ElementoOverpass): Servico[] {
  const amenity = el.tags?.['amenity']
  if (amenity === 'hospital') return ['urgencia', 'clinica-geral']
  if (amenity === 'dentist') return ['odontologia']
  return ['clinica-geral']
}

function mapeiaUnidade(el: ElementoOverpass, obtidoEm: string): Unidade | null {
  const coord = el.lat != null && el.lon != null ? { lat: el.lat, lon: el.lon } : el.center
  const tags = el.tags ?? {}

  // Sem nome a entrada é inútil para quem procura atendimento, então é descartada.
  const nome = tags['name']
  if (!nome) return null

  const rua = tags['addr:street']
  const numero = tags['addr:housenumber']
  const endereco = rua ? [rua, numero].filter(Boolean).join(', ') : null

  return {
    id: `osm-${el.type}-${el.id}`,
    nome,
    tipo: mapeiaTipo(el),
    servicos: mapeiaServicos(el),
    endereco,
    bairro: tags['addr:suburb'] ?? null,
    municipio: tags['addr:city'] ?? 'Município não informado',
    uf: tags['addr:state'] ?? '',
    telefone: tags['phone'] ?? tags['contact:phone'] ?? null,
    horario: tags['opening_hours'] ?? null,
    coordenadas: coord ?? null,
    origem: 'openstreetmap',
    obtidoEm,
  }
}

/**
 * Busca unidades reais no OpenStreetMap, com backoff exponencial entre os
 * espelhos — é o que o próprio servidor orienta quando está sobrecarregado.
 *
 * **Nunca lança e nunca devolve tela quebrada:** se todas as tentativas
 * falharem, retorna os dados demonstrativos com `usouFallback: true`, e a
 * interface é obrigada a exibir isso (RNF11 e decisão D6).
 */
export async function buscarUnidadesPorArea(
  lat: number,
  lon: number,
): Promise<ResultadoRede<ResultadoUnidades>> {
  const consulta = montaConsulta(lat, lon)
  const corpo = new URLSearchParams({ data: consulta }).toString()
  const hoje = new Date().toISOString().slice(0, 10)

  for (let tentativa = 0; tentativa < ENDPOINTS.length; tentativa += 1) {
    const endpoint = ENDPOINTS[tentativa]
    if (!endpoint) continue

    if (tentativa > 0) await espera(1500)

    const resposta = await buscarJson(endpoint, {
      metodo: 'POST',
      corpo,
      cabecalhos: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeoutMs: TIMEOUT_OVERPASS_MS,
    })

    if (!resposta.ok) continue

    const validado = respostaOverpassSchema.safeParse(resposta.dados)
    if (!validado.success) continue

    const unidades = validado.data.elements
      .map((el) => mapeiaUnidade(el, hoje))
      .filter((u): u is Unidade => u !== null)

    for (const u of unidades) registro.set(u.id, u)
    return { ok: true, dados: { unidades, usouFallback: false } }
  }

  // Degrada com informação honesta em vez de quebrar (RNF11).
  return { ok: true, dados: { unidades: UNIDADES_DEMO, usouFallback: true } }
}
