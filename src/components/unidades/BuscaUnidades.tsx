import { useState } from 'react'
import { Search } from 'lucide-react'

type Props = {
  aoBuscar: (termo: string) => void
  carregando: boolean
}

/**
 * Busca por localidade (RF02).
 *
 * A consulta é disparada apenas no envio do formulário, nunca a cada tecla:
 * a política do Nominatim limita a 1 requisição por segundo e proíbe uso
 * pesado (docs/apis.md §3).
 */
export function BuscaUnidades({ aoBuscar, carregando }: Props) {
  const [termo, setTermo] = useState('')

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        aoBuscar(termo)
      }}
      className="border-2 border-border bg-papel-2 p-5"
    >
      <label htmlFor="busca-local" className="block font-heading text-lg font-semibold text-tinta">
        Buscar unidades perto de um lugar
      </label>
      <p id="ajuda-busca" className="mt-1 text-tinta-suave">
        Digite um município, bairro ou endereço. Exemplo: Recife, PE.
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          id="busca-local"
          type="search"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          aria-describedby="ajuda-busca"
          placeholder="Município, bairro ou endereço"
          className="flex-1 rounded-sm border-2 border-input bg-papel px-4 py-3 text-tinta placeholder:text-tinta-suave"
        />
        <button
          type="submit"
          disabled={carregando || termo.trim().length === 0}
          className="flex items-center justify-center gap-2 rounded-sm bg-verde-posto px-6 py-3 font-semibold text-papel disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Search className="size-5" aria-hidden="true" />
          {carregando ? 'Buscando…' : 'Buscar'}
        </button>
      </div>
    </form>
  )
}
