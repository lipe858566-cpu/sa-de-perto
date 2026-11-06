import { Info } from 'lucide-react'

import type { OrigemDado } from '@/types/dados'

const TEXTO: Record<OrigemDado, string | null> = {
  demonstrativo: 'Dado demonstrativo. Serve para mostrar a interface e não corresponde a um serviço real.',
  openstreetmap: 'Dado do OpenStreetMap. É informação real da comunidade, mas não é cadastro oficial do SUS.',
  editorial: null,
}

/**
 * Identifica a procedência do dado exibido (decisão D7).
 *
 * Origem `demonstrativo` exige este selo de forma visível. Origem `editorial`
 * não usa selo: a fonte é citada no próprio texto da página.
 */
export function SeloDadoDemo({ origem }: { origem: OrigemDado }) {
  const texto = TEXTO[origem]
  if (!texto) return null

  const ehDemo = origem === 'demonstrativo'

  return (
    <p
      className={`flex items-start gap-2 border-l-4 px-3 py-2 text-sm ${
        ehDemo
          ? 'border-amarelo-campanha bg-amarelo-campanha/15 text-tinta'
          : 'border-azul-cartilha bg-azul-cartilha/10 text-tinta'
      }`}
    >
      <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>
        <strong>{ehDemo ? 'Exemplo:' : 'Origem:'}</strong> {texto}
      </span>
    </p>
  )
}
