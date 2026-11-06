# Requisitos — Saúde Perto

Requisitos funcionais e não funcionais com **critérios de aceitação verificáveis**.

Estado de cada requisito: `Planejada` · `Em desenvolvimento` · `Implementada` · `Testada` · `Bloqueada`
O estado consolidado vive em `docs/PROJECT_MEMORY.md` §E, que é a fonte de verdade.

**Última atualização:** 2026-10-23, após a Fase 3.

| Estado | Funcionais | Não funcionais |
|---|---|---|
| **Testada** | **7** (RF03, RF04, RF10, RF11, RF12, RF14, RF15) | **3** (RNF04, RNF10, RNF11) |
| Implementada | 9 | 2 (RNF03, RNF08) |
| Planejada | 0 | 7 |

Os 16 requisitos funcionais estão implementados. **105 testes automatizados** cobrem os critérios dos 7 marcados como Testada; a auditoria de acessibilidade na tela renderizada cobre RNF04.

Segue sem cobertura: **leitor de tela real** (P13) e **dispositivo móvel real**.

> Um requisito só é marcado como **Testada** quando houver teste automatizado passando ou verificação manual registrada em `docs/PROJECT_MEMORY.md` §H. Código escrito não é requisito cumprido.

---

## 1. Requisitos funcionais

### RF01 — Página inicial
**Descrição:** Apresentar o propósito da aplicação, os serviços disponíveis e campanhas em destaque, com caminhos claros para as seções principais.
**Critérios de aceitação:**
- A página carrega na rota `/` e exibe título identificável como `<h1>`.
- Há blocos de acesso às seções de unidades, campanhas e conteúdo educativo, cada um navegável por clique e por teclado.
- Campanhas em destaque exibem no máximo 3 itens, com rótulo de origem do dado.
- Nenhum link leva a rota inexistente.
**Estado:** Implementada (2026-10-23) — **não testada**: sem teste automatizado e sem inspeção visual (P8)

### RF02 — Busca de unidades de saúde por localidade
**Descrição:** Permitir que a pessoa informe um município ou endereço e obtenha unidades de saúde correspondentes.
**Critérios de aceitação:**
- Campo de busca com rótulo associado (`<label for>`), submissível por Enter e por botão.
- O termo é geocodificado antes da consulta de unidades.
- Busca sem resultado exibe estado vazio explicativo, não uma lista em branco.
- Falha de rede exibe mensagem de erro e opção de nova tentativa.
- Requisições são debounced ou disparadas apenas no submit, respeitando o limite de 1 req/s do Nominatim.
**Dependências:** F2 e F3 em `docs/apis.md`; bloqueado parcialmente por P2.
**Estado:** Planejada

### RF03 — Listagem de unidades
**Descrição:** Exibir as unidades encontradas em lista legível.
**Critérios de aceitação:**
- Cada item mostra nome, tipo de estabelecimento e endereço quando disponíveis.
- Campo ausente na fonte exibe indicação de "não informado", nunca `undefined`, `null` ou vazio silencioso.
- A lista é uma estrutura semântica (`<ul>`/`<li>`) e navegável por teclado.
- A origem do dado (OpenStreetMap ou demonstrativo) é visível.
**Estado:** Planejada

### RF04 — Filtros de unidades
**Descrição:** Reduzir a lista por tipo de estabelecimento e serviço.
**Critérios de aceitação:**
- Filtros são controles de formulário acessíveis com rótulo.
- Aplicar filtro atualiza a lista e a contagem de resultados sem recarregar a página.
- Existe ação visível para limpar filtros.
- Combinação de filtros sem resultado exibe estado vazio, com sugestão de limpar filtros.
**Estado:** Planejada

### RF05 — Detalhes da unidade
**Descrição:** Página dedicada com as informações disponíveis de uma unidade.
**Critérios de aceitação:**
- Rota própria e parametrizada, acessível por URL direta.
- Exibe todos os campos disponíveis na fonte e indica os ausentes.
- Mapa centrado na unidade, quando houver coordenadas.
- Identificador inexistente leva a estado de "não encontrado", não a tela quebrada.
**Estado:** Planejada

