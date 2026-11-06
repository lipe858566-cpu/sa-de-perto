import { describe, expect, it, vi, beforeEach } from 'vitest'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { renderizar } from '@/test/utils'

import { Unidades } from './Unidades'

function mockRede(resposta: { nominatim?: unknown; overpass?: 'falha' | unknown }) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string | URL, init?: RequestInit) => {
      const alvo = String(url)
      if (alvo.includes('nominatim')) {
        if (resposta.nominatim === 'falha') return { ok: false, status: 502 } as Response
        return { ok: true, status: 200, json: async () => resposta.nominatim } as Response
      }
      // Overpass é POST
      void init
      if (resposta.overpass === 'falha') return { ok: false, status: 502 } as Response
      return { ok: true, status: 200, json: async () => resposta.overpass } as Response
    }),
  )
}

const LOCAL = [{ display_name: 'Recife, PE, Brasil', lat: '-8.05', lon: '-34.88' }]

beforeEach(() => vi.restoreAllMocks())

/**
 * O serviço de geocodificação impõe 1 requisição por segundo, como manda a
 * política do Nominatim. Isso é comportamento de produção, não artefato de
 * teste — então a espera é absorvida com prazo maior em vez de desligada.
 */
const PRAZO = { timeout: 6000 }

/**
 * `buscarLocal` mantém cache de sessão em módulo, que persiste entre os testes
 * deste arquivo. Cada caso usa um termo próprio para exercitar a rede de fato,
 * em vez de receber a resposta cacheada do caso anterior.
 */
let contador = 0
function termoUnico() {
  contador += 1
  return `Localidade ${contador}`
}

describe('Unidades — estados de RF14', () => {
  it('mostra o conjunto de exemplo antes de qualquer busca, devidamente rotulado', () => {
    const { container } = renderizar(<Unidades />)
    expect(screen.getByText(/dado demonstrativo/i)).toBeInTheDocument()
    expect(container.textContent).toMatch(/não corresponde a um serviço real/i)
  })

  it('anuncia o carregamento durante a busca', async () => {
    const user = userEvent.setup()
    mockRede({ nominatim: LOCAL, overpass: new Promise(() => {}) })
    renderizar(<Unidades />)

    await user.type(screen.getByLabelText(/buscar unidades perto/i), termoUnico())
    await user.click(screen.getByRole('button', { name: /^buscar$/i }))

    await waitFor(() => {
      expect(screen.getByText(/localizando o endereço|procurando unidades/i)).toBeInTheDocument()
    }, PRAZO)
  })

  it('exibe erro com caminho de saída quando a geocodificação falha', async () => {
    const user = userEvent.setup()
    mockRede({ nominatim: 'falha' })
    renderizar(<Unidades />)

    await user.type(screen.getByLabelText(/buscar unidades perto/i), termoUnico())
    await user.click(screen.getByRole('button', { name: /^buscar$/i }))

    const alerta = await screen.findByRole('alert', {}, PRAZO)
    expect(alerta).toBeInTheDocument()
    expect(within(alerta).getByRole('button', { name: /tentar de novo/i })).toBeInTheDocument()
  })

  it('avisa quando nada é encontrado para o termo', async () => {
    const user = userEvent.setup()
    mockRede({ nominatim: [] })
    renderizar(<Unidades />)

    await user.type(screen.getByLabelText(/buscar unidades perto/i), termoUnico())
    await user.click(screen.getByRole('button', { name: /^buscar$/i }))

    const alerta = await screen.findByRole('alert', {}, PRAZO)
    expect(alerta.textContent).toMatch(/nada encontrado/i)
  })

  /** Compromisso de RNF11: o fallback precisa se declarar na tela. */
  it('declara quando a lista veio do fallback e não da região buscada', async () => {
    const user = userEvent.setup()
    mockRede({ nominatim: LOCAL, overpass: 'falha' })
    const { container } = renderizar(<Unidades />)

    await user.type(screen.getByLabelText(/buscar unidades perto/i), termoUnico())
    await user.click(screen.getByRole('button', { name: /^buscar$/i }))

    await waitFor(
      () => {
        expect(container.textContent).toMatch(/não respondeu a esta consulta/i)
      },
      PRAZO,
    )
    expect(container.textContent).toMatch(/não corresponde à região buscada/i)
  })

  it('mostra as unidades reais quando a Overpass responde', async () => {
    const user = userEvent.setup()
    mockRede({
      nominatim: LOCAL,
      overpass: {
        elements: [
          {
            type: 'node',
            id: 7,
            lat: -8.05,
            lon: -34.88,
            tags: { name: 'Hospital Verificado', amenity: 'hospital', 'addr:city': 'Recife' },
          },
        ],
      },
    })
    renderizar(<Unidades />)

    await user.type(screen.getByLabelText(/buscar unidades perto/i), termoUnico())
    await user.click(screen.getByRole('button', { name: /^buscar$/i }))

    expect(await screen.findByText('Hospital Verificado', {}, PRAZO)).toBeInTheDocument()
    // Dado real do OSM não pode ser apresentado como cadastro oficial do SUS.
    expect(screen.getByText(/não é cadastro oficial do sus/i)).toBeInTheDocument()
  })
})

describe('Unidades — filtros (RF04)', () => {
  it('reduz a lista e atualiza a contagem', async () => {
    const user = userEvent.setup()
    renderizar(<Unidades />)

    expect(screen.getByText(/6 unidades encontradas/i)).toBeInTheDocument()
    await user.selectOptions(screen.getByLabelText(/município/i), 'Olinda')
    expect(await screen.findByText(/2 unidades encontradas/i)).toBeInTheDocument()
  })

  it('mostra estado vazio, e não erro, quando a combinação não tem resultado', async () => {
    const user = userEvent.setup()
    renderizar(<Unidades />)

    await user.selectOptions(screen.getByLabelText(/município/i), 'Olinda')
    await user.selectOptions(screen.getByLabelText(/^serviço/i), 'urgencia')

    expect(await screen.findByText(/nenhuma unidade com esses filtros/i)).toBeInTheDocument()
    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('permite limpar os filtros e recuperar a lista', async () => {
    const user = userEvent.setup()
    renderizar(<Unidades />)

    await user.selectOptions(screen.getByLabelText(/município/i), 'Olinda')
    const limpar = screen.getAllByRole('button', { name: /limpar filtros/i })[0]
    await user.click(limpar!)

    expect(await screen.findByText(/6 unidades encontradas/i)).toBeInTheDocument()
  })
})
