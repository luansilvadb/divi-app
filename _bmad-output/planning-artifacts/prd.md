---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-02b-vision', 'step-02c-executive-summary', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish', 'step-12-complete']
inputDocuments: ['_bmad-output/planning-artifacts/product-brief-divi-app.md', '_bmad-output/planning-artifacts/product-brief-divi-app-distillate.md', '_bmad-output/project-context.md']
workflowType: 'prd'
documentCounts: {
  briefCount: 2,
  researchCount: 0,
  brainstormingCount: 0,
  projectDocsCount: 1
}
classification:
  projectType: 'Web App / PWA'
  domain: 'Fintech'
  complexity: 'High'
  projectContext: 'brownfield'
---

# Product Requirements Document - divi-app

**Author:** Luan
**Date:** 2026-04-12

## Executive Summary

O **divi-app** é uma plataforma de **Soberania Econômica Individual** Local-First, projetada para eliminar a ansiedade financeira através de **Inteligência Preditiva Local** e precisão matemática inquestionável. Ao contrário das soluções tradicionais em nuvem, o divi-app garante que cada centavo e cada previsão de fluxo de caixa permaneçam sob controle exclusivo do usuário, operando com **Privacidade Radical (E2EE)** e funcionamento total offline. O produto transforma a gestão de finanças de um registro passivo em uma ferramenta de navegação estratégica, permitindo que os usuários visualizem seu futuro financeiro com clareza absoluta, sem comprometer seus dados pessoais.

### O Diferencial (What Makes This Special)

O diferencial competitivo reside na união entre **Verdade Financeira (BigInt/Minor Units)** e **Performance AAA**. Através de uma arquitetura baseada em **Dexie** e **RxJS**, o divi-app processa cálculos complexos de forecasting e agregações massivas inteiramente no cliente, garantindo feedback instantâneo e segurança inviolável. É a primeira solução a oferecer o poder de processamento de uma IA financeira com a intimidade e resiliência de um caderno físico, definindo um novo padrão de confiança para o mercado Fintech em 2026.

## Project Classification

- **Project Type:** Web App / PWA (Progressive Web App)
- **Domain:** Fintech
- **Complexity:** High (E2EE, Offline Sync, Financial Precision)
- **Project Context:** Brownfield (Baseada em Clean Architecture e Dexie)

## Success Criteria

### Sucesso do Usuário
- **Alívio Instantâneo:** Registro de transação concluído em < 3s (da intenção à confirmação).
- **Forecast Approval Rate:** > 85% de confirmação de acurácia nas previsões de saldo pelos usuários.
- **Paz de Espírito:** Redução autodeclarada da ansiedade financeira após 30 dias de uso contínuo.

### Sucesso de Negócio
- **Métrica Norte (North Star):** *Confirmed Forecast Accuracy* (Ratio de Previsibilidade Confirmada).
- **Conversão Sync Pro:** > 5% de conversão para o plano pago nos primeiros 6 meses.
- **Retenção D30:** > 40% de usuários ativos retornando após o primeiro mês.

### Sucesso Técnico
- **TTI Offline:** < 800ms via cache agressivo de assets (PWA).
- **Reconciliation Parity:** Zero discrepância de checksum entre base local (Dexie) e remota (Supabase).
- **Integridade Atômica:** 100% de resiliência a falhas de hardware durante operações de escrita.

## User Journeys

### 1. Clara: Resiliência em Movimento (Offline / Happy Path)
**Contexto:** Clara registra um gasto em Berlim sem sinal de internet.
- **Experiência:** O app abre instantaneamente e confirma o registro com um "Thump" visual tátil. A conversão de moeda e categoria ocorre offline via heurísticas locais.
- **Valor:** Alívio emocional de saber que o dado está seguro "no cofre" local sem depender da nuvem.

### 2. Ricardo: Harmonia em Conflito (Sincronização / Multi-dispositivo)
**Contexto:** Edições simultâneas offline no celular e tablet.
- **Experiência:** O sistema resolve o conflito via LWW (Last Write Wins) e apresenta uma "Escolha Narrativa" amigável caso a intervenção humana seja necessária.
- **Valor:** Confiança na integridade do saldo mesmo em uso compartilhado ou multi-dispositivo.

