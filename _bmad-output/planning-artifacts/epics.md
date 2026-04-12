---
stepsCompleted: ['step-01-discovery', 'step-02-design-epics', 'step-03-create-stories']
inputDocuments:
  [
    '_bmad-output/planning-artifacts/prd.md',
    '_bmad-output/planning-artifacts/architecture.md',
    '_bmad-output/planning-artifacts/ux-design-specification.md',
    '_bmad-output/project-context.md',
  ]
---

# divi-app - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for divi-app, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: O usuário pode registrar receitas, despesas e transferências entre carteiras.
FR2: O sistema deve processar todos os valores monetários em "Minor Units" (BigInt).
FR3: O usuário pode gerenciar múltiplas carteiras e categorias personalizadas.
FR4: O sistema deve oferecer sugestões preditivas na entrada manual baseadas em Recência e Frequência.
FR5: O usuário pode definir orçamentos mensais e metas de economia vinculadas a saldos reais.
FR6: O sistema deve projetar o saldo futuro (Forecasting) com base em recorrências e orçamentos.
FR7: O sistema deve permitir operação total (leitura/escrita) em modo offline.
FR8: O sistema deve sincronizar dados via Supabase RLS com resolução de conflitos determinística.
FR9: O usuário pode exportar dados com Checksum e excluir permanentemente sua conta.

### NonFunctional Requirements

NFR1: Performance - TTI Offline < 800ms e latência de persistência visual < 100ms.
NFR2: Segurança - 100% de cobertura RLS e chaves de criptografia geridas no cliente (roadmap).
NFR3: Escalabilidade - Suporte a até 50.000 transações locais sem degradação de performance.
NFR4: Acessibilidade - WCAG 2.1 Level AAA (Contraste 7:1) e navegação 100% via teclado.
NFR5: Reliability - Transações atômicas no Dexie para garantir integridade contra falhas de hardware.

### Additional Requirements

- **Starter Template:** Official Vue Starter (create-vue) com Vite 7 e Vitest.
- **Project Structure:** Feature-Sliced Design (FSD) em `src/modules`.
- **Data Layer:** Dexie.js (IndexedDB) com tipos `BIGINT` nativos.
- **Security:** E2EE via Web Crypto API (AES-GCM 256) e PBKDF2 para derivação de chaves no cliente.
- **Sync Protocol:** Last-Write-Wins (LWW) com OpLog e Relógios Lógicos (Lamport).
- **Concurrency:** Dedicated Web Workers para isolar cálculos financeiros (Forecast) da UI Thread.
- **Styles:** Integração UnoCSS para layout estrutural e componentes brutalistas.
- **Money Handling:** Serialização de BigInt para String em payloads JSON/Sync.

### UX Design Requirements

