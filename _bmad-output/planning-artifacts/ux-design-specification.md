stepsCompleted: [1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12]
status: revision_in_progress
revisionDate: 2026-04-12
inputDocuments: ['_bmad-output/planning-artifacts/prd.md', '_bmad-output/planning-artifacts/product-brief-divi-app.md', '_bmad-output/project-context.md']
---

# UX Design Specification divi-app

**Author:** Luan
**Date:** 2026-04-12

---

## Executive Summary (Revisão Socrática)

### Project Vision

O **divi-app** evolui de um sistema de controle financeiro para um **Navegador de Próximo Passo**. Ele é um consultor proativo e silencioso que utiliza o passado como dado de entrada para projetar o futuro com previsibilidade real. O foco é a **Soberania Financeira** através de um Orçamento Base Zero reativo, que prioriza a conservação do patrimônio e a aceleração de investimentos, sinalizando "Rotas de Colisão" e automatizando a "Esperança Matemática" através da eficiência.

### Target Users (Revisão)

- **Entidades Proativas (Pessoas e Empresas):** Usuários que buscam modernidade e o mínimo de tomadas de decisão manuais, confiando em um sistema que gerencia a carga mental financeira.
- **Moradores Compartilhados:** Pessoas que precisam de transparência em contas coletivas (Aluguel/Luz) sem sacrificar a privacidade de gastos pessoais.

### Key Design Challenges (Revisão)

- **Notificações de Autoridade:** Como ser proativo e "dar o caminho" sem ser invasivo ou burocrático.
- **A Interface de Guerra (ZBB Radical):** Sinalizar a "Rota de Colisão" de forma técnica e séria, sem causar o abandono do app por medo.
- **Aprovação de Fluxo:** Implementar o "Ato de Governança" (confirmação de eficiência) de forma reativa e fluida, sem o atraso de um botão de "OK" manual.

### Design Opportunities (Revisão)

- **Tempo de Vida como Moeda:** Visualizar a economia como "Data de Conquista Encurtando".
- **Inteligência Centralizada (Backoffice):** Entregar "Melhores Práticas" de cenários reais via motor centralizado direto na notificação.

---

## 2. Core User Experience (Revisão)

### 2.1 Defining Experience

A experiência definitiva do **divi-app** é a **"Navegação de Resiliência Assistida"**. O foco principal não é mais o registro de dados (que deve ser quase invisível), mas a **Interação com a Oportunidade**. O core loop é: Ocorrência do Mundo Real -> Insight Proativo -> Decisão Reativa de 1 Segundo -> Recálculo Silencioso do Futuro.

### 2.2 Platform Strategy

- **PWA Reativo:** Foco absoluto em notificações push ricas que permitem a tomada de decisão sem abrir o app.
- **Offline-First Sentinela:** O Service Worker processa os cenários do Backoffice localmente, garantindo que o "Consultor" esteja sempre ao lado do usuário, mesmo sem rede.

### 2.3 Effortless Interactions

- **Aprovação de Insight via Notificação:** O usuário aceita uma sugestão do motor central (ex: realocar saldo de categoria) com um único clique.
- **ZBB Auto-Balanceado:** O Orçamento Base Zero se ajusta matematicamente a cada desvio, apresentando apenas o "Próximo Passo" necessário para manter o equilíbrio.

### 2.4 Critical Success Moments

- **O "Sim" da Redenção:** Quando o usuário aprova um insight e vê a data de conquista de uma meta importante "pular" para mais perto instantaneamente.
- **A Evasão de Colisão:** O alívio de receber um alerta precoce e ver o plano de contingência (ZBB Radical) ser montado autonomamente.

### 2.5 Experience Principles

1. **Previsibilidade como Esperança:** O número frio da data de conquista é a única mensagem de otimismo necessária.
2. **Autonomia sem Perda de Soberania:** O app propõe e orienta, mas o usuário é o dono da decisão final.
3. **Fricção Inversa:** Registrar dados deve ser difícil; tomar decisões estratégicas deve ser fácil.
4. **Resiliência Silenciosa:** O app nunca desiste do usuário; ele apenas recalcula a rota, sempre "bola pra frente".

---

## 3. Desired Emotional Response (Revisão)

### 3.1 Primary Emotional Goals

