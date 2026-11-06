import { BookOpenText, Brain, CalendarCheck, LifeBuoy, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

import { SeloDadoDemo } from '@/components/estados/SeloDadoDemo'
import { CAMPANHAS_DESTAQUE } from '@/data/campanhas-destaque'
import { useTituloPagina } from '@/hooks/useTituloPagina'

const SERVICOS = [
  {
    para: '/unidades',
    icone: MapPin,
    titulo: 'Unidades de saúde',
    texto: 'Procure postos e clínicas por município e veja onde ficam no mapa.',
  },
  {
    para: '/primeiros-socorros',
    icone: LifeBuoy,
    titulo: 'Primeiros socorros',
    texto: 'O que fazer nos primeiros minutos, com a fonte de cada orientação.',
  },
  {
    para: '/saude-mental',
    icone: Brain,
    titulo: 'Saúde mental',
    texto: 'Sinais de alerta e onde procurar apoio, sem autodiagnóstico.',
  },
  {
    para: '/agendamento',
    icone: CalendarCheck,
    titulo: 'Agendamento',
    texto: 'Demonstração do fluxo de solicitação. Não marca consulta.',
  },
]

export function Inicio() {
  useTituloPagina('Início')

  return (
    <>
      {/* Faixa principal: a pergunta com que a pessoa chega. */}
      <section className="faixa-escura bg-verde-posto text-papel">
        <div className="mx-auto max-w-5xl px-4 py-14 md:py-20">
          <h1 className="max-w-3xl font-heading text-4xl font-bold tracking-tight md:text-6xl">
            Onde tem atendimento perto de mim?
          </h1>
          <p className="mt-6 max-w-xl text-lg text-papel/90">
            Unidades de saúde, temas de prevenção e orientação confiável de primeiros socorros
            e saúde mental, reunidos em um lugar.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/unidades"
              className="rounded-sm bg-amarelo-campanha px-6 py-4 text-center font-semibold text-tinta"
            >
              Procurar unidades
            </Link>
            <Link
              to="/campanhas"
              className="rounded-sm border-2 border-papel px-6 py-4 text-center font-semibold text-papel"
            >
              Ver temas de prevenção
            </Link>
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section aria-labelledby="titulo-servicos" className="mx-auto max-w-5xl px-4 py-14">
        <h2 id="titulo-servicos" className="font-heading text-2xl font-bold text-tinta md:text-3xl">
          O que você encontra aqui
        </h2>
        <ul className="mt-8 grid gap-px bg-border sm:grid-cols-2">
          {SERVICOS.map((servico) => {
            const Icone = servico.icone
            return (
              <li key={servico.para} className="bg-papel">
                <Link to={servico.para} className="flex h-full gap-4 p-6">
                  <Icone className="mt-1 size-6 shrink-0 text-verde-posto" aria-hidden="true" />
                  <span>
                    <span className="block font-heading text-lg font-semibold text-tinta underline">
                      {servico.titulo}
                    </span>
                    <span className="mt-1 block text-tinta-suave">{servico.texto}</span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      {/* Temas de prevenção em destaque */}
      <section aria-labelledby="titulo-campanhas" className="border-y-2 border-border bg-papel-2">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <h2
            id="titulo-campanhas"
            className="font-heading text-2xl font-bold text-tinta md:text-3xl"
          >
            Temas de prevenção
          </h2>
          <div className="mt-4 max-w-prose">
            <SeloDadoDemo origem="demonstrativo" />
          </div>
          <ul className="mt-8 grid gap-6 md:grid-cols-3">
            {CAMPANHAS_DESTAQUE.map((campanha) => (
              <li key={campanha.id} className="border-t-4 border-amarelo-campanha bg-papel p-6">
                <h3 className="font-heading text-lg font-semibold text-tinta">{campanha.tema}</h3>
                <p className="mt-2 text-tinta-suave">{campanha.descricao}</p>
                <p className="mt-4 text-sm font-medium text-verde-posto">{campanha.publico}</p>
              </li>
            ))}
          </ul>
          <p className="mt-8">
            <Link to="/campanhas" className="font-semibold text-azul-cartilha underline">
              Ver todos os temas
            </Link>
          </p>
        </div>
      </section>

      {/* Limites do projeto, dito de frente */}
      <section aria-labelledby="titulo-limites" className="mx-auto max-w-5xl px-4 py-14">
        <h2 id="titulo-limites" className="font-heading text-2xl font-bold text-tinta">
          O que este site não faz
        </h2>
        <ul className="mt-6 max-w-prose space-y-3 text-tinta-suave">
          <li className="flex gap-3">
            <BookOpenText className="mt-1 size-5 shrink-0 text-tinta" aria-hidden="true" />
            <span>
              Não marca consultas. O formulário de agendamento é uma demonstração e nada é
              enviado a nenhum serviço de saúde.
            </span>
          </li>
          <li className="flex gap-3">
            <BookOpenText className="mt-1 size-5 shrink-0 text-tinta" aria-hidden="true" />
            <span>
              Não substitui atendimento profissional. O conteúdo é informativo e cita a fonte.
            </span>
          </li>
        </ul>
        <p className="mt-6">
          <Link to="/sobre" className="font-semibold text-azul-cartilha underline">
            Entender o projeto e seus limites
          </Link>
        </p>
      </section>
    </>
  )
}
