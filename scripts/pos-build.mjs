import { copyFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

/**
 * O GitHub Pages serve arquivos estáticos: ao abrir /unidades diretamente ou
 * recarregar a página, ele procura um arquivo nesse caminho, não encontra e
 * devolve 404.html. Copiando o index para lá, a aplicação carrega e o roteador
 * assume a rota — mantendo URLs limpas.
 *
 * A resposta HTTP continua sendo 404. É o custo conhecido desta abordagem,
 * registrado em docs/deploy.md §3.
 */
const dist = fileURLToPath(new URL('../dist/', import.meta.url))
await copyFile(join(dist, 'index.html'), join(dist, '404.html'))
console.log('pos-build: dist/404.html criado a partir de index.html')