1. **Soberania e Comando:** O usuário deve se sentir o "Almirante" da sua própria frota financeira. O app é o radar; a decisão final é o comando.
2. **Alívio Preditivo:** A sensação de "Ufa, fui avisado a tempo" ao detectar uma Rota de Colisão.
3. **Segurança Matemática:** A paz de espírito que nasce da certeza de que os números não mentem e que o futuro é calculável.
4. **Resiliência Estóica:** Calma e foco absoluto durante o "ZBB Radical" (Modo de Guerra).

### 3.2 Emotional Journey Mapping

- **Entrada (Onboarding):** De "Ansiedade Financeira" para "Clareza Técnica". O usuário vê o seu "Inimigo" (dívidas/gastos cegos) sendo mapeado.
- **Transação Crítica:** O "Thump" tátil e a notificação proativa geram um senso de "Custo de Oportunidade Realizado".
- **Fase de Guerra (ZBB Radical):** Transição de "Pânico" para "Plano de Ação de Elite". A interface se torna austera, transmitindo autoridade e proteção.
- **Redenção:** Alívio profundo ao ver a data de conquista encurtar e o "Plano de Crescimento" ser reativado.

### 3.3 Micro-Emotions

- **Confiança (Trust):** Gerada pela precisão do BigInt e pelo funcionamento 100% Offline (Soberania de Dados).
- **Antecipação (Anticipation):** O desejo de ver o impacto da próxima economia na data de conquista.
- **Determinação (Determination):** O impulso de cumprir a "Success Task" para recuperar o tempo de vida.

### 3.4 Design Implications (Aliado de Elite)

- **Estética "Cofre de Banco":** Paleta baseada em "Negro Obsidian" e "Cinza Encouraçado". Dourado (Muted Gold) reservado para vitórias.
- **Tipografia de Precisão:** Inter (Semi-bold) para autoridade e JetBrains Mono para dados financeiros (Rigor Matemático).
- **Animações Mecânicas:** Movimentos deliberados e "pesados". Feedback tátil "Thump" como o fechamento de um ferrolho.
- **Interface de Guerra:** "Despida Tática" - remoção de sombras e adornos, foco em alto contraste e cronômetros de liquidez.
- **Notificações "Briefing":** Tom lacônico e direto. Foco em "Dias de Vida Recuperados" e "Poder de Fogo Acumulado".

### 3.5 Emotional Design Principles

1. **A Verdade Liberta:** O app nunca esconde a gravidade; a precisão é a base da confiança.
2. **O Silêncio é Poder:** O consultor só interrompe para salvar o futuro. O silêncio é sinal de rota segura.
3. **Não Somos Amigos, Somos Aliados:** Postura de estrategista de elite. Respeito mútuo através da competência técnica.

---

## 4. UX Pattern Analysis & Inspiration (Revisão)

### 4.1 Inspiring Products Analysis

1.  **Obsidian (Soberania de Dados):** Inspiração para o conceito de "Vaults" (Cofres) e navegação estruturada. A sensação de que o dado é um "objeto físico" local que o usuário possui.
2.  **Bloomberg Terminal (Autoridade de Dados):** Inspiração para a densidade de informações e o tom de voz "Briefing". A interface foca no que é vital para a tomada de decisão imediata.
3.  **VS Code / TradingView (Performance e Comando):** Uso de atalhos globais (CMD+K) e reatividade extrema. O app deve parecer um "IDE Financeiro".

### 4.2 Transferable UX Patterns

- **Command Palette (Atalhos Globais):** Uma barra de comando central para o "Navegador de Próximo Passo" (ex: "Acelerar Meta X", "Mudar para Modo de Guerra").
- **Live Preview (Forecast Reativo):** O gráfico que "respira" conforme o dado é digitado, similar à renderização em tempo real de editores de Markdown.
- **Micro-Copy de Inteligência:** Substituir frases genéricas por dados técnicos precisos (ex: "+R$ 150 em Poder de Fogo").

### 4.3 Anti-Patterns to Avoid

- **Gráficos de Pizza Retrospectivos:** Evitar a visualização passiva de gastos passados que não geram ação.
- **"Gamificação Colorida):** Evitar elementos visuais infantis ou "fofos" que diminuam a percepção de seriedade e segurança.
- **Fricção de Navegação:** Evitar esconder decisões críticas atrás de múltiplos menus. Tudo deve estar a um "Sim" de distância.

