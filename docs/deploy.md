# Publicação — Saúde Perto

Build de produção e publicação em host estático.

**Última atualização:** 2026-10-23

> ## ⚠️ Estado atual
>
> **Nada foi publicado. Não há nenhum commit.**
>
> O build de produção funciona, o roteamento em host estático foi **testado** (§3) e o `dist/` passou por varredura de segredos. Falta apenas: escolher o nome do repositório, commitar, criar o remoto e publicar.
>
> **Nenhum commit, push ou publicação ocorrerá sem autorização explícita do usuário** (`CLAUDE.md` §12).

---

## 1. Alvo de publicação

**GitHub Pages**, servindo o build estático do Vite.

Justificativa: a aplicação é client-side pura (`docs/arquitetura.md` §1), sem backend; um host estático gratuito e integrado ao repositório atende e simplifica a entrega acadêmica.

## 2. Preparação do repositório

A fazer na Fase 2 (estrutura) e Fase 8 (publicação):

| Item | Finalidade | Estado |
|---|---|---|
| `git init` | Iniciar versionamento | ✅ feito, branch `main`, 0 commits |
| `.gitignore` | Excluir `node_modules/`, `dist/`, `.env`, `*.local` | ✅ verificado com `git check-ignore` |
| `.env.example` | Documentar variáveis **sem valores sensíveis** | ✅ criado, versionável |
| `README.md` | Instruções reproduzíveis | ✅ criado e atualizado com comandos confirmados |
| `gh` (GitHub CLI) | Criar o repositório remoto | ❌ **não instalado** (P4) — usar a interface web |
| `LICENSE` | Definir licença de uso | ❌ a decidir pelo autor |
| `base` do Vite para subcaminho | Ativos carregarem no GitHub Pages | ✅ configurável por `VITE_BASE` (§4) |
| Decisão de roteamento (§3) | Recarga de URL profunda funcionar | ✅ **resolvida e testada** (D14) |
| `scripts/pos-build.mjs` | Gera `dist/404.html` | ✅ roda no fim do `npm run build` |

### Regras absolutas

- **`.env` nunca é versionado.** Precisa estar no `.gitignore` **antes** do primeiro commit.
- **Nenhum segredo, token, credencial ou dado pessoal** entra no repositório — em nenhum arquivo, em nenhum commit. Segredo commitado continua no histórico mesmo após remoção.
- **Nenhum dado real de paciente** em mocks, exemplos ou testes (RNF08).

## 3. Roteamento em host estático — **resolvido e testado**

Um SPA com `react-router-dom` resolve rotas no navegador. O GitHub Pages serve arquivos: ao acessar `/unidades` diretamente ou recarregar a página, ele procura um arquivo nesse caminho, não encontra e devolve `404.html`.

### Decisão (D14): `BrowserRouter` com fallback de 404

| Abordagem | Escolhida? | Por quê |
|---|---|---|
| `BrowserRouter` + `404.html` | ✅ **sim** | URLs limpas (`/unidades`), que importam num projeto de portfólio |
| `HashRouter` | não | URLs com `#` são mais feias e expõem uma limitação de hospedagem ao usuário |

### Como funciona

`scripts/pos-build.mjs` copia `dist/index.html` para `dist/404.html` ao fim do build. O Pages serve esse arquivo para qualquer caminho desconhecido, a aplicação carrega e o roteador assume a rota.

**O custo conhecido:** a resposta HTTP continua sendo **404**, mesmo quando a rota existe para a aplicação. Isso não afeta quem navega, mas pode afetar indexação por buscadores. É o preço aceito por URLs limpas em host estático.

### Verificação feita (2026-10-23)

Um simulador local reproduziu o comportamento do Pages — servir a partir do subcaminho e devolver `404.html` com status 404 para arquivo inexistente:

