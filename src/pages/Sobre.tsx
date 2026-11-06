import { useTituloPagina } from '@/hooks/useTituloPagina'

export function Sobre() {
  useTituloPagina('Sobre o projeto')

  return (
    <article className="mx-auto max-w-prose px-4 py-14">
      <h1 className="font-heading text-3xl font-bold text-tinta md:text-4xl">Sobre o projeto</h1>

      <p className="mt-6 text-lg text-tinta-suave">
        O Saúde Perto é um trabalho acadêmico da disciplina Front-End Frameworks da UNINASSAU.
        É um exercício de desenvolvimento web, não um serviço de saúde.
      </p>

      <h2 className="mt-10 font-heading text-2xl font-bold text-tinta">O problema</h2>
      <p className="mt-3 text-tinta-suave">
        O acesso à atenção primária muitas vezes não falha por ausência de serviço, mas por
        falta de informação organizada sobre ele: qual unidade atende perto de casa, o que ela
        oferece, em que horário. Essa dispersão leva gente ao pronto-socorro sem necessidade e
        atrasa cuidado preventivo.
      </p>

      <h2 className="mt-10 font-heading text-2xl font-bold text-tinta">
        O que este site não faz
      </h2>
      <ul className="mt-3 space-y-3 text-tinta-suave">
        <li>
          <strong className="text-tinta">Não marca consultas.</strong> O formulário de
          agendamento demonstra o fluxo de uma solicitação. Nada é enviado, registrado ou
          recebido por qualquer unidade de saúde.
        </li>
        <li>
          <strong className="text-tinta">A conta não é um cadastro no SUS.</strong> O login
          serve para acessar o protótipo. Os dados da conta são gerenciados pelo Supabase.
        </li>
        <li>
          <strong className="text-tinta">Não substitui profissional de saúde.</strong> O
          conteúdo educativo é informativo e cita a fonte de onde foi derivado.
        </li>
        <li>
          <strong className="text-tinta">Não é cadastro oficial do SUS.</strong> Os dados de
          unidades vêm do OpenStreetMap, uma base colaborativa. A completude varia por
          município.
        </li>
      </ul>

      <h2 className="mt-10 font-heading text-2xl font-bold text-tinta">Por que essas limitações</h2>
      <p className="mt-3 text-tinta-suave">
        O site usa o Supabase para autenticação, mas não tem integração com os sistemas oficiais
        de saúde. Agendamentos reais, histórico clínico e notificações dependem de serviços
        autorizados que não fazem parte deste trabalho.
      </p>

      <h2 className="mt-10 font-heading text-2xl font-bold text-tinta">Em uma emergência</h2>
      <p className="mt-3 text-tinta-suave">
        Não use este site. Ligue <strong className="text-tinta">192</strong> para o SAMU. Para
        apoio emocional, o CVV atende no <strong className="text-tinta">188</strong>, 24 horas
        por dia.
      </p>
    </article>
  )
}
