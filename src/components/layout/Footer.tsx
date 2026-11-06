import { Link } from 'react-router-dom'

const LINKS_RODAPE = [
  { rotulo: 'Sobre o projeto', para: '/sobre' },
  { rotulo: 'Acessibilidade', para: '/acessibilidade' },
  { rotulo: 'Privacidade', para: '/privacidade' },
]

export function Footer() {
  return (
    <footer className="mt-auto border-t-2 border-border bg-papel-2">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <p className="max-w-prose font-semibold text-tinta">
          Projeto acadêmico. Não agenda consultas e não substitui atendimento profissional.
        </p>
        <p className="mt-2 max-w-prose text-tinta-suave">
          Em emergência, ligue <strong className="text-tinta">192</strong> (SAMU). Para apoio
          emocional, <strong className="text-tinta">188</strong> (CVV), 24 horas.
        </p>

        {/* Alvo de pelo menos 24x24 px (WCAG 2.2, 2.5.8). A isenção para link
            em frase não vale aqui: estes são itens de uma lista de navegação. */}
        <ul className="mt-4 flex flex-wrap gap-x-4">
          {LINKS_RODAPE.map((link) => (
            <li key={link.para}>
              <Link
                to={link.para}
                className="inline-block py-2 font-medium text-azul-cartilha underline"
              >
                {link.rotulo}
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-6 border-t border-border pt-4 text-sm text-tinta-suave">
          Disciplina Front-End Frameworks, UNINASSAU. Dados geográficos de{' '}
          <a
            href="https://www.openstreetmap.org/copyright"
            className="underline"
            target="_blank"
            rel="noreferrer"
          >
            colaboradores do OpenStreetMap
          </a>
          , sob licença ODbL.
        </p>
      </div>
    </footer>
  )
}
