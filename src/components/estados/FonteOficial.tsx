import { ExternalLink } from 'lucide-react'

type Props = {
  /** Nome da fonte, como ela se identifica. */
  nome: string
  /** URL verificada. Omitir quando o link não pôde ser conferido. */
  url?: string
  /** Data em que o link foi verificado, em ISO 8601. */
  verificadoEm?: string
}

/**
 * Citação de fonte oficial para conteúdo editorial (RF08, RF09).
 *
 * Só exibe link quando ele foi efetivamente verificado. Fonte sem link
 * verificado aparece apenas pelo nome — nunca com URL presumida.
 */
export function FonteOficial({ nome, url, verificadoEm }: Props) {
  return (
    <p className="mt-2 text-sm text-tinta-suave">
      <strong className="text-tinta">Fonte:</strong>{' '}
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-azul-cartilha underline"
        >
          {nome}
          <ExternalLink className="size-3.5" aria-hidden="true" />
          <span className="sr-only">(abre em nova aba)</span>
        </a>
      ) : (
        nome
      )}
      {verificadoEm && ` — link verificado em ${verificadoEm}`}
    </p>
  )
}
