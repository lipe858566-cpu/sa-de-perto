import { Loader2 } from 'lucide-react'

/**
 * Estado de carregamento (RF14).
 *
 * `<output>` já tem `role="status"` implícito, então a mudança é anunciada a
 * leitores de tela sem precisar do atributo.
 */
export function Carregando({ mensagem = 'Carregando…' }: { mensagem?: string }) {
  return (
    <output aria-live="polite" className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-16">
      <Loader2 className="size-5 animate-spin text-verde-posto" aria-hidden="true" />
      <span className="text-tinta-suave">{mensagem}</span>
    </output>
  )
}