### 3. Marcos: O Ritual da Soberania (Privacidade / Exportação)
**Contexto:** Marcos audita seu patrimônio mensalmente e exige controle total.
- **Experiência:** Gera uma exportação JSON/CSV protegida por Checksum de Integridade e solicita a limpeza total dos dados remotos no Supabase.
- **Valor:** Sentimento real de posse dos dados e exercício da soberania digital.

### 4. Júlia: O Aperto de Mão (Recuperação / Onboarding)
**Contexto:** Júlia troca de dispositivo e precisa recuperar seu histórico financeiro.
- **Experiência:** Um fluxo transparente reconstrói o banco Dexie a partir do Supabase em segundos, validando o valor do *Sync Pro*.
- **Valor:** Continuidade e segurança de que os dados são indestrutíveis, mesmo sem o dispositivo original.

## Project Scoping & Phased Development

### Fase 1: MVP (Experience MVP)
Foco em velocidade, precisão e estabilidade de sincronização inicial para ganhar a confiança do usuário.
- **Core:** Transações, Carteiras e Categorias em BigInt (centavos).
- **Sync:** Sincronização via Supabase RLS (texto claro isolado por usuário).
- **Smart Entry:** Entrada manual ultra-rápida (< 3s) com preenchimento preditivo.
- **Budget Lite+:** Orçamentos estáticos com alertas de consumo preventivos.
- **PWA:** Funcionamento 100% offline com `Prompt-to-Update`.

### Fase 2: Growth (Privacidade Radical)
- **E2EE Total:** Criptografia de ponta a ponta (servidor "cego" aos dados).
- **Importação CSV:** Motor de mapeamento inteligente para facilitar migrações.
- **Auditoria Avançada:** Relatórios com Checksum e trilha de reconciliação para auditoria.

### Fase 3: Expansion (Estrela do Norte)
- **Family Sharing E2EE:** Gestão colaborativa familiar com privacidade inviolável.
- **IA Local (WebGPU):** Forecasting profundo e categorização neural rodando 100% no browser.

## Domain & Platform Requirements

### Requisitos de Domínio Fintech
- **Serialização de BigInt:** Valores monetários devem ser transportados como `string` no JSON para evitar perda de precisão decimal.
- **Protocolo Hard Delete:** Implementação de exclusão definitiva via LGPD com anonimização de registros residuais (`deleted_user_hash`).
- **Persistent Storage:** Uso obrigatório da API `navigator.storage.persist()` para garantir a custódia dos dados locais.

### Requisitos Técnicos PWA
- **Coordenação Multi-aba:** Uso de `BroadcastChannel` para manter o estado reativo sincronizado entre todas as abas abertas.
- **Degradação Graciosa:** Fallback automático de modelos de IA para heurísticas leves em hardware limitado ou bateria baixa.
- **SEO Guard:** Bloqueio de indexação (`noindex`) em todas as rotas privadas do app.

## Functional Requirements

### Gestão Financeira
- **FR1:** O usuário pode registrar receitas, despesas e transferências entre carteiras.
- **FR2:** O sistema deve processar todos os valores monetários em "Minor Units" (BigInt).
- **FR3:** O usuário pode gerenciar múltiplas carteiras e categorias personalizadas.

### Inteligência Local
- **FR4:** O sistema deve oferecer sugestões preditivas na entrada manual baseadas em **Recência e Frequência**.
- **FR5:** O usuário pode definir orçamentos mensais e metas de economia vinculadas a saldos reais.
- **FR6:** O sistema deve projetar o saldo futuro (Forecasting) com base em recorrências e orçamentos.

### Sincronização e Soberania
- **FR7:** O sistema deve permitir operação total (leitura/escrita) em modo offline.
- **FR8:** O sistema deve sincronizar dados via Supabase RLS com resolução de conflitos determinística.
- **FR9:** O usuário pode exportar dados com Checksum e excluir permanentemente sua conta.

## Non-Functional Requirements

- **NFR1 (Performance):** TTI Offline < 800ms e latência de persistência visual < 100ms.
- **NFR2 (Segurança):** 100% de cobertura RLS e chaves de criptografia geridas no cliente (roadmap).
- **NFR3 (Escalabilidade):** Suporte a até 50.000 transações locais sem degradação de performance.
- **NFR4 (Acessibilidade):** WCAG 2.1 Level AAA (Contraste 7:1) e navegação 100% via teclado.
- **NFR5 (Reliability):** Transações atômicas no Dexie para garantir integridade contra falhas de hardware.
