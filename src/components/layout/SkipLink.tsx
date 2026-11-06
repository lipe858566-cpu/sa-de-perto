/**
 * Primeiro elemento focável da página (RF15). Fica fora da tela até receber
 * foco pelo teclado, então aparece sobre o cabeçalho.
 */
export function SkipLink() {
  return (
    <a
      href="#conteudo"
      className="sr-only rounded-sm bg-amarelo-campanha px-4 py-3 font-semibold text-tinta focus-visible:not-sr-only focus-visible:absolute focus-visible:top-2 focus-visible:left-2 focus-visible:z-50"
    >
      Pular para o conteúdo
    </a>
  )
}
