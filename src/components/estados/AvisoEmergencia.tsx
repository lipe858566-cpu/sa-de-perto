import { PhoneCall } from 'lucide-react'

/**
 * Bloco de emergência, destacado no topo das páginas de conteúdo educativo
 * (RF08, RF09). Usa o vermelho de urgência, que no projeto é reservado a
 * emergência e erro.
 */
export function AvisoEmergencia({
  telefone,
  servico,
  descricao,
}: {
  telefone: string
  servico: string
  descricao: string
}) {
  return (
    <aside className="border-l-8 border-vermelho-urgencia bg-papel-2 p-5">
      <p className="flex items-center gap-3 font-heading text-xl font-bold text-tinta">
        <PhoneCall className="size-6 shrink-0 text-vermelho-urgencia" aria-hidden="true" />
        Ligue {telefone} — {servico}
      </p>
      <p className="mt-2 text-tinta-suave">{descricao}</p>
    </aside>
  )
}