### RF06 — Mapa interativo
**Descrição:** Mapa com marcadores das unidades, navegável.
**Critérios de aceitação:**
- O mapa renderiza tiles do OpenStreetMap com a atribuição obrigatória visível.
- Marcadores correspondem às unidades da lista atual.
- Clicar em um marcador exibe identificação da unidade e caminho para seus detalhes.
- Existe alternativa textual equivalente: a lista de unidades cumpre essa função e o mapa não é o único meio de acesso à informação (WCAG 2.2, 1.1.1).
- O mapa não captura o foco do teclado de forma a impedir a saída por Tab.
**Dependências:** F4 em `docs/apis.md`.
**Estado:** Planejada

### RF07 — Campanhas de saúde preventiva
**Descrição:** Listar campanhas com descrição, público-alvo e orientação de participação.
**Critérios de aceitação:**
- Cada campanha exibe a fonte da informação.
- Conteúdo é marcado como demonstrativo/editorial quando não vier de fonte oficial verificada.
- **Nenhuma campanha, data ou estatística é inventada.** Campanha sem fonte verificável não é publicada.
**Estado:** Planejada

### RF08 — Conteúdo educativo de primeiros socorros
**Descrição:** Orientações básicas de primeiros socorros, organizadas por situação.
**Critérios de aceitação:**
- Cada conteúdo cita a fonte oficial de onde foi derivado.
- Aviso visível de que o material é informativo e não substitui atendimento profissional.
- Telefone de emergência (192 — SAMU) apresentado de forma destacada e correta.
- Estrutura com hierarquia de cabeçalhos correta, navegável por leitor de tela.
**Estado:** Planejada

### RF09 — Conteúdo educativo de saúde mental
**Descrição:** Informação sobre bem-estar mental e onde buscar ajuda.
**Critérios de aceitação:**
- Cita fontes oficiais.
- Apresenta canal de apoio em crise de forma destacada (CVV — 188).
- Aviso de que não substitui acompanhamento profissional.
- Linguagem não estigmatizante; sem autodiagnóstico ou questionário clínico.
**Estado:** Planejada

### RF10 — Formulário de solicitação de agendamento (demonstrativo)
**Descrição:** Fluxo que demonstra a solicitação de agendamento, sem efeito real.
**Critérios de aceitação:**
- Aviso **visível antes do primeiro campo** de que a solicitação é demonstrativa e não gera agendamento real.
- Coleta apenas o mínimo: identificação do solicitante, unidade, tipo de atendimento e preferência de data. **Nenhum campo clínico, nenhum CPF, nenhum cartão SUS.**
- Nenhum dado é enviado a servidor (não há backend).
- Todos os campos têm rótulo associado e são operáveis por teclado.
**Estado:** Planejada

### RF11 — Validação de formulário
**Descrição:** Validar entradas com feedback acessível.
**Critérios de aceitação:**
- Validação por esquema Zod, compartilhada entre formulário e tipos.
- Mensagem de erro associada ao campo via `aria-describedby`; campo inválido marcado com `aria-invalid`.
- Erro não é comunicado apenas por cor (WCAG 2.2, 1.4.1).
- Ao submeter com erros, o foco vai para o primeiro campo inválido.
- Mensagens em português, específicas e acionáveis.
**Estado:** Planejada

### RF12 — Confirmação de envio
**Descrição:** Retorno claro após o envio do formulário.
**Critérios de aceitação:**
- A tela de confirmação declara explicitamente que **nenhuma consulta foi agendada** e que a solicitação é demonstrativa.
- Exibe um protocolo simulado, rotulado como simulado.
- A confirmação é anunciada a leitores de tela (região com `role="status"` ou movimentação de foco).
- **Nunca** usa linguagem como "consulta confirmada", "agendamento realizado" ou equivalente.
**Estado:** Planejada

