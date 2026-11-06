import { useTituloPagina } from '@/hooks/useTituloPagina'

export function Acessibilidade() {
  useTituloPagina('Acessibilidade')

  return (
    <article className="mx-auto max-w-prose px-4 py-14">
      <h1 className="font-heading text-3xl font-bold text-tinta md:text-4xl">Acessibilidade</h1>

      <p className="mt-6 text-lg text-tinta-suave">
        A meta do projeto é atender as WCAG 2.2 no nível AA. Esta página registra o que já foi
        feito e o que ainda não foi verificado — sem declarar conformidade que não foi testada.
      </p>

      <h2 className="mt-10 font-heading text-2xl font-bold text-tinta">Decisões tomadas</h2>
      <ul className="mt-3 space-y-2 text-tinta-suave">
        <li>Texto base em 18 pixels, acima do comum, porque o público inclui pessoas idosas.</li>
        <li>
          Pares de cor do tema com contraste medido, não estimado. O mínimo adotado é 4,5:1 para
          texto comum.
        </li>
        <li>Contorno de foco de 3 pixels, visível em qualquer elemento que receba foco.</li>
        <li>
          Link “pular para o conteúdo” como primeiro item alcançável pelo teclado.
        </li>
        <li>
          Componentes interativos construídos sobre Radix UI, que trata foco, semântica e
          teclado.
        </li>
        <li>Animações desligadas quando o sistema pede redução de movimento.</li>
      </ul>

      <h2 className="mt-10 font-heading text-2xl font-bold text-tinta">
        O que ainda não foi verificado
      </h2>
      <p className="mt-3 text-tinta-suave">
        Nenhuma auditoria com leitor de tela foi feita. Não houve teste em dispositivo móvel
        real nem verificação com ampliação de 200%. Verificação automatizada cobre uma fração
        pequena das WCAG, então a ausência de erro automático não significa conformidade.
      </p>

      <h2 className="mt-10 font-heading text-2xl font-bold text-tinta">Encontrou uma barreira?</h2>
      <p className="mt-3 text-tinta-suave">
        Este é um projeto acadêmico sem canal de atendimento. Problemas de acessibilidade podem
        ser relatados no repositório do projeto.
      </p>
    </article>
  )
}
