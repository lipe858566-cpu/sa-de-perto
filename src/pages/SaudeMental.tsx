import { AvisoEmergencia } from '@/components/estados/AvisoEmergencia'
import { FonteOficial } from '@/components/estados/FonteOficial'
import { useTituloPagina } from '@/hooks/useTituloPagina'

const SINAIS = [
  'Tristeza ou irritação que persiste por semanas e atrapalha a rotina.',
  'Perder o interesse por coisas que antes davam prazer.',
  'Mudança importante no sono: dormir muito menos ou muito mais que o habitual.',
  'Mudança importante no apetite ou no peso.',
  'Cansaço constante, sem explicação física.',
  'Dificuldade de concentração em tarefas simples.',
  'Afastar-se de pessoas próximas.',
  'Aumento no uso de álcool ou outras substâncias.',
]

const COMO_AJUDAR = [
  {
    titulo: 'Pergunte de forma direta',
    texto:
      'Perguntar se a pessoa está pensando em se machucar não planta a ideia. Abre espaço para ela falar sobre algo que costuma ser difícil de iniciar.',
  },
  {
    titulo: 'Escute sem corrigir',
    texto:
      'Ouvir sem julgar, sem minimizar e sem oferecer solução imediata já ajuda. Frases como "tem gente em situação pior" afastam.',
  },
  {
    titulo: 'Ofereça companhia concreta',
    texto:
      'Acompanhar até a unidade de saúde, ajudar a marcar o atendimento ou simplesmente ficar junto costuma valer mais que conselho.',
  },
  {
    titulo: 'Leve risco a sério',
    texto:
      'Se houver menção a morte, plano ou despedida, não deixe a pessoa sozinha e procure ajuda imediatamente.',
  },
]

export function SaudeMental() {
  useTituloPagina('Saúde mental')

  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="font-heading text-3xl font-bold text-tinta md:text-4xl">Saúde mental</h1>

      <div className="mt-8">
        <AvisoEmergencia
          telefone="188"
          servico="CVV"
          descricao="O Centro de Valorização da Vida atende 24 horas por dia, de graça e em sigilo. Se o sofrimento está insuportável, ligar é um passo legítimo — a qualquer hora."
        />
      </div>

      <div className="mt-4">
        <AvisoEmergencia
          telefone="192"
          servico="SAMU"
          descricao="Em emergência com risco imediato à vida, ligue para o SAMU."
        />
      </div>

      <div className="mt-8 border-l-4 border-azul-cartilha bg-azul-cartilha/10 p-5">
        <p className="font-semibold text-tinta">Este conteúdo é informativo.</p>
        <p className="mt-2 text-tinta-suave">
          Não é diagnóstico, não é triagem e não substitui acompanhamento profissional. Esta
          página <strong className="text-tinta">não tem questionário nem teste</strong> — sofrimento
          mental não se mede por formulário de site, e autodiagnóstico costuma atrapalhar mais
          que ajudar.
        </p>
        <FonteOficial
          nome="Saúde mental — Ministério da Saúde"
          url="https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-mental"
          verificadoEm="23/10/2026"
        />
        <FonteOficial nome="Centro de Valorização da Vida (CVV) — telefone 188" />
      </div>

      <section aria-labelledby="titulo-sinais" className="mt-12">
        <h2 id="titulo-sinais" className="font-heading text-2xl font-bold text-tinta">
          Sinais que merecem atenção
        </h2>
        <p className="mt-3 text-tinta-suave">
          Nenhum item isolado significa diagnóstico. O que costuma importar é a{' '}
          <strong className="text-tinta">persistência</strong> e o quanto atrapalha o dia a dia.
        </p>
        <ul className="mt-5 space-y-2">
          {SINAIS.map((sinal) => (
            <li key={sinal} className="flex gap-3 text-tinta-suave">
              <span aria-hidden="true" className="text-verde-posto">
                •
              </span>
              {sinal}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="titulo-ajudar" className="mt-12">
        <h2 id="titulo-ajudar" className="font-heading text-2xl font-bold text-tinta">
          Como ajudar alguém
        </h2>
        <div className="mt-5 space-y-6">
          {COMO_AJUDAR.map((item) => (
            <div key={item.titulo} className="border-l-4 border-verde-claro pl-4">
              <h3 className="font-heading font-semibold text-tinta">{item.titulo}</h3>
              <p className="mt-1 text-tinta-suave">{item.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="titulo-onde" className="mt-12">
        <h2 id="titulo-onde" className="font-heading text-2xl font-bold text-tinta">
          Onde procurar atendimento
        </h2>
        <dl className="mt-5 space-y-5">
          <div>
            <dt className="font-semibold text-tinta">Unidade Básica de Saúde</dt>
            <dd className="mt-1 text-tinta-suave">
              É a porta de entrada. A equipe avalia e encaminha para o serviço adequado quando
              necessário.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-tinta">CAPS — Centro de Atenção Psicossocial</dt>
            <dd className="mt-1 text-tinta-suave">
              Serviço do SUS especializado em saúde mental, com equipe multiprofissional.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-tinta">CVV — 188</dt>
            <dd className="mt-1 text-tinta-suave">
              Apoio emocional por telefone, 24 horas, gratuito e sigiloso.
            </dd>
          </div>
        </dl>
      </section>
    </div>
  )
}