### RF13 — Acompanhamento de solicitações simuladas
**Descrição:** Listar as solicitações criadas na sessão.
**Critérios de aceitação:**
- Exibe as solicitações feitas, com rótulo de dado simulado.
- O mecanismo de armazenamento e sua volatilidade são declarados na interface.
- Lista vazia exibe estado vazio com orientação.
- Nenhum dado sensível é armazenado.
**Estado:** Planejada

### RF14 — Estados de carregamento, erro e vazio
**Descrição:** Toda operação assíncrona cobre seus três estados.
**Critérios de aceitação:**
- Carregamento exibe indicador e o anuncia a leitores de tela (`aria-busy` ou região live).
- Erro exibe mensagem compreensível, sem stack trace ou jargão técnico, com ação de nova tentativa.
- Resultado vazio é distinguido de erro e explica o que fazer.
- Nenhuma tela fica indefinidamente em branco.
**Estado:** Em desenvolvimento (2026-10-23) — **não testada**: sem teste automatizado e sem inspeção visual (P8)

### RF15 — Navegação responsiva
**Descrição:** Navegação consistente entre páginas, funcional em qualquer largura.
**Critérios de aceitação:**
- Em telas estreitas, menu recolhido acionável por teclado, com `aria-expanded` correto.
- A página atual é identificada na navegação (`aria-current="page"`).
- Existe link "pular para o conteúdo" como primeiro elemento focável.
- Abrir o menu move o foco para dentro dele; `Esc` fecha e devolve o foco ao acionador.
**Estado:** Implementada (2026-10-23) — **não testada**: sem teste automatizado e sem inspeção visual (P8)

### RF16 — Páginas informativas
**Descrição:** Páginas de apoio: sobre o projeto, acessibilidade, privacidade e erro 404.
**Critérios de aceitação:**
- A página "sobre" declara o caráter acadêmico e as limitações do projeto.
- A página de privacidade explica quais dados são coletados, por que, e que nada é enviado a servidor.
- A rota 404 responde a qualquer caminho inexistente com caminho de volta ao início.
**Estado:** Implementada (2026-10-23) — **não testada**: sem teste automatizado e sem inspeção visual (P8)

---

## 2. Requisitos não funcionais

### RNF01 — Responsividade
**Critérios:** Layout utilizável de **320 px** até desktop, sem rolagem horizontal; nenhum conteúdo cortado ou sobreposto; alvos de toque de pelo menos 24×24 px (WCAG 2.2, 2.5.8); verificado em 320, 375, 768, 1024 e 1440 px.
**Estado:** Planejada

### RNF02 — Acessibilidade WCAG 2.2 AA
**Critérios:** HTML semântico com marcos (`header`, `nav`, `main`, `footer`); hierarquia de cabeçalhos sem salto de nível; toda imagem informativa com texto alternativo e decorativa com `alt=""`; nenhuma informação transmitida apenas por cor; a página tem `lang="pt-BR"`; `<title>` único e descritivo por rota; zero erros críticos em auditoria automatizada (axe) **mais** verificação manual, já que ferramenta automática não cobre tudo.
**Estado:** Planejada

### RNF03 — Operação por teclado
**Critérios:** Todo controle interativo alcançável por Tab e acionável por Enter/Espaço; ordem de foco segue a ordem visual; nenhuma armadilha de foco; diálogos devolvem o foco ao elemento que os abriu; `Esc` fecha sobreposições.
**Estado:** Planejada

### RNF04 — Contraste e foco visível
**Critérios:** Contraste ≥ 4,5:1 para texto normal e ≥ 3:1 para texto grande e componentes de interface (WCAG 1.4.3 e 1.4.11); indicador de foco visível em todo elemento focável, com contraste ≥ 3:1 contra o fundo adjacente; o contorno de foco padrão não é removido sem substituto equivalente.
**Estado:** Em desenvolvimento (2026-10-23) — contraste da paleta medido e foco de 3 px implementado; nada verificado na tela renderizada (P8). Medições em `docs/arquitetura.md` §10

