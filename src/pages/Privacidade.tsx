import { useTituloPagina } from '@/hooks/useTituloPagina'

export function Privacidade() {
  useTituloPagina('Privacidade')

  return (
    <article className="mx-auto max-w-prose px-4 py-14">
      <h1 className="font-heading text-3xl font-bold text-tinta md:text-4xl">Privacidade</h1>

      <p className="mt-6 text-lg text-tinta-suave">
        O Saúde Perto é um projeto acadêmico. A conta de acesso é gerenciada pelo Supabase,
        enquanto os agendamentos continuam sendo apenas uma demonstração.
      </p>

      <h2 className="mt-10 font-heading text-2xl font-bold text-tinta">Dados do cadastro</h2>
      <p className="mt-3 text-tinta-suave">
        Para criar sua conta, solicitamos e-mail, telefone, endereço e data de nascimento.
        Esses dados ficam associados à sua conta no Supabase Auth. A senha é processada pelo
        serviço de autenticação e não é salva pelo código do site.
      </p>

      <h2 className="mt-10 font-heading text-2xl font-bold text-tinta">Agendamentos</h2>
      <p className="mt-3 text-tinta-suave">
        O formulário de agendamento é demonstrativo. Nenhuma solicitação é enviada a uma
        unidade de saúde, nem vinculada à conta criada neste site.
      </p>

      <h2 className="mt-10 font-heading text-2xl font-bold text-tinta">Serviços externos</h2>
      <p className="mt-3 text-tinta-suave">
        O Supabase é usado para o cadastro, o login e a recuperação de senha. Para localizar
        unidades no mapa, o site também consulta serviços do OpenStreetMap, que podem receber
        dados técnicos da conexão, como o endereço IP e os termos pesquisados.
      </p>

      <h2 className="mt-10 font-heading text-2xl font-bold text-tinta">Sessão no navegador</h2>
      <p className="mt-3 text-tinta-suave">
        Para manter você conectado, o Supabase pode armazenar informações da sessão no
        navegador. Em computadores compartilhados, lembre-se de sair da conta ao terminar.
      </p>

      <h2 className="mt-10 font-heading text-2xl font-bold text-tinta">Uso do projeto</h2>
      <p className="mt-3 text-tinta-suave">
        Este é um protótipo acadêmico, não um serviço oficial de saúde. Antes de disponibilizá-lo
        ao público e coletar dados reais, será necessário definir responsáveis pelo tratamento
        de dados, uma política de privacidade completa e os procedimentos exigidos pela LGPD.
      </p>
    </article>
  )
}