| Rota | Status HTTP | Página renderizada |
|---|---|---|
| `/saude-perto/` | 200 | Início ✅ |
| `/saude-perto/unidades` | 404 | **Unidades de saúde ✅** (título, `h1` e mapa corretos) |
| `/saude-perto/agendamento` | 404 | **Solicitação de agendamento ✅** |
| `/saude-perto/rota-que-nao-existe` | 404 | **Esta página não existe ✅** |

Console do navegador no build de produção: **sem nenhuma mensagem**.

**A recarga de URL profunda funciona.** Era o ponto de falha clássico, e foi testado em vez de presumido.

## 4. Subcaminho do GitHub Pages

O Pages publica em `https://<usuario>.github.io/<repositorio>/`. Sem ajuste, o build gera referências a partir da raiz e todos os ativos retornam 404.

A `base` do Vite é lida da variável `VITE_BASE`:

```bash
VITE_BASE=/nome-do-repositorio/ npm run build
```

O `basename` do roteador acompanha automaticamente, via `import.meta.env.BASE_URL` em `src/App.tsx`. Sem isso, o roteador tentaria casar `/unidades` enquanto a URL real é `/<repositorio>/unidades`, e **toda rota cairia no 404**.

**Verificação obrigatória após o build:** conferir que os caminhos em `dist/index.html` incluem o subcaminho. Conferido em 2026-10-23 com `VITE_BASE=/saude-perto/`:

```html
href="/saude-perto/favicon.svg"
src="/saude-perto/assets/index-*.js"
href="/saude-perto/assets/index-*.css"
```

Sem `VITE_BASE`, o build usa `/` — o correto para desenvolvimento e para publicação em domínio próprio.

### ⚠️ Armadilha do `npm run preview`

`vite preview` **relê o `vite.config.ts`** e não sabe com que `base` o build foi feito. Rodar `npm run preview` depois de `VITE_BASE=/saude-perto/ npm run build` serve os ativos em `/assets/`, enquanto o HTML os referencia em `/saude-perto/assets/`. O resultado é uma **página em branco, sem nenhum erro no console** — o servidor devolve o HTML de fallback no lugar do JavaScript, e o navegador simplesmente não executa nada.

A variável precisa estar presente nos dois comandos:

```bash
VITE_BASE=/saude-perto/ npm run build
VITE_BASE=/saude-perto/ npm run preview
```

Isso custou uma investigação durante a Fase 8: a primeira conclusão de que "o preview funciona" estava errada, porque o `curl` retornava HTTP 200 — só que com 758 bytes, o tamanho do `404.html`, e não os 322 KB do bundle. **Conferir o código de status não basta; é preciso conferir o tamanho ou o conteúdo.**

## 5. Procedimento de publicação

A publicação é automatizada por **GitHub Actions** (`.github/workflows/deploy.yml`). O build roda no CI, não na máquina de quem faz o push — por isso `dist/` continua fora do versionamento.

### O que o workflow faz a cada push em `main`

1. `npm ci` — instalação reproduzível a partir do `package-lock.json`.
2. `npm run lint` — falha a publicação se houver problema.
3. `npm run test` — falha a publicação se algum dos 105 testes quebrar.
4. `npm run build` com `VITE_BASE` derivado automaticamente do nome do repositório (`github.event.repository.name`), o que dispensa configurar o subcaminho à mão.
5. Publica o `dist/` no GitHub Pages.

**Consequência útil:** um teste quebrado impede a publicação. O site no ar sempre corresponde a um estado que passou no lint e na suíte.

### Passo único de configuração, feito uma vez

No repositório: **Settings → Pages → Build and deployment → Source: "GitHub Actions"**.

Sem isso o workflow roda mas não publica.

### Build local (opcional)

Não é necessário para publicar, já que o CI constrói. Para conferir localmente:

```bash
VITE_BASE=/saude-perto/ npm run build
VITE_BASE=/saude-perto/ npm run preview
```

