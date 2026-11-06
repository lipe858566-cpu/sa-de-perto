import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import { rotas } from '@/rotas'

/**
 * `basename` acompanha a `base` do Vite. Sem isso, em publicação num
 * subcaminho (GitHub Pages) o roteador tentaria casar `/unidades` enquanto a
 * URL real é `/<repositorio>/unidades`, e toda rota cairia no 404.
 *
 * `import.meta.env.BASE_URL` termina com barra; o React Router espera o
 * caminho sem a barra final.
 */
const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

const router = createBrowserRouter(rotas, { basename: basename || undefined })

export default function App() {
  return <RouterProvider router={router} />
}
