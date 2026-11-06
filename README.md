# Saúde Perto

Aplicação web responsiva de **saúde preventiva e bem-estar comunitário**: encontrar unidades de saúde próximas, acompanhar campanhas de prevenção e acessar conteúdo educativo confiável sobre primeiros socorros e saúde mental.

> **Status:** MVP acadêmico com autenticação adicionada. Os resultados dos testes documentados abaixo são de 23/10/2026 e não foram revalidados após a integração com Supabase.
> Funcionam: página inicial, busca de unidades por localidade (OpenStreetMap), mapa interativo, filtros, detalhe da unidade, temas de prevenção, primeiros socorros, saúde mental, formulário de agendamento demonstrativo com validação, acompanhamento de solicitações, navegação responsiva e páginas informativas.
>
> O projeto **ainda não está publicado** e não há nenhum commit.

---

## Contexto acadêmico

Trabalho da disciplina **Front-End Frameworks** do curso da **UNINASSAU**.

### Problema abordado

O acesso à atenção primária em saúde no Brasil é frequentemente dificultado não pela ausência de serviços, mas pela **falta de informação organizada** sobre eles: a pessoa não sabe qual unidade atende perto de casa, que serviços ela oferece, em que horário funciona, ou quais campanhas de prevenção estão disponíveis. Informação dispersa gera busca desnecessária por pronto-socorro, adesão baixa a campanhas e atraso em cuidados preventivos.

O Saúde Perto é um **exercício acadêmico de frontend** que explora como uma interface web bem organizada e acessível pode reduzir esse atrito informacional.

## Objetivos

### Objetivo geral

Desenvolver um MVP de frontend em React que centralize informação de saúde preventiva de forma acessível, responsiva e verificável.

### Objetivos específicos

1. Aplicar React, TypeScript e Vite na construção de uma aplicação componentizada.
2. Implementar roteamento e navegação responsiva entre páginas.
3. Consumir APIs públicas de dados abertos, com tratamento real de erro e indisponibilidade.
4. Construir um mapa interativo de unidades de saúde.
5. Implementar formulário com validação de esquema e feedback acessível.
6. Atender critérios de acessibilidade WCAG 2.2 nível AA.
7. Cobrir a aplicação com testes automatizados.
8. Manter documentação técnica sincronizada com o código.

## Funcionalidades

Legenda: ✅ implementada e testada · 🔨 em desenvolvimento · 📋 planejada · 🚫 fora do escopo

| Funcionalidade | Status |
|---|---|
| Página inicial com serviços e campanhas em destaque | 🔨 |
| Busca e listagem de unidades de saúde | 🔨 |
| Filtros de unidades (tipo, serviço, município) | 🔨 |
| Página de detalhes da unidade | 🔨 |
| Mapa interativo com marcadores | 🔨 |
| Listagem de campanhas preventivas | 🔨 |
| Conteúdo educativo — primeiros socorros | 🔨 |
| Conteúdo educativo — saúde mental | 🔨 |
| Formulário de solicitação de agendamento (demonstrativo) | 🔨 |
| Validação e tela de confirmação do formulário | 🔨 |
| Acompanhamento de solicitações simuladas | 🔨 |
| Estados de carregamento, erro e resultado vazio | 🔨 |
| Navegação responsiva e páginas informativas | 🔨 |
| Agendamento oficial na rede pública | 🚫 |
| Conta de usuário, cadastro e recuperação de senha com Supabase | 🔨 |
| Notificações reais (push / SMS / e-mail) | 🚫 |
| Persistência compartilhada entre dispositivos | 🚫 |

Legenda do 🔨: o código existe, compila e passa no lint, mas **nenhum item foi testado** — não há teste automatizado nem inspeção visual. Nada está marcado ✅ por isso. A tabela é atualizada item a item, com a verificação registrada em `docs/PROJECT_MEMORY.md`.

## Tecnologias

Versões **realmente instaladas**, confirmadas por `npm ls --depth=0` em 2026-10-23.

