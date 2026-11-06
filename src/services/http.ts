import type { ErroApp, ResultadoRede } from './erros'

/** Nenhuma requisição fica pendurada indefinidamente. */
const TIMEOUT_PADRAO_MS = 20_000

type Opcoes = {
  timeoutMs?: number
  metodo?: 'GET' | 'POST'
  corpo?: string
  cabecalhos?: Record<string, string>
}

function classificaStatus(status: number): ErroApp {
  if (status === 429) return { tipo: 'limite' }
  if (status === 404) return { tipo: 'nao_encontrado' }
  if (status >= 500) return { tipo: 'indisponivel', status }
  return { tipo: 'indisponivel', status }
}

/**
 * Faz a requisição e devolve a falha como VALOR, não como exceção.
 *
 * Nenhum `throw` atravessa a fronteira do serviço — assim a interface nunca
 * precisa de try/catch nem inspeciona objetos de erro do navegador.
 */
export async function buscarJson(url: string, opcoes: Opcoes = {}): Promise<ResultadoRede<unknown>> {
  const { timeoutMs = TIMEOUT_PADRAO_MS, metodo = 'GET', corpo, cabecalhos } = opcoes

  try {
    const resposta = await fetch(url, {
      method: metodo,
      body: corpo,
      headers: cabecalhos,
      signal: AbortSignal.timeout(timeoutMs),
    })

    if (!resposta.ok) return { ok: false, erro: classificaStatus(resposta.status) }

    try {
      return { ok: true, dados: await resposta.json() }
    } catch {
      return { ok: false, erro: { tipo: 'formato' } }
    }
  } catch (e) {
    if (e instanceof DOMException && (e.name === 'TimeoutError' || e.name === 'AbortError')) {
      return { ok: false, erro: { tipo: 'timeout' } }
    }
    return { ok: false, erro: { tipo: 'rede' } }
  }
}

/** Espera `ms` milissegundos. Usado no backoff exponencial da Overpass. */
export function espera(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
