import { useEffect } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { Link } from 'react-router-dom'

import type { Unidade } from '@/types/unidade'
import { ROTULO_TIPO } from '@/types/unidade'

const TILE_URL =
  import.meta.env['VITE_OSM_TILE_URL'] ?? 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'

/**
 * O empacotador reescreve os caminhos das imagens padrão do Leaflet, o que
 * quebra o ícone do marcador. Este ícone é desenhado em SVG embutido, o que
 * evita o problema e mantém a paleta do projeto.
 */
const ICONE = L.divIcon({
  className: '',
  html: `<svg width="28" height="38" viewBox="0 0 28 38" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M14 0C6.3 0 0 6.3 0 14c0 10 14 24 14 24s14-14 14-24c0-7.7-6.3-14-14-14z" fill="#0F5D4A"/>
    <circle cx="14" cy="14" r="5.5" fill="#F2B705"/>
  </svg>`,
  iconSize: [28, 38],
  iconAnchor: [14, 38],
  popupAnchor: [0, -34],
})

/** Reenquadra o mapa quando a lista de unidades muda. */
function AjustaEnquadramento({ unidades }: { unidades: Unidade[] }) {
  const mapa = useMap()

  useEffect(() => {
    const pontos = unidades
      .filter((u) => u.coordenadas)
      .map((u) => [u.coordenadas!.lat, u.coordenadas!.lon] as [number, number])

    if (pontos.length > 0) {
      mapa.fitBounds(L.latLngBounds(pontos), { padding: [40, 40], maxZoom: 15 })
    }
  }, [unidades, mapa])

  return null
}

export function MapaUnidades({ unidades }: { unidades: Unidade[] }) {
  const comCoordenada = unidades.filter((u) => u.coordenadas)
  const primeira = comCoordenada[0]

  if (!primeira?.coordenadas) {
    return (
      <p className="border-2 border-dashed border-border px-4 py-10 text-center text-tinta-suave">
        Nenhuma das unidades encontradas tem localização registrada, então não há o que mostrar
        no mapa. A lista abaixo traz as mesmas unidades.
      </p>
    )
  }

  return (
    <div className="border-2 border-border">
      <MapContainer
        center={[primeira.coordenadas.lat, primeira.coordenadas.lon]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '420px', width: '100%' }}
      >
        <TileLayer
          url={TILE_URL}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">colaboradores do OpenStreetMap</a>'
          maxZoom={19}
        />
        <AjustaEnquadramento unidades={comCoordenada} />
        {comCoordenada.map((unidade) => (
          <Marker
            key={unidade.id}
            position={[unidade.coordenadas!.lat, unidade.coordenadas!.lon]}
            icon={ICONE}
          >
            <Popup>
              <span className="block text-sm font-semibold text-verde-posto">
                {ROTULO_TIPO[unidade.tipo]}
              </span>
              <span className="block font-semibold">{unidade.nome}</span>
              <Link to={`/unidades/${unidade.id}`} className="mt-1 block underline">
                Ver detalhes
              </Link>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