| Finalidade | Pacote | Versão | Licença |
|---|---|---|---|
| Build e dev server | `vite` | 8.3.5 | MIT |
| Biblioteca de UI | `react` / `react-dom` | 19.3.1 | MIT |
| Linguagem | `typescript` | 6.0.3 | Apache-2.0 |
| Plugin React para Vite | `@vitejs/plugin-react` | 6.1.2 | MIT |
| Estilo | `tailwindcss` / `@tailwindcss/vite` | 4.3.3 | MIT |
| Componentes acessíveis | `radix-ui` | 1.8.1 | MIT |
| CLI de componentes | `shadcn` | 4.22.1 | MIT |
| Ícones | `lucide-react` | 1.61.0 | ISC |
| Variantes de classe | `class-variance-authority` | 0.7.1 | Apache-2.0 |
| Utilitário de classes | `cn` | 0.5.0 | MIT |
| Animações utilitárias | `tw-animate-css` | 1.4.0 | MIT |
| Tipografia | `@fontsource-variable/archivo` | 5.3.0 | OFL-1.1 |
| Roteamento | `react-router-dom` | 7.18.4 | MIT |
| Lint | `oxlint` | 1.89.0 | MIT |
| Tipos de Node | `@types/node` | 24.19.2 | MIT |

**Autenticação:** `@supabase/supabase-js`. As dependências devem ser instaladas com `npm.cmd install`.

> **Sobre o linter:** o projeto usa **`oxlint`**, não ESLint. O template oficial do Vite deixou de gerar configuração de ESLint, e o `oxlint` oferece o plugin `jsx-a11y`, que cobre a verificação de acessibilidade exigida pelo projeto. O plugin está habilitado e foi verificado disparando. Decisão registrada em `docs/PROJECT_MEMORY.md` §C (D10).

> **Sobre a tipografia:** a fonte **Archivo** foi escolhida deliberadamente — um grotesco desenhado para sinalização e impressão, com altura-x grande, servido pelo próprio build (sem CDN externa, sem vazar navegação). A Geist, que vinha do preset do shadcn, foi desinstalada por ser herança do gerador e não escolha de projeto. Ver `docs/arquitetura.md` §10.

## Pré-requisitos

- **Node.js** ≥ 20 (verificado com v24.15.0)
- **npm** ≥ 10 (verificado com 11.12.1)
- **Git** (verificado com 2.43.0)
- Navegador moderno com suporte a ES2023 (alvo de compilação do projeto)

## Instalação e execução

Os comandos abaixo foram executados com sucesso em 2026-10-23.

```powershell
npm.cmd install
Copy-Item .env.example .env.local
npm.cmd run dev
```

Preencha o `.env.local` com a URL e a chave pública do seu projeto Supabase. Para enviar o código de recuperação por e-mail, ajuste o modelo **Reset Password** para incluir `{{ .Token }}`. Veja `CONFIGURAR-AUTENTICACAO.md`.


## Scripts disponíveis

| Script | Finalidade | Verificado |
|---|---|---|
| `npm run dev` | Servidor de desenvolvimento | ✅ pronto em 163 ms |
| `npm run build` | `tsc -b && vite build` | ✅ exit 0 |
| `npm run lint` | `oxlint`, com plugin `jsx-a11y` | ✅ exit 0, zero avisos |
| `npm run preview` | Servir o build localmente | ⚠️ não executado ainda |
| `npm run test` | Vitest, 105 testes | ✅ exit 0, ~7 s |
| `npm run test:watch` | Vitest em modo contínuo | ✅ |

## Variáveis de ambiente

O frontend é código público e **não deve conter segredos**. Apenas valores não sensíveis de configuração, prefixados com `VITE_`.

O arquivo `.env.example` contém as duas variáveis públicas necessárias para o login: `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`. A chave **service_role** nunca deve ser usada no frontend.

O `.env` está no `.gitignore` e **nunca** é versionado — verificado com `git check-ignore`.

## Fontes de dados e APIs

Investigação completa, com resultado real dos testes: **`docs/apis.md`**.

Resumo da verificação de **2026-10-23**:

| Fonte | Finalidade | Resultado |
|---|---|---|
| **Nominatim** (OpenStreetMap) | Geocodificação de endereços/municípios | ✅ Respondeu HTTP 200 com CORS liberado |
| **Tiles OpenStreetMap** | Camada base do mapa | ✅ Respondeu HTTP 200 (`image/png`) |
| **Overpass API** (OpenStreetMap) | Unidades de saúde por área geográfica | ⚠️ **Funciona, mas intermitente.** Retornou 60 elementos reais (29 aproveitáveis) via linha de comando; porém as 3 buscas feitas no navegador caíram no fallback, com três espelhos saturados ao mesmo tempo |
| **API de Dados Abertos do Ministério da Saúde** | Estabelecimentos (CNES), dados oficiais | ❌ **Inacessível.** Conexão recusada / sem resposta nas portas 80 e 443, testado de duas redes independentes |
| **dados.gov.br (API)** | Catálogo de conjuntos de dados | ❌ Exige autenticação (HTTP 401). Chave em frontend público é inviável |

