const BASE = 'w-full rounded-sm border-2 bg-papel px-4 py-3 text-tinta placeholder:text-tinta-suave'

/** Borda vermelha sinaliza o campo inválido, mas nunca sozinha: o texto do
 *  erro e o ícone carregam a mesma informação (WCAG 1.4.1). */
export function classeControle(invalido: boolean): string {
  return `${BASE} ${invalido ? 'border-vermelho-urgencia' : 'border-input'}`
}
