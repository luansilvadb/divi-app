# ADR-001: Arquitetura Local-First com Module-Based Clean Architecture

## Contexto
O projeto **divi** tem a meta de ser uma aplicação de finanças rápida, segura e amigável, orientada fortemente à privacidade. Inicialmente, o controle financeiro deve ser possível sem dependência absoluta da rede, contudo a escalabilidade futura exigirá sincronismo multi-dispositivo.

## Alternativas Consideradas
1. **Monolito com Vuex/Pinia + LocalStorage:** Fácil implementação, mas difíceis de escalar e com sérios gargalos de performance caso as transações ultrapassem a casa dos milhares.
2. **Backend as a Service (BaaS) Direto (Supabase Exclusivo):** Fácil para sync, mas prejudica a usabilidade offline e velocidade percebida (latência de rede a cada operação).
3. **Offline-first Sync + Module-Based Clean Architecture:** Uso de IndexedDB como Source of Truth local, abstraído através de Repositórios e Serviços de Aplicação, deixando a camada de UI totalmente agnóstica ao banco de dados.

## Decisão
Optou-se pela **Alternativa 3**. Utilizaremos `Dexie.js` como engine do IndexedDB e definiremos o sistema utilizando a Module-Based Clean Architecture (UI, Application, Domain, Infrastructure).

## Efeito
- **Positivos:** Altíssima velocidade para o usuário final, total suporte off-line (PWA) garantido pelo Vite PWA, e uma clara separação de responsabilidades.
- **Negativos:** Overhead inicial de estruturação de contratos de repositório e injeção de dependência. O sincronismo futuro (Epic 9) com Supabase exigirá estratégias de CRDTs ou timestamp resolving.
