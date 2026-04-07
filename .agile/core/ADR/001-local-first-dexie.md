# ADR 001: Adoção do Local-First com Dexie.js
**Data:** (T=0)
**Status:** Aceito
**Contexto:**
Para entregar a promessa de "paz de espírito", velocidade e privacidade ("The Core Truth" e "The North Star"), o aplicativo precisa responder instantaneamente às interações do usuário, mesmo em condições de rede instáveis.

**A Decisão:**
Adotar uma arquitetura **Local-First** utilizando o **Dexie.js** (um wrapper minimalista sobre o IndexedDB) como o banco de dados principal de leitura e escrita da aplicação.

**Consequências Positivas:**
- Latência sub-100ms nas interações principais (visualização do dashboard, inserção de transações).
- Funcionamento 100% offline nativo.
- Maior controle do usuário sobre seus dados antes de qualquer sincronização com nuvem (Supabase).
- Arquitetura reativa mais limpa acoplando o Dexie (liveQuery) com as Stores (Pinia).

**Consequências Negativas/Desafios:**
- Necessidade futura de um robusto e complexo "Sync Engine" para garantir a sincronização bidirecional e resolução de conflitos com o backend (Supabase) – *ver Epic 2*.
- Limitações de armazenamento do browser (IndexedDB pode sofrer evictions pelas políticas dos navegadores se não gerenciado).

**Alternativas Consideradas (e Rejeitadas):**
- *Backend-First Puro (Apenas Supabase via REST/GraphQL):* Inviável pela necessidade de requisições de rede para cada ação, ferindo The North Star da latência imediata e uso offline.
- *Local Storage Simples:* Sem capacidade de queries complexas ou armazenamento robusto de relacionamentos estruturados (ex: Transações -> Categorias).
