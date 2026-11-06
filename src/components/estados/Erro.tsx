import { TriangleAlert } from 'lucide-react'

import { Button } from '@/components/ui/button'

type Props = {
  /** O que aconteceu, em linguagem comum. Sem jargão, sem stack trace. */
  mensagem: string
  /** Como resolver, quando houver um caminho. */
  comoResolver?: string
  aoTentarNovamente?: () => void
}

/**
 * Estado de erro (RF14). O texto diz o que aconteceu e o que fazer — não pede
 * desculpas e não é vago.
 */
export function Erro({ mensagem, comoResolver, aoTentarNovamente }: Props) {
  return (
    <div role="alert" className="border-l-4 border-vermelho-urgencia bg-papel-2 px-4 py-6">
      <p className="flex items-start gap-2 font-semibold text-tinta">
        <TriangleAlert className="mt-0.5 size-5 shrink-0 text-vermelho-urgencia" aria-hidden="true" />
        {mensagem}
      </p>
      {comoResolver && <p className="mt-2 pl-7 text-tinta-suave">{comoResolver}</p>}
      {aoTentarNovamente && (
        <div className="mt-4 pl-7">
          <Button type="button" onClick={aoTentarNovamente}>
            Tentar de novo
          </Button>
        </div>
      )}
    </div>
  )
}