A variável precisa estar nos **dois** comandos — ver o aviso em §4.

## 6. Verificações posteriores à publicação

| Verificação | Critério |
|---|---|
| Página inicial carrega | Sem erro no console |
| Ativos carregam | Nenhum 404 de CSS, JS ou imagem |
| Navegação interna | Todas as rotas alcançáveis por link |
| **Recarga de URL profunda** | `/<repo>/unidades` recarregado abre a página, não 404 |
| Mapa | Tiles carregam e a atribuição ao OpenStreetMap está visível |
| Chamadas de API | Overpass e Nominatim funcionam a partir do domínio publicado (CORS já confirmado em `docs/apis.md`) |
| Formulário | Validação e confirmação funcionam, com o aviso de caráter demonstrativo visível |
| Responsividade | Verificar em dispositivo móvel real |
| Sem segredos expostos | Inspecionar os arquivos servidos |

## 7. Limitações da publicação estática

A declarar no `README.md` e na página "sobre":

- Sem backend: formulários não enviam dados a lugar algum.
- Sem variável de ambiente secreta: tudo que o build contém é público.
- Dependência de APIs públicas de terceiros, sem SLA. Se a Overpass estiver indisponível, a aplicação degrada para dados demonstrativos rotulados (RNF11).
- Hospedagem gratuita, sem garantia de disponibilidade.

## 7.1 Varredura de segurança do build (2026-10-23)

| Verificação | Resultado |
|---|---|
| `.env`, `*.key`, `*.pem` dentro de `dist/` | ✅ nenhum |
| Segredos no bundle | ✅ nenhum. O único acerto do padrão foi a palavra "password" na lista de tipos de `input` de uma biblioteca |
| Variáveis embutidas | ✅ apenas os **nomes** `VITE_NOMINATIM_URL`, `VITE_OVERPASS_URL`, `VITE_OSM_TILE_URL`, `VITE_BASE` — todos URLs públicos, nenhum valor sensível |
| E-mail do autor no bundle | ✅ não aparece |
| CPF ou telefone real nos dados | ✅ nenhum |
| `node_modules/` ou `dist/` versionáveis | ✅ ambos ignorados, confirmado com `git check-ignore` |
| Total a versionar | 96 arquivos, **880 KB** |

## 8. Estado de publicação

| Item | Estado |
|---|---|
| Repositório git local | ✅ inicializado, branch `main` |
| Commits | ❌ **nenhum** (`git rev-list --all --count` → 0) |
| Repositório remoto | ❌ não criado |
| Build de produção | ✅ exit 0 |
| `base` do Vite para subcaminho | ✅ configurável por `VITE_BASE` |
| Fallback de 404 | ✅ gerado e **testado** |
| Recarga de URL profunda | ✅ **testada em simulador do Pages** |
| Varredura de segredos no `dist/` | ✅ limpa |
| Nome do repositório | ❌ **a decidir pelo autor** |
| GitHub Pages configurado | ❌ não |
| Site publicado | ❌ **não publicado** |
| URL pública | — |

### Saída real do último build (2026-10-23, após a Fase 3)

```
dist/index.html                  0.62 kB │ gzip:   0.39 kB
dist/assets/index-*.css         31.08 kB │ gzip:   6.51 kB
dist/assets/index-*.js         336.10 kB │ gzip: 105.98 kB
+ 3 arquivos de fonte Archivo (woff2), 80.76 kB no total
✓ 1956 módulos transformados em 236 ms
```

O bundle subiu de 256,86 kB (Fase 2) para **336,10 kB**, cerca de +79 kB, principalmente pelo roteador. **Nenhuma rota é carregada de forma preguiçosa** ainda. Registrado como pendência P6: dividir com `React.lazy` é tarefa da Fase 4, e o Leaflet ainda vai entrar na Fase 5.

**Nenhuma afirmação de publicação será feita em qualquer documento antes de a URL responder e ser verificada.**
