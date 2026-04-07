# TECHNICAL_SPEC_V1: Foundation & Core Dashboard

## 1. Visão Arquitetural (Module-Based Clean Architecture)
A arquitetura do **divi** será dividida estritamente em quatro camadas (Layers), organizadas horizontalmente por Módulos Funcionais:

1. **UI Layer:** Views (Vue Components), layouts e composables específicos da visão.
2. **Application Layer:** Pinia Stores e Application Services (orquestradores de casos de uso).
3. **Domain Layer:** Interfaces/Contracts (Ex: `IWalletRepository.ts`), Errors e Entities (Tipos/Modelos). O Domínio não conhece o mundo exterior.
4. **Infrastructure Layer:** Repositórios concretos (Dexie implementation), Supabase clients e integrações externas.

## 2. PWA Specification
O sistema deve usar o plugin `@vitejs/plugin-vue-pwa`.
- O service worker deve ser configurado via `workbox-window` ou gerado via estratégia de `injectManifest`/`generateSW`.
- Configuração deve garantir o caching dos assets estáticos e a página `index.html` para habilitar navegação offline pura.

## 3. Dexie.js Schema Specification
O banco de dados local-first garante que o app seja ultra-rápido, persistindo offline.

### `diviDB`
```typescript
import Dexie, { type Table } from 'dexie';

export class DiviDB extends Dexie {
  wallets!: Table<Wallet, number>;
  transactions!: Table<Transaction, number>;
  budgets!: Table<Budget, number>;
  goals!: Table<Goal, number>;

  constructor() {
    super('DiviLocalDatabase');
    this.version(1).stores({
      wallets: '++id, name, type',
      transactions: '++id, walletId, categoryId, date, type',
      budgets: '++id, categoryId',
      goals: '++id, name'
    });
  }
}
export const db = new DiviDB();
```

## 4. UI e Layout
A aplicação utilizará PrimeVue (`@primevue/core` + `@primeuix/themes`) em conjunto com Tailwind CSS para garantir responsividade e temática fluida (Dark/Light).
O Layout global, `MainLayout.vue` deverá injetar um `AppSidebar.vue` (Desktop) ou `AppMobileDrawer.vue` (Mobile - detectado via `useIsMobile()`).

## 5. Dashboard State
A tela de Dashboard irá unificar informações financeiras de `dashboardStore.ts`.
- `fetchTotalBalance()`: Agrega o saldo baseando-se no balanço de todas as wallets (que inicialmente poderão usar seed local).
- O carregamento das informações deve prover status de `loading`, `error` ou `idle`, renderizando `<BaseSkeleton>` durante o load.

## Limitações Iniciais
- Nesta versão não abordaremos a estrutura `di.ts` para injetar o Supabase como persistência remota, toda lógica baterá diretamente no repositório de Infrastructure `Dexie`.