### 4.4 Design Inspiration Strategy

- **Adotar:** A sobriedade do design "Raw" (Bruto) onde o dado é a estrela.
- **Adaptar:** O conceito de "Vault" para a separação de privacidade entre "Minha Vida" e "Vida da Casa".
- **Evitar:** A linguagem de "venda de sonhos" ou "cupons de desconto" comum em fintechs tradicionais.

---

## 5. Design System Strategy (Revisão)

### 5.1 Naive UI Customizado (Aliado de Elite)

A base técnica do **divi-app** será o **Naive UI**, selecionado por sua robustez em componentes complexos e sistema de temas altamente parametrizável. A customização será profunda para remover a estética "Web padrão" e adotar o tom de um Terminal de Inteligência.

- **Theming Engine:** Uso exaustivo do `n-config-provider` para injetar a paleta "Aliado de Elite" em todos os componentes.
- **UnoCSS Integration:** O UnoCSS será utilizado para o layout estrutural e para componentes "Brutalistas" construídos sob medida (como o Forecast e o Smart Entry), garantindo controle total sobre espaçamentos rígidos e tipografia mono.
- **Customização de Componentes:**
    - **Data Tables:** Configuração para alta densidade de dados, sem bordas arredondadas e com tipografia JetBrains Mono.
    - **Modais e Dropdowns:** Animações mecânicas "pesadas" e estilos de borda sólidos (1px) sem sombras suaves.
    - **Buttons:** Estilo "Ghost" ou sólido com contraste máximo, reforçando a ação de "Comando".

### 5.2 Technical Foundation Principles

1. **Densidade sobre Espaço:** Priorizar a exibição de dados estratégicos em vez de grandes áreas de respiro.
2. **Rigor Visual:** Alinhamento perfeito e ausência de adornos que não tenham função técnica.
3. **Reatividade Perceptível:** Feedback visual imediato para cada comando, reforçando a sensação de uma máquina de precisão.

---

## 6. Visual Design Foundation (Revisão)

### 6.1 Color System

