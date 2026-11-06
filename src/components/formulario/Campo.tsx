import type { ReactNode } from 'react'
import { CircleAlert } from 'lucide-react'

type Props = {
  id: string
  rotulo: string
  /** Texto de apoio, ligado ao campo por aria-describedby. */
  ajuda?: string
  erro?: string | undefined
  obrigatorio?: boolean
  children: (props: { id: string; descritoPor: string; invalido: boolean }) => ReactNode
}

/**
 * Envolve um controle de formulário com rótulo, ajuda e erro acessíveis (RF11).
 *
 * O erro é ligado ao campo por `aria-describedby` e marcado com `aria-invalid`,
 * e vem acompanhado de ícone e texto — nunca é comunicado só pela cor.
 */
export function Campo({ id, rotulo, ajuda, erro, obrigatorio, children }: Props) {
  const idAjuda = `${id}-ajuda`
  const idErro = `${id}-erro`
  const descritoPor = [ajuda ? idAjuda : '', erro ? idErro : ''].filter(Boolean).join(' ')

  return (
    <div>
      <label htmlFor={id} className="block font-medium text-tinta">
        {rotulo}
        {obrigatorio && (
          <span className="text-vermelho-urgencia">
            {' '}
            *<span className="sr-only"> (obrigatório)</span>
          </span>
        )}
      </label>

      {ajuda && (
        <p id={idAjuda} className="mt-1 text-sm text-tinta-suave">
          {ajuda}
        </p>
      )}

      <div className="mt-2">{children({ id, descritoPor, invalido: Boolean(erro) })}</div>

      {erro && (
        <p id={idErro} className="mt-2 flex items-start gap-2 text-vermelho-urgencia">
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{erro}</span>
        </p>
      )}
    </div>
  )
}
