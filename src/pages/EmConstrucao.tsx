import { Vazio } from '@/components/estados/Vazio'
import { useTituloPagina } from '@/hooks/useTituloPagina'

type Props = {
  titulo: string
  /** Em que fase do projeto esta página será construída. */
  fase: string
}

/**
 * Página de rota já navegável cujo conteúdo ainda não foi implementado.
 *
 * Existe para que a navegação da Fase 3 seja verificável de ponta a ponta sem
 * prometer funcionalidade inexistente.
 */
export function EmConstrucao({ titulo, fase }: Props) {
  useTituloPagina(titulo)

  return (
    <section className="mx-auto max-w-5xl px-4 py-14">
      <h1 className="font-heading text-3xl font-bold text-tinta md:text-4xl">{titulo}</h1>
      <div className="mt-8">
        <Vazio
          titulo="Esta seção ainda não foi construída"
          orientacao={`O conteúdo entra na ${fase} do projeto. A rota já existe para que a navegação possa ser verificada.`}
        />
      </div>
    </section>
  )
}
