import type { Campanha } from '@/types/campanha'

/**
 * TEMAS de saúde preventiva, para demonstrar a interface.
 *
 * Não são campanhas vigentes. Deliberadamente **não** têm período, data, meta,
 * número, órgão responsável nem qualquer dado institucional: inventar isso
 * seria falsear informação de saúde pública (ver docs/apis.md §6).
 *
 * O conteúdo se limita a orientação preventiva de senso comum e amplamente
 * estabelecida, e sempre encaminha a pessoa ao serviço de saúde — nunca
 * substitui avaliação profissional.
 */
export const CAMPANHAS_DEMO: Campanha[] = [
  {
    id: 'vacinacao',
    tema: 'Vacinação em dia',
    resumo: 'Conferir a caderneta e completar as doses atrasadas.',
    porQueImporta:
      'A vacinação protege quem se vacina e também quem não pode se vacinar, como bebês muito novos e pessoas com imunidade baixa. Doses atrasadas deixam essa proteção incompleta.',
    oQueFazer: [
      'Procure sua caderneta de vacinação, sua e das crianças da casa.',
      'Leve a caderneta à unidade de saúde para a equipe conferir o que falta.',
      'Se a caderneta tiver sido perdida, a unidade orienta como proceder.',
    ],
    publico: 'todas-idades',
    ondeProcurar: 'Unidade Básica de Saúde mais próxima',
    origem: 'demonstrativo',
    obtidoEm: '2026-10-23',
  },
  {
    id: 'pressao-arterial',
    tema: 'Medir a pressão',
    resumo: 'Pressão alta costuma não dar sintoma nenhum.',
    porQueImporta:
      'A pressão alta pode existir por anos sem sinal perceptível, enquanto afeta coração, rins e cérebro. A medição é o único jeito de saber.',
    oQueFazer: [
      'Meça a pressão na unidade de saúde, mesmo se estiver se sentindo bem.',
      'Se já tem diagnóstico, mantenha o acompanhamento e não interrompa medicação por conta própria.',
      'Converse com a equipe sobre sal, atividade física e sono.',
    ],
    publico: 'adultos',
    ondeProcurar: 'Unidade Básica de Saúde mais próxima',
    origem: 'demonstrativo',
    obtidoEm: '2026-10-23',
  },
  {
    id: 'saude-bucal',
    tema: 'Saúde bucal',
    resumo: 'Avaliação odontológica regular evita tratamento mais longo.',
    porQueImporta:
      'Problema de dente raramente melhora sozinho. Quanto mais cedo é avaliado, mais simples e menos doloroso costuma ser o tratamento.',
    oQueFazer: [
      'Procure avaliação odontológica na unidade de saúde, mesmo sem dor.',
      'Escove os dentes e use fio dental diariamente.',
      'Dor de dente persistente é motivo para procurar atendimento, não para esperar passar.',
    ],
    publico: 'todas-idades',
    ondeProcurar: 'Unidade de saúde com serviço de odontologia',
    origem: 'demonstrativo',
    obtidoEm: '2026-10-23',
  },
  {
    id: 'pre-natal',
    tema: 'Pré-natal desde o começo',
    resumo: 'O acompanhamento começa assim que a gravidez é confirmada.',
    porQueImporta:
      'O pré-natal acompanha a saúde da gestante e do bebê e permite identificar cedo situações que pedem cuidado específico.',
    oQueFazer: [
      'Procure a unidade de saúde assim que suspeitar ou confirmar a gravidez.',
      'Compareça às consultas marcadas, mesmo se estiver tudo bem.',
      'Leve as dúvidas por escrito, para não esquecer na hora.',
    ],
    publico: 'gestantes',
    ondeProcurar: 'Unidade Básica de Saúde mais próxima',
    origem: 'demonstrativo',
    obtidoEm: '2026-10-23',
  },
  {
    id: 'atividade-fisica',
    tema: 'Movimento no dia a dia',
    resumo: 'Atividade física regular, no ritmo que for possível.',
    porQueImporta:
      'Movimentar-se com regularidade ajuda a controlar pressão, peso e glicemia, e também tem efeito sobre sono e humor.',
    oQueFazer: [
      'Comece pelo que já cabe na sua rotina: caminhada, escada, dança.',
      'Se tem alguma condição de saúde, converse com a equipe antes de aumentar a intensidade.',
      'Pergunte na unidade se há grupo de atividade física na sua região.',
    ],
    publico: 'todas-idades',
    ondeProcurar: 'Unidade Básica de Saúde mais próxima',
    origem: 'demonstrativo',
    obtidoEm: '2026-10-23',
  },
  {
    id: 'saude-do-idoso',
    tema: 'Cuidado com quedas',
    resumo: 'Prevenir queda é prevenir perda de autonomia.',
    porQueImporta:
      'Uma queda pode levar a fratura e a longo tempo de recuperação. Boa parte das causas está no ambiente da casa e pode ser corrigida.',
    oQueFazer: [
      'Retire tapetes soltos e melhore a iluminação dos corredores.',
      'Instale apoio no banheiro, se possível.',
      'Faça avaliação de visão e converse com a equipe sobre os remédios em uso.',
    ],
    publico: 'idosos',
    ondeProcurar: 'Unidade Básica de Saúde mais próxima',
    origem: 'demonstrativo',
    obtidoEm: '2026-10-23',
  },
]
