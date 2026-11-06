import { beforeEach, describe, expect, it } from 'vitest'

import {
  jaTentouRecarregar,
  pareceVersaoDesatualizada,
  registrarRecarga,
} from './versaoDesatualizada'

describe('pareceVersaoDesatualizada', () => {
  /*
   * Cada navegador escreve a falha de outro jeito. Se o reconhecimento
   * quebrar, a pessoa volta a ver a tela de depuração do React Router.
   */
  it.each([
    ['Chrome/Edge', 'Failed to fetch dynamically imported module: http://x/assets/Campanhas-abc.js'],
    ['Firefox', 'error loading dynamically imported module'],
    ['Safari', 'Importing a module script failed.'],
    ['Vite (CSS do pedaço)', 'Unable to preload CSS for /assets/Unidades-xyz.css'],
  ])('reconhece a mensagem do %s', (_navegador, mensagem) => {
    expect(pareceVersaoDesatualizada(new Error(mensagem))).toBe(true)
  })

  it('não confunde com um erro comum da aplicação', () => {
    expect(pareceVersaoDesatualizada(new Error('Cannot read properties of undefined'))).toBe(false)
    expect(pareceVersaoDesatualizada(new TypeError('x is not a function'))).toBe(false)
  })

  it('não quebra quando o que foi lançado não é um Error', () => {
    expect(pareceVersaoDesatualizada('falhou')).toBe(false)
    expect(pareceVersaoDesatualizada(undefined)).toBe(false)
    expect(pareceVersaoDesatualizada(null)).toBe(false)
  })
})

describe('trava de recarga única', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('libera a primeira recarga e bloqueia a seguinte', () => {
    const agora = 1_000_000

    expect(jaTentouRecarregar(agora)).toBe(false)
    registrarRecarga(agora)
    expect(jaTentouRecarregar(agora)).toBe(true)
  })

  it('volta a liberar depois da janela, para não travar a aba para sempre', () => {
    const agora = 1_000_000
    registrarRecarga(agora)

    expect(jaTentouRecarregar(agora + 9_000)).toBe(true)
    expect(jaTentouRecarregar(agora + 11_000)).toBe(false)
  })

  it('trata marca corrompida como ausente', () => {
    sessionStorage.setItem('saude-perto:recarga-por-versao', 'nao-e-numero')
    expect(jaTentouRecarregar()).toBe(false)
  })
})
