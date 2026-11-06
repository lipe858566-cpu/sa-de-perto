import type { ReactNode } from 'react'

type Props = {
  /** O que não foi encontrado. */
  titulo: string
  /** O próximo passo possível. Uma tela vazia é um convite a agir. */
  orientacao: string
  acao?: ReactNode
}

/**
 * Estado de resultado vazio (RF14). Distinto de erro: nada falhou, apenas não
 * há resultado para o que foi pedido.
 */
export function Vazio({ titulo, orientacao, acao }: Props) {
  return (
    <div className="border-2 border-dashed border-border px-4 py-12 text-center">
      <p className="font-heading text-xl font-semibold text-tinta">{titulo}</p>
      <p className="mx-auto mt-2 max-w-prose text-tinta-suave">{orientacao}</p>
      {acao && <div className="mt-6">{acao}</div>}
    </div>
  )
}
