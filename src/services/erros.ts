/**
 * Erros de aplicação, normalizados na fronteira de rede.
 *
 * Nenhum erro bruto de `fetch` ou do Zod atravessa a camada de serviços: a
 * interface recebe um destes tipos e traduz para português (docs/arquitetura.md §8).
 */
export type ErroApp =
  | { tipo: 'rede' }
  | { tipo: 'timeout' }
  | { tipo: 'indisponivel'; status?: number }
  | { tipo: 'limite' }
  | { tipo: 'formato' }
  | { tipo: 'nao_encontrado' }

export type ResultadoRede<T> = { ok: true; dados: T } | { ok: false; erro: ErroApp }

/** Texto exibido à pessoa. Sem jargão, sem stack trace, sem pedido de desculpa. */
export function mensagemDoErro(erro: ErroApp): { mensagem: string; comoResolver: string } {
  switch (erro.tipo) {
    case 'rede':
      return {
        mensagem: 'Não foi possível conectar.',
        comoResolver: 'Verifique sua conexão com a internet e tente de novo.',
      }
    case 'timeout':
      return {
        mensagem: 'O serviço demorou demais para responder.',
        comoResolver: 'Isso costuma ser temporário. Tente de novo em alguns instantes.',
      }
    case 'indisponivel':
      return {
        mensagem: 'O serviço de mapas está sobrecarregado no momento.',
        comoResolver:
          'É um serviço público gratuito, sem garantia de disponibilidade. Tente de novo mais tarde.',
      }
    case 'limite':
      return {
        mensagem: 'Muitas buscas em pouco tempo.',
        comoResolver: 'Aguarde alguns segundos antes de buscar novamente.',
      }
    case 'formato':
      return {
        mensagem: 'O serviço respondeu em um formato inesperado.',
        comoResolver: 'Tente de novo. Se continuar, a fonte de dados pode ter mudado.',
      }
    case 'nao_encontrado':
      return {
        mensagem: 'Nada encontrado para essa busca.',
        comoResolver: 'Confira a escrita do município ou tente um termo mais simples.',
      }
  }
}