### RNF05 — Desempenho
**Critérios:** Build de produção conclui sem aviso de bundle excessivo; o mapa é carregado de forma preguiçosa (`lazy`), não no bundle inicial; resultados de busca são cacheados na sessão para evitar requisição repetida idêntica; imagens dimensionadas e com `loading="lazy"` fora da primeira dobra.
**Estado:** Planejada

### RNF06 — Compatibilidade de navegadores
**Critérios:** Funciona nas duas últimas versões estáveis de Chrome, Firefox e Safari, incluindo Safari iOS; nenhuma API de navegador usada sem verificação de disponibilidade. **Alvo de compilação real: ES2023**, conforme `tsconfig.app.json` — mais recente que o ES2020+ previsto, o que exige atenção a navegadores antigos.
**Estado:** Planejada

### RNF07 — Segurança
**Critérios:** Nenhum segredo, token ou credencial no código ou no repositório; `.env` no `.gitignore`; nenhuma inserção de HTML não confiável (`dangerouslySetInnerHTML` proibido sem sanitização justificada); todo dado externo validado com Zod antes de uso; dependências sem vulnerabilidade crítica conhecida em `npm audit`.
**Estado:** Planejada

### RNF08 — Privacidade e LGPD
**Critérios:** Informações de saúde são dados pessoais sensíveis (LGPD art. 5º, II) — coleta restrita ao mínimo demonstrativo; nenhum dado clínico solicitado; nenhum dado real de paciente em exemplos, mocks ou testes; nada enviado a servidor; `localStorage` usado apenas para dados não sensíveis, com a limitação declarada na interface; página de privacidade explicando tudo isso.
**Estado:** Planejada

### RNF09 — Manutenibilidade
**Critérios:** TypeScript sem `any` implícito; cada `any` explícito acompanhado de comentário justificando; nomes de arquivos e componentes seguindo a convenção de `docs/arquitetura.md`; nenhuma chamada de rede fora de `src/services/`; `npm run lint` (oxlint) sem erro.
**Estado parcial verificado em 2026-10-23:** `strict` e `noUncheckedIndexedAccess` habilitados; `npm run lint` passa com exit 0 e zero avisos. Os demais critérios dependem de código que ainda não existe.
**Estado:** Planejada

### RNF10 — Testabilidade
**Critérios:** Vitest e Testing Library configurados e executando; todo esquema Zod com teste de caso válido e inválido; cada fluxo principal (busca, filtro, formulário) com teste de integração usando rede simulada; testes consultam por papel e rótulo acessível, não por classe CSS; `npm run test` passa de forma determinística.
**Estado:** Planejada

### RNF11 — Confiabilidade das integrações
**Critérios:** Toda chamada externa tem timeout; falha de API degrada para dado demonstrativo rotulado, não para tela quebrada; retentativa com backoff exponencial onde o provedor recomenda (Overpass); a origem do dado exibido é sempre identificável pelo usuário; indisponibilidade de API registrada em `docs/apis.md` com data.
**Estado:** Planejada

### RNF12 — Facilidade de publicação
**Critérios:** `npm run build` gera artefato estático servível; `base` do Vite compatível com subcaminho do GitHub Pages; roteamento client-side funciona em recarga de URL profunda no host estático; `README.md` com instruções reproduzíveis por terceiro; `.env.example` presente e sem segredos.
**Estado:** Planejada

---

## 3. Fora do escopo

Explicitamente **não** serão implementados, e não devem ser prometidos em nenhum documento ou tela:

| Item | Por quê |
|---|---|
| Agendamento oficial na rede pública | Exige backend e integração autorizada com sistemas do SUS |
| Autenticação e conta de usuário | Exige backend e armazenamento seguro de credenciais |
| Persistência compartilhada entre dispositivos | Exige banco de dados em servidor |
| Notificações reais (push, SMS, e-mail) | Exige backend e serviço de envio |
| Prontuário ou histórico clínico | Dado sensível; fora do propósito acadêmico e risco de privacidade |
| Telemedicina ou triagem clínica | Exige responsabilidade profissional e regulatória |
| Aplicativo nativo Android/iOS | O projeto é uma aplicação web responsiva |