**Consequência:** a fonte oficial de estabelecimentos não está disponível, e a alternativa do OpenStreetMap é instável. A aplicação **degrada para dados demonstrativos claramente rotulados** quando a busca falha, dizendo isso na tela — e, na prática, esse foi o caminho em todas as buscas feitas durante a verificação.

Conteúdo de campanhas, primeiros socorros e saúde mental não possui API pública confiável; será redigido a partir de fontes oficiais **com citação explícita** e marcado como conteúdo editorial, nunca inventado como dado institucional.

## Limitações conhecidas

1. **Não há integração com serviços oficiais de saúde.** O Supabase guarda os dados da conta; o formulário de agendamento não envia solicitações a unidades de saúde.
2. **Agendamentos são demonstrativos.** A aplicação **não** marca consultas. Nenhuma confirmação exibida tem validade real.
3. **Autenticação com Supabase.** Login, cadastro e recuperação de senha foram adicionados. Telefone, endereço e data de nascimento ficam nos metadados da conta; não existe ainda uma área para editar esses dados.
4. **Sem agendamentos compartilhados.** As solicitações simuladas não são vinculadas à conta e não são sincronizadas entre dispositivos.
5. **A API oficial do Ministério da Saúde está indisponível** (verificado em 2026-10-23), o que limita o uso de dados oficiais de estabelecimentos.
6. **APIs públicas do OpenStreetMap têm políticas de uso justo** e não são adequadas a tráfego de produção. O uso aqui é acadêmico e de baixo volume.
7. **Conteúdo educativo não é orientação médica.** É material informativo com fonte citada e não substitui atendimento profissional.
8. **Cobertura geográfica depende da completude do OpenStreetMap**, que varia por município.

Agendamento oficial, histórico clínico e notificações exigem integrações autorizadas com sistemas de saúde, fora do escopo deste trabalho.

## Estratégia de testes

Detalhes e resultados reais: **`docs/testes.md`**.

Plano: testes unitários de utilitários e esquemas Zod; testes de componente com Testing Library priorizando consultas acessíveis (`getByRole`, `getByLabelText`); testes de integração dos fluxos de busca e de formulário com serviços de rede simulados; verificação manual de responsividade, navegação por teclado e contraste.

**105 testes em 14 arquivos, todos passando** (verificado em 2026-10-23). Nenhum teste toca a rede: o setup substitui `fetch` por uma função que falha se algum teste tentar sair para a internet.

Dois deles guardam compromissos de **integridade**, não de estética: a tela de confirmação nunca pode dizer "consulta confirmada" ou variantes, e dado demonstrativo sempre tem de se declarar. Se alguém quebrar isso, a suíte falha antes de a aplicação mentir sobre saúde.

Sem cobertura: **leitor de tela real** e **dispositivo móvel real**.

Na Fase 3, o lint apontou quatro problemas reais (um papel ARIA preferível, uma constante exportada junto de componente, um `setState` em efeito e um ouvinte de teclado em elemento não interativo). Todos tiveram a **causa corrigida**, nenhum foi silenciado.

## Publicação

Procedimento detalhado: **`docs/deploy.md`**.

O alvo é o **GitHub Pages**. O roteamento em host estático já foi resolvido e **testado**: o build gera `dist/404.html` a partir do `index.html`, e o Pages o serve para qualquer caminho desconhecido, permitindo URLs limpas.

```bash
VITE_BASE=/saude-perto/ npm run build
VITE_BASE=/saude-perto/ npm run preview   # a variável é necessária nos DOIS comandos
```

> ⚠️ Sem `VITE_BASE` no `preview`, a página abre **em branco e sem erro no console**: o servidor serve os ativos num caminho e o HTML os pede em outro.

Verificado em simulador do GitHub Pages: as rotas `/saude-perto/unidades`, `/saude-perto/agendamento` e um caminho inexistente renderizaram a página correta ao serem abertas diretamente. A resposta HTTP é 404 mesmo em rota válida — custo conhecido do fallback de SPA.

A publicação é automatizada por **GitHub Actions** (`.github/workflows/deploy.yml`): a cada push em `main`, o CI roda lint, testes e build, e só publica se tudo passar. O subcaminho é derivado automaticamente do nome do repositório.