UX-DR1: Theming System (Elite Financial Cockpit) - Tema customizado Naive UI com base Obsidian Black (#020617) e Deep Navy (#0A192F). Grid rígido de 4px.
UX-DR2: Typography Implementation - Inter (Semi-bold) para rótulos/contexto e JetBrains Mono para todos os dados financeiros e tabelas.
UX-DR3: CommandPalette Component (CMD+K) - Busca universal e execução de comandos financeiros atômicos (Padrão Command Provider).
UX-DR4: ForecastDisplay Component (Living Forecast) - Gráfico reativo via Web Workers com pulsação visual sutil para dados projetados.
UX-DR5: SmartEntry Component - Parser NLP local com sombra de estado (shadow state) para reconhecimento de entidades em tempo real.
UX-DR6: IntegritySeal Component - Feedback visual de validação de checksum local com brilho dourado (Muted Gold).
UX-DR7: Sensory Feedback (Haptics) - Vibração "Thump" de 10ms (navigator.vibrate) sincronizada com o IntegritySeal.
UX-DR8: War Mode (ZBB Radical) Transition - Troca sistêmica para Tactical Amber (#F59E0B), remoção de adornos (Tatictal Strip) e exibição do "Survival Runway".
UX-DR9: Notification Briefings - Notificações PWA ricas com botões de ação de 1 clique (ex: "SIM (EXECUTE)").
UX-DR10: Accessibility AAA - Contraste 7:1 e navegação completa via teclado (CMD+K, Tab, Enter).

### FR Coverage Map

FR1 (Registrar): Epic 2 (Base) e Epic 3 (Smart Entry)
FR2 (BigInt): Epic 2
FR3 (Carteiras/Categorias): Epic 2
FR4 (Preditivo NLP): Epic 3
FR5 (Orçamentos/Metas): Epic 4
FR6 (Forecasting): Epic 4
FR7 (Offline Total): Epic 1
FR8 (Sincronização Supabase): Epic 1
FR9 (Exportação/Checkum/Delete): Epic 1 (Delete) e Epic 5 (Export/Integrity)

## Epic List

### Epic 1: Fundação Soberana e Sincronização Local-First

Estabelecer o "Cofre" local e a infraestrutura de segurança distribuída. O usuário terá controle total sobre seus dados cifrados via E2EE e funcionamento total offline.
**FRs covered:** FR7, FR8, FR9, NFR2, NFR5.

### Epic 2: Ledger de Precisão (Gestão de Ativos)

Implementar o motor financeiro central baseado em BigInt. O usuário poderá gerenciar múltiplas carteiras e categorias com integridade absoluta de saldo.
**FRs covered:** FR1, FR2, FR3.

### Epic 3: Smart Entry e Experiência de Cockpit

Otimizar a governança diária com o motor NLP (Smart Entry) e UI de alta performance. O usuário poderá registrar dados em segundos com feedback tátil premium.
**FRs covered:** FR1, FR4, NFR1.

### Epic 4: Inteligência Preditiva e Forecast Reativo

Visualizar o futuro financeiro através do motor de Forecasting e Orçamentos. O usuário poderá ver sua data de conquista de metas aproximar-se em tempo real.
**FRs covered:** FR5, FR6, NFR3.

### Epic 5: Modo de Guerra e Soberania de Dados

Gerenciar crises financeiras (ZBB Radical) e auditoria de integridade. O usuário poderá sobreviver ao inesperado e exportar seu patrimônio com prova matemática.
**FRs covered:** FR9, NFR4.

---

## Epic 1: Fundação Soberana e Sincronização Local-First

Estabelecer o "Cofre" local e a infraestrutura de segurança distribuída. O usuário terá controle total sobre seus dados cifrados via E2EE e funcionamento total offline.

### Story 1.1: Inicialização do Projeto e Design System "Elite Cockpit"

As a usuário,
I want um app que carregue instantaneamente e transmita segurança,
So that eu me sinta o "Almirante" da minha frota financeira através de uma interface profissional e austera.

**Acceptance Criteria:**

**Given** um novo repositório Vue 3 com Vite 7
**When** o projeto é inicializado com NaiveUI e UnoCSS
**Then** a paleta de cores "Obsidian Black" (#020617) e "Deep Navy" (#0A192F) deve ser aplicada globalmente
**And** a tipografia deve usar Inter para UI e JetBrains Mono para todos os dados financeiros
**And** o grid rígido de 4px deve ser respeitado em todos os componentes base.

### Story 1.2: Infraestrutura de Dados Local (Dexie.js Vault)

As a usuário,
I want que meus dados sejam salvos localmente com segurança atômica,
So that eu tenha a certeza de que nenhuma transação será perdida, mesmo em quedas de energia ou falhas de hardware.

**Acceptance Criteria:**

**Given** o ambiente de desenvolvimento inicializado
**When** o Dexie.js é configurado com esquemas de tabela para carteiras e transações
**Then** os campos monetários devem ser definidos como BIGINT nativos
**And** cada operação de escrita deve ser wrapped em uma transação ACID do IndexedDB
**And** o sistema deve detectar e persistir dados usando a API `navigator.storage.persist()`.

### Story 1.3: Sistema de Criptografia E2EE (Soberania de Dados)

As a Almirante Financeiro,
I want que meus dados financeiros sejam cifrados no meu dispositivo,
So that nem o servidor de sincronização nem terceiros possam ler meu patrimônio pessoal.

**Acceptance Criteria:**

**Given** uma sessão de usuário autenticada
**When** uma transação é salva no Dexie.js
**Then** o payload deve ser cifrado via AES-GCM 256-bit antes da persistência remota
**And** a chave de criptografia deve ser derivada via PBKDF2 exclusivamente no cliente
**And** o servidor de sincronização deve receber apenas dados opacos (CipherText).

### Story 1.4: Sincronização Distribuída com Supabase RLS

As a usuário multi-dispositivo,
I want meus dados sincronizados sem risco de perda por conflitos,
So that eu possa registrar gastos no celular e auditá-los no desktop com integridade.

**Acceptance Criteria:**

**Given** dados alterados localmente em modo offline
**When** a conectividade é reestabelecida
**Then** o Sync Engine deve enviar as atualizações via protocolo LWW (Last-Write-Wins)
**And** conflitos de dados devem ser resolvidos deterministicamente usando OpLogs e Lamport Clocks
**And** o Supabase RLS deve garantir que apenas o proprietário da chave acesse os dados criptografados.

### Story 1.5: Manifesto PWA e Resiliência "Offline-First"

As a usuário móvel,
I want instalar o app e ter a certeza de que ele funciona sem rede,
So that eu nunca seja impedido de registrar um gasto por falta de sinal.

**Acceptance Criteria:**

**Given** o ambiente de produção
**When** o usuário acessa o app via browser moderno
**Then** o manifesto PWA deve permitir a instalação no dispositivo
**And** o Service Worker deve cachear todos os assets críticos para TTI < 800ms offline
**And** o sistema deve exibir um "Prompt-to-Update" amigável quando uma nova versão técnica estiver disponível.

### Story 1.6: Soberania e Privacidade (Account Purge)

As a usuário preocupado com privacidade,
I want poder excluir permanentemente minha conta e todos os meus dados,
So that eu tenha a garantia de que nenhuma informação minha permanecerá no sistema após minha saída.

**Acceptance Criteria:**

**Given** o usuário autenticado na área de configurações
**When** o usuário confirma a exclusão permanente da conta
**Then** o sistema deve realizar o "Purge" completo do IndexedDB local (Dexie.delete)
**And** deve invocar a deleção remota de todos os registros vinculados ao user_id no Supabase
**And** o sistema deve redirecionar para a tela inicial limpando todos os estados de memória.

---

## Epic 2: Ledger de Precisão (Gestão de Ativos)

Implementar o motor financeiro central baseado em BigInt. O usuário poderá gerenciar múltiplas carteiras e categorias com integridade absoluta de saldo.

### Story 2.1: Modelagem e Governança de Carteiras (Vaults)

As a Almirante Financeiro,
I want gerenciar diferentes carteiras (Ex: Corrente, Investimento, Dinheiro),
So that eu possa organizar meu patrimônio de forma clara e isolada.

**Acceptance Criteria:**

**Given** o módulo Ledger inicializado
**When** o usuário cria uma nova carteira com nome, tipo e saldo inicial
**Then** o sistema deve persistir a carteira no Dexie.js
**And** o saldo inicial deve ser convertido e armazenado como BigInt
**And** a interface deve listar todas as carteiras com o somatório total do patrimônio.

### Story 2.2: Sistema de Categorização Customizável

As a usuário analítico,
I want classificar meus ganhos e gastos em categorias e subcategorias,
So that eu entenda exatamente de onde vem e para onde vai meu dinheiro.

**Acceptance Criteria:**

**Given** a existência de categorias padrão (Alimentação, Transporte, Lazer)
**When** o usuário cria, edita ou exclui uma categoria ou subcategoria personalizada
**Then** o sistema deve refletir as mudanças instantaneamente no banco local
**And** cada categoria deve permitir a seleção de uma cor tática e um ícone para identificação visual rápida.

### Story 2.3: Registro de Transações Financeiras (Receitas/Despesas)

As a usuário preocupado com precisão,
I want registrar meus movimentos financeiros com a segurança de que o valor será exato,
So that eu não sofra com erros de arredondamento IEEE 754 em meu balanço.

**Acceptance Criteria:**

**Given** pelo menos uma carteira e uma categoria cadastradas
**When** o usuário registra uma receita ou despesa com valor, data e categoria
**Then** o sistema deve realizar o cálculo matemático usando BigInt (Minor Units)
**And** o campo monetário deve aceitar entrada decimal amigável (ex: 15.50) e converter para inteiro interno (ex: 1550)
**And** o registro deve ser vinculado à carteira selecionada, atualizando o saldo disponível.

### Story 2.4: Transferências Entre Carteiras (Movimentação Tática)

As a gestor do próprio capital,
I want mover saldos entre minhas carteiras sem afetar o balanço total de receitas/despesas,
So that eu possa gerenciar saques e depósitos internos sem mascarar meu fluxo de caixa.

**Acceptance Criteria:**

**Given** duas carteiras com saldos existentes
**When** o usuário solicita uma transferência de valor X da Carteira A para a Carteira B
**Then** o sistema deve executar uma transação atômica única no banco de dados local
**And** a Carteira A deve ser debitada e a Carteira B creditada simultaneamente
**And** a transação deve ser classificada como "Transferência" para exclusão de relatórios de Profit and Loss.

---

## Epic 3: Smart Entry e Experiência de Cockpit

Otimizar a governança diária com o motor NLP (Smart Entry) e UI de alta performance. O usuário poderá registrar dados em segundos com feedback tátil premium.

### Story 3.1: Centro de Comando (Command Palette CMD+K)

As a Almirante Financeiro,
I want navegar pelo app e executar comandos sem tirar as mãos do teclado,
So that eu tenha agilidade tática na gestão do meu patrimônio e minimize a fricção de uso.

**Acceptance Criteria:**

**Given** o app carregado em qualquer tela
**When** o usuário pressiona o atalho global CMD+K (ou CTRL+K)
**Then** o componente `CommandPalette` deve ser exibido com foco imediato no campo de busca
**And** o sistema deve listar comandos rápidos (Ex: "Nova Despesa", "Adicionar Carteira", "Mudar Tema")
**And** a navegação entre os resultados deve ser 100% via teclado (setas e Enter).

### Story 3.2: Smart Entry com Sugestões Preditivas (NLP Shadow State)

As a usuário em movimento,
I want digitar uma frase simples para registrar um gasto,
So that eu gaste menos de 3 segundos no registro e o sistema identifique os campos automaticamente.

**Acceptance Criteria:**

**Given** o formulário de `SmartEntry` aberto
**When** o usuário digita uma string natural (Ex: "45 mercado bradesco")
**Then** o parser de NLP local deve decompor o valor (45.00), a categoria (Mercado) e a carteira (Bradesco) em tempo real
**And** o sistema deve exibir uma "sombra de estado" (shadow state) sugerindo os campos reconhecidos antes da confirmação
**And** as sugestões automáticas devem priorizar combinações baseadas em Recência e Frequência (Ex: ao digitar "mer", sugerir "Mercado" se for o gasto mais frequente).

### Story 3.3: Experiência Tátil e Feedback de Sucesso (Haptics)

As a usuário,
I want sentir uma confirmação física quando uma transação for processada com sucesso,
So that eu tenha uma percepção multissensorial de segurança e integridade no registro.

**Acceptance Criteria:**

**Given** o registro de uma nova transação
**When** a transação é persistida com sucesso no Dexie.js
**Then** o sistema deve disparar uma vibração do tipo "Thump" de 10ms via `navigator.vibrate`
**And** o selo de integridade (`IntegritySeal`) deve brilhar momentaneamente em Muted Gold (#B45309) na tela
**And** a animação de sucesso deve ser suave e não exceder a latência visual de 100ms.

---

## Epic 4: Inteligência Preditiva e Forecast Reativo

Visualizar o futuro financeiro através do motor de Forecasting e Orçamentos. O usuário poderá ver sua data de conquista de metas aproximar-se em tempo real.

### Story 4.1: Planejamento de Orçamentos Dinâmicos e Metas

As a estrategista financeiro,
I want definir orçamentos por categoria vinculados aos meus saldos reais,
So that eu possa controlar meus gastos no presente sem comprometer meus objetivos de longo prazo.

**Acceptance Criteria:**

**Given** o motor financeiro (Ledger) funcional
**When** o usuário define um orçamento mensal para uma categoria (Ex: "Lazer: R$ 500")
**Then** o sistema deve monitorar os gastos daquela categoria em tempo real
**And** o usuário deve poder vincular metas de economia a carteiras específicas
**And** o progresso da meta deve ser exibido visualmente através de uma barra de progresso tática.

### Story 4.2: Motor de Projeção em Segundo Plano (Background Worker)

As a usuário preocupado com fluidez,
I want que as projeções de saldo sejam calculadas em segundo plano,
So that a interface do app permaneça fluida e responsiva (60fps) enquanto o futuro é simulado.

**Acceptance Criteria:**

**Given** um histórico de transações e orçamentos ativos
**When** o sistema solicita o cálculo de projeção para os próximos 12 meses
**Then** a lógica deve ser executada em um Web Worker dedicado, isolada da UI Thread (concurrency)
**And** todos os cálculos no worker devem usar BigInt para garantir precisão
**And** o resultado deve ser devolvido via mensagem estruturada para o estado principal do app.

### Story 4.3: Painel de Visão de Futuro (Forecast Cockpit)

As a Almirante Financeiro,
I want navegar na linha do tempo do gráfico e visualizar a tendência do meu patrimônio,
So that eu identifique rotas de colisão financeira ou oportunidades de aceleração de metas.

**Acceptance Criteria:**

**Given** os dados de projeção processados pelo worker
**When** o componente `ForecastDisplay` é renderizado
**Then** deve apresentar um gráfico reativo (chart) com distinção clara entre dados reais (passado) e projetados (futuro)
**And** a linha de projeção deve exibir o efeito visual de pulsação suave ("fôlego") definido no UX spec
**And** o usuário deve poder interagir com a linha do tempo para ler os saldos projetados em datas específicas.

---

## Epic 5: Modo de Guerra e Soberania de Dados

Gerenciar crises financeiras (ZBB Radical) e auditoria de integridade. O usuário poderá sobreviver ao inesperado e exportar seu patrimônio com prova matemática.

### Story 5.1: Transição Sistêmica para Modo de Guerra (ZBB Radical)

As a Almirante Financeiro em crise,
I want que o app mude completamente sua interface visual e funcional,
So that eu foque exclusivamente no corte de gastos não essenciais (ZBB - Zero Based Budgeting).

**Acceptance Criteria:**

**Given** o sistema operando em modo normal
**When** o comando "Ativar Modo de Guerra" é executado via Command Palette
**Then** a interface deve trocar a cor de destaque para Tactical Amber (#F59E0B)
**And** o sistema deve aplicar o "Tactical Strip", removendo sombras, gradientes e adornos visuais distractivos
**And** a visualização de gastos deve ser filtrada para o "Chopping Block", destacando apenas despesas não essenciais para corte imediato.

### Story 5.2: Motor de Navegação de Sobrevivência (Survival Runway)

As a usuário preocupado com fôlego financeiro,
I want saber exatamente quantos dias meu dinheiro dura se minha renda cessar hoje,
So that eu tome decisões táticas de corte com base em fatos e não em medo.

**Acceptance Criteria:**

**Given** o Modo de Guerra ativo
**When** o sistema recalcula os saldos atuais contra a média de gastos essenciais
**Then** deve-se exibir em destaque o "Survival Runway" (Dias de Sobrevivência)
**And** o cálculo deve ignorar orçamentos de lazer e foco em categorias críticas (Aluguel, Comida, Luz)
**And** qualquer alteração (corte de gasto) deve refletir instantaneamente no incremento do Runway.

### Story 5.3: Exportação de Dados com Selo de Integridade (Sovereignty)

As a Almirante que preza pela custódia própria,
I want exportar meus dados financeiros com prova matemática de integridade,
So that eu possa auditar meu histórico e migrar meus dados se necessário sem depender do sistema.

**Acceptance Criteria:**

**Given** a solicitação de exportação de dados
**When** o sistema gera o arquivo de saída (JSON/CSV)
**Then** cada transação deve possuir um Hash SHA-256 único calculado localmente
**And** o sistema deve emitir um Checksum global de integridade verificado pelo `IntegritySeal`
**And** o usuário deve receber o arquivo para download local, garantindo a soberania física da informação.

### Story 5.4: Briefings e Alertas de Guerra (Rich PWA Push)

As a Almirante Financeiro,
I want receber briefings e alertas em tempo real através de notificações ricas,
So that eu possa tomar decisões sem precisar abrir o app (1-click action).

**Acceptance Criteria:**

**Given** o PWA instalado no dispositivo
**When** ocorre um evento crítico (Ex: Orçamento estourado ou Meta batida)
**Then** o sistema deve disparar uma notificação push com ícones customizados
**And** a notificação deve incluir botões de ação (Ex: "SIM (EXECUTE)", "IGNORAR")
**And** clicar em uma ação deve disparar o comando correspondente em background via Service Worker.
