import { useEffect } from 'react'
import { TriangleAlert } from 'lucide-react'
import { Link, useRouteError } from 'react-router-dom'

import { Carregando } from '@/components/estados/Carregando'
import { ITENS_NAV } from '@/components/layout/itens-nav'
import { useTituloPagina } from '@/hooks/useTituloPagina'
import {
  jaTentouRecarregar,
  pareceVersaoDesatualizada,
  registrarRecarga,
} from '@/lib/versaoDesatualizada'

/**
 * Tela de erro das rotas (`errorElement`).
 *
 * Sem isto, uma falha ao carregar uma página sob demanda cai na tela padrão do
 * React Router — a que começa com "Unexpected Application Error!" e termina
 * sugerindo ao desenvolvedor que escreva um `errorElement`. É uma tela de
 * depuração, não serve para quem está usando o site.
 *
 * O caso mais provável em produção é a aba estar aberta desde antes de uma
 * publicação nova; aí recarregar resolve. Ver `@/lib/versaoDesatualizada`.
 *
 * ⚠️ **Este componente é deliberadamente pobre em dependências.** Ele não pode
 * ser carregado sob demanda — se o erro for justamente a falha de um pedaço de
 * código, a própria tela de erro falharia ao carregar. Como fica no pacote
 * inicial, tudo o que ele importa pesa no primeiro carregamento de todo mundo.
 * Por isso o botão é um `<button>` comum em vez do `Button` de `components/ui`,
 * que arrasta `radix-ui` e `class-variance-authority` para o pacote principal
 * (medido: +35 kB). Não trocar por componentes do design system.
 */
export function ErroDeRota() {
  const erro = useRouteError()
  const versaoVelha = pareceVersaoDesatualizada(erro)
  const vaiRecarregar = versaoVelha && !jaTentouRecarregar()

  useEffect(() => {
    if (!vaiRecarregar) return
    registrarRecarga()
    globalThis.location.reload()
  }, [vaiRecarregar])

  if (vaiRecarregar) {
    // Estado momentâneo: a recarga já foi disparada pelo efeito acima.
    return <Carregando mensagem="O site foi atualizado. Recarregando…" />
  }

  return <PaginaDeErro versaoVelha={versaoVelha} erro={erro} />
}

function PaginaDeErro({ versaoVelha, erro }: { versaoVelha: boolean; erro: unknown }) {
  useTituloPagina('Erro ao carregar a página')

  /*
   * Duas mensagens porque são dois problemas diferentes, e dizer "o site foi
   * atualizado" num erro qualquer seria afirmar algo que não se sabe. No
   * primeiro caso a recarga já foi tentada e não resolveu, então o texto não
   * promete que tentar de novo resolve.
   */
  const mensagem = versaoVelha
    ? 'Não foi possível carregar esta parte do site.'
    : 'Algo deu errado ao abrir esta página.'

  const comoResolver = versaoVelha
    ? 'Isso costuma acontecer quando o site é atualizado com a aba aberta. A página já foi recarregada uma vez sem sucesso — se insistir, verifique sua conexão ou volte daqui a pouco.'
    : 'Você pode tentar carregar de novo ou ir para outra seção pelos links abaixo.'

  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="font-heading text-3xl font-bold text-tinta md:text-4xl">
        Erro ao carregar a página
      </h1>

      <div role="alert" className="mt-6 border-l-4 border-vermelho-urgencia bg-papel-2 px-4 py-6">
        <p className="flex items-start gap-2 font-semibold text-tinta">
          <TriangleAlert
            className="mt-0.5 size-5 shrink-0 text-vermelho-urgencia"
            aria-hidden="true"
          />
          {mensagem}
        </p>
        <p className="mt-2 pl-7 text-tinta-suave">{comoResolver}</p>
        <div className="mt-4 pl-7">
          <button
            type="button"
            onClick={() => {
              globalThis.location.reload()
            }}
            className="rounded-sm bg-verde-posto px-5 py-3 font-semibold text-papel"
          >
            Tentar de novo
          </button>
        </div>
      </div>

      <p className="mt-8 text-tinta-suave">Ou vá direto para outra seção:</p>
      <ul className="mt-4 space-y-2">
        {ITENS_NAV.map((item) => (
          <li key={item.para}>
            <Link
              to={item.para}
              className="inline-block py-1 font-medium text-azul-cartilha underline"
            >
              {item.rotulo}
            </Link>
          </li>
        ))}
      </ul>

      {/*
        O detalhe técnico fica fora do texto corrido: não ajuda quem está
        usando o site, mas ajuda quem for depurar. `import.meta.env.DEV`
        garante que não vai para o pacote publicado.
      */}
      {import.meta.env.DEV && erro instanceof Error && (
        <pre className="mt-8 overflow-x-auto border-l-4 border-tinta-suave bg-papel-2 p-4 text-sm text-tinta-suave">
          {erro.message}
        </pre>
      )}
    </section>
  )
}
