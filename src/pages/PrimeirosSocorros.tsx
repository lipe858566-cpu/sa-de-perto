import { AvisoEmergencia } from '@/components/estados/AvisoEmergencia'
import { FonteOficial } from '@/components/estados/FonteOficial'
import { useTituloPagina } from '@/hooks/useTituloPagina'

type Situacao = {
  id: string
  titulo: string
  comoReconhecer: string
  oQueFazer: string[]
  oQueNaoFazer: string[]
}

const SITUACOES: Situacao[] = [
  {
    id: 'desmaio',
    titulo: 'Desmaio',
    comoReconhecer: 'A pessoa perde a consciência por pouco tempo e cai, mas continua respirando.',
    oQueFazer: [
      'Deite a pessoa de costas e eleve as pernas, se for possível fazer isso sem forçar.',
      'Afrouxe roupas apertadas no pescoço e na cintura.',
      'Mantenha o ambiente arejado e as pessoas afastadas.',
      'Se não recobrar a consciência em pouco tempo, ligue 192.',
    ],
    oQueNaoFazer: [
      'Não jogue água no rosto.',
      'Não dê nada para beber enquanto a pessoa não estiver totalmente consciente.',
      'Não sacuda nem bata no rosto.',
    ],
  },
  {
    id: 'engasgo',
    titulo: 'Engasgo',
    comoReconhecer:
      'A pessoa leva as mãos ao pescoço, não consegue falar nem tossir com força, e o rosto pode mudar de cor.',
    oQueFazer: [
      'Se a pessoa consegue tossir, incentive a tosse — ela é mais eficaz que qualquer manobra.',
      'Se não consegue tossir nem falar, peça para alguém ligar 192 imediatamente.',
      'Siga as instruções que o atendente do 192 der pelo telefone.',
    ],
    oQueNaoFazer: [
      'Não tente retirar o objeto com os dedos às cegas: isso pode empurrá-lo mais fundo.',
      'Não dê água.',
      'Não execute manobras que você não aprendeu em treinamento.',
    ],
  },
  {
    id: 'queimadura',
    titulo: 'Queimadura',
    comoReconhecer: 'Pele vermelha, dolorida, com ou sem bolhas, após contato com calor ou líquido quente.',
    oQueFazer: [
      'Resfrie a área com água corrente em temperatura ambiente por alguns minutos.',
      'Cubra com pano limpo e seco.',
      'Procure atendimento se a queimadura for extensa, profunda, no rosto, nas mãos ou nas articulações.',
    ],
    oQueNaoFazer: [
      'Não passe manteiga, pasta de dente, borra de café ou qualquer produto caseiro.',
      'Não estoure bolhas.',
      'Não use gelo diretamente sobre a pele.',
    ],
  },
  {
    id: 'sangramento',
    titulo: 'Sangramento',
    comoReconhecer: 'Perda de sangue visível por um ferimento.',
    oQueFazer: [
      'Pressione o local com pano limpo, de forma firme e contínua.',
      'Se possível, eleve a parte do corpo que está sangrando.',
      'Se o sangramento for intenso ou não parar, ligue 192.',
    ],
    oQueNaoFazer: [
      'Não retire objetos encravados no ferimento.',
      'Não fique trocando o pano a cada instante: isso interrompe a formação do coágulo.',
      'Não aplique torniquete sem treinamento.',
    ],
  },
  {
    id: 'convulsao',
    titulo: 'Crise convulsiva',
    comoReconhecer: 'Movimentos involuntários do corpo, rigidez, perda de consciência.',
    oQueFazer: [
      'Afaste objetos que possam machucar a pessoa.',
      'Proteja a cabeça com algo macio.',
      'Vire a pessoa de lado quando os movimentos cessarem.',
      'Marque o horário de início e ligue 192 se durar muito ou se for a primeira vez.',
    ],
    oQueNaoFazer: [
      'Não coloque nada na boca da pessoa.',
      'Não tente segurar nem imobilizar os movimentos.',
      'Não ofereça água ou comida logo após a crise.',
    ],
  },
]

export function PrimeirosSocorros() {
  useTituloPagina('Primeiros socorros')

  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="font-heading text-3xl font-bold text-tinta md:text-4xl">Primeiros socorros</h1>

      <div className="mt-8">
        <AvisoEmergencia
          telefone="192"
          servico="SAMU"
          descricao="Em qualquer emergência, ligar é a primeira ação. A ligação é gratuita e o atendente orienta o que fazer até a ajuda chegar."
        />
      </div>

      <div className="mt-8 border-l-4 border-azul-cartilha bg-azul-cartilha/10 p-5">
        <p className="font-semibold text-tinta">Este conteúdo é informativo.</p>
        <p className="mt-2 text-tinta-suave">
          São orientações gerais e conservadoras, voltadas a reduzir risco até a chegada do
          socorro. <strong className="text-tinta">Não substituem curso de primeiros socorros
          nem atendimento profissional.</strong> Nenhuma manobra que exija treinamento é
          descrita aqui, de propósito: executá-la sem preparo pode piorar a situação.
        </p>
        <FonteOficial
          nome="SAMU 192 — Ministério da Saúde"
          url="https://www.gov.br/saude/pt-br/composicao/saes/samu-192"
          verificadoEm="23/10/2026"
        />
      </div>

      <div className="mt-12 space-y-12">
        {SITUACOES.map((situacao) => (
          <section key={situacao.id} aria-labelledby={`titulo-${situacao.id}`}>
            <h2
              id={`titulo-${situacao.id}`}
              className="font-heading text-2xl font-bold text-tinta"
            >
              {situacao.titulo}
            </h2>
            <p className="mt-2 text-tinta-suave">{situacao.comoReconhecer}</p>

            <h3 className="mt-6 font-heading font-semibold text-verde-posto">O que fazer</h3>
            <ul className="mt-2 space-y-2">
              {situacao.oQueFazer.map((item) => (
                <li key={item} className="flex gap-3 text-tinta-suave">
                  <span aria-hidden="true" className="text-verde-posto">
                    •
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <h3 className="mt-6 font-heading font-semibold text-vermelho-urgencia">
              O que não fazer
            </h3>
            <ul className="mt-2 space-y-2">
              {situacao.oQueNaoFazer.map((item) => (
                <li key={item} className="flex gap-3 text-tinta-suave">
                  <span aria-hidden="true" className="text-vermelho-urgencia">
                    •
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section aria-labelledby="titulo-curso" className="mt-14 border-t-2 border-border pt-8">
        <h2 id="titulo-curso" className="font-heading text-2xl font-bold text-tinta">
          Aprender de verdade
        </h2>
        <p className="mt-3 text-tinta-suave">
          Ler sobre primeiros socorros não é o mesmo que saber executá-los. Corpo de Bombeiros,
          Cruz Vermelha e serviços de saúde oferecem cursos presenciais com prática supervisionada
          — é isso que prepara alguém para agir com segurança.
        </p>
      </section>
    </div>
  )
}
