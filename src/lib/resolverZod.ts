import type { FieldValues, Resolver } from 'react-hook-form'
import type { ZodType } from 'zod'

/**
 * Liga um esquema Zod ao react-hook-form.
 *
 * Escrito à mão em vez de usar `@hookform/resolvers`: aquele pacote arrasta
 * `@typeschema/*` e `effect` como peers opcionais, o que gera conflito de
 * resolução com a árvore atual. São poucas linhas e evita a dependência.
 */
export function resolverZod<T extends FieldValues>(schema: ZodType<T>): Resolver<T> {
  return async (valores) => {
    const resultado = schema.safeParse(valores)

    if (resultado.success) {
      return { values: resultado.data, errors: {} }
    }

    const errors: Record<string, { type: string; message: string }> = {}
    for (const problema of resultado.error.issues) {
      const campo = problema.path.join('.')
      // Mantém apenas a primeira mensagem por campo: mostrar várias de uma vez
      // sobrecarrega quem usa leitor de tela.
      if (campo && !errors[campo]) {
        errors[campo] = { type: problema.code, message: problema.message }
      }
    }

    return { values: {}, errors: errors as never }
  }
}
