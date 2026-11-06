/**
 * Procedência de todo dado que chega à interface (decisão D7).
 *
 * Nenhuma função retorna dado sem `origem`: não há valor padrão, o campo é
 * sempre explícito. Dado com origem `demonstrativo` OBRIGA a interface a
 * renderizar <SeloDadoDemo />.
 */
export type OrigemDado =
  /** Vindo da Overpass API / OpenStreetMap. Real, porém não oficial do SUS. */
  | 'openstreetmap'
  /** Fictício, criado para demonstrar a interface. Exige selo visível. */
  | 'demonstrativo'
  /** Texto redigido a partir de fonte oficial citada. */
  | 'editorial'

export type ComOrigem<T> = T & {
  origem: OrigemDado
  /** Data de obtenção ou de redação do dado, em ISO 8601 (AAAA-MM-DD). */
  obtidoEm: string
}
