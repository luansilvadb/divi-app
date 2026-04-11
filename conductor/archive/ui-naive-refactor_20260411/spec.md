# Specification: UI Refactor to Naive UI (LobeHub Style)

## Overview
Esta track consiste em uma refatoração completa da interface do usuário do aplicativo **divi**, migrando da implementação atual baseada em **PrimeVue** para o **Naive UI**. O objetivo é alcançar uma estética moderna e "AI-native", similar ao **LobeHub UI**, aproveitando o sistema de design refinado e a alta customização do Naive UI, mantendo a arquitetura atual de SPA com Vue 3 e Vite.

## Requisitos Funcionais
- **Substituição de Biblioteca de UI:** Substituir completamente o PrimeVue por componentes do **Naive UI** em todos os módulos (Dashboard, Transações, Orçamentos, etc.).
- **Mapeamento de Componentes:** Mapear todos os componentes PrimeVue existentes (Botões, Inputs, Modais, Cards, Tabelas, etc.) para seus equivalentes no Naive UI (`n-button`, `n-input`, `n-modal`, `n-card`, `n-data-table`, etc.).
- **Configuração de Tema (Lobe Style):** Configurar o Naive UI com um tema customizado que replique a modernidade do LobeHub, incluindo suporte avançado a **Dark Mode**, **Glassmorphism**, e tipografia moderna.
- **Integração Tailwind:** Garantir que os componentes do Naive UI funcionem perfeitamente ao lado da configuração existente de **Tailwind CSS (v4)**.

## Requisitos Não Funcionais
- **Estética Refinada:** Foco em visuais premium, transições suaves e um "look and feel" de alta qualidade.
- **Desempenho:** Manter a performance da aplicação e otimizar o carregamento dos componentes.
- **Type Safety:** Garantir que todos os novos componentes de UI estejam devidamente tipados com TypeScript.

## Critérios de Aceite
- [ ] PrimeVue removido completamente do `package.json` e do código-fonte.
- [ ] Naive UI instalado e configurado no `main.ts` (incluindo `NConfigProvider`, `NMessageProvider`, etc.).
- [ ] Todas as páginas e módulos refatorados utilizando componentes Naive UI.
- [ ] Aplicação totalmente funcional, com todas as features (Auth, CRUD, Relatórios) operando como antes.
- [ ] UI atinge o visual moderno e "premium" desejado (estilo LobeHub).
- [ ] Build do projeto finalizado sem erros.

## Fora de Escopo
- Migração para React ou framework Nuxt 3.
- Mudanças na lógica de backend ou integração com Supabase.