Passo único de configuração: **Settings → Pages → Build and deployment → Source: "GitHub Actions"**.

**O projeto ainda não está publicado.** O repositório git local existe (branch `main`), mas não há nenhum commit nem repositório remoto.

## Acessibilidade

Meta: **WCAG 2.2 nível AA**, com critérios verificáveis em `docs/requisitos.md`.

Compromissos de projeto: HTML semântico e marcos de página; todo controle alcançável e operável por teclado; foco visível e ordem de foco coerente; contraste mínimo 4,5:1 para texto normal e 3:1 para texto grande e componentes; rótulos associados e erros de formulário anunciados a leitores de tela; respeito a `prefers-reduced-motion`; nenhuma informação transmitida apenas por cor.

A escolha do shadcn/ui sobre **Radix UI** é deliberada: entrega gestão de foco, semântica ARIA e navegação por teclado já corretas nos componentes interativos. A CLI foi inicializada explicitamente com a base `radix` por esse motivo.

Decisões já tomadas e implementadas:

- Texto base em **18 px**, acima do comum de 16 px, porque o público inclui pessoas idosas e com baixa visão.
- **Contraste da paleta medido**, não estimado: 13 pares calculados, 12 passando 4,5:1. Um par (amarelo sobre verde, 4,30:1) ficou restrito a texto grande e componentes. Tabela completa em `docs/arquitetura.md` §10.
- Contorno de foco de 3 px, com cor invertida sobre faixas escuras.
- Link "pular para o conteúdo" como primeiro elemento focável.
- `<title>` único por rota, e `lang="pt-BR"` no documento.
- Animações suprimidas sob `prefers-reduced-motion`.
- Lint de acessibilidade ativo: `oxlint` com `jsx-a11y`, verificado disparando em violação real.

**Auditoria feita na tela renderizada em 2026-10-23**, calculando contraste sobre as cores computadas com composição de alfa: **0 falhas em 77 elementos** de `/unidades` e **0 em 55** de `/agendamento` com erros exibidos. Borda de campo inválido em 6,16:1. Texto a 200% sem rolagem horizontal nem corte. Hierarquia de cabeçalhos, rótulos, marcos, `lang` e `title` conferidos.

A auditoria encontrou e corrigiu três problemas reais: contraste insuficiente no item ativo da navegação, e alvos de toque abaixo de 24 px no rodapé e nos títulos dos cards.

**Ainda não testado com leitor de tela real nem em dispositivo móvel real.** Verificação automatizada cobre uma fração da WCAG, então ausência de erro não significa conformidade.

## Privacidade

- Projeto alinhado à **LGPD**. Informações de saúde são **dados pessoais sensíveis** (art. 5º, II).
- Coleta-se o mínimo necessário para demonstrar o fluxo de formulário; **nenhum dado clínico** é solicitado.
- **Nenhum dado real de paciente** é usado em exemplos, mocks ou testes — todos os dados são fictícios.
- Nada é enviado a servidor: não há backend que receba dados de formulário.
- Nenhuma credencial ou segredo é versionado.

## Créditos e atribuições

- Dados geográficos e de estabelecimentos: **© OpenStreetMap contributors**, disponíveis sob [ODbL](https://www.openstreetmap.org/copyright). A atribuição será exibida no mapa, conforme exigido.
- Geocodificação: **Nominatim**, operado pela OpenStreetMap Foundation, sujeito à sua [política de uso](https://operations.osmfoundation.org/policies/nominatim/).
- Tiles de mapa: **OpenStreetMap**, sujeitos à [Tile Usage Policy](https://operations.osmfoundation.org/policies/tiles/).
- Ícones: [Lucide](https://lucide.dev) (ISC), derivado do Feather Icons (MIT).
- Componentes: [shadcn/ui](https://ui.shadcn.com) (MIT), sobre [Radix UI](https://www.radix-ui.com) (MIT).
- Conteúdo educativo: fontes oficiais citadas individualmente em cada página.

## Licença

A definir pelo autor. Enquanto não houver arquivo `LICENSE`, nenhuma licença de uso é concedida.

---

**Autor:** ResourceShade · **Instituição:** UNINASSAU · **Disciplina:** Front-End Frameworks


## Publicação no Vercel

A publicação do Saúde Perto com login e Supabase está descrita em [PUBLICAR-NO-VERCEL.md](PUBLICAR-NO-VERCEL.md).