- **Paleta "Cofre de Banco":** Base em `Deep Navy` (#0A192F) e `Obsidian Black` (#020617). Transmite solidez e segurança.
- **Superfícies Táticas:** `Slate Gray` (#1E293B) para cards e agrupamentos de dados densos.
- **Destaque de Vitória:** `Muted Gold` (#B45309) reservado para feedbacks de aceleração de metas e eficiência.
- **Modo de Guerra (ZBB Radical):** `Tactical Amber` (#F59E0B). Uma cor de alerta técnico que evita o pânico, criando um estado de "Emergência Segura".
- **Estratégia de Contraste:** Estética "CRT Monitor", maximizando a relação sinal-ruído para consumo de dados sob estresse.

### 6.2 Typography System

- **Voz de Autoridade (UI):** `Inter` (Sans-serif) para navegação geral, rótulos e textos explicativos. Pesos semi-bold para comandos.
- **Voz da Verdade (Dados/Guerra):** `JetBrains Mono` (Monospace) para TODOS os valores financeiros, tabelas e interface de Modo de Guerra.
- **Racional:** Fontes monoespaçadas garantem alinhamento decimal perfeito, permitindo o reconhecimento instantâneo de anomalias por geometria visual.
- **Abordagem Híbrida:** Inter para o contexto; JetBrains Mono para a "dureza" do dado em si.

### 6.3 Spacing & Layout (Cockpit)

- **Princípio Cockpit:** Alta densidade de informação para reduzir o custo de interação e o tempo de "caça" por dados críticos.
- **Grid Rígido:** Unidade base de 4px. Sem espaçamentos "soft"; cada pixel serve a uma função técnica ou estrutural.
- **Despida Tática (War Mode):** Remoção de sombras, gradientes e adornos decorativos. Bordas sólidas de 1px para delimitar o foco.
- **Densidade Racional:** Disponibilidade imediata de todos os dados do "Próximo Passo" no campo de visão primário.

### 6.4 Accessibility Considerations

- **Contraste:** Alvo WCAG AAA para todos os textos e dados financeiros.
- **Carga Cognitiva:** "Respiros Táticos" através de agrupamentos funcionais claros, mesmo em layouts de alta densidade.
- **Sinalização Visual:** Uso do Âmbar (590nm) por sua nitidez superior e baixa dispersão em ambientes escuros e cenários de alta tensão.

---

## 7. Design Direction Decision (Revisão)

### 7.1 Design Directions Explored

Foram exploradas quatro direções principais: **O Cofre Absoluto** (Soberania), **O Cockpit de Elite** (Performance), **O Consultor Silencioso** (Inteligência) e o **Modo de Guerra** (Resiliência). O debate focou no equilíbrio entre a densidade de informações necessária para a governança e a clareza exigida para a tomada de decisão rápida.

### 7.2 Chosen Direction: The Elite Financial Cockpit (Hybrid)

A direção escolhida é uma **Estratégia Híbrida** que combina a densidade do Cockpit com a autoridade visual do Cofre. A interface se comporta como um instrumento de alta fidelidade, operando em silêncio até que uma intervenção proativa ou uma crise (Modo de Guerra) exija o foco absoluto do usuário.

### 7.3 Design Rationale

- **Autoridade Técnica:** O uso de JetBrains Mono e paleta Obsidian reforça a percepção de um sistema inquebrável e preciso.
- **Eficiência Cognitiva:** A alta densidade (Cockpit) reduz o custo de interação, enquanto a "Fricção Inversa" garante que apenas decisões críticas exijam atenção.
- **Resiliência Psicológica:** O uso do Âmbar Tático e do "Survival Runway" no Modo de Guerra transforma o pânico em ação estratégica coordenada.

### 7.4 Implementation Approach

- **Theme Override:** Customização agressiva do Naive UI para remover arredondamentos e suavidades, adotando bordas de 1px e tipografia mono.
- **Reatividade RxJS:** O Forecast e os indicadores de "Poder de Fogo" devem respirar em tempo real conforme a entrada de dados.
- **Command Architecture:** Implementação de uma Command Palette central para navegação e comandos de governança.

---

## 8. User Journey Flows (Revisão Socrática)

### 8.1 Jornada de Governança Instantânea (Clara)

**Objetivo:** Registro de baixo atrito com consciência estratégica imediata.
- **Ação:** Clara usa o atalho global **CMD+K** ou o campo **Smart Entry**. Digita "Almoço 45" e pressiona Enter.
- **Mecânica:** O **Cockpit** processa o dado localmente (Dexie) e o gráfico de **Forecast** "respira" em milissegundos, mostrando o novo ponto de equilíbrio.
- **Sucesso:** Feedback tátil "Thump" confirma o selo de integridade no cofre.

### 8.2 Jornada de Intervenção Tática (Ricardo)

**Objetivo:** Agir sobre insights do Consultor Silencioso sem abrir o app.
- **Trigger:** Ricardo recebe uma **Notificação de Briefing**: "Eficiência Detectada: Aluguel (-R$ 200). Acelerar Meta: Viagem?"
- **Ação:** Clica no botão de ação **"SIM (EXECUTE)"** direto na notificação.
- **Mecânica:** O sistema realiza o remanejamento autônomo no **Orçamento Base Zero (ZBB)** e exibe o selo dourado de "+3 dias de vida salvos".

### 8.3 Jornada de Sobrevivência (Marcos)

**Objetivo:** Estabilizar a liquidez durante uma crise (ZBB Radical).
- **Trigger:** App detecta uma **Rota de Colisão**. A interface sofre o **Lockdown Tático** (Âmbar + Despida Visual).
- **Mecânica:** Marcos é levado ao **"The Chopping Block"**, onde o sistema apresenta gastos supérfluos com a pergunta: **"EJETAR?"**.
- **Redenção:** Após ejetar gastos, o **Survival Runway** sobe para níveis seguros; o sistema "respira" e volta ao cockpit normal.

### 8.4 Jornada de Auditoria de Soberania (Expert)

**Objetivo:** Validar a integridade absoluta dos ativos financeiros localmente.
- **Fluxo:** Processamento passivo de Checksums via Web Worker -> Exibição do "Selo de Integridade" -> Usuário clica para ver o relatório de "Assinaturas Locais" -> Exportação JSON com checksum de segurança incluído.

---

## 9. Component Strategy (Revisão Socrática)

### 9.1 Custom "Hero" Components

- **CommandPalette.vue (CMD+K):** A "Varinha do Maestro". Busca universal de latência zero e execução de comandos financeiros atômicos (ex: transferências). Implementa o padrão *Command Provider* desacoplado.
- **ForecastDisplay.vue (Living Forecast):** O "Instrumento de Tensão". Gráfico reativo com matemática processada em Web Workers. O passado é sólido; a projeção possui um "fôlego visual" (pulsação sutil) que traduz a volatilidade e urgência.
- **SmartEntry.vue:** "Integridade sem Atrito". Parser NLP local com reconhecimento visual de entidades durante a digitação. Protegido por uma máquina de estados robusta para evitar inconsistências.
- **DecisionCard.vue:** "Autoridade com Gravidade". Estética de vidro e metal escovado. Animação de pouso imponente e botões de ação integrados (Execute/Cancel) para governança imediata.
- **IntegritySeal.vue:** Selo de validação de checksums locais com brilho dourado sutil ao selar transações de eficiência.

---

## 10. UX Consistency Patterns (Revisão Socrática)

### 10.1 Hierarquia de Ação (Buttons & Commands)

- **Ação Soberana (Primary):** Botão sólido com fundo **Obsidian** e borda/texto **Muted Gold**. Reservado para "Executar" mudanças estratégicas no patrimônio.
- **Ação Tática (Secondary):** Botão "Ghost" com borda **Slate Gray**. Usado para navegação, filtros e consultas de dados.
- **Ação de Emergência (War Mode):** Botão com borda **Tactical Amber** e tipografia **JetBrains Mono**. Usado exclusivamente no "The Chopping Block".

### 10.2 Loops de Feedback (Sensory System)

- **Selo do Cofre (Sucesso):** Brilho (glow) dourado sutil no IntegritySeal sincronizado com feedback tátil "Thump" (10ms).
- **Luz de Navegação (Info/Warning):** Banners em **Deep Navy** com tipografia **Mono**. Fade-in mecânico (200ms) para evitar distrações.
- **Rota de Colisão (Alerta):** Mudança sistêmica de atmosfera para o tom **Âmbar**. O feedback é a transição cromática do Cockpit, indicando estado de alerta máximo.

### 10.3 Padrões de Entrada e Navegação

- **Shadow State NLP:** Exibição imediata da interpretação do sistema (em cinza) durante a digitação no Smart Entry.
- **Rigor Tabular:** Todos os valores monetários forçam alinhamento decimal à direita e utilizam **JetBrains Mono** para garantir que desvios de padrão sejam geometrizados visualmente.
- **Progressive Disclosure:** Detalhes técnicos e logs de integridade ficam sob o selo de soberania, mantendo a interface limpa para o dia a dia.

---

## 11. Responsive & Accessibility Strategy (Revisão Socrática)

### 11.1 Responsive Strategy (Híbrida)

- **Desktop Cockpit (1280px+):** Experiência de "Centro de Comando". Layout multi-coluna com Vaults persistentes, Command Palette em destaque e visualização densa de instrumentos.
- **Mobile Instrument:** Foco no **Smart Entry** e saldo imediato. Navegação inferior tática e uso de gestos para alternar entre o Cockpit e o Modo de Guerra.
- **Transição de Densidade:** O sistema mantém a densidade técnica em ambos, reduzindo o ruído visual no mobile para o mínimo vital.

### 11.2 Accessibility Strategy (WCAG AA+)

- **Contraste de Elite:** Paleta calibrada para legibilidade superior em ambientes de baixa luminosidade (cockpit).
- **Operação via Teclado:** Foco total em Power Users (CMD+K, Tab, Enter) para navegação e comandos sem mouse.
- **Semântica de Dados:** Uso de atributos ARIA (`aria-live`, `aria-labelledby`) para descrever mudanças dinâmicas no Forecast e no Selo de Integridade.

### 11.3 Testing & Implementation

- **Simulação de Crise:** Testes obrigatórios de UI em "Modo Avião" para validar a resiliência do PWA e o feedback de sincronização.
- **Haptics:** Implementação do feedback "Thump" via `navigator.vibrate` com fallback visual silencioso para desktop.

---
