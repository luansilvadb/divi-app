# Solicitação de Code Review: Refatoração PrimeVue

## Mudanças Realizadas:
- Migração dos Atoms (`BaseButton`, `BaseInput`, `BaseSelect`, `BaseBadge`, `BaseProgressBar`, `BaseSkeleton`, `BaseCard`, `BaseIconBox`) para PrimeVue v4.
- Implementação de Pass Through (PT) para manter estilos TailwindCSS.
- Refatoração do `BaseModal` utilizando `Dialog` do PrimeVue para melhor acessibilidade e gestão de foco.
- Atualização de `BaseConfirmModal`, `TransactionModal` e `TransactionFormContent` para conformidade com a nova base.
- Criação de `diagnostic_primevue.md` detalhando a estratégia técnica.

## Verificações:
- `pnpm run type-check`: Sucesso.
- `pnpm run test:unit`: 13 testes aprovados.
- Validação visual via screenshot: Confirmada.

## Pontos de Atenção:
- A regra de plataforma (`isMobile`) foi preservada nos componentes de overlay.
- Os contratos de props e eventos (`v-model`, `@click`, etc) foram mantidos para retrocompatibilidade.
