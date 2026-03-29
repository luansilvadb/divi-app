# Feature Specification: Refactor Design System Color Palette

**Feature Branch**: `002-refactor-color-palette`  
**Created**: 2026-03-29  
**Status**: Draft  
**Input**: User description: "Atue como um Arquiteto de Design Systems e Especialista em UI/UX Sênior. Sua tarefa é refatorar a paleta de cores do nosso design system para transmitir uma imagem altamente profissional, alinhada com um(a) [TIPO DE PRODUTO/PROJETO]. A paleta deve evocar sentimentos de [VALORES DA MARCA]. Você deve construir uma estrutura completa e harmônica para Light Mode e Dark Mode, garantindo alto contraste e acessibilidade (padrão WCAG). Por favor, gere a paleta abordando as seguintes categorias obrigatórias para ambos os temas (Light/Dark): 1. Brand Colors (Primary, Secondary, Accent). 2. Neutral Colors / Backgrounds (Background, Surface, Borders). 3. Text Colors (Primary, Secondary, Disabled). 4. Semantic Colors (Success, Warning, Error, Info). Formato de saída: Apresente o resultado em [FORMATO DESEJADO]. Organize as informações em tabelas claras, mostrando o nome do token, a cor no Light Mode e a cor correspondente no Dark Mode. Finalize com um breve parágrafo justificando a psicologia das cores escolhidas."

## Clarifications

### Session 2026-03-29
- Q: Qual a estratégia de persistência do tema? → A: LocalStorage (Persistência no navegador para aplicação instantânea).
- Q: O sistema deve detectar a preferência de tema do SO automaticamente? → A: Sim (Respeita o tema do SO no primeiro acesso).
- Q: Como deve ser a transição visual ao trocar o tema? → A: Suave (Transição de ~300ms em todas as cores relevantes).
- Q: Deve haver transição no carregamento inicial da página? → A: No (Inibe a animação no load para evitar 'flash').
- Q: O sistema deve suportar tokens de bibliotecas de terceiros? → A: Sim (Mapeia tokens externos para nossas variáveis CSS).
- Q: Qual framework de CSS deve ser utilizado para a implementação? → A: Tailwindcss.
- Q: Qual a estratégia de configuração do Tailwindcss? → A: Extensão (Mapeia var(--color-*) no tailwind.config.js para usar classes utilitárias).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consistent Brand Visuals (Priority: P1)

Como um usuário do sistema Divi, quero que a interface utilize cores que transmitam profissionalismo e confiança, independentemente de estar usando o tema claro ou escuro, para que eu tenha uma experiência visual agradável e coesa.

**Why this priority**: A identidade visual é o primeiro ponto de contato e estabelece a percepção de valor e seriedade do produto financeiro.

**Independent Test**: Pode ser testado alternando entre Light e Dark Mode em diferentes páginas e verificando se os componentes mantêm a hierarquia visual e a legibilidade.

**Acceptance Scenarios**:

1. **Given** o sistema no Light Mode, **When** um componente utiliza a cor `Primary`, **Then** ele deve ter contraste WCAG AA (mínimo 4.5:1) contra o `Background`.
2. **Given** o sistema no Dark Mode, **When** um componente utiliza a cor `Primary`, **Then** ele deve manter a mesma identidade de marca, mas com ajustes de luminosidade para evitar fadiga ocular.

---

### User Story 2 - Accessible Content (Priority: P1)

Como um usuário com deficiência visual leve, quero que todo o texto do sistema tenha alto contraste em relação ao fundo, para que eu possa ler minhas informações financeiras sem dificuldades.

**Why this priority**: Acessibilidade não é opcional, especialmente em ferramentas de utilidade onde a precisão da informação é crítica.

**Independent Test**: Utilizar ferramentas de verificação de contraste (como Axe ou Color Contrast Analyzer) em todas as combinações de tokens de texto e fundo.

**Acceptance Scenarios**:

1. **Given** um texto com o token `Text-Primary`, **When** renderizado sobre `Background` ou `Surface`, **Then** o contraste deve ser de no mínimo 4.5:1 para texto normal e 3:1 para texto grande.

---

### User Story 3 - Semantic Clarity (Priority: P2)

Como um usuário acompanhando meus gastos, quero que cores de erro (vermelho) e sucesso (verde) sejam claras e distintas, para que eu entenda o status das minhas transações instantaneamente.

**Why this priority**: Cores semânticas reduzem a carga cognitiva ao fornecer feedback imediato sobre o estado do sistema.

**Acceptance Scenarios**:

1. **Given** uma transação confirmada, **When** o ícone de status é exibido, **Then** ele deve usar o token `Success` que seja legível em ambos os temas.
2. **Given** um campo com erro, **When** a borda muda de cor, **Then** ela deve usar o token `Error` com contraste suficiente para ser percebida como um alerta.

---

### Edge Cases

- **Custom Colors in Charts**: Como a nova paleta afeta as cores de gráficos (PatrimonialChart)? (Assunção: A paleta fornecerá uma gama de cores secundárias ou de acento compatíveis).
- **Extreme Contrast Mode**: O sistema precisa de um tema de alto contraste (High Contrast)? (Assunção: Não para esta fase, focaremos em WCAG AA nos temas padrão).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE fornecer um conjunto completo de tokens de cores para Light Mode e Dark Mode.
- **FR-002**: Todos os pares de cores Texto/Fundo DEVEM atender ao padrão WCAG AA de contraste.
- **FR-003**: A paleta DEVE incluir cores de Marca: Primary (Principal), Secondary (Secundária) e Accent (Destaque).
- **FR-004**: A paleta DEVE incluir cores Neutras: Background (Fundo), Surface (Superfície/Cards) e Borders (Bordas).
- **FR-005**: A paleta DEVE incluir cores de Texto: Primary (Principal), Secondary (Secundário/Apoio) e Disabled (Desabilitado).
- **FR-006**: A paleta DEVE incluir cores Semânticas: Success (Sucesso), Warning (Aviso), Error (Erro) e Info (Informação).
- **FR-007**: As cores DEVEM ser definidas como variáveis CSS (Custom Properties) para fácil manutenção e troca de tema dinâmica.
- **FR-008**: O sistema DEVE utilizar uma paleta de cores alinhada ao perfil de Banco Tradicional / Premium, evocando sentimentos de Segurança, Confiança e Solidez.
- **FR-009**: A paleta DEVE priorizar tons de azul marinho, verde esmeralda ou dourado, com uma estética sóbria e profissional.
- **FR-010**: A preferência de tema do usuário DEVE ser persistida no LocalStorage para garantir a aplicação imediata no carregamento da página.
- **FR-011**: O sistema DEVE detectar a preferência de tema do Sistema Operacional (prefers-color-scheme) no primeiro acesso, se nenhuma preferência estiver salva.
- **FR-012**: As transições de cor ao alternar entre os temas DEVEM ser suaves (~300ms) para proporcionar uma experiência premium.
- **FR-013**: O sistema DEVE inibir qualquer animação de transição de tema durante o carregamento inicial da página para evitar efeitos visuais indesejados (FOUC).
- **FR-014**: O sistema DEVE permitir o mapeamento de tokens de bibliotecas de componentes de terceiros para as variáveis CSS globais, garantindo consistência visual em todo o app.
- **FR-015**: O sistema DEVE utilizar Tailwindcss como framework CSS principal, mapeando as variáveis CSS (`--color-*`) no arquivo `tailwind.config.js` para permitir o uso de classes utilitárias nativas (ex: `text-primary-main`).

### Key Entities *(include if feature involves data)*

- **Theme**: Representa o conjunto de tokens de cores ativos (Light ou Dark).
- **Color Token**: O identificador semântico (ex: `--color-primary`) que mapeia para um valor hexadecimal diferente dependendo do Theme.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% dos tokens de texto sobre fundos correspondentes passam no teste de contraste WCAG AA.
- **SC-002**: A alternância de temas (Light/Dark) ocorre instantaneamente sem "flash" de cores incorretas.
- **SC-003**: A paleta é documentada em uma tabela clara com nomes de tokens e valores hexadecimais para ambos os modos.
- **SC-004**: Justificativa psicológica das cores alinhada aos valores de Segurança, Confiança e Solidez apresentada.

## Assumptions

- **Padrão de Produto**: O projeto segue um perfil de Banco Tradicional / Premium, focado em estabilidade e prestígio.
- **Valores da Marca**: Foco em Segurança, Confiança e Solidez para a escolha das cores.
- **Framework CSS**: O projeto utilizará Tailwindcss para a construção da interface e gerenciamento de estilos.
- **Implementação**: A implementação será feita via CSS Variables no arquivo global de temas (`src/core/styles/theme.css`), integradas ao Tailwindcss através da extensão do tema (`theme.extend`).
- **Gerenciamento**: A lógica de persistência e detecção de tema residirá em `src/core/theme/themeManager.ts`.
- **Persistência**: O tema selecionado será armazenado no navegador (LocalStorage) com chave `divi-ui-theme`.
- **Nomenclatura**: Seguiremos a convenção de nomenclatura kebab-case para os tokens (ex: `primary-main`, `text-secondary`).


---
