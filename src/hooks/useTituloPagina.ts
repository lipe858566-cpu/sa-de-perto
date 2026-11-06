import { useEffect } from 'react'

const SUFIXO = 'Saúde Perto'

/**
 * Define um <title> único e descritivo por rota (RNF02).
 *
 * Em uma SPA o título não muda sozinho na navegação, o que deixa leitores de
 * tela e o histórico do navegador sem referência da página atual.
 */
export function useTituloPagina(titulo: string) {
  useEffect(() => {
    document.title = titulo ? `${titulo} — ${SUFIXO}` : SUFIXO
  }, [titulo])
}
