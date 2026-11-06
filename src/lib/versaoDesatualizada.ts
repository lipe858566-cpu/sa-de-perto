/**
 * Recuperação de carregamento de página sob demanda após uma publicação nova.
 *
 * As rotas são carregadas sob demanda e cada pedaço tem um hash no nome. Quando
 * uma versão nova é publicada, os arquivos da versão anterior deixam de existir
 * no servidor. Quem estava com a aba aberta continua com o `index.html` antigo
 * em memória e, ao navegar, pede um arquivo que já não existe — o import falha.
 *
 * Em host estático com fallback de SPA (GitHub Pages, ver `docs/deploy.md`) o
 * efeito é pior: o pedido não devolve 404, devolve o `404.html` com status 200.
 * O navegador pede JavaScript, recebe HTML e lança um erro de módulo.
 *
 * Recarregar busca o `index.html` novo e resolve. Mas recarregar sem limite
 * criaria um laço infinito se a falha for permanente (rede fora do ar, pedaço
 * realmente ausente de uma publicação quebrada). Por isso a recarga é
 * **uma só**, e a segunda falha mostra a tela de erro.
 */

/**
 * Marca da recarga já tentada. `sessionStorage` e não `localStorage`: a
 * proteção precisa valer para esta aba e acabar quando ela fechar.
 *
 * Não é armazenamento de dados — é um carimbo de tempo numérico, sem nada
 * pessoal. Ver `CLAUDE.md` §8.
 */
const CHAVE = 'saude-perto:recarga-por-versao'

/** Depois disso, uma nova falha é tratada como problema real, não como versão velha. */
const JANELA_MS = 10_000

/**
 * Cada navegador descreve essa falha com palavras próprias, e a mensagem é o
 * único sinal disponível — não há tipo de erro específico.
 *
 * - Chrome/Edge: "Failed to fetch dynamically imported module"
 * - Firefox: "error loading dynamically imported module"
 * - Safari: "Importing a module script failed"
 * - Vite, ao pré-carregar o CSS do pedaço: "Unable to preload CSS for ..."
 */
const PADRAO_IMPORT_FALHOU =
  /failed to fetch dynamically imported module|error loading dynamically imported module|importing a module script failed|unable to preload css/i

export function pareceVersaoDesatualizada(erro: unknown): boolean {
  const mensagem = erro instanceof Error ? erro.message : String(erro)
  return PADRAO_IMPORT_FALHOU.test(mensagem)
}

/**
 * `sessionStorage` pode lançar em aba anônima ou com armazenamento bloqueado.
 * Nesse caso a resposta é `true` — sem onde registrar a tentativa, não há como
 * impedir o laço, então é melhor não recarregar e mostrar o erro.
 */
export function jaTentouRecarregar(agora: number = Date.now()): boolean {
  try {
    const bruto = sessionStorage.getItem(CHAVE)
    if (bruto === null) return false
    const quando = Number(bruto)
    if (!Number.isFinite(quando)) return false
    return agora - quando < JANELA_MS
  } catch {
    return true
  }
}

export function registrarRecarga(agora: number = Date.now()): void {
  try {
    sessionStorage.setItem(CHAVE, String(agora))
  } catch {
    // Sem armazenamento disponível. `jaTentouRecarregar` já devolve `true`
    // nesse cenário, então a recarga não chega a acontecer.
  }
}
