import { z } from 'zod'

export const TIPOS_ATENDIMENTO = [
  'clinica-geral',
  'odontologia',
  'vacinacao',
  'pre-natal',
  'saude-mental',
] as const

export type TipoAtendimento = (typeof TIPOS_ATENDIMENTO)[number]

export const ROTULO_ATENDIMENTO: Record<TipoAtendimento, string> = {
  'clinica-geral': 'Clínica geral',
  odontologia: 'Odontologia',
  vacinacao: 'Vacinação',
  'pre-natal': 'Pré-natal',
  'saude-mental': 'Saúde mental',
}

/** Data de hoje em AAAA-MM-DD, para o mínimo do campo de data. */
export function hojeISO(): string {
  return new Date().toISOString().slice(0, 10)
}

/**
 * Esquema do formulário de solicitação (RF11).
 *
 * **Deliberadamente mínimo.** Não há CPF, cartão SUS, data de nascimento,
 * sintoma, diagnóstico ou qualquer informação clínica: dado de saúde é dado
 * pessoal sensível pela LGPD, e um exercício acadêmico não tem motivo para
 * coletá-lo (RNF08).
 *
 * `observacao` é livre, mas o rótulo no formulário avisa para não escrever
 * informação de saúde ali.
 */
export const agendamentoSchema = z.object({
  // O parâmetro `error` cobre também o caso de o campo vir `undefined`. Sem
  // ele, o Zod emite a mensagem padrão em inglês ("Invalid input: expected
  // string, received undefined"), que chegaria à tela do usuário.
  nome: z
    .string({ error: 'Informe como podemos chamar você. Pode ser só o primeiro nome.' })
    .trim()
    .min(2, 'Informe como podemos chamar você. Pode ser só o primeiro nome.')
    .max(80, 'Use no máximo 80 caracteres.'),

  contato: z
    .string({ error: 'Informe um telefone ou e-mail para contato.' })
    .trim()
    .min(8, 'Informe um telefone ou e-mail para contato.')
    .max(120, 'Use no máximo 120 caracteres.'),

  unidadeId: z
    .string({ error: 'Escolha a unidade onde quer ser atendido.' })
    .min(1, 'Escolha a unidade onde quer ser atendido.'),

  tipoAtendimento: z.enum(TIPOS_ATENDIMENTO, {
    error: 'Escolha o tipo de atendimento.',
  }),

  dataPreferida: z
    .string({ error: 'Escolha uma data de preferência.' })
    .min(1, 'Escolha uma data de preferência.')
    .refine((valor) => valor >= hojeISO(), 'A data precisa ser hoje ou depois.'),

  periodo: z.enum(['manha', 'tarde'], { error: 'Escolha manhã ou tarde.' }),

  observacao: z
    .string({ error: 'Use apenas texto na observação.' })
    .trim()
    .max(300, 'Use no máximo 300 caracteres.')
    .default(''),
})

export type DadosAgendamento = z.infer<typeof agendamentoSchema>
