import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { ITENS_NAV } from './itens-nav'

function classeLink({ isActive }: { isActive: boolean }) {
  // Em telas estreitas o menu é uma lista vertical: o item ativo recebe uma
  // marca à esquerda. Uma borda inferior de largura total leria como divisor
  // entre itens, não como indicação do item atual.
  const base =
    'block border-l-4 py-3 pl-3 transition-colors hover:text-amarelo-campanha md:border-l-0 md:border-b-3 md:px-1 md:py-2 md:pl-1'

  // O amarelo sobre o verde mede 4,30:1 — passa o mínimo de 3:1 para
  // componentes, mas NÃO os 4,5:1 exigidos de texto comum (pendência P9).
  // Por isso o item ativo mantém o texto em `papel` (7,37:1) e usa o amarelo
  // apenas na marca, que é elemento não textual. O estado continua sinalizado
  // pela marca, pelo peso da fonte e por `aria-current`.
  return isActive
    ? `${base} border-amarelo-campanha font-bold text-papel`
    : `${base} border-transparent font-medium text-papel`
}

/**
 * Navegação principal (RF15).
 *
 * Em telas estreitas vira um menu recolhido. Ao abrir, o foco vai para o
 * primeiro link; `Esc` fecha e devolve o foco ao botão. O menu fecha no clique
 * do link — o evento que causa a navegação — em vez de reagir à mudança de
 * rota em um efeito.
 */
export function Nav() {
  const [aberto, setAberto] = useState(false)
  const botaoRef = useRef<HTMLButtonElement>(null)
  const primeiroLinkRef = useRef<HTMLAnchorElement>(null)

  // Move o foco para dentro do menu assim que ele abre.
  useEffect(() => {
    if (aberto) primeiroLinkRef.current?.focus()
  }, [aberto])

  // Escuta Esc no documento enquanto o menu está aberto.
  useEffect(() => {
    if (!aberto) return

    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key === 'Escape') {
        setAberto(false)
        botaoRef.current?.focus()
      }
    }

    document.addEventListener('keydown', aoTeclar)
    return () => document.removeEventListener('keydown', aoTeclar)
  }, [aberto])

  return (
    <nav aria-label="Navegação principal">
      <button
        ref={botaoRef}
        type="button"
        onClick={() => setAberto((a) => !a)}
        aria-expanded={aberto}
        aria-controls="menu-principal"
        className="flex items-center gap-2 rounded-sm border-2 border-papel/40 px-3 py-2 font-medium text-papel md:hidden"
      >
        {aberto ? (
          <X className="size-5" aria-hidden="true" />
        ) : (
          <Menu className="size-5" aria-hidden="true" />
        )}
        Menu
      </button>

      <ul
        id="menu-principal"
        className={`${aberto ? 'block' : 'hidden'} mt-3 md:mt-0 md:flex md:flex-wrap md:items-center md:gap-6`}
      >
        {ITENS_NAV.map((item, indice) => (
          <li key={item.para}>
            <NavLink
              to={item.para}
              end={item.para === '/'}
              ref={indice === 0 ? primeiroLinkRef : undefined}
              onClick={() => setAberto(false)}
              className={classeLink}
            >
              {item.rotulo}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
